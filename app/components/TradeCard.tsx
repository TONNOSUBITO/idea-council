import Link from "next/link";
import type { CallRecord } from "@/lib/store";
export default function TradeCard({ c }: { c: CallRecord }) {
  const k = c.call!, t = k.call!;
  return (<Link href={`/call/${c.event_id}`} className="card block hover:bg-zinc-800">
    <div className="flex justify-between text-sm"><b>{k.asset} {t.side === "long" ? "LONG ▲" : "SHORT ▼"}</b><span className="text-xs text-zinc-400">{c.log?.result ?? "OPEN"} · scade {k.expire_at_rome}</span></div>
    <div className="mt-1 grid grid-cols-2 gap-1 text-xs md:grid-cols-4">
      <span>Entry {t.entry_zone.low}–{t.entry_zone.high}</span><span className="text-red-400">SL {t.stop}</span>
      <span className="text-emerald-400">TP {t.take_profit.join(" / ")}</span><span>R:R {t.reward_risk} · rischio {t.max_risk_pct_of_demo}%</span>
    </div>
    <div className="mt-1 text-xs text-zinc-500">{c.event_id} · {c.created_at_rome}</div>
  </Link>);
}
