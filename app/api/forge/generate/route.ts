import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildForgePrompt, type ForgeLanguage } from '@/app/lib/agents'

export async function POST(req: Request) {
  try {
    const { prompt, ticker, language = 'pinescript' } = await req.json()

    if (!prompt || !ticker) {
      return NextResponse.json(
        { error: 'prompt and ticker required' },
        { status: 400 }
      )
    }

    const lang = (language as ForgeLanguage) in { pinescript: 1, python: 1, mql5: 1 }
      ? (language as ForgeLanguage)
      : 'pinescript'

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      const mockScript = buildMockScript(lang, ticker, prompt)
      return NextResponse.json({ script: mockScript })
    }

    const client = new Anthropic()
    const { system: systemPrompt, user: userMessage } = buildForgePrompt(lang, ticker, prompt)

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })

    const script =
      message.content[0].type === 'text'
        ? message.content[0].text
        : '// Error: Invalid response format'

    return NextResponse.json({ script, language: lang })
  } catch (error) {
    console.error('Forge generation error:', error)
    return NextResponse.json(
      { error: 'Forge Engine Overload' },
      { status: 500 }
    )
  }
}

function buildMockScript(language: ForgeLanguage, ticker: string, prompt: string): string {
  const truncated = prompt.substring(0, 60)

  if (language === 'python') {
    return `# YP Strategic Forge — Mock Python Script (ANTHROPIC_API_KEY not configured)
# Strategy: ${truncated}...
# Ticker: ${ticker}

import pandas as pd
import numpy as np

def run_strategy(df: pd.DataFrame) -> pd.DataFrame:
    """Mock momentum strategy for ${ticker}."""
    df['ma14'] = df['close'].rolling(14).mean()
    df['ma50'] = df['close'].rolling(50).mean()
    df['signal'] = np.where(df['ma14'] > df['ma50'], 1, -1)
    df['returns'] = df['close'].pct_change() * df['signal'].shift(1)
    return df

if __name__ == '__main__':
    print("Configure ANTHROPIC_API_KEY to generate real strategies.")`
  }

  if (language === 'mql5') {
    return `// YP Strategic Forge — Mock MQL5 EA (ANTHROPIC_API_KEY not configured)
// Strategy: ${truncated}...
// Ticker: ${ticker}
#property copyright "YP Strategic Research"
#property version   "1.00"
#property description "Mock MA Crossover EA"

input int FastMA = 14;
input int SlowMA = 50;

int OnInit() { return INIT_SUCCEEDED; }

void OnTick() {
   double fast = iMA(_Symbol, PERIOD_CURRENT, FastMA, 0, MODE_SMA, PRICE_CLOSE);
   double slow = iMA(_Symbol, PERIOD_CURRENT, SlowMA, 0, MODE_SMA, PRICE_CLOSE);
   // Configure ANTHROPIC_API_KEY to generate real EA logic.
}`
  }

  // Default: Pine Script v5
  return `//@version=5
// YP Strategic Forge — Mock Pine Script (ANTHROPIC_API_KEY not configured)
// Strategy: ${truncated}...
// Ticker: ${ticker}
indicator("YP Strategic Alpha - Mock", overlay=true)

src   = close
ma14  = ta.sma(src, 14)
ma50  = ta.sma(src, 50)
long  = ta.crossover(ma14, ma50)
short = ta.crossunder(ma14, ma50)

plotshape(long,  style=shape.triangleup,   color=color.new(#10b981, 0), size=size.small, title="Buy")
plotshape(short, style=shape.triangledown, color=color.new(#ff3355, 0), size=size.small, title="Sell")
plot(ma14, "MA14", color=color.new(#00d4ff, 0))
plot(ma50, "MA50", color=color.new(#f0c040, 0))`
}
