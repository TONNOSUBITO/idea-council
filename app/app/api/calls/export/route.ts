import { listCalls } from "@/lib/store";
import { guard } from "@/lib/guard";
export const dynamic = "force-dynamic";
const q = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export async function GET() {
  const g = await guard(); if (g) return g;
  const rows = [["event_id","asset","mode","status","gate","abstain","side","result","R_multiple","notes","operator_id","logged_at_rome","created_at_rome","created_at_utc"]];
  for (const c of listCalls()) rows.push([c.event_id, c.call?.asset, c.call?.mode, c.status, c.gate.status, c.call?.abstain, c.call?.call?.side, c.log?.result, c.log?.R_multiple, c.log?.notes, c.log?.operator_id, c.log?.logged_at_rome, c.created_at_rome, c.created_at_utc].map(String));
  return new Response(rows.map((r) => r.map(q).join(",")).join("\n"), { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=demo_calls.csv" } });
}
