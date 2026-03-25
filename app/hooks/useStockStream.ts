// ─────────────────────────────────────────────────────────
// useStockStream — Hook for consuming SSE stock data
// Replaces polling with real-time updates (5-second intervals)
// ─────────────────────────────────────────────────────────

import { useEffect, useState } from 'react';

interface StreamStock {
  ticker: string;
  price: number;
  change: number;
  changePct: number;
}

interface StreamData {
  timestamp: string;
  stocks: StreamStock[];
}

export function useStockStream(tickers?: string[]) {
  const [stocks, setStocks] = useState<StreamStock[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      const url = new URL('/api/stream/stocks', typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
      if (tickers && tickers.length > 0) {
        url.searchParams.set('tickers', tickers.join(','));
      }

      eventSource = new EventSource(url.toString());

      eventSource.onopen = () => {
        setIsConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event: MessageEvent) => {
        try {
          const data: StreamData = JSON.parse(event.data);
          setStocks(data.stocks);
        } catch (err) {
          console.error('Error parsing stream data:', err);
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
        setError('Connection lost');
        if (eventSource) {
          eventSource.close();
          eventSource = null;
        }
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Stream error');
      setIsConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [tickers]);

  return { stocks, isConnected, error };
}
