import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useUIStore } from "../../store/uiStore";
import { useProducts } from "../../store/productStore";
import { useCategories } from "../../store/categoryStore";
import { formatNaira } from "../../lib/format";

export function SearchOverlay() {
  const open = useUIStore((s) => s.searchOpen);
  const setOpen = useUIStore((s) => s.setSearchOpen);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const products = useProducts();
  const categories = useCategories();

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return products
      .filter((p) => p.name.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q))
      .slice(0, 6);
  }, [query, products]);

  function close() {
    setOpen(false);
    setQuery("");
  }

  function goToProduct(slug: string) {
    close();
    navigate(`/product/${slug}`);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] bg-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="max-w-3xl mx-auto px-5 pt-6 pb-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-plum-50/60 border border-plum-100 rounded-full pl-11 pr-4 py-3.5 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
                />
              </div>
              <button onClick={close} aria-label="Close search" className="p-2 text-chocolate">
                <X size={22} />
              </button>
            </div>

            {query.trim().length < 2 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest2 text-black mb-3">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        close();
                        navigate(`/shop?category=${c.slug}`);
                      }}
                      className="px-4 py-2 rounded-full border border-plum-200 text-sm text-chocolate hover:bg-plum hover:text-ivory hover:border-plum transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query.trim().length >= 2 && results.length === 0 && (
              <div className="text-center py-16">
                <p className="text-black font-sans text-sm">
                  No products found for &ldquo;{query}&rdquo;. Try a different search term.
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="flex flex-col divide-y divide-plum-100 overflow-y-auto">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => goToProduct(p.slug)}
                    className="flex items-center gap-4 py-3 text-left hover:bg-blush/30 rounded transition-colors px-2"
                  >
                    <img src={p.images[0]?.url} alt="" className="w-14 h-14 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-chocolate line-clamp-1">{p.name}</p>
                      <p className="text-xs text-black">{formatNaira(p.price)}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
