import { NextResponse } from "next/server";
import { listCalls } from "@/lib/store";
import { guard } from "@/lib/guard";
export const dynamic = "force-dynamic";
export async function GET() { const g = await guard(); if (g) return g; return NextResponse.json(listCalls()); }
