import { NextResponse } from 'next/server';
import { fetchFedUpdates } from '@/app/lib/fetchers';

export const revalidate = 300;

export async function GET() {
  const data = await fetchFedUpdates();
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
