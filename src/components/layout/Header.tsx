import { Link, NavLink } from "react-router-dom";
import { Menu, Search, Heart, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";
import { useWishlistStore } from "../../store/wishlistStore";
import { CountBadge } from "../ui/CountBadge";
import logo from "../../assets/nexora-logo.png";

const desktopLinks = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/categories" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const totalItems = useCartStore((s) => s.totalItems());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const setMobileMenuOpen = useUIStore((s) => s.setMobileMenuOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-plum-100">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between px-4 h-16">
        <button
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 -ml-2 text-chocolate"
        >
          <Menu size={22} />
        </button>
        <Link to="/" aria-label="NEXORA home" className="flex items-center">
          <img src={logo} alt="NEXORA" className="h-11 w-11 object-contain rounded-full" />
        </Link>
        <div className="flex items-center gap-1">
          <button aria-label="Search" onClick={() => setSearchOpen(true)} className="p-2 text-chocolate">
            <Search size={20} />
          </button>
          <Link to="/cart" aria-label="Cart" className="relative p-2 text-chocolate">
            <ShoppingBag size={20} />
            <CountBadge
              count={totalItems}
              className="absolute top-0.5 right-0.5 bg-plum text-ivory text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
            />
          </Link>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:flex items-center justify-between max-w-8xl mx-auto px-8 h-20">
        <Link to="/" aria-label="NEXORA home" className="flex items-center gap-3">
          <img src={logo} alt="NEXORA Beauty & Essentials" className="h-14 w-14 object-contain rounded-full" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-2xl text-chocolate tracking-wide">NEXORA</span>
            <span className="text-[10px] tracking-widest2 text-plum-400 uppercase">Beauty &amp; Essentials</span>
          </div>
        </Link>

        <nav className="flex items-center gap-9" aria-label="Primary">
          {desktopLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `text-sm font-medium tracking-wide transition-colors ${
                  isActive ? "text-plum" : "text-chocolate/80 hover:text-plum"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="text-chocolate hover:text-plum hover:-translate-y-0.5 transition-all"
          >
            <Search size={20} />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative text-chocolate hover:text-plum hover:-translate-y-0.5 transition-all"
          >
            <Heart size={20} />
            <CountBadge
              count={wishlistCount}
              className="absolute -top-1.5 -right-1.5 bg-plum text-ivory text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
            />
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            className="text-chocolate hover:text-plum hover:-translate-y-0.5 transition-all"
          >
            <User size={20} />
          </Link>
          <Link
            to="/cart"
            aria-label="Cart"
            className="relative text-chocolate hover:text-plum hover:-translate-y-0.5 transition-all"
          >
            <ShoppingBag size={20} />
            <CountBadge
              count={totalItems}
              className="absolute -top-1.5 -right-1.5 bg-plum text-ivory text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
