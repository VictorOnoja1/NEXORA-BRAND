import { Minus, Plus } from "lucide-react";
import { PopOnChange } from "../ui/PopOnChange";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: "sm" | "md";
}

export function QuantitySelector({ value, onChange, max = 99, size = "md" }: QuantitySelectorProps) {
  const dim = size === "sm" ? "w-8 h-8" : "w-10 h-10";
  return (
    <div className="inline-flex items-center border border-plum-200 rounded overflow-hidden">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className={`${dim} flex items-center justify-center text-plum hover:bg-plum-50 active:scale-90 transition-transform disabled:opacity-30 disabled:active:scale-100`}
        disabled={value <= 1}
      >
        <Minus size={14} />
      </button>
      <span className={`${dim} flex items-center justify-center overflow-hidden text-sm font-medium text-chocolate select-none`}>
        <PopOnChange changeKey={value}>{value}</PopOnChange>
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        className={`${dim} flex items-center justify-center text-plum hover:bg-plum-50 active:scale-90 transition-transform disabled:opacity-30 disabled:active:scale-100`}
        disabled={value >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
