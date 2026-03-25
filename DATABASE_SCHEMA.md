# 📊 Database Schema Reference

Your PostgreSQL schema is designed for intelligence platform features, user management, and analytics.

---

## Table: `Subscriber`

**Purpose:** User accounts and subscription tier tracking

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `email` | STRING | Unique user email |
| `clerkId` | STRING? | Auth service ID (if using Clerk) |
| `tier` | STRING | `FREE` \| `PRO` \| `INSTITUTIONAL` |
| `stripeId` | STRING? | Stripe customer ID (for billing) |
| `createdAt` | DATETIME | Account creation timestamp |
| `updatedAt` | DATETIME | Last update timestamp |

**Example Query:**
```sql
-- Count FREE vs PRO subscribers
SELECT tier, COUNT(*) FROM "Subscriber" GROUP BY tier;

-- Find new subscribers this week
SELECT email, tier, "createdAt"
FROM "Subscriber"
WHERE "createdAt" > NOW() - INTERVAL '7 days'
ORDER BY "createdAt" DESC;
```

---

## Table: `StockQuote`

**Purpose:** Cache live stock prices (auto-refreshed every 15 seconds)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `ticker` | STRING | Stock symbol (PLTR, LMT, RTX, etc.) |
| `price` | FLOAT | Current share price |
| `change` | FLOAT | Absolute price change |
| `changePct` | FLOAT | Percentage change |
| `volume` | INT | Trading volume |
| `marketCap` | FLOAT? | Market capitalization |
| `sector` | STRING? | Industry sector |
| `fetchedAt` | DATETIME | When price was fetched |

**Indexes:**
- `(ticker, fetchedAt)` — Find latest price for a stock

**Example Query:**
```sql
-- Get latest price for PLTR
SELECT * FROM "StockQuote"
WHERE ticker = 'PLTR'
ORDER BY "fetchedAt" DESC LIMIT 1;

-- Top movers today (stocks with biggest change %)
SELECT ticker, price, "changePct"
FROM "StockQuote"
WHERE "fetchedAt" > NOW() - INTERVAL '1 hour'
ORDER BY ABS("changePct") DESC LIMIT 10;
```

---

## Table: `SignalItem`

**Purpose:** Intelligence signals, news, alerts (50+ signals cached)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `title` | STRING | Signal headline |
| `summary` | STRING | Brief description |
| `source` | STRING | Origin (NewsAPI, GDELT, Finnhub, etc.) |
| `url` | STRING? | Link to full article |
| `category` | STRING | `DEFENCE` \| `AI` \| `CYBER` \| `NUCLEAR` \| `QUANTUM` \| `MACRO` \| `FED` \| `GEOPOLITICAL` \| `CRYPTO` \| `FUTURES` |
| `severity` | STRING | `INFO` \| `ALERT` \| `CRITICAL` |
| `tickers` | STRING[] | Related stock symbols |
| `publishedAt` | DATETIME | When signal was published |
| `fetchedAt` | DATETIME | When signal was added to database |

**Indexes:**
- `(category, publishedAt)` — Get signals by category

**Example Query:**
```sql
-- Get critical defence signals from last 24 hours
SELECT title, tickers, "publishedAt"
FROM "SignalItem"
WHERE category = 'DEFENCE'
  AND severity = 'CRITICAL'
  AND "publishedAt" > NOW() - INTERVAL '24 hours'
ORDER BY "publishedAt" DESC;

-- Find signals mentioning PLTR
SELECT title, category, severity
FROM "SignalItem"
WHERE tickers @> ARRAY['PLTR']
ORDER BY "publishedAt" DESC LIMIT 5;
```

---

## Table: `Contractor`

**Purpose:** Defence contractor master data (LMT, PLTR, RTX, etc.)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `ticker` | STRING (UNIQUE) | Stock symbol |
| `name` | STRING | Company name |
| `sector` | STRING | Industry (Defence, AI, Cyber, etc.) |
| `description` | STRING | Company overview |
| `keyPrograms` | STRING[] | Main contract programs |
| `recentContracts` | JSON | Latest contracts (amount, date, description) |
| `financials` | JSON | Revenue, profit, margins |
| `riskFactors` | STRING[] | Geopolitical/operational risks |
| `updatedAt` | DATETIME | Last data update |

