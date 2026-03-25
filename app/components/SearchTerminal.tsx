'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search } from 'lucide-react';
import { getMockStocks, getMockSignals } from '@/app/lib/mock-data';

interface StockResult {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  sector: string;
}

interface SignalResult {
  id: string;
  title: string;
  category: string;
  severity: string;
  tickers: string[];
}

interface Props {
  open: boolean;
  onClose: () => void;
}

const ALL_STOCKS = getMockStocks();
const ALL_SIGNALS = getMockSignals();

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'text-[var(--accent3)]',
  ALERT: 'text-[var(--gold)]',
  INFO: 'text-[var(--accent2)]',
};

export default function SearchTerminal({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const q = query.toUpperCase().trim();

  const stockResults: StockResult[] = q
    ? ALL_STOCKS.filter(
        s =>
          s.ticker.includes(q) ||
          s.name.toUpperCase().includes(q) ||
          s.sector.toUpperCase().includes(q)
      ).slice(0, 6)
    : ALL_STOCKS.slice(0, 6);

  const signalResults: SignalResult[] = q
    ? ALL_SIGNALS.filter(
        s =>
          s.tickers.some(t => t.includes(q)) ||
          s.title.toUpperCase().includes(q) ||
          s.category.includes(q)
      ).slice(0, 3)
    : [];

  const handleSelect = (ticker: string) => {
    router.push(`/contractor/${ticker}`);
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh]"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="glass relative w-full max-w-xl mx-4 overflow-hidden"
        style={{ border: '1px solid var(--border-bright)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search size={14} className="text-[var(--accent)] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="SEARCH TICKER OR COMPANY..."
            className="flex-1 bg-transparent font-mono text-[13px] tracking-[1px] uppercase text-[var(--text-bright)] placeholder:text-[var(--text-dim)] outline-none"
          />
          <button onClick={onClose}>
            <X size={14} className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors" />
          </button>
        </div>

        {/* Stock results */}
        <div className="p-2">
          {stockResults.map(s => {
            const up = s.changePct >= 0;
            return (
              <button
                key={s.ticker}
                onClick={() => handleSelect(s.ticker)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded hover:bg-[var(--surface2)] transition-all group text-left"
              >
                <span className="font-mono text-[13px] font-bold text-[var(--accent)] w-14 shrink-0">
                  {s.ticker}
                </span>
                <span className="font-mono text-[11px] text-[var(--text)] flex-1 truncate group-hover:text-[var(--text-bright)]">
                  {s.name}
                </span>
                <span className="font-mono text-[12px] text-[var(--text-dim)] w-20 text-right shrink-0">
                  ${s.price.toFixed(2)}
                </span>
                <span
                  className={`font-mono text-[11px] w-16 text-right shrink-0 ${up ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}
                >
                  {up ? '▲' : '▼'} {Math.abs(s.changePct).toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Signal results */}
        {signalResults.length > 0 && (
          <>
            <div className="px-4 py-1.5 border-t border-[var(--border)]">
              <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)] uppercase">
                Signals
              </span>
            </div>
            <div className="pb-2 px-2">
              {signalResults.map(s => (
                <button
                  key={s.id}
                  onClick={() => s.tickers[0] && handleSelect(s.tickers[0])}
                  className="w-full flex items-start gap-3 px-3 py-2 rounded hover:bg-[var(--surface2)] transition-all text-left"
                >
                  <span className={`font-mono text-[9px] tracking-[1px] w-14 shrink-0 pt-0.5 ${SEVERITY_COLOR[s.severity] ?? 'text-[var(--text-dim)]'}`}>
                    {s.severity}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--text)] leading-snug flex-1">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* Footer hint */}
        <div className="px-4 py-2 border-t border-[var(--border)] flex gap-4">
          <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-[1px]">
            ↵ OPEN · ESC CLOSE
          </span>
          <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-[1px] ml-auto">
            {ALL_STOCKS.length} TICKERS INDEXED
          </span>
        </div>
      </div>
    </div>
  );
}
