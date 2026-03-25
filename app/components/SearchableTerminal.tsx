'use client';
import { useState, useCallback } from 'react';
import useSWR from 'swr';
import { X, Search, TrendingUp, TrendingDown } from 'lucide-react';
import MiniChart from './MiniChart';

const CATEGORIES: Record<string, string[]> = {
  'Robotics': ['SYM', 'SERV', 'TER', 'ISRG'],
  'AI / Data Centers': ['NVDA', 'AVGO', 'ANET', 'NBIS'],
  'Energy': ['OKLO', 'SMR', 'CEG', 'GEV'],
  'Quantum': ['IONQ', 'RGTI', 'QBTS', 'QUBT'],
  'Defense': ['AVAV', 'KTOS', 'PLTR', 'LMT'],
};

const CATEGORY_COLOR: Record<string, string> = {
  'Robotics': 'var(--accent2)',
  'AI / Data Centers': 'var(--accent)',
  'Energy': 'var(--gold)',
  'Quantum': '#a78bfa',
  'Defense': 'var(--accent3)',
};

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface PriceData {
  price: number;
  change: number;
  changePercent: number;
}

// ── Individual ticker row with live SWR price ──
function TickerRow({
  ticker,
  category,
  onClick,
}: {
  ticker: string;
  category: string;
  onClick: (ticker: string) => void;
}) {
  const { data } = useSWR<PriceData>(
    `/api/stock-price?symbol=${ticker}`,
    fetcher,
    { refreshInterval: 60000, revalidateOnFocus: false }
  );

  const price = data?.price;
  const change = data?.changePercent ?? 0;
  const up = change >= 0;
  const catColor = CATEGORY_COLOR[category] ?? 'var(--accent)';

  return (
    <button
      onClick={() => onClick(ticker)}
      className="w-full flex items-center gap-3 px-3 py-2 rounded transition-all hover:bg-[var(--surface2)] group text-left"
    >
      <span
        className="font-mono text-[13px] font-bold w-14 shrink-0"
        style={{ color: catColor }}
      >
        {ticker}
      </span>
      <span className="font-mono text-[11px] text-[var(--text)] flex-1 truncate group-hover:text-[var(--text-bright)] transition-colors">
        {ticker}
      </span>
      {price !== undefined ? (
        <>
          <span className="font-mono text-[12px] text-[var(--text-dim)] w-20 text-right shrink-0">
            ${price.toFixed(2)}
          </span>
          <span
            className="font-mono text-[11px] w-16 text-right shrink-0 flex items-center justify-end gap-0.5"
            style={{ color: up ? 'var(--accent)' : 'var(--accent3)' }}
          >
            {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(change).toFixed(2)}%
          </span>
        </>
      ) : (
        <span className="font-mono text-[11px] text-[var(--text-dim)] w-36 text-right shrink-0 animate-pulse">
          $---.-- · --.-- %
        </span>
      )}
    </button>
  );
}

