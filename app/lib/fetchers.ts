// ═══════════════════════════════════════════════════════════
// Y.P STRATINTEL — Data Fetcher Service
// Checks for API keys → uses live data OR falls back to mock
// ═══════════════════════════════════════════════════════════

import * as mock from './mock-data';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const CMC_KEY = process.env.COINMARKETCAP_API_KEY;
const FRED_KEY = process.env.FRED_API_KEY;
const FINNHUB_KEY = process.env.FINNHUB_KEY;

// ── STOCKS ──
export async function fetchStocks(tickers?: string[]): Promise<mock.StockQuote[]> {
  if (!FINNHUB_KEY) {
    console.warn('[fetchStocks] FINNHUB_KEY not configured, using mock data');
    return mock.getMockStocks();
  }

  try {
    const allTickers = tickers || ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'PLTR', 'CRWD', 'NVDA', 'AXON', 'IONQ', 'OKLO', 'RKLB'];
    const quotes: mock.StockQuote[] = [];

    for (const ticker of allTickers) {
      try {
        // Call Finnhub directly — relative URLs don't work in server components
        const res = await fetch(
          `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`,
          { next: { revalidate: 60 } }
        );

        if (!res.ok) {
          console.warn(`[fetchStocks] Finnhub returned ${res.status} for ${ticker}`);
          continue;
        }

        const data = await res.json();

        if (data.c === undefined || data.c === null || data.c === 0) {
          console.warn(`[fetchStocks] No price data for ${ticker}`, data);
          continue;
        }

        quotes.push({
          ticker,
          name: ticker,
          price: data.c,
          change: data.d ?? 0,
          changePct: data.dp ?? 0,
          volume: 0,
          marketCap: 0,
          sector: 'Defence',
        });
      } catch (error) {
        console.warn(`[fetchStocks] Error fetching ${ticker}:`, error);
        continue;
      }
    }

    return quotes.length > 0 ? quotes : mock.getMockStocks();
  } catch (error) {
    console.error('[fetchStocks] Fatal error:', error);
    return mock.getMockStocks();
  }
}

// ── NEWS / SIGNALS ──
export async function fetchSignals(category?: string): Promise<mock.SignalItem[]> {
  if (!FINNHUB_KEY) {
    const signals = mock.getMockSignals();
    return category ? signals.filter(s => s.category === category) : signals;
  }
  try {
    // Fetch news for major defence contractors and related sectors via Finnhub
    const majors = ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'PLTR', 'CRWD', 'NVDA'];
    const allNews: mock.SignalItem[] = [];

    for (const ticker of majors) {
      try {
        const res = await fetch(
          `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0]}&to=${new Date().toISOString().split('T')[0]}&token=${FINNHUB_KEY}`,
          { next: { revalidate: 300 } }
        );

        if (!res.ok) {
          console.warn(`Failed to fetch news for ${ticker}: ${res.status}`);
          continue;
        }

        const articles = await res.json();

        if (Array.isArray(articles)) {
          articles.forEach((article: any, idx: number) => {
            allNews.push({
              id: `${ticker}-${idx}`,
              title: article.headline || '',
              summary: article.summary || '',
              source: article.source || 'Unknown',
              url: article.url || '#',
              category: categorizeArticle((article.headline || '') + ' ' + (article.summary || '')),
              severity: 'INFO',
              tickers: [ticker],
              // Finnhub datetime is Unix seconds — multiply by 1000 for JS Date
              publishedAt: article.datetime ? new Date(article.datetime * 1000).toISOString() : new Date().toISOString(),
              timestamp: article.datetime
                ? new Date(article.datetime * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
                : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            });
          });
        }
      } catch (error) {
        console.warn(`Error fetching news for ${ticker}:`, error);
        // Continue to next ticker
        continue;
      }
    }

    // Sort by publishedAt (most recent first) and limit to 20
    const sorted = allNews.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    ).slice(0, 20);

    return sorted.length > 0 ? sorted : mock.getMockSignals();
  } catch (error) {
    console.error('Error in fetchSignals:', error);
    return mock.getMockSignals();
  }
}

