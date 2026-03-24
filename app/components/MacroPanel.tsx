import type { FedUpdate } from '../lib/mock-data';

const typeIcons: Record<string, string> = {
  RATE_DECISION: '🏛️',
  SPEECH: '🎤',
  MINUTES: '📋',
  CPI: '📊',
  PPI: '📊',
  JOBS: '💼',
  DOT_PLOT: '🎯',
};

export default function MacroPanel({ fedUpdates }: { fedUpdates: FedUpdate[] }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px]">◆ FED / MACRO</h3>
        <span className="font-mono text-[9px] text-[var(--text-dim)] tracking-wider">FOMC</span>
      </div>

      {/* Rate Dashboard */}
      <div className="bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-lg p-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[10px] text-[var(--text-dim)] tracking-wider">FED FUNDS RATE</span>
          <span className="font-mono text-lg font-bold text-[var(--text-bright)]">4.25-4.50%</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)]">
          <span>Next FOMC: May 6-7</span>
          <span>Cut Prob: <span className="text-[var(--accent3)]">15%</span> Jun</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono text-[var(--text-dim)] mt-1">
          <span>Core PCE: 2.6% YoY</span>
          <span>Dot Plot Median: 2 cuts 2026</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {fedUpdates.map((f) => (
          <div key={f.id} className="flex gap-2.5 py-2 border-b border-[rgba(0,255,80,0.06)] last:border-none cursor-pointer hover:bg-[rgba(0,255,80,0.02)] -mx-2 px-2 rounded transition-colors">
            <span className="text-sm mt-0.5">{typeIcons[f.type] || '📌'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="text-[11px] text-[var(--text-bright)] font-semibold truncate">{f.title}</h4>
              </div>
              <p className="text-[10px] text-[var(--text-dim)] leading-snug line-clamp-2">{f.summary}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[9px] badge-fed px-1.5 py-0.5 rounded">{f.type.replace('_', ' ')}</span>
                <span className={`font-mono text-[9px] font-semibold sentiment-${f.sentiment.toLowerCase()}`}>
                  {f.sentiment}
                </span>
                <span className="font-mono text-[9px] text-[var(--text-dim)]">{f.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
