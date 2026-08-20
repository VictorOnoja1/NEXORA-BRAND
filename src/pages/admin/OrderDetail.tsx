import { useParams, Link, Navigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useOrderStore } from "../../store/orderStore";
import { formatNaira } from "../../lib/format";
import type { OrderStatus } from "../../types";
import { useUIStore } from "../../store/uiStore";

const STATUS_OPTIONS: OrderStatus[] = ["pending", "paid", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrderDetail() {
  const { orderId } = useParams<{ orderId: string }>();
  const order = useOrderStore((s) => s.orders.find((o) => o.id === orderId));
  const updateStatus = useOrderStore((s) => s.updateStatus);
  const showToast = useUIStore((s) => s.showToast);

  if (!order) return <Navigate to="/admin/orders" replace />;

  return (
    <div className="max-w-3xl">
      <Link to="/admin/orders" className="inline-flex items-center gap-1 text-sm text-plum-400 hover:text-plum mb-4">
        <ChevronLeft size={15} /> Back to Orders
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">{order.orderNumber}</h1>
          <p className="text-sm text-plum-400 font-sans">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="status" className="text-xs text-plum-400">Status</label>
          <select
            id="status"
            value={order.status}
            onChange={(e) => {
              updateStatus(order.id, e.target.value as OrderStatus);
              showToast(`Order marked as ${e.target.value}`);
            }}
            className="border border-plum-200 rounded px-3 py-2 text-sm text-chocolate capitalize focus:outline-none focus:border-plum"
          >
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="border border-plum-100 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-chocolate mb-3">Customer</h2>
          <p className="text-sm text-plum-500 font-sans leading-relaxed">
            {order.customer.fullName}<br />
            {order.customer.phone}<br />
            {order.customer.email}
          </p>
        </div>
        <div className="border border-plum-100 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-chocolate mb-3">Delivery Address</h2>
          <p className="text-sm text-plum-500 font-sans leading-relaxed">
            {order.customer.address}<br />
            {order.customer.city}, {order.customer.state}
            {order.customer.deliveryNote && <><br /><em>{order.customer.deliveryNote}</em></>}
          </p>
        </div>
      </div>

      <div className="border border-plum-100 rounded-lg p-5 mb-6">
        <h2 className="text-sm font-semibold text-chocolate mb-4">Items</h2>
        <div className="flex flex-col gap-3">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <img src={item.image} alt="" className="w-12 h-14 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-chocolate line-clamp-1">{item.name}</p>
                <p className="text-xs text-plum-400">Qty {item.quantity} × {formatNaira(item.price)}</p>
              </div>
              <p className="text-sm text-chocolate font-medium">{formatNaira(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-plum-100 mt-4 pt-4 flex flex-col gap-2 text-sm font-sans">
          <div className="flex justify-between text-chocolate/70"><span>Subtotal</span><span>{formatNaira(order.subtotal)}</span></div>
          <div className="flex justify-between text-chocolate/70"><span>Delivery</span><span>{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span></div>
          <div className="flex justify-between text-chocolate font-semibold text-base"><span>Total</span><span>{formatNaira(order.total)}</span></div>
        </div>
      </div>

      {order.paymentReference && (
        <div className="border border-plum-100 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-chocolate mb-2">Payment</h2>
          <p className="text-sm text-plum-500 font-sans">Reference: {order.paymentReference}</p>
        </div>
      )}
    </div>
  );
}
