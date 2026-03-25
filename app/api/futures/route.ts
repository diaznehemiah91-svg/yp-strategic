import { NextResponse } from 'next/server';
import { fetchFutures } from '@/app/lib/fetchers';

export const revalidate = 30;

export async function GET() {
  try {
    const data = await fetchFutures();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/futures]', error);
    return NextResponse.json({ error: 'Failed to fetch futures data' }, { status: 500 });
  }
}
