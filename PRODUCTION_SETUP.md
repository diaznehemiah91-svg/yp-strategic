# 🔐 Production Setup Guide — YP Strategic Research

This guide walks you through connecting your deployed Vercel app to:
1. PostgreSQL database (for user data, alerts, watchlists, analytics)
2. API keys (for live market data instead of mock data)
3. Email service (for verification, alerts, and signal digests)
4. Payment system (Stripe for subscription tiers)

---

## 1️⃣ DATABASE SETUP (Critical)

### Option A: Railway PostgreSQL (Easiest)

1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the `DATABASE_URL` from the PostgreSQL tab
4. Add to Vercel:
   ```bash
   vercel env add DATABASE_URL "postgresql://user:password@host:5432/postgres"
   ```
5. Deploy schema:
   ```bash
   npm run db:push
   ```

### Option B: Vercel Postgres (No extra service)

1. In Vercel dashboard → Settings → Storage
2. Click "Create Database" → Select "Postgres"
3. Vercel auto-generates `POSTGRES_URL_NON_POOLING`
4. Update Prisma datasource:
   ```prisma
   // prisma/schema.prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL_NON_POOLING")  // <- Changed
   }
   ```
5. Deploy schema:
   ```bash
   npm run db:push
   ```

### Option C: Local PostgreSQL (Development)

```bash
# Install PostgreSQL locally
# macOS:
brew install postgresql@15

# Linux:
sudo apt-get install postgresql-15

# Windows:
# Download from https://www.postgresql.org/download/windows/

# Start server:
pg_ctl -D /usr/local/var/postgres start

# Create database:
createdb yp_strategic

# Set environment:
echo 'DATABASE_URL="postgresql://localhost:5432/yp_strategic"' >> .env.local

# Deploy schema:
npm run db:push
```

### Verify Database Connection

```bash
# Test locally:
npm run db:push
# Should output: ✓ Done in 1.23s

# Test on Vercel:
vercel env list
# Should show DATABASE_URL with green checkmark
```

---

## 2️⃣ API KEYS (For Live Data)

### Finnhub — Stock Data (CRITICAL)

1. Sign up: https://finnhub.io/register
2. Copy API key from dashboard
3. Add to Vercel:
   ```bash
   vercel env add FINNHUB_KEY "sk_live_..."
   ```
4. Used by: `/api/stock-price`, `/api/company-news`, intel-engine
5. Free tier: 60 calls/min (sufficient for demo)
6. Without this: Falls back to mock data

### NewsAPI — News & Signals

1. Sign up: https://newsapi.org/register
2. Copy API key
3. Add to Vercel:
   ```bash
   vercel env add NEWSAPI_KEY "your_key_here"
   ```
4. Free tier: 100 req/day (development only)
5. Business tier: $449/mo (unlimited)
6. Without this: Falls back to mock signals

### Alpha Vantage — Technical Analysis

1. Sign up: https://www.alphavantage.co/support/#api-key
2. Copy API key
3. Add to Vercel:
   ```bash
   vercel env add ALPHA_VANTAGE_API_KEY "your_key_here"
   ```
4. Free tier: 5 calls/min, 500/day
5. Without this: Falls back to Finnhub

### FRED — Macro/Futures Data

1. Sign up: https://fred.stlouisfed.org/docs/api/api_key.html
2. Copy API key
3. Add to Vercel:
   ```bash
   vercel env add FRED_API_KEY "your_key_here"
   ```
4. Free tier: Unlimited (US Federal Reserve data)
5. Used for: Interest rates, inflation, futures

### CoinMarketCap — Crypto Prices

1. Sign up: https://pro.coinmarketcap.com/signup
2. Copy API key (Basic tier is free, 333 calls/day)
3. Add to Vercel:
   ```bash
   vercel env add COINMARKETCAP_API_KEY "your_key_here"
   ```
4. Used for: /crypto page, digital assets
5. Without this: Falls back to mock crypto data

### Anthropic — Claude API (For Forge IDE)

1. Sign up: https://console.anthropic.com
2. Create API key
3. Add to Vercel:
   ```bash
   vercel env add ANTHROPIC_API_KEY "sk-ant-..."
   ```
4. Costs: $0.003 per 1K input tokens, $0.015 per 1K output tokens
5. Used by: `/api/forge/generate`, agents
6. Without this: Forge IDE shows mock output

### Set All At Once

```bash
vercel env add FINNHUB_KEY "sk_live_..."
vercel env add NEWSAPI_KEY "..."
vercel env add ALPHA_VANTAGE_API_KEY "..."
vercel env add FRED_API_KEY "..."
vercel env add COINMARKETCAP_API_KEY "..."
vercel env add ANTHROPIC_API_KEY "sk-ant-..."
```

---

## 3️⃣ EMAIL SERVICE (For Verification & Alerts)

