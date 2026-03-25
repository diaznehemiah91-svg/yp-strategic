import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: Request) {
  try {
    const { prompt, ticker } = await req.json()

    if (!prompt || !ticker) {
      return NextResponse.json(
        { error: 'prompt and ticker required' },
        { status: 400 }
      )
    }

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      // Fallback to mock Pine Script
      const mockScript = `// Mock Pine Script - API Key Not Configured
// Replace with real implementation when ANTHROPIC_API_KEY is set

//@version=5
indicator("YP Strategic Alpha - Mock", overlay=true)

// Mock Strategy: ${prompt.substring(0, 50)}...
// Ticker: ${ticker}

src = close
ma14 = ta.sma(src, 14)
ma50 = ta.sma(src, 50)

long = ta.crossover(ma14, ma50)
short = ta.crossunder(ma14, ma50)

plotshape(long, style=shape.triangleup, color=color.new(color.green, 0), size=size.small, title="Buy Signal")
plotshape(short, style=shape.triangledown, color=color.new(color.red, 0), size=size.small, title="Sell Signal")

plot(ma14, "MA14", color=color.blue)
plot(ma50, "MA50", color=color.orange)`

      return NextResponse.json({ script: mockScript })
    }

    const client = new Anthropic()

    const systemPrompt = `You are the YP Strategic Forge AI - an expert Pine Script v5 code generator for TradingView.

Rules:
1. ONLY output valid Pine Script v5 code - no explanations, markdown, or extra text
2. Use indicator() for technical analysis or strategy() for trading logic
3. Add clear comments explaining each section (indicators, conditions, signals)
4. Incorporate the ticker ${ticker} in comments if relevant
5. Use professional colors: #10b981 (emerald) for bullish, #ff3355 (red) for bearish
6. Include proper error handling and edge cases
7. Make the code production-ready

DO NOT include markdown code blocks. Output ONLY the Pine Script code.`

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a Pine Script v5 indicator/strategy for ${ticker} with the following requirements:\n\n${prompt}`,
        },
      ],
    })

    const script =
      message.content[0].type === 'text'
        ? message.content[0].text
        : '// Error: Invalid response format'

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Forge generation error:', error)
    return NextResponse.json(
      { error: 'Forge Engine Overload' },
      { status: 500 }
    )
  }
}
