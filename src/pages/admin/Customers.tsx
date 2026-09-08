import { useEffect, useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useOrderStore } from "../../store/orderStore";
import { formatNaira } from "../../lib/format";
import { isSupabaseConfigured } from "../../lib/supabase";
import { fetchAdminCustomers, type AdminCustomer } from "../../lib/api";

// -----------------------------------------------------------------------
// When Supabase is configured, this reads the real `customers` table
// (fetchAdminCustomers in src/lib/api.ts) instead of deriving "customers"
// by grouping order history in the browser — see that function's comment
// for why. Without Supabase configured, it falls back to the original
// demo behavior (grouping the local order cache), since there's no
// customers table to read in that mode.
// -----------------------------------------------------------------------

export default function AdminCustomers() {
  const orders = useOrderStore((s) => s.orders);
  const [remote, setRemote] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let cancelled = false;
    setLoading(true);
    fetchAdminCustomers()
      .then((data) => {
        if (!cancelled) setRemote(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load customers. Please refresh to try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const localCustomers = useMemo(() => {
    const map = new Map<string, AdminCustomer>();
    for (const o of orders) {
      const key = o.customer.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (!existing.lastOrder || new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
      } else {
        map.set(key, {
          id: key,
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          customerSince: o.createdAt,
          orderCount: 1,
          totalSpent: o.total,
          lastOrder: o.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const customers = isSupabaseConfigured ? remote : localCustomers;

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Customers</h1>
      <p className="text-sm text-black mb-6 font-sans">
        {isSupabaseConfigured ? `${customers.length} customers` : `${customers.length} customers from order history`}
      </p>

      {error && (
        <div className="flex items-start gap-2 bg-rose/10 border border-rose/40 text-black text-sm font-sans rounded px-3 py-2.5 mb-5">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-black" />
          <span>{error}</span>
        </div>
      )}

      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-xs text-black border-b border-plum-100 bg-blush/10">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="px-5 py-3 font-medium">Orders</th>
              <th className="px-5 py-3 font-medium">Total Spent</th>
              <th className="px-5 py-3 font-medium">Last Order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                <td className="px-5 py-3 text-chocolate font-medium">{c.name}</td>
                <td className="px-5 py-3 text-black font-sans">
                  <p>{c.email}</p>
                  <p className="text-xs text-black">{c.phone}</p>
                </td>
                <td className="px-5 py-3 text-black font-sans">{c.orderCount}</td>
                <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(c.totalSpent)}</td>
                <td className="px-5 py-3 text-black font-sans">
                  {c.lastOrder ? new Date(c.lastOrder).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && customers.length === 0 && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">No customers yet — they'll appear here after the first order.</p>
        )}
        {loading && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">Loading customers…</p>
        )}
      </div>
    </div>
  );
}
