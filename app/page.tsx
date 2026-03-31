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
import dynamic from 'next/dynamic'

const GlobalOperationsGlobe = dynamic(() => import('./components/GlobalOperationsGlobe'), { ssr: false })
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
            { icon: '🛡️', title: 'SIGNAL', desc: 'Real-time defence & deep-tech news wire. AI-curated. Zero noise. Pure signal.', href: '#signal' },
            { icon: '💡', title: 'BRIDGEPATH', desc: 'Public proxy maps for private defence & AI companies. How to invest before IPO.', href: '#bridgepath' },
            { icon: '📊', title: 'FORGE', desc: 'Browser-based indicator builder. Visual + code. AI-assisted Pine Script generation.', href: '#forge' },
            { icon: '📋', title: 'REPORTS', desc: 'Weekly ypstrategicresearch.com briefings. Deep-dive sector reports. Earnings analysis.', href: '#reports' },
            { icon: '🌐', title: 'NEXUS', desc: 'Interactive defence-tech ecosystem map. Contract awards. Funding → market flows.', href: '#nexus' },
            { icon: '🔐', title: 'INTEL VAULT', desc: 'Free → Pro ($29) → Institutional ($199). API access. Custom research.', href: '#pricing' },
          ].map((p) => (
            <a key={p.title} href={p.href} className="glass p-5 transition-all cursor-pointer hover:border-[var(--border-bright)] hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(0,255,80,0.08)]">
              <span className="text-[22px] block mb-2.5">{p.icon}</span>
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
      <div id="forge" className="w-full h-screen relative z-10 bg-[#000814]">
        <GlobalOperationsGlobe />
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
          <div>Feed: 847 signals / 24h</div>
          <div>Latency: 12ms</div>
          <div>Sources: SEC · DARPA · USASpending · NRC · FRED · CME · CoinMarketCap</div>
          <div className="text-[var(--accent)]">v2.0.0</div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div className="relative z-10 text-center py-8 px-5 font-mono text-[9px] tracking-widest text-[var(--text-dim)] uppercase">
        <div className="mb-1.5">Coordinates: 42.3601° N, 71.0589° W (Boston) · Connection: AES-256</div>
        <div>© 2026 Y.P Strategic Research · S-Corp · All Rights Reserved</div>
      </div>
    </>
  );
}
