/** ISO-8601 with Europe/Rome offset, e.g. 2026-10-30T15:18:00+01:00 */
export function romeIso(d = new Date()): string {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "longOffset" }).formatToParts(d).map((p) => [p.type, p.value]));
  const off = (parts.timeZoneName as string).replace("GMT", "") || "+00:00";
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour === "24" ? "00" : parts.hour}:${parts.minute}:${parts.second}${off}`;
}
export const utcIso = (d = new Date()) => d.toISOString().replace(/\.\d{3}Z$/, "Z");
export const romeDay = (d = new Date()) => romeIso(d).slice(0, 10).replace(/-/g, "");
