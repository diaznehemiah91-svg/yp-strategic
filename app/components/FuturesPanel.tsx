import type { FuturesQuote } from '../lib/mock-data';

export default function FuturesPanel({ futures }: { futures: FuturesQuote[] }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[#00ffc8] tracking-[2px]">◆ FUTURES</h3>
        <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-wider">CME</span>
      </div>
      <div className="space-y-2">
        {futures.map((f) => (
          <div key={f.symbol} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none cursor-pointer hover:bg-[rgba(0,255,80,0.02)] -mx-2 px-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--text-bright)]">{f.symbol}</span>
              <span className="text-[11px] text-[var(--text-dim)]">{f.name}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-[var(--text-bright)]">
                {f.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className={`font-mono text-[10px] ${f.changePct >= 0 ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
                {f.changePct >= 0 ? '+' : ''}{f.changePct.toFixed(2)}%
                <span className="text-[var(--text-dim)] ml-1">
                  ({f.change >= 0 ? '+' : ''}{f.change.toFixed(2)})
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="flex justify-between text-[10px] text-[var(--text-dim)] font-mono">
          <span>VIX: 14.82 <span className="text-[var(--accent)]">-0.34</span></span>
          <span>DXY: 103.42 <span className="text-[var(--accent3)]">-0.18%</span></span>
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-dim)] font-mono mt-1">
          <span>10Y Yield: 4.28%</span>
          <span>2Y Yield: 4.61%</span>
        </div>
      </div>
    </div>
  );
}
