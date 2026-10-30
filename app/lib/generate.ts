import { SYSTEM_PROMPT } from "./system-prompt";
import { DemoCall, DemoCallT, HARD_STOP_DEMO } from "./schema";
import { runGate } from "./gate";
import { romeIso, romeDay, utcIso } from "./time";
import { CallRecord, nextEventId } from "./store";

export function extractJson(text: string): unknown {
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const body = fence ? fence[1] : text;
  const s = body.indexOf("{"), e = body.lastIndexOf("}");
  if (s < 0 || e < s) throw new Error("no JSON object in reply");
  return JSON.parse(body.slice(s, e + 1));
}

export function mockCall(event_id: string): DemoCallT {
  const now = new Date();
  return {
    schema: "DEMO_CALL/v2", event_id, mode: "demo_signal", paper_only: true, live_money: false, api_demo_orders: false,
    asset: "BTC", as_of_rome: romeIso(now), expire_at_rome: romeIso(new Date(now.getTime() + 864e5)),
    question: "[MOCK] Nessuna XAI_API_KEY configurata: c'è un edge demo BTC nelle prossime 24h?",
    loop_count: 0, abstain: true,
    thesis: "MOCK — dati non reali. Senza modello e fonti fresche il sistema astiene (nessun livello).",
    sentiment: { score: 0, confidence: "low", notes: "MOCK" },
    evidence: [{ claim: "MOCK: nessuna fonte raccolta (XAI_API_KEY mancante)", source: null, tier: "anonymous", timestamp_utc: null, status: "UNCONFIRMED" }],
    views: { bull: "MOCK", bear: "MOCK", base: "MOCK" },
    probability: { event: "MOCK", range_low: null, range_high: null, drivers: [], base_rate_note: "n/a", p_error: null },
    price_ref: null, call: null,
    human_checklist: ["Logga SKIPPED", "Imposta XAI_API_KEY per call reali"],
    platform_hint_phase1: "TradingView Paper / Bybit Demo app",
    gate: { status: "PASS", reasons: ["abstain (mock)"] }, gaps: ["MOCK: nessun dato reale"],
    brief_it: "MOCK ABSTAIN — configura XAI_API_KEY. Nessuna call.", hard_stop: HARD_STOP_DEMO,
  };
}

export async function generate(asset: "BTC" | "XAU" = "BTC"): Promise<CallRecord> {
  const event_id = nextEventId(asset, romeDay());
  const base = { event_id, status: "ready" as const, created_at_rome: romeIso(), created_at_utc: utcIso() };
  const key = process.env.XAI_API_KEY;
  if (!key) {
    const c = mockCall(event_id);
    return { ...base, source: "mock", call: c, gate: runGate(c) };
  }
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: process.env.XAI_MODEL || "grok-4",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `demo_signal call di oggi asset=${asset}. event_id=${event_id}. as_of_rome=${base.created_at_rome}. Rispondi con il JSON DEMO_CALL/v2.` },
      ],
    }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`xAI ${res.status}: ${text.slice(0, 300)}`);
  const reply: string = JSON.parse(text).choices?.[0]?.message?.content ?? "";
  let parsed: unknown;
  try { parsed = extractJson(reply); } catch (e) {
    return { ...base, source: "xai", call: null, raw_reply: reply, gate: { status: "FAIL", reasons: [`parse: ${(e as Error).message}`] } };
  }
  const z = DemoCall.safeParse({ ...(parsed as object), event_id, api_demo_orders: false });
  if (!z.success) {
    return { ...base, source: "xai", call: null, raw_reply: reply, gate: { status: "FAIL", reasons: z.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).slice(0, 10) } };
  }
  const gate = runGate(z.data);
  // FAIL => veto only: strip levels
  const onlyRr = gate.status === "FAIL" && gate.reasons.every((r) => r.startsWith("reward_risk"));
  const call = gate.status === "FAIL" && !onlyRr ? { ...z.data, call: null } : z.data; // rr-only FAIL kept (hidden) for operator ack
  return { ...base, source: "xai", call, raw_reply: reply, gate };
}