**Example Query:**
```sql
-- Find all defence contractors
SELECT ticker, name, sector FROM "Contractor"
WHERE sector = 'Defence';

-- Check when Palantir was last updated
SELECT ticker, name, "updatedAt"
FROM "Contractor"
WHERE ticker = 'PLTR';
```

---

## Table: `GeoRiskEvent`

**Purpose:** Geopolitical events that impact defence stocks

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `title` | STRING | Event description |
| `region` | STRING | Geographic region (Ukraine, Pacific, Middle East, etc.) |
| `severity` | INT | Risk level (1-10) |
| `category` | STRING | `CONFLICT` \| `SANCTIONS` \| `TRADE` \| `CYBER` \| `NUCLEAR` |
| `summary` | STRING | Event details |
| `impactTickers` | STRING[] | Affected stocks |
| `timestamp` | DATETIME | When event occurred |
| `fetchedAt` | DATETIME | When added to database |

**Indexes:**
- `(severity, timestamp)` — Critical events first

**Example Query:**
```sql
-- Get critical events (severity > 7) from last month
SELECT title, region, category, "impactTickers"
FROM "GeoRiskEvent"
WHERE severity > 7
  AND timestamp > NOW() - INTERVAL '30 days'
ORDER BY timestamp DESC;

-- Events affecting PLTR
SELECT title, severity FROM "GeoRiskEvent"
WHERE "impactTickers" @> ARRAY['PLTR']
ORDER BY "timestamp" DESC LIMIT 10;
```

---

## Table: `FedUpdate`

**Purpose:** Federal Reserve decisions and macro data

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `title` | STRING | Update title |
| `type` | STRING | `RATE_DECISION` \| `SPEECH` \| `MINUTES` \| `DOT_PLOT` \| `CPI` \| `PPI` \| `JOBS` |
| `summary` | STRING | Key takeaways |
| `sentiment` | STRING | `HAWKISH` \| `DOVISH` \| `NEUTRAL` |
| `date` | DATETIME | When announced |
| `fetchedAt` | DATETIME | When added to database |

**Example Query:**
```sql
-- Latest Fed rate decision
SELECT * FROM "FedUpdate"
WHERE type = 'RATE_DECISION'
ORDER BY date DESC LIMIT 1;

-- Hawkish vs dovish signals (last 3 months)
SELECT sentiment, COUNT(*) FROM "FedUpdate"
WHERE date > NOW() - INTERVAL '90 days'
GROUP BY sentiment;
```

---

## Table: `CryptoQuote`

**Purpose:** Cryptocurrency prices (BTC, ETH, SOL, etc.)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `symbol` | STRING | Crypto ticker (BTC, ETH, SOL) |
| `price` | FLOAT | Current price in USD |
| `change24h` | FLOAT | 24-hour price change % |
| `volume24h` | FLOAT | Trading volume (24h) |
| `marketCap` | FLOAT | Total market capitalization |
| `fetchedAt` | DATETIME | When price was fetched |

**Example Query:**
```sql
-- Bitcoin price trend (last 7 days)
SELECT price, "fetchedAt" FROM "CryptoQuote"
WHERE symbol = 'BTC'
  AND "fetchedAt" > NOW() - INTERVAL '7 days'
ORDER BY "fetchedAt" ASC;

-- Top crypto gainers (24h)
SELECT symbol, price, change24h FROM "CryptoQuote"
ORDER BY change24h DESC LIMIT 5;
```

---

## Table: `UserWatchlist`

**Purpose:** User-saved stock lists (COMING WHEN DB WIRED)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `userId` | STRING | User ID (from auth) |
| `name` | STRING | List name (e.g., "Defence Contractors") |
| `tickers` | STRING[] | Stock symbols |
| `isPublic` | BOOLEAN | Shareable to other users? |
| `views` | INT | How many users viewed this |
| `createdAt` | DATETIME | When created |
| `updatedAt` | DATETIME | Last modified |

