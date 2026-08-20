import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { Product } from "../../types";
import { PriceDisplay } from "../ui/PriceDisplay";
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore } from "../../store/cartStore";

export function CartItemRow({ product, quantity }: { product: Product; quantity: number }) {
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <div className="flex gap-4 py-5 border-b border-plum-100">
      <Link to={`/product/${product.slug}`} className="shrink-0">
        <img
          src={product.images[0]?.url}
          alt={product.images[0]?.alt || product.name}
          className="w-20 h-24 md:w-24 md:h-28 rounded-lg object-cover bg-plum-50"
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="text-sm md:text-base text-chocolate font-medium line-clamp-2 mb-1 hover:text-plum">
              {product.name}
            </h3>
          </Link>
          <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="sm" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={quantity}
            onChange={(q) => setQuantity(product.id, q)}
            max={product.stock}
            size="sm"
          />
          <button
            onClick={() => removeItem(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="text-plum-300 hover:text-plum transition-colors p-1.5"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
