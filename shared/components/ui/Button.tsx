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
    "bg-plum text-ivory hover:bg-plum-800 active:bg-plum-900 shadow-soft",
  secondary:
    "bg-champagne text-chocolate hover:bg-champagne-dark",
  outline:
    "border border-plum text-plum bg-transparent hover:bg-plum hover:text-ivory",
  ghost: "bg-transparent text-plum hover:bg-plum-50",
  link: "bg-transparent text-plum underline-offset-4 hover:underline p-0",
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
          "inline-flex items-center justify-center font-sans font-medium rounded transition-all duration-200 ease-out disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
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
