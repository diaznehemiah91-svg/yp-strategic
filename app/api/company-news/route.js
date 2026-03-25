export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 });
  }

  try {
    const FINNHUB_KEY = process.env.FINNHUB_KEY;

    // Guard: return 500 if FINNHUB_KEY is missing (mirrors stock-price/route.js pattern)
    if (!FINNHUB_KEY) {
      console.warn('[API] FINNHUB_KEY not found in environment variables');
      return Response.json({ error: 'API key not configured' }, { status: 500 });
    }

    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${FINNHUB_KEY}`
    );

    if (!res.ok) {
      console.warn(`[API] Finnhub company-news returned status ${res.status} for ${symbol}`);
      return Response.json({ error: `Finnhub API error: ${res.status}` }, { status: 500 });
    }
    const articles = await res.json();

    const filtered = articles.slice(0, 10).map(a => ({
      headline: a.headline,
      summary: a.summary,
      source: a.source,
      url: a.url,
      datetime: new Date(a.datetime * 1000),
      image: a.image,
    }));

    return Response.json(filtered, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
