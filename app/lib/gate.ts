import { DemoCallT, HARD_STOP_DEMO, HARD_STOP_RESEARCH } from "./schema";
const SOCIAL = /(x\.com|twitter\.com|t\.me|reddit\.com)/i;
/** Server-side risk gate. Mirrors GROK_COMPLETE_PROMPT.md v2.1. Model's own gate is never trusted alone. */
export function runGate(c: DemoCallT): { status: "PASS" | "FAIL"; reasons: string[] } {
  const r: string[] = [];
  if (c.paper_only !== true || c.live_money !== false) r.push("paper_only must be true and live_money false");
  if (c.loop_count > 2) r.push("loop_count > 2");
  const facts = c.evidence.filter((e) => e.status === "FACT");
  for (const f of facts) {
    if (!f.source || !f.timestamp_utc) r.push(`FACT without source+timestamp: ${f.claim.slice(0, 60)}`);
  }
  const nonSocialFacts = facts.filter((f) => f.source && !SOCIAL.test(f.source));
  if (facts.length && !nonSocialFacts.length) r.push("FACTs backed only by X/social");
  const text = JSON.stringify(c).toLowerCase();
  if (/\b(you should|dovresti comprare|dovresti vendere)\b/.test(text)) r.push("personalized 2nd-person advice");
  if (/testnet/.test((c.price_ref?.venue ?? "") + (c.price_ref?.url ?? ""))) r.push("price_ref from testnet");
  const expected = c.mode === "research_only" ? HARD_STOP_RESEARCH : HARD_STOP_DEMO;
  if (c.hard_stop.trim() !== expected) r.push("hard_stop line missing/incorrect");
  if (Date.parse(c.expire_at_rome) <= Date.parse(c.as_of_rome)) r.push("expire_at_rome <= as_of_rome");
  if (c.abstain && c.call) r.push("abstain=true but call not null");
  if (c.mode === "research_only" && c.call) r.push("research_only must not contain levels");
  const p = c.probability;
  if (!c.abstain) {
    if (!p || p.range_low == null || p.range_high == null) r.push("probability range missing");
    else {
      const strong = facts.some((f) => f.tier === "primary_official") || facts.filter((f) => f.tier === "wire").length >= 2;
      if (p.range_high - p.range_low < 0.2 && !strong) r.push("probability width < 0.20 without strong support");
    }
  }
  if (c.mode === "demo_signal" && !c.abstain) {
    const k = c.call;
    if (!k) r.push("non-abstain demo_signal without call");
    else {
      if (!c.price_ref) r.push("price_ref missing");
      if (k.entry_zone.low > k.entry_zone.high) r.push("entry_zone low > high");
      if (k.side === "long" && !(k.stop < k.entry_zone.low)) r.push("long stop not below entry");
      if (k.side === "short" && !(k.stop > k.entry_zone.high)) r.push("short stop not above entry");
      if (k.max_risk_pct_of_demo < 0.25 || k.max_risk_pct_of_demo > 1) r.push("max_risk_pct_of_demo outside [0.25,1.0]");
      if (k.reward_risk < 1 && k.low_rr_ack !== true) r.push("reward_risk < 1 without low_rr_ack (operator must ack)");
    }
  }
  return { status: r.length ? "FAIL" : "PASS", reasons: r };
}
