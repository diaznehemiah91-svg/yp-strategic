import { NextResponse } from 'next/server';
import { fetchFedUpdates } from '@/app/lib/fetchers';

export const revalidate = 300;

export async function GET() {
  try {
    const data = await fetchFedUpdates();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/fed]', error);
    return NextResponse.json({ error: 'Failed to fetch Fed data' }, { status: 500 });
  }
}
