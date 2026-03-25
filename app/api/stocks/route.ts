import { NextResponse } from 'next/server';
import { fetchStocks } from '@/app/lib/fetchers';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tickers = searchParams.get('tickers')?.split(',');
    const data = await fetchStocks(tickers || undefined);
    return NextResponse.json({ data, timestamp: new Date().toISOString(), live: !!process.env.ALPHA_VANTAGE_API_KEY });
  } catch (error) {
    console.error('[/api/stocks]', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}
