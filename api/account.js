import { getClient, isLive, setCors, handleOptions } from "./_alpaca.js";
export default async function handler(req, res) {
  if (handleOptions(req, res)) return;
  setCors(res);
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!isLive) return res.status(200).json({ mode: "SIM", equity: 100000, cash: 100000, buyingPower: 100000, currency: "USD" });
  try {
    const client = getClient();
    const acct = await client.getAccount();
    return res.status(200).json({ mode: "LIVE", equity: Number(acct.equity), cash: Number(acct.cash), buyingPower: Number(acct.buying_power), currency: acct.currency, status: acct.status });
  } catch (err) { return res.status(500).json({ error: err.message || "Fetch account failed", mode: "LIVE" }); }
}
