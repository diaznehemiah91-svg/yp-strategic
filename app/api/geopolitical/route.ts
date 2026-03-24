import { NextResponse } from 'next/server';
import { fetchGeoRisk } from '@/app/lib/fetchers';

export const revalidate = 120;

export async function GET() {
  const data = await fetchGeoRisk();
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
