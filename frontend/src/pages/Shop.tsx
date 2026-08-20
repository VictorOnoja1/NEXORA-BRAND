import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, LayoutGrid, List as ListIcon, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ProductCard } from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { FilterDrawer, type ShopFilters } from "../components/product/FilterDrawer";
import { useProducts } from "../store/productStore";
import { useCategories } from "../store/categoryStore";
import type { CategorySlug } from "../types";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { Rating } from "../components/ui/Rating";
import { useCartStore } from "../store/cartStore";
import { useUIStore } from "../store/uiStore";

const defaultFilters: ShopFilters = {
  category: "all",
  minPrice: 0,
  maxPrice: 60000,
  availability: "all",
  sort: "featured",
};

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<ShopFilters>(() => {
    const cat = searchParams.get("category") as CategorySlug | null;
    const urlFilter = searchParams.get("filter");
    return {
      ...defaultFilters,
      category: cat || "all",
      sort: urlFilter === "new" ? "newest" : urlFilter === "bestsellers" ? "popular" : "featured",
    };
  });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [query] = useState(searchParams.get("q") || "");
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filters.category !== "all") params.category = filters.category;
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category]);

  const products = useProducts();
  const categories = useCategories();

  const filtered = useMemo(() => {
    let list = [...products];

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    if (filters.category !== "all") {
      list = list.filter((p) => p.categorySlug === filters.category);
    }
    list = list.filter((p) => p.price <= filters.maxPrice);
    if (filters.availability === "in-stock") {
      list = list.filter((p) => p.stock > 0);
    }

    switch (filters.sort) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        list.sort((a, b) => (b.ratingCount || 0) - (a.ratingCount || 0));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [filters, query, products]);

  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-6 md:py-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-plum-400 mb-4 font-sans">
        <Link to="/" className="hover:text-plum">Home</Link>
        <ChevronRight size={12} />
        <span className="text-chocolate font-medium">Shop</span>
        {activeCategory && (
          <>
            <ChevronRight size={12} />
            <span className="text-chocolate font-medium">{activeCategory.name}</span>
          </>
        )}
      </nav>

      <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-chocolate mb-1">
            {activeCategory ? activeCategory.name : "Shop"}
          </h1>
          <p className="text-sm text-plum-400 font-sans">
            {loading ? "Loading products…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-plum-100">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-chocolate border border-plum-200 rounded px-4 py-2.5 hover:border-plum transition-colors"
        >
          <SlidersHorizontal size={15} />
          Filter
        </button>

        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) => setFilters({ ...filters, sort: e.target.value as ShopFilters["sort"] })}
            aria-label="Sort by"
            className="text-sm border border-plum-200 rounded px-3 py-2.5 text-chocolate bg-ivory focus:outline-none focus:border-plum"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="popular">Sort: Popular</option>
          </select>
          <div className="hidden md:flex items-center border border-plum-200 rounded overflow-hidden">
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              className={`p-2.5 ${view === "grid" ? "bg-plum text-ivory" : "text-plum-400"}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              aria-pressed={view === "list"}
              className={`p-2.5 ${view === "list" ? "bg-plum text-ivory" : "text-plum-400"}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your filters or search term to find what you're looking for."
          ctaLabel="Reset Filters"
          ctaTo="/shop"
        />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-plum-100">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
              className="flex gap-5 py-5"
            >
              <Link to={`/product/${p.slug}`} className="shrink-0">
                <img src={p.images[0]?.url} alt={p.name} className="w-28 h-32 md:w-40 md:h-44 object-cover rounded-lg" />
              </Link>
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <Link to={`/product/${p.slug}`}>
                    <h3 className="font-serif text-lg text-chocolate mb-1 hover:text-plum">{p.name}</h3>
                  </Link>
                  <p className="text-sm text-plum-400 mb-2 line-clamp-2 font-sans">{p.shortDescription}</p>
                  <Rating value={p.rating} count={p.ratingCount} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <PriceDisplay price={p.price} previousPrice={p.previousPrice} />
                  <button
                    onClick={() => {
                      addItem(p.id, 1);
                      showToast(`${p.name} added to cart`);
                    }}
                    disabled={p.stock === 0}
                    className="text-xs font-semibold uppercase tracking-widest2 text-plum border border-plum rounded px-4 py-2 hover:bg-plum hover:text-ivory transition-colors disabled:opacity-30"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(defaultFilters)}
        resultCount={filtered.length}
      />
    </div>
  );
}
