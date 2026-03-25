import { getMockStocks } from '@/app/lib/mock-data';

function mockQuoteForSymbol(symbol) {
  const stocks = getMockStocks();
  const found = stocks.find(s => s.ticker === symbol.toUpperCase()) ?? stocks[0];
  return {
    price: found.price,
    change: found.change,
    changePercent: found.changePct,
    high: +(found.price * 1.01).toFixed(2),
    low: +(found.price * 0.99).toFixed(2),
    previousClose: +(found.price - found.change).toFixed(2),
    timestamp: Math.floor(Date.now() / 1000),
    mock: true,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 });
  }

  const FINNHUB_KEY = process.env.FINNHUB_KEY;

  if (!FINNHUB_KEY) {
    console.warn('[API] FINNHUB_KEY not set — returning mock quote for', symbol);
    return Response.json(mockQuoteForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }

  try {
    const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      console.warn(`[API] Finnhub returned ${res.status} for ${symbol} — falling back to mock`);
      return Response.json(mockQuoteForSymbol(symbol), {
        headers: { 'Cache-Control': 'public, max-age=60' },
      });
    }

    const data = await res.json();

    if (data.c === undefined || data.c === null) {
      console.warn(`[API] No price data from Finnhub for ${symbol} — falling back to mock`);
      return Response.json(mockQuoteForSymbol(symbol), {
        headers: { 'Cache-Control': 'public, max-age=60' },
      });
    }

    return Response.json(
      {
        price: data.c,
        change: data.d,
        changePercent: data.dp,
        high: data.h,
        low: data.l,
        previousClose: data.pc,
        timestamp: data.t,
      },
      { headers: { 'Cache-Control': 'public, max-age=60' } }
    );
  } catch (error) {
    console.error('[API] Error fetching stock price — falling back to mock:', error);
    return Response.json(mockQuoteForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }
}
