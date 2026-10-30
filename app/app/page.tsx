import Link from "next/link";
import { listCalls } from "@/lib/store";
import { stats } from "@/lib/stats";
import { StatusBadge } from "@/components/Badges";
export const dynamic = "force-dynamic";
const pct = (x: number) => `${(x * 100).toFixed(0)}%`;
export default function Home() {
  const calls = listCalls(); const s = stats(calls);
  return (<div className="space-y-6">
    <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <div className="card"><div className="text-xs text-zinc-400">Call (n)</div><div className="text-2xl">{s.n}</div></div>
      <div className="card"><div className="text-xs text-zinc-400">Abstain rate</div><div className="text-2xl">{pct(s.abstainRate)}</div></div>
      <div className="card"><div className="text-xs text-zinc-400">Gate FAIL rate</div><div className="text-2xl">{pct(s.failRate)}</div></div>
      <div className="card"><div className="text-xs text-zinc-400">Segnate (WIN/LOSS/BE)</div><div className="text-2xl">{s.scored}/20</div></div>
    </section>
    {s.mature ? (
      <section className="card text-sm">Win-rate {pct(s.winRate ?? 0)} · Expectancy {s.expectancyR?.toFixed(2) ?? "–"}R · Brier {s.brier?.toFixed(3) ?? "–"}</section>
    ) : (
      <section className="card text-xs text-zinc-400">Campione troppo piccolo (&lt;20 call segnate): win-rate {s.winRate === null ? "–" : pct(s.winRate)} non significativo. Brier mostrato da n≥20.</section>
    )}
    <section className="card">
      <div className="mb-2 flex justify-between"><h2 className="font-semibold">Call</h2><Link className="btn" href="/call/new">Genera call di oggi</Link></div>
      <table className="w-full"><thead><tr><th>event_id</th><th>Stato</th><th>Asset</th><th>Creata (Roma)</th><th>Esito</th></tr></thead><tbody>
        {calls.map((c) => <tr key={c.event_id}><td><Link className="underline" href={`/call/${c.event_id}`}>{c.event_id}</Link></td><td><StatusBadge r={c} /></td><td>{c.call?.asset ?? "BTC"}</td><td>{c.created_at_rome}</td><td>{c.log?.result ?? "—"}</td></tr>)}
        {!calls.length && <tr><td colSpan={5} className="text-zinc-500">Nessuna call.</td></tr>}
      </tbody></table>
    </section>
  </div>);
}
