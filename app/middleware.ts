import { NextRequest, NextResponse } from "next/server";
// Lightweight gate: real HMAC verification happens in route handlers/pages (Node runtime).
export function middleware(req: NextRequest) {
  if (!process.env.APP_PASSWORD) return NextResponse.next();
  const p = req.nextUrl.pathname;
  if (p.startsWith("/login") || p.startsWith("/api/login") || p.startsWith("/api/internal") || p.startsWith("/_next")) return NextResponse.next();
  if (!req.cookies.get("ic_session")) {
    if (p.startsWith("/api")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}
export const config = { matcher: ["/((?!favicon.ico).*)"] };
