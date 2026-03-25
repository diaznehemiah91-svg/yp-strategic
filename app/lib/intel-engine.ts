// Intelligence Engine - Aggregates real-time market, government, and macro data
// Uses: NewsAPI, USAspending, Finnhub, FRED for comprehensive strategic intelligence

export interface ContractAward {
  id: string
  agency: string
  amount: string
  date: string
  description: string
}

export interface MacroEvent {
  title: string
  summary: string
  sentiment: 'HAWKISH' | 'DOVISH' | 'NEUTRAL'
  date: string
}

export interface SignalItem {
  id: string
  title: string
  category: string
  severity: 'CRITICAL' | 'ALERT' | 'INFO'
  timestamp: string
}

/**
 * Fetch latest government contracts for a specific ticker/company
 * Uses USAspending API for real-time contract data
 */
export async function getLatestContracts(
  ticker: string,
  limit: number = 5
): Promise<ContractAward[]> {
  try {
    const response = await fetch('https://api.usaspending.gov/api/v2/search/spending_by_award/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filters: {
          keywords: [ticker],
        },
        fields: ['Award Amount', 'Awarding Agency', 'Action Date'],
        limit,
      }),
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) throw new Error('USAspending API failed')

    const data = await response.json()
    return (
      data.results?.map((contract: any) => ({
        id: contract.award_id || Math.random().toString(),
        agency: contract.awarding_agency?.name || 'Unknown Agency',
        amount: `$${(contract.federal_action_obligation || 0).toLocaleString()}`,
        date: new Date(contract.action_date).toLocaleDateString(),
        description: contract.description || 'Government Contract Award',
      })) || []
    )
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
    return []
  }
}

/**
 * Fetch latest Federal Reserve news and economic events
 * Uses Finnhub API for macro events
 */
export async function getFedNews(): Promise<MacroEvent> {
  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/calendar/economic?token=${process.env.FINNHUB_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    )

    if (!response.ok) throw new Error('Finnhub API failed')

    const events = await response.json()

    // Filter for Fed-related events
    const fedEvent = events.find(
      (e: any) =>
        e.event?.includes('FOMC') ||
        e.event?.includes('Fed') ||
        e.event?.includes('Employment Report')
    )

    if (fedEvent) {
      return {
        title: fedEvent.event || 'Fed Announcement',
        summary: `${fedEvent.actual ? `Actual: ${fedEvent.actual}` : 'Awaiting release'} (Forecast: ${fedEvent.forecast || 'N/A'})`,
        sentiment: fedEvent.actual > fedEvent.forecast ? 'HAWKISH' : 'DOVISH',
        date: new Date(fedEvent.date).toLocaleDateString(),
      }
    }

    // Fallback
    return {
      title: 'FOMC Waiting Period',
      summary: 'Fed in neutral stance. Next FOMC meeting scheduled for March 2026.',
      sentiment: 'NEUTRAL',
      date: new Date().toLocaleDateString(),
    }
  } catch (error) {
    console.error('Failed to fetch Fed news:', error)
    return {
      title: 'FOMC Data Feed Offline',
      summary: 'Unable to retrieve latest Federal Reserve data. Check connection.',
      sentiment: 'NEUTRAL',
      date: new Date().toLocaleDateString(),
    }
  }
}

/**
 * Fetch relevant news signals for a ticker
 * Uses NewsAPI for latest market news
 */
export async function getSignalFeed(ticker: string, limit: number = 5): Promise<SignalItem[]> {
  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${ticker}+defense&sortBy=publishedAt&apiKey=${process.env.NEWSAPI_KEY}&pageSize=${limit}`,
      { next: { revalidate: 3600 } }
    )

    if (!response.ok) throw new Error('NewsAPI failed')

    const data = await response.json()

    return (
      data.articles?.map((article: any, idx: number) => ({
        id: `${ticker}-${idx}`,
        title: article.title || 'Unknown Signal',
        category: 'SIGNAL_WIRE',
        severity: idx === 0 ? 'CRITICAL' : idx < 3 ? 'ALERT' : 'INFO',
        timestamp: new Date(article.publishedAt).toISOString(),
      })) || []
    )
  } catch (error) {
    console.error('Failed to fetch signal feed:', error)
    return []
  }
}

/**
 * Get macro context (interest rates, inflation, etc.)
 * Uses FRED API for Federal Reserve Economic Data
 */
export async function getMacroContext(): Promise<{
  fedRate: number
  inflation: number
  lastUpdated: string
}> {
  try {
    const [rateRes, inflationRes] = await Promise.all([
      fetch(`https://api.stlouisfed.org/fred/series/data?series_id=FEDFUNDS&api_key=${process.env.FRED_API_KEY}&limit=1`, {
        next: { revalidate: 86400 },
      }),
      fetch(
        `https://api.stlouisfed.org/fred/series/data?series_id=CPIAUCSL&api_key=${process.env.FRED_API_KEY}&limit=1`,
        { next: { revalidate: 86400 } }
      ),
    ])

    if (!rateRes.ok || !inflationRes.ok) throw new Error('FRED API failed')

    const rateData = await rateRes.json()
    const inflationData = await inflationRes.json()

    return {
      fedRate: parseFloat(rateData.observations?.[0]?.value || '0'),
      inflation: parseFloat(inflationData.observations?.[0]?.value || '0'),
      lastUpdated: new Date().toLocaleDateString(),
    }
  } catch (error) {
    console.error('Failed to fetch macro context:', error)
    return {
      fedRate: 5.33,
      inflation: 3.2,
      lastUpdated: 'Data unavailable',
    }
  }
}
