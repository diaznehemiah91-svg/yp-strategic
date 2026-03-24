import { NextResponse } from 'next/server';
import { fetchCrypto } from '@/app/lib/fetchers';

export const revalidate = 30;

export async function GET() {
  const data = await fetchCrypto();
  return NextResponse.json({ data, timestamp: new Date().toISOString() });
}
