'use client';

import Link from 'next/link';

interface Stock {
  ticker: string;
  price: number;
  changePct: number;
  sector?: string;
}

interface SectorHeatmapProps {
  stocks: Stock[];
}

const getHeatColor = (changePct: number): { bg: string; text: string } => {
  if (changePct >= 10) {
    return { bg: 'bg-[#00ff52]/30', text: 'text-[#00ff52]' };
  } else if (changePct >= 3) {
    return { bg: 'bg-[#00ff52]/20', text: 'text-[#00ff52]' };
  } else if (changePct >= 0) {
    return { bg: 'bg-[#00ff52]/10', text: 'text-[#e0ffe8]' };
  } else if (changePct >= -3) {
    return { bg: 'bg-[#3a5a44]/10', text: 'text-[#e0ffe8]' };
  } else if (changePct >= -10) {
    return { bg: 'bg-[#ff3355]/20', text: 'text-[#ff3355]' };
  } else {
    return { bg: 'bg-[#ff3355]/30', text: 'text-[#ff3355]' };
  }
};

export default function SectorHeatmap({ stocks }: SectorHeatmapProps) {
  const sortedStocks = [...stocks].sort((a, b) => b.changePct - a.changePct);

  return (
    <div className="glass p-5 mb-6 fade-up d3">
      <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4 flex items-center gap-2">
        <span>◆ SECTOR HEAT MAP</span>
        <span className="text-[9px] text-[var(--text-dim)]">Top 50 stocks by change</span>
      </h3>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {sortedStocks.slice(0, 49).map(stock => {
          const { bg, text } = getHeatColor(stock.changePct);
          return (
            <Link
              key={stock.ticker}
              href={`/contractor/${stock.ticker}`}
              className={`${bg} ${text} p-2 rounded text-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg`}
              title={`${stock.ticker}: $${stock.price.toFixed(2)} (${stock.changePct > 0 ? '+' : ''}${stock.changePct.toFixed(2)}%)`}
            >
              <div className="font-mono font-bold text-[10px]">{stock.ticker}</div>
              <div className="font-mono text-[9px] opacity-75">
                {stock.changePct > 0 ? '▲' : '▼'} {Math.abs(stock.changePct).toFixed(1)}%
              </div>
            </Link>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-[rgba(0,255,80,0.12)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff52]/30 rounded" />
          <span className="text-[9px] text-[var(--text-dim)]">+10%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff52]/20 rounded" />
          <span className="text-[9px] text-[var(--text-dim)]">+3%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#00ff52]/10 rounded" />
          <span className="text-[9px] text-[var(--text-dim)]">0%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3a5a44]/10 rounded" />
          <span className="text-[9px] text-[var(--text-dim)]">-3%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ff3355]/20 rounded" />
          <span className="text-[9px] text-[var(--text-dim)]">-10%</span>
        </div>
      </div>
    </div>
  );
}
