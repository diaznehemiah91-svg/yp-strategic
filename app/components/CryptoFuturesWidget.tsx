'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Data Arrays with exact TradingView symbol mappings
const cryptoData = [
  { symbol: 'ADA', name: 'Cardano', tvSymbol: 'BINANCE:ADAUSDT', price: '0.27', change: 2.07 },
  { symbol: 'BTC', name: 'Bitcoin', tvSymbol: 'BINANCE:BTCUSDT', price: '71,303.83', change: 0.49 },
  { symbol: 'ETH', name: 'Ethereum', tvSymbol: 'BINANCE:ETHUSDT', price: '2,178.89', change: 1.32 },
  { symbol: 'LINK', name: 'Chainlink', tvSymbol: 'BINANCE:LINKUSDT', price: '9.36', change: 1.94 },
  { symbol: 'SOL', name: 'Solana', tvSymbol: 'BINANCE:SOLUSDT', price: '92.50', change: 1.20 },
  { symbol: 'XRP', name: 'XRP', tvSymbol: 'BINANCE:XRPUSDT', price: '1.42', change: 0.24 },
]

const futuresData = [
  { symbol: '/ES', name: 'S&P 500 Futures', tvSymbol: 'CME_MINI:ES1!', price: '5,842.25', change: 0.82 },
  { symbol: '/NQ', name: 'Nasdaq 100 Futures', tvSymbol: 'CME_MINI:NQ1!', price: '20,748.75', change: 1.11 },
  { symbol: '/YM', name: 'Dow Jones Futures', tvSymbol: 'CBOT_MINI:YM1!', price: '43,128.00', change: 0.43 },
  { symbol: '/RTY', name: 'Russell 2000 Futures', tvSymbol: 'CME_MINI:RTY1!', price: '2,089.40', change: 0.88 },
  { symbol: '/CL', name: 'Crude Oil (WTI)', tvSymbol: 'NYMEX:CL1!', price: '78.42', change: -0.86 },
  { symbol: '/GC', name: 'Gold Futures', tvSymbol: 'COMEX:GC1!', price: '3,088.40', change: 0.42 },
  { symbol: '/SI', name: 'Silver Futures', tvSymbol: 'COMEX:SI1!', price: '34.82', change: 1.28 },
  { symbol: '/BTC', name: 'Bitcoin Futures', tvSymbol: 'CME:BTC1!', price: '107,920.00', change: 2.35 },
]

export default function CryptoFuturesWidget() {
  const router = useRouter()

  // Red/Green logic based on change %
  const getTheme = (change: number) => {
    return change < 0
      ? {
          text: 'text-[var(--accent3)]',
          border: 'border-[var(--accent3)]/30',
          bg: 'hover:bg-[var(--accent3)]/5',
        }
      : {
          text: 'text-[var(--accent)]',
          border: 'border-[var(--accent)]/30',
          bg: 'hover:bg-[var(--accent)]/5',
        }
  }

  const AssetList = ({ data, title }: { data: typeof cryptoData; title: string }) => (
    <div className={`flex-1 glass border ${data[0].change < 0 ? 'border-[var(--accent3)]/20' : 'border-[var(--accent)]/20'}`}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--border)] flex justify-between items-center bg-gradient-to-r from-[rgba(0,255,80,0.05)] to-transparent">
        <h3 className="text-xs font-black tracking-widest text-[var(--text-dim)] uppercase">◆ {title}</h3>
        <span className="text-[8px] text-[var(--text-dim)]">{data.length} Assets</span>
      </div>

      {/* Assets List */}
      <div className="divide-y divide-[var(--border)]">
        {data.map((asset) => {
          const theme = getTheme(asset.change)
          return (
            <div
              key={asset.symbol}
              onClick={() => router.push(`/assets/${asset.tvSymbol.replace(':', '-')}`)}
              className={`flex items-center justify-between p-4 transition-all cursor-pointer ${theme.bg} group border-l-2 ${theme.border}`}
            >
              {/* Symbol & Name */}
              <div className="w-1/4">
                <div className="font-bold text-sm text-white group-hover:text-[var(--accent)] transition-colors">
                  {asset.symbol}
                </div>
                <div className="text-[10px] text-[var(--text-dim)] truncate">{asset.name}</div>
              </div>

              {/* Sparkline placeholder (TradingView widget) */}
              <div className="w-1/3 h-10 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <div className="text-[9px] text-[var(--text-dim)]">📈 Chart</div>
              </div>

              {/* Price & Change */}
              <div className="w-1/4 text-right">
                <div className="font-mono text-sm text-white">${asset.price}</div>
                <div className={`font-mono text-xs font-bold ${theme.text}`}>
                  {asset.change > 0 ? '▲ +' : '▼ '}{Math.abs(asset.change).toFixed(2)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <AssetList data={cryptoData} title="Crypto Assets" />
      <AssetList data={futuresData} title="Futures Contracts" />
    </div>
  )
}
