/**
 * GLOBAL STOCK GLOBE UTILITIES
 * Reusable Three.js globe initialization and management
 * Last Updated: 2026-03-25
 */

import * as THREE from 'three'

export interface GlobeConfig {
  backgroundColor?: number
  showStars?: boolean
  autoRotate?: boolean
  autoRotateSpeed?: number
  dataUpdateInterval?: number
  earthRadius?: number
  containerElement: HTMLElement
}

export interface GlobeInstance {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  globe: THREE.Mesh
  dispose: () => void
  updateData: (data: any) => void
  addFlowLine: (source: any, target: any, correlation: number) => void
  addRiskZone: (zone: any) => void
}

/**
 * INITIALIZATION
 */

export const initializeGlobe = (
  container: HTMLElement,
  config: Partial<GlobeConfig> = {}
): GlobeInstance => {
  const {
    backgroundColor = 0x000000,
    showStars = true,
    autoRotate = true,
    autoRotateSpeed = 0.0002,
    dataUpdateInterval = 5000,
    earthRadius = 50,
  } = config

  // Scene Setup
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    10000
  )
  camera.position.z = earthRadius * 2.5

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setClearColor(backgroundColor, 1)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.shadowMap.enabled = true
  container.appendChild(renderer.domElement)

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(earthRadius * 2, earthRadius * 2, earthRadius * 2)
  directionalLight.castShadow = true

  scene.add(ambientLight, directionalLight)

  // Create Earth
  const earthGeometry = new THREE.SphereGeometry(earthRadius, 256, 256)
  const earthMaterial = new THREE.MeshPhongMaterial({
    color: 0x0a1628,
    emissive: 0x001a3d,
    shininess: 5,
  })
  const globe = new THREE.Mesh(earthGeometry, earthMaterial)
  scene.add(globe)

  // Atmosphere Glow
  const atmosphereGeometry = new THREE.SphereGeometry(earthRadius * 1.02, 128, 128)
  const atmosphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x0099ff,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide,
  })
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
  scene.add(atmosphere)

  // Wireframe overlay
  const wireframeGeometry = new THREE.SphereGeometry(earthRadius * 1.01, 64, 64)
  const wireframeMaterial = new THREE.LineBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.06,
  })
  const wireframeLines = new THREE.LineSegments(
    new THREE.WireframeGeometry(wireframeGeometry),
    wireframeMaterial
  )
  scene.add(wireframeLines)

  // Stars
  if (showStars) {
    const starCount = 500
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 500
      starPositions[i + 1] = (Math.random() - 0.5) * 500
      starPositions[i + 2] = (Math.random() - 0.5) * 500
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
  }

  // Animation Loop
  let animationId: number
  const animate = () => {
    animationId = requestAnimationFrame(animate)

    if (autoRotate) {
      globe.rotation.y += autoRotateSpeed
    }

    renderer.render(scene, camera)
  }
  animate()

  // Handle Resize
  const onResize = () => {
    const width = container.clientWidth
    const height = container.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }
  window.addEventListener('resize', onResize)

  // Mouse Controls
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }

  const onMouseDown = (e: MouseEvent) => {
    isDragging = true
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      globe.rotation.y += deltaX * 0.005
      globe.rotation.x += deltaY * 0.005

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }
  }

  const onMouseUp = () => {
    isDragging = false
  }

  renderer.domElement.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  // Zoom with Mouse Wheel
  const minZoom = earthRadius * 2
  const maxZoom = earthRadius * 4

  const onWheel = (e: WheelEvent) => {
    e.preventDefault()

    if (e.deltaY > 0) {
      camera.position.z = Math.min(camera.position.z + 5, maxZoom)
    } else {
      camera.position.z = Math.max(camera.position.z - 5, minZoom)
    }
  }

  renderer.domElement.addEventListener('wheel', onWheel)

  /**
   * CLEANUP
   */

  const dispose = () => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', onResize)
    renderer.domElement.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    renderer.domElement.removeEventListener('wheel', onWheel)

    earthGeometry.dispose()
    earthMaterial.dispose()
    atmosphereGeometry.dispose()
    atmosphereMaterial.dispose()
    renderer.dispose()
    container.removeChild(renderer.domElement)
  }

  /**
   * DATA UPDATES
   */

  const updateData = async (fetchFn: () => Promise<any>) => {
    try {
      const data = await fetchFn()
      // Update globe based on data
      // Implementation depends on data structure
    } catch (error) {
      console.error('Failed to update globe data:', error)
    }
  }

  /**
   * ADD FLOW LINES
   */

  const addFlowLine = (source: any, target: any, correlation: number) => {
    const toVector3 = (company: any) => {
      const lat = company.hq.lat * (Math.PI / 180)
      const lon = company.hq.lon * (Math.PI / 180)
      const radius = earthRadius * 1.01

      return new THREE.Vector3(
        radius * Math.cos(lat) * Math.cos(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lon)
      )
    }

    const p1 = toVector3(source)
    const p2 = toVector3(target)

    const curve = new THREE.QuadraticBezierCurve3(
      p1,
      new THREE.Vector3(0, 0, 0),
      p2
    )

    const points = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const lineColor = correlation < 0 ? 0xff0055 : 0x00ff00
    const material = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: Math.abs(correlation) * 0.6,
      linewidth: 2,
    })

    const line = new THREE.Line(geometry, material)
    scene.add(line)

    return line
  }

  /**
   * ADD RISK ZONES
   */

  const addRiskZone = (zone: any) => {
    const points = zone.boundaries.map((point: any) => {
      const lat = point.lat * (Math.PI / 180)
      const lon = point.lon * (Math.PI / 180)
      const radius = earthRadius * 1.005

      return new THREE.Vector3(
        radius * Math.cos(lat) * Math.cos(lon),
        radius * Math.sin(lat),
        radius * Math.cos(lat) * Math.sin(lon)
      )
    })

    const geometry = new THREE.BufferGeometry().setFromPoints(points)

    const colorMap = {
      CRITICAL: 0xff0055,
      HIGH: 0xff8800,
      MEDIUM: 0xffff00,
      LOW: 0x00ff88,
    }

    const material = new THREE.LineBasicMaterial({
      color: colorMap[zone.severity] || 0xff8800,
      linewidth: 3,
      transparent: true,
      opacity: 0.8,
    })

    const riskLine = new THREE.Line(geometry, material)
    scene.add(riskLine)

    return riskLine
  }

  return {
    scene,
    camera,
    renderer,
    globe,
    dispose,
    updateData,
    addFlowLine,
    addRiskZone,
  }
}

