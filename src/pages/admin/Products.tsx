import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useProductStore } from "../../store/productStore";
import { useCategories } from "../../store/categoryStore";
import { formatNaira } from "../../lib/format";
import { getAvailability } from "../../types";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

export default function AdminProducts() {
  const products = useProductStore((s) => s.products);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const categories = useCategories();
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
  const productToDelete = products.find((p) => p.id === confirmDelete);

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Products</h1>
          <p className="text-sm text-plum-400 font-sans">{products.length} products in catalogue</p>
        </div>
        <Link to="/admin/products/new">
          <Button icon={<Plus size={16} />}>Add Product</Button>
        </Link>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-plum-300" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full border border-plum-200 rounded pl-10 pr-4 py-2.5 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
        />
      </div>

      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-xs text-plum-400 border-b border-plum-100 bg-blush/10">
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
                      <img src={p.images[0]?.url} alt="" className="w-10 h-12 rounded object-cover shrink-0" />
                      <div className="min-w-0">
                        <p className="text-chocolate font-medium line-clamp-1">{p.name}</p>
                        <p className="text-xs text-plum-400">{p.sku}</p>
                      </div>
                      {p.featured && <Badge variant="champagne">Featured</Badge>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-plum-500 font-sans">{category?.name || "—"}</td>
                  <td className="px-5 py-3 text-chocolate font-sans">{formatNaira(p.price)}</td>
                  <td className="px-5 py-3 text-plum-500 font-sans">{p.stock}</td>
                  <td className="px-5 py-3">
                    <Badge variant={availability === "out-of-stock" ? "danger" : availability === "low-stock" ? "champagne" : "outline"}>
                      {availability === "in-stock" ? "In stock" : availability === "low-stock" ? "Low stock" : "Out of stock"}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/admin/products/${p.id}/edit`} aria-label={`Edit ${p.name}`} className="p-2 text-plum-400 hover:text-plum">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => setConfirmDelete(p.id)} aria-label={`Delete ${p.name}`} className="p-2 text-plum-400 hover:text-red-500">
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
          <p className="text-sm text-plum-400 font-sans px-5 py-10 text-center">No products match your search.</p>
        )}
      </div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete product?">
        <p className="text-sm text-plum-500 font-sans mb-6">
          Are you sure you want to delete <strong>{productToDelete?.name}</strong>? This can't be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            variant="primary"
            fullWidth
            className="!bg-red-500 hover:!bg-red-600"
            onClick={() => {
              if (confirmDelete) deleteProduct(confirmDelete);
              setConfirmDelete(null);
            }}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
