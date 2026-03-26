import NavBar from '../../components/NavBar';
import Link from 'next/link';

export const metadata = {
  title: 'Methodology | Y.P. Strategic Research',
  description: 'How Y.P. Strategic Research sources, processes, and delivers defence-tech intelligence.',
};

const sources = [
  {
    name: 'SEC EDGAR',
    category: 'Financial Filings',
    desc: '10-K, 10-Q, 8-K filings and proxy statements from publicly traded defence and deep-tech companies. Real-time monitoring of material disclosures.',
  },
  {
    name: 'DARPA & DoD Contracts',
    category: 'Government Awards',
    desc: 'Contract award announcements, SBIR/STTR grants, and procurement notices from the Defense Advanced Research Projects Agency and Department of Defense.',
  },
  {
    name: 'USASpending.gov',
    category: 'Federal Contracts',
    desc: 'Comprehensive federal spending data covering contract awards, modifications, and subcontract relationships across the defence industrial base.',
  },
  {
    name: 'NRC Filings',
    category: 'Nuclear Regulatory',
    desc: 'Nuclear Regulatory Commission license applications, inspection reports, and event notifications covering the emerging advanced nuclear sector.',
  },
  {
    name: 'FRED — Federal Reserve',
    category: 'Macroeconomic Data',
    desc: 'Federal Reserve Economic Data: interest rate decisions, inflation metrics, employment data, and monetary policy communications from the St. Louis Fed.',
  },
  {
    name: 'CME Group',
    category: 'Futures & Derivatives',
    desc: 'Real-time and delayed futures prices for equity index, energy, metals, and fixed income contracts. Includes open interest and volume data.',
  },
  {
    name: 'CoinMarketCap',
    category: 'Digital Assets',
    desc: 'Cryptocurrency market data including spot prices, market capitalizations, volume, and on-chain metrics for major digital assets.',
  },
];

const pipeline = [
  {
    step: '01',
    title: 'Ingestion',
    desc: 'Raw data is continuously pulled from 50+ public sources via API, RSS, and web scraping. Sources include government databases, regulatory filings, news wires, and market data feeds.',
  },
  {
    step: '02',
    title: 'Classification',
    desc: 'Each item is classified by sector (Defence, AI, Nuclear, Cyber, Quantum, Macro, Geopolitical, Crypto) and assigned a severity score (INFO, ALERT, CRITICAL) using a fine-tuned language model.',
  },
  {
    step: '03',
    title: 'Entity Extraction',
    desc: 'Named entity recognition identifies companies, government agencies, individuals, and financial instruments mentioned in each item. Ticker symbols are resolved automatically.',
  },
  {
    step: '04',
    title: 'Relevance Scoring',
    desc: 'A proprietary relevance model scores each signal against the defence-tech investment thesis. Items below the relevance threshold are filtered out — not just summarized.',
  },
  {
    step: '05',
    title: 'Delivery',
    desc: 'Curated signals are published to the Signal Feed in real-time (Pro) or with a 15-minute delay (Free). High-severity alerts trigger push notifications for subscribed users.',
  },
];

const bridgepathMethod = [
  {
    factor: 'Supply Chain Overlap',
    desc: 'We map which public companies supply components, software, or services to the private company based on public contract disclosures and FOIA responses.',
  },
  {
    factor: 'Sector Exposure',
    desc: 'Public companies with >20% revenue exposure to the same end-market (e.g. autonomous systems, AI-enabled surveillance) are flagged as correlated proxies.',
  },
  {
    factor: 'IP Ownership & Licensing',
    desc: 'Patent assignments, DARPA IP rights clauses, and licensing agreements create traceable technology transfer pathways between private and public entities.',
  },
  {
    factor: 'Personnel Networks',
    desc: 'Leadership team backgrounds and board overlaps between private and public companies can signal preferential vendor relationships and future M&A targets.',
  },
];

