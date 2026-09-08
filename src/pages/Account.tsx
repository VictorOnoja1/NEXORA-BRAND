import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle2, Package, MessageCircle, AlertTriangle } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { formatNaira } from "../lib/format";
import { Button } from "../components/ui/Button";
import { whatsappLink } from "../lib/config";
import { isSupabaseConfigured } from "../lib/supabase";
import { lookupOrdersByEmail } from "../lib/api";
import type { Order } from "../types";

// -----------------------------------------------------------------------
// Account / auth is not yet connected — customer sign-in still isn't part
// of this app, only guest checkout. What this page CAN do for real, once
// Supabase is configured, is look up a customer's own orders by the email
// they checked out with — via the orders-lookup Edge Function, which is
// the only door into the `orders` table for a browser client (see
// supabase/functions/orders-lookup). Without Supabase configured, this
// falls back to the original demo behavior: local, on-this-device order
// history only.
// -----------------------------------------------------------------------

export default function Account() {
  const localOrders = useOrderStore((s) => s.orders);
  const [lookupEmail, setLookupEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remoteOrders, setRemoteOrders] = useState<Order[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setError("");

    if (!isSupabaseConfigured) return;

    setLoading(true);
    try {
      const orders = await lookupOrdersByEmail(lookupEmail.trim());
      setRemoteOrders(orders);
    } catch {
      setError("Could not look up your orders right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const matchingOrders = !submitted
    ? []
    : isSupabaseConfigured
      ? remoteOrders
      : localOrders.filter((o) => o.customer.email.toLowerCase() === lookupEmail.trim().toLowerCase());

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-10 md:py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-blush/50 flex items-center justify-center mx-auto mb-4">
          <UserCircle2 size={26} className="text-black" />
        </div>
        <h1 className="font-serif text-3xl text-chocolate mb-2">My Account</h1>
        <p className="text-sm text-black font-sans max-w-sm mx-auto">
          Customer accounts with sign-in aren't connected yet. In the meantime, look up your recent
          orders by the email you checked out with.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto mb-10">
        <input
          type="email"
          required
          value={lookupEmail}
          onChange={(e) => setLookupEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
        />
        <Button type="submit" disabled={loading}>{loading ? "Searching…" : "Find Orders"}</Button>
      </form>

      {error && (
        <div className="flex items-start gap-2 bg-rose/10 border border-rose/40 text-black text-sm font-sans rounded px-3 py-2.5 mb-6 max-w-sm mx-auto">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-black" />
          <span>{error}</span>
        </div>
      )}

      {submitted && !loading && !error && (
        <div>
          {matchingOrders.length === 0 ? (
            <div className="text-center py-10">
              <Package size={24} className="text-black mx-auto mb-3" />
              <p className="text-sm text-black font-sans">
                {isSupabaseConfigured
                  ? "No orders found for that email."
                  : "No orders found for that email on this device."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-plum-100 border-t border-b border-plum-100">
              {matchingOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/order-confirmation/${o.orderNumber}`}
                  state={{ order: o, email: o.customer.email }}
                  className="flex items-center justify-between py-4 hover:bg-blush/20 transition-colors px-2"
                >
                  <div>
                    <p className="text-sm font-medium text-chocolate">{o.orderNumber}</p>
                    <p className="text-xs text-black">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chocolate">{formatNaira(o.total)}</p>
                    <span className="text-[10px] uppercase tracking-wide text-black">{o.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-12 text-center">
        <a href={whatsappLink("Hi NEXORA, I need help with my account or an order.")} target="_blank" rel="noreferrer">
          <Button variant="outline" icon={<MessageCircle size={15} />}>
            Need help? Chat on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
