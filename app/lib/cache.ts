import { unstable_cache } from 'next/cache';

interface StockQuote {
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: number;
}

async function fetchFinnhubQuote(symbol: string): Promise<StockQuote | null> {
  const FINNHUB_KEY = process.env.FINNHUB_KEY;
  if (!FINNHUB_KEY) return null;

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_KEY}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.c === undefined || data.c === null) return null;
    return {
      price: data.c,
      change: data.d,
      changePercent: data.dp,
      high: data.h,
      low: data.l,
      previousClose: data.pc,
      timestamp: data.t,
    };
  } catch {
    return null;
  }
}

// Per-symbol cache with 60s TTL.
// All concurrent server requests for the same symbol share one Finnhub call.
export function getCachedStockPrice(symbol: string) {
  return unstable_cache(
    () => fetchFinnhubQuote(symbol),
    [`stock-price-${symbol.toUpperCase()}`],
    { revalidate: 60 }
  )();
}
