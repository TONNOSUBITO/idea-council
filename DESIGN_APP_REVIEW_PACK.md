# Idea Council App — Design review pack (per Giulia PASS/FAIL)
Status: delivery per J.A.R.V.I.S. → War Room. Non live. Non contattare sir.
Data: 2026-10-30 Europe/Rome.

## (1) Path file
| Ruolo | Path |
|---|---|
| **Questo pack (review)** | `/workspace/idea-council/DESIGN_APP_REVIEW_PACK.md` |
| Idee prodotto (1 pagina) | `/workspace/idea-council/PRODUCT_IDEAS_APP.md` |
| Prompt runtime embedded | `/workspace/idea-council/PROMPT_MASTER_v2.md` |
| Paste Grok (patch in corso) | `/workspace/idea-council/GROK_COMPLETE_PROMPT.md` |
| Schema / template call | `/workspace/idea-council/DEMO_CALL_TEMPLATE_first.md` |
| Scaffold Next.js | `/workspace/idea-council/app/` |
| Log outcome | `/workspace/idea-council/logs/demo_calls.csv` |

## (2) Tabella risposte — 9 buchi Grok.com

| # | Buco Grok.com | Risposta design / app |
|---|---|---|
| 1 | Risk gate punta a `PROMPT_MASTER_v2` assente | Gate **in-code** (modulo TypeScript) + testo prompt **embedded** nel bundle server (copy da `PROMPT_MASTER_v2.md` al build). Nessun `require` di path esterno a runtime. |
| 2 | Conflitto no-live vs go-live da stats | Stats **read-only**. Nessun CTA/auto-promote a live. `live_money` locked `false` in UI/API. Go-live solo flag operator **esterno** (sir via J.A.R.V.I.S.), mai derivato da win-rate. |
| 3 | JSON senza tipi | Schema **Zod + OpenAPI** `DEMO_CALL/v2` e research brief; validazione pre-UI; FAIL se tipi mancanti. |
| 4 | Range ≥0.20 non dice su cosa | Regola + UI label: width ≥0.20 su **P(event)** dichiarato in `probability.event`, **non** sul prezzo. Altrimenti `abstain=true`, no livelli. |
| 5 | `low_rr_ack` vs FAIL | Se R:R < 1.0 → **FAIL** salvo `low_rr_ack=true` con confirm UI esplicito; altrimenti gate FAIL, niente livelli. |
| 6 | Limiti non persistono tra chat | Quota 1 `demo_signal`/giorno + rate X/Grok in **DB** (non memoria chat). Contatori sopravvivono alle sessioni. |
| 7 | Binance fonte vs testnet | Allowlist price_ref: CoinGecko, Bybit **public**, Binance **spot public**. **Mai** Binance Testnet / book demo come truth. Phase2 ordini solo `api-demo.bybit.com`. |
| 8 | J.A.R.V.I.S. logger indefinito | Contratto: `POST /internal/events` (call_created, gate_fail, abstain, outcome). App non assume lettura chat Grok. |
| 9 | Manca ISO8601+offset Rome | Tutti i datetime utente: ISO8601 con offset Europe/Rome (`+01:00`/`+02:00`); storage UTC + campi `as_of_rome` / `expire_at_rome` etichettati. |

## (3) Criteri Giulia A–G — come li rispettiamo
Eccezione documentata (sir override): in `mode=demo_signal` con `paper_only=true` e `live_money=false` sono **ammessi** entry_zone / stop / take_profit / max_risk_pct_of_demo. In `research_only` resta HARD #8 (niente livelli/size). Non è live.

| Criterio | Rispetto design | Note / gap MVP |
|---|---|---|
| **A) NO LIVE** | Nessun path UI/API ordini reali. Buy/Sell solo ledger paper / checklist umana Phase1. `PAPER_MODE` default; LIVE assente dal codice v1. Phase2 Bybit **Demo** API solo con flag + OK sir. Audit log tentativi. | Must MVP. |
| **B) SICUREZZA API KEY** | Secrets solo env server/vault; mai client/`NEXT_PUBLIC`. Auth sir-only v1; CSRF; rate limit LLM. News/X e output modello = untrusted. Nessuna API key in UI. | Must MVP. |
| **C) GATE IN APP** | Modulo gate obbligatorio prima del brief tradeable; FAIL → solo reasons. Disclaimer fisso; share off / watermark INTERNAL. **research_only:** hard block target/size/entry/exit. **demo_signal (eccezione sir):** livelli paper-only consentiti sotto gate demo; UI banner DEMO; hard_stop demo obbligatorio. | Eccezione C esplicita — non confondere con live. |
| **D) CALIBRAZIONE / LOGGER** | `event_id` stabile; persistenza brief+gate+outcome in DB/CSV; Brier dopo esiti; range 0.20 / abstain; dashboard bucket in v1.1. Logger → JARVIS. | CSV+DB MVP; dashboard Brier in v1.1. |
| **E) UX ABSTAIN** | Abstain first-class (banner “non entrare” + gaps). Stati FACT\|UNCONFIRMED\|STALE\|ABSTAIN\|GATE_FAIL. Niente promozione a FACT senza nuova evidence. Low conf / low_rr senza semaforo verde. | Must MVP. |
| **F) TIPI / CONTRATTI** | Zod/OpenAPI; campi gate, abstain, loop_count, event_id, fact.status obbligatori. UTC storage + Rome display. Checklist go-live esterna (demo only finché incomplete). | Must MVP. |
| **G) MVP 7g** | Must: paper ledger/checklist, gate, abstain UX, persistenza+logger, BTC, no live paths, 1 call/giorno. Cut: multi-agent fan-out, prediction markets, Binance write, share pubblico, Phase2 finché flag off. | Allineato. |

### Sintesi per verdetto
Design risponde ai 9 buchi e copre A–G con **unica eccezione documentata** su C (demo_signal paper levels). Pronto per PASS / FAIL / PASS-with-fixes di Giulia.

## (4) War Room P1–P8 — applicate in PRODUCT_IDEAS_APP.md (2026-10-30)
| Patch | Stato nel design |
|---|---|
| P1 Mode wall | research_only senza livelli UI/schema; demo badge DEMO PAPER |
| P2 Cron | draft `needs_confirm` only; no auto DEMO_CALL |
| P3 Persistenza | DB SoT; CSV export; outcome + operator_id |
| P4 Auth | sir-only; events shared secret; no NEXT_PUBLIC secrets |
| P5 Prompt | Checklist OK su PROMPT_MASTER_v2 + GROK_COMPLETE (refusals 8–9 + gate fields) |
| P6 low_rr_ack | modal + ack_by log |
| P7 Bybit P2 | flag UI default false; kill-switch; api-demo.bybit.com only |
| P8 Stats | no hero win-rate finché n<20 |

