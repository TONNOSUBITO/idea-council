const W = 300, H = 90;
function path(vals: number[], min: number, max: number) {
  if (!vals.length) return "";
  const span = max - min || 1, step = vals.length > 1 ? W / (vals.length - 1) : 0;
  return vals.map((v, i) => `${i ? "L" : "M"}${(i * step).toFixed(1)},${(H - ((v - min) / span) * H).toFixed(1)}`).join(" ");
}
export function Line({ series, min, max, zero }: { series: { vals: number[]; color: string }[]; min?: number; max?: number; zero?: boolean }) {
  const all = series.flatMap((s) => s.vals);
  if (!all.length) return <div className="py-6 text-center text-xs text-zinc-500">Nessun dato ancora.</div>;
  const lo = min ?? Math.min(0, ...all), hi = max ?? Math.max(0, ...all);
  const zy = H - ((0 - lo) / (hi - lo || 1)) * H;
  return (<svg viewBox={`-2 -2 ${W + 4} ${H + 4}`} className="h-24 w-full">
    {zero && <line x1={0} x2={W} y1={zy} y2={zy} stroke="#52525b" strokeDasharray="3 3" />}
    {series.map((s, i) => <path key={i} d={path(s.vals, lo, hi)} fill="none" stroke={s.color} strokeWidth={2} />)}
  </svg>);
}
export function Bars({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (<div className="space-y-1">{data.map((d) => (
    <div key={d.label} className="flex items-center gap-2 text-xs">
      <span className="w-16 text-zinc-400">{d.label}</span>
      <div className="h-3 flex-1 rounded bg-zinc-800"><div className="h-3 rounded" style={{ width: `${(d.value / max) * 100}%`, background: d.color }} /></div>
      <span className="w-6 text-right">{d.value}</span>
    </div>))}</div>);
}
