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
import logo from "../assets/nexora-logo.png";
import { useAuthStore } from "../store/authStore";

const navItems = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard, end: true },
  { label: "Products", to: "/products", icon: Package },
  { label: "Categories", to: "/categories", icon: FolderTree },
  { label: "Orders", to: "/orders", icon: ShoppingCart },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Subscribers", to: "/subscribers", icon: Mail },
  { label: "Sales", to: "/sales", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  const storefrontUrl = import.meta.env.VITE_STOREFRONT_URL || "http://localhost:5173";

  return (
    <div className="min-h-screen flex bg-ivory">
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-chocolate text-ivory flex flex-col z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-ivory/10">
          <Link to="/" className="flex items-center gap-2.5">
            <img src={logo} alt="NEXORA" className="h-9 w-9 rounded-full object-contain" />
            <div className="leading-none">
              <p className="font-serif text-base">NEXORA</p>
              <p className="text-[10px] text-champagne tracking-widest2 uppercase">Admin</p>
            </div>
          </Link>
          <button className="md:hidden text-ivory/60" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
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
                  isActive ? "bg-plum text-ivory" : "text-ivory/60 hover:bg-ivory/5 hover:text-ivory"
                }`
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ivory/10 flex flex-col gap-2.5">
          <a
            href={storefrontUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-ivory/50 hover:text-ivory transition-colors"
          >
            <ExternalLink size={13} />
            View Storefront
          </a>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs text-ivory/50 hover:text-ivory transition-colors"
          >
            <LogOut size={13} />
            Log Out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-chocolate/50 z-30 md:hidden"
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
