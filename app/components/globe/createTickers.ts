import * as THREE from 'three'
import { latLngToVector3 } from './utils'

export interface TickerData {
  ticker: string
  price: string
  change: string
  lat: number
  lng: number
  color: string
}

/**
 * Create canvas-based texture for ticker card
 */
function createTickerTexture(ticker: string, price: string, change: string, color: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  // Dark background with border
  ctx.fillStyle = 'rgba(0, 8, 20, 0.95)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

  // Ticker symbol (large, bold)
  ctx.font = 'bold 48px JetBrains Mono'
  ctx.fillStyle = color
  ctx.textAlign = 'left'
  ctx.fillText(ticker, 16, 50)

  // Price
  ctx.font = 'bold 32px JetBrains Mono'
  ctx.fillText(price, 16, 85)

  // Change percentage (smaller, aligned right)
  ctx.font = '16px JetBrains Mono'
  ctx.fillStyle = change.startsWith('-') ? '#ff3366' : '#00ff52'
  ctx.textAlign = 'right'
  ctx.fillText(change, canvas.width - 16, 85)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/**
 * Create stock ticker HUD cards as canvas sprite overlays
 */
export function createTickers(): { group: THREE.Group; tickers: TickerData[] } {
  const tickersGroup = new THREE.Group()

  const tickersData: TickerData[] = [
    { ticker: 'LMT', price: '$481.55', change: '+0.62%', lat: 38.9, lng: -77.0, color: '#00ff52' },
    { ticker: 'RTX', price: '$124.18', change: '+1.07%', lat: 41.7, lng: -72.7, color: '#00ff52' },
    { ticker: 'PLTR', price: '$87.42', change: '+3.21%', lat: 37.4, lng: -122.1, color: '#00ff52' },
    { ticker: 'NVDA', price: '$892.30', change: '-0.84%', lat: 37.3, lng: -121.9, color: '#ff3366' },
    { ticker: 'CRWD', price: '$342.90', change: '+2.15%', lat: 30.3, lng: -97.7, color: '#00ff52' },
    { ticker: 'OKLO', price: '$31.08', change: '+5.44%', lat: 43.5, lng: -112.0, color: '#00ff52' },
    { ticker: 'RKLB', price: '$22.47', change: '+4.12%', lat: -39.9, lng: 174.9, color: '#00ff52' },
    { ticker: 'IONQ', price: '$18.74', change: '-1.33%', lat: 39.1, lng: -76.8, color: '#ff3366' },
  ]

  tickersData.forEach((data) => {
    // Create canvas texture for this ticker
    const texture = createTickerTexture(data.ticker, data.price, data.change, data.color)

    // Create sprite material and sprite
    const material = new THREE.SpriteMaterial({ map: texture, sizeAttenuation: true })
    const sprite = new THREE.Sprite(material)

    // Position at lat/lng on globe surface (slightly offset outward for visibility)
    const position = latLngToVector3(data.lat, data.lng, 2.75)
    sprite.position.copy(position)

    // Scale sprite appropriately
    sprite.scale.set(0.6, 0.3, 1)

    // Store ticker data for interaction
    ;(sprite as any).tickerData = data

    tickersGroup.add(sprite)
  })

  return { group: tickersGroup, tickers: tickersData }
}

/**
 * Update ticker card visibility and orientation based on camera position
 */
export function updateTickerVisibility(tickersGroup: THREE.Group, camera: THREE.Camera) {
  tickersGroup.children.forEach((child: any) => {
    if (child instanceof THREE.Sprite) {
      // Face sprite toward camera for best visibility
      const direction = camera.position.clone().sub(child.position).normalize()
      // Update rotation to face camera (sprites automatically face camera by default)
    }
  })
}
