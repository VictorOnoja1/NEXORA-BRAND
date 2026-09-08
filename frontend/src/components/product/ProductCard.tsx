import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import type { Product } from "../../types";
import { getAvailability } from "../../types";
import { PriceDisplay } from "../ui/PriceDisplay";
import { Badge } from "../ui/Badge";
import { ProductImage } from "../ui/ProductImage";
import { PopOnChange } from "../ui/PopOnChange";
import { useWishlistStore } from "../../store/wishlistStore";
import { useCartStore } from "../../store/cartStore";
import { useUIStore } from "../../store/uiStore";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const isWishlisted = useWishlistStore((s) => s.has(product.id));
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const addItem = useCartStore((s) => s.addItem);
  const showToast = useUIStore((s) => s.showToast);
  const availability = getAvailability(product.stock);
  const secondImage = product.images[1];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (availability === "out-of-stock") return;
    addItem(product.id, 1);
    showToast(`${product.name} added to cart`, "success");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    toggleWishlist(product.id);
    showToast(
      isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      "info"
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        aria-label={product.name}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-plum-50 mb-3 shadow-soft transition-shadow duration-300 group-hover:shadow-elevated">
          <ProductImage
            src={product.images[0]?.url}
            alt={product.images[0]?.alt || product.name}
            loading="lazy"
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500",
              secondImage && "group-hover:opacity-0"
            )}
          />
          {secondImage && (
            <ProductImage
              src={secondImage.url}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
            {product.isNew && <Badge variant="plum">New</Badge>}
            {product.previousPrice && <Badge variant="rose">Sale</Badge>}
            {availability === "low-stock" && (
              <Badge variant="champagne">Low stock</Badge>
            )}
          </div>

          <button
            onClick={handleWishlist}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-ivory/90 backdrop-blur flex items-center justify-center shadow-soft hover:scale-105 active:scale-90 transition-transform"
          >
            <PopOnChange changeKey={String(isWishlisted)} className="flex">
              <Heart
                size={16}
                className={isWishlisted ? "fill-plum text-black" : "text-chocolate"}
              />
            </PopOnChange>
          </button>

          {availability === "out-of-stock" && (
            <div className="absolute inset-0 bg-ivory/70 flex items-center justify-center">
              <Badge variant="danger">Out of stock</Badge>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={availability === "out-of-stock"}
            className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 active:!bg-plum-800 transition-transform duration-300 bg-plum text-ivory text-xs font-medium py-2.5 flex items-center justify-center gap-1.5 disabled:bg-plum-200 hidden md:flex"
          >
            <ShoppingBag size={14} />
            Add to Cart
          </button>
        </div>

        <h3 className="font-sans text-sm text-chocolate leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="sm" />
      </Link>

      {/* Mobile-visible quick add */}
      <button
        onClick={handleAddToCart}
        disabled={availability === "out-of-stock"}
        className="mt-2 w-full md:hidden border border-plum-200 text-black text-xs font-medium py-2 rounded flex items-center justify-center gap-1.5 disabled:opacity-40"
      >
        <ShoppingBag size={13} />
        Add to Cart
      </button>
    </motion.div>
  );
}
