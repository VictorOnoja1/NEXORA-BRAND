import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "plum" | "champagne" | "rose";
}

const tones = {
  plum: "bg-plum/10 text-plum",
  champagne: "bg-champagne/30 text-plum",
  rose: "bg-rose/25 text-plum",
};

export function StatCard({ label, value, icon: Icon, tone = "plum" }: StatCardProps) {
  return (
    <div className="border border-plum-100 rounded-lg p-5 bg-ivory">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-plum-400 uppercase tracking-wide">{label}</p>
        <div className={`w-9 h-9 rounded-full flex items-center justify-center ${tones[tone]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="font-serif text-2xl text-chocolate">{value}</p>
    </div>
  );
}
