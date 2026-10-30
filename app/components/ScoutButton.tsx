"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function ScoutButton() {
  const [asset, setAsset] = useState("BTC"); const [busy, setBusy] = useState(false); const [err, setErr] = useState("");
  const r = useRouter();
  async function go() {
    setBusy(true); setErr("");
    const res = await fetch("/api/calls/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ asset }) });
    const j = await res.json().catch(() => ({})); setBusy(false);
    if (!res.ok) return setErr(j.error || "errore"); r.push(`/call/${j.event_id}`);
  }
  return (<div className="flex flex-wrap items-center gap-2">
    <select className="rounded bg-zinc-800 p-2" value={asset} onChange={(e) => setAsset(e.target.value)}><option>BTC</option><option>XAU</option></select>
    <button className="btn text-lg" disabled={busy} onClick={go}>{busy ? "Scouting…" : "▶ Avvia scout / genera call di oggi"}</button>
    {err && <span className="text-sm text-red-400">{err}</span>}
  </div>);
}
