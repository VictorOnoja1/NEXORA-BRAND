import clsx from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "plum" | "champagne" | "rose" | "outline" | "danger";
  className?: string;
}

const variants: Record<string, string> = {
  plum: "bg-plum text-ivory",
  champagne: "bg-champagne text-chocolate",
  rose: "bg-rose text-chocolate",
  outline: "border border-plum-200 text-plum bg-ivory",
  danger: "bg-chocolate text-ivory",
};

export function Badge({ children, variant = "plum", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center text-[10px] font-semibold uppercase tracking-widest2 px-2 py-1 rounded-sm",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
