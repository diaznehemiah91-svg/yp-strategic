'use client';

import { useState } from 'react';

interface CorrelationPair {
  pair: string;
  correlation: number;
  ticker1: string;
  ticker2: string;
  type: 'price' | 'volume' | 'volatility';
}

const CORRELATION_DATA: CorrelationPair[] = [
  { pair: 'LMT ↔ RTX', correlation: 0.87, ticker1: 'LMT', ticker2: 'RTX', type: 'price' },
  { pair: 'PLTR ↔ CRWD', correlation: 0.72, ticker1: 'PLTR', ticker2: 'CRWD', type: 'price' },
  { pair: 'NVDA ↔ AMD', correlation: 0.65, ticker1: 'NVDA', ticker2: 'AMD', type: 'price' },
  { pair: 'NOC ↔ GD', correlation: 0.81, ticker1: 'NOC', ticker2: 'GD', type: 'price' },
  { pair: 'OKLO ↔ CEG', correlation: 0.76, ticker1: 'OKLO', ticker2: 'CEG', type: 'price' },
  { pair: 'RKLB ↔ ASTS', correlation: 0.68, ticker1: 'RKLB', ticker2: 'ASTS', type: 'price' },
  { pair: 'PANW ↔ FTNT', correlation: 0.79, ticker1: 'PANW', ticker2: 'FTNT', type: 'price' },
  { pair: 'QCOM ↔ INTC', correlation: 0.58, ticker1: 'QCOM', ticker2: 'INTC', type: 'price' },
  { pair: 'BA ↔ LMT', correlation: 0.84, ticker1: 'BA', ticker2: 'LMT', type: 'price' },
  { pair: 'IONQ ↔ IBM', correlation: 0.62, ticker1: 'IONQ', ticker2: 'IBM', type: 'price' },
  { pair: 'HII ↔ RTX', correlation: 0.75, ticker1: 'HII', ticker2: 'RTX', type: 'price' },
  { pair: 'ANET ↔ AVGO', correlation: 0.69, ticker1: 'ANET', ticker2: 'AVGO', type: 'price' },
];

const getCorrelationColor = (corr: number): string => {
  if (corr >= 0.8) return 'bg-[#00ff52]/30';
  if (corr >= 0.6) return 'bg-[#00ff52]/20';
  if (corr >= 0.4) return 'bg-[#f0c040]/20';
  if (corr >= 0.2) return 'bg-[#f0c040]/10';
  if (corr >= 0) return 'bg-[#3a5a44]/10';
  if (corr >= -0.2) return 'bg-[#3a5a44]/15';
  if (corr >= -0.4) return 'bg-[#ff3355]/10';
  if (corr >= -0.6) return 'bg-[#ff3355]/20';
  return 'bg-[#ff3355]/30';
};

const getCorrelationTextColor = (corr: number): string => {
  if (Math.abs(corr) >= 0.7) return 'text-[var(--accent)]';
  if (Math.abs(corr) >= 0.5) return 'text-[var(--accent2)]';
  if (Math.abs(corr) >= 0.3) return 'text-[var(--gold)]';
  return 'text-[var(--text-dim)]';
};

export default function CorrelationMatrix() {
  const [filterType, setFilterType] = useState<'price' | 'volume' | 'volatility'>('price');

  const filtered = CORRELATION_DATA.filter(item => item.type === filterType);

  return (
    <div className="glass p-5 mb-6 fade-up d4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] flex items-center gap-2">
          <span>◆ CORRELATION MATRIX</span>
          <span className="text-[9px] text-[var(--text-dim)]">{filtered.length} pairs</span>
        </h3>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          {(['price', 'volume', 'volatility'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`font-mono text-[9px] px-2 py-1 rounded transition-all ${
                filterType === type
                  ? 'bg-[var(--accent)] text-[var(--bg)] font-bold'
                  : 'bg-[rgba(0,255,80,0.05)] text-[var(--text-dim)] hover:text-[var(--accent)]'
              }`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Correlation Pairs */}
      <div className="space-y-2">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className={`${getCorrelationColor(item.correlation)} rounded p-3 border border-[rgba(0,255,80,0.1)] hover:border-[rgba(0,255,80,0.3)] transition-all cursor-pointer`}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="font-mono font-bold text-[11px] text-[var(--text-bright)]">
                  {item.pair}
                </div>
                <div className="text-[9px] text-[var(--text-dim)] mt-1">
                  Correlation: {item.correlation > 0 ? '+' : ''}{(item.correlation * 100).toFixed(1)}%
                </div>
              </div>

              {/* Visual Correlation Bar */}
              <div className="flex-shrink-0">
                <div className="w-32 h-6 bg-[rgba(0,255,80,0.05)] rounded border border-[rgba(0,255,80,0.1)]">
                  <div
                    className={`h-full rounded ${getCorrelationColor(item.correlation)} flex items-center justify-end pr-2 transition-all`}
                    style={{
                      width: `${Math.abs(item.correlation) * 100}%`,
                      backgroundColor:
                        item.correlation > 0.5
                          ? 'rgba(0,255,80,0.3)'
                          : item.correlation > 0
                            ? 'rgba(240,192,64,0.2)'
                            : 'rgba(255,51,85,0.2)',
                    }}
                  >
                    <span className={`text-[9px] font-mono font-bold ${getCorrelationTextColor(item.correlation)}`}>
                      {(item.correlation * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-[rgba(0,255,80,0.12)]">
        <div className="grid grid-cols-2 gap-4 text-[9px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00ff52]/30 rounded" />
            <span className="text-[var(--text-dim)]">Strong Correlation (0.8+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#f0c040]/20 rounded" />
            <span className="text-[var(--text-dim)]">Moderate (0.4-0.6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3a5a44]/10 rounded" />
            <span className="text-[var(--text-dim)]">Weak (0.0-0.2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#ff3355]/20 rounded" />
            <span className="text-[var(--text-dim)]">Negative (-0.4 to -0.8)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
