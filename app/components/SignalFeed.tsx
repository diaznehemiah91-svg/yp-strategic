import type { SignalItem } from '../lib/mock-data';

const badgeMap: Record<string, string> = {
  DEFENCE: 'badge-def',
  AI: 'badge-ai',
  NUCLEAR: 'badge-nuc',
  CYBER: 'badge-cyber',
  QUANTUM: 'badge-quantum',
  FED: 'badge-fed',
  GEOPOLITICAL: 'badge-geo',
  CRYPTO: 'badge-crypto',
  FUTURES: 'badge-futures',
  MACRO: 'badge-fed',
};

export default function SignalFeed({ signals }: { signals: SignalItem[] }) {
  return (
    <div className="p-5">
      <div className="absolute w-full h-0.5 bg-[rgba(0,255,80,0.08)] animate-[scanDown_4s_linear_infinite] pointer-events-none z-10" />
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px]">◆ SIGNAL WIRE</h3>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-[var(--accent3)] tracking-wider">
          <span className="w-[7px] h-[7px] bg-[var(--accent3)] rounded-full animate-pulse" />
          LIVE
        </div>
      </div>
      {signals.map((s) => (
        <div key={s.id} className="flex gap-3 py-3 border-b border-[rgba(0,255,80,0.06)] last:border-none group cursor-pointer hover:bg-[rgba(0,255,80,0.02)] transition-colors -mx-2 px-2 rounded">
          <div className="font-mono text-[10px] text-[var(--text-dim)] min-w-[48px] pt-0.5">{s.timestamp}</div>
          <div className="flex-1">
            <h4 className="text-xs text-[var(--text-bright)] font-semibold leading-snug mb-1 group-hover:text-[var(--accent)] transition-colors">
              {s.title}
            </h4>
            <p className="text-[11px] text-[var(--text-dim)] leading-snug mb-1.5">{s.summary}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-[9px] px-[7px] py-[2px] rounded-[3px] tracking-wider ${badgeMap[s.category] || 'badge-def'}`}>
                {s.category}
              </span>
              {s.tickers.map(t => (
                <a key={t} href={`/contractor/${t}`} className="font-mono text-[9px] text-[var(--accent)] opacity-60 hover:opacity-100 transition-opacity no-underline">
                  ${t}
                </a>
              ))}
              {s.severity === 'CRITICAL' && (
                <span className="font-mono text-[9px] text-[var(--accent3)] animate-pulse">⚠ CRITICAL</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
