# Vercel Deployment Setup Guide

## Quick Start (5 minutes)

### Step 1: Import Project to Vercel
1. Go to **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Paste your repo URL: `https://github.com/diaznehemiah91-svg/yp-strategic`
4. Click **"Import"**

---

## Step 2: Add Environment Variables

In the Vercel import dialog, scroll to **"Environment Variables"** section and add each key:

### **Critical (Required for APIs)**
```
FINNHUB_KEY = your_key_here
```
- Get key: https://finnhub.io/register
- Used by: Stock prices, company news
- Without it: Falls back to mock data

### **AI Agent Analysis**
```
ANTHROPIC_API_KEY = your_key_here
```
- Get key: https://console.anthropic.com
- Used by: `/api/analyze`, agent-powered stock analysis
- Without it: Falls back to mock analysis

### **Crypto Data**
```
COINMARKETCAP_API_KEY = your_key_here
```
- Get key: https://pro.coinmarketcap.com
- Optional: Used for crypto prices
- Without it: Falls back to mock data

### **Alternative Stock Data**
```
ALPHA_VANTAGE_API_KEY = your_key_here
```
- Get key: https://www.alphavantage.co/support/#api-key
- Optional: Backup for stock prices
- Without it: Uses Finnhub

### **News API**
```
NEWSAPI_KEY = your_key_here
```
- Get key: https://newsapi.org/register
- Optional: For news feed
- Without it: Falls back to mock news

### **Federal Reserve Data**
```
FRED_API_KEY = your_key_here
```
- Get key: https://fred.stlouisfed.org/docs/api/api_key.html
- Optional: For macro data
- Without it: Uses mock Fed data

### **Application Settings**
```
NEXT_PUBLIC_APP_URL = https://ypstrategicresearch.com
NEXT_PUBLIC_APP_NAME = ypstrategicresearch.com
NODE_ENV = production
```

### **Optional: Authentication**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = your_key_here
CLERK_SECRET_KEY = your_key_here
```
- Get key: https://clerk.com
- Used for: User authentication (optional)

### **Optional: Payments**
```
STRIPE_SECRET_KEY = your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = your_key_here
STRIPE_WEBHOOK_SECRET = your_key_here
```
- Get key: https://dashboard.stripe.com
- Used for: Subscription handling (optional)

### **Optional: Database**
```
DATABASE_URL = postgresql://user:password@host:port/dbname
```
- Optional: For watchlists, alerts, agent caching
- If not set: Uses in-memory storage

---

## Step 3: Deploy
1. After adding variables, click **"Deploy"**
2. Vercel will build and deploy automatically
3. Wait 2-3 minutes for deployment to complete
4. You'll get a URL like: `https://yp-strategic-abc123.vercel.app`

---

## Step 4: (Optional) Enable Auto-Deployment on Git Push

To make Vercel auto-deploy on every git push:

1. Go to your **Vercel Project Settings** → **Git**
2. Make sure **"Deploy on Push"** is enabled (default)
3. Now every `git push origin main` will auto-deploy

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will handle this automatically.

---

## Verify Deployment

### Check if site is live:
```bash
# Visit your Vercel URL
https://yp-strategic-abc123.vercel.app

# Or check GitHub Actions logs
https://github.com/diaznehemiah91-svg/yp-strategic/actions
```

### Test functionality:
1. **Homepage** — Should load 3D background + stock ticker search
2. **Search ticker** — Click on any ticker, should navigate to `/contractor/[ticker]` with full market data
3. **Live prices** — Stock prices should update every 60 seconds
4. **API responses** — Open DevTools (F12) and check Network tab for `/api/stock-price` calls

---

## Troubleshooting

### "Build failed on Vercel"
- Check Vercel deployment logs: Vercel Dashboard → Deployments → View Log
- Common cause: Missing `FINNHUB_KEY` (but app should still build with fallback)
- Fix: Add missing env vars and redeploy

### "Stock prices showing as 'mock data'"
- Cause: API key missing or invalid
- Fix: Add `FINNHUB_KEY` env var and redeploy

### "Search doesn't navigate to ticker page"
- Cause: Old version cached in browser
- Fix: Hard refresh (Ctrl+Shift+R) or clear browser cache

### "500 errors on API routes"
- Check Vercel logs for error messages
- Make sure all required API keys are set
- Test locally: `npm run dev` and check `/api/` routes

---

## Environment Variables Reference

| Variable | Required | Purpose | Free Tier |
|----------|----------|---------|-----------|
| FINNHUB_KEY | ✓ | Stock prices | 60 calls/min |
| ANTHROPIC_API_KEY | ✓* | AI analysis | $0.50/M input |
| COINMARKETCAP_API_KEY | ✗ | Crypto prices | 333 calls/day |
| ALPHA_VANTAGE_API_KEY | ✗ | Backup stocks | 5 calls/min |
| NEWSAPI_KEY | ✗ | News feed | 100/day (dev) |
| FRED_API_KEY | ✗ | Fed data | Unlimited |
| NEXT_PUBLIC_APP_URL | ✓ | App domain | - |
| NODE_ENV | ✓ | Build mode | - |

*Required only if you want AI agent analysis. Without it, analysis falls back to mock data.

---

## Next Steps

1. **Verify deployment works** — Visit your Vercel URL
2. **Monitor logs** — Check Vercel dashboard for any errors
3. **Track API usage** — Visit each API provider's dashboard to monitor quota
4. **Scale up** — Upgrade API plans if hitting rate limits
5. **Add custom domain** — In Vercel Settings → Domains, add `ypstrategicresearch.com`

---

**Last Updated:** 2026-03-25
**Deployment Strategy:** GitHub → Vercel (auto-deploy on main branch push)
