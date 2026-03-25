# CLAUDE.md — YP Strategic Research

This file provides essential context for AI assistants working in this codebase.

---

## Project Overview

**YP Strategic Research** is a full-stack Next.js 14 intelligence platform covering defence-tech, AI, crypto, space, nuclear energy, and macro markets. It provides real-time stock data, AI-powered analysis, geopolitical intelligence, and a code-generation IDE (Forge).

- **Production URL:** https://yp-strategic.vercel.app
- **GitHub Repo:** diaznehemiah91-svg/yp-strategic
- **Version:** 2.0.0
- **Stack:** Next.js 14 + TypeScript + Tailwind CSS + Prisma + PostgreSQL

---

## Development Branch

**Always develop on:** `claude/add-claude-documentation-GxILQ`

Never push directly to `main`. The `main` branch is connected to Vercel auto-deploy.

---

## Key Commands

```bash
# Development
npm run dev          # Start local dev server (port 3000)
npm run build        # Production build (also validates TypeScript)
npm run start        # Start production server

# Database
npm run db:push      # Push Prisma schema to database (no migration)
npm run db:seed      # Seed database with initial data
npx prisma generate  # Regenerate Prisma client (runs automatically on postinstall)
npx prisma studio    # Visual database browser

# Type Checking
npx tsc --noEmit     # TypeScript check without building
```

There is **no test suite** (no Jest/Vitest/Playwright). TypeScript strict mode and build-time type checking serve as the primary correctness checks.

---

## Directory Structure

```
app/
├── (pages)/                  # Next.js App Router route groups
│   ├── contractor/[ticker]/  # Individual stock deep-dive pages
│   ├── crypto/               # Digital assets dashboard
│   ├── forge/                # AI code IDE (Pine Script, Python, MQL5)
│   ├── nexus/                # Interactive ecosystem map
│   ├── signal/               # Intelligence news feed
│   └── terminal/             # Bloomberg-style command terminal
├── api/                      # 16 API routes (see API Routes section)
├── components/               # 27 shared React components
├── hooks/                    # Custom React hooks
│   ├── useLivePrice.ts       # SWR polling for stock prices
│   └── useStockStream.ts     # SSE streaming hook
├── actions/
│   └── auth.ts               # Server actions for authentication
├── lib/
│   ├── fetchers.ts           # External API data-fetching logic
│   ├── mock-data.ts          # 42KB mock data (fallback when APIs unavailable)
│   ├── intel-engine.ts       # Signal/intelligence aggregation
│   ├── terminal-commands.ts  # Terminal command parser (/scan, /analyze, /alert)
│   ├── agents.ts             # Multi-agent AI system definitions
│   └── cache.ts              # Caching layer
├── globals.css               # Global Tailwind + custom CSS variables
├── layout.tsx                # Root layout + metadata
└── page.tsx                  # Homepage/dashboard
prisma/
└── schema.prisma             # 15 PostgreSQL models
.github/
└── workflows/
    └── deploy.yml            # GitHub Actions → Vercel CI/CD (triggers on main)
```

---

## Architecture Patterns

### Server vs Client Components
- **Server components** (default) — data fetching, SEO-sensitive pages
- **Client components** — marked `'use client'` at top of file; used for interactivity, hooks, animations

### Data Fetching Strategy
1. **API routes** (`/api/*`) fetch from external services and cache in Prisma
2. **`app/lib/fetchers.ts`** — contains all external API calls (Finnhub, CoinMarketCap, FRED)
3. **Mock fallback** — if an API key is missing or the call fails, `app/lib/mock-data.ts` is used automatically
4. **SWR polling** — `useLivePrice` refreshes data every 15 seconds
5. **SSE streaming** — `useStockStream` connects to `/api/stream/stocks` for real-time push

