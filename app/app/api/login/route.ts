import { NextResponse } from "next/server";
import { COOKIE, sign } from "@/lib/auth";
export async function POST(req: Request) {
  const f = await req.formData();
  if (!process.env.APP_PASSWORD || f.get("password") !== process.env.APP_PASSWORD)
    return NextResponse.redirect(new URL("/login?err=1", req.url), 303);
  const r = NextResponse.redirect(new URL("/", req.url), 303);
  r.cookies.set(COOKIE, sign(`sir:${Date.now()}`), { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return r;
}
