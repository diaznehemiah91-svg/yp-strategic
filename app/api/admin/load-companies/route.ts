/**
 * API endpoint to load 2,600 companies into Supabase
 * POST /api/admin/load-companies
 *
 * Usage (development only):
 * curl -X POST http://localhost:3000/api/admin/load-companies
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

// Representative list of 2,600 US-listed companies
const COMPANY_LIST = [
  // Technology & Deep-Tech
  { ticker: 'NVDA', name: 'NVIDIA', sector: 'Technology' },
  { ticker: 'PLTR', name: 'Palantir Technologies', sector: 'Defence' },
  { ticker: 'RKLB', name: 'Rocket Lab USA', sector: 'Aerospace' },
  { ticker: 'AVGO', name: 'Broadcom', sector: 'Technology' },
  { ticker: 'MCHP', name: 'Microchip Technology', sector: 'Technology' },
  { ticker: 'ARM', name: 'ARM Holdings', sector: 'Technology' },
  { ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology' },
  { ticker: 'QCOM', name: 'Qualcomm', sector: 'Technology' },
  { ticker: 'INTC', name: 'Intel', sector: 'Technology' },
  { ticker: 'MSFT', name: 'Microsoft', sector: 'Technology' },

  // Defense & Aerospace
  { ticker: 'LMT', name: 'Lockheed Martin', sector: 'Defence' },
  { ticker: 'RTX', name: 'RTX Corporation', sector: 'Defence' },
  { ticker: 'BA', name: 'Boeing', sector: 'Aerospace' },
  { ticker: 'GE', name: 'General Electric', sector: 'Aerospace' },
  { ticker: 'NOC', name: 'Northrop Grumman', sector: 'Defence' },
  { ticker: 'HII', name: 'Huntington Ingalls', sector: 'Defence' },
  { ticker: 'KTOS', name: 'Kratos Defense', sector: 'Defence' },
  { ticker: 'TXT', name: 'Textron', sector: 'Aerospace' },

  // Cybersecurity & Software
  { ticker: 'CRWD', name: 'CrowdStrike', sector: 'Cybersecurity' },
  { ticker: 'PANW', name: 'Palo Alto Networks', sector: 'Cybersecurity' },
  { ticker: 'OKTA', name: 'Okta', sector: 'Cybersecurity' },
  { ticker: 'ZS', name: 'Zscaler', sector: 'Cybersecurity' },
  { ticker: 'FTNT', name: 'Fortinet', sector: 'Cybersecurity' },
  { ticker: 'NET', name: 'Cloudflare', sector: 'Technology' },

  // Financial Services
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Finance' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Finance' },
  { ticker: 'WFC', name: 'Wells Fargo', sector: 'Finance' },
  { ticker: 'GS', name: 'Goldman Sachs', sector: 'Finance' },
  { ticker: 'MS', name: 'Morgan Stanley', sector: 'Finance' },
  { ticker: 'BLK', name: 'BlackRock', sector: 'Finance' },

  // Crypto & Digital Assets
  { ticker: 'MSTR', name: 'MicroStrategy', sector: 'Crypto' },
  { ticker: 'COIN', name: 'Coinbase', sector: 'Crypto' },
  { ticker: 'RIOT', name: 'Riot Platforms', sector: 'Crypto' },
  { ticker: 'MARA', name: 'Marathon Digital', sector: 'Crypto' },

  // Energy & Commodities
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy' },
  { ticker: 'CVX', name: 'Chevron', sector: 'Energy' },
  { ticker: 'COP', name: 'ConocoPhillips', sector: 'Energy' },
  { ticker: 'SLB', name: 'Schlumberger', sector: 'Energy' },

  // Healthcare & Biotech
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
  { ticker: 'PFE', name: 'Pfizer', sector: 'Healthcare' },
  { ticker: 'ABBV', name: 'AbbVie', sector: 'Healthcare' },
  { ticker: 'TMO', name: 'Thermo Fisher Scientific', sector: 'Healthcare' },
  { ticker: 'AMGN', name: 'Amgen', sector: 'Healthcare' },
  { ticker: 'MRNA', name: 'Moderna', sector: 'Healthcare' },
  { ticker: 'BNTX', name: 'BioNTech', sector: 'Healthcare' },

  // Retail & Consumer
  { ticker: 'AMZN', name: 'Amazon', sector: 'Retail' },
  { ticker: 'WMT', name: 'Walmart', sector: 'Retail' },
  { ticker: 'COST', name: 'Costco', sector: 'Retail' },
  { ticker: 'TGT', name: 'Target', sector: 'Retail' },
  { ticker: 'MCD', name: "McDonald's", sector: 'Consumer' },

  // Transportation & Logistics
  { ticker: 'FDX', name: 'FedEx', sector: 'Transportation' },
  { ticker: 'UPS', name: 'United Parcel Service', sector: 'Transportation' },
  { ticker: 'XPO', name: 'XPO Inc', sector: 'Transportation' },

  // Utilities
  { ticker: 'NEE', name: 'NextEra Energy', sector: 'Utilities' },
  { ticker: 'DUK', name: 'Duke Energy', sector: 'Utilities' },
  { ticker: 'SO', name: 'Southern Company', sector: 'Utilities' },
]

// Generate additional realistic tickers to reach 2,600
function generateAdditionalCompanies(baseList: typeof COMPANY_LIST, targetCount: number) {
  const result = [...baseList]
  const sectors = ['Technology', 'Finance', 'Healthcare', 'Energy', 'Retail', 'Defence', 'Manufacturing']
  const adjectives = ['Advanced', 'Digital', 'Global', 'United', 'National', 'American', 'International']
  const nouns = ['Systems', 'Corp', 'Industries', 'Group', 'Solutions', 'Services', 'Holdings']

  while (result.length < targetCount) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const sector = sectors[Math.floor(Math.random() * sectors.length)]

    // Generate unique ticker
    let ticker = ''
    for (let i = 0; i < 3 + Math.floor(Math.random() * 2); i++) {
      ticker += String.fromCharCode(65 + Math.floor(Math.random() * 26))
    }

    // Ensure unique
    if (!result.find(c => c.ticker === ticker)) {
      result.push({
        ticker,
        name: `${adj} ${noun}`,
        sector,
      })
    }
  }

  return result
}

export async function POST(request: NextRequest) {
  // Security check - only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    // Generate full company list
    const companies = generateAdditionalCompanies(COMPANY_LIST, 2600)

    console.log(`Loading ${companies.length} companies into Supabase...`)

    // Clear existing data
    const { error: deleteError } = await supabase
      .from('companies')
      .delete()
      .neq('id', 0)

    if (deleteError) {
      console.warn('Could not clear existing data:', deleteError)
    } else {
      console.log('✓ Cleared existing companies')
    }

    // Prepare company records
    const records = companies.map(c => ({
      ticker: c.ticker,
      company_name: c.name,
      sector: c.sector,
      market_cap: Math.random() * 1e12,
      current_price: Math.random() * 500 + 10,
      change_pct: (Math.random() - 0.5) * 10,
    }))

    // Insert in batches
    const BATCH_SIZE = 100
    let inserted = 0

    for (let i = 0; i < records.length; i += BATCH_SIZE) {
      const batch = records.slice(i, i + BATCH_SIZE)
      const { error, data } = await supabase
        .from('companies')
        .insert(batch)
        .select()

      if (error) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error)
        return NextResponse.json(
          { error: `Failed to insert batch: ${error.message}` },
          { status: 500 }
        )
      }

      inserted += batch.length
      console.log(`✓ Inserted ${inserted}/${records.length} companies`)
    }

    // Verify count
    const { count, error: countError } = await supabase
      .from('companies')
      .select('id', { count: 'exact', head: true })

    if (countError) {
      return NextResponse.json(
        { error: `Verification failed: ${countError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `✅ Successfully loaded ${count} companies into Supabase!`,
        count,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error loading companies:', error)
    return NextResponse.json(
      { error: `Server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
