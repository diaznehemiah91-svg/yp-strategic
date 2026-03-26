import { fetchStocks, fetchSignals, fetchCrypto, fetchFutures, fetchFedUpdates, fetchGeoRisk } from './lib/fetchers';
import { getAdSlots } from './lib/mock-data';
import ThreeBackground from './components/ThreeBackground';
import TickerStrip from './components/TickerStrip';
import SignalFeed from './components/SignalFeed';
import BridgePath from './components/BridgePath';
import CryptoPanel from './components/CryptoPanel';
import FuturesPanel from './components/FuturesPanel';
import MacroPanel from './components/MacroPanel';
import GeoRiskPanel from './components/GeoRiskPanel';
import ContractorGrid from './components/ContractorGrid';
import GlobalIntelligenceDashboard from './components/GlobalIntelligenceDashboard';
import NexusSection from './components/NexusSection';
import PricingSection from './components/PricingSection';
import AdSlot from './components/AdSlot';
import NavBar from './components/NavBar';
import SectorHeatmap from './components/SectorHeatmap';
import CorrelationMatrix from './components/CorrelationMatrix';
import SectorMomentum from './components/SectorMomentum';
import NewsGlobe from './components/NewsGlobe';

export const revalidate = 60;

export default async function Home() {
  const [stocks, signals, crypto, futures, fedUpdates, geoRisk] = await Promise.all([
    fetchStocks(),
    fetchSignals(),
    fetchCrypto(),
    fetchFutures(),
    fetchFedUpdates(),
    fetchGeoRisk(),
  ]);

  return (
    <>
      <ThreeBackground />

      <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">

        {/* ── NAV ── */}
        <NavBar />

        {/* ── AD: TOP BANNER ── */}
        <AdSlot id="ad-banner-top" size="728x90" className="mx-auto mb-4 h-[90px] max-w-[728px]" />

        {/* ── HERO ── */}
        <div className="text-center py-12 fade-up d2">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] border border-[rgba(0,255,80,0.2)] px-3.5 py-1.5 rounded-full bg-[rgba(0,255,80,0.04)] mb-5">
            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
            Defence-Tech Intelligence Platform
          </div>
          <h1 className="text-[clamp(28px,5vw,52px)] font-black leading-[1.1] mb-3.5 text-white tracking-tight">
            Where Capital Flows,<br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] bg-clip-text text-transparent">
              Before The Market Knows
            </span>
          </h1>
          <p className="text-sm text-[var(--text-dim)] max-w-[540px] mx-auto mb-7 leading-relaxed">
            Real-time defence & deep-tech intelligence. AI-curated signal. Public proxy mapping for private companies. Crypto, futures, and macro intelligence. Built for the next decade of capital allocation.
          </p>
          <div className="flex gap-2.5 justify-center flex-wrap">
            <a href="#signal" className="bg-[var(--accent)] text-[var(--bg)] font-bold px-7 py-3 rounded-md text-sm cursor-pointer shadow-[0_0_30px_rgba(0,255,80,0.15)] hover:-translate-y-0.5 transition-transform">
              Initialize Feed →
            </a>
            <a href="#reports" className="bg-transparent text-[var(--text)] px-7 py-3 rounded-md border border-[var(--border)] text-sm cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
              View Strategic Research Report
            </a>
          </div>
        </div>

        {/* ── TICKER STRIP ── */}
        <TickerStrip stocks={stocks} crypto={crypto} futures={futures} />

        {/* ── SIX PILLARS ── */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d3">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ The Six Pillars
        </div>
        <div className="grid grid-cols-3 gap-3 mb-8 pillars-grid fade-up d4">
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              ),
              title: 'SIGNAL', desc: 'Real-time defence & deep-tech news wire. AI-curated. Zero noise. Pure signal.', href: '#signal',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
                </svg>
              ),
              title: 'BRIDGEPATH', desc: 'Public proxy maps for private defence & AI companies. How to invest before IPO.', href: '#bridgepath',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              ),
              title: 'FORGE', desc: 'Browser-based indicator builder. Visual + code. AI-assisted Pine Script generation.', href: '#forge',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
                </svg>
              ),
              title: 'REPORTS', desc: 'Weekly strategic briefings. Deep-dive sector reports. Earnings analysis.', href: '#reports',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              ),
              title: 'NEXUS', desc: 'Interactive defence-tech ecosystem map. Contract awards. Funding → market flows.', href: '#nexus',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              ),
              title: 'INTEL VAULT', desc: 'Free → Pro ($29) → Institutional. API access. Custom research. Priority alerts.', href: '#pricing',
            },
          ].map((p) => (
            <a key={p.title} href={p.href} className="glass p-5 transition-all cursor-pointer hover:border-[var(--border-bright)] hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(0,255,80,0.08)] group">
              <span className="block mb-2.5 text-[var(--accent)] opacity-70 group-hover:opacity-100 transition-opacity">{p.icon}</span>
              <h3 className="text-[13px] font-bold mb-1 text-[var(--text-bright)] tracking-wide">{p.title}</h3>
              <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>

        {/* ── DEFENCE CONTRACTORS ── */}
        <div id="contractors" className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d3">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Defence Contractors
        </div>
        <ContractorGrid stocks={stocks} />

        {/* ── SECTOR HEATMAP ── */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d3">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Heatmap: Performance Matrix
        </div>
        <SectorHeatmap stocks={stocks} />

        {/* ── GLOBAL SEARCH TIP ── */}
        <div className="glass p-6 mb-7 fade-up d4 border border-[var(--border)]">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ Quick Search
          </div>
          <p className="font-mono text-[13px] text-[var(--text-bright)] mb-2">
            Press <span className="font-bold text-[var(--accent)]">⌘K</span> (Mac) or <span className="font-bold text-[var(--accent)]">Ctrl+K</span> (Windows) to search across 50+ tickers
          </p>
          <p className="font-mono text-[11px] text-[var(--text-dim)]">
            Start typing a ticker symbol or company name to discover stocks, signals, and market data instantly.
          </p>
        </div>

        {/* ── SIGNAL + BRIDGEPATH ── */}
        <div id="signal" className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d5">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Signal Feed + BridgePath
        </div>
        <div className="glass grid grid-cols-[1fr_340px] gap-0 mb-7 split-grid fade-up d5">
          <SignalFeed signals={signals} />
          <BridgePath />
        </div>

        {/* ── AD: INLINE ── */}
        <AdSlot id="ad-feed-inline" size="728x90" className="mx-auto mb-7 h-[90px] max-w-[728px]" />

        {/* ── CRYPTO + FUTURES ── */}
        <div id="crypto" className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d4">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Crypto & Futures
        </div>
        <div className="grid grid-cols-2 gap-4 mb-7 fade-up d4" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <CryptoPanel crypto={crypto} />
          <FuturesPanel futures={futures} />
        </div>

        {/* ── SECTOR MOMENTUM ── */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d5">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Sector Rotation
        </div>
        <SectorMomentum />

        {/* ── MACRO: FED + GEO RISK ── */}
        <div id="macro" className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d5">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Macro Intelligence
        </div>
        <div className="grid grid-cols-2 gap-4 mb-7 fade-up d5" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <MacroPanel fedUpdates={fedUpdates} />
          <GeoRiskPanel events={geoRisk} />
        </div>

        {/* ── GLOBAL NEWS INTELLIGENCE ── */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d6">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Global News Intelligence
        </div>
        <div className="mb-7 fade-up d6">
          <NewsGlobe />
        </div>

        {/* ── CORRELATION MATRIX ── */}
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d6">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Stock Correlations
        </div>
        <CorrelationMatrix />

        {/* ── AD: SIDEBAR ── */}
        <AdSlot id="ad-sidebar-1" size="300x250" className="ml-auto mb-7 h-[250px] w-[300px]" />
      </div>

      {/* ── GLOBAL INTELLIGENCE COMMAND CENTER ── */}
      <div id="forge" className="w-full h-screen relative z-10">
        <GlobalIntelligenceDashboard />
      </div>

      {/* ── NEXUS + PRICING + FOOTER ── */}
      <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">
        {/* ── NEXUS ── */}
        <div id="nexus">
          <NexusSection />
        </div>

        {/* ── PRICING ── */}
        <div id="pricing">
          <PricingSection />
        </div>

        {/* ── AD: FOOTER ── */}
        <AdSlot id="ad-footer" size="970x90" className="mx-auto mb-7 h-[90px] max-w-[970px]" />

        {/* ── STATUS BAR ── */}
        <div className="glass flex justify-between flex-wrap gap-2.5 px-5 py-2.5 font-mono text-[9px] text-[var(--text-dim)] tracking-wider uppercase border-t border-[var(--border)] fade-up d6">
          <div className="text-[var(--accent)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
            Systems Operational
          </div>
          <div>Signals Processed: 847 / 24h</div>
          <div>Last Refresh: &lt; 2 min ago</div>
          <div>Sources: SEC · DARPA · USASpending · NRC · FRED · CME · CoinMarketCap</div>
          <div className="text-[var(--accent)]">v2.0.0</div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 text-center py-8 px-5 font-mono text-[9px] tracking-widest text-[var(--text-dim)] uppercase">
        <div className="mb-1.5">Boston, MA · Independent Research Firm · Data sourced from public records</div>
        <div>© 2026 Y.P. Strategic Research · All Rights Reserved</div>
      </div>
    </>
  );
}
