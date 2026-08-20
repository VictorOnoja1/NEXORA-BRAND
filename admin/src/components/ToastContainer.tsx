import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useUIStore } from "@shared/store/uiStore";
import { useEffect } from "react";

function ToastItem({ id, message, variant }: { id: string; message: string; variant: string }) {
  const dismissToast = useUIStore((s) => s.dismissToast);

  useEffect(() => {
    const t = setTimeout(() => dismissToast(id), 3200);
    return () => clearTimeout(t);
  }, [id, dismissToast]);

  const Icon = variant === "success" ? CheckCircle2 : variant === "error" ? AlertCircle : Info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2.5 bg-chocolate text-ivory px-4 py-3 rounded shadow-elevated min-w-[240px] max-w-sm"
    >
      <Icon size={18} className={variant === "error" ? "text-rose" : "text-champagne"} />
      <p className="text-sm font-sans flex-1">{message}</p>
      <button onClick={() => dismissToast(id)} aria-label="Dismiss" className="text-ivory/60 hover:text-ivory">
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);

  return (
    <div className="fixed z-[100] bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex flex-col gap-2 items-center px-4 w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem {...t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
