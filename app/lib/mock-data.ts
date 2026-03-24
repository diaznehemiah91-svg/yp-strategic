// ═══════════════════════════════════════════════════════════
// Y.P STRATEGIC — Mock Data Layer
// Returns realistic placeholder data when API keys aren't configured
// Every function here mirrors the shape of the real API responses
// ═══════════════════════════════════════════════════════════

export interface StockQuote {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  sector: string;
}

export interface SignalItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  category: string;
  severity: string;
  tickers: string[];
  publishedAt: string;
  timestamp: string;
}

export interface ContractorProfile {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  sector: string;
  description: string;
  keyPrograms: string[];
  recentContracts: { title: string; value: string; date: string; agency: string }[];
  financials: { revenue: string; ebitda: string; backlog: string; pe: number; divYield: string };
  riskFactors: string[];
  relatedTickers: string[];
  signals: SignalItem[];
}

export interface CryptoQuote {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

export interface FuturesQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
}

export interface FedUpdate {
  id: string;
  title: string;
  type: string;
  summary: string;
  sentiment: string;
  date: string;
}

export interface GeoRiskEvent {
  id: string;
  title: string;
  region: string;
  severity: number;
  category: string;
  summary: string;
  impactTickers: string[];
  timestamp: string;
}

// ── DEFENCE STOCKS ──
export function getMockStocks(): StockQuote[] {
  return [
    { ticker: 'LMT', name: 'Lockheed Martin', price: 481.55, change: 2.98, changePct: 0.62, volume: 1243000, marketCap: 115200000000, sector: 'Aerospace & Defence' },
    { ticker: 'RTX', name: 'RTX Corporation', price: 124.18, change: 1.32, changePct: 1.07, volume: 3890000, marketCap: 165300000000, sector: 'Aerospace & Defence' },
    { ticker: 'NOC', name: 'Northrop Grumman', price: 498.30, change: -2.15, changePct: -0.43, volume: 982000, marketCap: 73500000000, sector: 'Aerospace & Defence' },
    { ticker: 'GD', name: 'General Dynamics', price: 302.44, change: 1.87, changePct: 0.62, volume: 1120000, marketCap: 82100000000, sector: 'Aerospace & Defence' },
    { ticker: 'BA', name: 'Boeing', price: 178.92, change: -3.44, changePct: -1.89, volume: 8340000, marketCap: 109200000000, sector: 'Aerospace & Defence' },
    { ticker: 'PLTR', name: 'Palantir Technologies', price: 87.42, change: 2.72, changePct: 3.21, volume: 42800000, marketCap: 192300000000, sector: 'Defence Tech / AI' },
    { ticker: 'CRWD', name: 'CrowdStrike', price: 342.90, change: 7.21, changePct: 2.15, volume: 5670000, marketCap: 82400000000, sector: 'Cybersecurity' },
    { ticker: 'NVDA', name: 'NVIDIA', price: 892.30, change: -7.54, changePct: -0.84, volume: 38200000, marketCap: 2200000000000, sector: 'Semiconductors / AI' },
    { ticker: 'AXON', name: 'Axon Enterprise', price: 298.67, change: 5.53, changePct: 1.89, volume: 1340000, marketCap: 22100000000, sector: 'Defence Tech' },
    { ticker: 'IONQ', name: 'IonQ', price: 18.74, change: -0.25, changePct: -1.33, volume: 12400000, marketCap: 4200000000, sector: 'Quantum Computing' },
    { ticker: 'OKLO', name: 'Oklo Inc', price: 31.08, change: 1.61, changePct: 5.44, volume: 8900000, marketCap: 6100000000, sector: 'Nuclear Energy' },
    { ticker: 'RKLB', name: 'Rocket Lab', price: 22.47, change: 0.89, changePct: 4.12, volume: 15600000, marketCap: 10800000000, sector: 'Space & Launch' },
    { ticker: 'LDOS', name: 'Leidos Holdings', price: 148.22, change: 0.44, changePct: 0.30, volume: 1870000, marketCap: 19600000000, sector: 'IT Services / Defence' },
    { ticker: 'HII', name: 'Huntington Ingalls', price: 245.60, change: -1.82, changePct: -0.74, volume: 456000, marketCap: 9700000000, sector: 'Shipbuilding' },
  ];
}

