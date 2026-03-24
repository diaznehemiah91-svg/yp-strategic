// ═══════════════════════════════════════════════════════════
// Y.P STRATINTEL — Data Fetcher Service
// Checks for API keys → uses live data OR falls back to mock
// ═══════════════════════════════════════════════════════════

import * as mock from './mock-data';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const CMC_KEY = process.env.COINMARKETCAP_API_KEY;
const FRED_KEY = process.env.FRED_API_KEY;

// ── STOCKS ──
export async function fetchStocks(tickers?: string[]): Promise<mock.StockQuote[]> {
  if (!ALPHA_VANTAGE_KEY || ALPHA_VANTAGE_KEY === 'your_key_here') {
    return mock.getMockStocks();
  }
  try {
    const allTickers = tickers || ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'PLTR', 'CRWD', 'NVDA', 'AXON', 'IONQ', 'OKLO', 'RKLB'];
    const quotes: mock.StockQuote[] = [];
    for (const ticker of allTickers.slice(0, 5)) { // Rate limit: 5/min on free tier
      const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${ALPHA_VANTAGE_KEY}`);
      const data = await res.json();
      const gq = data['Global Quote'];
      if (gq) {
        quotes.push({
          ticker,
          name: ticker,
          price: parseFloat(gq['05. price']),
          change: parseFloat(gq['09. change']),
          changePct: parseFloat(gq['10. change percent']?.replace('%', '')),
          volume: parseInt(gq['06. volume']),
          marketCap: 0,
          sector: 'Defence',
        });
      }
    }
    return quotes.length > 0 ? quotes : mock.getMockStocks();
  } catch {
    return mock.getMockStocks();
  }
}

// ── NEWS / SIGNALS ──
export async function fetchSignals(category?: string): Promise<mock.SignalItem[]> {
  if (!NEWSAPI_KEY || NEWSAPI_KEY === 'your_key_here') {
    const signals = mock.getMockSignals();
    return category ? signals.filter(s => s.category === category) : signals;
  }
  try {
    const queries = [
      'defence contractor military',
      'Pentagon DoD contract',
      'Federal Reserve interest rate',
      'geopolitical conflict sanctions',
      'Bitcoin crypto futures',
    ];
    const query = queries.join(' OR ');
    const res = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=20&apiKey=${NEWSAPI_KEY}`);
    const data = await res.json();
    if (data.articles) {
      return data.articles.map((a: any, i: number) => ({
        id: `live-${i}`,
        title: a.title,
        summary: a.description || '',
        source: a.source?.name || 'Unknown',
        url: a.url,
        category: categorizeArticle(a.title + ' ' + (a.description || '')),
        severity: 'INFO',
        tickers: extractTickers(a.title + ' ' + (a.description || '')),
        publishedAt: a.publishedAt,
        timestamp: new Date(a.publishedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }));
    }
    return mock.getMockSignals();
  } catch {
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
