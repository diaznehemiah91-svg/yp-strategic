export default function NexusSection() {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d6">
        <span className="w-6 h-px bg-[var(--accent)]" />◆ Nexus — Ecosystem Map
      </div>
      <div className="glass mb-7 fade-up d6">
        <div className="px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px]">◆ DEFENCE-TECH ECOSYSTEM</h3>
        </div>
        <div className="relative" style={{ minHeight: 220, padding: 20 }}>
          <svg className="absolute inset-0 z-[1]" viewBox="0 0 800 200" preserveAspectRatio="none">
            {[
              [100, 35, 260, 105], [260, 105, 440, 45], [440, 45, 610, 75],
              [100, 35, 440, 45], [260, 105, 370, 140], [370, 140, 560, 180],
              [130, 170, 260, 105], [610, 75, 560, 180], [440, 45, 370, 140],
            ].map(([x1, y1, x2, y2], i) => (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(0,255,80,0.06)" strokeWidth="1"
                strokeDasharray="4,6"
                style={{ animation: 'dashAnim 4s linear infinite' }}
              />
            ))}
          </svg>
          {[
            { label: 'DoD / IC', cls: 'bg-[rgba(0,255,80,0.05)] border-[rgba(0,255,80,0.2)] text-[var(--accent)]', pos: 'top-[15px] left-[8%]' },
            { label: 'Lockheed · RTX · NOC', cls: 'bg-[rgba(0,212,255,0.05)] border-[rgba(0,212,255,0.2)] text-[var(--accent2)]', pos: 'top-[85px] left-[28%]' },
            { label: 'Palantir · Anduril · Scale', cls: 'bg-[rgba(255,184,0,0.05)] border-[rgba(255,184,0,0.2)] text-[var(--gold)]', pos: 'top-[25px] left-[52%]' },
            { label: 'AWS GovCloud · Azure', cls: 'bg-[rgba(168,130,255,0.05)] border-[rgba(168,130,255,0.2)] text-[#a882ff]', pos: 'top-[120px] left-[42%]' },
            { label: 'CrowdStrike · SentinelOne', cls: 'bg-[rgba(255,51,85,0.05)] border-[rgba(255,51,85,0.2)] text-[var(--accent3)]', pos: 'top-[55px] left-[73%]' },
            { label: 'IonQ · Rigetti · IBM Q', cls: 'bg-[rgba(0,255,200,0.05)] border-[rgba(0,255,200,0.2)] text-[#00ffc8]', pos: 'top-[150px] left-[14%]' },
            { label: 'Oklo · NuScale · Kairos', cls: 'bg-[rgba(255,100,50,0.05)] border-[rgba(255,100,50,0.2)] text-[#ff6432]', pos: 'top-[160px] left-[65%]' },
          ].map((node) => (
            <div key={node.label} className={`absolute px-3.5 py-1.5 rounded font-mono text-[10px] font-medium border cursor-pointer transition-all hover:scale-110 hover:shadow-[var(--glow)] z-[2] backdrop-blur-sm ${node.cls} ${node.pos}`}>
              {node.label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
