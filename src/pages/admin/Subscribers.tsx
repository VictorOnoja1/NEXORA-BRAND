import { useEffect, useState } from "react";
import { Search, Trash2, AlertTriangle, Mail } from "lucide-react";
import { isSupabaseConfigured } from "../../lib/supabase";
import { fetchSubscribers, deleteSubscriber, type Subscriber } from "../../lib/api";
import { useUIStore } from "../../store/uiStore";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";

// -----------------------------------------------------------------------
// Real admin view of newsletter signups — reads the `subscribers` table
// (admin-only per RLS, see schema_additions.sql) via src/lib/api.ts. There
// is no local/offline fallback here: before this feature, there was no
// subscribers list at all (the homepage form didn't store anything), so
// there's no pre-existing local behavior to preserve — this page simply
// requires Supabase to be configured.
// -----------------------------------------------------------------------

export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const showToast = useUIStore((s) => s.showToast);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchSubscribers()
      .then((data) => {
        if (!cancelled) setSubscribers(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load subscribers. Please refresh to try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(query.toLowerCase()));
  const subscriberToDelete = subscribers.find((s) => s.id === confirmDelete);

  async function handleConfirmDelete() {
    if (!confirmDelete) return;
    const id = confirmDelete;
    setDeleting(true);
    try {
      await deleteSubscriber(id);
      setSubscribers((prev) => prev.filter((s) => s.id !== id));
      showToast("Subscriber removed");
    } catch (err) {
      console.error(err);
      showToast("Could not remove this subscriber. Please try again.");
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Subscribers</h1>
        <div className="flex items-start gap-3 bg-champagne/25 border border-champagne rounded p-4 mt-5 max-w-lg">
          <AlertTriangle size={18} className="text-black shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-chocolate">Not connected yet</p>
            <p className="text-xs text-black mt-1 font-sans">
              Subscribers are stored in Supabase. Configure VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY to see
              newsletter signups here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Subscribers</h1>
          <p className="text-sm text-black font-sans">{subscribers.length} newsletter subscribers</p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 bg-rose/10 border border-rose/40 text-black text-sm font-sans rounded px-3 py-2.5 mb-5">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-black" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative max-w-sm mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by email…"
          className="w-full border border-plum-200 rounded pl-10 pr-4 py-2.5 text-sm text-chocolate placeholder:text-black focus:outline-none focus:border-plum"
        />
      </div>

      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto">
        <table className="w-full text-sm min-w-[480px]">
          <thead>
            <tr className="text-left text-xs text-black border-b border-plum-100 bg-blush/10">
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Subscribed</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2 text-chocolate font-medium">
                    <Mail size={14} className="text-black" />
                    {s.email}
                  </div>
                </td>
                <td className="px-5 py-3 text-black font-sans">
                  {new Date(s.subscribedAt).toLocaleDateString()}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => setConfirmDelete(s.id)}
                      aria-label={`Remove ${s.email}`}
                      className="p-2 text-black hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">
            {subscribers.length === 0 ? "No subscribers yet." : "No subscribers match your search."}
          </p>
        )}
        {loading && (
          <p className="text-sm text-black font-sans px-5 py-10 text-center">Loading subscribers…</p>
        )}
      </div>

      <Modal open={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Remove subscriber?">
        <p className="text-sm text-black font-sans mb-6">
          Are you sure you want to remove <strong>{subscriberToDelete?.email}</strong> from the newsletter list?
        </p>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button
            variant="primary"
            fullWidth
            className="!bg-red-500 hover:!bg-red-600"
            disabled={deleting}
            onClick={handleConfirmDelete}
          >
            {deleting ? "Removing…" : "Remove"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
