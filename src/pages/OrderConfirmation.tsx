import { useEffect, useState } from "react";
import { useParams, useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, MessageCircle } from "lucide-react";
import { useOrderStore } from "../store/orderStore";
import { useCartStore } from "../store/cartStore";
import { formatNaira } from "../lib/format";
import { Button } from "../components/ui/Button";
import { ProductImage } from "../components/ui/ProductImage";
import { whatsappLink } from "../lib/config";
import { isSupabaseConfigured } from "../lib/supabase";
import { lookupOrderByNumber } from "../lib/api";
import type { Order } from "../types";

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const location = useLocation();
  const clearCart = useCartStore((s) => s.clear);

  // Fast path: Checkout navigates here with the just-created order (and the
  // email that placed it) already in router state, so the very first render
  // shows real data with no extra network round trip.
  const stateOrder = (location.state as { order?: Order; email?: string } | null)?.order;
  const stateEmail = (location.state as { order?: Order; email?: string } | null)?.email;

  const localOrder = useOrderStore((s) => (orderNumber ? s.getByOrderNumber(orderNumber) : undefined));

  const [fetchedOrder, setFetchedOrder] = useState<Order | undefined>(undefined);
  const [fetchFailed, setFetchFailed] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Fallback path: a direct link or a page refresh loses router state. If
  // Supabase is configured and we at least know the email the order was
  // placed with (also carried in router state), re-fetch the order from
  // the server via the orders-lookup Edge Function — order number + email
  // must both match, so this can't be used to browse someone else's order.
  useEffect(() => {
    if (stateOrder || !orderNumber || !isSupabaseConfigured || !stateEmail) return;
    let cancelled = false;
    setFetching(true);
    lookupOrderByNumber(orderNumber, stateEmail)
      .then((order) => {
        if (!cancelled) setFetchedOrder(order);
      })
      .catch(() => {
        if (!cancelled) setFetchFailed(true);
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, stateEmail]);

  const order = stateOrder ?? (isSupabaseConfigured ? fetchedOrder : localOrder);

  // The cart is cleared here — once we've actually landed on the
  // confirmation page for a real order — rather than from Checkout at
  // the moment the order is placed. Clearing from Checkout raced with
  // the navigation to this page: Checkout's own "redirect to /cart when
  // empty" guard could see the newly-emptied cart before the route swap
  // finished committing, bouncing the customer back to /cart instead of
  // showing their confirmation. Clearing after Checkout has already
  // unmounted removes the race entirely.
  useEffect(() => {
    if (order) clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id]);

  if (!order) {
    if (isSupabaseConfigured && fetching) {
      return (
        <div className="max-w-2xl mx-auto px-4 md:px-0 py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-plum-200 border-t-plum rounded-full animate-spin" />
        </div>
      );
    }
    if (isSupabaseConfigured && (fetchFailed || (!stateOrder && !stateEmail))) {
      // We can't safely look this order up without the email it was placed
      // with (server-side, order number alone is deliberately not enough)
      // — direct the customer to the self-service lookup on their account
      // page instead of pretending the order doesn't exist.
      return (
        <div className="max-w-md mx-auto px-4 md:px-0 py-20 text-center">
          <p className="font-serif text-2xl text-chocolate mb-3">Can't display this order here</p>
          <p className="text-sm text-black font-sans mb-6">
            This confirmation link has expired or was opened without your order details. Look up your order by
            email on your account page instead.
          </p>
          <Link to="/account">
            <Button variant="primary" size="lg">Find My Order</Button>
          </Link>
        </div>
      );
    }
    return <Navigate to="/" replace />;
  }

  const isPending = order.status === "pending";

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-0 py-14 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${isPending ? "bg-champagne/40" : "bg-blush/60"}`}>
          {isPending ? <Clock size={30} className="text-black" /> : <CheckCircle2 size={30} className="text-black" />}
        </div>
        <p className="text-xs font-semibold tracking-widest2 uppercase text-black mb-2">
          {isPending ? "Order Received" : "Order Confirmed"}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl text-chocolate mb-3">
          Thank you, {order.customer.fullName.split(" ")[0]}
        </h1>
        <p className="text-black text-sm max-w-md mx-auto font-sans">
          {isPending
            ? "Your order has been recorded and is awaiting payment confirmation. Our team will reach out on WhatsApp shortly to complete your order."
            : "Your order has been placed successfully. We'll notify you as it's processed and shipped."}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border border-plum-100 rounded-lg p-6 mb-8"
      >
        <div className="flex items-center justify-between mb-5 pb-5 border-b border-plum-100">
          <div>
            <p className="text-xs text-black">Order Number</p>
            <p className="font-serif text-lg text-chocolate">{order.orderNumber}</p>
          </div>
          <span className={`text-xs font-semibold uppercase tracking-wide px-3 py-1.5 rounded-full ${isPending ? "bg-champagne/40 text-black" : "bg-blush text-black"}`}>
            {order.status}
          </span>
        </div>

        <div className="flex flex-col gap-4 mb-5">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <ProductImage src={item.image} alt="" className="w-12 h-14 rounded object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-chocolate line-clamp-1">{item.name}</p>
                <p className="text-xs text-black">Qty {item.quantity}</p>
              </div>
              <p className="text-sm text-chocolate font-medium">{formatNaira(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-plum-100 pt-4 flex flex-col gap-2 text-sm font-sans">
          <div className="flex justify-between text-chocolate/70">
            <span>Subtotal</span>
            <span>{formatNaira(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-chocolate/70">
            <span>Delivery</span>
            <span>{order.deliveryFee === 0 ? "Free" : formatNaira(order.deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-chocolate font-semibold text-base pt-1">
            <span>Amount Paid</span>
            <span>{formatNaira(order.total)}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="border border-plum-100 rounded-lg p-6 mb-8"
      >
        <h2 className="text-sm font-semibold text-chocolate mb-3">Delivery Information</h2>
        <p className="text-sm text-black font-sans leading-relaxed">
          {order.customer.address}, {order.customer.city}, {order.customer.state}
          <br />
          {order.customer.phone} · {order.customer.email}
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link to="/shop" className="flex-1">
          <Button variant="primary" fullWidth size="lg">Continue Shopping</Button>
        </Link>
        <a
          href={whatsappLink(`Hi NEXORA, I'd like an update on order ${order.orderNumber}.`)}
          target="_blank"
          rel="noreferrer"
          className="flex-1"
        >
          <Button variant="outline" fullWidth size="lg" icon={<MessageCircle size={16} />}>
            Contact on WhatsApp
          </Button>
        </a>
      </div>
    </div>
  );
}
