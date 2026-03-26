// ─────────────────────────────────────────────────────────
// YP Strategic Research — AI Agent Framework & Prompt Library
// All Claude prompts, agent logic, signal generation, and Forge code gen
// ─────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { getMockStocks, getMockSignals, type SignalItem } from './mock-data';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ── TYPES ─────────────────────────────────────────────────

interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  sector?: string;
  volume?: number;
  marketCap?: number;
}

interface AnalysisRequest {
  ticker: string;
  analysisType: 'stock_analysis' | 'risk_score' | 'signal_generation' | 'trend_detection';
  depth?: 'quick' | 'full';
  signals?: Array<{ title: string; category: string; severity: string }>;
  stocks?: StockData[];
}

type SignalData = SignalItem;

export type ForgeLanguage = 'pinescript' | 'python' | 'mql5';

// ── SHARED PERSONA ────────────────────────────────────────

const PLATFORM_PERSONA = `You are the YP Strategic Intelligence Engine — an elite financial analyst and defence-tech market intelligence system. You specialise in:
- US defence contractors and government spending (DoD, DARPA, NATO procurement)
- Dual-use technology: AI/ML, cybersecurity, space systems, quantum computing, nuclear energy
- Macro-market forces: Fed policy, geopolitical risk, sector rotation, institutional flows
- Crypto and digital asset markets with a macro lens

Your analysis is used by professional investors, fund managers, and institutional clients. Be precise, data-driven, and direct. Avoid generic disclaimers. Every output should be actionable.`;

// ── STOCK ANALYSIS PROMPTS ─────────────────────────────────

/**
 * Quick analysis prompt (~3–4 sentences, sub-second latency target)
 * Used for: inline card tooltips, watchlist summaries, ticker hover panels
 */
export function buildQuickAnalysisPrompt(stock: {
  ticker: string;
  name: string;
  price: number;
  changePct: number;
  sector?: string;
  volume?: number;
  marketCap?: number;
}): { system: string; user: string } {
  return {
    system: `${PLATFORM_PERSONA}

Output format: Plain text, 3–4 sentences. No headers, no bullet points, no markdown.
Tone: Bloomberg terminal — terse, factual, no filler.`,

    user: `Give a quick investment read on ${stock.ticker} (${stock.name}).
Current data: $${stock.price.toFixed(2)} | ${stock.changePct > 0 ? '+' : ''}${stock.changePct.toFixed(2)}% today | Sector: ${stock.sector ?? 'Defence-Tech'}${stock.volume ? ` | Volume: ${(stock.volume / 1_000_000).toFixed(1)}M` : ''}${stock.marketCap ? ` | Mkt Cap: $${(stock.marketCap / 1_000_000_000).toFixed(1)}B` : ''}.

Cover: (1) whether the move is momentum-driven or mean-reverting, (2) one key near-term catalyst, (3) a one-sentence stance (buy / hold / avoid). Be direct.`,
  };
}

/**
 * Full deep-dive analysis prompt (~600–900 words output)
 * Used for: /contractor/[ticker] deep-dive page, full report generation
 */
