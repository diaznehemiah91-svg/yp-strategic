import type { StockQuote, CryptoQuote, FuturesQuote } from '../lib/mock-data';

interface Props {
  stocks: StockQuote[];
  crypto: CryptoQuote[];
  futures: FuturesQuote[];
}

export default function TickerStrip({ stocks, crypto, futures }: Props) {
  const items = [
    ...stocks.slice(0, 8).map(s => ({ sym: s.ticker, price: `$${s.price.toFixed(2)}`, pct: s.changePct, prefix: '' })),
    ...crypto.slice(0, 3).map(c => ({ sym: c.symbol, price: `$${c.price.toLocaleString()}`, pct: c.change24h, prefix: '₿ ' })),
    ...futures.slice(0, 4).map(f => ({ sym: f.symbol, price: `${f.price.toLocaleString()}`, pct: f.changePct, prefix: '' })),
  ];

  // Duplicate for seamless scroll
  const allItems = [...items, ...items];

  return (
    <div className="flex gap-6 px-5 py-2.5 overflow-hidden font-mono text-[11px] border-t border-b border-[var(--border)] mb-7 fade-up d3 ticker-strip">
      {allItems.map((item, i) => (
        <div key={i} className="flex gap-2 items-center whitespace-nowrap">
          <span className="text-[var(--text-bright)] font-semibold">{item.prefix}{item.sym}</span>
          <span className="text-[var(--text-dim)]">{item.price}</span>
          <span className={item.pct >= 0 ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}>
            {item.pct >= 0 ? '+' : ''}{item.pct.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
