'use client'

import { useRouter } from 'next/navigation'

interface TickerLevel {
  ticker: string
  index: string
  levels: {
    support: number
    resistance: number
    historical_high: number
  }
  geopolitical_weight: 'Low' | 'Medium' | 'High' | 'Critical'
  currentPrice?: number
  change?: number
  changePct?: number
}

export default function TickerLevels({
  ticker,
  index,
  levels,
  geopolitical_weight,
  currentPrice = 465.80,
  change = 2.30,
  changePct = 0.49
}: TickerLevel) {
  const router = useRouter()

  const isPositive = changePct >= 0
  const isAtResistance = currentPrice >= levels.resistance * 0.98
  const isAtSupport = currentPrice <= levels.support * 1.02
  const nearHistoricalHigh = currentPrice >= levels.historical_high * 0.95

  // Determine geopolitical color
  const geoColorMap = {
    'Low': 'text-[var(--accent)] border-[var(--accent)]',
    'Medium': 'text-[var(--gold)] border-[var(--gold)]',
    'High': 'text-[var(--accent3)] border-[var(--accent3)]',
    'Critical': 'text-red-500 border-red-500 animate-pulse'
  }

  const geoGlowMap = {
    'Low': 'shadow-[0_0_15px_rgba(0,255,80,0.3)]',
    'Medium': 'shadow-[0_0_15px_rgba(240,192,64,0.3)]',
    'High': 'shadow-[0_0_15px_rgba(255,51,85,0.3)]',
    'Critical': 'shadow-[0_0_20px_rgba(255,51,85,0.5)]'
  }

  return (
    <div
      onClick={() => router.push(`/contractor/${ticker}`)}
      className={`
        glass p-6 rounded-lg cursor-pointer transition-all hover:scale-105
        ${isPositive ? 'ticker-positive' : 'ticker-negative'}
        ${geoGlowMap[geopolitical_weight]}
      `}
    >
      {/* Header: Ticker + Index */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-black tracking-tighter mb-1">{ticker}</h3>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">{index}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${geoColorMap[geopolitical_weight]}`}>
          🌍 {geopolitical_weight}
        </span>
      </div>

      {/* Price Section */}
      <div className="mb-4 pb-4 border-b border-[rgba(0,255,80,0.1)]">
        <div className="text-2xl font-black tracking-tighter mb-1">
          ${currentPrice.toFixed(2)}
        </div>
        <div className={`text-[11px] font-bold uppercase tracking-widest ${
          isPositive ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'
        }`}>
          {isPositive ? '▲' : '▼'} ${Math.abs(change).toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
        </div>
      </div>

      {/* Technical Levels */}
      <div className="space-y-3">
        {/* Resistance */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-dim)] uppercase tracking-widest font-bold">
              RESISTANCE
            </span>
            <span className={`font-black tracking-tighter ${
              isAtResistance ? 'text-[var(--accent3)] animate-pulse' : 'text-[var(--text)]'
            }`}>
              ${levels.resistance.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 bg-[rgba(0,255,80,0.1)] rounded overflow-hidden">
            <div
              className="h-full bg-[var(--accent3)]"
              style={{
                width: `${Math.min(100, (currentPrice / levels.resistance) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Current Price Indicator */}
        <div className="flex items-center justify-between text-[9px] px-2 py-1.5 bg-[rgba(0,255,80,0.05)] rounded border border-[var(--accent)]/30">
          <span className="text-[var(--text-dim)]">YOU ARE HERE</span>
          <span className="font-bold text-[var(--accent)]">${currentPrice.toFixed(2)}</span>
        </div>

        {/* Support */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-dim)] uppercase tracking-widest font-bold">
              SUPPORT
            </span>
            <span className={`font-black tracking-tighter ${
              isAtSupport ? 'text-[var(--accent)] animate-pulse' : 'text-[var(--text)]'
            }`}>
              ${levels.support.toFixed(2)}
            </span>
          </div>
          <div className="h-1.5 bg-[rgba(255,51,85,0.1)] rounded overflow-hidden">
            <div
              className="h-full bg-[var(--accent)]"
              style={{
                width: `${Math.max(0, ((levels.support - currentPrice) / levels.support) * 100)}%`
              }}
            />
          </div>
        </div>

        {/* Historical High */}
        <div className="pt-2 border-t border-[rgba(0,255,80,0.1)]">
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-[var(--text-dim)] uppercase tracking-widest font-bold">
              HISTORICAL HIGH
            </span>
            <span className={`font-black tracking-tighter ${
              nearHistoricalHigh ? 'text-[var(--gold)] animate-pulse' : 'text-[var(--text)]'
            }`}>
              ${levels.historical_high.toFixed(2)}
            </span>
          </div>
          <p className="text-[9px] text-[var(--text-dim)] mt-1">
            {nearHistoricalHigh ? '📈 Approaching all-time high' : `📊 ${((currentPrice / levels.historical_high) * 100).toFixed(1)}% of ATH`}
          </p>
        </div>
      </div>

      {/* Alerts */}
      {isAtResistance && (
        <div className="mt-4 p-2 bg-[rgba(255,51,85,0.1)] border border-[var(--accent3)] rounded text-[9px] text-[var(--accent3)] font-bold">
          ⚠️ AT RESISTANCE — Consider taking profits
        </div>
      )}

      {isAtSupport && (
        <div className="mt-4 p-2 bg-[rgba(0,255,80,0.1)] border border-[var(--accent)] rounded text-[9px] text-[var(--accent)] font-bold">
          ✓ AT SUPPORT — Potential bounce opportunity
        </div>
      )}

      {nearHistoricalHigh && (
        <div className="mt-4 p-2 bg-[rgba(240,192,64,0.1)] border border-[var(--gold)] rounded text-[9px] text-[var(--gold)] font-bold">
          🎯 NEAR HISTORICAL HIGH — Breaking out?
        </div>
      )}

      {/* Click to View */}
      <div className="mt-4 pt-4 border-t border-[rgba(0,255,80,0.1)] text-center">
        <p className="text-[8px] text-[var(--text-dim)] uppercase tracking-widest">
          Click to view full analysis
        </p>
      </div>
    </div>
  )
}
