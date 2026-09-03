import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "./pages/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Categories from "./pages/Categories";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Customers from "./pages/Customers";
import Subscribers from "./pages/Subscribers";
import Sales from "./pages/Sales";
import Settings from "./pages/Settings";
import { useProductStore } from "@shared/store/productStore";
import { useCategoryStore } from "@shared/store/categoryStore";
import { useOrderStore } from "@shared/store/orderStore";
import { useSubscriberStore } from "@shared/store/subscriberStore";

export default function App() {
  const loadProducts = useProductStore((s) => s.loadProducts);
  const loadCategories = useCategoryStore((s) => s.loadCategories);
  const loadOrders = useOrderStore((s) => s.loadOrders);
  const fetchFromSupabase = useSubscriberStore((s) => s.fetchFromSupabase);

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadOrders();
    fetchFromSupabase();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:productId/edit" element={<ProductForm />} />
        <Route path="categories" element={<Categories />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:orderId" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="sales" element={<Sales />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
