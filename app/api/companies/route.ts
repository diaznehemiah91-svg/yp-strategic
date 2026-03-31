import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '100')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

    // If Supabase not configured, return mock data immediately
    if (!supabaseUrl || !supabaseKey) {
      let filtered = MOCK_COMPANIES
      if (ticker) filtered = filtered.filter(c => c.ticker.toLowerCase().includes(ticker.toLowerCase()))
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter(c => c.ticker.toLowerCase().includes(s) || c.name.toLowerCase().includes(s))
      }
      if (sector) filtered = filtered.filter(c => c.sector === sector)
      const start = (page - 1) * perPage
      return NextResponse.json({ data: filtered.slice(start, start + perPage), total: filtered.length, page, per_page: perPage, source: 'mock' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try to fetch from Supabase, fallback to mock data
    let query = supabase.from('companies').select('*')

    if (ticker) {
      query = query.ilike('ticker', `%${ticker}%`)
    }

    if (search) {
      query = query.or(`ticker.ilike.%${search}%,company_name.ilike.%${search}%`)
    }

    if (sector) {
      query = query.eq('sector', sector)
    }

    const { data, error, count } = await query
      .range((page - 1) * perPage, page * perPage - 1)
      .order('ticker', { ascending: true })

    if (error || !data) {
      // Fallback to mock data if Supabase query fails
      let filtered = MOCK_COMPANIES

      if (ticker) {
        filtered = filtered.filter(c => c.ticker.toLowerCase().includes(ticker.toLowerCase()))
      }

      if (search) {
        const searchLower = search.toLowerCase()
        filtered = filtered.filter(c =>
          c.ticker.toLowerCase().includes(searchLower) ||
          c.name.toLowerCase().includes(searchLower)
        )
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
          source: 'mock'
        },
        { status: 200 }
      )
    }

    // Format response with Supabase data
    const formatted = data.map(c => ({
      id: c.id,
      ticker: c.ticker,
      name: c.company_name,
      sector: c.sector,
      price: c.current_price,
      change_pct: c.change_pct || 0,
      market_cap: c.market_cap,
    }))

    return NextResponse.json(
      {
        data: formatted,
        total: count || formatted.length,
        page,
        per_page: perPage,
        source: 'supabase'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Companies API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}
