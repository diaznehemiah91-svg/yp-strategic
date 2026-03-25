// ─────────────────────────────────────────────────────────
// /api/stream/stocks — Server-Sent Events Endpoint
// Streams live stock prices every 5 seconds
// ─────────────────────────────────────────────────────────

import { fetchStocks } from '@/app/lib/fetchers';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  // Create encoder for SSE format
  const encoder = new TextEncoder();

  // Check if client provided specific tickers to stream
  const url = new URL(request.url);
  const tickers = url.searchParams.get('tickers')?.split(',') || [];

  const responseStream = new ReadableStream({
    async start(controller) {
      try {
        let updateCount = 0;
        const maxUpdates = 120; // 10 minutes with 5-second intervals

        while (updateCount < maxUpdates && !request.signal.aborted) {
          try {
            // Fetch latest stock data
            const allStocks = await fetchStocks();

            // Filter to requested tickers if specified
            const stocks =
              tickers.length > 0
                ? allStocks.filter(s =>
                    tickers.some(t => t.toUpperCase() === s.ticker)
                  )
                : allStocks.slice(0, 20);

            // Format as SSE message
            const data = {
              timestamp: new Date().toISOString(),
              stocks: stocks.map(s => ({
                ticker: s.ticker,
                price: s.price,
                change: s.change,
                changePct: s.changePct,
              })),
            };

            const message = `data: ${JSON.stringify(data)}\n\n`;
            controller.enqueue(encoder.encode(message));

            updateCount++;

            // Wait 5 seconds before next update
            await new Promise(resolve => setTimeout(resolve, 5000));
          } catch (error) {
            console.error('Error in stream loop:', error);
            // Continue with next iteration on error
            await new Promise(resolve => setTimeout(resolve, 5000));
          }
        }

        // Close stream after max updates
        controller.close();
      } catch (error) {
        console.error('Stream setup error:', error);
        const errorMsg = `data: ${JSON.stringify({ error: 'Stream error' })}\n\n`;
        controller.enqueue(encoder.encode(errorMsg));
        controller.close();
      }
    },
  });

  return new Response(responseStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
