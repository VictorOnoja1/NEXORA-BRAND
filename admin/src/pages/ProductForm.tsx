import { useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Sparkles, UploadCloud } from "lucide-react";
import { useProductStore } from "@shared/store/productStore";
import { useCategories } from "@shared/store/categoryStore";
import { Button } from "@shared/components/ui/Button";
import { useUIStore } from "@shared/store/uiStore";
import { supabase, isSupabaseConfigured } from "@shared/lib/supabase";
import type { CategorySlug } from "@shared/types";

// Product photos are uploaded straight into this Supabase Storage bucket
// (see supabase/storage.sql) — no more pasting a pre-hosted URL by hand.
const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB

function fileExtension(name: string): string {
  const match = /\.([a-z0-9]+)$/i.exec(name);
  return match ? match[1].toLowerCase() : "jpg";
}

const placeholderPool = import.meta.glob<{ default: string }>(
  "../assets/placeholders/prod-*.jpg",
  { eager: true }
);
const placeholderUrls = Object.values(placeholderPool).map(
  (m) => (m as { default: string }).default
);

interface FormState {
  name: string;
  categorySlug: CategorySlug | "";
  price: string;
  previousPrice: string;
  sku: string;
  stock: string;
  shortDescription: string;
  description: string;
  featured: boolean;
  isNew: boolean;
  imageUrl: string;
}

const empty: FormState = {
  name: "",
  categorySlug: "",
  price: "",
  previousPrice: "",
  sku: "",
  stock: "",
  shortDescription: "",
  description: "",
  featured: false,
  isNew: false,
  imageUrl: "",
};

