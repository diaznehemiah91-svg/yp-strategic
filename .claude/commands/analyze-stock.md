# /analyze-stock

Perform a full investment analysis on a given ticker in this codebase.

## Usage
```
/analyze-stock [TICKER]
```

## What this does

1. Reads `app/lib/agents.ts` and `app/lib/prompts.ts` to understand the analysis pipeline
2. Checks `app/lib/mock-data.ts` for available stock data on $ARGUMENTS
3. Calls `buildFullAnalysisPrompt` with the stock data
4. Produces a structured 5-section analysis: Technical Setup, Fundamental Thesis, Geopolitical & Sector Risk, Investment Verdict, Catalysts

## Instructions

Search `app/lib/mock-data.ts` for the ticker "$ARGUMENTS". Extract the stock's price, changePct, sector, and any other available fields.

Then call `buildFullAnalysisPrompt` from `app/lib/prompts.ts` with those values and display the resulting analysis in a formatted markdown block.

If the ticker is not found in mock data, state that clearly and suggest the user add it to `app/lib/mock-data.ts` or enable live data via `FINNHUB_KEY`.
