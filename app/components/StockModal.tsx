'use client';

import { X } from 'lucide-react';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number | string;
}

export default function StockModal({
  stock,
  onClose,
}: {
  stock: Stock;
  onClose: () => void;
}) {
  if (!stock) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-800/90 flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">{stock.ticker}</h2>
            <p className="text-gray-400">{stock.name}</p>
          </div>
          <button
            onClick={onClose}
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
              <span className="text-4xl font-bold text-white">${stock.price}</span>
              {typeof stock.change === 'number' && (
                <span
                  className={`text-xl ${
                    stock.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {stock.change > 0 ? '+' : ''}
                  {stock.change}%
                </span>
              )}
            </div>
          </div>

          {/* TradingView Placeholder */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">Technical Chart</p>
            <div className="bg-gray-900 rounded h-64 flex items-center justify-center border border-gray-600">
              <p className="text-gray-500">📈 TradingView Chart Embedded Here</p>
            </div>
          </div>

          {/* News Feed */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">Latest News</p>
            <div className="space-y-2">
              <div className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyan-500 cursor-pointer transition-colors">
                <p className="text-sm text-cyan-400 font-semibold">Reuters</p>
                <p className="text-white text-sm">
                  {stock.ticker} climbs on strong earnings beat
                </p>
              </div>
              <div className="bg-gray-800 p-3 rounded border border-gray-600 hover:border-cyan-500 cursor-pointer transition-colors">
                <p className="text-sm text-cyan-400 font-semibold">CNBC</p>
                <p className="text-white text-sm">
                  Analyst upgrades {stock.ticker} to buy
                </p>
              </div>
            </div>
          </div>

          {/* SMS Alert Setup */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4 border border-cyan-700/30">
            <p className="text-gray-300 font-semibold mb-2">
              🔔 Set SMS Alert for {stock.ticker}
            </p>
            <p className="text-sm text-gray-400 mb-3">
              Monitor key levels and buy zones for this stock
            </p>
            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm placeholder-gray-500 mb-2"
            />
            <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded transition-colors">
              Enable SMS Alerts
            </button>
          </div>

          {/* Trending Analysis */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-3">Trending Analysis</p>
            <div className="bg-gray-800 p-3 rounded border-l-4 border-cyan-500">
              <p className="text-white font-semibold text-sm">
                {stock.ticker}: Technical Breakout Forming
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Expert opinion on institutional accumulation patterns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
