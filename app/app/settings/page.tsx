"use client";
import { useEffect, useState } from "react";
type S = { api_demo_orders: boolean; kill_switch: boolean; updated_at_rome?: string; updated_by?: string };
export default function Settings() {
  const [s, setS] = useState<S | null>(null);
  useEffect(() => { fetch("/api/settings").then((r) => r.json()).then(setS); }, []);
  async function save(n: S) { setS(await (await fetch("/api/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(n) })).json()); }
  if (!s) return <p>…</p>;
  return (<div className="card max-w-lg space-y-3 text-sm">
    <h1 className="font-semibold">Fase 2 — Bybit Demo API (non implementata in MVP)</h1>
    <p className="text-zinc-400">Solo host consentito: api-demo.bybit.com. Nessun codice live. Nessuna chiave exchange nel browser. Oggi l'invio ordini non esiste: queste impostazioni sono il cancello per il futuro.</p>
    <label className="flex gap-2"><input type="checkbox" checked={s.kill_switch} onChange={(e) => save({ ...s, kill_switch: e.target.checked })} /> Kill-switch attivo (blocca tutto)</label>
    <label className="flex gap-2"><input type="checkbox" disabled={s.kill_switch} checked={s.api_demo_orders} onChange={(e) => save({ ...s, api_demo_orders: e.target.checked })} /> api_demo_orders (default OFF)</label>
    <p className="text-xs text-zinc-500">Ultima modifica: {s.updated_at_rome ?? "—"} {s.updated_by ?? ""}</p>
  </div>);
}
