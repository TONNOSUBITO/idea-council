import { NextResponse } from "next/server";
import { isAuthed } from "./auth";
export async function guard() { return (await isAuthed()) ? null : NextResponse.json({ error: "unauthorized" }, { status: 401 }); }
