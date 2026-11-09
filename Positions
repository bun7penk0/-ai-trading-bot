import { getClient, isLive, setCors, handleOptions } from "./_alpaca.js";
export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!isLive) return res.status(200).json({ mode: "SIM", positions: [] });
  try {
    const client = getClient();
    const positions = await client.getPositions();
    const normalized = (positions || []).map((p) => ({ symbol: p.symbol, qty: Number(p.qty), avgEntry: Number(p.avg_entry_price), currentPrice: Number(p.current_price), marketValue: Number(p.market_value), unrealizedPl: Number(p.unrealized_pl), side: Number(p.qty) >= 0 ? "LONG" : "SHORT" }));
    return res.status(200).json({ mode: "LIVE", positions: normalized });
  } catch (err) { return res.status(500).json({ error: err.message || "Fetch positions failed", mode: "LIVE" }); }
}
