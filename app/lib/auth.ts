import crypto from "crypto";
import { cookies } from "next/headers";
export const COOKIE = "ic_session";
const secret = () => process.env.SESSION_SECRET || process.env.APP_PASSWORD || "dev-only-secret";
export const sign = (v: string) => `${v}.${crypto.createHmac("sha256", secret()).update(v).digest("hex")}`;
export function verify(tok?: string) {
  if (!tok) return false; const i = tok.lastIndexOf("."); if (i < 0) return false;
  const exp = sign(tok.slice(0, i)); return exp.length === tok.length && crypto.timingSafeEqual(Buffer.from(exp), Buffer.from(tok));
}
/** Sir-only MVP session. If APP_PASSWORD unset (local dev), access is open. */
export async function isAuthed() {
  if (!process.env.APP_PASSWORD) return true;
  return verify((await cookies()).get(COOKIE)?.value);
}
export const operatorId = () => process.env.OPERATOR_ID || "sir";
export function internalOk(req: Request) {
  const s = process.env.INTERNAL_SECRET || process.env.CRON_SECRET;
  if (!s) return false;
  const h = req.headers.get("x-internal-secret") || req.headers.get("authorization")?.replace(/^Bearer /, "");
  return h === s;
}
