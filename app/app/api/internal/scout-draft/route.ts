import { NextResponse } from "next/server";
import { internalOk } from "@/lib/auth";
import { upsertCall, nextEventId } from "@/lib/store";
import { romeIso, romeDay, utcIso } from "@/lib/time";
export const dynamic = "force-dynamic";
/** Daily cron (Vercel Cron sends Authorization: Bearer CRON_SECRET). Creates ONLY a Scout draft
 *  with status needs_confirm. It NEVER generates a DEMO_CALL; sir must press "Genera" himself. */
async function handle(req: Request) {
  if (!internalOk(req)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const event_id = nextEventId("BTC", romeDay(), "scout");
  upsertCall({ event_id, status: "needs_confirm", source: "cron_draft", created_at_rome: romeIso(), created_at_utc: utcIso(), gate: { status: "FAIL", reasons: ["Scout draft: needs operator confirm — not a call"] }, call: null });
  return NextResponse.json({ ok: true, event_id, status: "needs_confirm" });
}
export const GET = handle; export const POST = handle;
