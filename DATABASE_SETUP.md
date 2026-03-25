# Database Setup Guide — YP Strategic Research

## Overview

The application uses **PostgreSQL** with **Prisma ORM** for data persistence. The database supports:

- AI agent analysis caching
- User watchlists and price alerts
- Real-time stream sessions
- Terminal command history
- Ad impressions and analytics

---

## Quick Start

### 1. Local Development

If using Railway's PostgreSQL plugin:

```bash
# Set environment variable (Railway auto-provisions this)
export DATABASE_URL="postgresql://user:password@host:port/dbname"

# Generate Prisma client
npm install
npm run prisma generate

# Push schema to database
npm run db:push
```

### 2. Production (Railway)

Railway automatically handles PostgreSQL provisioning. When you add the PostgreSQL plugin:

```bash
# 1. Add PostgreSQL plugin
railway add --plugin postgresql

# 2. Set DATABASE_URL in Railway variables
railway variables set DATABASE_URL="your_database_url"

# 3. Deploy
railway up

# 4. Push schema to production database
railway run npm run db:push
```

---

## Database Schema

### Models Overview

| Model | Purpose | TTL |
|-------|---------|-----|
| `AgentAnalysis` | Cache Claude AI agent outputs | 24h |
| `UserWatchlist` | Saved ticker lists | ∞ (user-managed) |
| `PriceAlert` | Price/volume alerts | ∞ (until triggered) |
| `StreamSession` | Real-time SSE subscriptions | 30m |
| `TerminalCommand` | Command history | 90d |
| `StockQuote` | Cached stock prices | 1m (auto-refresh) |
| `SignalItem` | News/signals cache | 7d |
| `GeoRiskEvent` | Geopolitical events | 30d |
| `FedUpdate` | Federal Reserve updates | ∞ |
| `Subscriber` | User accounts | ∞ |
| `AdImpression` | Ad tracking | ∞ (for reporting) |
| `PageView` | Analytics | ∞ |

---

## Key Features

### Agent Analysis Caching

```typescript
// Avoid re-analyzing the same stock within 24h
const cached = await prisma.agentAnalysis.findFirst({
  where: {
    ticker: 'PLTR',
    type: 'stock_analysis',
    expiresAt: { gt: new Date() }
  }
});
```

### User Watchlists

```typescript
// Create watchlist
const watchlist = await prisma.userWatchlist.create({
  data: {
    userId: 'clerk_user_123',
    name: 'Defence Contractors',
    tickers: ['LMT', 'RTX', 'NOC', 'GD', 'BA'],
    isPublic: false
  }
});
```

### Price Alerts

```typescript
// Create alert
const alert = await prisma.priceAlert.create({
  data: {
    userId: 'clerk_user_123',
    ticker: 'PLTR',
    condition: 'price_above',
    value: 35,
    active: true
  }
});
```

### Real-time Sessions

```typescript
// Track active SSE connections
const session = await prisma.streamSession.create({
  data: {
    clientId: 'browser_session_123',
    tickers: ['LMT', 'PLTR', 'RTX'],
    expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
  }
});
```

### Terminal Command History

```typescript
// Log user commands
await prisma.terminalCommand.create({
  data: {
    userId: 'clerk_user_123',
    command: '/scan --sector AI --price-range 50-150',
    result: 'Found 12 stocks matching criteria',
    duration: 245, // ms
    status: 'success'
  }
});
```

---

## Prisma Commands

```bash
# Generate Prisma client
npm run prisma generate

# Push schema changes to database (creates/alters tables)
npm run db:push

# Create a new migration (for version control)
npm run prisma migrate dev --name add_new_models

# Apply migrations in production
npm run prisma migrate deploy

# Reset database (DANGEROUS - drops all data)
npm run prisma migrate reset

# Open Prisma Studio (GUI for database)
npm run prisma studio
```

---

## Environment Variables

Required for database functionality:

```bash
# DATABASE_URL is auto-set by Railway
# If self-hosting, set manually:
DATABASE_URL="postgresql://user:password@localhost:5432/yp_strategic_research"
```

---

## Indexing Strategy

All models include strategic indexes for fast queries:

- **Ticker lookups**: `@@index([ticker])` on StockQuote, PriceAlert
- **User queries**: `@@index([userId])` on UserWatchlist, PriceAlert, TerminalCommand
- **Time-based queries**: `@@index([createdAt, timestamp])` for analytics
- **Expiration cleanup**: `@@index([expiresAt])` for auto-cleanup queries

---

## Auto-Cleanup Jobs

Implement a cron job to clean up expired records:

```typescript
// Run daily (e.g., 2 AM UTC)
async function cleanupExpiredData() {
  const now = new Date();

  // Delete expired agent analyses
  await prisma.agentAnalysis.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  // Delete expired stream sessions
  await prisma.streamSession.deleteMany({
    where: { expiresAt: { lt: now } }
  });

  // Delete old command history (>90 days)
  await prisma.terminalCommand.deleteMany({
    where: { createdAt: { lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) } }
  });
}
```

---

## API Routes Using Database

### Watchlist Management
- **GET** `/api/watchlist?userId=...` — Retrieve user watchlists
- **POST** `/api/watchlist` — Create watchlist
- **DELETE** `/api/watchlist?id=...` — Remove watchlist

### Price Alerts
- **GET** `/api/alerts?userId=...` — Retrieve active alerts
- **POST** `/api/alerts` — Create alert
- **PATCH** `/api/alerts` — Update alert status
- **DELETE** `/api/alerts?id=...` — Remove alert

### (TODO) Other Routes
- Agent analysis caching: `/api/agent-cache`
- Stream session management: `/api/stream-sessions`
- Command history: `/api/terminal-history`

---

## Troubleshooting

### "Error: ENOENT: no such file or directory, open '.env.local'"
```bash
cp .env.example .env.local
# Add DATABASE_URL to .env.local
```

### "PrismaClientInitializationError: Cannot find a @prisma/client installation"
```bash
npm install
npm run prisma generate
```

### "Authentication failed for user"
Verify DATABASE_URL is correct:
```bash
# Railway
railway variables get DATABASE_URL

# Or check .env.local
grep DATABASE_URL .env.local
```

### Database migrations failing
```bash
# Reset to clean state (WARNING: deletes all data)
npm run prisma migrate reset

# Manually inspect schema:
npm run prisma studio
```

---

## Security Notes

- ✅ Never commit `.env.local` to git
- ✅ Use Railway environment variables for production
- ✅ Implement row-level security for user data
- ✅ Validate all user inputs before database queries
- ✅ Use prepared statements (Prisma does this automatically)

---

## Next Steps

1. **Set DATABASE_URL** on Railway
2. **Run migrations**: `railway run npm run db:push`
3. **Implement API routes** with actual Prisma queries (TODOs marked)
4. **Add authentication** to watchlist/alert endpoints (currently mock)
5. **Set up cleanup job** for expired records
6. **Monitor database usage** in Railway dashboard

---

**Last Updated**: 2026-03-25
**Schema Version**: 2.0 (Phase 8)
