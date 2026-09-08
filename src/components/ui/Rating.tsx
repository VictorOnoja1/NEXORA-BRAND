import { Star } from "lucide-react";
import clsx from "clsx";

interface RatingProps {
  value?: number;
  count?: number;
  size?: number;
  showCount?: boolean;
}

export function Rating({ value = 0, count = 0, size = 14, showCount = true }: RatingProps) {
  if (!count) {
    return <span className="text-xs text-black font-sans">No reviews yet</span>;
  }
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            className={clsx(
              i < Math.round(value) ? "fill-champagne-dark text-champagne-dark" : "text-black"
            )}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-black font-sans">({count})</span>
      )}
    </div>
  );
}
