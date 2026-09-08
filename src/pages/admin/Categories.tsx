import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useCategoryStore } from "../../store/categoryStore";
import { useProductStore } from "../../store/productStore";
import { useUIStore } from "../../store/uiStore";
import type { CategorySlug } from "../../types";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

export default function AdminCategories() {
  const categories = useCategoryStore((s) => s.categories);
  const addCategory = useCategoryStore((s) => s.addCategory);
  const updateCategory = useCategoryStore((s) => s.updateCategory);
  const deleteCategory = useCategoryStore((s) => s.deleteCategory);
  const loadCategories = useCategoryStore((s) => s.loadCategories);
  const products = useProductStore((s) => s.products);
  const showToast = useUIStore((s) => s.showToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", descriptor: "", image: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  function openAdd() {
    setEditingId(null);
    setForm({ name: "", descriptor: "", image: categories[0]?.image || "" });
    setModalOpen(true);
  }

  function openEdit(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setForm({ name: cat.name, descriptor: cat.descriptor, image: cat.image });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateCategory(editingId, { name: form.name, descriptor: form.descriptor, image: form.image });
        showToast("Category updated");
      } else {
        await addCategory({ name: form.name, descriptor: form.descriptor, image: form.image, slug: "" as CategorySlug });
        showToast("Category added");
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      showToast("Could not save this category. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteCategory(id);
      showToast("Category deleted");
    } catch (err) {
      console.error(err);
      showToast("Could not delete this category. Please try again.");
    }
  }

  const categoryToDelete = categories.find((c) => c.id === confirmDelete);
  const productCountFor = (slug: string) => products.filter((p) => p.categorySlug === slug).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Categories</h1>
          <p className="text-sm text-black font-sans">{categories.length} categories</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openAdd} fullWidth className="sm:w-auto">Add Category</Button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => (
          <div key={c.id} className="border border-plum-100 rounded-lg overflow-hidden">
            <img src={c.image} alt="" className="w-full h-28 object-cover" />
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-serif text-lg text-chocolate">{c.name}</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(c.id)} aria-label={`Edit ${c.name}`} className="p-1.5 text-black hover:text-black">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirmDelete(c.id)} aria-label={`Delete ${c.name}`} className="p-1.5 text-black hover:text-red-500">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-black mb-2 font-sans">{c.descriptor}</p>
              <p className="text-xs text-black">{productCountFor(c.slug)} products</p>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="cat-name">Name</label>
            <input id="cat-name" required className="w-full border border-plum-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-plum" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="cat-desc">Descriptor</label>
            <input id="cat-desc" className="w-full border border-plum-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-plum" value={form.descriptor} onChange={(e) => setForm({ ...form, descriptor: e.target.value })} placeholder="Short tagline shown on the card" />
          </div>
          <div>
            <label className="text-xs font-medium text-black mb-1.5 block" htmlFor="cat-img">Image URL</label>
            <input id="cat-img" className="w-full border border-plum-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-plum" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </div>
          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Saving…" : editingId ? "Save Changes" : "Add Category"}
          </Button>
        </form>
      </Modal>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete category?">
        <p className="text-sm text-black font-sans mb-6">
          Are you sure you want to delete <strong>{categoryToDelete?.name}</strong>? Products in this category will remain but won't be grouped under it.
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