### Option A: Resend (Recommended for Next.js)

1. Sign up: https://resend.com
2. Verify domain (ypstrategicresearch.com recommended)
3. Copy API key
4. Install package:
   ```bash
   npm install resend
   ```
5. Add to environment:
   ```bash
   vercel env add RESEND_API_KEY "re_..."
   ```
6. Update `app/actions/auth.ts`:
   ```typescript
   import { Resend } from 'resend'

   export async function registerUser(formData: FormData) {
     const email = formData.get('email') as string

     if (!email || !email.includes('@')) {
       return { success: false, error: 'Invalid email' }
     }

     // Save to database
     const subscriber = await db.subscriber.create({
       data: { email, tier: 'FREE', createdAt: new Date() }
     })

     // Send verification email
     const resend = new Resend(process.env.RESEND_API_KEY)
     await resend.emails.send({
       from: 'noreply@ypstrategicresearch.com',
       to: email,
       subject: 'Verify Your Y.P Strategic Research Account',
       html: `
         <h2>Welcome to Y.P Strategic Research</h2>
         <p>Click below to verify your email:</p>
         <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${subscriber.id}">
           Verify Email
         </a>
       `
     })

     return { success: true, message: 'Check your inbox' }
   }
   ```

### Option B: SendGrid

1. Sign up: https://sendgrid.com
2. Create API key
3. Install package:
   ```bash
   npm install @sendgrid/mail
   ```
4. Add to environment:
   ```bash
   vercel env add SENDGRID_API_KEY "SG...."
   ```
5. Use in code:
   ```typescript
   import sgMail from '@sendgrid/mail'

   sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

   await sgMail.send({
     to: email,
     from: 'noreply@ypstrategicresearch.com',
     subject: 'Verify Your Account',
     html: `<a href="${verifyUrl}">Verify</a>`
   })
   ```

### Option C: Mailgun

1. Sign up: https://www.mailgun.com
2. Create API key
3. Install package:
   ```bash
   npm install mailgun.js form-data
   ```
4. Add to environment:
   ```bash
   vercel env add MAILGUN_API_KEY "key-..."
   vercel env add MAILGUN_DOMAIN "mg.ypstrategicresearch.com"
   ```

---

## 4️⃣ PAYMENT SYSTEM (Stripe)

### Setup Stripe Account

1. Go to https://dashboard.stripe.com/register
2. Create account and verify email
3. Get API keys from Settings → API Keys:
   - **Publishable key** (starts with `pk_live_`)
   - **Secret key** (starts with `sk_live_`)

### Add to Environment

```bash
vercel env add STRIPE_SECRET_KEY "sk_live_..."
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_live_..."
vercel env add STRIPE_WEBHOOK_SECRET "whsec_..."  # See next step
```

### Setup Webhook

1. Go to Settings → Webhooks
2. Click "Add endpoint"
3. URL: `https://ypstrategicresearch.com/api/webhook/stripe`
4. Events: `checkout.session.completed`, `customer.subscription.updated`
5. Copy signing secret (starts with `whsec_`)
6. Add as `STRIPE_WEBHOOK_SECRET`

### Create Products in Stripe Dashboard

```
PRO Subscription:
- Name: Y.P Strategic Research PRO
- Price: $29.00/month
- Billing period: Monthly

INSTITUTIONAL Subscription:
- Name: Y.P Strategic Research INSTITUTIONAL
- Price: $199.00/month
- Billing period: Monthly
```

### Implement Checkout Endpoint

Create `app/api/checkout/route.ts`:

```typescript
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const { email, priceId, tier } = await req.json()

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId, // From Stripe dashboard
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: email,
    metadata: { tier }
  })

  return NextResponse.json({ sessionId: session.id })
}
```

### Create Webhook Handler

Create `app/api/webhook/stripe/route.ts`:

```typescript
import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature')!
  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Upgrade subscriber tier
    await db.subscriber.update({
      where: { email: session.customer_email! },
      data: {
        stripeId: session.customer,
        tier: session.metadata?.tier || 'PRO'
      }
    })
  }

  return NextResponse.json({ received: true })
}
```

---

## 5️⃣ IMPLEMENT AUTH DATABASE INTEGRATION

### Update `app/actions/auth.ts`

