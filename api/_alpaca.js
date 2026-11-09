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
