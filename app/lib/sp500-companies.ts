// ─────────────────────────────────────────────────────────────────────────────
// Y.P Strategic Research — S&P 500 + NASDAQ 100 Company Universe
// Geographic HQ coordinates for Global Stock Intelligence Globe
// ─────────────────────────────────────────────────────────────────────────────

export type SectorKey =
  | 'Defence'
  | 'Technology'
  | 'Semiconductors'
  | 'Cybersecurity'
  | 'Space'
  | 'Finance'
  | 'Healthcare'
  | 'Energy'
  | 'Nuclear'
  | 'Consumer'
  | 'Industrial'
  | 'Telecom'

export interface GlobeCompany {
  ticker: string
  name: string
  sector: SectorKey
  hq: { lat: number; lng: number; city: string; country: string }
  marketCap: number // billions USD
  exchange: 'NYSE' | 'NASDAQ' | 'TSX' | 'AMS' | 'TWN'
}

export const SECTOR_CONFIG: Record<SectorKey, { color: string; hex: number; label: string; emoji: string }> = {
  Defence:      { color: '#1e40af', hex: 0x1e40af, label: 'Defence',       emoji: '🛡️' },
  Technology:   { color: '#0ea5e9', hex: 0x0ea5e9, label: 'Technology',    emoji: '💻' },
  Semiconductors:{ color: '#a855f7', hex: 0xa855f7, label: 'Semiconductors',emoji: '⚡' },
  Cybersecurity:{ color: '#ef4444', hex: 0xef4444, label: 'Cybersecurity', emoji: '🔒' },
  Space:        { color: '#8b5cf6', hex: 0x8b5cf6, label: 'Space',         emoji: '🚀' },
  Finance:      { color: '#f59e0b', hex: 0xf59e0b, label: 'Finance',       emoji: '💰' },
  Healthcare:   { color: '#10b981', hex: 0x10b981, label: 'Healthcare',    emoji: '🏥' },
  Energy:       { color: '#f97316', hex: 0xf97316, label: 'Energy',        emoji: '⚡' },
  Nuclear:      { color: '#84cc16', hex: 0x84cc16, label: 'Nuclear',       emoji: '☢️' },
  Consumer:     { color: '#ec4899', hex: 0xec4899, label: 'Consumer',      emoji: '🛒' },
  Industrial:   { color: '#64748b', hex: 0x64748b, label: 'Industrial',    emoji: '🏭' },
  Telecom:      { color: '#06b6d4', hex: 0x06b6d4, label: 'Telecom',       emoji: '📡' },
}

