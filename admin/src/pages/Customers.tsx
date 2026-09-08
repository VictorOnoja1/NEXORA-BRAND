import { useMemo } from "react";
import { useOrderStore } from "@shared/store/orderStore";
import { formatNaira } from "@shared/lib/format";

export default function AdminCustomers() {
  const orders = useOrderStore((s) => s.orders);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; email: string; phone: string; orderCount: number; totalSpent: number; lastOrder: string }>();
    for (const o of orders) {
      const key = o.customer.email.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.orderCount += 1;
        existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
      } else {
        map.set(key, {
          name: o.customer.fullName,
          email: o.customer.email,
          phone: o.customer.phone,
          orderCount: 1,
          totalSpent: o.total,
          lastOrder: o.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Customers</h1>
      <p className="text-sm text-black mb-6 font-sans">{customers.length} customers from order history</p>

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
              <tr key={c.email} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                <td className="px-5 py-3 text-chocolate font-medium">{c.name}</td>
                <td className="px-5 py-3 text-black font-sans">
                  <p>{c.email}</p>
                  <p className="text-xs text-black">{c.phone}</p>
                </td>
                <td className="px-5 py-3 text-black font-sans">{c.orderCount}</td>
                <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(c.totalSpent)}</td>
                <td className="px-5 py-3 text-black font-sans">{new Date(c.lastOrder).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">No customers yet — they'll appear here after the first order.</p>
        )}
      </div>
    </div>
  );
}