export default function AdminProductForm() {
  const { productId } = useParams<{ productId: string }>();
  const isEditing = Boolean(productId);
  const navigate = useNavigate();
  const categories = useCategories();
  const getById = useProductStore((s) => s.getById);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const showToast = useUIStore((s) => s.showToast);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const existing = productId ? getById(productId) : undefined;

  const [form, setForm] = useState<FormState>(() =>
    existing
      ? {
          name: existing.name,
          categorySlug: existing.categorySlug,
          price: String(existing.price),
          previousPrice: existing.previousPrice ? String(existing.previousPrice) : "",
          sku: existing.sku,
          stock: String(existing.stock),
          shortDescription: existing.shortDescription,
          description: existing.description,
          featured: existing.featured,
          isNew: Boolean(existing.isNew),
          imageUrl: existing.images[0]?.url || "",
        }
      : { ...empty, imageUrl: placeholderUrls[0] || "" }
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // let the same file be re-selected later if needed

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file (JPG, PNG, WEBP…).");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setUploadError("That image is larger than 5MB — please choose a smaller file.");
      return;
    }

    setUploadError(null);
    setUploading(true);
    try {
      if (isSupabaseConfigured && supabase) {
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExtension(file.name)}`;
        const { error } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(path, file, { cacheControl: "3600", upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from(PRODUCT_IMAGE_BUCKET).getPublicUrl(path);
        update("imageUrl", data.publicUrl);
      } else {
        // No live Supabase project configured in this environment — fall back
        // to an in-browser preview so the feature still works, though this
        // image only exists on this device until a real project is connected.
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        update("imageUrl", dataUrl);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed — please try again, or paste an image URL below instead.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.categorySlug || !form.price || !form.sku) return;

    const payload = {
      name: form.name,
      slug: form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      categorySlug: form.categorySlug as CategorySlug,
      price: Number(form.price),
      previousPrice: form.previousPrice ? Number(form.previousPrice) : undefined,
      sku: form.sku,
      stock: Number(form.stock) || 0,
      shortDescription: form.shortDescription,
      description: form.description || form.shortDescription,
      featured: form.featured,
      isNew: form.isNew,
      images: [{ id: "img-1", url: form.imageUrl || placeholderUrls[0], alt: form.name }],
    };

    if (isEditing && existing) {
      updateProduct(existing.id, payload);
      showToast("Product updated");
    } else {
      addProduct(payload);
      showToast("Product added");
    }
    navigate("/products");
  }

  const inputClass = "w-full border border-plum-200 rounded px-4 py-2.5 text-sm text-chocolate placeholder:text-black bg-ivory focus:outline-none focus:border-plum";
  const labelClass = "text-xs font-medium text-black mb-1.5 block";

  return (
    <div className="max-w-3xl">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-black hover:text-black mb-4">
        <ChevronLeft size={15} /> Back to Products
      </Link>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-6">
        {isEditing ? "Edit Product" : "Add Product"}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="border border-plum-100 rounded-lg p-5">
          <h2 className="text-sm font-semibold text-chocolate mb-4">Image</h2>
          <div className="flex items-start gap-4">
            <img src={form.imageUrl || placeholderUrls[0]} alt="" className="w-24 h-28 rounded-lg object-cover bg-plum-50" />
            <div className="flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  icon={<UploadCloud size={14} />}
                >
                  {uploading ? "Uploading…" : "Upload Image"}
                </Button>
                <button
                  type="button"
                  onClick={() => update("imageUrl", placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)])}
                  className="inline-flex items-center gap-1.5 text-xs text-black hover:underline"
                >
                  <Sparkles size={12} /> Use a placeholder instead
                </button>
              </div>
              {uploadError && (
                <p className="text-[11px] text-red-500 mb-2 font-sans">{uploadError}</p>
              )}
              <label className={labelClass} htmlFor="imageUrl">Or paste an image URL</label>
              <input
                id="imageUrl"
                className={inputClass}
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>
        </div>

        <div className="border border-plum-100 rounded-lg p-5 grid sm:grid-cols-2 gap-4">
          <h2 className="text-sm font-semibold text-chocolate sm:col-span-2 -mb-1">Basic Information</h2>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="name">Product Name</label>
            <input id="name" required className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Silky Bone Straight Lace Wig" />
          </div>
          <div>
            <label className={labelClass} htmlFor="category">Category</label>
            <select id="category" required className={inputClass} value={form.categorySlug} onChange={(e) => update("categorySlug", e.target.value as CategorySlug)}>
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="sku">SKU</label>
            <input id="sku" required className={inputClass} value={form.sku} onChange={(e) => update("sku", e.target.value)} placeholder="NX-XX-001" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="shortDescription">Short Description</label>
            <input id="shortDescription" className={inputClass} value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} placeholder="One-line summary shown on product cards" />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="description">Full Description</label>
            <textarea id="description" rows={4} className={inputClass} value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Detailed product description…" />
          </div>
        </div>

        <div className="border border-plum-100 rounded-lg p-5 grid sm:grid-cols-3 gap-4">
          <h2 className="text-sm font-semibold text-chocolate sm:col-span-3 -mb-1">Pricing &amp; Stock</h2>
          <div>
            <label className={labelClass} htmlFor="price">Price (₦)</label>
            <input id="price" required type="number" min="0" className={inputClass} value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="25000" />
          </div>
          <div>
            <label className={labelClass} htmlFor="previousPrice">Previous Price (₦)</label>
            <input id="previousPrice" type="number" min="0" className={inputClass} value={form.previousPrice} onChange={(e) => update("previousPrice", e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className={labelClass} htmlFor="stock">Stock Quantity</label>
            <input id="stock" required type="number" min="0" className={inputClass} value={form.stock} onChange={(e) => update("stock", e.target.value)} placeholder="20" />
          </div>
        </div>

        <div className="border border-plum-100 rounded-lg p-5 flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-chocolate -mb-1">Visibility</h2>
          <label className="flex items-center gap-2.5 text-sm text-chocolate">
            <input type="checkbox" className="accent-plum w-4 h-4" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2.5 text-sm text-chocolate">
            <input type="checkbox" className="accent-plum w-4 h-4" checked={form.isNew} onChange={(e) => update("isNew", e.target.checked)} />
            Mark as new arrival
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" size="lg">{isEditing ? "Save Changes" : "Add Product"}</Button>
          <Link to="/products">
            <Button type="button" variant="outline" size="lg">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
