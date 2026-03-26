import { NextRequest, NextResponse } from 'next/server'

const MOCK_COMPANIES = [
  { id: 1, ticker: 'NVDA', name: 'NVIDIA', sector: 'Deep-Tech', price: 875.32, change_pct: 2.45, market_cap: 2.7e12 },
  { id: 2, ticker: 'PLTR', name: 'Palantir', sector: 'Defence', price: 28.64, change_pct: 3.21, market_cap: 34e9 },
  { id: 3, ticker: 'RKLB', name: 'Rocket Lab', sector: 'Defence', price: 12.89, change_pct: 1.15, market_cap: 3.2e9 },
  { id: 4, ticker: 'LMT', name: 'Lockheed Martin', sector: 'Defence', price: 456.78, change_pct: -0.82, market_cap: 125e9 },
  { id: 5, ticker: 'RTX', name: 'RTX Corp', sector: 'Defence', price: 312.45, change_pct: 1.92, market_cap: 95e9 },
  { id: 6, ticker: 'CRWD', name: 'CrowdStrike', sector: 'Cyber', price: 142.56, change_pct: 2.11, market_cap: 46e9 },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ticker = searchParams.get('ticker')
    const sector = searchParams.get('sector')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '100')

    let filtered = MOCK_COMPANIES

    if (ticker) {
      filtered = filtered.filter(c => c.ticker.toLowerCase().includes(ticker.toLowerCase()))
    }

    if (sector) {
      filtered = filtered.filter(c => c.sector === sector)
    }

    const start = (page - 1) * perPage
    const end = start + perPage
    const paginated = filtered.slice(start, end)

    return NextResponse.json(
      {
        data: paginated,
        total: filtered.length,
        page,
        per_page: perPage,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}
