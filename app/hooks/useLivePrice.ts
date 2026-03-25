'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export function useLivePrice(ticker: string) {
  // Refresh every 15 seconds for live market data
  const { data, error, isLoading } = useSWR(
    `/api/stock-price?symbol=${ticker}`,
    fetcher,
    { refreshInterval: 15000, revalidateOnFocus: false }
  )

  return {
    price: data?.price || 0,
    change: data?.change || 0,
    changePercent: data?.changePercent || 0,
    isLoading,
    error: error ? 'Feed Offline' : null,
  }
}
