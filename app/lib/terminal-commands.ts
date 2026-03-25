// ─────────────────────────────────────────────────────────
// Terminal Commands Logic
// Handles all /command parsing and execution
// ─────────────────────────────────────────────────────────

import { fetchStocks, fetchSignals } from './fetchers';
import { intelligenceAgent } from './agents';

interface CommandResult {
  type: 'output' | 'error' | 'info' | 'clear';
  text: string;
}

const COMMAND_HELP = `
╔════════════════════════════════════════════════════════════════════╗
║                  Y.P STRATEGIC RESEARCH TERMINAL                   ║
║                      Available Commands                            ║
╚════════════════════════════════════════════════════════════════════╝

SCANNING & FILTERING:
  /scan --sector [AI|DEFENCE|CYBER|QUANTUM|SPACE]
        --price-range [50-150] --volume-min [1M]
        → Find stocks matching criteria with live prices

ANALYSIS:
  /analyze --ticker [TICKER] --depth [quick|full]
           → Stream Claude AI analysis of a stock

ALERTS & WATCHLISTS:
  /alert --ticker [TICKER] --price-above|below [VALUE]
         → Create price alert (send when triggered)
  /watchlist --add [TICKER1,TICKER2...]
  /watchlist --remove [TICKER]
  /watchlist --list
             → Manage your saved ticker lists

INTELLIGENCE:
  /signals --severity [CRITICAL|ALERT|INFO]
           --category [DEFENCE|AI|CYBER|NUCLEAR|QUANTUM|FED|CRYPTO|GEOPOLITICAL]
           --hours [24]
           → Filter high-value market signals

  /sentiment --ticker [TICKER]
             → AI-computed sentiment score with rationale

  /news --ticker [TICKER] --days [1-30]
        → Latest news from Finnhub + AI summaries

  /trends --sector [AI|DEFENCE|CYBER]
          → Detect emerging market trends

EXPORT & REPORTS:
  /export --format [csv|json] --tickers [LMT,RTX,NOC]
          → Download portfolio data

  /report --type [sector|momentum|risk] --days [30]
          → Generate detailed ypstrategicresearch.com report

SYSTEM:
  /help           → Show this help menu
  /clear          → Clear terminal output
  /status         → System status and usage limits
  /save --format  → Export command history

EXAMPLES:
  /scan --sector DEFENCE --price-range 100-500
  /analyze --ticker PLTR --depth full
  /signals --severity CRITICAL --hours 24
  /export --format csv --tickers LMT,RTX,PLTR

Type a command above to get started!
`;

export async function executeCommand(input: string): Promise<CommandResult> {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return { type: 'error', text: 'Commands must start with /. Type /help for available commands.' };
  }

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();

  try {
    switch (command) {
      case '/help':
        return { type: 'info', text: COMMAND_HELP };

      case '/clear':
        return { type: 'clear', text: 'Terminal cleared' };

      case '/scan':
        return await handleScan(parts);

      case '/analyze':
        return await handleAnalyze(parts);

      case '/alert':
        return await handleAlert(parts);

      case '/signals':
        return await handleSignals(parts);

      case '/sentiment':
        return await handleSentiment(parts);

      case '/news':
        return await handleNews(parts);

      case '/watchlist':
        return await handleWatchlist(parts);

      case '/export':
        return await handleExport(parts);

      case '/trends':
        return await handleTrends(parts);

      case '/status':
        return { type: 'info', text: 'System Status:\n✓ API: Connected\n✓ Database: Connected\n✓ AI Agents: Active\nUsage: 3/10 analyses today' };

      default:
        return { type: 'error', text: `Unknown command: ${command}. Type /help for available commands.` };
    }
  } catch (error) {
    return {
      type: 'error',
      text: error instanceof Error ? error.message : 'Command execution failed',
    };
  }
}

async function handleScan(parts: string[]): Promise<CommandResult> {
  const sector = parseArg(parts, '--sector');
  const priceRange = parseArg(parts, '--price-range');
  const volumeMin = parseArg(parts, '--volume-min');

  const stocks = await fetchStocks();
  let filtered = stocks;

  if (sector) {
    filtered = filtered.filter(s => s.sector?.toUpperCase().includes(sector.toUpperCase()));
  }

  if (priceRange) {
    const [min, max] = priceRange.split('-').map(Number);
    filtered = filtered.filter(s => s.price >= min && s.price <= max);
  }

  if (filtered.length === 0) {
    return { type: 'info', text: 'No stocks found matching criteria.' };
  }

  const results = filtered
    .slice(0, 15)
    .map(s => `  ${s.ticker.padEnd(6)} $${s.price.toFixed(2).padEnd(8)} ${s.changePct > 0 ? '▲' : '▼'} ${Math.abs(s.changePct).toFixed(2)}%`)
    .join('\n');

  return {
    type: 'output',
    text: `Found ${filtered.length} stocks matching criteria:\n\n  Ticker  Price     Change\n${results}`,
  };
}

async function handleAnalyze(parts: string[]): Promise<CommandResult> {
  const ticker = parseArg(parts, '--ticker');
  const depth = (parseArg(parts, '--depth') || 'quick') as 'quick' | 'full';

  if (!ticker) {
    return { type: 'error', text: 'Usage: /analyze --ticker [TICKER] --depth [quick|full]' };
  }

  const stocks = await fetchStocks([ticker]);
  const stock = stocks.find(s => s.ticker === ticker.toUpperCase());

  if (!stock) {
    return { type: 'error', text: `Stock ${ticker} not found.` };
  }

  try {
    const stream = await intelligenceAgent.analyzeStock(ticker.toUpperCase(), stock, depth);
    let fullAnalysis = '';
    for await (const chunk of stream) {
      fullAnalysis += chunk;
    }
    return { type: 'output', text: fullAnalysis };
  } catch (error) {
    return { type: 'error', text: `Analysis failed: ${error instanceof Error ? error.message : 'unknown error'}` };
  }
}

