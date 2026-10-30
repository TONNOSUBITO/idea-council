import Link from "next/link";
import { listCalls } from "@/lib/store";
import { isPossibleTrade } from "@/lib/stats";
import ScoutButton from "@/components/ScoutButton";
import TradeCard from "@/components/TradeCard";
export const dynamic = "force-dynamic";
export default function Scout() {
  const calls = listCalls();
  const trades = calls.filter(isPossibleTrade);
  const drafts = calls.filter((c) => c.status === "needs_confirm");
  const abstains = calls.filter((c) => c.status === "ready" && c.gate.status === "PASS" && c.call?.abstain);
  const fails = calls.filter((c) => c.status === "ready" && c.gate.status === "FAIL");
  return (<div className="space-y-6">
    <div className="rounded bg-amber-500 p-3 text-center font-bold text-black">DEMO PAPER — NOT LIVE — NOT ADVICE</div>
    <section className="card space-y-2"><h1 className="text-lg font-semibold">Scout / Trade desk</h1>
      <p className="text-xs text-zinc-400">Solo demo_signal paper. Se non c'è edge → ABSTAIN (nessun trade). Esecuzione manuale su conto demo.</p>
      <ScoutButton /></section>
    {drafts.length > 0 && <section className="card border border-amber-500"><h2 className="mb-2 font-semibold text-amber-400">Bozze scout da confermare ({drafts.length})</h2>
      <p className="mb-2 text-xs text-zinc-400">Create dal cron: NON sono call. Premi “Avvia scout” per generarne una.</p>
      <ul className="text-sm">{drafts.map((d) => <li key={d.event_id}><Link className="underline" href={`/call/${d.event_id}`}>{d.event_id}</Link> · {d.created_at_rome}</li>)}</ul></section>}
    <section><h2 className="mb-2 font-semibold">Trade possibili (gate PASS, demo_signal)</h2>
      <div className="space-y-2">{trades.map((c) => <TradeCard key={c.event_id} c={c} />)}
        {!trades.length && <div className="card text-sm text-zinc-500">Nessun trade possibile al momento.</div>}</div></section>
    <section className="card"><h2 className="mb-2 font-semibold">Nessun trade (ABSTAIN)</h2>
      <ul className="space-y-1 text-xs">{abstains.map((c) => <li key={c.event_id}><Link className="underline" href={`/call/${c.event_id}`}>{c.event_id}</Link> — {(c.call?.gaps ?? []).join("; ") || c.call?.brief_it || "edge insufficiente"}</li>)}
        {!abstains.length && <li className="text-zinc-500">—</li>}</ul></section>
    {fails.length > 0 && <section className="card"><h2 className="mb-2 font-semibold">Gate FAIL (veto)</h2>
      <ul className="space-y-1 text-xs">{fails.map((c) => <li key={c.event_id}><Link className="underline" href={`/call/${c.event_id}`}>{c.event_id}</Link> — {c.gate.reasons.join("; ")}</li>)}</ul></section>}
  </div>);
}
