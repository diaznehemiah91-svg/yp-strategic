import * as THREE from 'three'
import { latLngToVector3 } from './utils'

export interface Hotspot {
  lat: number
  lng: number
  label: string
  severity: number
  color: string
}

/**
 * Create geopolitical risk hotspots with pulsing indicators
 */
export function createHotspots(): { group: THREE.Group; hotspots: Hotspot[] } {
  const hotspotsGroup = new THREE.Group()

  const hotspotsData: Hotspot[] = [
    { lat: 25.0, lng: 120.0, label: 'Taiwan Strait', severity: 9, color: '#ff3366' },
    { lat: 48.0, lng: 32.0, label: 'Ukraine', severity: 8, color: '#ff3366' },
    { lat: 15.5, lng: 44.2, label: 'Red Sea / Houthis', severity: 8, color: '#ff6622' },
    { lat: 38.5, lng: 127.0, label: 'DPRK', severity: 7, color: '#ff6622' },
    { lat: 50.0, lng: 10.0, label: 'NATO / EU', severity: 5, color: '#ffcc00' },
  ]

  hotspotsData.forEach((hotspot) => {
    // Core glowing sphere
    const coreGeometry = new THREE.SphereGeometry(0.06, 16, 16)
    const coreMaterial = new THREE.MeshStandardMaterial({
      color: hotspot.color,
      emissive: hotspot.color,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    })

    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial)
    const position = latLngToVector3(hotspot.lat, hotspot.lng, 2.55)
    coreMesh.position.copy(position)
    ;(coreMesh as any).hotspotData = hotspot
    ;(coreMesh as any).isHotspotCore = true

    hotspotsGroup.add(coreMesh)

    // Pulsing rings (expanding halos)
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.TorusGeometry(0.08 + i * 0.04, 0.01, 16, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: hotspot.color,
        transparent: true,
        opacity: 0.6 - i * 0.15,
      })

      const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
      ringMesh.position.copy(position)

      // Orient ring to face away from globe center
      ringMesh.lookAt(position.clone().multiplyScalar(2))

      ;(ringMesh as any).hotspotIndex = i
      ;(ringMesh as any).isHotspotRing = true
      ;(ringMesh as any).hotspotData = hotspot

      hotspotsGroup.add(ringMesh)
    }

    // Line from hotspot to globe surface
    const lineGeometry = new THREE.BufferGeometry()
    const linePositions = new Float32Array([
      position.x, position.y, position.z,
      position.x * (2.5 / 2.55), position.y * (2.5 / 2.55), position.z * (2.5 / 2.55),
    ])
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))

    const lineMaterial = new THREE.LineBasicMaterial({
      color: hotspot.color,
      transparent: true,
      opacity: 0.3,
    })

    const line = new THREE.Line(lineGeometry, lineMaterial)
    hotspotsGroup.add(line)
  })

  return { group: hotspotsGroup, hotspots: hotspotsData }
}

/**
 * Animate hotspots pulsing rings
 */
export function animateHotspots(hotspotsGroup: THREE.Group, deltaTime: number) {
  hotspotsGroup.children.forEach((child: any) => {
    if (child.isHotspotCore) {
      // Pulse emissive intensity
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.5
      child.material.emissiveIntensity = 0.5 + pulse * 0.5
    }

    if (child.isHotspotRing) {
      // Scale rings outward and fade
      const scale = 1 + (Date.now() * 0.001) % 1
      const opacity = 1 - (Date.now() * 0.001) % 1
      child.scale.set(scale, scale, scale)
      child.material.opacity = (0.6 - child.hotspotIndex * 0.15) * (1 - opacity)
    }
  })
}
