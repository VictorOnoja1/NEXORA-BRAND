import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Wraps an icon/element and gives it a small spring "pop" every time
 * `changeKey` changes — used for wishlist hearts and similar toggle icons
 * so the state change reads as a deliberate, tactile moment.
 */
export function PopOnChange({
  changeKey,
  children,
  className,
}: {
  changeKey: string | number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      key={changeKey}
      initial={{ scale: 0.55 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 450, damping: 14 }}
      className={className}
    >
      {children}
    </motion.span>
  );
}
