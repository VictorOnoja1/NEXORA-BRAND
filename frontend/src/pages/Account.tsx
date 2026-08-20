import { useState } from "react";
import { Link } from "react-router-dom";
import { UserCircle2, Package, MessageCircle } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { formatNaira } from "../lib/format";
import { Button } from "../components/ui/Button";
import { whatsappLink } from "../lib/config";

// -----------------------------------------------------------------------
// Account / auth is not yet connected — the blueprint specifies Supabase
// Auth for this. Until that's wired up (see src/lib/supabase.ts), this
// page shows locally-recorded order history (from src/store/orderStore)
// keyed by email, which is enough to demonstrate the flow without
// pretending a real account system exists.
// -----------------------------------------------------------------------

export default function Account() {
  const orders = useOrderStore((s) => s.orders);
  const [lookupEmail, setLookupEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const matchingOrders = submitted
    ? orders.filter((o) => o.customer.email.toLowerCase() === lookupEmail.trim().toLowerCase())
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-0 py-10 md:py-16">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-full bg-blush/50 flex items-center justify-center mx-auto mb-4">
          <UserCircle2 size={26} className="text-plum" />
        </div>
        <h1 className="font-serif text-3xl text-chocolate mb-2">My Account</h1>
        <p className="text-sm text-plum-400 font-sans max-w-sm mx-auto">
          Customer accounts with sign-in aren't connected yet. In the meantime, look up your recent
          orders by the email you checked out with.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="flex gap-3 max-w-sm mx-auto mb-10"
      >
        <input
          type="email"
          required
          value={lookupEmail}
          onChange={(e) => setLookupEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 border border-plum-200 rounded px-4 py-3 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
        />
        <Button type="submit">Find Orders</Button>
      </form>

      {submitted && (
        <div>
          {matchingOrders.length === 0 ? (
            <div className="text-center py-10">
              <Package size={24} className="text-plum-300 mx-auto mb-3" />
              <p className="text-sm text-plum-400 font-sans">No orders found for that email on this device.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-plum-100 border-t border-b border-plum-100">
              {matchingOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/order-confirmation/${o.orderNumber}`}
                  className="flex items-center justify-between py-4 hover:bg-blush/20 transition-colors px-2"
                >
                  <div>
                    <p className="text-sm font-medium text-chocolate">{o.orderNumber}</p>
                    <p className="text-xs text-plum-400">{new Date(o.createdAt).toLocaleDateString()} · {o.items.length} item{o.items.length === 1 ? "" : "s"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-chocolate">{formatNaira(o.total)}</p>
                    <span className="text-[10px] uppercase tracking-wide text-plum-400">{o.status}</span>
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
