// ─────────────────────────────────────────────────────────
// /api/analyze — Stock Analysis Streaming Endpoint
// POST: { ticker, analysisType, depth? }
// Returns: Streaming text response with Claude analysis
// ─────────────────────────────────────────────────────────

import { intelligenceAgent } from '@/app/lib/agents';
import { fetchStocks, fetchSignals } from '@/app/lib/fetchers';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const { ticker, depth } = {
    ticker: searchParams.get('ticker') || '',
    depth: (searchParams.get('depth') || 'quick') as 'quick' | 'full',
  };

  if (!ticker) {
    return Response.json({ error: 'ticker required' }, { status: 400 });
  }

  try {
    // Fetch stock data
    const allStocks = await fetchStocks([ticker]);
    const stock = allStocks.find(s => s.ticker === ticker.toUpperCase());

    if (!stock) {
      return Response.json(
        { error: `Stock ${ticker} not found` },
        { status: 404 }
      );
    }

    // Get analysis stream
    const analysisStream = await intelligenceAgent.analyzeStock(
      ticker.toUpperCase(),
      stock,
      depth
    );

    // Collect all chunks
    let fullText = '';
    for await (const chunk of analysisStream) {
      fullText += chunk;
    }

    return Response.json(
      { analysis: fullText, ticker, timestamp: new Date().toISOString() },
      {
        headers: {
          'Cache-Control': 'no-cache',
        },
      }
    );
  } catch (error) {
    console.error('[API] Analysis error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Analysis failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  if (action === 'health') {
    return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
  }

  return Response.json(
    { error: 'Use POST with ticker and analysisType parameters' },
    { status: 405 }
  );
}
