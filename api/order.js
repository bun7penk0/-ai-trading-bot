import { getClient, isLive, setCors, handleOptions, safetyCheck, tradingGate } from "./_alpaca.js";
export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { symbol, side, qty, type = "market", limitPrice, lastPrice, score, hasSL, rr, dailyLoss, totalRisk, positions, consecutiveLosses, regime, expectancy } = req.body || {};
  if (!symbol || !side || !qty) return res.status(400).json({ error: "Missing symbol / side / qty" });
  const gate = tradingGate({ dailyLoss: dailyLoss || 0, totalRisk: totalRisk || 0, score: score ?? 100, hasSL: hasSL !== false, rr: rr ?? 2, positions: positions || 0, consecutiveLosses: consecutiveLosses || 0, regime: regime || "UNKNOWN", expectancy: expectancy ?? null });
  if (gate !== "ALLOW") return res.status(422).json({ error: gate, blocked: true, mode: isLive ? "LIVE" : "SIM" });
  if (lastPrice != null) {
    const fail = safetyCheck(symbol, Number(lastPrice));
    if (fail) return res.status(422).json({ error: fail, blocked: true, mode: isLive ? "LIVE" : "SIM" });
  }
  if (!isLive) return res.status(200).json({ mode: "SIM", message: "Alpaca keys not configured — order simulated", order: { symbol, side, qty, type, status: "simulated" } });
  try {
    const client = getClient();
    const orderParams = { symbol, qty: String(qty), side: String(side).toLowerCase(), type: type === "limit" ? "limit" : "market", time_in_force: "day" };
    if (type === "limit" && limitPrice != null) orderParams.limit_price = String(limitPrice);
    const order = await client.createOrder(orderParams);
    return res.status(200).json({ mode: "LIVE", order });
  } catch (err) { return res.status(500).json({ error: err.message || "Order failed", mode: "LIVE" }); }
}
