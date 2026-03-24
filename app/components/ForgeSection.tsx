export default function ForgeSection() {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d6">
        <span className="w-6 h-px bg-[var(--accent)]" />◆ Forge — Indicator Builder
      </div>
      <div className="glass mb-7 fade-up d6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px]">◆ FORGE</h3>
          <div className="flex gap-1">
            {['Visual', 'Pine Script', 'Python', 'MQL5'].map((tab, i) => (
              <span key={tab} className={`font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer tracking-wider transition-all ${
                i === 1 ? 'bg-[rgba(0,212,255,0.08)] text-[var(--accent2)] border border-[rgba(0,212,255,0.15)]' : 'text-[var(--text-dim)] hover:text-[var(--accent2)]'
              }`}>
                {tab}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2" style={{ minHeight: 220 }}>
          {/* Editor */}
          <div className="p-4 border-r border-[var(--border)] font-mono text-[11px] leading-[1.8] text-[var(--text-dim)]">
            <div><span className="opacity-25 mr-3 select-none">1</span><span className="italic opacity-35">{'// CVD Divergence + Volume Spike'}</span></div>
            <div><span className="opacity-25 mr-3 select-none">2</span><span className="text-[var(--accent2)]">indicator</span>(<span className="text-[var(--gold)]">{'"YP CVD Divergence"'}</span>, overlay=<span className="text-[var(--accent2)]">true</span>)</div>
            <div><span className="opacity-25 mr-3 select-none">3</span></div>
            <div><span className="opacity-25 mr-3 select-none">4</span><span className="text-[var(--accent)]">cvd</span> = <span className="text-[var(--accent2)]">ta.cum</span>(close {'>'} open ? volume : -volume)</div>
            <div><span className="opacity-25 mr-3 select-none">5</span><span className="text-[var(--accent)]">cvd_sma</span> = <span className="text-[var(--accent2)]">ta.sma</span>(cvd, <span className="text-[var(--gold)]">20</span>)</div>
            <div><span className="opacity-25 mr-3 select-none">6</span><span className="text-[var(--accent)]">vol_spike</span> = volume {'>'} <span className="text-[var(--accent2)]">ta.sma</span>(volume, <span className="text-[var(--gold)]">20</span>) * <span className="text-[var(--gold)]">2.0</span></div>
            <div><span className="opacity-25 mr-3 select-none">7</span></div>
            <div><span className="opacity-25 mr-3 select-none">8</span><span className="italic opacity-35">{'// Bearish divergence detection'}</span></div>
            <div><span className="opacity-25 mr-3 select-none">9</span><span className="text-[var(--accent)]">div_bear</span> = <span className="text-[var(--accent2)]">ta.rising</span>(close, <span className="text-[var(--gold)]">5</span>) <span className="text-[var(--accent2)]">and</span> <span className="text-[var(--accent2)]">ta.falling</span>(cvd, <span className="text-[var(--gold)]">5</span>)</div>
          </div>
          {/* Preview */}
          <div className="p-4 flex flex-col gap-2.5">
            <div className="flex-1 bg-[rgba(0,0,0,0.4)] border border-[var(--border)] rounded-lg relative overflow-hidden" style={{ minHeight: 170 }}>
              <svg viewBox="0 0 400 160" fill="none" className="absolute bottom-[10%] left-[5%] w-[90%] h-[70%]">
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff52" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00ff52" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,130 L25,118 L50,105 L75,95 L100,100 L125,82 L150,72 L175,78 L200,60 L225,48 L250,55 L275,38 L300,42 L325,28 L350,32 L375,18 L400,22" stroke="#00ff52" strokeWidth="2" fill="none" />
                <path d="M0,130 L25,118 L50,105 L75,95 L100,100 L125,82 L150,72 L175,78 L200,60 L225,48 L250,55 L275,38 L300,42 L325,28 L350,32 L375,18 L400,22 L400,160 L0,160Z" fill="url(#cg)" />
                <polygon points="279,30 275,22 283,22" fill="#ff3355" />
                <text x="287" y="26" fill="#ff3355" fontSize="8" fontFamily="JetBrains Mono">DIV</text>
              </svg>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="Create a CVD divergence alert with volume spike confirmation"
                readOnly
                className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-md px-3.5 py-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] border-none rounded-md px-3.5 py-2 text-[10px] font-bold text-[var(--bg)] cursor-pointer font-sans whitespace-nowrap">
                ⚡ Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
