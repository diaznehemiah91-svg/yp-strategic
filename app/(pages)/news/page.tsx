import NewsGlobe from '@/app/components/NewsGlobe'
import NavBar from '@/app/components/NavBar'

export const revalidate = 60

export default function NewsPage() {
  return (
    <>
      <div className="relative z-10 max-w-[1400px] mx-auto px-5 pt-6 pb-20">
        {/* NAV */}
        <NavBar />

        {/* HEADER */}
        <div className="text-center py-12 fade-up d1">
          <div className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] border border-[rgba(0,255,80,0.2)] px-3.5 py-1.5 rounded-full bg-[rgba(0,255,80,0.04)] mb-5">
            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
            Global Intelligence Network
          </div>

          <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-2">
            Global News Intelligence
          </h1>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mb-8">
            Real-Time Geopolitical • Defence • Economic Intelligence
          </p>
          <p className="text-sm text-[var(--text)] max-w-2xl mx-auto">
            Monitor critical events worldwide with real-time news aggregation from 12+ premium intelligence sources. Track geopolitical risks, defence spending, and market-moving events on an interactive 3D globe.
          </p>
        </div>

        {/* NEWS GLOBE */}
        <div className="fade-up d2 mb-16">
          <NewsGlobe />
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-up d3">
          <div className="glass p-6">
            <h3 className="text-[var(--accent)] font-bold mb-3 uppercase text-xs tracking-widest">🌍 Global Coverage</h3>
            <p className="text-sm text-[var(--text-dim)]">
              Monitor events across 6 continents with geolocation markers on interactive map. Track regional conflicts, policy changes, and market impacts in real-time.
            </p>
          </div>

          <div className="glass p-6">
            <h3 className="text-[var(--accent2)] font-bold mb-3 uppercase text-xs tracking-widest">⚡ Multi-Source Feed</h3>
            <p className="text-sm text-[var(--text-dim)]">
              Aggregated from Bloomberg, Reuters, NEXTA, WSJ, Guardian, and 7+ specialized intelligence sources. Cross-referenced for accuracy and context.
            </p>
          </div>

          <div className="glass p-6">
            <h3 className="text-[var(--gold)] font-bold mb-3 uppercase text-xs tracking-widest">🎯 Smart Filtering</h3>
            <p className="text-sm text-[var(--text-dim)]">
              Filter by severity (Critical/High/Low), category (Geopolitics/Defence/Markets), and region. Set custom alerts for your watchlist.
            </p>
          </div>
        </div>

        {/* SEVERITY LEGEND */}
        <div className="mt-16 glass p-8 fade-up d4">
          <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">Alert Severity Levels</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Critical */}
            <div className="border-l-4 border-[#ff3232] bg-[rgba(255,50,50,0.05)] p-6 rounded">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-[#ff3232] rounded-full"></div>
                <h3 className="text-[#ff3232] font-bold uppercase text-sm tracking-widest">CRITICAL</h3>
              </div>
              <p className="text-sm text-[var(--text-dim)]">
                Immediate threats to markets or geopolitical stability. Armed conflicts, cyber attacks, major policy announcements.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-dim)]">
                <li>• Major military escalations</li>
                <li>• Cyber warfare incidents</li>
                <li>• Emergency policy decisions</li>
                <li>• Market circuit breakers</li>
              </ul>
            </div>

            {/* High */}
            <div className="border-l-4 border-[#ffa500] bg-[rgba(255,165,0,0.05)] p-6 rounded">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-[#ffa500] rounded-full"></div>
                <h3 className="text-[#ffa500] font-bold uppercase text-sm tracking-widest">HIGH</h3>
              </div>
              <p className="text-sm text-[var(--text-dim)]">
                Significant events with market or geopolitical implications. Economic data, defence contracts, diplomatic tensions.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-dim)]">
                <li>• Defence spending increases</li>
                <li>• Major contract awards</li>
                <li>• Regional tensions</li>
                <li>• Economic data releases</li>
              </ul>
            </div>

            {/* Low */}
            <div className="border-l-4 border-[#00c896] bg-[rgba(0,200,150,0.05)] p-6 rounded">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-4 h-4 bg-[#00c896] rounded-full"></div>
                <h3 className="text-[#00c896] font-bold uppercase text-sm tracking-widest">LOW</h3>
              </div>
              <p className="text-sm text-[var(--text-dim)]">
                Updates and developments with lesser immediate impact. Market commentary, earnings reports, policy proposals.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-[var(--text-dim)]">
                <li>• Earnings announcements</li>
                <li>• Market updates</li>
                <li>• Policy discussions</li>
                <li>• Analyst reports</li>
              </ul>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="mt-16 glass p-8 fade-up d5">
          <h2 className="text-2xl font-black text-white mb-8 uppercase tracking-tighter">How to Use This Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-[var(--accent)] font-bold mb-4 uppercase text-sm tracking-widest">1. Monitor Global Events</h3>
              <p className="text-sm text-[var(--text-dim)] mb-4">
                The 3D globe displays all major news events in real-time. Larger markers indicate higher severity events. Rotate the globe to explore different regions.
              </p>

              <h3 className="text-[var(--accent)] font-bold mb-4 uppercase text-sm tracking-widest">2. Filter by Severity</h3>
              <p className="text-sm text-[var(--text-dim)]">
                Use the filter buttons to focus on Critical, High, or Low priority events. All Events shows the complete feed across all severity levels.
              </p>
            </div>

            <div>
              <h3 className="text-[var(--accent)] font-bold mb-4 uppercase text-sm tracking-widest">3. Read Full Analysis</h3>
              <p className="text-sm text-[var(--text-dim)] mb-4">
                Click on any news item to read the full article, source attribution, and related market impact. Most items link to original sources.
              </p>

              <h3 className="text-[var(--accent)] font-bold mb-4 uppercase text-sm tracking-widest">4. Set Custom Alerts</h3>
              <p className="text-sm text-[var(--text-dim)]">
                Create alerts for specific regions, categories, or sources. Receive notifications when critical events are published that match your watchlist.
              </p>
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 fade-up d6">
          {[
            { emoji: '⚔️', label: 'Geopolitics', count: '142 this week' },
            { emoji: '🛡️', label: 'Defence', count: '87 this week' },
            { emoji: '💻', label: 'Cyber', count: '34 this week' },
            { emoji: '💰', label: 'Markets', count: '256 this week' },
            { emoji: '🤖', label: 'AI/Tech', count: '118 this week' },
            { emoji: '📊', label: 'Contracts', count: '45 this week' },
            { emoji: '🌐', label: 'Trade', count: '72 this week' },
            { emoji: '⚡', label: 'Energy', count: '63 this week' },
          ].map((cat) => (
            <div key={cat.label} className="glass p-4 text-center hover:bg-[rgba(0,255,80,0.1)] transition-all cursor-pointer">
              <div className="text-3xl mb-2">{cat.emoji}</div>
              <h4 className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-1">
                {cat.label}
              </h4>
              <p className="text-[9px] text-[var(--text-dim)]">{cat.count}</p>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-center text-[10px] text-[var(--text-dim)] uppercase tracking-widest">
          <p>Real-time data from Glint Intelligence Network</p>
          <p className="mt-2">Last update: {new Date().toLocaleTimeString()} UTC</p>
          <p className="mt-4 text-[9px]">For fastest alerts, enable browser notifications</p>
        </div>
      </div>
    </>
  )
}
