import * as THREE from 'three'

interface RingConfig {
  radius: number
  tilt: number
  rotationSpeed: number
  color: string
}

/**
 * Create orbiting holographic data rings around the globe
 */
export function createRings(): THREE.Group {
  const ringsGroup = new THREE.Group()

  const ringConfigs: RingConfig[] = [
    { radius: 3.8, tilt: 0.3, rotationSpeed: 0.002, color: '#00ff52' },    // green (--accent)
    { radius: 4.2, tilt: -0.5, rotationSpeed: -0.0015, color: '#00d4ff' }, // cyan (--accent2)
    { radius: 4.6, tilt: 0.7, rotationSpeed: 0.001, color: '#ff3366' },    // red (alerts)
  ]

  ringConfigs.forEach((config, idx) => {
    // Create main ring
    const torusGeometry = new THREE.TorusGeometry(config.radius, 0.008, 16, 200)
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: config.color,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    })

    const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial)
    torusMesh.rotation.x = config.tilt
    torusMesh.castShadow = false
    torusMesh.receiveShadow = false
    ;(torusMesh as any).ringSpeed = config.rotationSpeed
    ;(torusMesh as any).ringAxis = new THREE.Vector3(
      Math.cos(config.tilt),
      Math.sin(config.tilt),
      0
    ).normalize()

    ringsGroup.add(torusMesh)

    // Add pulsing data nodes along the ring
    const nodeCount = 8
    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2
      const nodeGeometry = new THREE.SphereGeometry(0.04, 16, 16)
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: config.color,
        emissive: config.color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      })

      const nodeMesh = new THREE.Mesh(nodeGeometry, nodeMaterial)

      // Position node on ring
      const x = Math.cos(angle) * config.radius
      const y = Math.sin(angle) * config.radius * Math.sin(config.tilt)
      const z = Math.sin(angle) * config.radius * Math.cos(config.tilt)

      nodeMesh.position.set(x, y, z)
      ;(nodeMesh as any).nodeIndex = i
      ;(nodeMesh as any).nodeCount = nodeCount
      ;(nodeMesh as any).parentConfig = config
      ;(nodeMesh as any).isDataNode = true

      ringsGroup.add(nodeMesh)
    }
  })

  return ringsGroup
}

/**
 * Animate rings and data nodes each frame
 */
export function animateRings(ringsGroup: THREE.Group, deltaTime: number) {
  ringsGroup.children.forEach((child) => {
    const torusMesh = child as any

    // Rotate ring
    if (torusMesh.ringSpeed !== undefined) {
      const axis = torusMesh.ringAxis as THREE.Vector3
      const quaternion = new THREE.Quaternion()
      quaternion.setFromAxisAngle(axis, torusMesh.ringSpeed)
      torusMesh.quaternion.multiplyQuaternions(quaternion, torusMesh.quaternion)
    }

    // Pulse data nodes
    if (torusMesh.isDataNode) {
      const pulse = Math.sin(Date.now() * 0.003 + torusMesh.nodeIndex) * 0.5 + 0.5
      torusMesh.scale.set(0.7 + pulse * 0.3, 0.7 + pulse * 0.3, 0.7 + pulse * 0.3)

      const material = torusMesh.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 0.3 + pulse * 0.7
    }
  })
}