// ── SIGNAL FEED ──
export function getMockSignals(): SignalItem[] {
  const now = new Date();
  return [
    { id: 's1', title: 'Palantir Secures $480M Army TITAN Contract Extension', summary: 'PLTR awarded continuation of AI-enabled targeting system for next-gen ground vehicles. Contract ceiling raised to $960M through 2028.', source: 'DoD Contract Wire', url: '#', category: 'DEFENCE', severity: 'INFO', tickers: ['PLTR'], publishedAt: new Date(now.getTime() - 18 * 60000).toISOString(), timestamp: '14:32' },
    { id: 's2', title: 'Anduril Lattice OS Integration with JADC2 Confirmed', summary: 'Pentagon confirms Anduril command platform selected for Joint All-Domain interoperability test. Proxies: PLTR, AXON, RTX.', source: 'Defence One', url: '#', category: 'AI', severity: 'INFO', tickers: ['PLTR', 'AXON', 'RTX'], publishedAt: new Date(now.getTime() - 32 * 60000).toISOString(), timestamp: '14:18' },
    { id: 's3', title: 'Oklo Receives NRC Site Permit — First Advanced Fission Approval', summary: 'Micro-reactor company clears major regulatory milestone for Idaho deployment. Stock surges 5.4% on volume.', source: 'NRC Press Release', url: '#', category: 'NUCLEAR', severity: 'ALERT', tickers: ['OKLO'], publishedAt: new Date(now.getTime() - 55 * 60000).toISOString(), timestamp: '13:55' },
    { id: 's4', title: '⚠ CRWD Threat Intel: Nation-State APT Targeting Defence Subs', summary: 'CrowdStrike Falcon OverWatch detects coordinated intrusion campaign against Tier-2 prime contractors. CISA advisory expected.', source: 'CrowdStrike Blog', url: '#', category: 'CYBER', severity: 'CRITICAL', tickers: ['CRWD'], publishedAt: new Date(now.getTime() - 69 * 60000).toISOString(), timestamp: '13:41' },
    { id: 's5', title: 'IonQ Achieves 99.7% 2-Qubit Gate Fidelity', summary: 'Trapped-ion quantum processor hits reliability threshold for enterprise error correction. Partnership with Azure Quantum deepens.', source: 'IonQ Press', url: '#', category: 'QUANTUM', severity: 'INFO', tickers: ['IONQ'], publishedAt: new Date(now.getTime() - 90 * 60000).toISOString(), timestamp: '13:20' },
    { id: 's6', title: 'Lockheed F-35 Block 4 Software Delay — GAO Report', summary: 'Government Accountability Office flags 18-month slip in TR-3 software delivery. Congress may cap production.', source: 'GAO', url: '#', category: 'DEFENCE', severity: 'ALERT', tickers: ['LMT'], publishedAt: new Date(now.getTime() - 120 * 60000).toISOString(), timestamp: '12:50' },
    { id: 's7', title: 'RTX Patriot System Sale to Poland — $4.7B FMS Deal', summary: 'State Dept approves Foreign Military Sale of 8 Patriot fire units to Poland. RTX primary contractor.', source: 'DSCA', url: '#', category: 'DEFENCE', severity: 'INFO', tickers: ['RTX'], publishedAt: new Date(now.getTime() - 150 * 60000).toISOString(), timestamp: '12:20' },
    { id: 's8', title: 'NVIDIA H200 Allocation: DoD Gets Priority Queue', summary: 'Pentagon secures dedicated H200 GPU allocation for classified AI workloads. $400M procurement through DISA.', source: 'Bloomberg', url: '#', category: 'AI', severity: 'INFO', tickers: ['NVDA'], publishedAt: new Date(now.getTime() - 180 * 60000).toISOString(), timestamp: '11:50' },
    { id: 's9', title: 'China Taiwan Strait: PLA Navy Exercises Escalate', summary: 'Satellite imagery confirms 47-vessel PLA Navy exercise in Taiwan Strait. Largest since 2024. Defence primes rally.', source: 'OSINT / Maxar', url: '#', category: 'GEOPOLITICAL', severity: 'CRITICAL', tickers: ['LMT', 'RTX', 'NOC', 'GD'], publishedAt: new Date(now.getTime() - 210 * 60000).toISOString(), timestamp: '11:20' },
    { id: 's10', title: 'Fed Governor Waller: "Data Supports Holding Rates Through Q3"', summary: 'In prepared remarks, Waller signals no rate cuts before September. Defence stocks stable, growth names dip.', source: 'Federal Reserve', url: '#', category: 'FED', severity: 'ALERT', tickers: [], publishedAt: new Date(now.getTime() - 240 * 60000).toISOString(), timestamp: '10:50' },
    { id: 's11', title: 'Bitcoin Tests $108K Resistance — Institutional Inflows Surge', summary: 'BTC spot ETF inflows hit $2.1B weekly. Grayscale outflows slow. Correlation with /NQ tightening.', source: 'CoinDesk', url: '#', category: 'CRYPTO', severity: 'INFO', tickers: [], publishedAt: new Date(now.getTime() - 270 * 60000).toISOString(), timestamp: '10:20' },
    { id: 's12', title: '/ES Futures Gap Up on Strong China PMI — /NQ Leads', summary: 'S&P 500 futures +0.8% pre-market. Nasdaq futures +1.1%. Risk-on sentiment prevails ahead of PCE data.', source: 'CME Group', url: '#', category: 'FUTURES', severity: 'INFO', tickers: [], publishedAt: new Date(now.getTime() - 300 * 60000).toISOString(), timestamp: '09:50' },
  ];
}