export default function MethodologyPage() {
  return (
    <>
      <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">
        <NavBar />

        {/* Page Header */}
        <div className="py-14 fade-up d2">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] border border-[rgba(0,255,80,0.2)] px-3.5 py-1.5 rounded-full bg-[rgba(0,255,80,0.04)] mb-5">
            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
            Transparency
          </div>
          <h1 className="text-[clamp(26px,4vw,44px)] font-black leading-[1.15] mb-4 text-white tracking-tight">
            Our Methodology
          </h1>
          <p className="text-sm text-[var(--text-dim)] max-w-[600px] leading-relaxed">
            Y.P. Strategic Research is an independent intelligence firm. This page explains how we source, process, and
            deliver defence-tech intelligence — so you can evaluate the quality of the signal before you act on it.
          </p>
        </div>

        {/* About Section */}
        <section className="glass p-8 mb-10 fade-up d3">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ About
          </div>
          <div className="grid grid-cols-2 gap-10" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <p className="text-sm text-[var(--text)] leading-relaxed mb-4">
                Y.P. Strategic Research monitors the intersection of defence technology, deep-tech investment, and
                geopolitical risk. Our platform aggregates publicly available data from government databases, regulatory
                filings, and market feeds, then applies AI-assisted curation to surface the signals that matter.
              </p>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                We do not trade on the information we publish, nor do we accept payment from companies we cover. All
                analysis is derived exclusively from public-record sources.
              </p>
            </div>
            <div className="space-y-3">
              {[
                ['Coverage Universe', '300+ companies across defence, AI, nuclear, and cyber'],
                ['Data Sources', '50+ real-time and near-real-time feeds'],
                ['Signal Cadence', '800–1,000 classified signals per 24 hours'],
                ['Refresh Frequency', 'Pro: real-time · Free: 15-minute delay'],
                ['Independence', 'No sponsored content. No advertiser relationships.'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <span className="font-mono text-[10px] tracking-wider uppercase text-[var(--accent)] shrink-0 w-[150px] pt-0.5">{label}</span>
                  <span className="text-xs text-[var(--text-dim)] leading-relaxed">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-10 fade-up d3">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ Primary Data Sources
          </div>
          <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: '1fr 1fr' }}>
            {sources.map((s) => (
              <div key={s.name} className="glass p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[13px] font-bold text-[var(--text-bright)]">{s.name}</span>
                  <span className="font-mono text-[8px] tracking-[1.5px] uppercase text-[var(--accent)] bg-[rgba(0,255,80,0.06)] border border-[rgba(0,255,80,0.12)] px-1.5 py-0.5 rounded shrink-0 ml-2">
                    {s.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-dim)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AI Curation Pipeline */}
        <section className="mb-10 fade-up d4">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ AI Curation Pipeline
          </div>
          <div className="glass p-6">
            <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-8 max-w-[660px]">
              Raw data volume across our source network exceeds 10,000 items per day. The following pipeline reduces
              that to the 800–1,000 high-relevance signals published on the platform each 24 hours.
            </p>
            <div className="relative">
              {/* Connector line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-px bg-[var(--border)]" />
              <div className="space-y-6">
                {pipeline.map((step) => (
                  <div key={step.step} className="flex gap-5 relative">
                    <div className="w-[54px] h-[54px] rounded-full border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold text-[var(--accent)] z-10">
                      {step.step}
                    </div>
                    <div className="pt-2.5">
                      <div className="font-mono text-[12px] font-bold text-[var(--text-bright)] mb-1 tracking-wide">{step.title}</div>
                      <p className="text-xs text-[var(--text-dim)] leading-relaxed max-w-[600px]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* BridgePath Methodology */}
        <section className="mb-10 fade-up d4">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ BridgePath Methodology
          </div>
          <div className="glass p-6">
            <p className="text-sm text-[var(--text-dim)] leading-relaxed mb-6 max-w-[660px]">
              BridgePath maps private defence and deep-tech companies to publicly traded proxy stocks. This allows
              investors to gain economic exposure before an IPO or direct investment opportunity. Proxy relationships
              are determined using four primary factors:
            </p>
            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {bridgepathMethod.map((item) => (
                <div key={item.factor} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded p-4 hover:border-[var(--border-bright)] transition-colors">
                  <div className="font-mono text-[11px] font-bold text-[var(--text-bright)] mb-2">{item.factor}</div>
                  <p className="text-xs text-[var(--text-dim)] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-dim)] leading-relaxed mt-5 pt-5 border-t border-[var(--border)]">
              BridgePath mappings are reviewed quarterly and updated when new contract disclosures, funding rounds, or
              strategic partnerships alter the relationship. Proxy mappings are not investment recommendations.
            </p>
          </div>
        </section>

        {/* Data Freshness & Disclaimer */}
        <section className="glass p-6 mb-10 fade-up d5">
          <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-5 flex items-center gap-2">
            <span className="w-6 h-px bg-[var(--accent)]" />◆ Data Freshness & Disclaimer
          </div>
          <div className="grid grid-cols-2 gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div>
              <div className="font-mono text-[11px] font-bold text-[var(--text-bright)] mb-3 uppercase tracking-wide">Refresh Cadence</div>
              <div className="space-y-2 text-xs text-[var(--text-dim)]">
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span>Signal Feed (Pro)</span><span className="text-[var(--accent)]">Real-time</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span>Signal Feed (Free)</span><span>15-minute delay</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span>Stock prices</span><span>15-minute delay (market hours)</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span>Futures & Crypto</span><span>Near real-time</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Macro / FRED data</span><span>Updated at source release</span>
                </div>
              </div>
            </div>
            <div>
              <div className="font-mono text-[11px] font-bold text-[var(--text-bright)] mb-3 uppercase tracking-wide">Important Disclaimer</div>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed mb-3">
                Y.P. Strategic Research provides intelligence and analysis for informational purposes only. Nothing
                published on this platform constitutes financial, investment, legal, or regulatory advice.
              </p>
              <p className="text-xs text-[var(--text-dim)] leading-relaxed">
                Past performance of referenced securities is not indicative of future results. All investment decisions
                involve risk. You should consult a qualified financial professional before making any investment.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center py-10 fade-up d5">
          <p className="text-sm text-[var(--text-dim)] mb-5">Ready to put the methodology to work?</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/#signal" className="bg-[var(--accent)] text-[var(--bg)] font-bold px-7 py-3 rounded-md text-sm cursor-pointer shadow-[0_0_30px_rgba(0,255,80,0.15)] hover:-translate-y-0.5 transition-transform">
              View Signal Feed →
            </Link>
            <Link href="/#pricing" className="bg-transparent text-[var(--text)] px-7 py-3 rounded-md border border-[var(--border)] text-sm cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
              Explore Membership
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center py-8 px-5 font-mono text-[9px] tracking-widest text-[var(--text-dim)] uppercase">
        <div className="mb-1.5">Boston, MA · Independent Research Firm · Data sourced from public records</div>
        <div>© 2026 Y.P. Strategic Research · All Rights Reserved</div>
      </div>
    </>
  );
}
