import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wallet, ShoppingCart, Package, Clock, AlertTriangle, Users, Mail, Flame } from "lucide-react";
import { StatCard } from "../../components/admin/StatCard";
import { useOrderStore } from "../../store/orderStore";
import { useProducts, useProductStore, useBestSellers } from "../../store/productStore";
import { formatNaira } from "../../lib/format";
import { getAvailability } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { isSupabaseConfigured } from "../../lib/supabase";
import { fetchAdminCustomers, fetchSubscribers } from "../../lib/api";

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
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const products = useProducts();
  const allProducts = useProductStore((s) => s.products);
  const bestSellers = useBestSellers(5);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const [customerCount, setCustomerCount] = useState<number | null>(null);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);

  // These two stats live in their own tables (customers, subscribers), not
  // in anything already loaded into a Zustand store, so they're fetched
  // once here rather than faked or omitted. Real 0 (not configured / no
  // data yet) is shown as "0", never a placeholder number.
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setCustomerCount(0);
      setSubscriberCount(0);
      return;
    }
    let cancelled = false;
    fetchAdminCustomers()
      .then((c) => !cancelled && setCustomerCount(c.length))
      .catch(() => !cancelled && setCustomerCount(0));
    fetchSubscribers()
      .then((s) => !cancelled && setSubscriberCount(s.length))
      .catch(() => !cancelled && setSubscriberCount(0));
    return () => {
      cancelled = true;
    };
  }, []);

  const revenue = orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  // Low stock is scoped to active products only — a deactivated product is
  // already hidden from the storefront, so flagging it for restock isn't
  // useful here the way it is for a product customers can still buy.
  const lowStock = products.filter((p) => getAvailability(p.stock) !== "in-stock" && p.stock > 0);
  const recentOrders = orders.slice(0, 6);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Dashboard</h1>
      <p className="text-sm text-black mb-8 font-sans">Welcome back — here's how NEXORA is doing.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <StatCard label="Revenue" value={formatNaira(revenue)} icon={Wallet} tone="plum" />
        <StatCard label="Orders" value={String(orders.length)} icon={ShoppingCart} tone="champagne" />
        <StatCard label="Products" value={String(allProducts.length)} icon={Package} tone="rose" />
        <StatCard label="Pending Orders" value={String(pendingCount)} icon={Clock} tone="champagne" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Customers" value={customerCount === null ? "…" : String(customerCount)} icon={Users} tone="plum" />
        <StatCard label="Subscribers" value={subscriberCount === null ? "…" : String(subscriberCount)} icon={Mail} tone="champagne" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-plum-100 rounded-lg overflow-hidden shadow-soft bg-ivory">
          <div className="flex items-center justify-between px-5 py-4 border-b border-plum-100 bg-champagne-light/50">
            <h2 className="font-serif text-lg text-chocolate">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs font-medium text-black hover:underline">View all</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-black font-sans px-5 py-10 text-center">No orders yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-black border-b border-plum-100">
                    <th className="px-5 py-2.5 font-medium uppercase tracking-widest2">Order</th>
                    <th className="px-5 py-2.5 font-medium uppercase tracking-widest2">Customer</th>
                    <th className="px-5 py-2.5 font-medium uppercase tracking-widest2">Total</th>
                    <th className="px-5 py-2.5 font-medium uppercase tracking-widest2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                      <td className="px-5 py-3">
                        <Link to={`/admin/orders/${o.id}`} className="text-chocolate font-medium hover:text-black">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-black font-sans">{o.customer.fullName}</td>
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

        <div className="border border-plum-100 rounded-lg overflow-hidden shadow-soft bg-ivory">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-plum-100 bg-champagne-light/50">
            <span className="w-7 h-7 rounded-full bg-blush/60 flex items-center justify-center shrink-0">
              <AlertTriangle size={14} className="text-black" />
            </span>
            <h2 className="font-serif text-lg text-chocolate">Low Stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-black font-sans px-5 py-10 text-center">All products well stocked.</p>
          ) : (
            <div className="flex flex-col divide-y divide-plum-50">
              {lowStock.map((p) => (
                <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-blush/10">
                  <img src={p.images[0]?.url} alt="" className="w-10 h-12 rounded object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-chocolate line-clamp-1">{p.name}</p>
                    <p className="text-xs text-black">{p.stock} left</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-plum-100 rounded-lg overflow-hidden mt-6 shadow-soft bg-ivory">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-plum-100 bg-champagne-light/50">
          <span className="w-7 h-7 rounded-full bg-champagne/60 flex items-center justify-center shrink-0">
            <Flame size={14} className="text-black" />
          </span>
          <h2 className="font-serif text-lg text-chocolate">Best Sellers</h2>
        </div>
        {bestSellers.length === 0 ? (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">No best sellers marked yet.</p>
        ) : (
          <div className="flex divide-x divide-plum-50 overflow-x-auto">
            {bestSellers.map((p) => (
              <Link key={p.id} to={`/admin/products/${p.id}/edit`} className="flex items-center gap-3 px-5 py-3 hover:bg-blush/10 shrink-0 min-w-[220px]">
                <img src={p.images[0]?.url} alt="" className="w-10 h-12 rounded object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-chocolate line-clamp-1">{p.name}</p>
                  <p className="text-xs text-black">{formatNaira(p.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
