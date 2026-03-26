import * as THREE from 'three'

/**
 * Create pedestal base for globe with text label
 */
export function createPedestal(): THREE.Group {
  const pedestalGroup = new THREE.Group()

  // Main cylinder base
  const baseGeometry = new THREE.CylinderGeometry(3.2, 3.5, 0.8, 32)
  const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0x000814,
    metalness: 0.6,
    roughness: 0.4,
    emissive: 0x0a2540,
    emissiveIntensity: 0.2,
  })
  const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial)
  baseMesh.position.y = -3.0
  baseMesh.receiveShadow = true
  baseMesh.castShadow = true
  pedestalGroup.add(baseMesh)

  // Glowing ring around base
  const ringGeometry = new THREE.TorusGeometry(3.4, 0.05, 16, 32)
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff52,
    transparent: true,
    opacity: 0.6,
  })
  const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial)
  ringMesh.position.y = -2.6
  ringMesh.rotation.x = Math.PI / 2.2
  pedestalGroup.add(ringMesh)

  // Accent ring (cyan)
  const accentRingGeometry = new THREE.TorusGeometry(3.2, 0.02, 16, 32)
  const accentRingMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.4,
  })
  const accentRing = new THREE.Mesh(accentRingGeometry, accentRingMaterial)
  accentRing.position.y = -2.7
  accentRing.rotation.x = Math.PI / 2
  pedestalGroup.add(accentRing)

  // Create canvas texture for text label
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  // Transparent background with gradient
  const gradient = ctx.createLinearGradient(0, 0, 512, 128)
  gradient.addColorStop(0, 'rgba(0, 8, 20, 0.3)')
  gradient.addColorStop(0.5, 'rgba(10, 37, 64, 0.4)')
  gradient.addColorStop(1, 'rgba(0, 8, 20, 0.3)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 128)

  // Border
  ctx.strokeStyle = 'rgba(0, 255, 82, 0.5)'
  ctx.lineWidth = 2
  ctx.strokeRect(8, 8, 512 - 16, 128 - 16)

  // Main text
  ctx.font = 'bold 48px JetBrains Mono'
  ctx.fillStyle = '#00ff52'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('GLOBAL INTELLIGENCE', 256, 48)

  // Subtitle
  ctx.font = '24px JetBrains Mono'
  ctx.fillStyle = '#00d4ff'
  ctx.fillText('COMMAND CENTER', 256, 90)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  // Create plane for text
  const planeGeometry = new THREE.PlaneGeometry(6.4, 1.6)
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  })
  const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
  planeMesh.position.set(0, -3.8, 0)
  pedestalGroup.add(planeMesh)

  // Small corner details (tactical elements)
  const detailGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
  const detailMaterial = new THREE.MeshStandardMaterial({
    color: 0xff3366,
    emissive: 0xff3366,
    emissiveIntensity: 0.8,
  })

  // Four corner points
  const cornerPositions = [
    [-3.1, -2.95, -3.1],
    [3.1, -2.95, -3.1],
    [-3.1, -2.95, 3.1],
    [3.1, -2.95, 3.1],
  ]

  cornerPositions.forEach((pos) => {
    const detail = new THREE.Mesh(detailGeometry, detailMaterial.clone())
    detail.position.set(pos[0], pos[1], pos[2])
    detail.castShadow = true
    pedestalGroup.add(detail)
  })

  return pedestalGroup
}

/**
 * Animate pedestal with pulsing accents
 */
export function animatePedestal(pedestalGroup: THREE.Group) {
  pedestalGroup.children.forEach((child) => {
    if (child instanceof THREE.Mesh && (child.material as any).emissive) {
      const material = child.material as THREE.MeshStandardMaterial
      const pulse = Math.sin(Date.now() * 0.003) * 0.3 + 0.2
      material.emissiveIntensity = 0.2 + pulse
    }
  })
}
