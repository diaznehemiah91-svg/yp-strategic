'use client';

import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import useSWR from 'swr';
import { getMockContractor } from '@/app/lib/mock-data';
import MiniChart from './MiniChart';
import SearchTerminal from './SearchTerminal';

interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct?: number;
  sector?: string;
  volume?: number;
  marketCap?: number;
}

interface Signal {
  id: string;
  title: string;
  summary: string;
  source: string;
  category: string;
  severity: string;
  tickers: string[];
  timestamp: string;
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'bg-[rgba(255,51,85,0.15)] text-[var(--accent3)]',
  ALERT: 'bg-[rgba(240,192,64,0.15)] text-[var(--gold)]',
  INFO: 'bg-[rgba(0,212,255,0.12)] text-[var(--accent2)]',
};

const CAT_COLOR: Record<string, string> = {
  DEFENCE: 'text-[var(--accent3)]',
  CYBER: 'text-purple-400',
  QUANTUM: 'text-[var(--accent2)]',
  AI: 'text-blue-400',
  NUCLEAR: 'text-[var(--gold)]',
  GEOPOLITICAL: 'text-orange-400',
  SPACE: 'text-violet-400',
  FED: 'text-[var(--accent)]',
};

function computeSentiment(ticker: string, signals: Signal[]) {
  const matching = signals.filter(s => s.tickers.includes(ticker));
  if (!matching.length) return null;
  const score = matching.reduce((acc, s) => {
    if (s.severity === 'CRITICAL') return acc + 3;
    if (s.severity === 'ALERT') return acc + 2;
    return acc + 1;
  }, 0);
  return Math.min(100, Math.round((score / (matching.length * 3)) * 100 * 1.4));
}

function SentimentBar({ score }: { score: number }) {
  const label = score >= 75 ? 'BULLISH' : score >= 45 ? 'NEUTRAL' : 'BEARISH';
  const color = score >= 75 ? 'var(--accent)' : score >= 45 ? 'var(--gold)' : 'var(--accent3)';
  const filled = Math.round(score / 10);
  return (
    <div className="space-y-1">
      <div className="flex justify-between">
        <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)]">SIGNAL SENTIMENT</span>
        <span className="font-mono text-[9px]" style={{ color }}>{label} {score}/100</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-sm"
            style={{ background: i < filled ? color : 'var(--border)' }}
          />
        ))}
      </div>
    </div>
  );
}

