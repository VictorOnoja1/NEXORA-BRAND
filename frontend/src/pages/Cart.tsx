import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useProducts } from "../store/productStore";
import { CartItemRow } from "../components/product/CartItemRow";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { formatNaira } from "../lib/format";
import { siteConfig } from "../lib/config";

export default function Cart() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const products = useProducts();
  const navigate = useNavigate();

  const cartProducts = lines
    .map((line) => ({ product: products.find((p) => p.id === line.productId), quantity: line.quantity }))
    .filter((l) => l.product);

  const qualifiesFreeDelivery = subtotal >= siteConfig.freeDeliveryThreshold;
  const deliveryFee = cartProducts.length === 0 ? 0 : qualifiesFreeDelivery ? 0 : siteConfig.flatDeliveryFee;
  const total = subtotal + deliveryFee;

  if (cartProducts.length === 0) {
    return (
      <div className="max-w-8xl mx-auto px-4 py-10">
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Explore our latest arrivals and best sellers."
          ctaLabel="Start Shopping"
          ctaTo="/shop"
        />
      </div>
    );
  }

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-8 md:py-12">
      <h1 className="font-serif text-3xl md:text-4xl text-chocolate mb-8">Your Cart</h1>

      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          <div className="flex flex-col">
            {cartProducts.map(({ product, quantity }) => (
              <CartItemRow key={product!.id} product={product!} quantity={quantity} />
            ))}
          </div>
          <Link to="/shop" className="inline-block mt-5 text-sm font-medium text-plum hover:underline">
            ← Continue Shopping
          </Link>
        </div>

        <div className="md:col-span-1">
          <div className="bg-blush/30 rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl text-chocolate mb-5">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm font-sans">
              <div className="flex justify-between text-chocolate/80">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-chocolate/80">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</span>
              </div>
              {!qualifiesFreeDelivery && (
                <p className="text-xs text-plum-400">
                  Add {formatNaira(siteConfig.freeDeliveryThreshold - subtotal)} more for free delivery.
                </p>
              )}
              <div className="h-px bg-plum-200 my-1" />
              <div className="flex justify-between text-chocolate font-semibold text-base">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </div>
            <Button fullWidth size="lg" className="mt-6" onClick={() => navigate("/checkout")}>
              Proceed to Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
