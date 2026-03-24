import type { GeoRiskEvent } from '../lib/mock-data';

const sevColor = (sev: number) => {
  if (sev >= 8) return 'text-[var(--accent3)]';
  if (sev >= 6) return 'text-[var(--gold)]';
  return 'text-[var(--accent2)]';
};

const sevBg = (sev: number) => {
  if (sev >= 8) return 'bg-[rgba(255,51,85,0.08)] border-[rgba(255,51,85,0.2)]';
  if (sev >= 6) return 'bg-[rgba(240,192,64,0.08)] border-[rgba(240,192,64,0.2)]';
  return 'bg-[rgba(0,212,255,0.08)] border-[rgba(0,212,255,0.2)]';
};

export default function GeoRiskPanel({ events }: { events: GeoRiskEvent[] }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[#ff6432] tracking-[2px]">◆ GEOPOLITICAL RISK</h3>
        <span className="font-mono text-[9px] text-[var(--accent3)] tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-[var(--accent3)] rounded-full animate-pulse" />
          THREAT LEVEL: ELEVATED
        </span>
      </div>

      {/* Global Risk Index */}
      <div className="bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-wider">GLOBAL RISK INDEX</span>
          <span className="font-mono text-lg font-bold text-[var(--accent3)]">7.4 / 10</span>
        </div>
        <div className="w-full h-2 bg-[rgba(0,0,0,0.5)] rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--gold)] to-[var(--accent3)]" style={{ width: '74%' }} />
        </div>
        <div className="flex justify-between text-[9px] font-mono text-[var(--text-dim)] mt-1">
          <span>LOW</span>
          <span>MODERATE</span>
          <span>HIGH</span>
          <span>CRITICAL</span>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-2">
        {events.map((e) => (
          <div key={e.id} className="py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none cursor-pointer hover:bg-[rgba(0,255,80,0.02)] -mx-2 px-2 rounded transition-colors">
            <div className="flex items-start justify-between mb-1">
              <h4 className="text-[11px] text-[var(--text-bright)] font-semibold leading-snug flex-1 pr-2">{e.title}</h4>
              <span className={`font-mono text-[10px] font-bold ${sevColor(e.severity)} shrink-0`}>
                SEV {e.severity}
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-dim)] leading-snug mb-1.5 line-clamp-2">{e.summary}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${sevBg(e.severity)}`}>
                {e.category}
              </span>
              <span className="font-mono text-[9px] text-[var(--text-dim)]">{e.region}</span>
              {e.impactTickers.slice(0, 4).map(t => (
                <a key={t} href={`/contractor/${t}`} className="font-mono text-[9px] text-[var(--accent)] opacity-60 hover:opacity-100 no-underline transition-opacity">
                  ${t}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
