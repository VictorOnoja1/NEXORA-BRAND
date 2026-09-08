import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Heart, Truck, ShieldCheck, RotateCcw, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useProductBySlug, useRelatedProducts } from "../store/productStore";
import { useCategories } from "../store/categoryStore";
import { getAvailability } from "../types";
import { PriceDisplay } from "../components/ui/PriceDisplay";
import { Rating } from "../components/ui/Rating";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { ProductImage } from "../components/ui/ProductImage";
import { QuantitySelector } from "../components/product/QuantitySelector";
import { ProductCard } from "../components/product/ProductCard";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useUIStore } from "../store/uiStore";
import { whatsappLink } from "../lib/config";
import { useNavigate } from "react-router-dom";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const product = useProductBySlug(slug);
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const isWishlisted = useWishlistStore((s) => product ? s.has(product.id) : false);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const showToast = useUIStore((s) => s.showToast);
  const related = useRelatedProducts(product, 4);
  const categories = useCategories();

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  const category = categories.find((c) => c.slug === product.categorySlug);
  const availability = getAvailability(product.stock);

  function handleAddToCart() {
    addItem(product!.id, quantity);
    showToast(`${quantity} × ${product!.name} added to cart`);
  }

  function handleBuyNow() {
    addItem(product!.id, quantity);
    navigate("/checkout");
  }

  return (
    <div className="max-w-8xl mx-auto px-4 md:px-10 py-6 md:py-10 pb-28 md:pb-10">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-black mb-6 font-sans flex-wrap">
        <Link to="/" className="hover:text-black">Home</Link>
        <ChevronRight size={12} />
        <Link to="/shop" className="hover:text-black">Shop</Link>
        {category && (
          <>
            <ChevronRight size={12} />
            <Link to={`/shop?category=${category.slug}`} className="hover:text-black">{category.name}</Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-chocolate font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-14">
        {/* Gallery */}
        <div>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="aspect-[3/4] rounded-lg overflow-hidden bg-plum-50 mb-3"
          >
            <ProductImage
              src={product.images[activeImage]?.url}
              alt={product.images[activeImage]?.alt || product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`w-16 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-plum" : "border-transparent"
                  }`}
                >
                  <ProductImage src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {category && (
            <Link to={`/shop?category=${category.slug}`} className="text-xs font-semibold uppercase tracking-widest2 text-black hover:text-black">
              {category.name}
            </Link>
          )}
          <h1 className="font-serif text-2xl md:text-4xl text-chocolate mt-2 mb-3 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Rating value={product.rating} count={product.ratingCount} />
            {product.isNew && <Badge variant="plum">New</Badge>}
            {availability === "low-stock" && <Badge variant="champagne">Only {product.stock} left</Badge>}
            {availability === "out-of-stock" && <Badge variant="danger">Out of stock</Badge>}
          </div>

          <PriceDisplay price={product.price} previousPrice={product.previousPrice} size="lg" />

          <p className="text-black text-sm leading-relaxed mt-5 mb-6 font-sans">
            {product.description}
          </p>

          {availability !== "out-of-stock" && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-chocolate">Quantity</span>
              <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} />
            </div>
          )}

          <div className="hidden md:flex gap-3 mb-8">
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
              disabled={availability === "out-of-stock"}
            >
              Add to Cart
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleBuyNow}
              disabled={availability === "out-of-stock"}
            >
              Buy Now
            </Button>
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={isWishlisted}
              className="shrink-0 w-14 h-14 rounded border border-plum-200 flex items-center justify-center hover:border-plum transition-colors"
            >
              <Heart size={20} className={isWishlisted ? "fill-plum text-black" : "text-chocolate"} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 border-t border-plum-100 pt-6">
            <div className="flex items-start gap-3">
              <Truck size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-chocolate">Delivery</p>
                <p className="text-xs text-black font-sans">Nationwide delivery across Nigeria. Fee calculated at checkout.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-chocolate">Secure Payment</p>
                <p className="text-xs text-black font-sans">Pay safely with Paystack — cards, transfer &amp; more.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw size={18} className="text-black shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-chocolate">Need Help?</p>
                <p className="text-xs text-black font-sans">
                  <a href={whatsappLink(`Hi NEXORA, I have a question about ${product.name}.`)} target="_blank" rel="noreferrer" className="underline hover:text-black">
                    Chat with us on WhatsApp
                  </a>
                </p>
              </div>
            </div>
          </div>

          <details className="mt-6 border-t border-plum-100 pt-4">
            <summary className="text-sm font-medium text-chocolate cursor-pointer">Product Details</summary>
            <ul className="mt-3 text-sm text-black font-sans space-y-1.5">
              <li>SKU: {product.sku}</li>
              <li>Category: {category?.name}</li>
              <li>Availability: {availability === "in-stock" ? "In stock" : availability === "low-stock" ? `Low stock (${product.stock} left)` : "Out of stock"}</li>
            </ul>
          </details>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="font-serif text-2xl md:text-3xl text-chocolate mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-6 md:gap-y-10">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-ivory border-t border-plum-100 p-3 pb-safe flex gap-2.5">
        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="shrink-0 w-12 h-12 rounded border border-plum-200 flex items-center justify-center"
        >
          <Heart size={18} className={isWishlisted ? "fill-plum text-black" : "text-chocolate"} />
        </button>
        <Button
          variant="outline"
          fullWidth
          onClick={handleAddToCart}
          disabled={availability === "out-of-stock"}
        >
          Add to Cart
        </Button>
        <Button
          variant="primary"
          fullWidth
          onClick={handleBuyNow}
          disabled={availability === "out-of-stock"}
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}
