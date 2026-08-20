import { Heart } from "lucide-react";
import { useWishlistStore } from "../store/wishlistStore";
import { useProducts } from "../store/productStore";
import { ProductCard } from "../components/product/ProductCard";
import { EmptyState } from "../components/ui/EmptyState";

export default function Wishlist() {
  const ids = useWishlistStore((s) => s.ids);
  const products = useProducts();
  const wishlisted = products.filter((p) => ids.includes(p.id));

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-8 md:py-12">
      <h1 className="font-serif text-3xl md:text-4xl text-chocolate mb-2">Your Wishlist</h1>
      <p className="text-sm text-plum-400 mb-8 font-sans">
        {wishlisted.length} item{wishlisted.length === 1 ? "" : "s"} saved
      </p>

      {wishlisted.length === 0 ? (
        <EmptyState
          icon={<Heart size={24} />}
          title="Your wishlist is empty"
          description="Save the products you love so you can find them easily later."
          ctaLabel="Explore Products"
          ctaTo="/shop"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
          {wishlisted.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
