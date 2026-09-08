import { NavLink } from "react-router-dom";
import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "../../store/cartStore";

const items = [
  { label: "Home", to: "/", icon: Home },
  { label: "Categories", to: "/categories", icon: LayoutGrid },
  { label: "Wishlist", to: "/wishlist", icon: Heart },
  { label: "Cart", to: "/cart", icon: ShoppingBag },
  { label: "Account", to: "/account", icon: User },
];

export function MobileNav() {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <nav
      aria-label="Primary mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ivory border-t border-plum-100 pb-safe"
    >
      <div className="flex items-stretch justify-between px-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-black" : "text-black"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative">
                  <item.icon
                    size={20}
                    strokeWidth={isActive ? 2.4 : 1.8}
                    className={isActive ? "fill-rose/30" : ""}
                  />
                  {item.to === "/cart" && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-plum text-ivory text-[9px] font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
