import * as THREE from 'three'

/**
 * Convert latitude/longitude to 3D position on sphere surface
 */
export function latLngToVector3(lat: number, lng: number, radius: number = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat)
  const theta = THREE.MathUtils.degToRad(lng)

  return new THREE.Vector3(
    radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

/**
 * Create a canvas-based Earth texture with landmasses and ocean
 */
export function createEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  // Ocean background (dark blue)
  ctx.fillStyle = '#0a1628'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Landmasses (green/tan)
  ctx.fillStyle = '#1a4d2e'

  // Simple landmass shapes (simplified continents)
  // North America
  ctx.fillRect(100, 200, 250, 200)

  // South America
  ctx.fillRect(300, 400, 120, 200)

  // Europe
  ctx.fillRect(700, 150, 150, 120)

  // Africa
  ctx.fillRect(750, 300, 200, 250)

  // Asia
  ctx.fillRect(1000, 150, 400, 300)

  // Australia
  ctx.fillRect(1350, 500, 120, 100)

  // Add some detail with gradients
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, 'rgba(26, 77, 46, 0.2)')
  gradient.addColorStop(0.5, 'rgba(50, 120, 70, 0.3)')
  gradient.addColorStop(1, 'rgba(26, 77, 46, 0.2)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  return texture
}

/**
 * Create a bump map for topographic elevation
 */
export function createBumpTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!

  // Create noise-like bump map
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add some simple bump patterns
  ctx.fillStyle = '#a0a0a0'
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width
    const y = Math.random() * canvas.height
    const size = Math.random() * 50 + 10
    ctx.fillRect(x, y, size, size)
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  texture.minFilter = THREE.LinearMipmapLinearFilter
  return texture
}

/**
 * Create night lights texture (city lights glow)
 */
export function createNightTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add subtle city light points
  ctx.fillStyle = 'rgba(255, 200, 100, 0.3)'

  // Major cities
  const cities = [
    [100, 300], [350, 350], [700, 200], [900, 250], [1100, 280],
    [1300, 350], [200, 450], [800, 600], [1400, 550], [600, 700]
  ]

  cities.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 30, 0, Math.PI * 2)
    ctx.fill()
  })

  const texture = new THREE.CanvasTexture(canvas)
  texture.magFilter = THREE.LinearFilter
  return texture
}

/**
 * Ease function for smooth animations
 */
export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

/**
 * Linear interpolation
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t
}
