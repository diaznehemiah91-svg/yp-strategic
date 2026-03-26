# /add-ticker

Add a new stock ticker to the YP Strategic platform.

## Usage
```
/add-ticker [TICKER] [SECTOR]
```

**Sectors:** `DEFENCE`, `AI`, `CYBER`, `NUCLEAR`, `SPACE`, `QUANTUM`, `CRYPTO`

## What this does

Adds a new ticker entry to `app/lib/mock-data.ts` with realistic placeholder data, so the ticker appears throughout the dashboard, signal feed, and analysis pages immediately — even without a live API key.

## Instructions

Parse $ARGUMENTS: first word = TICKER (uppercase), second word = SECTOR.

Then:

1. Read `app/lib/mock-data.ts` and find the `getMockStocks()` function
2. Add a new entry to the stocks array with this shape:
```ts
{
  ticker: 'TICK',
  name: 'Company Full Name',
  price: 100.00,       // realistic price for the sector
  change: 1.50,
  changePct: 1.52,
  volume: 1_200_000,
  marketCap: 5_000_000_000,
  sector: 'SECTOR',
  pe: 25,
  beta: 1.2,
}
```
3. Also add the ticker to the relevant sector array in `COVERED_ASSETS` at the bottom of the file if one exists
4. Confirm the addition and remind the user to restart the dev server (`npm run dev`) to see changes

Do not modify any other files. Do not run the dev server automatically.