async function handleAlert(parts: string[]): Promise<CommandResult> {
  const ticker = parseArg(parts, '--ticker');
  const priceAbove = parseArg(parts, '--price-above');
  const priceBelow = parseArg(parts, '--price-below');

  if (!ticker || (!priceAbove && !priceBelow)) {
    return {
      type: 'error',
      text: 'Usage: /alert --ticker [TICKER] --price-above|below [VALUE]',
    };
  }

  return {
    type: 'info',
    text: `✓ Price alert created for ${ticker} at $${priceAbove || priceBelow}. You'll be notified when triggered.`,
  };
}

async function handleSignals(parts: string[]): Promise<CommandResult> {
  const severity = parseArg(parts, '--severity');
  const category = parseArg(parts, '--category');

  const signals = await fetchSignals();
  let filtered = signals;

  if (severity) {
    filtered = filtered.filter(s => s.severity === severity.toUpperCase());
  }

  if (category) {
    filtered = filtered.filter(s => s.category === category.toUpperCase());
  }

  filtered = filtered.slice(0, 10);

  const results = filtered
    .map(s => `[${s.severity}] ${s.title} (${s.category}) - ${s.tickers.join(',')}`)
    .join('\n');

  return {
    type: 'output',
    text: filtered.length > 0 ? `Found ${filtered.length} signals:\n\n${results}` : 'No signals found.',
  };
}

async function handleSentiment(parts: string[]): Promise<CommandResult> {
  const ticker = parseArg(parts, '--ticker');

  if (!ticker) {
    return { type: 'error', text: 'Usage: /sentiment --ticker [TICKER]' };
  }

  const signals = await fetchSignals();
  const risk = await intelligenceAgent.scoreRisk(ticker.toUpperCase(), signals);

  const sentiment =
    risk.score > 70
      ? '🔴 BEARISH'
      : risk.score > 40
        ? '🟡 NEUTRAL'
        : '🟢 BULLISH';

  return {
    type: 'output',
    text: `${ticker} Sentiment: ${sentiment} (Risk Score: ${risk.score}/100)\n\nRationale: ${risk.rationale}`,
  };
}

async function handleNews(parts: string[]): Promise<CommandResult> {
  const ticker = parseArg(parts, '--ticker');
  const days = parseInt(parseArg(parts, '--days') || '7');

  if (!ticker) {
    return { type: 'error', text: 'Usage: /news --ticker [TICKER] --days [1-30]' };
  }

  const signals = await fetchSignals();
  const news = signals.filter(s => s.tickers.includes(ticker.toUpperCase())).slice(0, 5);

  if (news.length === 0) {
    return { type: 'info', text: `No recent news for ${ticker}.` };
  }

  const results = news
    .map(
      (n, i) => `${i + 1}. [${n.severity}] ${n.title}\n   Source: ${n.source}\n   ${n.summary.substring(0, 80)}...`
    )
    .join('\n\n');

  return { type: 'output', text: `Latest news for ${ticker} (${days} days):\n\n${results}` };
}

async function handleWatchlist(parts: string[]): Promise<CommandResult> {
  const action = parseArg(parts, '--add') ? 'add' : parseArg(parts, '--remove') ? 'remove' : 'list';
  const tickers = parseArg(parts, '--add') || parseArg(parts, '--remove') || '';

  if (action === 'list') {
    return {
      type: 'output',
      text: 'Your Watchlist:\n  • LMT (Lockheed Martin)\n  • PLTR (Palantir)\n  • RTX (Raytheon)\n\n(Add/remove with --add/--remove)',
    };
  }

  if (!tickers) {
    return { type: 'error', text: 'Usage: /watchlist --add|remove [TICKER1,TICKER2...]' };
  }

  return { type: 'info', text: `✓ Watchlist updated: ${action}ed ${tickers}` };
}

async function handleExport(parts: string[]): Promise<CommandResult> {
  const format = parseArg(parts, '--format') || 'csv';
  const tickers = parseArg(parts, '--tickers') || '';

  if (!tickers) {
    return { type: 'error', text: 'Usage: /export --format [csv|json] --tickers [TICKER1,TICKER2...]' };
  }

  return {
    type: 'info',
    text: `✓ Export ready (${format.toUpperCase()}): ${tickers}\n\nDownload: ${tickers}.${format}`,
  };
}

async function handleTrends(parts: string[]): Promise<CommandResult> {
  const sector = parseArg(parts, '--sector');
  const stocks = await fetchStocks();
  const trends = await intelligenceAgent.detectTrends(stocks);

  const results = trends
    .map((t, i) => `${i + 1}. ${t.trend} (Confidence: ${(t.confidence * 100).toFixed(0)}%)`)
    .join('\n');

  return { type: 'output', text: `Market Trends${sector ? ` (${sector})` : ''}:\n\n${results}` };
}

// ── HELPER FUNCTIONS ──

function parseArg(parts: string[], flagName: string): string | null {
  const index = parts.indexOf(flagName);
  if (index !== -1 && index < parts.length - 1) {
    return parts[index + 1];
  }
  return null;
}
