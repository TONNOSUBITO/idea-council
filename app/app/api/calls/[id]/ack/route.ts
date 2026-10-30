import { NextResponse } from "next/server";
import { getCall, upsertCall } from "@/lib/store";
import { guard } from "@/lib/guard";
import { operatorId } from "@/lib/auth";
import { runGate } from "@/lib/gate";
import { romeIso } from "@/lib/time";
/** Operator acknowledges reward_risk < 1. Only path that sets low_rr_ack=true. */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await guard(); if (g) return g;
  const { id } = await params; const rec = getCall(id);
  if (!rec?.call?.call) return NextResponse.json({ error: "no call" }, { status: 404 });
  const b = await req.json().catch(() => ({}));
  if (b.confirm !== true) return NextResponse.json({ error: "confirm required" }, { status: 400 });
  rec.call.call.low_rr_ack = true;
  rec.low_rr_ack = { ack_by: operatorId(), ack_at_rome: romeIso() };
  rec.gate = runGate(rec.call);
  if (rec.gate.status === "FAIL") rec.call.call = null;
  upsertCall(rec); return NextResponse.json(rec);
}
