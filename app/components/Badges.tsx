import type { CallRecord } from "@/lib/store";
export function StatusBadge({ r }: { r: CallRecord }) {
  const [t, c] = r.status === "needs_confirm" ? ["BOZZA SCOUT", "bg-zinc-600"]
    : r.gate.status === "FAIL" ? ["VETO (GATE FAIL)", "bg-red-700"]
    : r.call?.abstain ? ["ABSTAIN", "bg-sky-700"] : ["DEMO CALL", "bg-emerald-700"];
  return <span className={`rounded px-2 py-0.5 text-xs font-bold ${c}`}>{t}{r.source === "mock" ? " · MOCK" : ""}</span>;
}
export const PaperBadge = () => <span className="rounded border border-amber-500 px-2 py-0.5 text-xs font-bold text-amber-400">DEMO PAPER — NOT LIVE — NOT ADVICE</span>;