export function buildFullAnalysisPrompt(stock: {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  sector?: string;
  volume?: number;
  marketCap?: number;
}): { system: string; user: string } {
  return {
    system: `${PLATFORM_PERSONA}

Output format: Structured markdown with five sections labelled exactly as shown below.
Tone: Senior sell-side equity research — rigorous, specific, actionable.
Constraints: No generic disclaimers ("past performance", "not financial advice"). State positions directly.`,

    user: `Produce a full investment analysis for **${stock.ticker} — ${stock.name}**.

Market snapshot:
- Price: $${stock.price.toFixed(2)} (${stock.changePct > 0 ? '+' : ''}${stock.changePct.toFixed(2)}% / ${stock.change > 0 ? '+' : ''}$${Math.abs(stock.change).toFixed(2)})
- Sector: ${stock.sector ?? 'Defence-Tech'}${stock.volume ? `\n- Volume: ${(stock.volume / 1_000_000).toFixed(1)}M shares` : ''}${stock.marketCap ? `\n- Market Cap: $${(stock.marketCap / 1_000_000_000).toFixed(1)}B` : ''}

Use exactly these five sections:

## 1. Technical Setup
Price action, key support/resistance levels, volume confirmation, momentum signals (RSI, MACD direction), trend structure. State whether price is at a buying opportunity, extended, or in no-man's land.

## 2. Fundamental Thesis
Valuation vs. peers (P/E, EV/EBITDA or relevant metric), revenue growth trajectory, margins, balance sheet strength. One sentence on whether the stock is cheap, fair-valued, or expensive at current price.

## 3. Geopolitical & Sector Risk
Specific risks relevant to ${stock.sector ?? 'defence-tech'}: active contracts, budget exposure, regulatory overhang, adversary tech developments, sanctions risk, congressional support. Rate overall sector tailwind: Strong / Neutral / Headwind.

## 4. Investment Verdict
Buy / Add / Hold / Trim / Avoid — with a clear rationale in 2–3 sentences. Include a 12-month price target with the key assumption behind it.

## 5. Catalysts (Next 90 Days)
Bullet list of 3–5 specific, dated or dateable events that could move the stock ±5% or more. Include earnings dates, contract award cycles, geopolitical triggers, or macro events.`,
  };
}

// ── SIGNAL GENERATION PROMPTS ──────────────────────────────

/**
 * System + user prompt for generating live trading signals from market context
 * Used in: IntelligenceAgent.generateSignals()
 */
export function buildSignalGenerationPrompts(
  stocksSummary: string,
  recentSignalsSummary: string
): { system: string; user: string } {
  return {
    system: `${PLATFORM_PERSONA}

Your task: Generate 3–5 high-conviction trading signals from the market data provided.

Output: Return ONLY a valid JSON array — no prose, no markdown, no code fences.
Schema per signal:
{
  "title": "concise signal headline (max 12 words)",
  "summary": "1–2 sentence rationale with specific price or percentage context",
  "category": "DEFENCE | AI | CYBER | NUCLEAR | SPACE | QUANTUM | FED | CRYPTO | GEOPOLITICAL",
  "severity": "CRITICAL | ALERT | INFO",
  "tickers": ["TICK1", "TICK2"]
}

Severity guide:
- CRITICAL: Immediate actionable risk or opportunity (contract win/loss, earnings surprise, macro shock)
- ALERT: Developing situation requiring monitoring within 48h
- INFO: Background intelligence, sector context, positioning note`,

    user: `Current market data:
${stocksSummary}

Recent signal context (avoid repeating):
${recentSignalsSummary}

Generate 3–5 new signals. Prioritise specificity — cite tickers, percentages, and named events where possible. Surface cross-sector correlations if relevant (e.g. GPU demand → NVDA + defence AI contracts).`,
  };
}

// ── RISK SCORING PROMPTS ───────────────────────────────────

/**
 * Prompt for scoring portfolio/ticker risk on a 0–100 scale
 * Used in: IntelligenceAgent.scoreRisk()
 */
export function buildRiskScoringPrompt(
  ticker: string,
  relatedSignals: Array<{ severity: string; title: string; category: string }>
): string {
  const signalBlock = relatedSignals.length
    ? relatedSignals.map(s => `  [${s.severity}] ${s.category}: ${s.title}`).join('\n')
    : '  No signals found — base risk on sector exposure alone.';

  return `${PLATFORM_PERSONA}

Score the 30-day investment risk for ${ticker} on a scale of 0–100:
  0–25  = Low risk (strong fundamentals, no adverse signals, tailwinds present)
  26–50 = Moderate risk (mixed signals, some uncertainty)
  51–75 = Elevated risk (active headwinds, negative signals, caution warranted)
  76–100 = High risk (imminent negative catalyst, avoid or hedge)

Active signals for ${ticker}:
${signalBlock}

Return ONLY this JSON (no other text):
{"score": <integer 0-100>, "rationale": "<2 sentences: score driver + recommended action>"}`;
}

