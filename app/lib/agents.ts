// ─────────────────────────────────────────────────────────
// YP Strategic Research — AI Agent Framework
// Claude-powered agents for stock analysis, signal generation, risk scoring
// ─────────────────────────────────────────────────────────

import Anthropic from '@anthropic-ai/sdk';
import { getMockStocks, getMockSignals, type SignalItem } from './mock-data';
import {
  buildQuickAnalysisPrompt,
  buildFullAnalysisPrompt,
  buildSignalGenerationPrompts,
  buildRiskScoringPrompt,
  buildTrendDetectionPrompt,
} from './prompts';

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

  private buildQuickAnalysisPrompt(stock: StockData): string {
    const { user } = buildQuickAnalysisPrompt(stock);
    return user;
  }

  private buildFullAnalysisPrompt(stock: StockData): string {
    const { user } = buildFullAnalysisPrompt(stock);
    return user;
  }

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
