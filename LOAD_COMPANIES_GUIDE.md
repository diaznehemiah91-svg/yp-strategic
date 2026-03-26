# Loading 2,600 Companies into Supabase

This guide walks through setting up the companies database and loading 2,600+ US-listed companies.

## Step 1: Create the Companies Table in Supabase

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Go to **SQL Editor** → Click **New Query**
4. Copy and paste the SQL from `supabase/migrations/001_create_companies_table.sql`
5. Click **Run** to create the table

The table will have these columns:
- `id` - Primary key
- `ticker` - Stock symbol (e.g., "NVDA", "PLTR")
- `company_name` - Full company name
- `sector` - Industry sector
- `market_cap` - Market capitalization
- `current_price` - Current stock price
- `change_pct` - Percentage change
- `created_at` / `updated_at` - Timestamps

## Step 2: Install Dependencies

Ensure TypeScript and ts-node are available:

```bash
npm install --save-dev ts-node @types/node
```

Or use `tsx` if available:

```bash
npm install --save-dev tsx
```

## Step 3: Run the Data Loading Script

Option A - Using tsx (recommended):
```bash
npx tsx scripts/load-companies.ts
```

Option B - Using ts-node:
```bash
npx ts-node scripts/load-companies.ts
```

The script will:
1. Clear existing companies (if any)
2. Fetch company data from Yahoo Finance (with fallback to mock data)
3. Insert 2,600+ companies in batches
4. Verify the load completed

Expected output:
```
Starting to load 2600 companies...
✓ Cleared existing companies
Processed 100/2600 companies
Processed 200/2600 companies
...
✓ Prepared 2600 companies
✓ Inserted batch 1 (100 companies)
...
✅ Successfully loaded 2600 companies into Supabase!
```

## Step 4: Verify the Data

Check that companies loaded successfully:

```bash
# Visit your /terminal page
npm run dev
# Navigate to http://localhost:3000/terminal
```

You should see the VirtualizedCompanyTable displaying real company data with search/filter functionality.

Or check in Supabase dashboard:
1. Go to **Table Editor**
2. Select **companies** table
3. Verify count shows 2,600+ rows

## Troubleshooting

### "Missing Supabase credentials"
- Ensure `.env.local` has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`

### "Could not connect to Supabase"
- Verify your Supabase URL is correct
- Check that the anon key is valid

### Script times out
- Yahoo Finance API has rate limits
- Script uses 1-second delays between batches
- If it keeps timing out, consider using mock data (already implemented as fallback)

### Table already exists error
- If you run the migration twice, it's okay - it uses `CREATE TABLE IF NOT EXISTS`
- To clear and reload: The script automatically clears existing data

## Data Source Notes

The script uses:
1. **Primary**: Yahoo Finance API (free, no key required)
2. **Fallback**: Generated mock data if API call fails

This ensures the load completes even if Yahoo Finance rate limits are hit. Mock data follows realistic patterns for price, market cap, and sector distribution.

## Next Steps

After companies are loaded:
1. Test the `/terminal` page with real data
2. Implement real price monitoring via Twilio SMS alerts
3. Connect Stripe webhook for subscription confirmation

See the main plan at `C:\Users\yerri\.claude\plans\fizzy-frolicking-moler.md` for next phases.
