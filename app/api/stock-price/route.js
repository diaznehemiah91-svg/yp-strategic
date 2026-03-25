import { getMockStocks } from '@/app/lib/mock-data';
import { getCachedStockPrice } from '@/app/lib/cache';

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

  try {
    const cached = await getCachedStockPrice(symbol);
    if (cached) {
      return Response.json(cached, {
        headers: { 'Cache-Control': 'public, max-age=60, stale-while-revalidate=120' },
      });
    }
    return Response.json(mockQuoteForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  } catch (error) {
    console.error('[API] Error fetching stock price — falling back to mock:', error);
    return Response.json(mockQuoteForSymbol(symbol), {
      headers: { 'Cache-Control': 'public, max-age=60' },
    });
  }
}
