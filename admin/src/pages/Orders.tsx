import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useOrderStore } from "@shared/store/orderStore";
import { formatNaira } from "@shared/lib/format";
import { Badge } from "@shared/components/ui/Badge";
import type { OrderStatus } from "@shared/types";

const statusColors: Record<OrderStatus, "plum" | "champagne" | "rose" | "danger" | "outline"> = {
  pending: "champagne",
  paid: "plum",
  processing: "plum",
  shipped: "rose",
  delivered: "outline",
  cancelled: "danger",
};

const statusFilters: (OrderStatus | "all")[] = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const orders = useOrderStore((s) => s.orders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");

  const filtered = orders.filter((o) => {
    const matchesQuery =
      o.orderNumber.toLowerCase().includes(query.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(query.toLowerCase());
    const matchesStatus = status === "all" || o.status === status;
    return matchesQuery && matchesStatus;
  });

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Orders</h1>
      <p className="text-sm text-plum-400 mb-6 font-sans">{orders.length} orders total</p>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-300" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search orders…"
            className="border border-plum-200 rounded pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-plum w-64"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
                status === s ? "bg-plum text-ivory border-plum" : "border-plum-200 text-chocolate"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-plum-400 border-b border-plum-100 bg-blush/10">
              <th className="px-5 py-3 font-medium">Order</th>
              <th className="px-5 py-3 font-medium">Customer</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Items</th>
              <th className="px-5 py-3 font-medium">Total</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                <td className="px-5 py-3">
                  <Link to={`/orders/${o.id}`} className="text-chocolate font-medium hover:text-plum">{o.orderNumber}</Link>
                </td>
                <td className="px-5 py-3 text-plum-500 font-sans">{o.customer.fullName}</td>
                <td className="px-5 py-3 text-plum-400 font-sans">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-3 text-plum-500 font-sans">{o.items.length}</td>
                <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(o.total)}</td>
                <td className="px-5 py-3"><Badge variant={statusColors[o.status]}>{o.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-plum-400 font-sans px-5 py-10 text-center">No orders match your filters.</p>
        )}
      </div>
    </div>
  );
}
