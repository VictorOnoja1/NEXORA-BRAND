import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right" | "bottom";
  title?: string;
  children: ReactNode;
  widthClass?: string;
}

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  children,
  widthClass = "max-w-sm",
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const slideVariants = {
    left: { x: "-100%" },
    right: { x: "100%" },
    bottom: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            className="absolute inset-0 bg-chocolate/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className={
              side === "bottom"
                ? "absolute bottom-0 left-0 right-0 bg-ivory rounded-t-xl max-h-[85vh] flex flex-col"
                : `absolute top-0 bottom-0 ${side === "left" ? "left-0" : "right-0"} w-full ${widthClass} bg-ivory flex flex-col`
            }
            initial={slideVariants[side]}
            animate={{ x: 0, y: 0 }}
            exit={slideVariants[side]}
            transition={{ type: "tween", duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-plum-100 shrink-0">
                <h2 className="font-serif text-lg text-chocolate">{title}</h2>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="p-1.5 rounded-full hover:bg-plum-50 text-chocolate transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
