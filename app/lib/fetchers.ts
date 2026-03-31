// ─────────────────────────────────────────────────────────
// Y.P Strategic Research — Data Fetcher Service
// Checks for API keys → uses live data OR falls back to mock
// ─────────────────────────────────────────────────────────
import * as mock from './mock-data';

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;
const CMC_KEY = process.env.COINMARKETCAP_API_KEY;
const FRED_KEY = process.env.FRED_API_KEY;
const FINNHUB_KEY = process.env.FINNHUB_KEY;

// ── STOCKS ──
export async function fetchStocks(tickers?: string[]): Promise<mock.StockQuote[]> {
  if (!FINNHUB_KEY || FINNHUB_KEY === 'your_key_here') {
    return mock.getMockStocks();
  }
  try {
    const allTickers = tickers || ['LMT','RTX','NOC','GD','BA','PLTR','CRWD','NVDA','AXON','IONQ','OKLO','RKLB','LDOS','HII','SAIC','BAH','PANW','ANET','MRVL','AVGO','AMD','INTC','TSM','ASML','KLAC','LRCX','RDW','ASTS','MNTS','LUNR','RGTI','QUBT','QBTS','SMR','CEG','VST','NNE','LEU','BWXT','DRS','KTOS','MRCY','FTNT','ZS','NET','S','DDOG','SPR'];
    const quotes: mock.StockQuote[] = [];
    for (const ticker of allTickers) {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`, { next: { revalidate: 60 } });
        if (!res.ok) { console.warn(`Failed to fetch ${ticker}: ${res.status}`); continue; }
        const data = await res.json();
        if (!data.c) continue;
        quotes.push({ ticker, name: ticker, price: data.c ?? 0, change: data.d ?? 0, changePct: data.dp ?? 0, volume: 0, marketCap: 0, sector: 'Defence' });
      } catch (error) { console.warn(`Error fetching ${ticker}:`, error); continue; }
    }
    return quotes.length > 0 ? quotes : mock.getMockStocks();
  } catch (error) { console.error('Error in fetchStocks:', error); return mock.getMockStocks(); }
}

// ── NEWS / SIGNALS ──
export async function fetchSignals(category?: string): Promise<mock.SignalItem[]> {
  if (!FINNHUB_KEY || FINNHUB_KEY === 'your_key_here') {
    const signals = mock.getMockSignals();
    return category ? signals.filter(s => s.category === category) : signals;
  }
  try {
    const majors = ['LMT','RTX','NOC','GD','BA','PLTR','CRWD','NVDA','IONQ','OKLO','RKLB','PANW','CEG','BWXT'];
    const allNews: mock.SignalItem[] = [];
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const from = weekAgo.toISOString().split('T')[0];
    const to = now.toISOString().split('T')[0];
    for (const ticker of majors) {
      try {
        const res = await fetch(`https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${from}&to=${to}&token=${FINNHUB_KEY}`, { next: { revalidate: 300 } });
        if (!res.ok) continue;
        const articles = await res.json();
        if (Array.isArray(articles)) {
          articles.slice(0, 5).forEach((article: any, idx: number) => {
            allNews.push({
              id: `${ticker}-${idx}`,
              title: article.headline || '',
              summary: article.summary || '',
              source: article.source || 'Unknown',
              url: article.url || '#',
              category: categorizeArticle((article.headline || '') + ' ' + (article.summary || '')),
              severity: 'INFO',
              tickers: [ticker],
              publishedAt: article.datetime ? new Date(article.datetime * 1000).toISOString() : new Date().toISOString(),
              timestamp: article.datetime ? new Date(article.datetime * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            });
          });
        }
      } catch (error) { console.warn(`Error fetching news for ${ticker}:`, error); continue; }
    }
    const sorted = allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 30);
    const result = sorted.length > 0 ? sorted : mock.getMockSignals();
    return category ? result.filter(s => s.category === category) : result;
  } catch (error) { console.error('Error in fetchSignals:', error); return mock.getMockSignals(); }
}

// ── CRYPTO ──
export async function fetchCrypto(): Promise<mock.CryptoQuote[]> {
  if (!CMC_KEY || CMC_KEY === 'your_key_here') { return mock.getMockCrypto(); }
  try {
    const res = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC,ETH,SOL,XRP,ADA,LINK', {
      headers: { 'X-CMC_PRO_API_KEY': CMC_KEY },
    });
    const data = await res.json();
    return Object.values(data.data).map((coin: any) => ({
      symbol: coin.symbol, name: coin.name, price: coin.quote.USD.price,
      change24h: coin.quote.USD.percent_change_24h, volume24h: coin.quote.USD.volume_24h, marketCap: coin.quote.USD.market_cap,
    }));
  } catch { return mock.getMockCrypto(); }
}

// ── FUTURES ──
export async function fetchFutures(): Promise<mock.FuturesQuote[]> { return mock.getMockFutures(); }

// ── FED UPDATES ──
export async function fetchFedUpdates(): Promise<mock.FedUpdate[]> {
  if (!FRED_KEY || FRED_KEY === 'your_key_here') { return mock.getMockFedUpdates(); }
  return mock.getMockFedUpdates();
}

// ── GEO RISK ──
export async function fetchGeoRisk(): Promise<mock.GeoRiskEvent[]> { return mock.getMockGeoRisk(); }

// ── CONTRACTOR PROFILES ──
export async function fetchContractor(ticker: string): Promise<mock.ContractorProfile | null> {
    const profile = mock.getMockContractor(ticker);
    if (!profile) return null;
    if (!FINNHUB_KEY || FINNHUB_KEY === 'your_key_here') return profile;
    try {
          const res = await fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${FINNHUB_KEY}`, { next: { revalidate: 60 } });
          if (res.ok) {
                  const data = await res.json();
                  if (data.c) {
                            profile.price = data.c;
                            profile.change = data.d ?? 0;
                            profile.changePct = data.dp ?? 0;
                  }
          }
    } catch (e) { /* fallback to mock price */ }
    return profile;
}

// ── HELPERS ──
function categorizeArticle(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('missile') || lower.includes('weapon') || lower.includes('pentagon') || lower.includes('defence') || lower.includes('defense') || lower.includes('military') || lower.includes('contract') || lower.includes('dod')) return 'DEFENCE';
  if (lower.includes('cyber') || lower.includes('hack') || lower.includes('breach') || lower.includes('ransomware') || lower.includes('security')) return 'CYBER';
  if (lower.includes('ai ') || lower.includes('artificial intelligence') || lower.includes('machine learning') || lower.includes('gpu') || lower.includes('chip')) return 'AI';
  if (lower.includes('nuclear') || lower.includes('reactor') || lower.includes('uranium') || lower.includes('smr') || lower.includes('fission')) return 'NUCLEAR';
  if (lower.includes('quantum') || lower.includes('qubit')) return 'QUANTUM';
  if (lower.includes('space') || lower.includes('rocket') || lower.includes('satellite') || lower.includes('launch') || lower.includes('orbit')) return 'SPACE';
  if (lower.includes('fed') || lower.includes('fomc') || lower.includes('rate') || lower.includes('inflation') || lower.includes('powell')) return 'FED';
  if (lower.includes('crypto') || lower.includes('bitcoin') || lower.includes('ethereum')) return 'CRYPTO';
  if (lower.includes('futures') || lower.includes('/es') || lower.includes('/nq')) return 'FUTURES';
  if (lower.includes('sanction') || lower.includes('geopolitical') || lower.includes('conflict') || lower.includes('war') || lower.includes('taiwan') || lower.includes('china')) return 'GEOPOLITICAL';
  return 'DEFENCE';
}
