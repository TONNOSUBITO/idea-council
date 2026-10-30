import { z } from "zod";
const tier = z.enum(["primary_official", "wire", "named_journalist", "verified_account", "anonymous"]);
export const Evidence = z.object({
  claim: z.string(), source: z.string().nullable().optional(), tier: tier.optional(),
  timestamp_utc: z.string().nullable().optional(), status: z.enum(["FACT", "UNCONFIRMED", "STALE"]),
});
export const Call = z.object({
  side: z.enum(["long", "short"]),
  entry_zone: z.object({ low: z.number(), high: z.number() }),
  stop: z.number(), take_profit: z.array(z.number()).min(1), invalidation: z.string(),
  max_risk_pct_of_demo: z.number(), reward_risk: z.number(),
  confidence: z.enum(["low", "medium", "high"]).optional(), low_rr_ack: z.boolean().optional(),
});
export const DemoCall = z.object({
  schema: z.literal("DEMO_CALL/v2"),
  event_id: z.string().min(3),
  mode: z.enum(["demo_signal", "research_only"]),
  paper_only: z.boolean(), live_money: z.boolean(), api_demo_orders: z.boolean().default(false),
  asset: z.enum(["BTC", "XAU"]),
  as_of_rome: z.string(), expire_at_rome: z.string(),
  question: z.string(), loop_count: z.number().int(), abstain: z.boolean(),
  thesis: z.string().optional().default(""),
  sentiment: z.object({ score: z.number(), confidence: z.string(), notes: z.string().optional() }).optional(),
  evidence: z.array(Evidence).default([]),
  views: z.object({ bull: z.string(), bear: z.string(), base: z.string() }).partial().optional(),
  probability: z.object({
    event: z.string().optional(), range_low: z.number().nullable().optional(), range_high: z.number().nullable().optional(),
    drivers: z.array(z.string()).optional(), base_rate_note: z.string().optional(), p_error: z.number().nullable().optional(),
  }).optional(),
  price_ref: z.object({ venue: z.string(), mid: z.number(), timestamp_utc: z.string(), url: z.string().optional() }).nullable().optional(),
  call: Call.nullable(),
  human_checklist: z.array(z.string()).optional(),
  platform_hint_phase1: z.string().optional(),
  gate: z.object({ status: z.enum(["PASS", "FAIL"]), reasons: z.array(z.string()) }).optional(),
  gaps: z.array(z.string()).optional(), brief_it: z.string().optional(),
  hard_stop: z.string(),
});
export type DemoCallT = z.infer<typeof DemoCall>;
export const HARD_STOP_DEMO = "Demo signal only. Not investment advice. Human demo execution. No live money. No zero-error promise.";
export const HARD_STOP_RESEARCH = "Informational research only. Not investment advice. No execution.";
