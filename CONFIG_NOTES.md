# ypstrategicresearch.com — API Key Configuration Notes

## Where to Set Keys

Copy `.env.example` to `.env.local` (local dev) or set via Railway dashboard (production):

```bash
cp .env.example .env.local
```

---

## Key-by-Key Reference

### FINNHUB_KEY ⚠️ REQUIRED
- **Used by:** `app/api/stock-price/route.js`, `app/api/company-news/route.js`, `app/lib/fetchers.ts`
- **What breaks without it:** All stock price data and company news fall back to mock data. The `/api/stock-price` and `/api/company-news` routes return `500 API key not configured`.
- **Free tier:** 60 API calls/minute — sufficient for the full 50-ticker universe.
- **Get it:** https://finnhub.io/register

### COINMARKETCAP_API_KEY
- **Used by:** `app/lib/fetchers.ts` → `fetchCrypto()`
- **What breaks without it:** Crypto panel shows mock data (BTC, ETH, SOL, XRP, ADA, LINK).
- **Free tier:** 333 calls/day — sufficient.
- **Get it:** https://pro.coinmarketcap.com/signup

### FRED_API_KEY
- **Used by:** `app/lib/fetchers.ts` → `fetchFedUpdates()`
- **What breaks without it:** Fed/macro panel shows mock data. Note: real FRED fetch is not yet implemented in the route — mock data is always returned regardless of key.
- **Free tier:** Unlimited.
- **Get it:** https://fred.stlouisfed.org/docs/api/api_key.html

### GDELT_ENABLED
- **Used by:** `app/lib/fetchers.ts` → `fetchGeoRisk()`
- **What breaks without it (or if set to `false`):** Geopolitical risk panel shows mock data.
- **Cost:** Free — no API key needed. Set `GDELT_ENABLED=true` to enable live geo-risk feeds.

### ALPHA_VANTAGE_API_KEY
- **Used by:** `app/lib/fetchers.ts` (variable declared but not actively used in any route)
- **Status:** Legacy — stock data was migrated to Finnhub. This key is kept for potential future use (e.g., earnings, fundamentals).
- **Free tier:** 5 calls/min, 500/day.

### NEWSAPI_KEY
- **Used by:** `app/lib/fetchers.ts` (variable declared but no longer gates news fetch)
- **Status:** Superseded — company news is now served via Finnhub's `/company-news` endpoint using `FINNHUB_KEY`. `NEWSAPI_KEY` is retained in `.env.example` for future direct NewsAPI integration.

### DATABASE_URL
- **Used by:** Prisma ORM (`prisma/schema.prisma`), all database-backed routes.
- **What breaks without it:** `prisma generate` will succeed but any DB query at runtime will throw. The site works without a database because all routes fall back to in-memory mock data.
- **How to get:** Railway auto-provisions `DATABASE_URL` when you add the PostgreSQL plugin.

### NEXT_PUBLIC_ADSENSE_CLIENT_ID
- **Used by:** `app/layout.tsx` (conditionally loads AdSense script), `app/components/AdSlot.tsx`
- **What breaks without it:** AdSense script is not injected and ad slots render as empty placeholders. Site functions normally.
- **Format:** `ca-pub-XXXXXXXXXXXXXXXX`
- **Get it:** https://adsense.google.com

### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY / CLERK_SECRET_KEY
- **Used by:** Clerk authentication (login, subscription gating)
- **Status:** Auth UI is present (NavBar "Terminal Login" button) but Clerk is not yet wired into the Next.js middleware. Safe to leave unset during development.

### STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET / NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- **Used by:** Payment processing for Pro ($29/mo) and Institutional ($199/mo) tiers.
- **Status:** Stripe package is installed but checkout routes are not yet implemented. Safe to leave unset during development.

### NEXT_PUBLIC_APP_URL
- **Value:** `https://ypstrategicresearch.com`
- **Used by:** SEO metadata, canonical URLs, OpenGraph tags.

### NEXT_PUBLIC_APP_NAME
- **Value:** `ypstrategicresearch.com`
- **Used by:** Display name in metadata and UI.

---

## Minimum Viable Setup (Live Stock + News Data)

```bash
# .env.local — minimum to get real data instead of mocks
FINNHUB_KEY=your_finnhub_key_here
GDELT_ENABLED=true
DATABASE_URL=postgresql://...   # optional — mock fallback works without it
```

Everything else is optional for local development.

---

## Railway Production Deployment

```bash
railway variables set FINNHUB_KEY=your_key
railway variables set GDELT_ENABLED=true
railway variables set NEXT_PUBLIC_APP_URL=https://ypstrategicresearch.com
railway variables set NEXT_PUBLIC_APP_NAME=ypstrategicresearch.com
railway variables set NODE_ENV=production
# Add remaining keys as you enable features
```

---

## Notes on Branding Change

All references to `stratintel` / `STRATINTEL` / `ypstratintel.com` have been updated to `ypstrategicresearch.com` across:
- `app/layout.tsx` — page title, OpenGraph, Twitter card metadata
- `app/page.tsx` — hero CTA and Six Pillars descriptions
- `app/api/health/route.ts` — health check service name
- `app/lib/fetchers.ts` — file header comment
- `app/lib/mock-data.ts` — file header comment
- `app/components/PricingSection.tsx` — Free tier feature list
- `app/components/NavBar.tsx` — already read as "Y.P Strategicresearch" (unchanged)
- `.env.example` — app URL and app name
- `package.json` — package name (`yp-stratintel` → `yp-strategicresearch`)
- `README.md` — title, directory references, feature descriptions
