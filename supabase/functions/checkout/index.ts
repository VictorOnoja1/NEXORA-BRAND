// Supabase Edge Function: checkout
//
// The ONLY place an order is ever created. Runs server-side with the
// service_role key (never sent to the browser), so it's the trust boundary
// for two things the client must never be allowed to decide on its own:
//   1. Whether a Paystack payment actually succeeded (verified here against
//      Paystack's own API using PAYSTACK_SECRET_KEY -- a secret this
//      function reads from its own environment, never from the request).
//   2. Whether stock exists for what's being bought (delegated to the
//      create_order_with_items() Postgres function, which decrements stock
//      atomically so two simultaneous buyers can't both win the last unit).
//
// Deploy: supabase functions deploy checkout
// Secrets this function needs (set once, never in the repo):
//   supabase secrets set PAYSTACK_SECRET_KEY=sk_...
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically by
// the Supabase platform to every Edge Function -- do not set those manually.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

interface CheckoutItem {
  product_id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface CheckoutPayload {
  customer: {
    full_name: string;
    phone: string;
    email: string;
    address: string;
    state: string;
    city: string;
    delivery_note?: string;
  };
  items: CheckoutItem[];
  subtotal: number;
  deliveryFee: number;
  paymentReference?: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  let payload: CheckoutPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { customer, items, subtotal, deliveryFee, paymentReference } = payload ?? {};

  if (!customer?.email || !customer?.full_name || !customer?.phone || !customer?.address) {
    return json({ error: "Missing required customer information." }, 400);
  }
  if (!Array.isArray(items) || items.length === 0) {
    return json({ error: "Cart is empty." }, 400);
  }
  if (typeof subtotal !== "number" || typeof deliveryFee !== "number") {
    return json({ error: "Invalid order totals." }, 400);
  }

  const total = subtotal + deliveryFee;
  let status: "paid" | "pending" = "pending";

  // --- Step 1: verify payment server-side. The client's own claim that
  // Paystack succeeded is never trusted -- only Paystack's API is. ---
  if (paymentReference) {
    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY is not set for this Edge Function.");
      return json({ error: "Payment verification is not configured on the server." }, 500);
    }

    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(paymentReference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );

    if (!verifyRes.ok) {
      return json({ error: "Could not reach Paystack to verify this payment. Please try again." }, 502);
    }

    const verifyBody = await verifyRes.json();
    const tx = verifyBody?.data;
    const expectedKobo = Math.round(total * 100);

    const verified =
      verifyBody?.status === true &&
      tx?.status === "success" &&
      tx?.currency === "NGN" &&
      typeof tx?.amount === "number" &&
      tx.amount === expectedKobo;

    if (!verified) {
      return json(
        { error: "Payment could not be verified. If you were charged, please contact support before retrying." },
        402
      );
    }

    status = "paid";
  }

  // --- Step 2: write the order atomically (stock check + decrement + order
  // + order_items + payment row, all-or-nothing) via the Postgres function. ---
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase.rpc("create_order_with_items", {
    p_customer: customer,
    p_items: items,
    p_subtotal: subtotal,
    p_delivery_fee: deliveryFee,
    p_status: status,
    p_payment_reference: paymentReference ?? null,
  });

  if (error) {
    const msg = String(error.message ?? "");
    if (msg.includes("insufficient_stock")) {
      const productName = msg.split(":")[1] ?? "an item in your cart";
      return json(
        { error: `Sorry, "${productName}" no longer has enough stock for this order. Please update your cart.` },
        409
      );
    }
    console.error("create_order_with_items failed:", error);
    return json({ error: "Could not create your order. Please try again." }, 500);
  }

  return json({ order: data }, 201);
});
