import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Categories from "./pages/Categories";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Wishlist from "./pages/Wishlist";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import { useProductStore } from "@shared/store/productStore";
import { useCategoryStore } from "@shared/store/categoryStore";

function AdminRedirect() {
  const adminUrl = import.meta.env.VITE_ADMIN_URL || "http://localhost:5174";
  useEffect(() => {
    window.location.href = adminUrl;
  }, [adminUrl]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center font-sans">
      <h2 className="font-serif text-2xl text-chocolate mb-2">Redirecting to NEXORA Admin Portal...</h2>
      <p className="text-sm text-black mb-4">
        Navigating to <a href={adminUrl} className="underline font-medium text-black">{adminUrl}</a>
      </p>
    </div>
  );
}

export default function App() {
  const loadProducts = useProductStore((s) => s.loadProducts);
  const loadCategories = useCategoryStore((s) => s.loadCategories);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    // reducedMotion="user" makes every framer-motion animation in the app
    // respect the visitor's OS-level prefers-reduced-motion setting
    // automatically, without touching each individual component.
    <MotionConfig reducedMotion="user">
      <Routes>
        <Route path="/admin" element={<AdminRedirect />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/account" element={<Account />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </MotionConfig>
  );
}