// ── CRYPTO ──
export async function fetchCrypto(): Promise<mock.CryptoQuote[]> {
  if (!CMC_KEY || CMC_KEY === 'your_key_here') {
    return mock.getMockCrypto();
  }
  try {
    const res = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,SOL,XRP,ADA,LINK', {
      headers: { 'X-CMC_PRO_API_KEY': CMC_KEY },
    });
    const data = await res.json();
    return Object.values(data.data).map((coin: any) => ({
      symbol: coin.symbol,
      name: coin.name,
      price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h,
      volume24h: coin.quote.USD.volume_24h,
      marketCap: coin.quote.USD.market_cap,
    }));
  } catch {
    return mock.getMockCrypto();
  }
}

// ── FUTURES ──
export async function fetchFutures(): Promise<mock.FuturesQuote[]> {
  // Alpha Vantage doesn't have great futures support on free tier
  // This would use a dedicated futures API (e.g., Tradier, Polygon)
  return mock.getMockFutures();
}

// ── FED UPDATES ──
export async function fetchFedUpdates(): Promise<mock.FedUpdate[]> {
  if (!FRED_KEY || FRED_KEY === 'your_key_here') {
    return mock.getMockFedUpdates();
  }
  // FRED API for economic data series
  // Real implementation would pull: FEDFUNDS, CPIAUCSL, PAYEMS, PCE
  return mock.getMockFedUpdates();
}

// ── GEOPOLITICAL ──
export async function fetchGeoRisk(): Promise<mock.GeoRiskEvent[]> {
  // GDELT API is free, no key needed
  if (process.env.GDELT_ENABLED === 'true') {
    try {
      const res = await fetch('https://api.gdeltproject.org/api/v2/doc/doc?query=defence%20military%20conflict&mode=artlist&maxrecords=10&format=json');
      const data = await res.json();
      if (data.articles) {
        return data.articles.map((a: any, i: number) => ({
          id: `gdelt-${i}`,
          title: a.title,
          region: 'Global',
          severity: 5,
          category: 'CONFLICT',
          summary: a.seendate || '',
          impactTickers: [],
          timestamp: a.seendate,
        }));
      }
    } catch { /* fallback */ }
  }
  return mock.getMockGeoRisk();
}

// ── CONTRACTOR DEEP DIVE ──
export async function fetchContractor(ticker: string): Promise<mock.ContractorProfile | null> {
  // This would aggregate from multiple sources:
  // - Alpha Vantage for price
  // - SEC EDGAR for filings
  // - USASpending.gov for contracts
  // - NewsAPI for recent signals
  return mock.getMockContractor(ticker);
}

// ── HELPERS ──
function categorizeArticle(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('bitcoin') || lower.includes('crypto') || lower.includes('ethereum')) return 'CRYPTO';
  if (lower.includes('futures') || lower.includes('/es') || lower.includes('/nq')) return 'FUTURES';
  if (lower.includes('fed') || lower.includes('powell') || lower.includes('rate') || lower.includes('inflation')) return 'FED';
  if (lower.includes('china') || lower.includes('russia') || lower.includes('iran') || lower.includes('sanctions')) return 'GEOPOLITICAL';
  if (lower.includes('cyber') || lower.includes('hack') || lower.includes('breach')) return 'CYBER';
  if (lower.includes('quantum') || lower.includes('qubit')) return 'QUANTUM';
  if (lower.includes('nuclear') || lower.includes('reactor') || lower.includes('fission')) return 'NUCLEAR';
  if (lower.includes('ai') || lower.includes('artificial intelligence') || lower.includes('machine learning')) return 'AI';
  return 'DEFENCE';
}

function extractTickers(text: string): string[] {
  const known = ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'PLTR', 'CRWD', 'NVDA', 'AXON', 'IONQ', 'OKLO', 'RKLB', 'LDOS', 'HII'];
  return known.filter(t => text.includes(t));
}
