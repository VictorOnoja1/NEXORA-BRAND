import { Drawer } from "../ui/Drawer";
import { Button } from "../ui/Button";
import { useCategories } from "../../store/categoryStore";
import type { CategorySlug } from "../../types";

export interface ShopFilters {
  category: CategorySlug | "all";
  minPrice: number;
  maxPrice: number;
  availability: "all" | "in-stock";
  sort: "featured" | "newest" | "price-asc" | "price-desc" | "popular";
}

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
  onReset: () => void;
  resultCount: number;
}

const PRICE_MAX = 60000;

export function FilterDrawer({ open, onClose, filters, onChange, onReset, resultCount }: FilterDrawerProps) {
  const categories = useCategories();
  return (
    <Drawer open={open} onClose={onClose} side="bottom" title="Filter Products">
      <div className="p-5 flex flex-col gap-7">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest2 text-black mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onChange({ ...filters, category: "all" })}
              className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                filters.category === "all"
                  ? "bg-plum text-ivory border-plum"
                  : "border-plum-200 text-chocolate"
              }`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => onChange({ ...filters, category: c.slug })}
                className={`px-3.5 py-2 rounded-full text-xs font-medium border transition-colors ${
                  filters.category === c.slug
                    ? "bg-plum text-ivory border-plum"
                    : "border-plum-200 text-chocolate"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest2 text-black mb-3">
            Price up to ₦{filters.maxPrice.toLocaleString()}
          </h4>
          <input
            type="range"
            min={1000}
            max={PRICE_MAX}
            step={500}
            value={filters.maxPrice}
            onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
            className="w-full accent-plum"
          />
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest2 text-black mb-3">Availability</h4>
          <label className="flex items-center gap-2.5 text-sm text-chocolate">
            <input
              type="checkbox"
              checked={filters.availability === "in-stock"}
              onChange={(e) =>
                onChange({ ...filters, availability: e.target.checked ? "in-stock" : "all" })
              }
              className="accent-plum w-4 h-4"
            />
            In stock only
          </label>
        </div>

        <div className="flex gap-3 sticky bottom-0 bg-ivory pt-3 pb-2 border-t border-plum-100">
          <Button variant="outline" fullWidth onClick={onReset}>
            Reset
          </Button>
          <Button variant="primary" fullWidth onClick={onClose}>
            Show {resultCount} results
          </Button>
        </div>
      </div>
    </Drawer>
  );
}
