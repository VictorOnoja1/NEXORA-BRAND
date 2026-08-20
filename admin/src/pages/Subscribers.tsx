import { useState, useMemo } from "react";
import { Search, Mail, Copy, Download, Trash2, CheckCircle2, UserX } from "lucide-react";
import { useSubscriberStore } from "@shared/store/subscriberStore";
import { useUIStore } from "@shared/store/uiStore";
import { StatCard } from "../components/StatCard";

export default function AdminSubscribers() {
  const subscribers = useSubscriberStore((s) => s.subscribers);
  const removeSubscriber = useSubscriberStore((s) => s.removeSubscriber);
  const toggleStatus = useSubscriberStore((s) => s.toggleStatus);
  const showToast = useUIStore((s) => s.showToast);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "unsubscribed">("all");

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((sub) => {
      const matchesSearch = sub.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === "all" || sub.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, search, filterStatus]);

  const activeCount = useMemo(() => subscribers.filter((s) => s.status === "active").length, [subscribers]);
  const unsubscribedCount = useMemo(() => subscribers.filter((s) => s.status === "unsubscribed").length, [subscribers]);

  const handleCopyEmails = () => {
    const activeEmails = subscribers
      .filter((s) => s.status === "active")
      .map((s) => s.email)
      .join(", ");

    if (!activeEmails) {
      showToast("No active subscriber emails to copy.", "info");
      return;
    }

    navigator.clipboard.writeText(activeEmails);
    showToast(`Copied ${activeCount} active subscriber email(s) to clipboard!`, "success");
  };

  const handleExportCSV = () => {
    if (subscribers.length === 0) {
      showToast("No subscribers to export.", "info");
      return;
    }

    const headers = ["ID", "Email", "Status", "SubscribedAt"];
    const rows = subscribers.map((s) => [s.id, s.email, s.status, s.subscribedAt]);
    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexora-subscribers-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("Exported subscribers to CSV!", "success");
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Newsletter Subscribers</h1>
          <p className="text-sm text-plum-400 font-sans">
            Manage your newsletter audience, export email lists, and monitor subscription status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyEmails}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-ivory border border-plum-200 text-chocolate text-xs font-semibold hover:bg-plum-50 transition-colors"
          >
            <Copy size={14} />
            Copy Emails
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-plum text-ivory text-xs font-semibold hover:bg-plum-800 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Total Audience"
          value={subscribers.length.toString()}
          icon={Mail}
          tone="plum"
        />
        <StatCard
          label="Active Subscribers"
          value={activeCount.toString()}
          icon={CheckCircle2}
          tone="champagne"
        />
        <StatCard
          label="Unsubscribed"
          value={unsubscribedCount.toString()}
          icon={UserX}
          tone="rose"
        />
      </div>


      {/* CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-plum-300" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email address..."
            className="w-full bg-ivory border border-plum-200 rounded pl-9 pr-3 py-2 text-sm text-chocolate placeholder:text-plum-300 focus:outline-none focus:border-plum"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-plum-50 p-1 rounded-md border border-plum-100 self-start sm:self-auto">
          {(["all", "active", "unsubscribed"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 text-xs font-medium rounded capitalize transition-colors ${
                filterStatus === st
                  ? "bg-plum text-ivory shadow-xs"
                  : "text-plum-400 hover:text-chocolate"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* SUBSCRIBERS TABLE */}
      <div className="border border-plum-100 rounded-lg overflow-hidden overflow-x-auto bg-ivory">
        <table className="w-full text-sm min-w-[600px]">
          <thead>
            <tr className="text-left text-xs text-plum-400 border-b border-plum-100 bg-blush/10">
              <th className="px-5 py-3 font-medium">Email Address</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Subscribed Date</th>
              <th className="px-5 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscribers.map((sub) => (
              <tr key={sub.id} className="border-b border-plum-50 last:border-0 hover:bg-blush/10">
                <td className="px-5 py-3.5 text-chocolate font-medium">{sub.email}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      sub.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        sub.status === "active" ? "bg-emerald-500" : "bg-gray-400"
                      }`}
                    />
                    {sub.status === "active" ? "Active" : "Unsubscribed"}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-plum-400 font-sans text-xs">
                  {new Date(sub.subscribedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        toggleStatus(sub.id);
                        showToast(`Status changed to ${sub.status === "active" ? "unsubscribed" : "active"}`, "info");
                      }}
                      className="text-xs text-plum-400 hover:text-plum underline transition-colors"
                    >
                      {sub.status === "active" ? "Mark Unsubscribed" : "Mark Active"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove ${sub.email} from subscribers?`)) {
                          removeSubscriber(sub.id);
                          showToast("Subscriber removed", "info");
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Delete subscriber"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubscribers.length === 0 && (
          <div className="py-12 text-center">
            <Mail size={32} className="mx-auto text-plum-200 mb-2" />
            <p className="text-sm font-medium text-chocolate">No subscribers found</p>
            <p className="text-xs text-plum-400 mt-1 font-sans">
              {search ? `No subscriber matched "${search}"` : "Subscribers will appear here when visitors sign up."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
