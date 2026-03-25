// ─────────────────────────────────────────────────────────
// YP Strategic Research — AI Agent Framework
// Claude-powered agents for stock analysis, signal generation, risk scoring
// ─────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { getMockStocks, getMockSignals, type SignalItem } from './mock-data';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

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
    // Check cache first
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

    const prompt = depth === 'quick'
      ? this.buildQuickAnalysisPrompt(stock)
      : this.buildFullAnalysisPrompt(stock);

    return this.streamAnalysis(prompt, `stock_analysis_${ticker}`);
  }

  /**
   * Generate synthetic signals from market context
   */
  async generateSignals(stocks: StockData[], signals: SignalData[]): Promise<SignalData[]> {
    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      return this.generateMockSignals(stocks);
    }

    const systemPrompt = `You are a defense-tech market intelligence analyst. Generate 3-5 high-value trading signals based on the current market context. Return ONLY a JSON array with no markdown formatting:
[
  {
    "title": "signal title",
    "summary": "brief explanation",
    "category": "DEFENCE|AI|CYBER|NUCLEAR|SPACE|QUANTUM|FED|CRYPTO|GEOPOLITICAL",
    "severity": "CRITICAL|ALERT|INFO",
    "tickers": ["LMT", "PLTR"]
  }
]`;

    const userPrompt = `Current stocks: ${stocks
      .slice(0, 10)
      .map(s => `${s.ticker} $${s.price} (${s.changePct > 0 ? '+' : ''}${s.changePct.toFixed(2)}%)`)
      .join(', ')}

Recent signals: ${signals
      .slice(0, 5)
      .map(s => `${s.category}: ${s.title}`)
      .join('; ')}

Generate 3 new trading signals based on these patterns.`;

    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 1024,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt,
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
   * Score portfolio or sector risk (0-100 scale)
   */
  async scoreRisk(ticker: string, signals: SignalData[]): Promise<{ score: number; rationale: string }> {
    const cachedKey = `risk_score_${ticker}`;
    const cached = this.getFromCache(cachedKey);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        // If JSON parse fails, regenerate
      }
    }

    if (!this.apiKey || this.apiKey === 'your_anthropic_key_here') {
      const mock = this.generateMockRiskScore(ticker, signals);
      this.setCache(cachedKey, JSON.stringify(mock));
      return mock;
    }

    const relatedSignals = signals.filter(s => s.tickers.includes(ticker.toUpperCase()));

    const prompt = `Rate the risk level (0-100) for ${ticker} based on these recent signals:
${relatedSignals.map(s => `- [${s.severity}] ${s.title} (${s.category})`).join('\n')}

Return ONLY this JSON format: {"score": 65, "rationale": "brief explanation"}`;

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

    const prompt = `Analyze these stocks and identify 2-3 major market trends:
${stocks
  .slice(0, 20)
  .map(s => `${s.ticker}: $${s.price.toFixed(2)} (${s.changePct > 0 ? '+' : ''}${s.changePct.toFixed(2)}%), Sector: ${s.sector || 'Unknown'}`)
  .join('\n')}

Return ONLY JSON: [{"trend": "description", "confidence": 0.85}]`;

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

  private buildQuickAnalysisPrompt(stock: StockData): string {
    return `Provide a 1-paragraph investment thesis for ${stock.ticker} (${stock.name}) currently trading at $${stock.price.toFixed(
      2
    )} (${stock.changePct > 0 ? '+' : ''}${stock.changePct.toFixed(2)}%).

Focus on:
1. Current momentum (is it oversold/overbought?)
2. Sector context (${stock.sector || 'Defence-Tech'})
3. Key catalysts ahead

Keep response concise (3-4 sentences).`;
  }

  private buildFullAnalysisPrompt(stock: StockData): string {
    return `Provide a comprehensive analysis for ${stock.ticker} (${stock.name}) at $${stock.price.toFixed(2)}:

1. **Technical Analysis** - Price action, momentum, support/resistance levels
2. **Fundamental Analysis** - Valuation, growth prospects, competitive position
3. **Geopolitical Risk** - Defense/tech sector-specific risks (contracts, sanctions, cyber threats)
4. **Investment Thesis** - Should a long-term investor buy, hold, or sell?
5. **Catalysts** - What events in the next 90 days could move the price?

Structure your response with these 5 sections. Be specific and actionable.`;
  }

  private async streamAnalysis(
    prompt: string,
    cacheKey: string
  ): Promise<AsyncIterable<string>> {
    // For now, we'll do non-streaming to avoid complexity
    // In production, you'd use streaming: true and handle chunks
    try {
      const response = await anthropic.messages.create({
        model: 'claude-opus-4-6',
        max_tokens: 2048,
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
    // Simulate streaming by yielding chunks
    const chunkSize = 50;
    for (let i = 0; i < text.length; i += chunkSize) {
      yield text.slice(i, i + chunkSize);
      // Small delay to simulate network latency
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

  // ── MOCK GENERATORS (Fallback) ──

  private generateMockAnalysis(ticker: string, stock?: StockData): string {
    const mockStock = stock || getMockStocks().find(s => s.ticker === ticker);
    return `
📊 **${ticker} Investment Analysis**

**Technical Setup**: Price action showing ${stock?.changePct || 0 > 0 ? 'strength' : 'weakness'} with key support at $${(stock?.price || 100) * 0.95}. Momentum indicators suggest ${stock?.changePct || 0 > 0 ? 'overbought' : 'oversold'} conditions.

**Fundamental Thesis**: ${ticker} remains well-positioned in the ${stock?.sector || 'Defence-Tech'} sector. Strong balance sheet, positive earnings growth, and expanding TAM support a bullish long-term view.

**Geopolitical Context**: Defence spending priorities favor ${ticker}'s core business. No imminent contract cancellations or regulatory risk identified.

**Catalysts (90 days)**: Q1 earnings report, potential new government contract awards, sector rotation tailwinds.

**Recommendation**: Accumulate on weakness. Target entry $${(stock?.price || 100) * 0.95}. Long-term hold with 12-month price target $${(stock?.price || 100) * 1.3}.
    `.trim();
  }

  private generateMockAnalysisText(): string {
    return `
🔍 **AI Analysis Report**

This comprehensive analysis examines key market drivers and risk factors influencing the current investment landscape.

**Market Environment**: Current conditions show mixed signals with strong momentum in select defence-tech names but cautious sentiment in broader equities.

**Key Findings**:
- Sector rotation favoring defence and AI
- Geopolitical tensions supporting defense spending
- Rate expectations moderating inflationary pressures
- Earnings growth accelerating in key names

**Investment Implications**: Selective long opportunities exist in high-conviction names with positive catalysts. Risk/reward favorable for 3-6 month horizon.

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

    const baseScore = 50;
    const riskFromSignals = criticalCount * 15 + alertCount * 8;
    const score = Math.min(100, baseScore + riskFromSignals);

    return {
      score,
      rationale: `Risk assessment based on ${relatedSignals.length} recent signals. ${
        score > 70 ? 'High risk period' : score > 40 ? 'Moderate risk' : 'Low risk'
      } - monitor ${criticalCount > 0 ? 'CRITICAL' : 'ALERT'} level events.`,
    };
  }

  private generateMockTrends(stocks: StockData[]): { trend: string; confidence: number }[] {
    const upTrends = stocks.filter(s => s.changePct > 0).length;
    const downTrends = stocks.filter(s => s.changePct < 0).length;

    return [
      {
        trend: upTrends > downTrends ? 'Defence-Tech sector showing positive momentum' : 'Mixed market sentiment in defence stocks',
        confidence: Math.abs(upTrends - downTrends) / stocks.length,
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
