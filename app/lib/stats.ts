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
