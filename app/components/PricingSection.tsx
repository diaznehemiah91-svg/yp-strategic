const tiers = [
  {
    tier: 'Free', amount: '$0', period: 'forever', featured: false,
    feats: ['Signal feed (delayed)', 'Basic BridgePath maps', 'Public Strategic Research briefs', 'Crypto & futures dashboard', 'Limited macro intel'],
    cta: 'Get Started',
  },
  {
    tier: 'Pro', amount: '$29', period: '/month', featured: true,
    feats: ['Real-time Signal feed', 'Full BridgePath + Forge', 'All research reports', 'Nexus ecosystem map', 'Community indicators', 'Live crypto & futures', 'Fed/macro alerts', 'Geopolitical risk briefings'],
    cta: 'Subscribe →',
  },
  {
    tier: 'Institutional', amount: '$199', period: '/month', featured: false,
    feats: ['Everything in Pro', 'Raw data API access', 'Custom research requests', 'Priority signal alerts', 'Dedicated analyst support', 'White-label reports', 'Bulk data export'],
    cta: 'Contact Sales',
  },
];

export default function PricingSection() {
  return (
    <>
      <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] mb-4 flex items-center gap-2 fade-up d6">
        <span className="w-6 h-px bg-[var(--accent)]" />◆ Intel Vault — Membership
      </div>
      <div className="grid grid-cols-3 gap-3.5 mb-7 pricing-grid fade-up d6">
        {tiers.map((t) => (
          <div key={t.tier} className={`glass p-7 text-center transition-all ${
            t.featured ? 'border-[rgba(0,255,80,0.25)]! shadow-[0_0_60px_rgba(0,255,80,0.06)] bg-[rgba(0,255,80,0.02)]!' : ''
          }`}>
            <div className={`font-mono text-[10px] tracking-[3px] uppercase mb-2 ${t.featured ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>
              {t.tier}
            </div>
            <div className="text-[40px] font-extrabold text-[var(--text-bright)] mb-1">{t.amount}</div>
            <div className="font-mono text-[10px] text-[var(--text-dim)] mb-5">{t.period}</div>
            <ul className="text-left text-xs text-[var(--text-dim)] mb-5 space-y-1 list-none">
              {t.feats.map((f) => (
                <li key={f} className="flex items-center gap-2 py-1">
                  <span className={t.featured ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}>›</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 font-mono text-[10px] tracking-[1.5px] uppercase rounded cursor-pointer transition-all ${
              t.featured
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold border'
                : 'bg-transparent text-[var(--text-dim)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}>
              {t.cta}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
