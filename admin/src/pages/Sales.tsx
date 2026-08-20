import { useMemo, useState } from "react";
import { useOrderStore } from "@shared/store/orderStore";
import { formatNaira } from "@shared/lib/format";
import { StatCard } from "../components/StatCard";
import { Wallet, ShoppingCart, TrendingUp, Table2 } from "lucide-react";

const PLUM = "#4A2634";
const PLUM_SOFT = "rgba(74,38,52,0.12)";
const GRID = "#EADFE1";

function niceMax(value: number) {
  if (value <= 0) return 10;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const n = value / pow;
  const niceN = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return niceN * pow;
}

export default function AdminSales() {
  const orders = useOrderStore((s) => s.orders);
  const [showTable, setShowTable] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const completedOrders = orders.filter((o) => o.status !== "cancelled");
  const revenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const avgOrderValue = completedOrders.length ? revenue / completedOrders.length : 0;

  // Last 14 days of revenue
  const days = useMemo(() => {
    const arr: { label: string; date: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      arr.push({
        label: d.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
        date: dateStr,
        value: 0,
      });
    }
    for (const o of completedOrders) {
      const dateStr = o.createdAt.slice(0, 10);
      const day = arr.find((d) => d.date === dateStr);
      if (day) day.value += o.total;
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders]);

  const maxVal = niceMax(Math.max(...days.map((d) => d.value), 1));
  const chartHeight = 220;
  const barSlot = 100 / days.length;

  const revenueByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of completedOrders) {
      for (const item of o.items) {
        map.set(item.name, (map.get(item.name) || 0) + item.price * item.quantity);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [completedOrders]);
  const maxCategoryVal = Math.max(...revenueByCategory.map(([, v]) => v), 1);

  return (
    <div>
      <h1 className="font-serif text-2xl md:text-3xl text-chocolate mb-1">Sales</h1>
      <p className="text-sm text-plum-400 mb-6 font-sans">Revenue and order performance overview.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatNaira(revenue)} icon={Wallet} tone="plum" />
        <StatCard label="Completed Orders" value={String(completedOrders.length)} icon={ShoppingCart} tone="champagne" />
        <StatCard label="Avg. Order Value" value={formatNaira(Math.round(avgOrderValue))} icon={TrendingUp} tone="rose" />
      </div>

      <div className="border border-plum-100 rounded-lg p-5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-serif text-lg text-chocolate">Revenue — Last 14 Days</h2>
          <button
            onClick={() => setShowTable((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-plum-400 hover:text-plum"
          >
            <Table2 size={13} /> {showTable ? "View chart" : "View as table"}
          </button>
        </div>

        {showTable ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-plum-400 border-b border-plum-100">
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium text-right">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d) => (
                  <tr key={d.date} className="border-b border-plum-50 last:border-0">
                    <td className="py-2 text-plum-500 font-sans">{d.label}</td>
                    <td className="py-2 text-chocolate text-right font-sans">{formatNaira(d.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="relative">
            <svg viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none" className="w-full" style={{ height: chartHeight }}>
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={t}
                  x1={0}
                  x2={100}
                  y1={chartHeight - 24 - t * (chartHeight - 40)}
                  y2={chartHeight - 24 - t * (chartHeight - 40)}
                  stroke={GRID}
                  strokeWidth={0.5}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
              {days.map((d, i) => {
                const barW = barSlot * 0.55;
                const x = i * barSlot + (barSlot - barW) / 2;
                const h = maxVal > 0 ? (d.value / maxVal) * (chartHeight - 40) : 0;
                const y = chartHeight - 24 - h;
                const isHover = hoverIndex === i;
                return (
                  <g key={d.date}>
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={Math.max(h, 1)}
                      rx={1.2}
                      fill={isHover ? PLUM : d.value > 0 ? PLUM : PLUM_SOFT}
                      opacity={d.value > 0 ? 1 : 0.5}
                      onMouseEnter={() => setHoverIndex(i)}
                      onMouseLeave={() => setHoverIndex(null)}
                      style={{ cursor: "pointer", transition: "fill 0.15s" }}
                    />
                  </g>
                );
              })}
              <line x1={0} x2={100} y1={chartHeight - 24} y2={chartHeight - 24} stroke={GRID} strokeWidth={1} vectorEffect="non-scaling-stroke" />
            </svg>
            <div className="flex text-[9px] text-plum-300 font-sans mt-1">
              {days.map((d, i) => (
                <div key={d.date} style={{ width: `${barSlot}%` }} className="text-center truncate">
                  {i % 2 === 0 ? d.label : ""}
                </div>
              ))}
            </div>
            {hoverIndex !== null && (
              <div className="absolute top-0 right-0 bg-chocolate text-ivory text-xs rounded px-3 py-2 pointer-events-none">
                <p className="font-medium">{days[hoverIndex].label}</p>
                <p>{formatNaira(days[hoverIndex].value)}</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border border-plum-100 rounded-lg p-5">
        <h2 className="font-serif text-lg text-chocolate mb-5">Top Products by Revenue</h2>
        {revenueByCategory.length === 0 ? (
          <p className="text-sm text-plum-400 font-sans py-6 text-center">No sales recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {revenueByCategory.map(([name, value]) => (
              <div key={name} className="flex items-center gap-3">
                <p className="text-xs text-plum-500 font-sans w-40 shrink-0 truncate">{name}</p>
                <div className="flex-1 h-5 bg-plum-50 rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-plum rounded-sm"
                    style={{ width: `${Math.max((value / maxCategoryVal) * 100, 3)}%` }}
                  />
                </div>
                <p className="text-xs text-chocolate font-sans w-24 text-right shrink-0">{formatNaira(value)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
