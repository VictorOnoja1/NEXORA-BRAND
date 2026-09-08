import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import clsx from "clsx";

// -----------------------------------------------------------------------
// Drop-in replacement for a plain <img> wherever a product/category photo
// is shown across the admin dashboard and the storefront. Every image URL
// in this project (categories.image, product_images.url, order_items.image)
// is a plain "/images/..." path served from that app's own public/ folder —
// not Supabase Storage. If that file is ever missing (a typo, an unseeded
// product, a deleted asset, or simply this app's public/ folder not having
// the file yet), a bare <img> shows the browser's broken-image icon with
// the alt text spilling out next to/instead of it. This component catches
// that with onError and swaps in a clean, on-brand placeholder instead —
// same footprint (className controls size/position exactly like it would
// on an <img>), so callers don't need to change their layout, just swap
// the tag.
// -----------------------------------------------------------------------

interface ProductImageProps {
  src: string | undefined | null;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  /** Optional: notified when the image fails to load, e.g. so an admin
   *  form can surface "this image link doesn't work" next to the field
   *  that produced it, instead of only swapping the picture silently. */
  onLoadError?: (failed: boolean) => void;
}

export function ProductImage({ src, alt, className, loading = "lazy", onLoadError }: ProductImageProps) {
  const [failed, setFailed] = useState(false);

  // A different image (different src) deserves a fresh attempt to load —
  // without this, swapping images while reusing the same mounted
  // <ProductImage> (e.g. thumbnail selection) would get stuck on the
  // placeholder from a previous failed src.
  useEffect(() => {
    setFailed(false);
    onLoadError?.(false);
  }, [src, onLoadError]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={clsx(
          "flex items-center justify-center bg-plum-50 text-black",
          className
        )}
      >
        <ImageOff size={22} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => {
        setFailed(true);
        onLoadError?.(true);
      }}
    />
  );
}