export const GLOBE_COMPANIES: GlobeCompany[] = [
  // ── DEFENCE ────────────────────────────────────────────────────────────────
  { ticker: 'LMT',  name: 'Lockheed Martin',       sector: 'Defence',      hq: { lat: 38.9816, lng: -77.1043, city: 'Bethesda, MD',      country: 'USA' }, marketCap: 110, exchange: 'NYSE' },
  { ticker: 'RTX',  name: 'RTX Corporation',        sector: 'Defence',      hq: { lat: 38.8895, lng: -77.0945, city: 'Arlington, VA',     country: 'USA' }, marketCap: 152, exchange: 'NYSE' },
  { ticker: 'NOC',  name: 'Northrop Grumman',       sector: 'Defence',      hq: { lat: 38.8808, lng: -77.1513, city: 'Falls Church, VA',  country: 'USA' }, marketCap: 68,  exchange: 'NYSE' },
  { ticker: 'GD',   name: 'General Dynamics',       sector: 'Defence',      hq: { lat: 38.9586, lng: -77.3627, city: 'Reston, VA',        country: 'USA' }, marketCap: 71,  exchange: 'NYSE' },
  { ticker: 'BA',   name: 'Boeing',                 sector: 'Defence',      hq: { lat: 38.8870, lng: -77.0995, city: 'Arlington, VA',     country: 'USA' }, marketCap: 105, exchange: 'NYSE' },
  { ticker: 'HII',  name: 'Huntington Ingalls',     sector: 'Defence',      hq: { lat: 37.0871, lng: -76.4730, city: 'Newport News, VA',  country: 'USA' }, marketCap: 9,   exchange: 'NYSE' },
  { ticker: 'LHX',  name: 'L3Harris Technologies',  sector: 'Defence',      hq: { lat: 28.0836, lng: -80.6081, city: 'Melbourne, FL',     country: 'USA' }, marketCap: 40,  exchange: 'NYSE' },
  { ticker: 'BAH',  name: 'Booz Allen Hamilton',    sector: 'Defence',      hq: { lat: 38.9344, lng: -77.1781, city: 'McLean, VA',        country: 'USA' }, marketCap: 22,  exchange: 'NYSE' },
  { ticker: 'SAIC', name: 'Science Applications',   sector: 'Defence',      hq: { lat: 38.9586, lng: -77.3527, city: 'Reston, VA',        country: 'USA' }, marketCap: 6,   exchange: 'NYSE' },
  { ticker: 'LDOS', name: 'Leidos',                 sector: 'Defence',      hq: { lat: 38.9486, lng: -77.3427, city: 'Reston, VA',        country: 'USA' }, marketCap: 20,  exchange: 'NYSE' },
  { ticker: 'KTOS', name: 'Kratos Defense',         sector: 'Defence',      hq: { lat: 32.7157, lng: -117.1611,city: 'San Diego, CA',     country: 'USA' }, marketCap: 4,   exchange: 'NASDAQ' },
  { ticker: 'AXON', name: 'Axon Enterprise',        sector: 'Defence',      hq: { lat: 33.4942, lng: -111.9261,city: 'Scottsdale, AZ',    country: 'USA' }, marketCap: 30,  exchange: 'NASDAQ' },
  { ticker: 'MRCY', name: 'Mercury Systems',        sector: 'Defence',      hq: { lat: 42.6631, lng: -71.1368, city: 'Andover, MA',       country: 'USA' }, marketCap: 3,   exchange: 'NASDAQ' },
  { ticker: 'DRS',  name: 'Leonardo DRS',           sector: 'Defence',      hq: { lat: 38.8995, lng: -77.0845, city: 'Arlington, VA',     country: 'USA' }, marketCap: 8,   exchange: 'NASDAQ' },

  // ── TECHNOLOGY ─────────────────────────────────────────────────────────────
  { ticker: 'AAPL', name: 'Apple',                  sector: 'Technology',   hq: { lat: 37.3230, lng: -122.0322,city: 'Cupertino, CA',     country: 'USA' }, marketCap: 3100,exchange: 'NASDAQ' },
  { ticker: 'MSFT', name: 'Microsoft',              sector: 'Technology',   hq: { lat: 47.6740, lng: -122.1215,city: 'Redmond, WA',       country: 'USA' }, marketCap: 2900,exchange: 'NASDAQ' },
  { ticker: 'GOOGL',name: 'Alphabet',               sector: 'Technology',   hq: { lat: 37.4220, lng: -122.0841,city: 'Mountain View, CA', country: 'USA' }, marketCap: 2100,exchange: 'NASDAQ' },
  { ticker: 'META', name: 'Meta Platforms',         sector: 'Technology',   hq: { lat: 37.4530, lng: -122.1817,city: 'Menlo Park, CA',    country: 'USA' }, marketCap: 1400,exchange: 'NASDAQ' },
  { ticker: 'AMZN', name: 'Amazon',                 sector: 'Technology',   hq: { lat: 47.6062, lng: -122.3321,city: 'Seattle, WA',       country: 'USA' }, marketCap: 2300,exchange: 'NASDAQ' },
  { ticker: 'TSLA', name: 'Tesla',                  sector: 'Technology',   hq: { lat: 30.2672, lng: -97.7431, city: 'Austin, TX',        country: 'USA' }, marketCap: 600, exchange: 'NASDAQ' },
  { ticker: 'ORCL', name: 'Oracle',                 sector: 'Technology',   hq: { lat: 30.2100, lng: -97.8280, city: 'Austin, TX',        country: 'USA' }, marketCap: 380, exchange: 'NYSE' },
  { ticker: 'CRM',  name: 'Salesforce',             sector: 'Technology',   hq: { lat: 37.7749, lng: -122.4194,city: 'San Francisco, CA', country: 'USA' }, marketCap: 250, exchange: 'NYSE' },
  { ticker: 'ADBE', name: 'Adobe',                  sector: 'Technology',   hq: { lat: 37.3382, lng: -121.8863,city: 'San Jose, CA',      country: 'USA' }, marketCap: 230, exchange: 'NASDAQ' },
  { ticker: 'PLTR', name: 'Palantir Technologies',  sector: 'Technology',   hq: { lat: 39.7392, lng: -104.9903,city: 'Denver, CO',        country: 'USA' }, marketCap: 280, exchange: 'NYSE' },
  { ticker: 'IBM',  name: 'IBM',                    sector: 'Technology',   hq: { lat: 41.1099, lng: -73.7220, city: 'Armonk, NY',        country: 'USA' }, marketCap: 180, exchange: 'NYSE' },
  { ticker: 'INTU', name: 'Intuit',                 sector: 'Technology',   hq: { lat: 37.4220, lng: -122.0841,city: 'Mountain View, CA', country: 'USA' }, marketCap: 170, exchange: 'NASDAQ' },
  { ticker: 'NOW',  name: 'ServiceNow',             sector: 'Technology',   hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 180, exchange: 'NYSE' },
  { ticker: 'SNOW', name: 'Snowflake',              sector: 'Technology',   hq: { lat: 45.6770, lng: -111.0429,city: 'Bozeman, MT',       country: 'USA' }, marketCap: 45,  exchange: 'NYSE' },
  { ticker: 'UBER', name: 'Uber Technologies',      sector: 'Technology',   hq: { lat: 37.7749, lng: -122.4194,city: 'San Francisco, CA', country: 'USA' }, marketCap: 165, exchange: 'NYSE' },
  { ticker: 'ABNB', name: 'Airbnb',                 sector: 'Technology',   hq: { lat: 37.7749, lng: -122.3894,city: 'San Francisco, CA', country: 'USA' }, marketCap: 80,  exchange: 'NASDAQ' },
  { ticker: 'SHOP', name: 'Shopify',                sector: 'Technology',   hq: { lat: 45.4215, lng: -75.6972, city: 'Ottawa, ON',        country: 'Canada' }, marketCap: 110,exchange: 'NYSE' },
  { ticker: 'NFLX', name: 'Netflix',               sector: 'Technology',   hq: { lat: 37.2691, lng: -121.9673,city: 'Los Gatos, CA',     country: 'USA' }, marketCap: 370, exchange: 'NASDAQ' },
  { ticker: 'SPOT', name: 'Spotify',               sector: 'Technology',   hq: { lat: 59.3293, lng: 18.0686,  city: 'Stockholm',         country: 'Sweden' }, marketCap: 80, exchange: 'NYSE' },

  // ── SEMICONDUCTORS ─────────────────────────────────────────────────────────
  { ticker: 'NVDA', name: 'NVIDIA',                 sector: 'Semiconductors',hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 3200,exchange: 'NASDAQ' },
  { ticker: 'AMD',  name: 'AMD',                    sector: 'Semiconductors',hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 220, exchange: 'NASDAQ' },
  { ticker: 'INTC', name: 'Intel',                  sector: 'Semiconductors',hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 85,  exchange: 'NASDAQ' },
  { ticker: 'AVGO', name: 'Broadcom',               sector: 'Semiconductors',hq: { lat: 37.3382, lng: -121.8863,city: 'San Jose, CA',      country: 'USA' }, marketCap: 850, exchange: 'NASDAQ' },
  { ticker: 'QCOM', name: 'Qualcomm',               sector: 'Semiconductors',hq: { lat: 32.7157, lng: -117.1611,city: 'San Diego, CA',     country: 'USA' }, marketCap: 165, exchange: 'NASDAQ' },
  { ticker: 'TXN',  name: 'Texas Instruments',      sector: 'Semiconductors',hq: { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX',        country: 'USA' }, marketCap: 155, exchange: 'NASDAQ' },
  { ticker: 'AMAT', name: 'Applied Materials',      sector: 'Semiconductors',hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 155, exchange: 'NASDAQ' },
  { ticker: 'LRCX', name: 'Lam Research',           sector: 'Semiconductors',hq: { lat: 37.5485, lng: -121.9886,city: 'Fremont, CA',       country: 'USA' }, marketCap: 95,  exchange: 'NASDAQ' },
  { ticker: 'KLAC', name: 'KLA Corporation',        sector: 'Semiconductors',hq: { lat: 37.4323, lng: -121.8997,city: 'Milpitas, CA',      country: 'USA' }, marketCap: 85,  exchange: 'NASDAQ' },
  { ticker: 'MU',   name: 'Micron Technology',      sector: 'Semiconductors',hq: { lat: 43.6150, lng: -116.2023,city: 'Boise, ID',         country: 'USA' }, marketCap: 98,  exchange: 'NASDAQ' },
  { ticker: 'ADI',  name: 'Analog Devices',         sector: 'Semiconductors',hq: { lat: 42.5584, lng: -71.1648, city: 'Wilmington, MA',    country: 'USA' }, marketCap: 95,  exchange: 'NASDAQ' },
  { ticker: 'MRVL', name: 'Marvell Technology',     sector: 'Semiconductors',hq: { lat: 37.3541, lng: -121.9652,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 60,  exchange: 'NASDAQ' },
  { ticker: 'TSM',  name: 'TSMC',                   sector: 'Semiconductors',hq: { lat: 24.8138, lng: 120.9675, city: 'Hsinchu',           country: 'Taiwan' }, marketCap: 900,exchange: 'TWN' },
  { ticker: 'ASML', name: 'ASML Holding',           sector: 'Semiconductors',hq: { lat: 51.4167, lng: 5.4167,  city: 'Veldhoven',         country: 'Netherlands' }, marketCap: 300,exchange: 'AMS' },
  { ticker: 'IONQ', name: 'IonQ',                   sector: 'Semiconductors',hq: { lat: 38.9954, lng: -76.8629, city: 'College Park, MD',  country: 'USA' }, marketCap: 8,   exchange: 'NYSE' },
  { ticker: 'RGTI', name: 'Rigetti Computing',      sector: 'Semiconductors',hq: { lat: 37.8715, lng: -122.2730,city: 'Berkeley, CA',      country: 'USA' }, marketCap: 1,   exchange: 'NASDAQ' },
  { ticker: 'QUBT', name: 'Quantum Computing',      sector: 'Semiconductors',hq: { lat: 38.7996, lng: -77.3072, city: 'Fairfax, VA',       country: 'USA' }, marketCap: 1,   exchange: 'NASDAQ' },

  // ── CYBERSECURITY ──────────────────────────────────────────────────────────
  { ticker: 'CRWD', name: 'CrowdStrike',            sector: 'Cybersecurity', hq: { lat: 30.2672, lng: -97.7431, city: 'Austin, TX',        country: 'USA' }, marketCap: 75,  exchange: 'NASDAQ' },
  { ticker: 'PANW', name: 'Palo Alto Networks',     sector: 'Cybersecurity', hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 120, exchange: 'NASDAQ' },
  { ticker: 'ZS',   name: 'Zscaler',               sector: 'Cybersecurity', hq: { lat: 37.3382, lng: -121.8863,city: 'San Jose, CA',      country: 'USA' }, marketCap: 28,  exchange: 'NASDAQ' },
  { ticker: 'FTNT', name: 'Fortinet',               sector: 'Cybersecurity', hq: { lat: 37.3688, lng: -122.0363,city: 'Sunnyvale, CA',     country: 'USA' }, marketCap: 55,  exchange: 'NASDAQ' },
  { ticker: 'NET',  name: 'Cloudflare',             sector: 'Cybersecurity', hq: { lat: 37.7749, lng: -122.4194,city: 'San Francisco, CA', country: 'USA' }, marketCap: 35,  exchange: 'NYSE' },
  { ticker: 'S',    name: 'SentinelOne',            sector: 'Cybersecurity', hq: { lat: 37.4220, lng: -122.0841,city: 'Mountain View, CA', country: 'USA' }, marketCap: 18,  exchange: 'NYSE' },
  { ticker: 'DDOG', name: 'Datadog',                sector: 'Cybersecurity', hq: { lat: 40.7128, lng: -74.0060, city: 'New York, NY',      country: 'USA' }, marketCap: 45,  exchange: 'NASDAQ' },
  { ticker: 'OKTA', name: 'Okta',                   sector: 'Cybersecurity', hq: { lat: 37.7749, lng: -122.4194,city: 'San Francisco, CA', country: 'USA' }, marketCap: 18,  exchange: 'NASDAQ' },

  // ── SPACE ──────────────────────────────────────────────────────────────────
  { ticker: 'RKLB', name: 'Rocket Lab',             sector: 'Space',         hq: { lat: 33.7701, lng: -118.1937,city: 'Long Beach, CA',    country: 'USA' }, marketCap: 14,  exchange: 'NASDAQ' },
  { ticker: 'ASTS', name: 'AST SpaceMobile',        sector: 'Space',         hq: { lat: 31.9973, lng: -102.0779,city: 'Midland, TX',       country: 'USA' }, marketCap: 8,   exchange: 'NASDAQ' },
  { ticker: 'MNTS', name: 'Momentus',               sector: 'Space',         hq: { lat: 37.3382, lng: -121.8863,city: 'San Jose, CA',      country: 'USA' }, marketCap: 0.3, exchange: 'NASDAQ' },
  { ticker: 'RDW',  name: 'Redwire Space',          sector: 'Space',         hq: { lat: 30.3322, lng: -81.6557, city: 'Jacksonville, FL',  country: 'USA' }, marketCap: 1,   exchange: 'NYSE' },
  { ticker: 'LUNR', name: 'Intuitive Machines',     sector: 'Space',         hq: { lat: 29.7604, lng: -95.3698, city: 'Houston, TX',       country: 'USA' }, marketCap: 2,   exchange: 'NASDAQ' },
  { ticker: 'SPCE', name: 'Virgin Galactic',        sector: 'Space',         hq: { lat: 34.5794, lng: -118.1165,city: 'Mojave, CA',        country: 'USA' }, marketCap: 0.4, exchange: 'NYSE' },

  // ── FINANCE ────────────────────────────────────────────────────────────────
  { ticker: 'JPM',  name: 'JPMorgan Chase',         sector: 'Finance',       hq: { lat: 40.7128, lng: -74.0060, city: 'New York, NY',      country: 'USA' }, marketCap: 700, exchange: 'NYSE' },
  { ticker: 'BAC',  name: 'Bank of America',        sector: 'Finance',       hq: { lat: 35.2271, lng: -80.8431, city: 'Charlotte, NC',     country: 'USA' }, marketCap: 320, exchange: 'NYSE' },
  { ticker: 'GS',   name: 'Goldman Sachs',          sector: 'Finance',       hq: { lat: 40.7128, lng: -74.0160, city: 'New York, NY',      country: 'USA' }, marketCap: 170, exchange: 'NYSE' },
  { ticker: 'MS',   name: 'Morgan Stanley',         sector: 'Finance',       hq: { lat: 40.7128, lng: -74.0050, city: 'New York, NY',      country: 'USA' }, marketCap: 180, exchange: 'NYSE' },
  { ticker: 'V',    name: 'Visa',                   sector: 'Finance',       hq: { lat: 37.7749, lng: -122.4094,city: 'San Francisco, CA', country: 'USA' }, marketCap: 540, exchange: 'NYSE' },
  { ticker: 'MA',   name: 'Mastercard',             sector: 'Finance',       hq: { lat: 41.0534, lng: -73.7198, city: 'Purchase, NY',      country: 'USA' }, marketCap: 475, exchange: 'NYSE' },
  { ticker: 'AXP',  name: 'American Express',       sector: 'Finance',       hq: { lat: 40.7128, lng: -74.0160, city: 'New York, NY',      country: 'USA' }, marketCap: 185, exchange: 'NYSE' },
  { ticker: 'BLK',  name: 'BlackRock',              sector: 'Finance',       hq: { lat: 40.7128, lng: -73.9960, city: 'New York, NY',      country: 'USA' }, marketCap: 130, exchange: 'NYSE' },
  { ticker: 'SCHW', name: 'Charles Schwab',         sector: 'Finance',       hq: { lat: 32.9945, lng: -97.2461, city: 'Westlake, TX',      country: 'USA' }, marketCap: 120, exchange: 'NYSE' },
  { ticker: 'CME',  name: 'CME Group',              sector: 'Finance',       hq: { lat: 41.8781, lng: -87.6298, city: 'Chicago, IL',       country: 'USA' }, marketCap: 75,  exchange: 'NASDAQ' },
  { ticker: 'COIN', name: 'Coinbase',               sector: 'Finance',       hq: { lat: 37.7749, lng: -122.4394,city: 'San Francisco, CA', country: 'USA' }, marketCap: 55,  exchange: 'NASDAQ' },
  { ticker: 'HOOD', name: 'Robinhood Markets',      sector: 'Finance',       hq: { lat: 37.4530, lng: -122.1817,city: 'Menlo Park, CA',    country: 'USA' }, marketCap: 18,  exchange: 'NASDAQ' },
  { ticker: 'SQ',   name: 'Block (Square)',         sector: 'Finance',       hq: { lat: 37.7749, lng: -122.3794,city: 'San Francisco, CA', country: 'USA' }, marketCap: 42,  exchange: 'NYSE' },
  { ticker: 'PYPL', name: 'PayPal',                 sector: 'Finance',       hq: { lat: 37.3688, lng: -122.0363,city: 'San Jose, CA',      country: 'USA' }, marketCap: 68,  exchange: 'NASDAQ' },

  // ── HEALTHCARE ─────────────────────────────────────────────────────────────
  { ticker: 'JNJ',  name: 'Johnson & Johnson',      sector: 'Healthcare',    hq: { lat: 40.4971, lng: -74.4421, city: 'New Brunswick, NJ', country: 'USA' }, marketCap: 380, exchange: 'NYSE' },
  { ticker: 'UNH',  name: 'UnitedHealth Group',     sector: 'Healthcare',    hq: { lat: 44.9237, lng: -93.4686, city: 'Minnetonka, MN',    country: 'USA' }, marketCap: 500, exchange: 'NYSE' },
  { ticker: 'PFE',  name: 'Pfizer',                 sector: 'Healthcare',    hq: { lat: 40.7128, lng: -74.0060, city: 'New York, NY',      country: 'USA' }, marketCap: 140, exchange: 'NYSE' },
  { ticker: 'ABBV', name: 'AbbVie',                 sector: 'Healthcare',    hq: { lat: 42.3251, lng: -87.8425, city: 'North Chicago, IL',  country: 'USA' }, marketCap: 320, exchange: 'NYSE' },
  { ticker: 'MRK',  name: 'Merck',                  sector: 'Healthcare',    hq: { lat: 40.6081, lng: -74.2774, city: 'Rahway, NJ',        country: 'USA' }, marketCap: 220, exchange: 'NYSE' },
  { ticker: 'LLY',  name: 'Eli Lilly',              sector: 'Healthcare',    hq: { lat: 39.7684, lng: -86.1581, city: 'Indianapolis, IN',  country: 'USA' }, marketCap: 700, exchange: 'NYSE' },
  { ticker: 'TMO',  name: 'Thermo Fisher Scientific',sector: 'Healthcare',   hq: { lat: 42.3767, lng: -71.2356, city: 'Waltham, MA',       country: 'USA' }, marketCap: 200, exchange: 'NYSE' },
  { ticker: 'AMGN', name: 'Amgen',                  sector: 'Healthcare',    hq: { lat: 34.1706, lng: -118.8376,city: 'Thousand Oaks, CA', country: 'USA' }, marketCap: 155, exchange: 'NASDAQ' },
  { ticker: 'GILD', name: 'Gilead Sciences',        sector: 'Healthcare',    hq: { lat: 37.5577, lng: -122.2591,city: 'Foster City, CA',   country: 'USA' }, marketCap: 100, exchange: 'NASDAQ' },
  { ticker: 'VRTX', name: 'Vertex Pharmaceuticals', sector: 'Healthcare',    hq: { lat: 42.3601, lng: -71.0589, city: 'Boston, MA',        country: 'USA' }, marketCap: 110, exchange: 'NASDAQ' },
  { ticker: 'ISRG', name: 'Intuitive Surgical',     sector: 'Healthcare',    hq: { lat: 37.3688, lng: -122.0363,city: 'Sunnyvale, CA',     country: 'USA' }, marketCap: 155, exchange: 'NASDAQ' },

  // ── ENERGY ─────────────────────────────────────────────────────────────────
  { ticker: 'XOM',  name: 'ExxonMobil',             sector: 'Energy',        hq: { lat: 30.0800, lng: -95.4172, city: 'Spring, TX',        country: 'USA' }, marketCap: 490, exchange: 'NYSE' },
  { ticker: 'CVX',  name: 'Chevron',                sector: 'Energy',        hq: { lat: 37.7790, lng: -121.9780,city: 'San Ramon, CA',     country: 'USA' }, marketCap: 270, exchange: 'NYSE' },
  { ticker: 'COP',  name: 'ConocoPhillips',         sector: 'Energy',        hq: { lat: 29.7604, lng: -95.3698, city: 'Houston, TX',       country: 'USA' }, marketCap: 125, exchange: 'NYSE' },
  { ticker: 'SLB',  name: 'SLB (Schlumberger)',     sector: 'Energy',        hq: { lat: 29.7604, lng: -95.4698, city: 'Houston, TX',       country: 'USA' }, marketCap: 60,  exchange: 'NYSE' },
  { ticker: 'HAL',  name: 'Halliburton',            sector: 'Energy',        hq: { lat: 29.7604, lng: -95.5698, city: 'Houston, TX',       country: 'USA' }, marketCap: 28,  exchange: 'NYSE' },
  { ticker: 'EOG',  name: 'EOG Resources',          sector: 'Energy',        hq: { lat: 29.7604, lng: -95.6698, city: 'Houston, TX',       country: 'USA' }, marketCap: 65,  exchange: 'NYSE' },
  { ticker: 'SHEL', name: 'Shell',                  sector: 'Energy',        hq: { lat: 51.5074, lng: -0.1278,  city: 'London',            country: 'UK' },  marketCap: 220, exchange: 'NYSE' },
  { ticker: 'BP',   name: 'BP',                     sector: 'Energy',        hq: { lat: 51.5174, lng: -0.1178,  city: 'London',            country: 'UK' },  marketCap: 95,  exchange: 'NYSE' },

  // ── NUCLEAR ────────────────────────────────────────────────────────────────
  { ticker: 'CEG',  name: 'Constellation Energy',   sector: 'Nuclear',       hq: { lat: 39.2904, lng: -76.6122, city: 'Baltimore, MD',     country: 'USA' }, marketCap: 75,  exchange: 'NASDAQ' },
  { ticker: 'VST',  name: 'Vistra Energy',          sector: 'Nuclear',       hq: { lat: 32.8141, lng: -96.9490, city: 'Irving, TX',        country: 'USA' }, marketCap: 55,  exchange: 'NYSE' },
  { ticker: 'BWXT', name: 'BWX Technologies',       sector: 'Nuclear',       hq: { lat: 37.4138, lng: -79.1422, city: 'Lynchburg, VA',     country: 'USA' }, marketCap: 8,   exchange: 'NYSE' },
  { ticker: 'OKLO', name: 'Oklo',                   sector: 'Nuclear',       hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 3,   exchange: 'NYSE' },
  { ticker: 'NNE',  name: 'Nano Nuclear Energy',    sector: 'Nuclear',       hq: { lat: 40.7128, lng: -74.0160, city: 'New York, NY',      country: 'USA' }, marketCap: 0.5, exchange: 'NASDAQ' },
  { ticker: 'SMR',  name: 'NuScale Power',          sector: 'Nuclear',       hq: { lat: 45.5051, lng: -122.6750,city: 'Portland, OR',      country: 'USA' }, marketCap: 0.8, exchange: 'NYSE' },
  { ticker: 'LEU',  name: 'Centrus Energy',         sector: 'Nuclear',       hq: { lat: 38.9954, lng: -77.1630, city: 'Bethesda, MD',      country: 'USA' }, marketCap: 0.6, exchange: 'NYSE' },

  // ── CONSUMER / RETAIL ──────────────────────────────────────────────────────
  { ticker: 'WMT',  name: 'Walmart',                sector: 'Consumer',      hq: { lat: 36.3728, lng: -94.2088, city: 'Bentonville, AR',   country: 'USA' }, marketCap: 750, exchange: 'NYSE' },
  { ticker: 'COST', name: 'Costco',                 sector: 'Consumer',      hq: { lat: 47.5301, lng: -122.0326,city: 'Issaquah, WA',      country: 'USA' }, marketCap: 400, exchange: 'NASDAQ' },
  { ticker: 'TGT',  name: 'Target',                 sector: 'Consumer',      hq: { lat: 44.9778, lng: -93.2650, city: 'Minneapolis, MN',   country: 'USA' }, marketCap: 55,  exchange: 'NYSE' },
  { ticker: 'HD',   name: 'Home Depot',             sector: 'Consumer',      hq: { lat: 33.7490, lng: -84.3880, city: 'Atlanta, GA',       country: 'USA' }, marketCap: 370, exchange: 'NYSE' },
  { ticker: 'NKE',  name: 'Nike',                   sector: 'Consumer',      hq: { lat: 45.4871, lng: -122.8037,city: 'Beaverton, OR',     country: 'USA' }, marketCap: 95,  exchange: 'NYSE' },
  { ticker: 'SBUX', name: 'Starbucks',              sector: 'Consumer',      hq: { lat: 47.6062, lng: -122.3321,city: 'Seattle, WA',       country: 'USA' }, marketCap: 90,  exchange: 'NASDAQ' },
  { ticker: 'MCD',  name: "McDonald's",             sector: 'Consumer',      hq: { lat: 41.8781, lng: -87.6298, city: 'Chicago, IL',       country: 'USA' }, marketCap: 215, exchange: 'NYSE' },
  { ticker: 'AMZN_CNS', name: 'Amazon (Consumer)',  sector: 'Consumer',      hq: { lat: 47.6162, lng: -122.3421,city: 'Seattle, WA',       country: 'USA' }, marketCap: 800, exchange: 'NASDAQ' },

  // ── INDUSTRIAL ─────────────────────────────────────────────────────────────
  { ticker: 'GE',   name: 'GE Aerospace',           sector: 'Industrial',    hq: { lat: 41.8781, lng: -87.7298, city: 'Chicago, IL',       country: 'USA' }, marketCap: 200, exchange: 'NYSE' },
  { ticker: 'HON',  name: 'Honeywell',               sector: 'Industrial',   hq: { lat: 35.0457, lng: -80.8828, city: 'Charlotte, NC',     country: 'USA' }, marketCap: 130, exchange: 'NASDAQ' },
  { ticker: 'CAT',  name: 'Caterpillar',             sector: 'Industrial',   hq: { lat: 40.6936, lng: -89.5890, city: 'Peoria, IL',        country: 'USA' }, marketCap: 180, exchange: 'NYSE' },
  { ticker: 'DE',   name: 'Deere & Company',         sector: 'Industrial',   hq: { lat: 41.5236, lng: -90.5776, city: 'Moline, IL',        country: 'USA' }, marketCap: 110, exchange: 'NYSE' },
  { ticker: 'UPS',  name: 'UPS',                     sector: 'Industrial',   hq: { lat: 33.7490, lng: -84.4880, city: 'Atlanta, GA',       country: 'USA' }, marketCap: 85,  exchange: 'NYSE' },
  { ticker: 'FDX',  name: 'FedEx',                   sector: 'Industrial',   hq: { lat: 35.1495, lng: -90.0490, city: 'Memphis, TN',       country: 'USA' }, marketCap: 60,  exchange: 'NYSE' },

  // ── TELECOM ────────────────────────────────────────────────────────────────
  { ticker: 'ANET', name: 'Arista Networks',        sector: 'Telecom',       hq: { lat: 37.3541, lng: -121.9552,city: 'Santa Clara, CA',   country: 'USA' }, marketCap: 90,  exchange: 'NYSE' },
  { ticker: 'T',    name: 'AT&T',                   sector: 'Telecom',       hq: { lat: 32.7767, lng: -96.7970, city: 'Dallas, TX',        country: 'USA' }, marketCap: 120, exchange: 'NYSE' },
  { ticker: 'VZ',   name: 'Verizon',                sector: 'Telecom',       hq: { lat: 40.7128, lng: -74.0060, city: 'New York, NY',      country: 'USA' }, marketCap: 165, exchange: 'NYSE' },
  { ticker: 'TMUS', name: 'T-Mobile US',            sector: 'Telecom',       hq: { lat: 47.6740, lng: -122.1315,city: 'Bellevue, WA',      country: 'USA' }, marketCap: 210, exchange: 'NASDAQ' },
]

// Filter out the duplicate AMZN_CNS entry (consumer category alias)
export const GLOBE_COMPANIES_FILTERED = GLOBE_COMPANIES.filter(c => c.ticker !== 'AMZN_CNS')

export const ALL_TICKERS = GLOBE_COMPANIES_FILTERED.map(c => c.ticker)

export const getSectorColor = (sector: SectorKey): string => SECTOR_CONFIG[sector]?.color ?? '#00d4ff'
export const getSectorHex = (sector: SectorKey): number => SECTOR_CONFIG[sector]?.hex ?? 0x00d4ff
