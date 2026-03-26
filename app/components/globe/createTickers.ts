import * as THREE from 'three'

export interface TickerData {
  ticker: string
  price: string
  change: string
  lat: number
  lng: number
  color: string
}

/**
 * Create stock ticker HUD cards (simplified - without CSS2DRenderer for now)
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

  // For now, just return empty group - CSS2DRenderer implementation will be added later
  return { group: tickersGroup, tickers: tickersData }
}

/**
 * Update ticker card visibility based on camera position
 */
export function updateTickerVisibility(tickersGroup: THREE.Group, camera: THREE.Camera) {
  // Placeholder for now
}
