import { NextResponse } from "next/server";
import { generate } from "@/lib/generate";
import { upsertCall } from "@/lib/store";
import { guard } from "@/lib/guard";
export const dynamic = "force-dynamic";
export const maxDuration = 120;
export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const body = await req.json().catch(() => ({}));
  const asset = body?.asset === "XAU" ? "XAU" : "BTC";
  try { const rec = await generate(asset); upsertCall(rec); return NextResponse.json(rec); }
  catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 502 }); }
}
