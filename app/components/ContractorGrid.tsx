import type { StockQuote } from '../lib/mock-data';

const defenceTickers = ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'PLTR', 'CRWD', 'NVDA', 'AXON', 'IONQ', 'OKLO', 'RKLB', 'LDOS', 'HII'];

export default function ContractorGrid({ stocks }: { stocks: StockQuote[] }) {
  const defenceStocks = stocks.filter(s => defenceTickers.includes(s.ticker));

  return (
    <div className="grid grid-cols-4 gap-3 mb-8 fade-up d4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
      {defenceStocks.map((s) => (
        <a
          key={s.ticker}
          href={`/contractor/${s.ticker}`}
          className="glass p-4 cursor-pointer hover:border-[var(--border-bright)] hover:-translate-y-0.5 hover:shadow-[0_0_50px_rgba(0,255,80,0.08)] transition-all no-underline block"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs font-bold text-[var(--accent)]">{s.ticker}</span>
            <span className={`font-mono text-[10px] ${s.changePct >= 0 ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
              {s.changePct >= 0 ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
            </span>
          </div>
          <div className="text-[11px] text-[var(--text-dim)] mb-2 truncate">{s.name}</div>
          <div className="font-mono text-lg font-bold text-[var(--text-bright)]">
            ${s.price.toFixed(2)}
          </div>
          <div className="text-[10px] text-[var(--text-dim)] mt-1">{s.sector}</div>

          {/* Mini sparkline placeholder */}
          <svg className="w-full h-6 mt-2" viewBox="0 0 100 20" fill="none">
            <path
              d={`M0,${10 + Math.random() * 5} ${Array.from({ length: 10 }, (_, i) => `L${(i + 1) * 10},${5 + Math.random() * 10}`).join(' ')}`}
              stroke={s.changePct >= 0 ? '#00ff52' : '#ff3355'}
              strokeWidth="1.5"
              fill="none"
              opacity="0.5"
            />
          </svg>
        </a>
      ))}
    </div>
  );
}
