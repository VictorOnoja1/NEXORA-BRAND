import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useProductStore } from "@shared/store/productStore";
import { useCategories } from "@shared/store/categoryStore";
import { Button } from "@shared/components/ui/Button";
import { useUIStore } from "@shared/store/uiStore";
import type { CategorySlug } from "@shared/types";

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

  const inputClass = "w-full border border-plum-200 rounded px-4 py-2.5 text-sm text-chocolate placeholder:text-plum-300 bg-ivory focus:outline-none focus:border-plum";
  const labelClass = "text-xs font-medium text-plum-500 mb-1.5 block";

  return (
    <div className="max-w-3xl">
      <Link to="/products" className="inline-flex items-center gap-1 text-sm text-plum-400 hover:text-plum mb-4">
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
              <label className={labelClass} htmlFor="imageUrl">Image URL</label>
              <input
                id="imageUrl"
                className={inputClass}
                value={form.imageUrl}
                onChange={(e) => update("imageUrl", e.target.value)}
                placeholder="https://…"
              />
              <button
                type="button"
                onClick={() => update("imageUrl", placeholderUrls[Math.floor(Math.random() * placeholderUrls.length)])}
                className="inline-flex items-center gap-1.5 text-xs text-plum mt-2 hover:underline"
              >
                <Sparkles size={12} /> Use a placeholder image
              </button>
              <p className="text-[11px] text-plum-400 mt-2 font-sans">
                Image upload via Supabase Storage / Cloudinary isn't connected yet — paste a hosted image URL for now.
              </p>
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