**Indexes:**
- `(userId, createdAt)` — Get user's watchlists

**Example Query:**
```sql
-- Get user's watchlists
SELECT name, tickers FROM "UserWatchlist"
WHERE "userId" = 'user_123'
ORDER BY "createdAt" DESC;

-- Most popular public watchlists
SELECT name, tickers, views FROM "UserWatchlist"
WHERE "isPublic" = true
ORDER BY views DESC LIMIT 10;
```

---

## Table: `PriceAlert`

**Purpose:** Price notifications (COMING WHEN DB WIRED)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `userId` | STRING | User who set alert |
| `ticker` | STRING | Stock to monitor |
| `condition` | STRING | `price_above` \| `price_below` \| `volume_spike` \| `momentum_shift` |
| `value` | FLOAT | Trigger price or % change |
| `active` | BOOLEAN | Is alert enabled? |
| `triggered` | BOOLEAN | Has it fired yet? |
| `triggeredAt` | DATETIME? | When it triggered |
| `alertsSent` | INT | How many notifications sent |
| `createdAt` | DATETIME | When created |
| `updatedAt` | DATETIME | Last modified |

**Indexes:**
- `(userId, ticker, active)` — Get user's active alerts

**Example Query:**
```sql
-- Get user's active alerts
SELECT ticker, condition, value FROM "PriceAlert"
WHERE "userId" = 'user_123' AND active = true;

-- Alerts that should trigger (PLTR above $40)
SELECT "userId", ticker FROM "PriceAlert"
WHERE ticker = 'PLTR'
  AND condition = 'price_above'
  AND value < 40  -- Assuming PLTR is $41 now
  AND active = true
  AND triggered = false;
```

---

## Table: `AgentAnalysis`

**Purpose:** Claude AI analysis cache (stock analysis, risk scores)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `ticker` | STRING | Stock symbol |
| `type` | STRING | `stock_analysis` \| `risk_score` \| `signal_generation` \| `trend_detection` |
| `depth` | STRING | `quick` (30s) \| `full` (2min) |
| `content` | TEXT | AI analysis output |
| `sentiment` | STRING? | `BULLISH` \| `NEUTRAL` \| `BEARISH` |
| `riskScore` | FLOAT? | 0-100 risk rating |
| `createdAt` | DATETIME | When analysis was created |
| `expiresAt` | DATETIME | Auto-delete after 24 hours |

**Indexes:**
- `(ticker, type, createdAt)` — Get latest analysis for a stock
- `(expiresAt)` — Find expired analyses for cleanup

**Example Query:**
```sql
-- Check if PLTR analysis is cached
SELECT type, sentiment, riskScore FROM "AgentAnalysis"
WHERE ticker = 'PLTR'
  AND "expiresAt" > NOW()
ORDER BY "createdAt" DESC LIMIT 1;

-- Delete expired analyses (run hourly)
DELETE FROM "AgentAnalysis" WHERE "expiresAt" < NOW();
```

---

## Table: `AdImpression`

**Purpose:** Ad view/click tracking for revenue

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `slot` | STRING | Ad location (banner, sidebar, feed-inline) |
| `page` | STRING | Page where shown |
| `clicked` | BOOLEAN | User clicked? |
| `revenue` | FLOAT | CPM earnings |
| `timestamp` | DATETIME | When shown |

**Example Query:**
```sql
-- Daily ad revenue
SELECT DATE("timestamp"), SUM(revenue) as daily_revenue
FROM "AdImpression"
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY DATE("timestamp")
ORDER BY DATE("timestamp") DESC;

-- Best-performing ad slots
SELECT slot, COUNT(*) as impressions, SUM(revenue) as total_revenue
FROM "AdImpression"
WHERE clicked = true
GROUP BY slot
ORDER BY total_revenue DESC;
```

---

## Table: `PageView`

