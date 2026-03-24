import { NextResponse } from 'next/server';
import { fetchSignals } from '@/app/lib/fetchers';

export const revalidate = 30;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const data = await fetchSignals(category);
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
