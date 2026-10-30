import type { CallRecord } from "./store";
export function stats(calls: CallRecord[]) {
  const real = calls.filter((c) => c.status === "ready");
  const n = real.length;
  const abstain = real.filter((c) => c.gate.status === "PASS" && c.call?.abstain).length;
  const fail = real.filter((c) => c.gate.status === "FAIL").length;
  const scored = real.filter((c) => c.log && ["WIN", "LOSS", "BE"].includes(c.log.result));
  const wins = scored.filter((c) => c.log!.result === "WIN").length;
  const Rs = scored.map((c) => c.log!.R_multiple).filter((x): x is number => typeof x === "number");
  // Brier: forecast = midpoint of probability range, outcome WIN=1 LOSS=0 (BE excluded)
  const b = scored.filter((c) => c.log!.result !== "BE" && c.call?.probability?.range_low != null && c.call?.probability?.range_high != null)
    .map((c) => { const p = (c.call!.probability!.range_low! + c.call!.probability!.range_high!) / 2; const o = c.log!.result === "WIN" ? 1 : 0; return (p - o) ** 2; });
  return {
    n, abstain, fail, scored: scored.length,
    abstainRate: n ? abstain / n : 0, failRate: n ? fail / n : 0,
    winRate: scored.length ? wins / scored.length : null,
    expectancyR: Rs.length ? Rs.reduce((a, x) => a + x, 0) / Rs.length : null,
    brier: b.length ? b.reduce((a, x) => a + x, 0) / b.length : null,
    mature: scored.length >= 20,
  };
}

const SCORED = ["WIN", "LOSS", "BE"];
/** Chart series derived from call history (oldest → newest). */
export function series(calls: CallRecord[]) {
  const real = calls.filter((c) => c.status === "ready").slice().sort((a, b) => a.created_at_utc.localeCompare(b.created_at_utc));
  let cum = 0;
  const equity = real.filter((c) => c.log && SCORED.includes(c.log.result)).map((c) => {
    const r = typeof c.log!.R_multiple === "number" ? c.log!.R_multiple! : c.log!.result === "WIN" ? 1 : c.log!.result === "LOSS" ? -1 : 0;
    cum += r; return { id: c.event_id, r, cum };
  });
  const counts = { WIN: 0, LOSS: 0, BE: 0, SKIPPED: 0 } as Record<string, number>;
  real.forEach((c) => { if (c.log) counts[c.log.result] = (counts[c.log.result] ?? 0) + 1; });
  let a = 0, f = 0;
  const rates = real.map((c, i) => {
    if (c.gate.status === "PASS" && c.call?.abstain) a++; if (c.gate.status === "FAIL") f++;
    return { id: c.event_id, abstain: a / (i + 1), fail: f / (i + 1) };
  });
  return { equity, counts, rates };
}
export const isPossibleTrade = (c: CallRecord) =>
  c.status === "ready" && c.gate.status === "PASS" && !!c.call && !c.call.abstain && c.call.mode === "demo_signal" && !!c.call.call;
export const isOpen = (c: CallRecord) => isPossibleTrade(c) && !c.log;