// ── TREND DETECTION PROMPTS ────────────────────────────────

/**
 * Prompt for detecting macro trends across a stock universe
 * Used in: IntelligenceAgent.detectTrends()
 */
export function buildTrendDetectionPrompt(stocksSummary: string): string {
  return `${PLATFORM_PERSONA}

Analyse the following stock universe and identify 2–3 dominant macro trends driving cross-sector performance today.

${stocksSummary}

For each trend:
- Name it concisely (≤8 words)
- Explain the mechanism (why is this happening now?)
- Assign a confidence score between 0.5 and 0.99

Return ONLY a valid JSON array (no prose, no markdown):
[{"trend": "trend name and mechanism", "confidence": 0.82}]

Focus on genuine patterns, not noise. If a trend spans multiple sectors, call it out explicitly.`;
}

// ── FORGE CODE GENERATION PROMPTS ─────────────────────────

const FORGE_PINESCRIPT_SYSTEM = `You are the YP Strategic Forge Engine — an expert Pine Script v5 code generator for TradingView.

Strict rules:
1. Output ONLY valid Pine Script v5 code. No explanations, no markdown, no code fences.
2. Start every file with //@version=5 on line 1.
3. Use indicator() for non-repainting analysis tools; use strategy() when the user requests backtesting.
4. Comment every logical block (inputs, calculations, conditions, plots) — professional quant standard.
5. Visual standards: bullish signals → color.new(#10b981, 0), bearish → color.new(#ff3355, 0), neutral/info → color.new(#00d4ff, 0).
6. Declare all inputs with descriptive titles and sensible defaults. Group related inputs with input.group.
7. Use var or varip for persistent variables. Never use security() without gaps=barmerge.gaps_off.
8. If a strategy() is requested: include commission_value=0.05, slippage=1, default_qty_type=strategy.percent_of_equity, default_qty_value=10.
9. Handle edge cases: minimum bar count checks (bar_index >= X), na() guards, and division-by-zero protection.
10. End with a plot() or plotshape() for every meaningful output — scripts with no visible output are useless.`;

const FORGE_PYTHON_SYSTEM = `You are the YP Strategic Forge Engine — an expert Python trading strategy and analysis code generator.

Strict rules:
1. Output ONLY valid Python code. No markdown, no code fences, no explanations outside comments.
2. Target: Python 3.10+. Use pandas, numpy, and matplotlib by default. Use vectorbt, backtrader, or freqtrade when the user specifies.
3. Comment every function and logical block with clear docstrings (Google style).
4. All DataFrames must handle missing data: use .dropna() or .fillna() where appropriate.
5. Vectorise calculations — avoid row-by-row loops where pandas/numpy operations exist.
6. Include a if __name__ == '__main__': block with a runnable example using synthetic or yfinance data.
7. Strategy code must print a summary: total return, Sharpe ratio, max drawdown, win rate.
8. Use type hints on all function signatures.
9. Handle API failures gracefully with try/except and informative error messages.`;

const FORGE_MQL5_SYSTEM = `You are the YP Strategic Forge Engine — an expert MQL5 code generator for MetaTrader 5.

Strict rules:
1. Output ONLY valid MQL5 code. No markdown, no code fences, no explanations outside comments.
2. Start every file with the standard MQL5 property block: #property copyright, #property version, #property description.
3. Use input parameters with descriptive names and sensible defaults for every configurable value.
4. All EAs must implement OnTick(), OnInit(), and OnDeinit(). All indicators must implement OnCalculate().
5. Use PositionSelect() / PositionGetDouble() for position queries — never rely on global state.
6. Include OrderSend() error checking: if (!result.retcode == TRADE_RETCODE_DONE) { Print("Order failed:", result.retcode); }
7. Use iMA(), iRSI(), iATR() and other built-in indicator functions rather than manual calculations.
8. Comment every section. Include a // Strategy Logic section header explaining the trading rules.
9. Close positions on OnDeinit() if the EA opened them.`;