```typescript
'use server'

import { db } from '@/lib/db'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email' }
  }

  try {
    // Check if already registered
    const existing = await db.subscriber.findUnique({
      where: { email }
    })

    if (existing) {
      return { success: false, error: 'Email already registered' }
    }

    // Save to database
    const subscriber = await db.subscriber.create({
      data: {
        email,
        tier: 'FREE',
        createdAt: new Date()
      }
    })

    // Send verification email (if Resend configured)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import('resend')
      const resend = new Resend(process.env.RESEND_API_KEY)

      await resend.emails.send({
        from: 'noreply@ypstrategicresearch.com',
        to: email,
        subject: 'Verify Your Y.P Strategic Research Account',
        html: `
          <h2>Welcome to Y.P Strategic Research</h2>
          <p>Your registration is complete!</p>
          <p><strong>Tier:</strong> FREE ($0)</p>
          <p>Explore the platform and upgrade to PRO ($29/mo) for advanced features.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing">View Plans</a>
        `
      })
    }

    return { success: true, message: 'Registration successful' }
  } catch (error) {
    console.error('[AUTH ERROR]', error)
    return { success: false, error: 'Registration failed' }
  }
}
```

### Create `lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['warn', 'error']
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

---

## 6️⃣ WATCHLISTS & PRICE ALERTS

### Update `app/api/watchlist/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET user watchlists
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const watchlists = await db.userWatchlist.findMany({
    where: { userId }
  })

  return NextResponse.json(watchlists)
}

// POST create watchlist
export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, tickers } = await req.json()

  const watchlist = await db.userWatchlist.create({
    data: { userId, name, tickers }
  })

  return NextResponse.json(watchlist)
}
```

### Update `app/api/alerts/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// POST create price alert
export async function POST(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { ticker, condition, value } = await req.json()

  const alert = await db.priceAlert.create({
    data: {
      userId,
      ticker,
      condition, // "price_above", "price_below", "volume_spike"
      value,
      active: true
    }
  })

  return NextResponse.json(alert)
}

// GET user alerts
export async function GET(req: NextRequest) {
  const userId = req.headers.get('x-user-id')
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const alerts = await db.priceAlert.findMany({
    where: { userId, active: true }
  })

  return NextResponse.json(alerts)
}
```

---

## 7️⃣ VERIFY EVERYTHING WORKS

### Test Locally

```bash
# 1. Set DATABASE_URL in .env.local
echo 'DATABASE_URL="postgresql://localhost:5432/yp_strategic"' >> .env.local

# 2. Push schema
npm run db:push

# 3. Start dev server
npm run dev

# 4. Test registration
# - Visit http://localhost:3000
# - Click Sign In
# - Enter email
# - Check database:
psql -U postgres -d yp_strategic -c "SELECT * FROM \"Subscriber\";"
```

### Test on Vercel

```bash
# 1. Ensure DATABASE_URL is set
vercel env list

# 2. Redeploy (or it auto-deploys after git push)
git push origin main

# 3. Check Vercel logs
vercel logs

# 4. Test registration on live site
# - Visit https://yp-strategic.vercel.app
# - Click Sign In
# - Enter email
# - Verify in Vercel Postgres dashboard or via psql
```

---

## 8️⃣ MONITORING & LOGS

### View Vercel Logs

```bash
vercel logs --name yp-strategic
```

### View Prisma Query Logs

Update `lib/db.ts`:

```typescript
new PrismaClient({
  log: ['query', 'error', 'warn'] // Add 'query' to see all DB operations
})
```

### Database Monitoring

For Railway or Vercel Postgres:
- Dashboard shows query performance
- Alerts for high CPU/memory
- Automatic backups enabled

---

## 9️⃣ SECURITY CHECKLIST

- [ ] All API keys stored as environment variables (never in code)
- [ ] DATABASE_URL uses strong password (50+ random chars)
- [ ] Stripe webhook secret stored securely
- [ ] CORS configured (only your domain)
- [ ] Rate limiting enabled (prevent brute force)
- [ ] Email verification before account activation
- [ ] SSL/TLS enabled (automatic with Vercel)
- [ ] HTTPS enforced (automatic with Vercel)
- [ ] Database backups scheduled (Railway/Vercel handle this)

---

## 🔟 TROUBLESHOOTING

**"DATABASE_URL is missing"**
→ Set it via `vercel env add DATABASE_URL "..."`

**"Prisma client can't connect"**
→ Check DATABASE_URL format: `postgresql://user:password@host:port/dbname`

**"Email not sending"**
→ Verify RESEND_API_KEY is set and domain is verified

**"Stripe webhook failing"**
→ Check webhook URL is correct: `/api/webhook/stripe`
→ Verify STRIPE_WEBHOOK_SECRET is set

**"Build failing on Vercel"**
→ Run locally: `npm run build`
→ Check for TypeScript errors: `npm run type-check`

---

## Next Steps

1. ✅ Deploy to Vercel (DONE)
2. → Create PostgreSQL database
3. → Set DATABASE_URL on Vercel
4. → Add API keys (Finnhub, etc.)
5. → Setup Resend for emails
6. → Setup Stripe (optional for monetization)
7. → Test registration flow end-to-end
8. → Monitor user registrations in database
9. → Implement payment tier upgrades
10. → Scale to production

You're now ready to move from demo to production! 🚀
