import { AnimatePresence, motion } from "framer-motion";

/**
 * A small numeric badge (cart/wishlist counts) that pops in with a spring
 * whenever the count changes, instead of silently updating. Renders nothing
 * when count is 0.
 */
export function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className={className}
        >
          {count > 9 ? "9+" : count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
