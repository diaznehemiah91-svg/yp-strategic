# ypstrategicresearch.com — Project Memory

**Last Updated:** March 24, 2026 | **Status:** Live Data Integration In Progress

## 🎯 Current Goal
Replace 15-20 minute delayed stock data (Alpha Vantage) with real-time pricing via Finnhub + CoinGecko. Fix stale prices on stock detail pages.

## ✅ Completed This Session

### Step 1: Created API Route Handlers ✅
- **`app/api/stock-price/route.js`** — Finnhub real-time quotes with 60s caching
- **`app/api/company-news/route.js`** — Finnhub 7-day news with 5min caching
- **`app/api/crypto-price/route.js`** — CoinGecko crypto with 60s caching

### Step 2: Updated fetchers.ts ✅
- `fetchStocks()` now calls `/api/stock-price` (real-time Finnhub, 60s cache)
- `fetchSignals()` now calls `/api/company-news` (real-time Finnhub, 5min cache)
- Backward compatible — no changes to page.tsx needed
- Per-ticker error handling with mock fallback

### Step 3: Updated StockDetailClient.tsx ✅
- Added 6 state variables for live price tracking
- 60-second polling via `setInterval`
- Timestamp display: "Last updated: 2:45 PM ET"
- Disclaimer: "Prices delayed ~15 min (free tier)"
- Graceful fallback if API fails

## 🔄 In Progress
**Awaiting:** User commits, pushes, deploys, and tests on live site

## 🔐 Environment Setup (USER ACTION)

Create `.env.local` in project root:
```
FINNHUB_KEY=your_new_regenerated_key
NEWSAPI_KEY=your_new_regenerated_key
```

⚠️ **CRITICAL:** Keys were exposed in chat. User must regenerate both keys before Step 2.

## 📊 Data Sources
| Source | Endpoint | Delay | Free Limit | Status |
|--------|----------|-------|-----------|--------|
| Finnhub | Stock/News | 15min | 60 calls/min | ✅ Integrated |
| CoinGecko | Crypto | ~1min | 30 calls/min | ✅ Integrated |
| Alpha Vantage | Stocks | 15-20min | 5 calls/min | ❌ Replacing |

## 📝 Project Structure
```
app/
├── api/
│   ├── stock-price/route.js (NEW)
│   ├── company-news/route.js (NEW)
│   └── crypto-price/route.js (NEW)
├── components/
│   └── StockDetailClient.tsx (needs polling update)
├── lib/
│   ├── fetchers.ts (needs update)
│   └── mock-data.ts
└── page.tsx (server component, working)
```

## 🎬 Next Actions
1. ✅ Create API routes → DONE
2. ⏳ User confirms .env.local setup
3. 🔨 Update fetchers.ts to use new endpoints
4. 🔄 Update StockDetailClient with 60s polling
5. 🧪 Test on PLTR stock detail page
6. 🚀 Deploy and verify live prices

## 🧠 Key Insights
- Free Finnhub = good enough (15min delay acceptable for most traders)
- CoinGecko free = unlimited crypto updates (~1min)
- 60s polling + caching = smooth UX without rate limit hammering
- Mock data fallback still needed for when APIs are slow
