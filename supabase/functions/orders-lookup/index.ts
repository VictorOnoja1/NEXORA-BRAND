// Supabase Edge Function: orders-lookup
//
// Orders/order_items have no public SELECT policy on purpose (see
// schema_additions.sql) -- a blanket "read your own orders" policy isn't
// possible because this storefront has no real customer accounts, only
// guest checkout. Instead, a customer can look up their own orders only by
// providing information that came from their own order confirmation
// (order number) or that they typed themselves (their checkout email) --
// this function is the one narrow, service-role-mediated door for that,
// matching (not expanding) what the app's Account/OrderConfirmation pages
// already did against local data before Supabase was connected.
//
// Deploy: supabase functions deploy orders-lookup
// No extra secrets needed beyond the platform-provided SUPABASE_URL /
// SUPABASE_SERVICE_ROLE_KEY.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

const ORDER_FIELDS =
  "id, order_number, status, subtotal, delivery_fee, total, created_at, " +
  "customer_full_name, customer_phone, customer_email, customer_address, customer_state, customer_city, customer_delivery_note, " +
  "order_items(product_id, name, image, price, quantity)";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "GET") return json({ error: "Method not allowed" }, 405);

  const url = new URL(req.url);
  const email = url.searchParams.get("email")?.trim().toLowerCase();
  const orderNumber = url.searchParams.get("orderNumber")?.trim();

  if (!email) return json({ error: "An email address is required." }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  if (orderNumber) {
    // Both must match -- this is what keeps a guessed order number alone
    // from returning someone else's order.
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("order_number", orderNumber)
      .ilike("customer_email", email)
      .maybeSingle();

    if (error) return json({ error: "Lookup failed. Please try again." }, 500);
    if (!data) return json({ error: "No matching order found." }, 404);
    return json({ order: data });
  }

  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_FIELDS)
    .ilike("customer_email", email)
    .order("created_at", { ascending: false });

  if (error) return json({ error: "Lookup failed. Please try again." }, 500);
  return json({ orders: data ?? [] });
});
