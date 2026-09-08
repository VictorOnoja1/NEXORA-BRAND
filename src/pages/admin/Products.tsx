import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useProductStore } from "../../store/productStore";
import { useCategories } from "../../store/categoryStore";
import { useUIStore } from "../../store/uiStore";
import { formatNaira } from "../../lib/format";
import { getAvailability } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ProductImage } from "../../components/ui/ProductImage";

export default function AdminProducts() {
  const products = useProductStore((s) => s.products);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const loadProducts = useProductStore((s) => s.loadProducts);
  const categories = useCategories();
  const showToast = useUIStore((s) => s.showToast);
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function toggleActive(id: string, active: boolean) {
    setBusyId(id);
    try {
      await updateProduct(id, { active });
      showToast(active ? "Product activated" : "Product deactivated");
    } catch (err) {
      console.error(err);
      showToast("Could not update this product. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteProduct(id);
      showToast("Product deleted");
    } catch (err) {
      console.error(err);
      showToast("Could not delete this product. Please try again.");
    }
  }

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const productToDelete = products.find((p) => p.id === confirmDelete);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Products</h1>
          <p className="text-sm text-black font-sans">{products.length} products in catalogue</p>
        </div>
        <Link to="/admin/products/new" className="shrink-0">
          <Button icon={<Plus size={16} />} fullWidth className="sm:w-auto">Add Product</Button>
        </Link>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full border border-plum-200 rounded pl-10 pr-4 py-2.5 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
        />
      </div>

      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-black border-b border-plum-100 bg-blush/10">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Category</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const availability = getAvailability(p.stock);
              const category = categories.find((c) => c.slug === p.categorySlug);
              return (
                <tr key={p.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <ProductImage src={p.images[0]?.url} alt="" className="w-10 h-12 rounded object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-chocolate font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-black">{p.sku}</p>
                      </div>
                      {p.featured && <Badge variant="champagne">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-black font-sans">{category?.name || "—"}</td>
                  <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(p.price)}</td>
                  <td className="px-5 py-3 text-black font-sans">{p.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      <Badge variant={availability === "out-of-stock" ? "danger" : availability === "low-stock" ? "champagne" : "outline"}>
                        {availability === "in-stock" ? "In stock" : availability === "low-stock" ? "Low stock" : "Out of stock"}
                      </Badge>
                      <Badge variant={p.active ? "outline" : "danger"}>{p.active ? "Active" : "Inactive"}</Badge>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(p.id, !p.active)}
                        disabled={busyId === p.id}
                        aria-label={p.active ? `Deactivate ${p.name}` : `Activate ${p.name}`}
                        title={p.active ? "Deactivate (hide from storefront)" : "Activate (show on storefront)"}
                        className="p-2 text-black hover:text-black disabled:opacity-50"
                      >
                        {p.active ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="p-2 text-black hover:text-black">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => setConfirmDelete(p.id)} aria-label={`Delete ${p.name}`} className="p-2 text-black hover:text-red-500">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">No products match your search.</p>
        )}
      </div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete product?">
        <p className="text-sm text-black font-sans mb-6">
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This can't be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            variant="primary"
            fullWidth
            className="!bg-red-500 hover:!bg-red-600"
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
