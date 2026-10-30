import Link from "next/link";
import { listCalls } from "@/lib/store";
export const dynamic = "force-dynamic";
export default function Log() {
  const rows = listCalls().filter((c) => c.status === "ready");
  return (<div className="card"><div className="mb-2 flex justify-between"><h1 className="font-semibold">Registro</h1><a className="btn2" href="/api/calls/export">Esporta CSV</a></div>
    <table className="w-full"><thead><tr><th>event_id</th><th>Gate</th><th>Esito</th><th>R</th><th>Note</th><th>Operatore</th><th>Loggato (Roma)</th></tr></thead><tbody>
      {rows.map((c) => <tr key={c.event_id}><td><Link className="underline" href={`/call/${c.event_id}`}>{c.event_id}</Link></td><td>{c.gate.status}{c.call?.abstain ? " · abstain" : ""}</td><td>{c.log?.result ?? "—"}</td><td>{c.log?.R_multiple ?? "—"}</td><td>{c.log?.notes ?? ""}</td><td>{c.log?.operator_id ?? ""}</td><td>{c.log?.logged_at_rome ?? ""}</td></tr>)}
    </tbody></table></div>);
}
