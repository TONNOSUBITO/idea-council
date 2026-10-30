# Idea Council — da zero a prima call (sir)

## 1) Copia il prompt su Grok
1. Apri [grok.com](https://grok.com) (o Grok in X).
2. Incolla **tutto** il file `GROK_COMPLETE_PROMPT.md` in Custom Instructions, oppure come primo messaggio (“usa questo come system”).
3. Aspetta la conferma: `Idea Council v2 online…`
4. Per regole dettagliate tieni anche `PROMPT_MASTER_v2.md` nel repo (riferimento).

Non c’è upload automatico da J.A.R.V.I.S. a Grok: è copia-incolla una tantum. Aggiornamenti = nuova versione sul GitHub → ricopia.

## 2) Apri il conto DEMO (Phase 1 — tu clicchi)
Scegline uno (BTC):
- **TradingView Paper Trading** (più semplice)
- **Bybit Demo** (prezzi come il mercato reale) — [help](https://www.bybit.com/en/help-center/article/Demo-Trading)
- MT5 demo (se vuoi anche oro CFD)

Oro più avanti: OANDA Practice o MT5 XAUUSD.

Verifica sempre di essere su **Demo / Paper**, non Live.

## 3) Chiedi la call
In chat Grok (o qui a J.A.R.V.I.S.): `call demo BTC oggi` oppure `research only BTC`.

Ricevi: brief IT + JSON. Se `abstain=true` → **non entrare**. Se PASS → entry/stop/TP.

## 4) Esegui (checklist)
1. Demo account
2. Size da `max_risk_pct_of_demo` e distanza stop
3. SL e TP insieme all’entry
4. Niente chase fuori `entry_zone`
5. Rispetta `expire_at` e `invalidation`
6. Chiudi e logga WIN / LOSS / BE

## 5) Log
Aggiungi una riga in `logs/demo_calls.csv`:
`event_id,asset,side,result,R_multiple,notes,closed_at_rome`

Dopo ~20 call segnate si valuta se alzare il sistema (multi-agente / API Bybit Demo). **Soldi reali: solo se lo dici esplicitamente tu.**

## 6) Se qualcosa non va
Di’ a J.A.R.V.I.S. il problema → patch sul repo (`PROMPT_MASTER_v2.1…`) → ricopia `GROK_COMPLETE_PROMPT.md` su Grok. Iterazione lenta e tracciata, niente rewrite silenziosi.
