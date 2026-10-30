import { notFound } from "next/navigation";
import { getCall } from "@/lib/store";
import { StatusBadge, PaperBadge } from "@/components/Badges";
import { LogForm, RrAck } from "@/components/CallActions";
export const dynamic = "force-dynamic";
export default async function Detail({ params }: { params: Promise<{ event_id: string }> }) {
  const { event_id } = await params; const r = getCall(event_id); if (!r) notFound();
  const c = r.call; const pass = r.gate.status === "PASS";
  const rrPending = !pass && c?.call && r.gate.reasons.every((x) => x.startsWith("reward_risk"));
  const showLevels = pass && c?.mode === "demo_signal" && !c.abstain && c.call; // P1 mode wall
  return (<div className="space-y-4">
    <div className="flex flex-wrap items-center gap-2"><h1 className="text-xl font-semibold">{event_id}</h1><StatusBadge r={r} /><PaperBadge /></div>
    <div className="text-xs text-zinc-400">Creata {r.created_at_rome} (Roma) · {r.created_at_utc} (UTC) · fonte {r.source}</div>
    {r.status === "needs_confirm" && <div className="card">Bozza Scout dal job giornaliero: non è una call. Vai su “Nuova call” per generarla tu.</div>}
    {!pass && !rrPending && r.status === "ready" && <div className="card border-red-700"><h2 className="font-bold text-red-400">VETO — nessun livello mostrato</h2><ul className="list-disc pl-5 text-sm">{r.gate.reasons.map((x) => <li key={x}>{x}</li>)}</ul></div>}
    {rrPending && c?.call && <div className="card border-amber-600"><RrAck id={event_id} rr={c.call.reward_risk} /></div>}
    {pass && c?.abstain && <div className="card border-sky-700"><h2 className="text-lg font-bold text-sky-300">ABSTAIN — oggi nessun trade</h2><p className="text-sm">{c.thesis}</p></div>}
    {showLevels && c?.call && <div className="card border-emerald-700 text-sm space-y-1">
      <h2 className="font-bold">Livelli DEMO ({c.call.side.toUpperCase()})</h2>
      <div>Entry zone: {c.call.entry_zone.low} – {c.call.entry_zone.high}</div><div>Stop: {c.call.stop}</div>
      <div>Take profit: {c.call.take_profit.join(" / ")}</div><div>R:R {c.call.reward_risk}{r.low_rr_ack ? ` (ack ${r.low_rr_ack.ack_by} ${r.low_rr_ack.ack_at_rome})` : ""} · rischio max {c.call.max_risk_pct_of_demo}% del demo</div>
      <div>Invalidazione: {c.call.invalidation}</div><div>Scade: {c.expire_at_rome}</div>
      {c.price_ref && <div>Prezzo rif.: {c.price_ref.mid} ({c.price_ref.venue}, {c.price_ref.timestamp_utc})</div>}
    </div>}
    {c?.brief_it && <div className="card whitespace-pre-wrap text-sm"><h2 className="mb-1 font-semibold">Brief</h2>{c.brief_it}</div>}
    {c?.evidence?.length ? <div className="card"><h2 className="mb-1 font-semibold">Evidenze</h2><table className="w-full"><tbody>{c.evidence.map((e, i) => <tr key={i}><td>{e.status}</td><td>{e.claim}</td><td className="break-all">{e.source ?? "—"}</td><td>{e.timestamp_utc ?? "—"}</td></tr>)}</tbody></table></div> : null}
    {r.status === "ready" && <div className="card"><h2 className="mb-2 font-semibold">Esito</h2>{r.log ? <p className="text-sm">{r.log.result} · R {r.log.R_multiple ?? "—"} · {r.log.notes} · {r.log.operator_id} @ {r.log.logged_at_rome}</p> : <LogForm id={event_id} tradeable={!!showLevels} />}</div>}
    <details className="card"><summary className="cursor-pointer">JSON</summary><pre className="overflow-auto text-xs">{JSON.stringify(c ?? { gate: r.gate, raw_reply: r.raw_reply }, null, 2)}</pre></details>
  </div>);
}
