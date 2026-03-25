'use client'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LivePrice({ ticker }: { ticker: string }) {
  const { data, error } = useSWR(
    `/api/stock-price?symbol=${ticker}`,
    fetcher,
    { refreshInterval: 15000, revalidateOnFocus: false }
  )

  if (error) {
    return (
      <div className="text-[var(--accent3)] text-xs uppercase">
        Feed Offline
      </div>
    )
  }

  if (!data) {
    return (
      <div className="animate-pulse text-[var(--text-dim)] text-xs uppercase">
        Sequencing...
      </div>
    )
  }

  const isPositive = data.changePercent >= 0

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white tracking-tighter">
          ${data.price.toFixed(2)}
        </span>
      </div>
      <div
        className={`text-[11px] font-bold uppercase tracking-widest ${
          isPositive ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'
        }`}
      >
        {isPositive ? '▲' : '▼'} {Math.abs(data.changePercent).toFixed(2)}%
      </div>
    </div>
  )
}