// ── CONTRACTOR DEEP PROFILES ──
export function getMockContractor(ticker: string): ContractorProfile | null {
  const contractors: Record<string, ContractorProfile> = {
    LMT: {
      ticker: 'LMT', name: 'Lockheed Martin Corporation', price: 481.55, change: 2.98, changePct: 0.62, sector: 'Aerospace & Defence',
      description: 'The world\'s largest defence contractor by revenue. Core programs include F-35 Joint Strike Fighter, classified hypersonics, and next-gen ICBM (Sentinel). Primary beneficiary of sustained DoD budget growth.',
      keyPrograms: ['F-35 Lightning II', 'Sentinel ICBM (GBSD)', 'PAC-3 MSE', 'THAAD', 'Classified Hypersonics', 'Space Fence', 'Sikorsky CH-53K'],
      recentContracts: [
        { title: 'F-35 Lot 18-19 Production', value: '$7.8B', date: '2026-02-15', agency: 'USAF / Navy / USMC' },
        { title: 'Sentinel GBSD Development Phase', value: '$2.3B', date: '2026-01-28', agency: 'USAF Nuclear' },
        { title: 'THAAD Battery Delivery — Saudi Arabia', value: '$1.1B', date: '2025-12-10', agency: 'DSCA / FMS' },
        { title: 'Classified Space Program', value: '$890M', date: '2025-11-22', agency: 'NRO' },
      ],
      financials: { revenue: '$71.3B', ebitda: '$10.8B', backlog: '$165.4B', pe: 17.2, divYield: '2.58%' },
      riskFactors: ['F-35 TR-3 software delays', 'Sentinel ICBM cost overruns', 'Congressional sequestration risk', 'Supply chain constraints on titanium'],
      relatedTickers: ['RTX', 'NOC', 'GD', 'BA', 'HII'],
      signals: [],
    },
    RTX: {
      ticker: 'RTX', name: 'RTX Corporation (Raytheon)', price: 124.18, change: 1.32, changePct: 1.07, sector: 'Aerospace & Defence',
      description: 'Formed from the Raytheon-UTC merger. Dominant in missile systems (Patriot, StingerJavelin), jet engines (Pratt & Whitney), and aerospace systems (Collins). Massive FMS backlog.',
      keyPrograms: ['Patriot PAC-3', 'SM-3 / SM-6', 'Stinger / Javelin', 'Pratt & Whitney F135', 'LTAMDS', 'SPY-6 Radar'],
      recentContracts: [
        { title: 'Patriot Fire Units — Poland FMS', value: '$4.7B', date: '2026-03-10', agency: 'DSCA' },
        { title: 'SM-3 Block IIA Production', value: '$1.9B', date: '2026-02-01', agency: 'MDA' },
        { title: 'Pratt & Whitney F135 EEP Upgrade', value: '$3.2B', date: '2025-12-18', agency: 'USAF' },
      ],
      financials: { revenue: '$73.9B', ebitda: '$11.2B', backlog: '$206.0B', pe: 35.4, divYield: '2.12%' },
      riskFactors: ['Pratt & Whitney powder metal fatigue issue', 'GTF engine recall costs', 'European supply chain exposure', 'FMS delivery timeline risk'],
      relatedTickers: ['LMT', 'NOC', 'GD', 'BA', 'LDOS'],
      signals: [],
    },
    PLTR: {
      ticker: 'PLTR', name: 'Palantir Technologies', price: 87.42, change: 2.72, changePct: 3.21, sector: 'Defence Tech / AI',
      description: 'AI-first defence and intelligence platform. Gotham serves IC/DoD. Foundry targets commercial. AIP (Artificial Intelligence Platform) is the fastest-growing product driving government AI adoption.',
      keyPrograms: ['Gotham (IC/DoD)', 'Foundry (Commercial)', 'AIP (AI Platform)', 'TITAN (Army)', 'Maven Smart System', 'CDAO Partnership'],
      recentContracts: [
        { title: 'Army TITAN Contract Extension', value: '$480M', date: '2026-03-18', agency: 'US Army' },
        { title: 'CDAO AI/ML Framework', value: '$250M', date: '2026-01-15', agency: 'DoD CDAO' },
        { title: 'NHS England Digital Twin', value: '$120M', date: '2025-11-30', agency: 'UK MoD / NHS' },
      ],
      financials: { revenue: '$3.2B', ebitda: '$680M', backlog: '$4.8B', pe: 198.5, divYield: '0%' },
      riskFactors: ['Valuation compression risk', 'Government budget dependency', 'Competition from Anduril/Scale AI', 'Stock-based compensation dilution'],
      relatedTickers: ['AXON', 'CRWD', 'NVDA', 'IONQ'],
      signals: [],
    },
    NOC: {
      ticker: 'NOC', name: 'Northrop Grumman', price: 498.30, change: -2.15, changePct: -0.43, sector: 'Aerospace & Defence',
      description: 'Premier systems integrator for classified and space programs. B-21 Raider stealth bomber is the marquee program. Dominant in space launch, nuclear command & control, and autonomous systems.',
      keyPrograms: ['B-21 Raider', 'Sentinel GBSD (airframe)', 'James Webb (heritage)', 'HALE UAS / Triton', 'Nuclear C3', 'Space Launch SLS'],
      recentContracts: [
        { title: 'B-21 Raider LRIP Lot 2', value: '$5.1B', date: '2026-02-28', agency: 'USAF' },
        { title: 'Space Development Agency Tracking Layer', value: '$732M', date: '2026-01-10', agency: 'SDA' },
        { title: 'Nuclear C3 Modernization', value: '$1.4B', date: '2025-10-15', agency: 'USSTRATCOM' },
      ],
      financials: { revenue: '$40.8B', ebitda: '$6.1B', backlog: '$87.6B', pe: 18.4, divYield: '1.52%' },
      riskFactors: ['B-21 cost growth risk', 'Classified program execution', 'Workforce shortages in cleared personnel', 'ITAR compliance complexity'],
      relatedTickers: ['LMT', 'RTX', 'GD', 'BA', 'LDOS'],
      signals: [],
    },
    GD: {
      ticker: 'GD', name: 'General Dynamics', price: 302.44, change: 1.87, changePct: 0.62, sector: 'Aerospace & Defence',
      description: 'Diversified defence with strength in combat vehicles (Abrams, Stryker), submarines (Columbia-class), IT services (GDIT), and Gulfstream business jets. Columbia-class SSBN is the nation\'s top acquisition priority.',
      keyPrograms: ['Columbia-class SSBN', 'Virginia-class SSN', 'Abrams M1A2 SEPv4', 'Stryker ICVVA', 'GDIT Cloud Services', 'Gulfstream G700/G800'],
      recentContracts: [
        { title: 'Columbia-class SSBN Block II', value: '$9.4B', date: '2026-03-01', agency: 'US Navy' },
        { title: 'Abrams SEPv4 LRIP', value: '$1.8B', date: '2026-01-20', agency: 'US Army' },
        { title: 'GDIT — DoD Cloud Migration', value: '$620M', date: '2025-12-05', agency: 'DISA' },
      ],
      financials: { revenue: '$44.4B', ebitda: '$5.9B', backlog: '$95.3B', pe: 19.8, divYield: '2.08%' },
      riskFactors: ['Submarine construction delays', 'Labor shortages at shipyards', 'Gulfstream demand cyclicality', 'Fixed-price contract margin pressure'],
      relatedTickers: ['LMT', 'NOC', 'HII', 'RTX', 'LDOS'],
      signals: [],
    },
  };
  return contractors[ticker] || null;
}

