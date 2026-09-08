import { Link } from "react-router-dom";
import { ArrowRight, Scissors, Droplet, Sparkles, SprayCan, Gem, Flower2, Shirt, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import type { Category, CategorySlug } from "../../types";

// No product photography exists for category cards (and we'd rather show a
// clean on-brand tile than a generic stock photo). Each category gets a
// fixed brand-token gradient + a representative icon watermark. If
// category.image is ever set to a real URL (e.g. via the admin "Image URL"
// field), that photo is used instead — this is a graceful fallback, not a
// dead end.
const CATEGORY_STYLE: Record<CategorySlug, { gradient: string; icon: typeof Scissors }> = {
  "wigs-hair": { gradient: "from-plum-300 to-plum-600", icon: Scissors },
  "hair-care": { gradient: "from-champagne to-champagne-dark", icon: Droplet },
  "skincare-cosmetics": { gradient: "from-blush to-rose-dark", icon: Sparkles },
  perfumes: { gradient: "from-plum-200 to-plum-500", icon: SprayCan },
  jewellery: { gradient: "from-champagne-dark to-plum-400", icon: Gem },
  attachments: { gradient: "from-rose-light to-blush", icon: Flower2 },
  fashion: { gradient: "from-chocolate-light to-chocolate", icon: Shirt },
  accessories: { gradient: "from-plum-400 to-chocolate-light", icon: Briefcase },
};

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  const style = CATEGORY_STYLE[category.slug] ?? CATEGORY_STYLE.accessories;
  const Icon = style.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.36) }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/shop?category=${category.slug}`}
        className="group relative block overflow-hidden rounded-lg aspect-[4/5] shadow-soft transition-shadow duration-300 hover:shadow-elevated"
      >
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${style.gradient} flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105`}
          >
            <Icon size={64} strokeWidth={1} className="text-ivory/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-chocolate/95 via-chocolate/45 via-45% to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-ivory">
          <h3 className="font-serif text-xl mb-1 text-ivory [text-shadow:0_1px_6px_rgba(0,0,0,0.5)]">{category.name}</h3>
          <p className="text-xs text-ivory/80 mb-3 font-sans [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">{category.descriptor}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest2 text-champagne">
            Shop Now
            <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
