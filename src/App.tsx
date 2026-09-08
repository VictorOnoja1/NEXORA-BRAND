import { lazy, Suspense } from "react";
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

// Admin dashboard is code-split into its own chunk — customers browsing the
// storefront never pay for its bundle weight.
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminProducts = lazy(() => import("./pages/admin/Products"));
const AdminProductForm = lazy(() => import("./pages/admin/ProductForm"));
const AdminCategories = lazy(() => import("./pages/admin/Categories"));
const AdminOrders = lazy(() => import("./pages/admin/Orders"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const AdminCustomers = lazy(() => import("./pages/admin/Customers"));
const AdminSubscribers = lazy(() => import("./pages/admin/Subscribers"));
const AdminSales = lazy(() => import("./pages/admin/Sales"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="w-8 h-8 border-2 border-plum-200 border-t-plum rounded-full animate-spin" />
    </div>
  );
}

export default function App() {
  return (
    // reducedMotion="user" makes every framer-motion animation in the app
    // respect the visitor's OS-level prefers-reduced-motion setting
    // automatically, without touching each individual component.
    <MotionConfig reducedMotion="user">
      <Routes>
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

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />

        <Route
          path="/admin"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }
        >
          <Route index element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
          <Route path="products" element={<Suspense fallback={<AdminFallback />}><AdminProducts /></Suspense>} />
          <Route path="products/new" element={<Suspense fallback={<AdminFallback />}><AdminProductForm /></Suspense>} />
          <Route path="products/:productId/edit" element={<Suspense fallback={<AdminFallback />}><AdminProductForm /></Suspense>} />
          <Route path="categories" element={<Suspense fallback={<AdminFallback />}><AdminCategories /></Suspense>} />
          <Route path="orders" element={<Suspense fallback={<AdminFallback />}><AdminOrders /></Suspense>} />
          <Route path="orders/:orderId" element={<Suspense fallback={<AdminFallback />}><AdminOrderDetail /></Suspense>} />
          <Route path="customers" element={<Suspense fallback={<AdminFallback />}><AdminCustomers /></Suspense>} />
          <Route path="subscribers" element={<Suspense fallback={<AdminFallback />}><AdminSubscribers /></Suspense>} />
          <Route path="sales" element={<Suspense fallback={<AdminFallback />}><AdminSales /></Suspense>} />
          <Route path="settings" element={<Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>} />
        </Route>
      </Routes>
    </MotionConfig>
  );
}
