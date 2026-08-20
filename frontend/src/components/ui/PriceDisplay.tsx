import clsx from "clsx";
import { formatNaira, discountPercent } from "../../lib/format";

interface PriceDisplayProps {
  price: number;
  previousPrice?: number;
  size?: "sm" | "md" | "lg";
  align?: "left" | "center";
}

const sizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-2xl",
};

export function PriceDisplay({
  price,
  previousPrice,
  size = "md",
  align = "left",
}: PriceDisplayProps) {
  const percent = discountPercent(price, previousPrice);
  return (
    <div
      className={clsx(
        "flex items-baseline gap-2 flex-wrap",
        align === "center" && "justify-center"
      )}
    >
      <span className={clsx("font-sans font-semibold text-chocolate", sizeClasses[size])}>
        {formatNaira(price)}
      </span>
      {previousPrice && previousPrice > price && (
        <>
          <span className="text-plum-300 line-through text-sm font-sans">
            {formatNaira(previousPrice)}
          </span>
          <span className="text-[11px] font-semibold text-plum bg-blush px-1.5 py-0.5 rounded-sm">
            -{percent}%
          </span>
        </>
      )}
    </div>
  );
}
