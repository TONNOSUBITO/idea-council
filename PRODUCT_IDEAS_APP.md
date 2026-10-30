# Idea Council App — Idee prodotto (1 pagina)
Status: **PASS-with-fixes Giulia applicate (P1–P8)** — 2026-10-30. Non live. Non contattare sir.
Allinea Grok 1–9 + War Room P1–P8. Prompt: `/workspace/idea-council/PROMPT_MASTER_v2.md` (embed). Pack: [`DESIGN_APP_REVIEW_PACK.md`](./DESIGN_APP_REVIEW_PACK.md).

## Posizionamento
Web app Next.js (`/workspace/idea-council/app`): Scout → gate → DEMO_CALL / abstain; brief IT + checklist; log outcome. Prompt versionato = source of truth; l’app esegue e **persiste** (DB), non riscrive regole a runtime.

## MVP vs v1.1

| Area | MVP | v1.1 (dopo ≥20 call scored / Brier) |
|---|---|---|
| Pipeline | Scout single-pass + Synthesizer + gate in-code | Multi-agent opzionale se Brier≥20 |
| Esecuzione | Phase 1 human (TV Paper / Bybit Demo app / MT5) | Phase 2 Bybit Demo API — flag UI off by default (**P7**) |
| Cadenza | Max 1 `demo_signal`/giorno; cron = draft only (**P2**) | Soft quota + stats senza hero win-rate finché n<20 (**P8**) |
| Asset | BTC | XAU su finestra macro |
| Persistenza | **DB = source of truth**; CSV solo export (**P3**) | Dashboard n, abstain%, gate FAIL%, Brier |
| Auth | Sessione sir-only; events autenticati (**P4**) | — |
| Prompt | Embed `PROMPT_MASTER_v2` + Zod; checklist P5 | Hot-reload version bump |

**Fuori scope MVP:** soldi reali, path live, share pubblico, prediction markets, scrape X fuori ToS, auto DEMO_CALL da cron.

## P1 — Mode wall
- `research_only`: schema **senza** entry_zone/stop/TP/max_risk; UI non li renderizza (HARD #8).
- `demo_signal`: livelli solo se `gate=PASS` e `abstain=false`; badge fisso **DEMO PAPER — NOT LIVE — NOT ADVICE**.
- Header: mode, `paper_only=true`, `live_money=false` locked, asset, `as_of` ISO8601 Europe/Rome.

## UI call
1. `Nuova call` / conferma draft → Scout run; toggle research_only.
2. Abstain → banner “non entrare” + gaps; PASS demo → entry_zone, stop, TP[], invalidation, max_risk_pct, expire_at, R:R.
3. Brief IT + JSON Zod collassabile; gate panel (FAIL = niente livelli).
4. Checklist umana → outcome WIN/LOSS/BE/SKIPPED → **DB** con `operator_id` + as_of Rome (**P3**).
5. Hard stop in footer. Nessun CTA go-live.

## P2 — Trigger Scout
- Manuale: `call demo BTC oggi` o conferma operator.
- Cron 1×/giorno Europe/Rome: crea solo **Scout draft** `needs_confirm` (se quota>0). **Mai** auto DEMO_CALL.
- v1.1: keyword wire → draft, non call.
- Thin evidence → abstain; BTC narrative >72h senza reconfirm = STALE.

## P3 — Persistenza
DB unico SoT per brief, gate, evidence, outcomes. CSV = export. Ogni outcome: `operator_id`, ISO8601+offset Rome.

## P4 — Auth / logger
- Login sir-only MVP. Nessun secret in `NEXT_PUBLIC_*`.
- `POST /internal/events`: shared secret o mTLS; reject anon (call_created, gate_fail, abstain, outcome).
- Secrets Grok/X/Bybit solo env server.

## P5 — Prompt release checklist (verificata)
Path: `/workspace/idea-council/PROMPT_MASTER_v2.md` (+ paste `GROK_COMPLETE_PROMPT.md`).
- [x] Refusal **8**: no price targets/entry/exit/size in `research_only`
- [x] Refusal **9**: no redistribute client/social/paid senza legal review
- [x] `FACT|UNCONFIRMED|STALE`, `abstain`, `loop_count`, `event_id`, `gate`
- [x] Range width ≥0.20 su **P(event)**; staleness 72h BTC / 7d gold
- [x] Levels solo `demo_signal` + paper_only + !live_money

## P6 — low_rr_ack
R:R<1 → FAIL salvo toggle + **confirm modale**; log `ack_by` + timestamp. Senza ack → FAIL (allinea Grok #5).

## P7 — Bybit Phase 2
- `api_demo_orders` default **false**; enable solo da **settings UI** (azione sir), non messaggio bot.
- Kill-switch one-click → human-only.
- Host allowlist: solo `api-demo.bybit.com`. Size da `max_risk_pct_of_demo` etichettato PAPER.
- Price_ref: CoinGecko / Bybit public / Binance spot public — **mai** testnet.

## P8 — Stats
Prima di n≥20 / Brier: **niente** win-rate come hero. Mostra n, abstain rate, gate FAIL rate; Brier solo se n≥20. Go-live mai da stats.

## X / Grok
| Canale | Uso | Regole |
|---|---|---|
| Grok | Synthesizer + gate; system = prompt embedded | JSON tipizzato; P(event)≥0.20 |
| X official / Grok Bot tools | Scout post_id + ts | 1 X ≠ FACT; rate in DB |
| News | Wire/RSS | url + timestamp_utc |
| Price | Allowlist sopra | mid+source+ISO; inventato = FAIL |

## Non-goal
App ≠ consulenza; demo ≠ live; ATECO ≠ licenza. Secondo sguardo Giulia solo se cambia Phase2 o compare path live.

---
## Implemented MVP (2026-10-30) — `app/`
Giulia P1–P8 applied: mode wall (levels only demo_signal + gate PASS + !abstain); cron = Scout draft needs_confirm only; JSON store = source of truth + CSV export, logs with operator_id + ISO Rome; sir password session + internal secret, no NEXT_PUBLIC secrets; prompt v2.1 embedded; low_rr_ack toggle+modal with ack_by/ts; Bybit phase2 = settings gate + kill-switch + allowlist api-demo.bybit.com (no order code); stats show n/abstain/FAIL rate, win-rate/Brier emphasised only at n≥20.
