# DEMO_CALL — first-call TEMPLATE (not executed)
Fill at runtime with live Scout data. Do not invent mid prices.

```json
{
  "schema": "DEMO_CALL/v2",
  "event_id": "btc-demo-YYYYMMDD-01",
  "mode": "demo_signal",
  "paper_only": true,
  "live_money": false,
  "api_demo_orders": false,
  "asset": "BTC",
  "as_of_rome": "TBD",
  "expire_at_rome": "TBD (+4 to +24h typical)",
  "question": "Does current evidence support a demo long/short BTC within entry_zone before expire?",
  "loop_count": 0,
  "abstain": false,
  "thesis": "TBD from evidence",
  "sentiment": { "score": 0, "confidence": "low", "notes": "TBD" },
  "evidence": [],
  "views": {
    "bull": { "summary": "TBD", "supports": [] },
    "bear": { "summary": "TBD", "supports": [] },
    "base": { "summary": "TBD", "supports": [] }
  },
  "probability": {
    "event": "TBD",
    "range_low": null,
    "range_high": null,
    "drivers": [],
    "base_rate_note": "TBD",
    "p_error": null
  },
  "price_ref": { "venue": "TBD", "mid": null, "source": "TBD", "timestamp_utc": "TBD" },
  "call": {
    "side": "long",
    "entry_zone": { "low": null, "high": null },
    "stop": null,
    "take_profit": [null],
    "invalidation": "TBD",
    "max_risk_pct_of_demo": 0.5,
    "reward_risk": null,
    "confidence": "low",
    "low_rr_ack": false,
    "risk_band_override": false
  },
  "human_checklist": [
    "Confirm DEMO account (not live)",
    "Size from max_risk_pct_of_demo and stop distance",
    "Place SL and TP before or with entry",
    "Do not chase if price left entry_zone",
    "Respect expire_at; cancel if thesis invalidated",
    "Log WIN/LOSS/BE + note when closed or expired"
  ],
  "platform_hint_phase1": "TradingView Paper | MT5 demo | Bybit Demo app (human click)",
  "platform_hint_phase2": "Bybit Demo API (disabled)",
  "gate": { "status": "PASS", "reasons": [] },
  "gaps": ["Template only — awaiting Scout fill + J.A.R.V.I.S. close before first execution"],
  "hard_stop": "Demo signal only. Not investment advice. Human demo execution. No live money. No zero-error promise."
}
```