// ── CRYPTO ──
export function getMockCrypto(): CryptoQuote[] {
  return [
    { symbol: 'BTC', name: 'Bitcoin', price: 107842.50, change24h: 2.34, volume24h: 48200000000, marketCap: 2130000000000 },
    { symbol: 'ETH', name: 'Ethereum', price: 3842.18, change24h: 1.87, volume24h: 18900000000, marketCap: 462000000000 },
    { symbol: 'SOL', name: 'Solana', price: 198.44, change24h: 4.12, volume24h: 4200000000, marketCap: 92000000000 },
    { symbol: 'XRP', name: 'Ripple', price: 2.48, change24h: -0.82, volume24h: 3100000000, marketCap: 142000000000 },
    { symbol: 'ADA', name: 'Cardano', price: 0.89, change24h: 1.23, volume24h: 890000000, marketCap: 31500000000 },
    { symbol: 'LINK', name: 'Chainlink', price: 22.14, change24h: 3.45, volume24h: 1200000000, marketCap: 14200000000 },
  ];
}

// ── FUTURES ──
export function getMockFutures(): FuturesQuote[] {
  return [
    { symbol: '/ES', name: 'S&P 500 Futures', price: 5842.25, change: 47.50, changePct: 0.82 },
    { symbol: '/NQ', name: 'Nasdaq 100 Futures', price: 20748.75, change: 228.50, changePct: 1.11 },
    { symbol: '/YM', name: 'Dow Jones Futures', price: 43128.00, change: 186.00, changePct: 0.43 },
    { symbol: '/RTY', name: 'Russell 2000 Futures', price: 2089.40, change: 18.20, changePct: 0.88 },
    { symbol: '/CL', name: 'Crude Oil (WTI)', price: 78.42, change: -0.68, changePct: -0.86 },
    { symbol: '/GC', name: 'Gold Futures', price: 3088.40, change: 12.80, changePct: 0.42 },
    { symbol: '/SI', name: 'Silver Futures', price: 34.82, change: 0.44, changePct: 1.28 },
    { symbol: '/BTC', name: 'Bitcoin Futures (CME)', price: 107920.00, change: 2480.00, changePct: 2.35 },
  ];
}

