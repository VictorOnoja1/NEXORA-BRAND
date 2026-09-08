import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "link";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-plum text-ivory hover:bg-plum-800 active:bg-plum-900 shadow-soft hover:shadow-elevated hover:-translate-y-0.5",
  secondary:
    "bg-champagne text-chocolate hover:bg-champagne-dark shadow-soft hover:shadow-card hover:-translate-y-0.5",
  outline:
    "border border-plum text-black bg-transparent hover:bg-plum hover:text-ivory hover:-translate-y-0.5",
  ghost: "bg-transparent text-black hover:bg-plum-50",
  link: "bg-transparent text-black underline-offset-4 hover:underline p-0",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-xs px-4 py-2 gap-1.5",
  md: "text-sm px-6 py-3 gap-2",
  lg: "text-sm px-8 py-4 gap-2 tracking-wide",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium rounded transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
          variant !== "link" && "rounded",
          variantClasses[variant],
          variant !== "link" && sizeClasses[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </button>
    );
  }
);
Button.displayName = "Button";
