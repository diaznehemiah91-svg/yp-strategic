import { NextResponse } from 'next/server';
import { fetchStocks } from '@/app/lib/fetchers';

export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tickers = searchParams.get('tickers')?.split(',');
  const data = await fetchStocks(tickers || undefined);
  return NextResponse.json({ data, timestamp: new Date().toISOString(), live: !!process.env.ALPHA_VANTAGE_API_KEY });
}
