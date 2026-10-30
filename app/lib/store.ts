import fs from "fs";
import path from "path";
import { DemoCallT } from "./schema";

export type Outcome = "WIN" | "LOSS" | "BE" | "SKIPPED";
export type CallStatus = "needs_confirm" | "ready";
export interface CallRecord {
  event_id: string;
  status: CallStatus; // needs_confirm = cron Scout draft (never tradeable)
  source: "xai" | "mock" | "cron_draft";
  created_at_rome: string; created_at_utc: string;
  gate: { status: "PASS" | "FAIL"; reasons: string[] };
  call: DemoCallT | null; // null for FAIL (veto only) payloads
  raw_reply?: string;
  low_rr_ack?: { ack_by: string; ack_at_rome: string };
  log?: { result: Outcome; R_multiple?: number | null; notes?: string; operator_id: string; logged_at_rome: string; logged_at_utc: string };
}
export interface Settings { api_demo_orders: boolean; kill_switch: boolean; updated_at_rome?: string; updated_by?: string }
interface DB { calls: CallRecord[]; settings: Settings }

export const EPHEMERAL = !!process.env.VERCEL;
const FILE = EPHEMERAL ? "/tmp/idea-council-calls.json" : path.join(process.cwd(), "data", "calls.json");
const empty: DB = { calls: [], settings: { api_demo_orders: false, kill_switch: true } };

function read(): DB {
  try { const d = JSON.parse(fs.readFileSync(FILE, "utf8")); return { ...empty, ...d, settings: { ...empty.settings, ...d.settings } }; }
  catch { return structuredClone(empty); }
}
function write(db: DB) { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(db, null, 2)); }

export const listCalls = () => read().calls.sort((a, b) => b.created_at_utc.localeCompare(a.created_at_utc));
export const getCall = (id: string) => read().calls.find((c) => c.event_id === id);
export function upsertCall(rec: CallRecord) { const db = read(); db.calls = db.calls.filter((c) => c.event_id !== rec.event_id); db.calls.push(rec); write(db); }
export function nextEventId(asset: string, day: string, prefix = "demo") {
  const n = read().calls.filter((c) => c.event_id.startsWith(`${asset.toLowerCase()}-${prefix}-${day}`)).length + 1;
  return `${asset.toLowerCase()}-${prefix}-${day}-${String(n).padStart(2, "0")}`;
}
export const getSettings = () => read().settings;
export function setSettings(s: Settings) { const db = read(); db.settings = s; write(db); }