### Caching
- API routes set `Cache-Control: s-maxage=60, stale-while-revalidate=300`
- AI analysis results are cached in the `AgentAnalysis` table with a 24-hour TTL
- Stream sessions expire after 30 minutes (`StreamSession` model)

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/stock-price` | GET | Real-time stock quote (Finnhub) |
| `/api/company-news` | GET | Company news (Finnhub, 7-day history) |
| `/api/stocks` | GET | Batch stock data (multiple tickers) |
| `/api/crypto` | GET | Crypto prices (CoinMarketCap) |
| `/api/crypto-price` | GET | Crypto pricing (CoinGecko alt) |
| `/api/futures` | GET | Futures (/ES, /NQ, /CL, /GC, etc.) |
| `/api/fed` | GET | Federal Reserve updates (FRED API) |
| `/api/geopolitical` | GET | Geo-risk events (GDELT 2.0) |
| `/api/news` | GET | News aggregation (NewsAPI) |
| `/api/analyze` | POST | AI analysis via Claude API (cached) |
| `/api/alerts` | GET/POST | Price alert management |
| `/api/watchlist` | GET/POST | User watchlist management |
| `/api/stream/stocks` | GET | SSE real-time stock streaming |
| `/api/ads` | POST | Ad impression tracking |
| `/api/health` | GET | Health check endpoint |
| `/api/forge/generate` | POST | AI code generation (Pine Script v5) |

All routes include CORS headers (`Access-Control-Allow-Origin: *`).

---

## Database Schema (Prisma / PostgreSQL)

Key models in `prisma/schema.prisma`:

| Model | Purpose |
|-------|---------|
| `StockQuote` | Cached stock prices (ticker, price, change%, volume, sector) |
| `SignalItem` | Intelligence signals with category/severity/tickers |
| `Contractor` | Defence contractor data with programs and financials |
| `GeoRiskEvent` | Geopolitical events with region and impact tickers |
| `FedUpdate` | Federal Reserve updates with sentiment |
| `CryptoQuote` | Crypto prices with 24h change and market cap |
| `FuturesQuote` | Futures prices |
| `Subscriber` | Users with tier (FREE/PRO/INSTITUTIONAL) |
| `AgentAnalysis` | Cached AI analysis with 24h TTL |
| `UserWatchlist` | User-created watchlists |
| `PriceAlert` | Price alert subscriptions |
| `StreamSession` | Active SSE stream sessions (30min TTL) |
| `TerminalCommand` | Command history for the terminal page |
| `AdImpression` | Ad click/impression tracking |
| `PageView` | Analytics page views |

Always run `npx prisma generate` after schema changes. Use `npm run db:push` to apply schema changes without migrations (suitable for this project's workflow).

---

## Environment Variables

Copy `.env.example` to `.env.local` for local development. All public variables are prefixed `NEXT_PUBLIC_`.

**Required for core functionality:**
```
FINNHUB_KEY              # Stock prices and news
DATABASE_URL             # PostgreSQL connection string
```

**Optional (enables additional features):**
```
ANTHROPIC_API_KEY        # Claude AI analysis + Forge code generation
COINMARKETCAP_API_KEY    # Crypto data
FRED_API_KEY             # Federal Reserve / macro data
NEWSAPI_KEY              # News aggregation
ALPHA_VANTAGE_API_KEY    # Legacy stock data fallback
GDELT_ENABLED=true       # Geopolitical risk events
```

**Auth & Payments (optional integrations):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

**Monetization:**
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID    # Google AdSense
NEXT_PUBLIC_APP_URL              # App base URL
```

If an API key is not set, the app automatically falls back to mock data from `app/lib/mock-data.ts`.

---

## Styling Conventions

**Design System:** Dark terminal aesthetic with glass-morphism.

**CSS Variables** (defined in `app/globals.css`):
```css
--bg:           #020304   /* near-black background */
--accent:       #00ff52   /* bright green — primary accent */
--accent2:      #00d4ff   /* cyan — secondary accent */
--accent3:      #ff3355   /* red/pink — alerts, negative */
--gold:         #f0c040   /* gold — warnings, highlights */
--text:         #c8e0d0   /* light green-gray — body text */
--text-dim:     #3a5a44   /* dimmed text */
--text-bright:  #e0ffe8   /* bright text — headings */
```

**Tailwind:** Use utility classes. Custom theme extensions are in `tailwind.config.js`.

**Animations:** `framer-motion` for transitions. Custom CSS keyframes (`scanlines`, `fade-up`, `ticker-scroll`) in `globals.css`.

**Icons:** `lucide-react` exclusively.

---

## TypeScript Conventions

- **Strict mode** is enabled — no implicit `any`, no unchecked nulls
- All components and hooks must be fully typed
- API response types should be defined inline or in the relevant component/fetcher file
- No separate `types/` directory — types live close to where they're used
- Use `interface` for object shapes, `type` for unions/intersections