// ── FED UPDATES ──
export function getMockFedUpdates(): FedUpdate[] {
  return [
    { id: 'f1', title: 'FOMC Holds Rates at 4.25-4.50% — Unanimous Decision', type: 'RATE_DECISION', summary: 'Federal Reserve maintains target range. Statement notes "solid" labor market and "somewhat elevated" inflation. No rate cuts signaled for near-term.', sentiment: 'HAWKISH', date: '2026-03-19' },
    { id: 'f2', title: 'Powell Press Conference: "Patient Approach Remains Appropriate"', type: 'SPEECH', summary: 'Chair Powell emphasizes data-dependency. Pushes back on market expectations for June cut. Dot plot median unchanged at 2 cuts for 2026.', sentiment: 'HAWKISH', date: '2026-03-19' },
    { id: 'f3', title: 'Fed Governor Waller: Data Supports Holding Through Q3', type: 'SPEECH', summary: 'In prepared remarks at Brookings, Waller signals no rate cuts before September at earliest. Core PCE remains sticky at 2.7%.', sentiment: 'HAWKISH', date: '2026-03-17' },
    { id: 'f4', title: 'CPI February: 2.8% YoY — Above Consensus', type: 'CPI', summary: 'Headline CPI comes in at 2.8% vs 2.7% expected. Core CPI 3.1% vs 3.0%. Shelter inflation persistent. Markets sell off.', sentiment: 'HAWKISH', date: '2026-03-12' },
    { id: 'f5', title: 'Non-Farm Payrolls: +287K — Blowout Number', type: 'JOBS', summary: 'February NFP far exceeds 180K estimate. Unemployment 3.7%. Wage growth 4.1% YoY. Fed cut probability drops to 15% for June.', sentiment: 'HAWKISH', date: '2026-03-07' },
    { id: 'f6', title: 'PCE Deflator January: 2.6% — Slight Improvement', type: 'CPI', summary: 'Core PCE edges down from 2.7% to 2.6%. Fed\'s preferred inflation gauge shows gradual progress. Markets cautiously optimistic.', sentiment: 'NEUTRAL', date: '2026-02-28' },
    { id: 'f7', title: 'Fed Minutes: "Several Participants" See Upside Inflation Risk', type: 'MINUTES', summary: 'January meeting minutes reveal growing concern about disinflation stalling. QT taper discussion ongoing. Balance sheet at $7.4T.', sentiment: 'HAWKISH', date: '2026-02-19' },
  ];
}

