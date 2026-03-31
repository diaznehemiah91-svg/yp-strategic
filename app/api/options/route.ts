import { NextResponse } from 'next/server';

export async function GET() {
    const mockOptionsFlow = [
      { ticker: 'PLTR', type: 'CALL', volume: '$2.1M', strike: '$32.50', expiry: '2026-04-17' },
      { ticker: 'NVDA', type: 'PUT', volume: '$1.4M', strike: '$120.00', expiry: '2026-04-10' },
      { ticker: 'BBAI', type: 'CALL', volume: '$890K', strike: '$18.50', expiry: '2026-04-24' },
      { ticker: 'RTX', type: 'CALL', volume: '$3.2M', strike: '$85.00', expiry: '2026-05-15' },
      { ticker: 'LMT', type: 'PUT', volume: '$1.1M', strike: '$410.00', expiry: '2026-04-17' },
      { ticker: 'TDI', type: 'CALL', volume: '$750K', strike: '$28.00', expiry: '2026-05-01' },
        ];

  return NextResponse.json({ options: mockOptionsFlow });
}
