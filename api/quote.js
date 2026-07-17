export default async function handler(req, res) {
  const { symbol } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'symbol parameter required' });
  }

  const sym = encodeURIComponent(symbol);
  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${sym}?modules=assetProfile`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(resp.status).json({
        error: `Yahoo returned ${resp.status}`,
        detail: text.slice(0, 200),
      });
    }

    const data = await resp.json();

    // Sector/industry rarely changes — cache for a day at the edge
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch from Yahoo Finance', detail: err.message });
  }
}