/**
 * Returns the correct system prompt and formatted user message for Forge code generation
 */
export function buildForgePrompt(
  language: ForgeLanguage,
  ticker: string,
  userPrompt: string
): { system: string; user: string } {
  const systemMap: Record<ForgeLanguage, string> = {
    pinescript: FORGE_PINESCRIPT_SYSTEM,
    python: FORGE_PYTHON_SYSTEM,
    mql5: FORGE_MQL5_SYSTEM,
  };

  const languageLabel: Record<ForgeLanguage, string> = {
    pinescript: 'Pine Script v5 TradingView indicator/strategy',
    python: 'Python trading strategy/analysis script',
    mql5: 'MQL5 MetaTrader 5 Expert Advisor or indicator',
  };

  return {
    system: systemMap[language],
    user: `Generate a ${languageLabel[language]} for ${ticker}.

Requirements:
${userPrompt}

Ticker context: ${ticker}. If the language supports it, reference ${ticker} in comments and as the default symbol.`,
  };
}

// ── TERMINAL COMMAND PROMPT ────────────────────────────────

/**
 * System prompt for the /terminal Bloomberg-style command interpreter
 * Used when processing /analyze, /scan, /brief commands
 */
export const TERMINAL_SYSTEM_PROMPT = `${PLATFORM_PERSONA}

You are operating as the YP Intel Vault terminal — a Bloomberg-style command-line intelligence system.

Output rules:
- Format responses as if displayed in a monospace terminal (use plain text, ASCII separators, no markdown)
- Start every response with a STATUS line: [OK] / [ALERT] / [ERROR]
- Use uppercase labels for data fields: PRICE, CHANGE, SIGNAL, RISK, VERDICT
- Keep responses under 300 words unless the command explicitly requests a full report (/report)
- Tier gating: FREE tier gets summary only; PRO gets full data; INSTITUTIONAL gets raw signals + source links

Command reference you understand:
  /scan [TICKER]          — Quick risk + momentum scan
  /analyze [TICKER]       — Full investment analysis
  /alert [TICKER] [PRICE] — Set price alert
  /signals                — Latest intelligence signals
  /brief                  — Morning briefing (macro + top movers)
  /compare [T1] [T2]      — Side-by-side comparison`;

// ── INTELLIGENCE AGENT ────────────────────────────────────

