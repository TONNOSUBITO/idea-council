/** Phase 2 placeholder. NO order placement is implemented in this MVP.
 *  Any future demo order code MUST go through assertDemoAllowed(). */
import { getSettings } from "./store";
export const BYBIT_ALLOWLIST = ["api-demo.bybit.com"] as const;
export function assertDemoAllowed(url: string) {
  const s = getSettings();
  if (s.kill_switch || !s.api_demo_orders) throw new Error("demo orders disabled (kill switch / settings)");
  if (!BYBIT_ALLOWLIST.includes(new URL(url).host as (typeof BYBIT_ALLOWLIST)[number])) throw new Error("host not allowlisted: only api-demo.bybit.com");
}
