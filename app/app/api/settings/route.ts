import { NextResponse } from "next/server";
import { getSettings, setSettings } from "@/lib/store";
import { guard } from "@/lib/guard";
import { operatorId } from "@/lib/auth";
import { romeIso } from "@/lib/time";
export const dynamic = "force-dynamic";
export async function GET() { const g = await guard(); if (g) return g; return NextResponse.json(getSettings()); }
export async function POST(req: Request) {
  const g = await guard(); if (g) return g;
  const b = await req.json().catch(() => ({}));
  const kill = b.kill_switch !== false;
  setSettings({ api_demo_orders: !kill && b.api_demo_orders === true, kill_switch: kill, updated_at_rome: romeIso(), updated_by: operatorId() });
  return NextResponse.json(getSettings());
}
