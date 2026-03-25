import { getMockSignals } from '@/app/lib/mock-data'

export default async function SignalPage() {
  // Get signals from mock data (in real app, would use getSignalFeed from intel-engine)
  const signals = getMockSignals()

  return (
    <main className="min-h-screen bg-black text-[var(--accent)] font-mono pt-6 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6 mb-10 fade-up d1">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase">Signal Wire Live</h1>
          <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest mt-2">24/7 Deep-Tech & Geopolitical Intelligence</p>
        </div>

        {/* Signal Cards */}
        <div className="space-y-4 fade-up d2">
          {signals.slice(0, 12).map((signal: any, idx: number) => {
            const severityColors: Record<string, string> = {
              CRITICAL: 'border-[var(--accent3)] bg-[rgba(255,51,85,0.05)]',
              ALERT: 'border-[var(--gold)] bg-[rgba(240,192,64,0.05)]',
              INFO: 'border-[var(--accent2)] bg-[rgba(0,212,255,0.05)]',
            }

            const severityTextColors: Record<string, string> = {
              CRITICAL: 'text-[var(--accent3)]',
              ALERT: 'text-[var(--gold)]',
              INFO: 'text-[var(--accent2)]',
            }

            return (
              <div
                key={signal.id}
                className={`glass border-l-4 p-6 hover:border-l-[var(--accent)] transition-all cursor-pointer ${severityColors[signal.severity] || ''}`}
                style={{ borderLeftColor: signal.severity === 'CRITICAL' ? 'var(--accent3)' : signal.severity === 'ALERT' ? 'var(--gold)' : 'var(--accent2)' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest mr-3 ${severityTextColors[signal.severity] || ''}`}
                    >
                      {signal.severity}
                    </span>
                    <span className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
                      {new Date(signal.publishedAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[9px] bg-[var(--surface2)] px-2 py-1 rounded text-[var(--text-dim)] uppercase">
                    {signal.category}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2 mt-3">{signal.title}</h2>
                <p className="text-sm text-[var(--text)] mb-3">{signal.summary}</p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {signal.tickers?.map((ticker: string) => (
                      <span
                        key={ticker}
                        className="text-[9px] bg-[var(--surface2)] px-2 py-1 rounded border border-[var(--border)] text-[var(--accent)] font-bold"
                      >
                        {ticker}
                      </span>
                    ))}
                  </div>
                  <a
                    href={signal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-[var(--accent)] hover:text-white transition-colors uppercase font-bold"
                  >
                    Read Full Intel →
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Load More */}
        <div className="mt-10 text-center fade-up d3">
          <button className="font-mono text-[11px] border border-[var(--border)] px-6 py-3 hover:bg-[var(--surface2)] transition-all uppercase font-bold tracking-widest">
            Load More Signals
          </button>
        </div>
      </div>
    </main>
  )
}
