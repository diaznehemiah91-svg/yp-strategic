import type { CryptoQuote } from '../lib/mock-data';

export default function CryptoPanel({ crypto }: { crypto: CryptoQuote[] }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[var(--gold)] tracking-[2px]">◆ CRYPTO</h3>
        <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-wider">24H</span>
      </div>
      <div className="space-y-2">
        {crypto.map((c) => (
          <div key={c.symbol} className="flex items-center justify-between py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none cursor-pointer hover:bg-[rgba(0,255,80,0.02)] -mx-2 px-2 rounded transition-colors">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--text-bright)]">{c.symbol}</span>
              <span className="text-[11px] text-[var(--text-dim)]">{c.name}</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-[var(--text-bright)]">
                ${c.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`font-mono text-[10px] ${c.change24h >= 0 ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
                {c.change24h >= 0 ? '+' : ''}{c.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border)]">
        <div className="flex justify-between text-[10px] text-[var(--text-dim)] font-mono">
          <span>BTC Dominance: 58.4%</span>
          <span>Total MCap: $3.2T</span>
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-dim)] font-mono mt-1">
          <span>Fear & Greed: 72 (Greed)</span>
          <span>ETF Inflows: +$2.1B/wk</span>
        </div>
      </div>
    </div>
  );
}
