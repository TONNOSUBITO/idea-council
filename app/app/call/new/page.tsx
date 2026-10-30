"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function NewCall() {
  const [asset, setAsset] = useState("BTC"); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const r = useRouter();
  async function go() {
    setBusy(true); setErr("");
    const res = await fetch("/api/calls/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ asset }) });
    const j = await res.json(); setBusy(false);
    if (!res.ok) return setErr(j.error || "errore"); r.push(`/call/${j.event_id}`);
  }
  return (<div className="card max-w-md space-y-3">
    <h1 className="text-lg font-semibold">Nuova call demo (paper)</h1>
    <p className="text-xs text-zinc-400">Max 1 demo_signal al giorno. Se il modello non ha edge → ABSTAIN. Senza XAI_API_KEY viene creata una call MOCK.</p>
    <select className="w-full rounded bg-zinc-800 p-2" value={asset} onChange={(e) => setAsset(e.target.value)}><option>BTC</option><option>XAU</option></select>
    <button className="btn" disabled={busy} onClick={go}>{busy ? "Generazione…" : "Genera call di oggi"}</button>
    {err && <p className="text-sm text-red-400">{err}</p>}
  </div>);
}
