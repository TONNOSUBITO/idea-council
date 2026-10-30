import { NextResponse } from "next/server";
import { getCall, upsertCall, Outcome } from "@/lib/store";
import { guard } from "@/lib/guard";
import { operatorId } from "@/lib/auth";
import { romeIso, utcIso } from "@/lib/time";
const OK: Outcome[] = ["WIN", "LOSS", "BE", "SKIPPED"];
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard(); if (g) return g;
  const { id } = await params; const rec = getCall(id);
  if (!rec) return NextResponse.json({ error: "not found" }, { status: 404 });
  const b = await req.json().catch(() => ({}));
  if (!OK.includes(b.result)) return NextResponse.json({ error: "result must be WIN|LOSS|BE|SKIPPED" }, { status: 400 });
  const tradeable = rec.gate.status === "PASS" && rec.call && !rec.call.abstain && rec.call.call;
  if (!tradeable && b.result !== "SKIPPED") return NextResponse.json({ error: "non-tradeable call (abstain/FAIL/draft): only SKIPPED" }, { status: 400 });
  const R = b.R_multiple === undefined || b.R_multiple === "" || b.R_multiple === null ? null : Number(b.R_multiple);
  if (R !== null && !Number.isFinite(R)) return NextResponse.json({ error: "R_multiple must be number" }, { status: 400 });
  rec.log = { result: b.result, R_multiple: R, notes: String(b.notes ?? "").slice(0, 2000), operator_id: operatorId(), logged_at_rome: romeIso(), logged_at_utc: utcIso() };
  upsertCall(rec); return NextResponse.json(rec);
}
