import { fetchContractor, fetchSignals, fetchFedUpdates, fetchGeoRisk, fetchStocks } from '@/app/lib/fetchers';
import ThreeBackground from '@/app/components/ThreeBackground';
import NavBar from '@/app/components/NavBar';
import AdSlot from '@/app/components/AdSlot';
import Link from 'next/link';
import StockDetailClient from '@/app/components/StockDetailClient';

export const revalidate = 60;

export default async function ContractorPage({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase();
  const [contractor, allSignals, fedUpdates, geoRisk, allStocks] = await Promise.all([
    fetchContractor(ticker),
    fetchSignals(),
    fetchFedUpdates(),
    fetchGeoRisk(),
    fetchStocks(),
  ]);

  // Try to find the stock in all stocks
  const stock = allStocks.find(s => s.ticker === ticker);

  // Filter signals relevant to this ticker
  const relatedSignals = allSignals.filter(s => s.tickers.includes(ticker));
  const relatedGeo = geoRisk.filter(g => g.impactTickers.includes(ticker));

  // If no contractor profile but stock exists, show basic stock intelligence
  if (!contractor && stock) {
    return (
      <>
        <ThreeBackground />
        <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">
          <NavBar />
          <StockDetailClient stock={stock} signals={relatedSignals} geoRisk={relatedGeo} />
        </div>
      </>
    );
  }

  // If neither contractor nor stock exists, show error
  if (!contractor && !stock) {
    return (
      <>
        <ThreeBackground />
        <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">
          <NavBar />
          <div className="glass p-12 text-center">
            <h1 className="text-2xl font-bold text-[var(--text-bright)] mb-4">Stock Not Found</h1>
            <p className="text-[var(--text-dim)] mb-6">No data available for ticker: {ticker}</p>
            <Link href="/" className="text-[var(--accent)] font-mono text-sm no-underline hover:underline">← Return to Dashboard</Link>
          </div>
        </div>
      </>
    );
  }

  // TypeScript knows contractor is not null at this point due to the early returns above
  if (!contractor) return null;

  return (
    <>
      <ThreeBackground />
      <div className="relative z-10 max-w-[1260px] mx-auto px-5 pt-6 pb-20">
        <NavBar />

        {/* Breadcrumb */}
        <div className="font-mono text-[10px] text-[var(--text-dim)] tracking-wider mb-4 fade-up d1">
          <Link href="/" className="text-[var(--accent)] no-underline hover:underline">DASHBOARD</Link>
          <span className="mx-2">›</span>
          <Link href="/#contractors" className="text-[var(--accent)] no-underline hover:underline">CONTRACTORS</Link>
          <span className="mx-2">›</span>
          <span className="text-[var(--text-bright)]">{ticker}</span>
        </div>

        {/* ── HEADER ── */}
        <div className="glass p-6 mb-6 fade-up d2">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-2xl font-bold text-[var(--accent)]">{contractor.ticker}</span>
                <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-[rgba(0,255,80,0.06)] text-[var(--accent)] border border-[rgba(0,255,80,0.1)]">
                  {contractor.sector}
                </span>
              </div>
              <h1 className="text-xl font-bold text-[var(--text-bright)] mb-1">{contractor.name}</h1>
              <p className="text-sm text-[var(--text-dim)] max-w-[600px] leading-relaxed">{contractor.description}</p>
            </div>
            <div className="text-right">
              <div className="font-mono text-3xl font-bold text-[var(--text-bright)]">${contractor.price.toFixed(2)}</div>
              <div className={`font-mono text-sm ${contractor.changePct >= 0 ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
                {contractor.changePct >= 0 ? '▲' : '▼'} ${Math.abs(contractor.change).toFixed(2)} ({contractor.changePct >= 0 ? '+' : ''}{contractor.changePct.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        {/* ── TWO COLUMN LAYOUT ── */}
        <div className="grid gap-6 mb-6 fade-up d3" style={{ gridTemplateColumns: '1fr 380px' }}>

          {/* LEFT COLUMN */}
          <div className="space-y-6">

            {/* KEY PROGRAMS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4">◆ KEY PROGRAMS</h3>
              <div className="flex flex-wrap gap-2">
                {contractor.keyPrograms.map(p => (
                  <span key={p} className="font-mono text-[10px] px-3 py-1.5 rounded bg-[rgba(0,255,80,0.06)] text-[var(--accent)] border border-[rgba(0,255,80,0.1)]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* RECENT CONTRACTS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px] mb-4">◆ RECENT CONTRACTS</h3>
              <div className="space-y-3">
                {contractor.recentContracts.map((c, i) => (
                  <div key={i} className="flex items-start justify-between py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                    <div>
                      <h4 className="text-xs text-[var(--text-bright)] font-semibold mb-1">{c.title}</h4>
                      <div className="font-mono text-[10px] text-[var(--text-dim)]">{c.agency} · {c.date}</div>
                    </div>
                    <span className="font-mono text-sm font-bold text-[var(--accent)] shrink-0">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED SIGNALS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--gold)] tracking-[2px] mb-4">◆ RELATED SIGNALS ({relatedSignals.length})</h3>
              {relatedSignals.length > 0 ? (
                <div className="space-y-2">
                  {relatedSignals.map(s => (
                    <div key={s.id} className="py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                      <h4 className="text-[11px] text-[var(--text-bright)] font-semibold mb-1">{s.title}</h4>
                      <p className="text-[10px] text-[var(--text-dim)]">{s.summary}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-[var(--text-dim)]">No recent signals for this contractor.</p>
              )}
            </div>

            {/* GEOPOLITICAL HEADWINDS */}
            {relatedGeo.length > 0 && (
              <div className="glass p-5">
                <h3 className="font-mono text-xs text-[#ff6432] tracking-[2px] mb-4">◆ GEOPOLITICAL HEADWINDS ({relatedGeo.length})</h3>
                <div className="space-y-2">
                  {relatedGeo.map(g => (
                    <div key={g.id} className="py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[11px] text-[var(--text-bright)] font-semibold">{g.title}</h4>
                        <span className={`font-mono text-[10px] font-bold ${g.severity >= 8 ? 'text-[var(--accent3)]' : 'text-[var(--gold)]'}`}>
                          SEV {g.severity}
                        </span>
                      </div>
                      <p className="text-[10px] text-[var(--text-dim)]">{g.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* FINANCIALS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px] mb-4">◆ FINANCIALS</h3>
              <div className="space-y-3">
                {Object.entries(contractor.financials).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-1 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                    <span className="font-mono text-[10px] text-[var(--text-dim)] uppercase tracking-wider">
                      {key === 'pe' ? 'P/E Ratio' : key === 'divYield' ? 'Div Yield' : key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                    <span className="font-mono text-xs text-[var(--text-bright)] font-semibold">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RISK FACTORS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent3)] tracking-[2px] mb-4">◆ RISK FACTORS</h3>
              <div className="space-y-2">
                {contractor.riskFactors.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 py-1.5">
                    <span className="text-[var(--accent3)] text-xs mt-0.5">⚠</span>
                    <span className="text-[11px] text-[var(--text-dim)] leading-snug">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RELATED TICKERS */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4">◆ RELATED</h3>
              <div className="flex flex-wrap gap-2">
                {contractor.relatedTickers.map(t => (
                  <Link key={t} href={`/contractor/${t}`} className="font-mono text-[10px] px-3 py-1.5 rounded bg-[rgba(0,255,80,0.06)] text-[var(--accent)] border border-[rgba(0,255,80,0.1)] no-underline hover:bg-[rgba(0,255,80,0.12)] transition-colors">
                    {t}
                  </Link>
                ))}
              </div>
            </div>

            {/* MACRO CONTEXT */}
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px] mb-4">◆ MACRO CONTEXT</h3>
              {fedUpdates.slice(0, 3).map(f => (
                <div key={f.id} className="py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                  <h4 className="text-[11px] text-[var(--text-bright)] font-semibold mb-1 truncate">{f.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] badge-fed px-1.5 py-0.5 rounded">{f.type.replace('_', ' ')}</span>
                    <span className={`font-mono text-[9px] font-semibold sentiment-${f.sentiment.toLowerCase()}`}>{f.sentiment}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* AD */}
            <AdSlot id="ad-contractor-sidebar" size="300x250" className="h-[250px]" />
          </div>
        </div>

        {/* BOTTOM AD */}
        <AdSlot id="ad-contractor-bottom" size="728x90" className="mx-auto h-[90px] max-w-[728px]" />
      </div>
    </>
  );
}
