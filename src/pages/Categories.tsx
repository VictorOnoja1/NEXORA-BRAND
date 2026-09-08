import { motion } from "framer-motion";
import { CategoryCard } from "../components/product/CategoryCard";
import { useCategories } from "../store/categoryStore";

export default function Categories() {
  const categories = useCategories();
  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-10 md:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center max-w-xl mx-auto mb-10 md:mb-14"
      >
        <p className="text-xs font-semibold tracking-widest2 uppercase text-black mb-2">
          Explore NEXORA
        </p>
        <h1 className="font-serif text-3xl md:text-5xl text-chocolate mb-3">All Categories</h1>
        <p className="text-black text-sm font-sans">
          Beauty, fashion and everyday essentials — organised so you can find exactly what you need.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categories.map((c, i) => (
          <CategoryCard key={c.id} category={c} index={i} />
        ))}
      </div>
    </div>
  );
}
