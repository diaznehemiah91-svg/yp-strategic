# /forge

Generate a trading indicator or strategy using the Forge code generation system.

## Usage
```
/forge [TICKER] [LANGUAGE] [DESCRIPTION]
```

**Languages:** `pinescript` (default), `python`, `mql5`

## What this does

Calls `buildForgePrompt` from `app/lib/prompts.ts` with the provided ticker, language, and description, then displays the generated code block ready to copy into TradingView / MetaTrader / a Python environment.

## Instructions

Parse $ARGUMENTS as: first word = TICKER, second word = LANGUAGE (default `pinescript`), remainder = strategy description.

Import `buildForgePrompt` from `app/lib/prompts.ts`, invoke it with the parsed arguments, and output:

1. The system prompt being used (collapsed/summary)
2. The full generated code in a fenced code block with the correct language tag (`pine`, `python`, or `mql5`)
3. A brief note on how to use it (e.g. "Paste into TradingView Pine Editor → Add to chart")

If no Anthropic API key is available, show the mock script from `buildMockScript` in `app/api/forge/generate/route.ts` as a reference.
