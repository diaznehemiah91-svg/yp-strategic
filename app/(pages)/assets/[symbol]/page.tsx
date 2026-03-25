import Link from 'next/link'
import NavBar from '@/app/components/NavBar'

export default function AssetPage({ params }: { params: { symbol: string } }) {
  // Revert the URL slug back to the TradingView format (e.g., NYMEX-CL1! to NYMEX:CL1!)
  const tvSymbol = params.symbol.replace('-', ':')

  // Extract just the ticker for display (e.g., CL1!)
  const displaySymbol = tvSymbol.split(':')[1] || tvSymbol

  // Mock data for demonstration
  const assetData = {
    price: '$71,303.83',
    change: '+0.49%',
    high24h: '$72,100.00',
    low24h: '$70,850.00',
    volume24h: '$28.4B',
    marketCap: '$1.41T',
  }

  return (
    <>
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-6 pb-20">
        {/* NAV */}
        <NavBar />

        {/* Navigation Breadcrumb */}
        <div className="mb-8 fade-up d1">
          <Link href="/assets" className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors text-sm font-mono">
            ← Back to Assets
          </Link>
        </div>

        {/* Header Info */}
        <div className="flex justify-between items-end border-b border-[var(--border)] pb-8 mb-8 fade-up d2">
          <div>
            <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase mb-2">
              {displaySymbol}
            </h1>
            <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-mono">
              {tvSymbol} • REAL-TIME FEED ACTIVE
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-white font-mono mb-1">{assetData.price}</div>
            <div className="text-[var(--accent)] font-bold text-sm font-mono">{assetData.change}</div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-12 gap-6 fade-up d3">
          {/* Chart Area */}
          <div className="col-span-12 lg:col-span-9 glass p-6 min-h-[600px] flex flex-col">
            <h2 className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest font-bold mb-4">
              Advanced Chart
            </h2>
            <div className="flex-1 flex items-center justify-center bg-[rgba(0,0,0,0.3)] rounded border border-[var(--border)]">
              <div className="text-center">
                <p className="text-[var(--text-dim)] text-sm mb-2">📊 TradingView Chart Widget</p>
                <p className="text-[10px] text-[var(--text-dim)]">Real-time candlestick chart with volume and indicators</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            {/* Asset Stats */}
            <div className="glass p-6">
              <h3 className="text-[10px] text-[var(--text-dim)] mb-4 uppercase tracking-widest font-bold border-b border-[var(--border)] pb-3">
                24h Statistics
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)]">High:</span>
                  <span className="text-white font-mono">{assetData.high24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)]">Low:</span>
                  <span className="text-white font-mono">{assetData.low24h}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-dim)]">Volume:</span>
                  <span className="text-white font-mono">{assetData.volume24h}</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-3 mt-3">
                  <span className="text-[var(--text-dim)]">Market Cap:</span>
                  <span className="text-[var(--accent)] font-bold">{assetData.marketCap}</span>
                </div>
              </div>
            </div>

            {/* Institutional Flow */}
            <div className="glass p-6">
              <h3 className="text-[10px] text-[var(--text-dim)] mb-4 uppercase tracking-widest font-bold border-b border-[var(--border)] pb-3">
                Institutional Flow
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span className="text-[var(--text-dim)]">Large Block Bids:</span>
                  <span className="text-[var(--accent)] font-bold">Elevated</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-dim)]">Put/Call Ratio:</span>
                  <span className="text-white font-mono">0.84</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-[var(--text-dim)]">Open Interest:</span>
                  <span className="text-[var(--accent)] font-bold">Rising</span>
                </li>
              </ul>
            </div>

            {/* Macro Drivers */}
            <div className="glass p-6">
              <h3 className="text-[10px] text-[var(--text-dim)] mb-4 uppercase tracking-widest font-bold border-b border-[var(--border)] pb-3">
                Macro Drivers
              </h3>
              <p className="text-sm text-[var(--text-dim)] leading-relaxed">
                Waiting for highly correlated macroeconomic data. Ensure FRED and CME API feeds are active for real-time correlation analysis.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="glass p-6 bg-gradient-to-br from-[rgba(0,255,80,0.1)] to-[rgba(0,255,80,0.02)]">
              <h3 className="text-[10px] text-[var(--accent)] mb-4 uppercase tracking-widest font-bold">
                Actions
              </h3>
              <button className="w-full bg-[var(--accent)] text-black px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-white transition-all mb-2">
                Set Alert
              </button>
              <button className="w-full border border-[var(--accent)] text-[var(--accent)] px-4 py-2 rounded font-bold text-xs uppercase tracking-widest hover:bg-[var(--accent)]/10 transition-all">
                Add to Watchlist
              </button>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
          <p>Real-time data provided by TradingView. Last update: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </>
  )
}
