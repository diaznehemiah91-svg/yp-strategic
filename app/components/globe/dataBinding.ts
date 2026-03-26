import * as THREE from 'three'
import { TickerData } from './createTickers'
import { Correlation } from './createCorrelationArcs'

export interface LivePriceData {
  ticker: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

/**
 * Fetch live stock prices from API
 */
export async function fetchLiveStockPrices(
  tickers: string[]
): Promise<Record<string, LivePriceData>> {
  try {
    const response = await fetch('/api/stocks?symbols=' + tickers.join(','))
    if (!response.ok) throw new Error('Failed to fetch stock prices')

    const data = await response.json()
    const priceMap: Record<string, LivePriceData> = {}

    if (Array.isArray(data.stocks)) {
      data.stocks.forEach((stock: any) => {
        priceMap[stock.ticker] = {
          ticker: stock.ticker,
          price: stock.price,
          change: stock.change,
          changePercent: stock.changePercent,
          timestamp: Date.now(),
        }
      })
    }

    return priceMap
  } catch (error) {
    console.error('Error fetching live prices:', error)
    return {}
  }
}

/**
 * Update ticker card display with live data
 */
export function updateTickerDataOnGlobe(
  tickerSprites: any[],
  liveData: Record<string, LivePriceData>
) {
  tickerSprites.forEach((sprite) => {
    const ticker = sprite.tickerData?.ticker
    if (ticker && liveData[ticker]) {
      const live = liveData[ticker]

      // Update sprite texture with new price
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 128
      const ctx = canvas.getContext('2d')!

      // Background
      ctx.fillStyle = 'rgba(0, 8, 20, 0.95)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Border color based on change
      const borderColor = live.change >= 0 ? '#00ff52' : '#ff3366'
      ctx.strokeStyle = borderColor
      ctx.lineWidth = 2
      ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

      // Ticker
      ctx.font = 'bold 48px JetBrains Mono'
      ctx.fillStyle = borderColor
      ctx.textAlign = 'left'
      ctx.fillText(ticker, 16, 50)

      // Price
      ctx.font = 'bold 32px JetBrains Mono'
      ctx.fillText('$' + live.price.toFixed(2), 16, 85)

      // Change
      ctx.font = '16px JetBrains Mono'
      ctx.fillStyle = live.change >= 0 ? '#00ff52' : '#ff3366'
      ctx.textAlign = 'right'
      const changeStr = (live.change >= 0 ? '+' : '') + live.changePercent.toFixed(2) + '%'
      ctx.fillText(changeStr, canvas.width - 16, 85)

      // Update sprite material
      const texture = new THREE.CanvasTexture(canvas)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter

      if (sprite.material && sprite.material.map) {
        sprite.material.map.dispose()
        sprite.material.map = texture
        sprite.material.needsUpdate = true
      }
    }
  })
}

/**
 * Update correlation arcs based on correlation strength changes
 */
export function updateCorrelationData(
  arcs: any[],
  correlationStrengths: Record<string, number>
) {
  arcs.forEach((arc) => {
    const key = `${arc.correlationData?.ticker1}|${arc.correlationData?.ticker2}`
    const strength = correlationStrengths[key]

    if (strength !== undefined) {
      arc.correlationData.strength = strength

      // Update material color based on new strength
      if (strength > 0.85) {
        arc.material.color.setHex(0x00ff52) // Green
      } else if (strength > 0.70) {
        arc.material.color.setHex(0x00d4ff) // Cyan
      } else {
        arc.material.color.setHex(0xff6622) // Orange
      }
    }
  })
}

/**
 * Set up polling for live data updates
 */
export function setupDataPolling(
  tickers: string[],
  onUpdate: (data: Record<string, LivePriceData>) => void,
  interval: number = 5000
): () => void {
  const poll = async () => {
    const data = await fetchLiveStockPrices(tickers)
    onUpdate(data)
  }

  // Initial fetch
  poll()

  // Set up polling interval
  const intervalId = setInterval(poll, interval)

  // Return cleanup function
  return () => clearInterval(intervalId)
}
