import { Link } from "react-router-dom";
import { Wallet, ShoppingCart, Package, Clock, AlertTriangle } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { useOrderStore } from "@shared/store/orderStore";
import { useProducts } from "@shared/store/productStore";
import { formatNaira } from "@shared/lib/format";
import { getAvailability } from "@shared/types";
import { Badge } from "@shared/components/ui/Badge";

const statusColors: Record<string, string> = {
  pending: "champagne",
  paid: "plum",
  processing: "plum",
  shipped: "rose",
  delivered: "plum",
  cancelled: "danger",
};

export default function AdminDashboard() {
  const orders = useOrderStore((s) => s.orders);
  const products = useProducts();

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => getAvailability(p.stock) !== "in-stock" && p.stock > 0);
  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Dashboard</h1>
      <p className="text-sm text-plum-400 mb-8 font-sans">Welcome back — here's how NEXORA is doing.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Revenue" value={formatNaira(revenue)} icon={Wallet} tone="plum" />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingCart} tone="champagne" />
        <StatCard label="Products" value={String(products.length)} icon={Package} tone="rose" />
        <StatCard label="Pending Orders" value={String(pendingCount)} icon={Clock} tone="champagne" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-plum-100 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-plum-100">
            <h2 className="font-serif text-lg text-chocolate">Recent Orders</h2>
            <Link to="/orders" className="text-xs font-medium text-plum hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-plum-400 font-sans px-5 py-10 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-plum-400 border-b border-plum-100">
                    <th className="px-5 py-2.5 font-medium">Order</th>
                    <th className="px-5 py-2.5 font-medium">Customer</th>
                    <th className="px-5 py-2.5 font-medium">Total</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                      <td className="px-5 py-3">
                        <Link to={`/orders/${o.id}`} className="text-chocolate font-medium hover:text-plum">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-plum-500 font-sans">{o.customer.fullName}</td>
                      <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(o.total)}</td>
                      <td className="px-5 py-3">
                        <Badge variant={statusColors[o.status] as "plum" | "champagne" | "rose" | "danger"}>{o.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="border border-plum-100 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-plum-100">
            <AlertTriangle size={16} className="text-plum" />
            <h2 className="font-serif text-lg text-chocolate">Low Stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-plum-400 font-sans px-5 py-10 text-center">All products well stocked.</p>
          ) : (
            <div className="flex flex-col divide-y divide-plum-50">
              {lowStock.map((p) => (
                <Link key={p.id} to={`/products/${p.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-blush/10">
                  <img src={p.images[0]?.url} alt="" className="w-10 h-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-chocolate line-clamp-1">{p.name}</p>
                    <p className="text-xs text-plum-400">{p.stock} left</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
