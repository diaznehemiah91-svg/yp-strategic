'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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
  category: string;
  severity: string;
  tickers: string[];
  timestamp: string;
}

export default function DashboardClient({
  stocks,
  signals,
  crypto,
  futures,
  fedUpdates,
  geoRisk,
}: {
  stocks: Stock[];
  signals: Signal[];
  crypto: any[];
  futures: any[];
  fedUpdates: any[];
  geoRisk: any[];
}) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // Categorize stocks into 4 columns
  const techQuantum = stocks.filter(s =>
    ['NVDA', 'IONQ', 'PLTR', 'CRWD', 'AXON', 'OKLO', 'RKLB'].includes(s.ticker)
  ).slice(0, 10);

  const dividendStocks = stocks.filter(s =>
    ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'LDOS', 'HII'].includes(s.ticker)
  ).slice(0, 10);

  const hotStocks = stocks.filter(s =>
    !techQuantum.find(t => t.ticker === s.ticker) &&
    !dividendStocks.find(t => t.ticker === s.ticker)
  ).slice(0, 10);

  const signalCards = signals.slice(0, 10);

  const StockCard = ({ stock }: { stock: Stock }) => {
    const changePct = stock.changePct ?? stock.change;
    const isPositive = changePct > 0;

    return (
      <div
        onClick={() => setSelectedStock(stock)}
        className="bg-gray-800/60 backdrop-blur-sm hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-lg text-white">{stock.ticker}</h3>
            <p className="text-sm text-gray-400">{stock.name}</p>
          </div>
          <div className={`text-xs px-2 py-1 rounded ${isPositive ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {isPositive ? '+' : ''}{changePct?.toFixed(2)}%
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-white">${stock.price?.toFixed(2)}</span>
          <span className={isPositive ? 'text-green-500 text-lg' : 'text-red-500 text-lg'}>
            {isPositive ? '📈' : '📉'}
          </span>
        </div>
      </div>
    );
  };

  const SignalCard = ({ signal }: { signal: Signal }) => {
    const categoryColors: Record<string, string> = {
      DEFENCE: 'text-red-400',
      CYBER: 'text-purple-400',
      QUANTUM: 'text-cyan-400',
      AI: 'text-blue-400',
      NUCLEAR: 'text-yellow-400',
      GEOPOLITICAL: 'text-orange-400',
      FED: 'text-green-400',
      CRYPTO: 'text-pink-400',
      FUTURES: 'text-indigo-400',
    };

    const severityBg: Record<string, string> = {
      CRITICAL: 'bg-red-900/30 text-red-400',
      ALERT: 'bg-orange-900/30 text-orange-400',
      INFO: 'bg-blue-900/30 text-blue-400',
    };

    return (
      <div className="bg-gray-800/60 hover:bg-gray-700 border border-gray-700 hover:border-cyan-500 rounded-lg p-3 transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <p className={`text-xs font-semibold ${categoryColors[signal.category] || 'text-gray-400'}`}>
            {signal.category}
          </p>
          <span className={`text-xs px-2 py-1 rounded ${severityBg[signal.severity] || 'bg-gray-700 text-gray-300'}`}>
            {signal.severity}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-white line-clamp-2">{signal.title}</h4>
        <p className="text-xs text-gray-400 mt-1">{signal.source} • {signal.timestamp}</p>
      </div>
    );
  };

  const Column = ({
    title,
    subtitle,
    items,
    isSignal,
  }: {
    title: string;
    subtitle: string;
    items: any[];
    isSignal: boolean;
  }) => {
    return (
      <div className="space-y-4">
        <div className="pb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-xs text-cyan-400">{subtitle}</p>
        </div>
        <div className="space-y-3">
          {items.map(item =>
            isSignal ? (
              <SignalCard key={item.id} signal={item} />
            ) : (
              <StockCard key={item.ticker} stock={item} />
            )
          )}
        </div>
      </div>
    );
  };

  const StockModalComponent = () => {
    if (!selectedStock) return null;

    const changePct = selectedStock.changePct ?? selectedStock.change;
    const isPositive = changePct > 0;
    const relatedSignals = signals.filter(s => s.tickers.includes(selectedStock.ticker)).slice(0, 3);

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gray-800/90 flex justify-between items-center p-6 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedStock.ticker}</h2>
              <p className="text-gray-400">{selectedStock.name}</p>
            </div>
            <button
              onClick={() => setSelectedStock(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Price Section */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Current Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">${selectedStock.price?.toFixed(2)}</span>
                <span className={`text-xl ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}
                  {changePct?.toFixed(2)}%
                </span>
              </div>
              {selectedStock.marketCap && (
                <p className="text-sm text-gray-400 mt-2">
                  Market Cap: ${(selectedStock.marketCap / 1e9).toFixed(1)}B
                </p>
              )}
            </div>

            {/* Sector */}
            {selectedStock.sector && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Sector</p>
                <p className="text-white font-semibold">{selectedStock.sector}</p>
              </div>
            )}

            {/* Technical Chart Placeholder */}
            <div className="bg-gray-700/30 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-3">Technical Chart</p>
              <div className="bg-gray-900 rounded h-64 flex items-center justify-center border border-gray-600">
                <p className="text-gray-500">📈 TradingView Chart Embedded Here</p>
              </div>
            </div>

            {/* Related News / Signals */}
            {relatedSignals.length > 0 && (
              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-3">Latest News & Signals</p>
                <div className="space-y-2">
                  {relatedSignals.map(signal => (
                    <div
                      key={signal.id}
                      className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyan-500 cursor-pointer transition-colors"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm text-cyan-400 font-semibold">{signal.source}</p>
                        <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-400">
                          {signal.category}
                        </span>
                      </div>
                      <p className="text-white text-sm">{signal.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{signal.timestamp}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SMS Alert Setup */}
            <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4 border border-cyan-700/30">
              <p className="text-gray-300 font-semibold mb-2">🔔 Set SMS Alert for {selectedStock.ticker}</p>
              <p className="text-sm text-gray-400 mb-3">Monitor key levels and signals for this stock</p>
              <input
                type="text"
                placeholder="Enter phone number"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-500 mb-2"
              />
              <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded transition-colors">
                Enable SMS Alerts
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gray-900/60 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl font-bold text-cyan-400">ypstrategicresearch.com</span>
            <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800 rounded">RESEARCH</span>
          </div>
          <div className="flex gap-6 text-sm font-semibold">
            <button className="text-cyan-400 border-b-2 border-cyan-400 pb-2">STOCKS</button>
            <button className="text-gray-400 hover:text-white pb-2">SCREENERS</button>
            <button className="text-gray-400 hover:text-white pb-2">FUTURES</button>
            <button className="text-gray-400 hover:text-white pb-2">CRYPTO</button>
            <button className="text-gray-400 hover:text-white pb-2">NEWS</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Column title="TECH & QUANTUM" subtitle="Nexus" items={techQuantum} isSignal={false} />
          <Column title="DIVIDEND STOCKS" subtitle="Bridgepath" items={dividendStocks} isSignal={false} />
          <Column title="HOT STOCKS" subtitle="Forge" items={hotStocks} isSignal={false} />
          <Column title="NEWS & SIGNALS" subtitle="Signal" items={signalCards} isSignal={true} />
        </div>
      </div>

      <StockModalComponent />

      <div className="fixed bottom-6 left-6 bg-gray-800 border border-cyan-500 rounded-lg p-4 max-w-sm text-sm z-30">
        <p className="text-cyan-400 font-semibold">✨ YP Strategic Research</p>
        <p className="text-gray-300 text-xs mt-1">4-Column Intelligence Dashboard</p>
      </div>
    </>
  );
}
