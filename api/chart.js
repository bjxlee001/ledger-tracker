export default async function handler(req, res) {
  const { symbol, range, interval } = req.query;

  if (!symbol) {
    return res.status(400).json({ error: 'symbol parameter required' });
  }

  const sym = encodeURIComponent(symbol);
  const r = range || '2y';
  const iv = interval || '1d';
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=${r}&interval=${iv}`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!resp.ok) {
      // Yahoo sometimes returns 404 for delisted or invalid symbols
      const text = await resp.text().catch(() => '');
      return res.status(resp.status).json({
        error: `Yahoo returned ${resp.status}`,
        detail: text.slice(0, 200),
      });
    }

    const data = await resp.json();

    // Cache successful responses for 1 hour at the edge
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=1800');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to fetch from Yahoo Finance', detail: err.message });
  }
}
