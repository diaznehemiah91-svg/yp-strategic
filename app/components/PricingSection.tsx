const tiers = [
  {
    tier: 'Free', amount: '$0', period: 'forever', featured: false, badge: null,
    feats: ['Signal feed (delayed)', 'Basic BridgePath maps', 'Public Strategic Research briefs', 'Crypto & futures dashboard', 'Limited macro intel'],
    cta: 'Create Free Account',
  },
  {
    tier: 'Pro', amount: '$29', period: '/month', featured: true, badge: 'Most Popular',
    feats: ['Real-time Signal feed', 'Full BridgePath + Forge', 'All research reports', 'Nexus ecosystem map', 'Community indicators', 'Live crypto & futures', 'Fed/macro alerts', 'Geopolitical risk briefings'],
    cta: 'Subscribe →',
  },
  {
    tier: 'Institutional', amount: '—', period: 'Contact for Pricing', featured: false, badge: 'Enterprise',
    feats: ['Everything in Pro', 'Raw data API access', 'Custom research requests', 'Priority signal alerts', 'Dedicated analyst support', 'White-label reports', 'Bulk data export'],
    cta: 'Request Access',
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
          <div key={t.tier} className={`glass p-7 text-center transition-all relative overflow-hidden ${
            t.featured ? 'border-[rgba(0,255,80,0.25)]! shadow-[0_0_60px_rgba(0,255,80,0.06)] bg-[rgba(0,255,80,0.02)]!' : ''
          }`}>
            {/* Tier accent line at top */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${
              t.featured ? 'bg-[var(--accent)]' : t.badge === 'Enterprise' ? 'bg-[var(--accent2)]' : 'bg-[var(--border)]'
            }`} />
            {t.badge && (
              <div className={`inline-block font-mono text-[8px] tracking-[2px] uppercase px-2 py-0.5 rounded mb-3 ${
                t.featured
                  ? 'bg-[rgba(0,255,80,0.1)] text-[var(--accent)] border border-[rgba(0,255,80,0.2)]'
                  : 'bg-[rgba(0,212,255,0.08)] text-[var(--accent2)] border border-[rgba(0,212,255,0.2)]'
              }`}>
                {t.badge}
              </div>
            )}
            <div className={`font-mono text-[10px] tracking-[3px] uppercase mb-2 ${t.featured ? 'text-[var(--accent)]' : 'text-[var(--text-dim)]'}`}>
              {t.tier}
            </div>
            <div className={`font-extrabold text-[var(--text-bright)] mb-1 ${t.amount === '—' ? 'text-[28px] tracking-widest' : 'text-[40px]'}`}>{t.amount}</div>
            <div className="font-mono text-[10px] text-[var(--text-dim)] mb-5">{t.period}</div>
            <ul className="text-left text-xs text-[var(--text-dim)] mb-5 space-y-1 list-none">
              {t.feats.map((f) => (
                <li key={f} className="flex items-center gap-2 py-1">
                  <span className={t.featured ? 'text-[var(--accent)]' : t.badge === 'Enterprise' ? 'text-[var(--accent2)]' : 'text-[var(--text-dim)]'}>›</span>
                  {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 font-mono text-[10px] tracking-[1.5px] uppercase rounded cursor-pointer transition-all ${
              t.featured
                ? 'bg-[var(--accent)] text-[var(--bg)] border-[var(--accent)] font-semibold border'
                : t.badge === 'Enterprise'
                  ? 'bg-transparent text-[var(--accent2)] border border-[rgba(0,212,255,0.3)] hover:border-[var(--accent2)] hover:bg-[rgba(0,212,255,0.06)]'
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