function TickerModal({
  ticker,
  stock,
  signals,
  onClose,
}: {
  ticker: string;
  stock: Stock | null;
  signals: Signal[];
  onClose: () => void;
}) {
  const { data: live } = useSWR(
    `/api/stock-price?symbol=${ticker}`,
    fetcher,
    { refreshInterval: 60000 }
  );

  const displayPrice = live?.price ?? stock?.price ?? 0;
  const displayChange = live?.change ?? stock?.change ?? 0;
  const displayChangePct = live?.changePercent ?? stock?.changePct ?? 0;
  const isLive = !!live && !live.mock;
  const isUp = displayChangePct >= 0;

  const contractor = getMockContractor(ticker);
  const relatedSignals = signals.filter(s => s.tickers.includes(ticker)).slice(0, 4);
  const sentimentScore = computeSentiment(ticker, signals);
  const latestContract = contractor?.recentContracts?.[0];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="glass relative w-full max-w-lg max-h-[90vh] overflow-y-auto"
        style={{ border: '1px solid var(--border-bright)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-[var(--border)]"
          style={{ background: 'var(--surface)' }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)] tracking-[2px]">
                {ticker}
              </span>
              {contractor?.sector && (
                <span className="font-mono text-[9px] tracking-[1.5px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-dim)]">
                  {contractor.sector.toUpperCase()}
                </span>
              )}
              {isLive && (
                <span className="flex items-center gap-1 font-mono text-[9px] text-[var(--accent)] tracking-[1px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
            <p className="font-mono text-[11px] text-[var(--text-dim)] mt-0.5">
              {contractor?.name ?? stock?.name ?? ticker}
            </p>
          </div>
          <button onClick={onClose} className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* ── Price ── */}
          <div className="flex items-end gap-3">
            <span className="font-mono text-3xl font-bold text-[var(--text-bright)]">
              ${displayPrice.toFixed(2)}
            </span>
            <span className={`font-mono text-base font-semibold ${isUp ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
              {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{displayChange.toFixed(2)} ({isUp ? '+' : ''}{displayChangePct.toFixed(2)}%)
            </span>
            {stock?.marketCap && (
              <span className="font-mono text-[10px] text-[var(--text-dim)] ml-auto">
                MCap ${(stock.marketCap / 1e9).toFixed(1)}B
              </span>
            )}
          </div>

          {/* ── Chart ── */}
          <div className="rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
            <div className="px-3 pt-2 pb-1">
              <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)]">7-DAY PRICE</span>
            </div>
            <MiniChart price={displayPrice} change={displayChange} height={120} />
          </div>

          {/* ── Latest Contract ── */}
          {latestContract && (
            <div className="p-3 rounded space-y-1" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)]">LATEST CONTRACT</span>
              <p className="font-mono text-[12px] text-[var(--text-bright)] leading-snug">{latestContract.title}</p>
              <div className="flex gap-3 mt-1">
                <span className="font-mono text-[11px] text-[var(--accent)] font-bold">{latestContract.value}</span>
                <span className="font-mono text-[10px] text-[var(--text-dim)]">{latestContract.agency}</span>
                <span className="font-mono text-[10px] text-[var(--text-dim)] ml-auto">{latestContract.date}</span>
              </div>
            </div>
          )}

          {/* ── Sentiment ── */}
          {sentimentScore !== null && (
            <div className="p-3 rounded" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <SentimentBar score={sentimentScore} />
            </div>
          )}

          {/* ── BridgePath ── */}
          {contractor && (
            <div className="p-3 rounded space-y-2" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
              <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)]">BRIDGEPATH</span>
              <p className="font-mono text-[11px] text-[var(--text)] leading-relaxed">{contractor.description}</p>
              {contractor.relatedTickers.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {contractor.relatedTickers.map(t => (
                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded cursor-pointer hover:border-[var(--accent)] transition-colors"
                      style={{ border: '1px solid var(--border)', color: 'var(--accent2)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Signals ── */}
          {relatedSignals.length > 0 && (
            <div className="space-y-2">
              <span className="font-mono text-[9px] tracking-[2px] text-[var(--text-dim)]">RECENT SIGNALS</span>
              {relatedSignals.map(s => (
                <div key={s.id} className="p-3 rounded" style={{ background: 'var(--surface2)', border: '1px solid var(--border)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-mono text-[9px] tracking-[1px] ${CAT_COLOR[s.category] ?? 'text-[var(--text-dim)]'}`}>
                      {s.category}
                    </span>
                    <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_COLOR[s.severity] ?? ''}`}>
                      {s.severity}
                    </span>
                    <span className="font-mono text-[9px] text-[var(--text-dim)] ml-auto">{s.timestamp}</span>
                  </div>
                  <p className="font-mono text-[11px] text-[var(--text)] leading-snug">{s.title}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Footer ── */}
          <p className="font-mono text-[9px] text-[var(--text-dim)] text-center tracking-[1px]">
            DATA: {isLive ? 'FINNHUB (REAL-TIME)' : 'YP STRATEGIC RESEARCH (MOCK)'} · UPDATES EVERY 60S
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DashboardClient({
  stocks,
  signals,
}: {
  stocks: Stock[];
  signals: Signal[];
  crypto: any[];
  futures: any[];
  fedUpdates: any[];
  geoRisk: any[];
}) {
  const [modalTicker, setModalTicker] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  const modalStock = modalTicker ? stocks.find(s => s.ticker === modalTicker) ?? null : null;

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const openModal = useCallback((ticker: string) => {
    setModalTicker(ticker);
    setSearchOpen(false);
  }, []);

  // ── Column groupings ──
  const cyberSpace = stocks.filter(s =>
    ['CRWD', 'PANW', 'FTNT', 'S', 'ZS', 'TENB', 'VRNS',
     'RKLB', 'KTOS', 'ASTS', 'LUNR', 'IRDM', 'PL'].includes(s.ticker)
  );
  const defencePrimes = stocks.filter(s =>
    ['LMT', 'RTX', 'NOC', 'GD', 'BA', 'HII', 'LHX', 'TDG', 'TXT', 'HEI',
     'PLTR', 'LDOS', 'SAIC', 'CACI', 'BAH', 'PSN'].includes(s.ticker)
  );
  const semisAndTech = stocks.filter(s =>
    ['NVDA', 'AMD', 'INTC', 'QCOM', 'AVGO', 'MRVL', 'AMAT', 'TXN',
     'IONQ', 'RGTI', 'QUBT', 'QBTS', 'IBM',
     'OKLO', 'NNE', 'CEG', 'SMR', 'CCJ', 'UEC', 'BWXT', 'AXON'].includes(s.ticker)
  );
  const signalCards = signals.slice(0, 15);

  const StockCard = ({ stock }: { stock: Stock }) => {
    const pct = stock.changePct ?? stock.change;
    const up = pct >= 0;
    return (
      <div
        onClick={() => openModal(stock.ticker)}
        className="cursor-pointer rounded-lg p-3 transition-all duration-150"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border-bright)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border)';
          (e.currentTarget as HTMLDivElement).style.transform = '';
        }}
      >
        <div className="flex justify-between items-start mb-1.5">
          <div>
            <p className="font-mono text-[13px] font-bold text-[var(--accent)] tracking-[1px]">{stock.ticker}</p>
            <p className="font-mono text-[10px] text-[var(--text-dim)] truncate max-w-[120px]">{stock.name}</p>
          </div>
          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${up ? 'bg-[rgba(0,255,82,0.1)] text-[var(--accent)]' : 'bg-[rgba(255,51,85,0.1)] text-[var(--accent3)]'}`}>
            {up ? '+' : ''}{pct?.toFixed(2)}%
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-[14px] font-semibold text-[var(--text-bright)]">${stock.price?.toFixed(2)}</span>
          <span className={`text-sm ${up ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>{up ? '▲' : '▼'}</span>
        </div>
        {stock.sector && (
          <p className="font-mono text-[9px] text-[var(--text-dim)] mt-1 truncate tracking-[0.5px]">{stock.sector}</p>
        )}
      </div>
    );
  };

  const SignalCard = ({ signal }: { signal: Signal }) => (
    <div
      className="rounded-lg p-3 transition-all cursor-pointer"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border-bright)'}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.border = '1px solid var(--border)'}
      onClick={() => signal.tickers[0] && openModal(signal.tickers[0])}
    >
      <div className="flex justify-between items-start mb-1.5">
        <p className={`font-mono text-[9px] tracking-[1px] font-semibold ${CAT_COLOR[signal.category] ?? 'text-[var(--text-dim)]'}`}>
          {signal.category}
        </p>
        <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${SEVERITY_COLOR[signal.severity] ?? ''}`}>
          {signal.severity}
        </span>
      </div>
      <p className="font-mono text-[11px] text-[var(--text)] leading-snug line-clamp-2">{signal.title}</p>
      <p className="font-mono text-[9px] text-[var(--text-dim)] mt-1">{signal.source} · {signal.timestamp}</p>
    </div>
  );

  const Column = ({
    title,
    subtitle,
    items,
    isSignal,
    badge,
  }: {
    title: string;
    subtitle: string;
    items: any[];
    isSignal: boolean;
    badge?: string;
  }) => (
    <div className="space-y-3">
      <div className="pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 mb-0.5">
          <h2 className="font-mono text-[13px] font-bold text-[var(--text-bright)] tracking-[2px] uppercase">{title}</h2>
          {badge && (
            <span className="font-mono text-[9px] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--accent2)]">
              {badge}
            </span>
          )}
        </div>
        <p className="font-mono text-[10px] text-[var(--accent)] tracking-[0.5px]">{subtitle}</p>
      </div>
      <div className="space-y-2">
        {items.map(item =>
          isSignal
            ? <SignalCard key={item.id} signal={item} />
            : <StockCard key={item.ticker} stock={item} />
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Internal nav bar ── */}
      <div
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3 mb-4 backdrop-blur-md"
        style={{ background: 'rgba(2,3,4,0.85)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
          <span className="font-mono text-[11px] font-bold text-[var(--accent)] tracking-[2px]">
            ypstrategicresearch.com
          </span>
          <span className="font-mono text-[9px] px-2 py-0.5 rounded border border-[var(--border)] text-[var(--text-dim)] tracking-[1px]">
            RESEARCH
          </span>
        </div>

        <div className="hidden md:flex items-center gap-5">
          {['STOCKS', 'SCREENERS', 'FUTURES', 'CRYPTO', 'NEWS'].map(tab => (
            <button key={tab} className="font-mono text-[10px] tracking-[1.5px] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors">
              {tab}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[1px] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors px-3 py-1.5 rounded"
          style={{ border: '1px solid var(--border)' }}
        >
          <span>⌘K</span>
          <span className="hidden sm:inline">SEARCH</span>
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Column title="CYBER & SPACE" subtitle="Cybersecurity · Space · Launch" items={cyberSpace} isSignal={false} badge={`${cyberSpace.length}`} />
          <Column title="DEFENCE PRIMES" subtitle="Primes · Defence IT · Services" items={defencePrimes} isSignal={false} badge={`${defencePrimes.length}`} />
          <Column title="SEMIS & TECH" subtitle="Semiconductors · Quantum · Nuclear" items={semisAndTech} isSignal={false} badge={`${semisAndTech.length}`} />
          <Column title="NEWS & SIGNALS" subtitle="Intelligence · Alerts · Events" items={signalCards} isSignal={true} badge={`${signalCards.length}`} />
        </div>
      </div>

      {/* ── Search Terminal ── */}
      <SearchTerminal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* ── Ticker Modal ── */}
      {modalTicker && (
        <TickerModal
          ticker={modalTicker}
          stock={modalStock}
          signals={signals}
          onClose={() => setModalTicker(null)}
        />
      )}
    </>
  );
}
