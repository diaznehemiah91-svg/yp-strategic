import { NextResponse } from 'next/server';
import { fetchFutures } from '@/app/lib/fetchers';

export const revalidate = 30;

export async function GET() {
  const data = await fetchFutures();
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
