import { NextResponse } from 'next/server';

function hasKey(name: string) {
  const val = process.env[name];
  return !!val && val !== 'your_key_here';
}

export async function GET() {
  return NextResponse.json({
    status: 'operational',
    service: 'ypstrategicresearch.com',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    keys: {
      finnhub: hasKey('FINNHUB_KEY'),
      alphavantage: hasKey('ALPHA_VANTAGE_API_KEY'),
      newsapi: hasKey('NEWSAPI_KEY'),
      coinmarketcap: hasKey('COINMARKETCAP_API_KEY'),
      fred: hasKey('FRED_API_KEY'),
    },
  });
}