---

## Component Conventions

- PascalCase filenames matching the component name (`NavBar.tsx`, `CryptoPanel.tsx`)
- Client components: add `'use client'` as the first line
- Import order: React → Next.js → third-party → local
- Props interfaces named `[ComponentName]Props`
- Default exports for page/layout components; named exports acceptable for utilities

---

## AI Integration (Claude API)

The app uses `@anthropic-ai/sdk` (v0.24.0) in two places:

1. **`/api/analyze`** — Generates stock analysis with sentiment and risk scores. Results are cached in `AgentAnalysis` (24h TTL) to avoid redundant API calls.
2. **`/api/forge/generate`** — Generates Pine Script v5, Python, and MQL5 trading indicators on demand.

When modifying AI features, check `app/lib/agents.ts` for agent definitions and prompt patterns.

---

## Deployment

### Vercel (Primary)
- Auto-deploys on push to `main` via `.github/workflows/deploy.yml`
- Requires `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` secrets in GitHub
- Set all environment variables in the Vercel dashboard

### Railway (Alternative)
- Config in `railway.toml`
- Start command: `npx prisma db push --accept-data-loss && node server.js`
- Health check: `/api/health`
- Auto-restarts on failure (max 5 retries)

### Docker
- Multi-stage `Dockerfile` using `node:20-alpine`
- Output: `standalone` Next.js bundle
- `next.config.js` sets `output: 'standalone'`

---

## Covered Assets & Sectors

**Defence:** LMT, RTX, NOC, GD, BA, PLTR, CRWD, AXON, LDOS, HII

**AI/Tech/Cyber:** NVDA, ANET, PANW, ZS, DDOG, NET, AMD, INTC, TSM

**Space:** RKLB, ASTS, LUNR

**Nuclear/Energy:** OKLO, CEG, VST, NNE, LEU, SMR, BWXT

**Quantum:** IONQ, QBTS, QUBT

**Crypto:** BTC, ETH, SOL, XRP, ADA, LINK

---

## Six Pillars (Product Features)

| Pillar | Page | Description |
|--------|------|-------------|
| SIGNAL | `/signal` | Real-time intelligence news feed |
| BRIDGEPATH | Homepage section | Private→public proxy mapping |
| FORGE | `/forge` | AI-powered indicator builder (Pine Script, Python, MQL5) |
| REPORTS | Homepage section | Strategic analysis briefings |
| NEXUS | `/nexus` | Interactive ecosystem relationship map |
| INTEL VAULT | `/terminal` | Bloomberg-style command terminal with tiered access |

---

## Subscription Tiers

| Tier | Price | Data Access |
|------|-------|-------------|
| FREE | $0 | Mock data only |
| PRO | $29/mo | Live API data + advanced features |
| INSTITUTIONAL | $199/mo | Full API access + custom reports |

Tier is stored on `Subscriber.tier` in the database. Gate premium features by checking this value server-side.

---

## Common Pitfalls

1. **Mock data is large** — `app/lib/mock-data.ts` is 42KB. Do not import it in client components; keep it server-side only.
2. **No migrations** — This project uses `prisma db push` (schema sync), not `prisma migrate`. Never run `prisma migrate dev`.
3. **CORS is open** — All API routes allow `*` origin. Do not add sensitive auth logic that relies on `Origin` header.
4. **API key fallbacks** — Always test that the mock fallback path works if you change a fetcher. The app must be functional without any API keys.
5. **SSE streaming** — The `/api/stream/stocks` route uses `ReadableStream`. Do not add `await` calls inside the stream controller that could block the stream.
6. **Prisma client** — Always run `npx prisma generate` after schema changes, or the TypeScript types will be stale.
7. **Three.js in SSR** — `ThreeBackground.tsx` must remain a client component. Three.js accesses `window`/`document` and will break on the server.

---

## File Size Reference

| File | Size | Notes |
|------|------|-------|
| `app/lib/mock-data.ts` | ~42KB | Large — avoid unnecessary edits |
| `app/page.tsx` | ~11KB | Main dashboard |
| `prisma/schema.prisma` | ~5KB | 15 models |
| `app/lib/fetchers.ts` | ~4KB | External API logic |