// ── Ticker detail modal ──
function TickerModal({
  ticker,
  onClose,
}: {
  ticker: string;
  onClose: () => void;
}) {
  const { data } = useSWR<PriceData>(
    `/api/stock-price?symbol=${ticker}`,
    fetcher,
    { refreshInterval: 60000, revalidateOnFocus: false }
  );

  const price = data?.price ?? 0;
  const change = data?.change ?? 0;
  const changePct = data?.changePercent ?? 0;
  const up = changePct >= 0;

  // Find category
  const category = Object.entries(CATEGORIES).find(([, tickers]) =>
    tickers.includes(ticker)
  )?.[0] ?? '';
  const catColor = CATEGORY_COLOR[category] ?? 'var(--accent)';

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="glass relative w-full max-w-lg overflow-hidden"
        style={{ border: '1px solid var(--border-bright)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[18px] font-black"
              style={{ color: catColor }}
            >
              {ticker}
            </span>
            {category && (
              <span
                className="font-mono text-[9px] tracking-[2px] px-2 py-0.5 rounded-full border uppercase"
                style={{ color: catColor, borderColor: catColor, background: `${catColor}18` }}
              >
                {category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {price > 0 && (
              <div className="text-right">
                <div className="font-mono text-[16px] font-bold text-[var(--text-bright)]">
                  ${price.toFixed(2)}
                </div>
                <div
                  className="font-mono text-[11px]"
                  style={{ color: up ? 'var(--accent)' : 'var(--accent3)' }}
                >
                  {up ? '▲' : '▼'} {Math.abs(change).toFixed(2)} ({Math.abs(changePct).toFixed(2)}%)
                </div>
              </div>
            )}
            <button onClick={onClose}>
              <X size={16} className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors" />
            </button>
          </div>
        </div>

        {/* Chart */}
        {price > 0 && (
          <div className="px-4 pt-4 pb-2">
            <MiniChart price={price} change={change} height={140} />
          </div>
        )}

        {/* Live indicator */}
        <div className="flex items-center gap-2 px-5 pb-4 pt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
          <span className="font-mono text-[9px] tracking-[2px] text-[var(--accent)] uppercase">
            Live · Refreshes every 60s
          </span>
          <span className="font-mono text-[9px] text-[var(--text-dim)] ml-auto">
            Click outside to close
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main SearchableTerminal ──
export default function SearchableTerminal() {
  const [search, setSearch] = useState('');
  const [modalTicker, setModalTicker] = useState<string | null>(null);

  const q = search.toUpperCase().trim();

  const filteredCategories = Object.entries(CATEGORIES).reduce<Record<string, string[]>>(
    (acc, [cat, tickers]) => {
      const filtered = q
        ? tickers.filter(t => t.includes(q) || cat.toUpperCase().includes(q))
        : tickers;
      if (filtered.length) acc[cat] = filtered;
      return acc;
    },
    {}
  );

  const handleOpen = useCallback((ticker: string) => {
    setModalTicker(ticker);
  }, []);

  const totalVisible = Object.values(filteredCategories).flat().length;

  return (
    <>
      <div className="glass mb-7 overflow-hidden fade-up d4" style={{ border: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-[var(--text-dim)]">
              {totalVisible} tickers · 5 sectors
            </span>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 bg-[var(--surface2)] border border-[var(--border)] rounded px-3 py-1.5">
            <Search size={11} className="text-[var(--text-dim)] shrink-0" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter ticker or sector..."
              className="bg-transparent font-mono text-[11px] tracking-[0.5px] text-[var(--text-bright)] placeholder:text-[var(--text-dim)] outline-none w-44"
            />
            {search && (
              <button onClick={() => setSearch('')}>
                <X size={11} className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-5 divide-x divide-[var(--border)] sector-grid">
          {Object.entries(filteredCategories).map(([cat, tickers]) => {
            const catColor = CATEGORY_COLOR[cat] ?? 'var(--accent)';
            return (
              <div key={cat} className="p-3">
                {/* Category label */}
                <div
                  className="font-mono text-[9px] tracking-[2px] uppercase mb-2.5 pb-1.5 border-b"
                  style={{ color: catColor, borderColor: `${catColor}30` }}
                >
                  {cat}
                </div>
                {/* Ticker rows */}
                <div className="flex flex-col gap-0.5">
                  {tickers.map(t => (
                    <TickerRow
                      key={t}
                      ticker={t}
                      category={cat}
                      onClick={handleOpen}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {Object.keys(filteredCategories).length === 0 && (
            <div className="col-span-5 py-8 text-center font-mono text-[11px] text-[var(--text-dim)]">
              No tickers match &quot;{search}&quot;
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-2 border-t border-[var(--border)] flex items-center gap-4">
          <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-[1px]">
            CLICK TICKER → LIVE CHART
          </span>
          <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-[1px] ml-auto">
            PRICES REFRESH EVERY 60S
          </span>
        </div>
      </div>

      {/* Modal */}
      {modalTicker && (
        <TickerModal ticker={modalTicker} onClose={() => setModalTicker(null)} />
      )}
    </>
  );
}
