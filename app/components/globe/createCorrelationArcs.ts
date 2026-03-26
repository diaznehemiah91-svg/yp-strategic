import * as THREE from 'three'
import { latLngToVector3 } from './utils'

export interface Correlation {
  ticker1: string
  ticker2: string
  strength: number // 0 to 1
  lat1: number
  lng1: number
  lat2: number
  lng2: number
}

/**
 * Create correlation arcs between related stocks
 * Arcs show relationships with thickness/opacity based on correlation strength
 */
export function createCorrelationArcs(): { group: THREE.Group; correlations: Correlation[] } {
  const arcsGroup = new THREE.Group()

  const correlations: Correlation[] = [
    // Defense contractors (highly correlated)
    { ticker1: 'LMT', ticker2: 'RTX', strength: 0.92, lat1: 38.9, lng1: -77.0, lat2: 41.7, lng2: -72.7 },
    { ticker1: 'LMT', ticker2: 'PLTR', strength: 0.78, lat1: 38.9, lng1: -77.0, lat2: 37.4, lng2: -122.1 },
    { ticker1: 'RTX', ticker2: 'PLTR', strength: 0.82, lat1: 41.7, lng1: -72.7, lat2: 37.4, lng2: -122.1 },

    // Tech / Semi correlation
    { ticker1: 'NVDA', ticker2: 'PLTR', strength: 0.68, lat1: 37.3, lng1: -121.9, lat2: 37.4, lng2: -122.1 },

    // Cybersecurity & Defense
    { ticker1: 'CRWD', ticker2: 'RTX', strength: 0.65, lat1: 30.3, lng1: -97.7, lat2: 41.7, lng2: -72.7 },
    { ticker1: 'CRWD', ticker2: 'PLTR', strength: 0.71, lat1: 30.3, lng1: -97.7, lat2: 37.4, lng2: -122.1 },

    // Energy / Deep Tech
    { ticker1: 'OKLO', ticker2: 'PLTR', strength: 0.56, lat1: 43.5, lng1: -112.0, lat2: 37.4, lng2: -122.1 },

    // Space & Defense
    { ticker1: 'RKLB', ticker2: 'PLTR', strength: 0.62, lat1: -39.9, lng1: 174.9, lat2: 37.4, lng2: -122.1 },

    // Quantum & Defense
    { ticker1: 'IONQ', ticker2: 'PLTR', strength: 0.58, lat1: 39.1, lng1: -76.8, lat2: 37.4, lng2: -122.1 },
  ]

  correlations.forEach((corr) => {
    // Get start and end positions on globe surface
    const startPos = latLngToVector3(corr.lat1, corr.lng1, 2.55)
    const endPos = latLngToVector3(corr.lat2, corr.lng2, 2.55)

    // Create arc curve using quadratic bezier
    const midpoint = new THREE.Vector3().addVectors(startPos, endPos).multiplyScalar(0.5)
    const center = new THREE.Vector3(0, 0, 0)
    const direction = midpoint.clone().normalize()
    const controlPoint = direction.multiplyScalar(2.8) // Curve point outside globe

    // Create quadratic bezier curve
    const curve = new THREE.QuadraticBezierCurve3(startPos, controlPoint, endPos)
    const points = curve.getPoints(32)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    // Color based on correlation strength
    const color = new THREE.Color()
    if (corr.strength > 0.85) {
      color.setHex(0x00ff52) // Green for strong
    } else if (corr.strength > 0.70) {
      color.setHex(0x00d4ff) // Cyan for moderate
    } else {
      color.setHex(0xff6622) // Orange for weak
    }

    // Line width based on strength
    const lineWidth = 1 + corr.strength * 1.5

    const material = new THREE.LineBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.3 + corr.strength * 0.5,
      linewidth: lineWidth,
    })

    const line = new THREE.Line(geometry, material)
    ;(line as any).correlationData = corr
    ;(line as any).isCorrelationArc = true

    arcsGroup.add(line)
  })

  return { group: arcsGroup, correlations }
}

/**
 * Animate correlation arcs with pulsing glow
 */
export function animateCorrelationArcs(arcsGroup: THREE.Group) {
  arcsGroup.children.forEach((child: any) => {
    if (child.isCorrelationArc) {
      const material = child.material as THREE.LineBasicMaterial
      const baseMaterial = child.correlationData
      const pulse = Math.sin(Date.now() * 0.002) * 0.3 + 0.7
      material.opacity = (0.3 + baseMaterial.strength * 0.5) * pulse
    }
  })
}
