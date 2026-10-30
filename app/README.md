# Idea Council — Demo Desk (MVP)
DEMO / PAPER ONLY. Not investment advice. No live trading code exists in this app.

## Run locally
```bash
npm i && npm run dev   # http://localhost:3000
```
Optional `.env.local` (see `.env.example`):
- `XAI_API_KEY` — enables real Grok calls (server-side only; never NEXT_PUBLIC). Without it, `/api/calls/generate` returns a labeled MOCK abstain call.
- `XAI_MODEL` (default `grok-4`)
- `APP_PASSWORD` + `SESSION_SECRET` — sir-only login (if unset, local access is open).
- `INTERNAL_SECRET` / `CRON_SECRET` — required for `/api/internal/scout-draft`.
- `OPERATOR_ID` (default `sir`) — written into every log/ack.

## Pages
`/` dashboard (n, abstain rate, gate FAIL rate; win-rate/Brier highlighted only after ≥20 scored) · `/call/new` · `/call/[event_id]` · `/log` (+ CSV export) · `/settings` (Phase 2 kill-switch) · `/login`

## API
- `POST /api/calls/generate` `{asset?: "BTC"|"XAU"}` — Grok + Zod schema + server risk gate (`lib/gate.ts`). FAIL ⇒ levels stripped (veto only). R:R<1 ⇒ hidden until operator ack.
- `GET /api/calls` · `PATCH /api/calls/[id]/log` `{result: WIN|LOSS|BE|SKIPPED, R_multiple?, notes?}` (abstain/FAIL ⇒ only SKIPPED)
- `POST /api/calls/[id]/ack` `{confirm:true}` — low_rr_ack with ack_by + ISO Rome ts
- `GET /api/calls/export` CSV · `GET|POST /api/settings`
- `GET|POST /api/internal/scout-draft` (secret) — daily cron creates a `needs_confirm` Scout draft only; never a DEMO_CALL.

## Storage
JSON file `data/calls.json` (gitignored) = source of truth locally. On Vercel it falls back to `/tmp` (ephemeral, red banner). Before real use on Vercel, swap `lib/store.ts` to KV/Postgres/Blob.

## Deploy (Vercel)
Import the repo, set Root Directory = `app`, set env vars above (APP_PASSWORD mandatory in prod), deploy. `vercel.json` schedules the Scout draft cron at 07:00 UTC.

## Prompt
`lib/system-prompt.ts` is generated from `../GROK_COMPLETE_PROMPT.md` (v2.1). Regenerate after edits:
`node -e 'const fs=require("fs");fs.writeFileSync("lib/system-prompt.ts","export const SYSTEM_PROMPT = "+JSON.stringify(fs.readFileSync("../GROK_COMPLETE_PROMPT.md","utf8"))+";\n")'`
