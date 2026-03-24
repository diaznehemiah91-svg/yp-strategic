export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 });
  }

  try {
    const FINNHUB_KEY = process.env.FINNHUB_KEY;

    // Debug: Log if key exists (don't log the actual key for security)
    if (!FINNHUB_KEY) {
      console.warn('[API] FINNHUB_KEY not found in environment variables');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);

    // Check for HTTP errors
    if (!res.ok) {
      console.warn(`[API] Finnhub returned status ${res.status} for ${symbol}`);
      return Response.json({ error: `Finnhub API error: ${res.status}` }, { status: 500 });
    }

    const data = await res.json();

    // Check if data has price (c field from Finnhub)
    if (data.c === undefined || data.c === null) {
      console.warn(`[API] No price data from Finnhub for ${symbol}`, data);
      return Response.json({ error: 'No data available for symbol' }, { status: 404 });
    }

    return Response.json(
      {
        price: data.c ?? null,
        change: data.d ?? null,
        changePercent: data.dp ?? null,
        high: data.h ?? null,
        low: data.l ?? null,
        previousClose: data.pc ?? null,
        timestamp: data.t ?? null,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      }
    );
  } catch (error) {
    console.error('[API] Error fetching stock price:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