**Purpose:** Analytics (page views, referrers)

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `path` | STRING | Page URL |
| `referrer` | STRING? | Where user came from |
| `userAgent` | STRING? | Browser info |
| `timestamp` | DATETIME | When accessed |

**Example Query:**
```sql
-- Top pages
SELECT path, COUNT(*) as views
FROM "PageView"
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY path
ORDER BY views DESC LIMIT 10;

-- Traffic sources
SELECT referrer, COUNT(*) as visits
FROM "PageView"
WHERE referrer IS NOT NULL
GROUP BY referrer
ORDER BY visits DESC;
```

---

## Table: `TerminalCommand`

**Purpose:** Log /scan, /analyze, /alert commands

| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key |
| `userId` | STRING? | User who ran command |
| `command` | STRING | Full command string |
| `result` | TEXT? | Command output |
| `duration` | INT | Milliseconds to execute |
| `status` | STRING | `success` \| `error` \| `timeout` |
| `errorMsg` | STRING? | Error message if failed |
| `createdAt` | DATETIME | When executed |

**Example Query:**
```sql
-- Most popular commands
SELECT command, COUNT(*) as count
FROM "TerminalCommand"
WHERE status = 'success'
GROUP BY command
ORDER BY count DESC;

-- Slow commands (>1 second)
SELECT command, duration, "createdAt"
FROM "TerminalCommand"
WHERE duration > 1000
ORDER BY duration DESC LIMIT 10;
```

---

## Quick Reference Queries

### Migration Check
```sql
-- Verify all tables exist
\dt
```

### Data Summary
```sql
-- Count records by table
SELECT
  'Subscriber' as table_name, COUNT(*) FROM "Subscriber"
UNION ALL
SELECT 'StockQuote', COUNT(*) FROM "StockQuote"
UNION ALL
SELECT 'SignalItem', COUNT(*) FROM "SignalItem"
UNION ALL
SELECT 'Contractor', COUNT(*) FROM "Contractor"
ORDER BY table_name;
```

### Recent Activity
```sql
-- Last 10 new subscribers
SELECT email, tier, "createdAt"
FROM "Subscriber"
ORDER BY "createdAt" DESC LIMIT 10;

-- Latest signals
SELECT title, category, severity, "publishedAt"
FROM "SignalItem"
ORDER BY "publishedAt" DESC LIMIT 10;
```

### Cleanup (Run Daily)
```sql
-- Delete old stock quotes (>7 days)
DELETE FROM "StockQuote"
WHERE "fetchedAt" < NOW() - INTERVAL '7 days';

-- Delete expired agent analyses
DELETE FROM "AgentAnalysis"
WHERE "expiresAt" < NOW();

-- Archive old page views (>30 days)
DELETE FROM "PageView"
WHERE "timestamp" < NOW() - INTERVAL '30 days';
```

---

## Backup Strategy

### Railway/Vercel Postgres
- Automatic daily backups (7-day retention)
- Point-in-time recovery available
- Monitoring dashboard shows backup status

### Manual Export
```bash
# Export full database
pg_dump -U user -h host yp_strategic > backup.sql

# Import backup
psql -U user -h host -d yp_strategic < backup.sql

# Export table as CSV
psql -U user -c "COPY \"Subscriber\" TO STDOUT WITH CSV HEADER" > subscribers.csv
```

---

## Performance Tips

1. **Add indexes for frequently queried columns:**
   ```sql
   CREATE INDEX idx_subscriber_email ON "Subscriber"(email);
   CREATE INDEX idx_signal_date ON "SignalItem"("publishedAt" DESC);
   ```

2. **Archival queries (move old data):**
   - Move PageView records >90 days to archive table
   - Move TerminalCommand records >30 days to history table

3. **Monitoring:**
   - Monitor slow queries: `log_duration = on` in Postgres config
   - Watch disk usage: Database should stay <50% of allocated space
   - Check connection pool: Usually 10-20 connections sufficient

---

Done! Your database schema is production-ready. Just need to set `DATABASE_URL` and run `npm run db:push`. 🚀
