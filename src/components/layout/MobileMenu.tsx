import { Link } from "react-router-dom";
import { Home, ShoppingBag, LayoutGrid, Info, Phone, User, Heart, MessageCircle, Globe, X } from "lucide-react";
import { Drawer } from "../ui/Drawer";
import { useUIStore } from "../../store/uiStore";
import { whatsappLink } from "../../lib/config";
import logo from "../../assets/nexora-logo.png";

const links = [
  { label: "Home", to: "/", icon: Home },
  { label: "Shop", to: "/shop", icon: ShoppingBag },
  { label: "Categories", to: "/categories", icon: LayoutGrid },
  { label: "About", to: "/about", icon: Info },
  { label: "Contact", to: "/contact", icon: Phone },
];

const account = [
  { label: "My Account", to: "/account", icon: User },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/cart", icon: ShoppingBag },
];

export function MobileMenu() {
  const open = useUIStore((s) => s.mobileMenuOpen);
  const setOpen = useUIStore((s) => s.setMobileMenuOpen);

  return (
    <Drawer open={open} onClose={() => setOpen(false)} side="left" widthClass="max-w-[320px]">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
            <img src={logo} alt="NEXORA" className="h-10 w-10 rounded-full object-contain" />
            <span className="font-serif text-lg text-chocolate">NEXORA</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-1 text-xs text-plum-400 font-sans"
              aria-label="Language: English"
            >
              <Globe size={14} /> EN
            </button>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="p-1.5 -mr-1.5 rounded-full text-chocolate hover:bg-plum-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="flex flex-col px-2 py-2" aria-label="Mobile primary">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 px-4 py-3.5 text-chocolate font-serif text-lg hover:bg-blush/40 rounded transition-colors"
            >
              <link.icon size={18} className="text-plum" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="h-px bg-plum-100 mx-6 my-2" />

        <nav className="flex flex-col px-2 py-2" aria-label="Mobile account">
          {account.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-4 px-4 py-3 text-chocolate/80 text-sm font-medium hover:bg-blush/40 rounded transition-colors"
            >
              <link.icon size={16} className="text-plum-400" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto p-6">
          <a
            href={whatsappLink("Hi NEXORA, I'd like some help.")}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded bg-[#25D366] text-white text-sm font-semibold"
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </Drawer>
  );
}
