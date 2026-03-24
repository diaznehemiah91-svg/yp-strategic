const proxyMaps = [
  { target: 'Anduril', proxies: ['PLTR', 'AXON', 'RTX', 'NVDA'] },
  { target: 'Scale AI', proxies: ['AMZN', 'MSFT', 'NVDA'] },
  { target: 'Shield AI', proxies: ['BA', 'NOC', 'PLTR'] },
  { target: 'SpaceX', proxies: ['RKLB', 'BA', 'LMT'] },
  { target: 'Rebellion Defence', proxies: ['PLTR', 'CRWD', 'LDOS'] },
  { target: 'Hadrian', proxies: ['GD', 'LMT', 'RTX'] },
];

export default function BridgePath() {
  return (
    <div className="p-5 border-l border-[var(--border)]">
      <h3 className="font-mono text-[11px] tracking-[2px] text-[var(--accent2)] mb-3.5">◆ BRIDGEPATH</h3>
      {proxyMaps.map((pm) => (
        <div key={pm.target} className="bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-lg p-3 mb-2.5 hover:border-[var(--border-bright)] transition-colors cursor-pointer">
          <div className="text-xs font-bold text-[var(--text-bright)] mb-1.5">
            {pm.target}
            <span className="text-[9px] text-[var(--accent3)] bg-[rgba(255,51,85,0.08)] px-1.5 py-0.5 rounded ml-1.5 font-normal">PRIVATE</span>
          </div>
          <div className="text-[10px] text-[var(--text-dim)] mb-1.5">Public Proxy Exposure →</div>
          <div className="flex gap-1.5 flex-wrap">
            {pm.proxies.map(p => (
              <a key={p} href={`/contractor/${p}`} className="font-mono text-[10px] px-2 py-0.5 rounded bg-[rgba(0,255,80,0.06)] text-[var(--accent)] border border-[rgba(0,255,80,0.1)] no-underline hover:bg-[rgba(0,255,80,0.12)] transition-colors">
                {p}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
