import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import type { Category } from "../../types";

export function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.36) }}
    >
      <Link
        to={`/shop?category=${category.slug}`}
        className="group relative block overflow-hidden rounded-lg aspect-[4/5]"
      >
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
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
