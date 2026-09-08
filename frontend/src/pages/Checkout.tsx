import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Lock, AlertTriangle } from "lucide-react";
import { useCartStore } from "../store/cartStore";
import { useOrderStore } from "../store/orderStore";
import { useProducts } from "../store/productStore";
import { formatNaira } from "../lib/format";
import { siteConfig, whatsappLink } from "../lib/config";
import { Button } from "../components/ui/Button";
import { ProductImage } from "../components/ui/ProductImage";
import { chargeWithPaystack, isPaystackConfigured, generateOrderReference } from "../lib/paystack";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

interface FormState {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  state: string;
  city: string;
  deliveryNote: string;
}

const emptyForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  state: "",
  city: "",
  deliveryNote: "",
};

export default function Checkout() {
  const lines = useCartStore((s) => s.lines);
  const subtotal = useCartStore((s) => s.subtotal());
  const createOrder = useOrderStore((s) => s.createOrder);
  const products = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  const cartItems = lines
    .map((line) => ({ product: products.find((p) => p.id === line.productId), quantity: line.quantity }))
    .filter((l) => l.product);

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const qualifiesFreeDelivery = subtotal >= siteConfig.freeDeliveryThreshold;
  const deliveryFee = qualifiesFreeDelivery ? 0 : siteConfig.flatDeliveryFee;
  const total = subtotal + deliveryFee;

  function validate() {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!/^[0-9+()\s-]{7,20}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.address.trim()) next.address = "Delivery address is required.";
    if (!form.state) next.state = "Select your state.";
    if (!form.city.trim()) next.city = "City is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function finalizeOrder(status: "paid" | "pending", paymentReference?: string) {
    const orderItems = cartItems.map(({ product, quantity }) => ({
      productId: product!.id,
      name: product!.name,
      image: product!.images[0]?.url || "",
      price: product!.price,
      quantity,
    }));

    const order = await createOrder({
      customer: {
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        state: form.state,
        city: form.city.trim(),
        deliveryNote: form.deliveryNote.trim() || undefined,
      },
      items: orderItems,
      subtotal,
      deliveryFee,
      status,
      paymentReference,
    });

    // Cart is intentionally NOT cleared here — see OrderConfirmation,
    // which clears it after mount. Clearing it here raced with this
    // navigation: Checkout's own "redirect to /cart when empty" guard
    // above could see the newly-emptied cart before the route swap
    // finished committing, bouncing the customer back to /cart instead
    // of their confirmation.
    navigate(`/order-confirmation/${order.orderNumber}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    if (isPaystackConfigured) {
      const reference = generateOrderReference();
      const opened = chargeWithPaystack({
        email: form.email.trim(),
        amountKobo: Math.round(total * 100),
        reference,
        onSuccess: (ref) => {
          setSubmitting(false);
          finalizeOrder("paid", ref);
        },
        onClose: () => {
          setSubmitting(false);
        },
      });
      if (!opened) {
        setSubmitting(false);
      }
    } else {
      // Paystack isn't configured in this environment. We do NOT fake a
      // successful charge — the order is recorded as pending and the
      // customer is guided to confirm payment with the store directly.
      setSubmitting(false);
      finalizeOrder("pending");
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  const inputClass = (hasError?: string) =>
    `w-full border rounded px-4 py-3 text-sm text-chocolate placeholder:text-black bg-ivory focus:outline-none focus:border-plum transition-colors ${
      hasError ? "border-red-400" : "border-plum-200"
    }`;

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-8 md:py-12">
      <h1 className="font-serif text-3xl md:text-4xl text-chocolate mb-2">Checkout</h1>
      <p className="text-sm text-black mb-8 font-sans flex items-center gap-1.5">
        <Lock size={13} /> Your information is safe and only used to fulfil your order.
      </p>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 flex flex-col gap-8">
          <section>
            <h2 className="font-serif text-xl text-chocolate mb-4">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="fullName">Full Name</label>
                <input id="fullName" className={inputClass(errors.fullName)} value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Jane Doe" />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="phone">Phone Number</label>
                <input id="phone" className={inputClass(errors.phone)} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="0801 234 5678" />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="email">Email Address</label>
                <input id="email" type="email" className={inputClass(errors.email)} value={form.email} onChange={(e) => updateField("email", e.target.value)} placeholder="jane@example.com" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-chocolate mb-4">Delivery Address</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="address">Street Address</label>
                <input id="address" className={inputClass(errors.address)} value={form.address} onChange={(e) => updateField("address", e.target.value)} placeholder="12 Admiralty Way, Lekki Phase 1" />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="state">State</label>
                <select id="state" className={inputClass(errors.state)} value={form.state} onChange={(e) => updateField("state", e.target.value)}>
                  <option value="">Select state</option>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="city">City</label>
                <input id="city" className={inputClass(errors.city)} value={form.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Lagos" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="note">Delivery Note (optional)</label>
                <textarea id="note" rows={2} className={inputClass()} value={form.deliveryNote} onChange={(e) => updateField("deliveryNote", e.target.value)} placeholder="Landmark, gate colour, preferred delivery time…" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl text-chocolate mb-4">Payment</h2>
            {isPaystackConfigured ? (
              <div className="flex items-center gap-3 border border-plum-200 rounded p-4">
                <img src="https://assets.paystack.com/assets/img/logo/paystack-icon-colored.svg" alt="" className="w-8 h-8" onError={(e) => (e.currentTarget.style.display = "none")} />
                <div>
                  <p className="text-sm font-medium text-chocolate">Pay with Paystack</p>
                  <p className="text-xs text-black">Cards, bank transfer &amp; USSD supported.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-champagne/25 border border-champagne rounded p-4">
                <AlertTriangle size={18} className="text-black shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-chocolate">Online payment isn't connected yet</p>
                  <p className="text-xs text-black mt-1 font-sans">
                    Paystack hasn't been configured for this store. Placing your order will save it as{" "}
                    <strong>pending</strong>, and our team will reach out on WhatsApp to confirm payment.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        <div className="md:col-span-1">
          <div className="bg-blush/30 rounded-lg p-6 sticky top-24">
            <h2 className="font-serif text-xl text-chocolate mb-5">Order Summary</h2>
            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto mb-4 pr-1">
              {cartItems.map(({ product, quantity }) => (
                <div key={product!.id} className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <ProductImage src={product!.images[0]?.url} alt="" className="w-12 h-14 rounded object-cover" />
                    <span className="absolute -top-1.5 -right-1.5 bg-plum text-ivory text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      {quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-chocolate line-clamp-1">{product!.name}</p>
                    <p className="text-xs text-black">{formatNaira(product!.price * quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5 text-sm font-sans border-t border-plum-200 pt-4">
              <div className="flex justify-between text-chocolate/80">
                <span>Subtotal</span>
                <span>{formatNaira(subtotal)}</span>
              </div>
              <div className="flex justify-between text-chocolate/80">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? "Free" : formatNaira(deliveryFee)}</span>
              </div>
              <div className="h-px bg-plum-200 my-1" />
              <div className="flex justify-between text-chocolate font-semibold text-base">
                <span>Total</span>
                <span>{formatNaira(total)}</span>
              </div>
            </div>
            <Button type="submit" fullWidth size="lg" className="mt-6" disabled={submitting}>
              {submitting ? "Processing…" : "Place Order & Pay"}
            </Button>
            <p className="text-[11px] text-black text-center mt-3 font-sans">
              Need help ordering?{" "}
              <a href={whatsappLink("Hi NEXORA, I need help placing an order.")} target="_blank" rel="noreferrer" className="underline">
                Chat with us
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
