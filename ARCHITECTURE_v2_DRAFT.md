# Idea Council — Architecture draft v2 (DEMO)
Status: DRAFT pending research pack from J.A.R.V.I.S. Not live. Not for sir until pack merged into PROMPT_MASTER_v2.

## Goal (sir via J.A.R.V.I.S.)
- Bot produces **DEMO_CALL** → sir executes on a **demo** account.
- Optional later: bot places demo orders via API (out of scope until sir asks + platform chosen).
- Start asset: **BTC** (default for liquidity + news density); XAU secondary.
- “Completo senza errori” → **fail-safe gates + tracking**, never a zero-error promise.

## Modes (mutex)
| Mode | Entry/SL/TP/size | Audience | Live money |
|---|---|---|---|
| `research_only` | FORBIDDEN (v1.1 HARD #8) | Internal brief | Never |
| `demo_signal` | ALLOWED only if `paper_only=true` AND `live_money=false` | Sir executes on demo | Never |

Switch: explicit `mode` field. Missing mode → treat as `research_only`.

## Hard locks (both modes)
- No live money; no guaranteed tips; no market manipulation help.
- No redistribute as client/social/paid without legal review.
- No inventing prices/URLs/timestamps.
- Single unverified X ≠ FACT.
- ATECO ≠ authorization for third-party financial research.

## DEMO_CALL lifecycle
1. Scout checklist (v1.1 hygiene + staleness) → EvidencePack.
2. Synthesizer single-pass (week-1 style until Brier≥20): bull/bear/base + sentiment.
3. If `mode=demo_signal`: build **DEMO_CALL** block (entry_zone, stop, take_profit, invalidation, max_risk_pct_of_demo, R:R, expire_at).
4. Risk gate (extended for demo_signal — see below).
5. Deliver call to sir (via J.A.R.V.I.S. / agreed channel) with human execution checklist.
6. Log outcome WIN/LOSS/BE + notes → Brier + win-rate.
7. Go-live threshold: **default NEVER** until sir explicitly says yes after N logged demo trades.

## Risk gate — demo_signal FAIL (any)
Inherits v1.1 FACT/source/hard_stop/loop rules, plus:
- `mode!=demo_signal` but entry/SL/TP/size present → FAIL
- `live_money=true` or `paper_only=false` → FAIL
- Missing entry_zone OR stop OR invalidation OR expire_at OR max_risk_pct_of_demo → FAIL
- max_risk_pct_of_demo outside operator band (default 0.25–1.0% of demo equity per call) → FAIL
- R:R < 1.0 without explicit `low_rr_ack=true` in call → FAIL
- expire_at ≤ as_of → FAIL
- Price levels without sourced mid/ref timestamp → FAIL
- Any language implying live capital or guaranteed profit → FAIL

## DEMO_CALL JSON (draft schema)
```json
{
  "schema": "DEMO_CALL/v2",
  "event_id": "...",
  "mode": "demo_signal",
  "paper_only": true,
  "live_money": false,
  "asset": "BTC",
  "as_of_rome": "...",
  "expire_at_rome": "...",
  "thesis": "...",
  "sentiment": { "score": 0, "confidence": "low|medium|high", "notes": "..." },
  "evidence": [{ "claim": "...", "source": "...", "tier": "...", "timestamp_utc": "...", "status": "FACT|UNCONFIRMED|STALE" }],
  "abstain": false,
  "call": {
    "side": "long|short",
    "entry_zone": { "low": null, "high": null, "ref_mid": null, "ref_source": "...", "ref_ts_utc": "..." },
    "stop": null,
    "take_profit": [null],
    "invalidation": "...",
    "max_risk_pct_of_demo": 0.5,
    "reward_risk": null,
    "confidence": "low|medium|high",
    "p_error": null
  },
  "human_checklist": [
    "Confirm demo account (not live)",
    "Confirm size from max_risk_pct_of_demo and stop distance",
    "Set SL and TP before entry",
    "Do not chase if price left entry_zone",
    "Log WIN/LOSS/BE + note when closed or expired"
  ],
  "gate": { "status": "PASS|FAIL", "reasons": [] },
  "hard_stop": "Demo signal only. Not investment advice. No live execution by the bot."
}
```

## Prompt stack
- Keep v1.1 as `research_only` baseline.
- v2 adds `demo_signal` module + DEMO_CALL schema + execution checklist + logging contract.
- Education material: only public legal sources (IG Academy, Babypips-level risk basics, CME gold edu, exchange docs). No paywall piracy. TGIR deferred until sir provides link.

## MVP (pending pack)
- 1 DEMO_CALL / day (BTC preferred).
- Human demo execution + outcome log.
- No API orders week-1.
- Platform choice from J.A.R.V.I.S. ranking pack.

## Open (blocked on pack)
- [ ] Demo platform ranking + API notes
- [ ] BTC/XAU primer bullets (public sources only)
- [ ] Sentiment source shortlist
- [ ] Default N for go-live discussion (still requires sir yes)


## Status 2026-10-30
PROMPT_MASTER_v2.md written from J.A.R.V.I.S. pack. Awaiting CEO close before first executed call.