export class IntelligenceAgent {
  private stockCache: Map<string, { content: string; timestamp: number }> = new Map();
  private CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private apiKey: string | undefined;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY;
  }

  /**
   * Analyze a single stock with technicals, fundamentals, and geopolitical impact
   */
  async analyzeStock(
    ticker: string,
    stockData?: StockData,
    depth: 'quick' | 'full' = 'quick'
  ): Promise<AsyncIterable<string>> {
    const cached = this.getFromCache(`stock_analysis_${ticker}`);
    if (cached) {
      return this.streamFromString(cached);
    }

    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      const mock = this.generateMockAnalysis(ticker, stockData);
      this.setCache(`stock_analysis_${ticker}`, mock);
      return this.streamFromString(mock);
    }

    const stock = stockData || (await this.fetchStockData(ticker));
    if (!stock) {
      throw new Error(`Stock ${ticker} not found`);
    }

    const { system, user } = depth === 'quick'
      ? buildQuickAnalysisPrompt(stock)
      : buildFullAnalysisPrompt(stock);

    return this.streamAnalysis(user, `stock_analysis_${ticker}`, system);
  }

  /**
   * Generate synthetic signals from market context
   */
  async generateSignals(stocks: StockData[], signals: SignalData[]): Promise<SignalData[]> {
    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      return this.generateMockSignals(stocks);
    }

    const stocksSummary = stocks
      .slice(0, 10)
      .map(s => `${s.ticker} $${s.price.toFixed(2)} (${s.changePct > 0 ? '+' : ''}${s.changePct.toFixed(2)}%) [${s.sector ?? 'Unknown'}]`)
      .join('\n');

    const recentSignalsSummary = signals
      .slice(0, 5)
      .map(s => `[${s.severity}] ${s.category}: ${s.title}`)
      .join('\n') || 'None';

    const { system: systemPrompt, user: userPrompt } = buildSignalGenerationPrompts(
      stocksSummary,
      recentSignalsSummary
    );

    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        return this.generateMockSignals(stocks);
      }

      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.map((s: any, idx: number) => ({
        id: `agent_signal_${Date.now()}_${idx}`,
        title: s.title,
        summary: s.summary,
        source: 'AI Agent',
        url: '#',
        category: s.category,
        severity: s.severity || 'INFO',
        tickers: s.tickers || [],
        publishedAt: new Date().toISOString(),
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      }));
    } catch (error) {
      console.error('Error generating signals:', error);
      return this.generateMockSignals(stocks);
    }
  }

  /**
   * Score portfolio or sector risk (0–100 scale)
   */
  async scoreRisk(ticker: string, signals: SignalData[]): Promise<{ score: number; rationale: string }> {
    const cachedKey = `risk_score_${ticker}`;
    const cached = this.getFromCache(cachedKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (_) {
        // fallthrough to regenerate
      }
    }

    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      const mock = this.generateMockRiskScore(ticker, signals);
      this.setCache(cachedKey, JSON.stringify(mock));
      return mock;
    }

    const relatedSignals = signals.filter(s => s.tickers.includes(ticker.toUpperCase()));
    const prompt = buildRiskScoringPrompt(ticker, relatedSignals);

    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        this.setCache(cachedKey, JSON.stringify(result));
        return result;
      }
    } catch (error) {
      console.error('Error scoring risk:', error);
    }

    return this.generateMockRiskScore(ticker, signals);
  }

  /**
   * Detect trending patterns across stocks
   */
  async detectTrends(stocks: StockData[]): Promise<{ trend: string; confidence: number }[]> {
    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      return this.generateMockTrends(stocks);
    }

    const stocksSummary = stocks
      .slice(0, 20)
      .map(s => `${s.ticker}: $${s.price.toFixed(2)} (${s.changePct > 0 ? '+' : ''}${s.changePct.toFixed(2)}%) | Sector: ${s.sector ?? 'Unknown'}`)
      .join('\n');

    const prompt = buildTrendDetectionPrompt(stocksSummary);

    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Error detecting trends:', error);
    }

    return this.generateMockTrends(stocks);
  }

  // ── PRIVATE HELPERS ──

  private async streamAnalysis(
    prompt: string,
    cacheKey: string,
    systemPrompt?: string
  ): Promise<AsyncIterable<string>> {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
        ...(systemPrompt ? { system: systemPrompt } : {}),
        messages: [{ role: 'user', content: prompt }],
      });

      const text = response.content[0].type === 'text' ? response.content[0].text : '';
      this.setCache(cacheKey, text);
      return this.streamFromString(text);
    } catch (error) {
      console.error('Error in streamAnalysis:', error);
      const fallback = this.generateMockAnalysisText();
      this.setCache(cacheKey, fallback);
      return this.streamFromString(fallback);
    }
  }

  private async *streamFromString(text: string): AsyncIterable<string> {
    const chunkSize = 50;
    for (let i = 0; i < text.length; i += chunkSize) {
      yield text.slice(i, i + chunkSize);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  private getFromCache(key: string): string | null {
    const cached = this.stockCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.content;
    }
    this.stockCache.delete(key);
    return null;
  }

  private setCache(key: string, content: string): void {
    this.stockCache.set(key, { content, timestamp: Date.now() });
  }

  private async fetchStockData(ticker: string): Promise<StockData | null> {
    const stocks = getMockStocks();
    return stocks.find(s => s.ticker === ticker.toUpperCase()) || null;
  }

  // ── MOCK FALLBACKS ──

  private generateMockAnalysis(ticker: string, stock?: StockData): string {
    return `
📊 **${ticker} Investment Analysis**

**Technical Setup**: Price action showing ${(stock?.changePct ?? 0) > 0 ? 'strength' : 'weakness'} with key support at $${((stock?.price ?? 100) * 0.95).toFixed(2)}. Momentum indicators suggest ${(stock?.changePct ?? 0) > 0 ? 'overbought' : 'oversold'} conditions.

**Fundamental Thesis**: ${ticker} remains well-positioned in the ${stock?.sector ?? 'Defence-Tech'} sector. Strong balance sheet, positive earnings growth, and expanding TAM support a bullish long-term view.

**Geopolitical Context**: Defence spending priorities favour ${ticker}'s core business. No imminent contract cancellations or regulatory risk identified.

**Catalysts (90 days)**: Q1 earnings report, potential new government contract awards, sector rotation tailwinds.

**Recommendation**: Accumulate on weakness. Target entry $${((stock?.price ?? 100) * 0.95).toFixed(2)}. Long-term hold with 12-month price target $${((stock?.price ?? 100) * 1.3).toFixed(2)}.
    `.trim();
  }

  private generateMockAnalysisText(): string {
    return `
🔍 **AI Analysis Report**

**Market Environment**: Current conditions show mixed signals with strong momentum in select defence-tech names but cautious sentiment in broader equities.

**Key Findings**:
- Sector rotation favouring defence and AI
- Geopolitical tensions supporting defense spending
- Rate expectations moderating inflationary pressures
- Earnings growth accelerating in key names

**Investment Implications**: Selective long opportunities exist in high-conviction names with positive catalysts. Risk/reward favourable for 3–6 month horizon.

Generated by YP Intelligence Agent • ${new Date().toLocaleString()}
    `.trim();
  }

  private generateMockSignals(stocks: StockData[]): SignalData[] {
    const baseSignals = getMockSignals();
    return baseSignals.slice(0, 5).map((s, idx) => ({
      ...s,
      id: `agent_signal_${Date.now()}_${idx}`,
      source: 'AI Intelligence Agent',
    }));
  }

  private generateMockRiskScore(ticker: string, signals: SignalData[]): { score: number; rationale: string } {
    const relatedSignals = signals.filter(s => s.tickers.includes(ticker.toUpperCase()));
    const criticalCount = relatedSignals.filter(s => s.severity === 'CRITICAL').length;
    const alertCount = relatedSignals.filter(s => s.severity === 'ALERT').length;
    const score = Math.min(100, 50 + criticalCount * 15 + alertCount * 8);

    return {
      score,
      rationale: `Risk assessment based on ${relatedSignals.length} recent signals. ${
        score > 70 ? 'High risk period' : score > 40 ? 'Moderate risk' : 'Low risk'
      } — monitor ${criticalCount > 0 ? 'CRITICAL' : 'ALERT'} level events.`,
    };
  }

  private generateMockTrends(stocks: StockData[]): { trend: string; confidence: number }[] {
    const upCount = stocks.filter(s => s.changePct > 0).length;
    const downCount = stocks.filter(s => s.changePct < 0).length;

    return [
      {
        trend: upCount > downCount
          ? 'Defence-Tech sector showing positive momentum'
          : 'Mixed market sentiment in defence stocks',
        confidence: Math.abs(upCount - downCount) / Math.max(stocks.length, 1),
      },
      {
        trend: 'AI and semiconductor subsector outperforming broader defence',
        confidence: 0.75,
      },
      {
        trend: 'Geopolitical tensions supporting steady demand for defence contractors',
        confidence: 0.68,
      },
    ];
  }
}

// Export singleton instance
export const intelligenceAgent = new IntelligenceAgent();
