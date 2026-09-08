import { NavLink, Outlet, Link, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Mail,
  BarChart3,
  Settings,
  Menu,
  X,
  ExternalLink,
  LogOut,
} from "lucide-react";
import logo from "../../assets/nexora-logo.png";
import { useAuthStore } from "../../store/authStore";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/admin/products", icon: Package },
  { label: "Categories", to: "/admin/categories", icon: FolderTree },
  { label: "Orders", to: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Subscribers", to: "/admin/subscribers", icon: Mail },
  { label: "Sales", to: "/admin/sales", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authLoading = useAuthStore((s) => s.loading);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  // While a Supabase session is still being restored (page refresh), wait
  // rather than bouncing a genuinely logged-in admin to /login. When
  // Supabase isn't configured, `loading` is always false (see authStore).
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="w-8 h-8 border-2 border-plum-200 border-t-plum rounded-full animate-spin" />
      </div>
    );
  }

  // Real Supabase Auth + RLS enforce this server-side when Supabase is
  // configured; this redirect is just the UI-level convenience on top of
  // that (see siteConfig.adminUsername in src/lib/config.ts for the
  // client-side-only fallback behavior when Supabase isn't configured).
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Sidebar — warm white / soft lilac base, per NEXORA 2.0 admin identity.
          (Previously a dark bg-chocolate sidebar; a "giant dark-black sidebar"
          is explicitly what the new brand identity moves away from.) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-ivory border-r border-champagne-dark/40 text-chocolate flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-champagne-dark/30">
          <Link to="/admin" className="flex items-center gap-2.5">
            <img src={logo} alt="NEXORA" className="h-9 w-9 rounded-full object-contain" />
            <div className="leading-none">
              <p className="font-serif text-base text-chocolate">NEXORA</p>
              <p className="text-[10px] text-black tracking-widest2 uppercase">Admin</p>
            </div>
          </Link>
          <button className="md:hidden text-chocolate-muted" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1" aria-label="Admin">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-champagne text-black"
                    : "text-chocolate-muted hover:bg-champagne-light hover:text-chocolate"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-champagne-dark/30 flex flex-col gap-2.5">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-chocolate-muted hover:text-black transition-colors"
          >
            <ExternalLink size={13} />
            View Storefront
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-chocolate-muted hover:text-black transition-colors"
          >
            <LogOut size={13} />
            Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-chocolate/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-ivory/95 backdrop-blur border-b border-plum-100 flex items-center justify-between px-5 py-4 md:hidden">
          <button onClick={() => setSidebarOpen(true)} aria-label="Open menu" className="text-chocolate">
            <Menu size={22} />
          </button>
          <span className="font-serif text-lg text-chocolate">NEXORA Admin</span>
          <div className="w-5" />
        </header>
        <main className="flex-1 p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
