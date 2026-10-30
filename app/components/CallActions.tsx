"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function LogForm({ id, tradeable }: { id: string; tradeable: boolean }) {
  const r = useRouter(); const [res, setRes] = useState(tradeable ? "WIN" : "SKIPPED"); const [R, setR] = useState(""); const [notes, setNotes] = useState(""); const [err, setErr] = useState("");
  async function send(result: string) {
    const x = await fetch(`/api/calls/${id}/log`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ result, R_multiple: R === "" ? null : Number(R), notes }) });
    if (!x.ok) setErr((await x.json()).error); else r.refresh();
  }
  if (!tradeable) return <button className="btn" onClick={() => send("SKIPPED")}>Log SKIPPED</button>;
  return (<div className="flex flex-wrap items-center gap-2">
    <select className="rounded bg-zinc-800 p-1" value={res} onChange={(e) => setRes(e.target.value)}>{["WIN", "LOSS", "BE", "SKIPPED"].map((o) => <option key={o}>{o}</option>)}</select>
    <input className="w-24 rounded bg-zinc-800 p-1" placeholder="R multiple" value={R} onChange={(e) => setR(e.target.value)} />
    <input className="flex-1 rounded bg-zinc-800 p-1" placeholder="note" value={notes} onChange={(e) => setNotes(e.target.value)} />
    <button className="btn" onClick={() => send(res)}>Salva esito</button>{err && <span className="text-red-400 text-sm">{err}</span>}
  </div>);
}
export function RrAck({ id, rr }: { id: string; rr: number }) {
  const r = useRouter(); const [on, setOn] = useState(false); const [modal, setModal] = useState(false);
  async function ack() { await fetch(`/api/calls/${id}/ack`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ confirm: true }) }); setModal(false); r.refresh(); }
  return (<div className="space-y-2 text-sm">
    <p>Reward/Risk {rr} &lt; 1: gate FAIL finché non confermi esplicitamente.</p>
    <label className="flex items-center gap-2"><input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> Accetto R:R basso (solo demo)</label>
    <button className="btn2" disabled={!on} onClick={() => setModal(true)}>Conferma low_rr_ack</button>
    {modal && <div className="fixed inset-0 flex items-center justify-center bg-black/70"><div className="card max-w-sm space-y-3">
      <p>Confermi R:R {rr} &lt; 1 su questa call demo? Verrà registrato con il tuo operator_id e orario.</p>
      <div className="flex gap-2"><button className="btn" onClick={ack}>Sì, confermo</button><button className="btn2" onClick={() => setModal(false)}>Annulla</button></div></div></div>}
  </div>);
}
