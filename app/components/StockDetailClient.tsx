'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct?: number;
  sector?: string;
  volume?: number;
  marketCap?: number;
}

interface Signal {
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

interface GeoRisk {
  id: string;
  title: string;
  region: string;
  severity: number;
  category: string;
  summary: string;
  impactTickers: string[];
  timestamp: string;
}

export default function StockDetailClient({
  stock,
  signals,
  geoRisk,
}: {
  stock: Stock;
  signals: Signal[];
  geoRisk: GeoRisk[];
}) {
  const [phoneInput, setPhoneInput] = useState('');
  const [alertSet, setAlertSet] = useState(false);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [liveChange, setLiveChange] = useState<number | null>(null);
  const [liveChangePercent, setLiveChangePercent] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changePct = stock.changePct ?? stock.change;
  const isPositive = changePct > 0;

  // Fetch latest price from API
  const fetchLivePrice = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock-price?symbol=${stock.ticker}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      setLivePrice(data.price);
      setLiveChange(data.change);
      setLiveChangePercent(data.changePercent);
      setLastUpdated(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch price');
      // Keep showing last known price if available
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch and set up polling interval
  useEffect(() => {
    fetchLivePrice();
    const intervalId = setInterval(fetchLivePrice, 60000); // 60 seconds
    return () => clearInterval(intervalId);
  }, [stock.ticker]);

  // Format timestamp to ET timezone
  const formatTimeET = (isoString: string | null) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      }) + ' ET';
    } catch {
      return '';
    }
  };

  // Use live price if available, fallback to static price
  const displayPrice = livePrice ?? stock.price;
  const displayChange = liveChange ?? stock.change;
  const displayChangePercent = liveChangePercent ?? changePct;
  const displayIsPositive = displayChangePercent >= 0;

  const handleSMSAlert = () => {
    if (phoneInput.trim()) {
      setAlertSet(true);
      setTimeout(() => setAlertSet(false), 3000);
    }
  };

  return (
    <>
      {/* Breadcrumb */}
      <div className="font-mono text-[10px] text-[var(--text-dim)] tracking-wider mb-4 fade-up d1">
        <Link href="/" className="text-[var(--accent)] no-underline hover:underline">
          DASHBOARD
        </Link>
        <span className="mx-2">›</span>
        <Link href="/#contractors" className="text-[var(--accent)] no-underline hover:underline">
          STOCKS
        </Link>
        <span className="mx-2">›</span>
        <span className="text-[var(--text-bright)]">{stock.ticker}</span>
      </div>

      {/* ── HEADER ── */}
      <div className="glass p-6 mb-6 fade-up d2">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-2xl font-bold text-[var(--accent)]">{stock.ticker}</span>
              <span className="font-mono text-[10px] tracking-wider px-2 py-0.5 rounded bg-[rgba(0,255,80,0.06)] text-[var(--accent)] border border-[rgba(0,255,80,0.1)]">
                {stock.sector || 'DEFENCE'}
              </span>
            </div>
            <h1 className="text-xl font-bold text-[var(--text-bright)] mb-1">{stock.name}</h1>
            <p className="text-sm text-[var(--text-dim)]">Real-time market intelligence for {stock.name}</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-3xl font-bold text-[var(--text-bright)]">${displayPrice.toFixed(2)}</div>
            <div className={`font-mono text-sm ${displayIsPositive ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
              {displayIsPositive ? '▲' : '▼'} ${Math.abs(displayChange).toFixed(2)} ({displayIsPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%)
            </div>
            {lastUpdated && (
              <div className="text-[10px] text-[var(--text-dim)] mt-2">
                Last updated: {formatTimeET(lastUpdated)}
              </div>
            )}
            {livePrice !== null && (
              <p className="text-[9px] text-[var(--text-dim)] mt-1">Prices delayed ~15 min (free tier)</p>
            )}
          </div>
        </div>
      </div>

      {/* ── TWO COLUMN LAYOUT ── */}
      <div className="grid gap-6 mb-6 fade-up d3" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* STOCK INFO */}
          <div className="glass p-5">
            <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4">◆ STOCK INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4">
              {stock.marketCap && (
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] mb-1">Market Cap</p>
                  <p className="font-mono text-sm text-[var(--text-bright)]">${(stock.marketCap / 1e9).toFixed(1)}B</p>
                </div>
              )}
              {stock.volume && (
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] mb-1">Volume (24h)</p>
                  <p className="font-mono text-sm text-[var(--text-bright)]">{(stock.volume / 1e6).toFixed(1)}M</p>
                </div>
              )}
              {stock.sector && (
                <div>
                  <p className="text-[10px] text-[var(--text-dim)] mb-1">Sector</p>
                  <p className="font-mono text-sm text-[var(--text-bright)]">{stock.sector}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-[var(--text-dim)] mb-1">Change</p>
                <p className={`font-mono text-sm ${displayIsPositive ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
                  {displayIsPositive ? '+' : ''}{displayChangePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* CHART PLACEHOLDER */}
          <div className="glass p-5">
            <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4">◆ PRICE CHART</h3>
            <div className="bg-[rgba(0,255,80,0.02)] rounded border border-[rgba(0,255,80,0.1)] h-[500px] overflow-hidden">
              <iframe
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=${ticker}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&timezone=America%2FNew_York&withdateranges=1&showpopupbutton=1&locale=en`}
                style={{width: "100%", height: "100%", border: "none"}}
                allowFullScreen
                title={`${ticker} TradingView Chart`}
              />
            </div>
          </div>

          {/* RELATED SIGNALS */}
          {signals.length > 0 && (
            <div className="glass p-5">
              <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px] mb-4">◆ RELATED SIGNALS & NEWS</h3>
              <div className="space-y-3">
                {signals.slice(0, 10).map((signal) => (
                  <div key={signal.id} className="py-3 border-b border-[rgba(0,255,80,0.06)] last:border-none">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs text-[var(--text-bright)] font-semibold flex-1">{signal.title}</h4>
                      <span
                        className={`font-mono text-[9px] px-2 py-1 rounded whitespace-nowrap ${
                          signal.severity === 'CRITICAL'
                            ? 'bg-[rgba(255,51,85,0.1)] text-[#ff3355]'
                            : signal.severity === 'ALERT'
                              ? 'bg-[rgba(255,165,0,0.1)] text-[#ffa500]'
                              : 'bg-[rgba(0,255,80,0.1)] text-[var(--accent)]'
                        }`}
                      >
                        {signal.severity}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-dim)] mb-1">{signal.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-[var(--accent)]">{signal.source}</span>
                      <span className="text-[9px] text-[var(--text-dim)]">{signal.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
              {signals.length > 5 && (
                <p className="text-[10px] text-[var(--text-dim)] mt-3">
                  +{signals.length - 5} more signal{signals.length - 5 !== 1 ? 's' : ''} available
                </p>
              )}
            </div>
          )}

          {/* GEOPOLITICAL IMPACT */}
          {geoRisk.length > 0 && (
            <div className="glass p-5 border border-[rgba(255,165,0,0.2)]">
              <h3 className="font-mono text-xs text-[#ffa500] tracking-[2px] mb-4">⚠ GEOPOLITICAL IMPACT</h3>
              <div className="space-y-3">
                {geoRisk.slice(0, 6).map((event) => (
                  <div key={event.id} className="py-2 border-b border-[rgba(255,165,0,0.1)] last:border-none">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs text-[var(--text-bright)] font-semibold flex-1">{event.title}</h4>
                      <span className={`font-mono text-[9px] px-2 py-1 rounded whitespace-nowrap ${
                        event.severity >= 8 ? 'bg-red-900/20 text-red-400' :
                        event.severity >= 6 ? 'bg-orange-900/20 text-orange-400' :
                        'bg-yellow-900/20 text-yellow-400'
                      }`}>
                        Severity {event.severity}/10
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-dim)]">{event.region}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">
          {/* SMS ALERT */}
          <div className="glass p-4 border border-[rgba(0,255,80,0.3)] bg-[rgba(0,255,80,0.02)]">
            <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-3">🔔 SMS ALERTS</h3>
            <p className="text-[11px] text-[var(--text-dim)] mb-3">
              Get instant SMS notifications for price movements, news, and signals.
            </p>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-[rgba(0,0,0,0.3)] border border-[rgba(0,255,80,0.2)] rounded px-3 py-2 text-white text-sm placeholder-[rgba(255,255,255,0.3)] mb-2 focus:outline-none focus:border-[var(--accent)]"
            />
            <button
              onClick={handleSMSAlert}
              disabled={!phoneInput.trim()}
              className={`w-full py-2 rounded font-semibold text-sm transition-all ${
                alertSet
                  ? 'bg-[var(--accent)] text-[var(--bg)]'
                  : phoneInput.trim()
                    ? 'bg-[var(--accent)] text-[var(--bg)] hover:shadow-[0_0_20px_rgba(0,255,80,0.3)]'
                    : 'bg-[rgba(0,255,80,0.1)] text-[var(--accent)] cursor-not-allowed opacity-50'
              }`}
            >
              {alertSet ? '✓ Alert Enabled' : 'Enable SMS Alerts'}
            </button>
          </div>

          {/* QUICK STATS */}
          <div className="glass p-4">
            <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-3">⚡ QUICK STATS</h3>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between py-1 border-b border-[rgba(0,255,80,0.1)]">
                <span className="text-[var(--text-dim)]">Status</span>
                <span className="text-[var(--accent)] font-semibold">
                  {displayIsPositive ? '📈 Bullish' : '📉 Bearish'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[rgba(0,255,80,0.1)]">
                <span className="text-[var(--text-dim)]">Volatility</span>
                <span className="text-[var(--text-bright)]">{Math.abs(displayChangePercent) > 5 ? '🔥 High' : 'Moderate'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[var(--text-dim)]">Signal Mentions</span>
                <span className="text-[var(--accent)] font-semibold">{signals.length}</span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="glass p-4 text-center">
            <Link
              href="/"
              className="block text-[var(--accent)] font-mono text-sm no-underline hover:underline mb-2"
            >
              ← Back to Dashboard
            </Link>
            <Link
              href="/#contractors"
              className="block text-[var(--text-dim)] font-mono text-sm no-underline hover:text-[var(--accent)]"
            >
              View All Stocks
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