// ── GEOPOLITICAL RISK ──
export function getMockGeoRisk(): GeoRiskEvent[] {
  return [
    { id: 'g1', title: 'Taiwan Strait: PLA Navy Conducts Largest Exercise Since 2024', region: 'Indo-Pacific', severity: 9, category: 'CONFLICT', summary: 'Satellite imagery confirms 47-vessel PLA Navy exercise in Taiwan Strait with live-fire components. Japan raises alert level. US 7th Fleet repositions.', impactTickers: ['LMT', 'RTX', 'NOC', 'GD', 'BA'], timestamp: '2026-03-20' },
    { id: 'g2', title: 'EU Expands Russia Sanctions — 14th Package Targets Defence Supply Chains', region: 'Europe', severity: 7, category: 'SANCTIONS', summary: 'New EU sanctions package targets Russian microelectronics procurement networks. Secondary sanctions on third-country intermediaries.', impactTickers: ['RTX', 'CRWD', 'PLTR'], timestamp: '2026-03-18' },
    { id: 'g3', title: 'Middle East: Houthi Anti-Ship Missile Hits Commercial Vessel', region: 'Middle East', severity: 8, category: 'CONFLICT', summary: 'Greek-flagged tanker struck in Red Sea. USN Destroyer USS Laboon intercepts 2 additional missiles. Oil futures spike 2.1%.', impactTickers: ['RTX', 'LMT', 'NOC'], timestamp: '2026-03-16' },
    { id: 'g4', title: 'DPRK Tests Hypersonic Glide Vehicle — 8th Launch This Year', region: 'Korean Peninsula', severity: 7, category: 'NUCLEAR', summary: 'North Korea launches HGV variant from mobile TEL. Trajectory indicates Mach 10+ terminal speed. Japan activates J-Alert.', impactTickers: ['LMT', 'RTX', 'NOC'], timestamp: '2026-03-14' },
    { id: 'g5', title: 'US-China Chip Export Controls Tightened — ASML Restrictions Expanded', region: 'Global', severity: 6, category: 'TRADE', summary: 'Commerce Dept expands entity list. ASML barred from servicing DUV systems in China. Beijing retaliates with rare earth export controls.', impactTickers: ['NVDA', 'AXON', 'IONQ'], timestamp: '2026-03-11' },
    { id: 'g6', title: 'NATO Baltic Shield: Largest Cyber Exercise Tests Grid Defense', region: 'Europe', severity: 5, category: 'CYBER', summary: 'NATO conducts "Locked Shields 2026" with 38 nations. Focus on energy grid and financial system resilience. CRWD provides red team support.', impactTickers: ['CRWD', 'PLTR'], timestamp: '2026-03-08' },
  ];
}

// ── AD SLOT CONFIG ──
export interface AdSlot {
  id: string;
  placement: string;
  size: string;
  page: string;
}

export function getAdSlots(): AdSlot[] {
  return [
    { id: 'ad-banner-top', placement: 'Banner — Top of Page', size: '728x90', page: 'all' },
    { id: 'ad-sidebar-1', placement: 'Sidebar — Right Rail', size: '300x250', page: 'signal' },
    { id: 'ad-feed-inline', placement: 'In-Feed — Between Signal Items', size: '300x250', page: 'signal' },
    { id: 'ad-contractor-bottom', placement: 'Contractor Brief — Bottom', size: '728x90', page: 'contractor' },
    { id: 'ad-crypto-sidebar', placement: 'Crypto Section — Sidebar', size: '300x600', page: 'crypto' },
    { id: 'ad-footer', placement: 'Footer — Leaderboard', size: '970x90', page: 'all' },
  ];
}
