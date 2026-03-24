# Y.P STRATINTEL — Defence-Tech Intelligence Platform

> **Where Capital Flows, Before The Market Knows**

Real-time defence & deep-tech intelligence. AI-curated signal. Public proxy mapping for private companies. Crypto, futures, and macro intelligence.

**© 2026 Y.P Strategic Research · S-Corp · Boston, MA**

---

## 🏗️ Architecture

```
yp-stratintel/
├── app/
│   ├── api/              # API routes (stocks, news, crypto, futures, fed, geo, ads)
│   ├── (pages)/          # Deep-link pages (contractor briefs, crypto, macro)
│   ├── components/       # React components (Three.js bg, panels, grids, ads)
│   ├── lib/              # Data fetchers + mock data layer
│   ├── globals.css       # STRATINTEL aesthetic (glass panels, scanlines, noise)
│   ├── layout.tsx        # Root layout with AdSense
│   └── page.tsx          # Homepage dashboard
├── prisma/               # PostgreSQL schema (stock cache, signals, subscribers, ad tracking)
├── public/               # Static assets
├── .env.example          # All API keys template
├── Dockerfile            # Production container
├── railway.toml          # Railway deployment config
├── next.config.js        # Next.js config (standalone output for Railway)
└── package.json          # Dependencies
```

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/yp-stratintel.git
cd yp-stratintel
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your API keys (see Cost Breakdown below)
```

### 3. Run Locally

```bash
npm run dev
# → http://localhost:3000
```

The site works immediately with mock data. Add API keys to get live feeds.

### 4. Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login & initialize
railway login
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Set environment variables
railway variables set ALPHA_VANTAGE_API_KEY=your_key
railway variables set NEWSAPI_KEY=your_key
railway variables set COINMARKETCAP_API_KEY=your_key
railway variables set FRED_API_KEY=your_key
railway variables set GDELT_ENABLED=true
# ... add all keys from .env.example

# Deploy
railway up
```

---

## 💰 Cost Breakdown

### Domain & Hosting

| Item | Cost | Notes |
|------|------|-------|
| Domain (.com) | $12/year | Namecheap, Google Domains, GoDaddy |
| Railway Hosting | $5-20/month | Starter plan. Scales with traffic. |
| Railway PostgreSQL | $5-10/month | Included in Railway. Auto-scales. |
| **Subtotal** | **$22-42/month** | |

### API Keys

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Alpha Vantage (Stocks) | 5 calls/min, 500/day | $49.99/mo (unlimited) | Start free, upgrade when traffic grows |
| NewsAPI (News) | 100 req/day (dev) | $449/mo (business) | Start with free + GDELT. Upgrade later. |
| CoinMarketCap (Crypto) | 333 calls/day | $79/mo (startup) | Free tier is plenty to start |
| FRED (Fed Data) | Unlimited | Free | Federal Reserve Economic Data |
| GDELT (Geopolitical) | Unlimited | Free | No key needed |
| **Subtotal** | **$0/month** (free tiers) | **$578/month** (all paid) | |

### Auth & Payments

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Clerk (Auth) | 10,000 MAUs | $25/mo (Pro) | Handles login, subscriptions |
| Stripe (Payments) | 2.9% + $0.30/txn | Same | No monthly fee, just per-transaction |
| **Subtotal** | **$0/month** | **$25/month** | |

### Ad Revenue (Google AdSense)

| Metric | Conservative | Moderate | Aggressive |
|--------|-------------|----------|------------|
| Monthly Pageviews | 10,000 | 50,000 | 200,000 |
| RPM (Revenue/1000) | $3-5 | $5-8 | $8-15 |
| Monthly Revenue | $30-50 | $250-400 | $1,600-3,000 |

### Total Monthly Cost Scenarios

| Scenario | Monthly Cost | Monthly Revenue | Net |
|----------|-------------|-----------------|-----|
| **Starter** (free APIs) | ~$22 | $30-50 (ads) | **+$8-28** |
| **Growth** (some paid) | ~$100 | $250-400 (ads) + subs | **+$150-300** |
| **Scale** (all paid) | ~$645 | $1,600-3,000 (ads) + subs | **+$955-2,355** |

---

## 📊 Features

### Data Feeds
- **Defence Stocks**: LMT, RTX, NOC, GD, BA, PLTR, CRWD, NVDA, AXON, IONQ, OKLO, RKLB, LDOS, HII
- **Crypto**: BTC, ETH, SOL, XRP, ADA, LINK
- **Futures**: /ES, /NQ, /YM, /RTY, /CL, /GC, /SI, /BTC
- **Fed/Macro**: FOMC decisions, Powell speeches, CPI, PPI, NFP, PCE, dot plots
- **Geopolitical**: Conflict alerts, sanctions, trade restrictions, cyber threats

### Pages & Deep Links
- **Homepage Dashboard**: Full intelligence overview with all panels
- **Contractor Briefs**: `/contractor/LMT`, `/contractor/PLTR`, etc. — full deep-dive with financials, contracts, risk factors, related signals, macro context
- **Signal Feed**: Filterable by category (DEFENCE, AI, CYBER, NUCLEAR, QUANTUM, FED, CRYPTO, FUTURES, GEOPOLITICAL)

### Monetization
- **Google AdSense**: 6 ad placements (banner, sidebar, in-feed, footer)
- **Subscription Tiers**: Free / Pro ($29/mo) / Institutional ($199/mo)
- **Revenue Tracking**: Built-in impression/click tracking via `/api/ads`
- **Analytics**: Page view tracking for bank reporting

### Six Pillars
1. **SIGNAL** — Real-time news wire
2. **BRIDGEPATH** — Private→public proxy mapping
3. **FORGE** — Indicator builder (Pine Script, Python, MQL5)
4. **REPORTS** — STRATINTEL briefings
5. **NEXUS** — Ecosystem relationship map
6. **INTEL VAULT** — Tiered access

---

## 🏦 Business Documentation

This platform is operated by **Y.P Strategic Research (S-Corp)** and generates revenue through:

1. **Display Advertising** — Google AdSense across all pages
2. **Subscription Revenue** — Pro ($29/mo) and Institutional ($199/mo) tiers
3. **API Access** — Data API for institutional clients
4. **Custom Research** — On-demand STRATINTEL reports

Revenue metrics are tracked via the `/api/ads` endpoint and can be exported for tax filing, business loan applications, and financial reporting.

---

## 📝 License

Proprietary. © 2026 Y.P Strategic Research · S-Corp · All Rights Reserved.
