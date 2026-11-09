import Alpaca from "@alpacahq/alpaca-trade-api";
const KEY = process.env.ALPACA_KEY;
const SECRET = process.env.ALPACA_SECRET;
const PAPER = process.env.ALPACA_PAPER !== "false";
export const isLive = Boolean(KEY && SECRET);
export function getClient() {
  if (!isLive) return null;
  return new Alpaca({ keyId: KEY, secretKey: SECRET, paper: PAPER, usePolygon: false });
}
export function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}
export function handleOptions(req, res) {
  if (req.method === "OPTIONS") { setCors(res); res.status(200).end(); return true; }
  return false;
}
const PRICE_FLOOR = { NFLX: 400 };
const PRICE_CEIL = { AMD: 400 };
export function safetyCheck(symbol, price) {
  if (PRICE_CEIL[symbol] != null && price > PRICE_CEIL[symbol]) return `PRICE SANITY FAILED — ${symbol} $${price} > $${PRICE_CEIL[symbol]}`;
  if (PRICE_FLOOR[symbol] != null && price < PRICE_FLOOR[symbol]) return `PRICE SANITY FAILED — ${symbol} $${price} < $${PRICE_FLOOR[symbol]}`;
  return null;
}
// Trading Gate v2.4 - Capital Preservation (was missing in edited file)
export function tradingGate({ dailyLoss, totalRisk, score, hasSL, rr, positions, consecutiveLosses, regime, expectancy }) {
  if (dailyLoss >= 0.01) return "DAILY_STOP";
  if (totalRisk >= 0.015) return "BLOCK_EXPOSURE";
  if (consecutiveLosses >= 3) return "COOLDOWN";
  if (regime === "CRISIS") return "BLOCK_REGIME";
  if (expectancy !== undefined && expectancy !== null && expectancy < 0) return "BLOCK_EXPECTANCY_NEGATIVE";
  if (score < 65) return "WAIT";
  if (!hasSL) return "BLOCK_NO_STOP";
  if (rr < 2.0) return "BLOCK_LOW_RR";
  if (positions >= 3) return "BLOCK_MAX_POSITIONS";
  return "ALLOW";
}
// Position Size v2.3 fix: Risk / |Entry-SL|
export function positionSize({ equity, riskPct, entry, sl }) {
  const riskAmount = equity * riskPct;
  const dist = Math.abs(entry - sl);
  if (dist <= 0) return 0;
  let qty = riskAmount / dist;
  const maxExposure = equity * 0.02;
  if (qty * entry > maxExposure) qty = maxExposure / entry;
  return qty;
}
