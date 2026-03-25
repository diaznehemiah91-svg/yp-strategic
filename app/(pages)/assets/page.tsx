import CryptoFuturesWidget from '@/app/components/CryptoFuturesWidget'
import NavBar from '@/app/components/NavBar'

export const revalidate = 60

export default function AssetsPage() {
  return (
    <>
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-6 pb-20">
        {/* NAV */}
        <NavBar />

        {/* HEADER */}
        <div className="text-center py-12 fade-up d1">
          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
            Crypto & Futures
          </h1>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-8">
            Real-Time Market Intelligence Dashboard
          </p>
          <p className="text-sm text-[var(--text)] max-w-2xl mx-auto">
            Monitor crypto assets and futures contracts with live price feeds, institutional order flow, and macro correlations. Click any asset to view detailed charts and analysis.
          </p>
        </div>

        {/* WIDGET */}
        <div className="fade-up d2 mb-16">
          <CryptoFuturesWidget />
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up d3">
          <div className="glass p-6">
            <h3 className="text-[var(--accent)] font-bold mb-3 uppercase text-xs tracking-widest">📊 Crypto Assets</h3>
            <p className="text-sm text-[var(--text-dim)]">
              Major cryptocurrencies with 24h price action, market cap, and volume data. Updated every 15 seconds via Binance feeds.
            </p>
          </div>

          <div className="glass p-6">
            <h3 className="text-[var(--accent2)] font-bold mb-3 uppercase text-xs tracking-widest">⚡ Futures Markets</h3>
            <p className="text-sm text-[var(--text-dim)]">
              S&P 500, Nasdaq, commodities, and crypto futures. Real-time open interest and institutional positioning data.
            </p>
          </div>

          <div className="glass p-6">
            <h3 className="text-[var(--gold)] font-bold mb-3 uppercase text-xs tracking-widest">🔗 Market Correlation</h3>
            <p className="text-sm text-[var(--text-dim)]">
              View how assets move together. Crypto often correlates with tech futures. Oil inversely correlates with defensive assets.
            </p>
          </div>
        </div>

        {/* TRADING SETUP */}
        <div className="mt-16 glass p-8 fade-up d4">
          <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">Trading Strategy Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Watchlist */}
            <div className="border border-[var(--border)] rounded p-4">
              <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest mb-3">My Watchlist</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center p-2 bg-[rgba(0,255,80,0.05)] rounded">
                  <span className="text-white">Bitcoin (BTC)</span>
                  <span className="text-[var(--accent)] font-bold">↗ +0.49%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[rgba(0,255,80,0.05)] rounded">
                  <span className="text-white">S&P 500 (/ES)</span>
                  <span className="text-[var(--accent)] font-bold">↗ +0.82%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-[rgba(255,51,85,0.05)] rounded">
                  <span className="text-white">Crude Oil (/CL)</span>
                  <span className="text-[var(--accent3)] font-bold">↘ -0.86%</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-[var(--accent)] text-black px-3 py-2 rounded text-xs font-bold uppercase hover:bg-white transition-all">
                Manage Watchlist
              </button>
            </div>

            {/* Alerts Setup */}
            <div className="border border-[var(--border)] rounded p-4">
              <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest mb-3">Price Alerts</h3>
              <div className="space-y-2 text-sm">
                <div className="p-2 bg-[rgba(240,192,64,0.05)] rounded border border-[var(--gold)]/30">
                  <div className="text-white text-xs">BTC breaks $72K</div>
                  <div className="text-[var(--gold)] text-[9px]">Alert ready</div>
                </div>
                <div className="p-2 bg-[rgba(240,192,64,0.05)] rounded border border-[var(--gold)]/30">
                  <div className="text-white text-xs">/ES closes below 5,800</div>
                  <div className="text-[var(--gold)] text-[9px]">Alert ready</div>
                </div>
              </div>
              <button className="w-full mt-4 border border-[var(--accent)] text-[var(--accent)] px-3 py-2 rounded text-xs font-bold uppercase hover:bg-[var(--accent)]/10 transition-all">
                Create Alert
              </button>
            </div>
          </div>

          {/* Strategy Tips */}
          <div className="border-t border-[var(--border)] pt-6">
            <h3 className="text-xs font-bold text-[var(--text-dim)] uppercase tracking-widest mb-4">Strategy Tips</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[var(--text)]">
              <li className="flex gap-2">
                <span className="text-[var(--accent)]">✓</span>
                <span>Monitor crypto-to-stock correlation when VIX {`>`} 20</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)]">✓</span>
                <span>Oil often inverts during risk-off market moves</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)]">✓</span>
                <span>Watch Fed announcements for futures gapping</span>
              </li>
              <li className="flex gap-2">
                <span className="text-[var(--accent)]">✓</span>
                <span>Bitcoin futures volume precedes spot market moves</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-12 text-center text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
          <p>Market data updated every 15 seconds. All times in UTC.</p>
          <p className="mt-2">Last refresh: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>
    </>
  )
}