/**
 * HEAT MAP GENERATION
 */

export const generateHeatMap = (companies: any[], width: number = 2048, height: number = 1024) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  companies.forEach(company => {
    const x = ((company.hq.lon + 180) / 360) * canvas.width
    const y = ((90 - company.hq.lat) / 180) * canvas.height

    const intensity = Math.min(company.marketCap / 500, 1)

    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150)
    gradient.addColorStop(0, `rgba(255, 255, 0, ${intensity})`)
    gradient.addColorStop(0.5, `rgba(255, 100, 0, ${intensity * 0.6})`)
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(x - 150, y - 150, 300, 300)
  })

  return new THREE.CanvasTexture(canvas)
}

/**
 * SPRITE LABEL CREATION
 */

export const createTickerLabel = (company: any) => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#00ff88'
  ctx.lineWidth = 2
  ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

  // Ticker
  ctx.fillStyle = '#00ff88'
  ctx.font = 'bold 40px monospace'
  ctx.fillText(company.ticker, 10, 70)

  // Change %
  const changeColor = company.changePercent >= 0 ? '#00ff00' : '#ff0055'
  ctx.fillStyle = changeColor
  ctx.font = '32px monospace'
  ctx.fillText(
    `${company.changePercent >= 0 ? '+' : ''}${company.changePercent.toFixed(2)}%`,
    140,
    70
  )

  const texture = new THREE.CanvasTexture(canvas)
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: texture, sizeAttenuation: true })
  )

  const lat = company.hq.lat * (Math.PI / 180)
  const lon = company.hq.lon * (Math.PI / 180)
  const radius = 53

  sprite.position.set(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.sin(lon)
  )

  sprite.scale.set(6, 3, 1)
  sprite.userData = { ticker: company.ticker, ...company }

  return sprite
}

/**
 * ORBITAL RING CREATION
 */

export const createOrbitalRing = (
  radius: number,
  color: number,
  rotationAxis: 'x' | 'y' | 'z' = 'z'
) => {
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI)
  const points = curve.getPoints(256)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.6,
    linewidth: 1,
  })

  const ring = new THREE.Line(geometry, material)

  const glowMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2,
    linewidth: 3,
  })
  const glowRing = new THREE.Line(geometry, glowMaterial)

  const rotations = {
    x: Math.PI / 4,
    y: Math.PI / 6,
    z: 0,
  }

  ring.rotation[rotationAxis] = rotations[rotationAxis]
  glowRing.rotation[rotationAxis] = rotations[rotationAxis]

  return { ring, glowRing }
}

export default initializeGlobe
