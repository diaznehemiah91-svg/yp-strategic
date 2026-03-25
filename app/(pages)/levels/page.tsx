import TickerLevels from '@/app/components/TickerLevels'
import NavBar from '@/app/components/NavBar'

// Example ticker levels data
const tickerLevelsData = [
  {
    ticker: 'LMT',
    index: 'S&P 500',
    levels: {
      support: 442.50,
      resistance: 478.10,
      historical_high: 501.20
    },
    geopolitical_weight: 'High' as const,
    currentPrice: 465.80,
    change: 2.30,
    changePct: 0.49
  },
  {
    ticker: 'PLTR',
    index: 'NASDAQ',
    levels: {
      support: 22.30,
      resistance: 28.75,
      historical_high: 32.80
    },
    geopolitical_weight: 'Critical' as const,
    currentPrice: 26.50,
    change: 0.75,
    changePct: 2.91
  },
  {
    ticker: 'RTX',
    index: 'S&P 500',
    levels: {
      support: 100.20,
      resistance: 125.50,
      historical_high: 130.10
    },
    geopolitical_weight: 'High' as const,
    currentPrice: 118.30,
    change: -1.20,
    changePct: -1.01
  },
  {
    ticker: 'NOC',
    index: 'S&P 500',
    levels: {
      support: 295.40,
      resistance: 340.80,
      historical_high: 367.20
    },
    geopolitical_weight: 'Medium' as const,
    currentPrice: 325.10,
    change: 3.45,
    changePct: 1.08
  },
  {
    ticker: 'CRWD',
    index: 'NASDAQ',
    levels: {
      support: 32.10,
      resistance: 42.30,
      historical_high: 45.80
    },
    geopolitical_weight: 'High' as const,
    currentPrice: 39.20,
    change: 1.15,
    changePct: 3.03
  },
  {
    ticker: 'NVDA',
    index: 'NASDAQ',
    levels: {
      support: 820.00,
      resistance: 940.50,
      historical_high: 972.40
    },
    geopolitical_weight: 'Medium' as const,
    currentPrice: 895.75,
    change: 8.50,
    changePct: 0.96
  }
]

export default function LevelsPage() {
  return (
    <>
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-6 pb-20">
        {/* NAV */}
        <NavBar />

        {/* HEADER */}
        <div className="text-center py-12 fade-up d1">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
            Technical Levels
          </h1>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-8">
            Support • Resistance • Geopolitical Impact
          </p>
          <p className="text-sm text-[var(--text)] max-w-2xl mx-auto">
            View support and resistance levels for defence contractors with geopolitical weight indicators. Click any card to view full analysis.
          </p>
        </div>

        {/* TICKER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up d2">
          {tickerLevelsData.map((data) => (
            <TickerLevels key={data.ticker} {...data} />
          ))}
        </div>

        {/* INFO SECTION */}
        <div className="mt-16 glass p-8 max-w-3xl mx-auto fade-up d3">
          <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter">How to Read These Levels</h2>

          <div className="space-y-4 text-sm text-[var(--text)]">
            <div>
              <h3 className="text-[var(--accent)] font-bold mb-1 uppercase text-xs tracking-widest">📈 Resistance</h3>
              <p>The price level where sellers often push back. Breaching resistance can signal bullish momentum.</p>
            </div>

            <div>
              <h3 className="text-[var(--accent)] font-bold mb-1 uppercase text-xs tracking-widest">📉 Support</h3>
              <p>The price floor where buyers step in. Breaking support signals weakness and potential further decline.</p>
            </div>

            <div>
              <h3 className="text-[var(--gold)] font-bold mb-1 uppercase text-xs tracking-widest">🎯 Historical High</h3>
              <p>All-time high price. Approaching this level suggests potential breakout or reversal.</p>
            </div>

            <div>
              <h3 className="text-[var(--accent3)] font-bold mb-1 uppercase text-xs tracking-widest">🌍 Geopolitical Weight</h3>
              <p>How much this contractor is exposed to defence spending and geopolitical events.</p>
              <div className="mt-2 flex gap-4 text-xs">
                <span className="text-[var(--accent)]">🟢 Low Impact</span>
                <span className="text-[var(--gold)]">🟡 Medium Impact</span>
                <span className="text-[var(--accent3)]">🔴 High Impact</span>
                <span className="text-red-500">⚫ Critical Impact</span>
              </div>
            </div>
          </div>
        </div>

        {/* LEGEND */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 fade-up d4">
          <div className="glass p-6">
            <h3 className="text-[var(--accent)] font-bold mb-4 uppercase text-xs tracking-widest">
              ✓ Green Signals
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li>📊 Stock price at support level</li>
              <li>✓ Bounce opportunity forming</li>
              <li>📈 Positive price change</li>
              <li>✅ Under-valued entry point</li>
            </ul>
          </div>

          <div className="glass p-6">
            <h3 className="text-[var(--accent3)] font-bold mb-4 uppercase text-xs tracking-widest">
              ⚠️ Red Signals
            </h3>
            <ul className="space-y-2 text-xs text-[var(--text)]">
              <li>📉 Stock price at resistance level</li>
              <li>🛑 Take profit opportunity</li>
              <li>📉 Negative price change</li>
              <li>⚠️ Caution zone - consolidation likely</li>
            </ul>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-12 text-center text-xs text-[var(--text-dim)] uppercase tracking-widest">
          <p>Technical levels are for educational purposes. Always conduct your own research before trading.</p>
          <p className="mt-2">Data updated every 15 seconds. Last refresh: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </>
  )
}
