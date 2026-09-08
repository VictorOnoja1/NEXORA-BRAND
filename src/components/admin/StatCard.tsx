import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "plum" | "champagne" | "rose";
}

const tones = {
  plum: "bg-plum text-ivory",
  champagne: "bg-champagne-dark text-black",
  rose: "bg-rose text-ivory",
};

const accents = {
  plum: "before:bg-plum",
  champagne: "before:bg-champagne-dark",
  rose: "before:bg-rose",
};

export function StatCard({ label, value, icon: Icon, tone = "plum" }: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden border border-plum-100 rounded-lg p-5 bg-ivory shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 before:absolute before:inset-x-0 before:top-0 before:h-[3px] ${accents[tone]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-medium text-black uppercase tracking-widest2">{label}</p>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-soft shrink-0 ${tones[tone]}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="font-serif text-[1.65rem] leading-none text-chocolate">{value}</p>
    </div>
  );
}
