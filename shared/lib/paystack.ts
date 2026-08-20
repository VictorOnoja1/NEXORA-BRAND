// -----------------------------------------------------------------------
// Paystack payment integration — NOT YET CONNECTED.
//
// The blueprint specifies Paystack as the payment processor. This file
// structures how checkout should call Paystack once a public key is
// configured. It intentionally does NOT simulate a fake successful
// payment — if no key is present, the checkout UI shows a clear
// "payment not configured" state instead of pretending to charge the
// customer.
//
// To connect Paystack:
//   1. Get your Paystack public key from the Paystack dashboard.
//   2. Set VITE_PAYSTACK_PUBLIC_KEY in `.env` (see .env.example).
//   3. Add the Paystack inline script to index.html:
//        <script src="https://js.paystack.co/v2/inline.js"></script>
//   4. On the backend (e.g. a Supabase Edge Function), verify the
//      transaction reference server-side via Paystack's Verify Transaction
//      API before marking an order "paid" — never trust the client alone.
// -----------------------------------------------------------------------

export const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as
  | string
  | undefined;

export const isPaystackConfigured = Boolean(paystackPublicKey);

export interface PaystackChargeParams {
  email: string;
  amountKobo: number;
  reference: string;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}

/**
 * Opens the Paystack inline checkout. Requires the Paystack inline script
 * to be loaded (see index.html) and VITE_PAYSTACK_PUBLIC_KEY to be set.
 * Returns false if Paystack isn't configured/loaded so the caller can show
 * an appropriate message instead of failing silently.
 */
export function chargeWithPaystack(params: PaystackChargeParams): boolean {
  if (!isPaystackConfigured || !window.PaystackPop) return false;

  const handler = window.PaystackPop.setup({
    key: paystackPublicKey,
    email: params.email,
    amount: params.amountKobo,
    ref: params.reference,
    currency: "NGN",
    callback: (response: { reference: string }) => {
      params.onSuccess(response.reference);
    },
    onClose: params.onClose,
  });
  handler.openIframe();
  return true;
}

export function generateOrderReference() {
  return `NX-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}
