import { NextResponse } from 'next/server';
import { fetchGeoRisk } from '@/app/lib/fetchers';

export const revalidate = 120;

export async function GET() {
  try {
    const data = await fetchGeoRisk();
    return NextResponse.json({ data, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error('[/api/geopolitical]', error);
    return NextResponse.json({ error: 'Failed to fetch geopolitical data' }, { status: 500 });
  }
}
