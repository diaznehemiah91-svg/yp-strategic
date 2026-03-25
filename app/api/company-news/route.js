import { getMockSignals } from '@/app/lib/mock-data';

function mockNewsForSymbol(symbol) {
  const signals = getMockSignals();
  const ticker = symbol.toUpperCase();
  const matched = signals.filter(s => s.tickers.includes(ticker));
  const items = (matched.length ? matched : signals).slice(0, 5);
  return items.map(s => ({
    headline: s.title,
    summary: s.summary,
    source: s.source,
    url: s.url,
    datetime: Math.floor(new Date(s.publishedAt).getTime() / 1000),
    image: '',
    mock: true,
  }));
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 });
  }

  const FINNHUB_KEY = process.env.FINNHUB_KEY;

  if (!FINNHUB_KEY) {
    console.warn('[API] FINNHUB_KEY not set — returning mock news for', symbol);
    return Response.json(mockNewsForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  }

  try {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) {
      console.warn(`[API] Finnhub returned ${res.status} for ${symbol} news — falling back to mock`);
      return Response.json(mockNewsForSymbol(symbol), {
        headers: { 'Cache-Control': 'public, max-age=300' },
      });
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
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (error) {
    console.error('[API] Error fetching company news — falling back to mock:', error);
    return Response.json(mockNewsForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  }
}
