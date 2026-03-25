# GLOBAL STOCK INTELLIGENCE GLOBE SKILL
**Author:** Claude Code | **Date:** 2026-03-25 | **Status:** Production-Ready

## OVERVIEW
A comprehensive Three.js implementation for rendering real-time 3D Earth globes with company headquarters, stock ticker labels, animated supply chain flows, geopolitical risk zones, and orbital data rings. Optimized for high-impact intelligence dashboards and real-time financial/geopolitical visualization.

---

## QUICK START

### Basic Setup (React Component)
```tsx
'use client'

import { useEffect, useRef } from 'react'
import { initializeGlobe } from '@/lib/globe-utils'

export default function StockGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const globe = initializeGlobe(containerRef.current, {
      backgroundColor: 0x000000,
      showStars: true,
      autoRotate: true,
      dataUpdateInterval: 5000,
    })

    return () => globe.dispose()
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '100vh' }} />
}
```

---

## ARCHITECTURE

### 1. SCENE INITIALIZATION
**Key Principles:**
- High poly count sphere (256x256) for smooth surface
- Layered rendering: Earth → Heat Map → Atmosphere → Rings → Labels
- Proper lighting setup (ambient + directional + point lights)
- Star field background for depth

**Implementation:**
```typescript
const initScene = () => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  )
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

  renderer.setClearColor(0x000000, 1)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  camera.position.z = 120

  // Lighting hierarchy
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(100, 100, 100)

  scene.add(ambientLight, directionalLight)

  return { scene, camera, renderer }
}
```

### 2. EARTH SPHERE WITH TEXTURES
**Texture Requirements:**
- Base color: 8K satellite texture (NASA Blue Marble or equivalent)
- Bump map: 4K elevation data
- Specular map: 2K ocean/water reflection
- Heat map: Canvas-based procedural generation

**Implementation:**
```typescript
const createEarth = (scene: THREE.Scene) => {
  const geometry = new THREE.SphereGeometry(50, 256, 256)

  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 5,
    emissive: 0x1a3a52,
    emissiveIntensity: 0.3,
    map: earthTexture,        // 8K satellite
    bumpMap: bumpTexture,     // 4K elevation
    specularMap: specTexture, // 2K ocean spec
    bumpScale: 2.5,
  })

  const earth = new THREE.Mesh(geometry, material)
  scene.add(earth)

  return earth
}
```

### 3. ATMOSPHERIC GLOW SHADER
**Effect:** Fresnel-based edge glow simulating Earth's atmosphere

**Vertex Shader:**
```glsl
varying vec3 vVertexNormal;

void main() {
  vVertexNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

**Fragment Shader:**
```glsl
uniform vec3 glowColor;
uniform float glowPower;
varying vec3 vVertexNormal;

void main() {
  float glowIntensity = pow(0.6 - dot(vVertexNormal, vec3(0.0, 0.0, 1.0)), glowPower);
  gl_FragColor = vec4(glowColor, glowIntensity * 0.4);
}
```

### 4. HEAT MAP OVERLAY (Canvas-Based)
**Process:**
1. Create 2048×1024 canvas (matches sphere UV unwrap)
2. Iterate companies, convert lat/lon to canvas coordinates
3. Draw radial gradients (intensity = company market cap)
4. Convert to texture and apply to transparent sphere above Earth

**Implementation:**
```typescript
const createHeatMap = (companies: Company[], radius: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = 2048
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!

  companies.forEach(company => {
    // Convert geographic coordinates to canvas space
    const x = ((company.hq.lon + 180) / 360) * canvas.width
    const y = ((90 - company.hq.lat) / 180) * canvas.height

    // Normalize intensity (0-1) based on market cap
    const intensity = Math.min(company.marketCap / 500, 1)

    // Draw radial gradient
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 150)
    gradient.addColorStop(0, `rgba(255, 255, 0, ${intensity})`)
    gradient.addColorStop(0.5, `rgba(255, 100, 0, ${intensity * 0.6})`)
    gradient.addColorStop(1, 'rgba(255, 0, 0, 0)')

    ctx.fillStyle = gradient
    ctx.fillRect(x - 150, y - 150, 300, 300)
  })

  const texture = new THREE.CanvasTexture(canvas)
  const geometry = new THREE.SphereGeometry(50.1, 128, 128)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
  })

  return new THREE.Mesh(geometry, material)
}
```

### 5. TICKER LABELS (Sprite System)
**Key Points:**
- Use THREE.Sprite for always-facing labels
- Canvas-based dynamic text rendering
- Update frequency: 5-second intervals
- Color coding: green (gainers), red (losers), gray (flat)

**Implementation:**
```typescript
const createTickerLabel = (company: Company) => {
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

  // Percentage (color based on direction)
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

  // Position label at 3D coordinate
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
```

### 6. ANIMATED FLOW LINES (Supply Chain / Correlations)
**Flow Types:**
- **Positive correlation:** Green line, opacity = |correlation|
- **Negative correlation:** Red line, opacity = |correlation|
- **Supply chain:** Orange line, opacity = dependency weight
- **Geopolitical:** Yellow pulse line

**Implementation:**
```typescript
const createFlowLine = (
  source: Company,
  target: Company,
  correlation: number,
  lineType: 'correlation' | 'supply' | 'geopolitical' = 'correlation'
) => {
  // Convert to 3D coordinates
  const toVector3 = (company: Company) => {
    const lat = company.hq.lat * (Math.PI / 180)
    const lon = company.hq.lon * (Math.PI / 180)
    const radius = 50.5

    return new THREE.Vector3(
      radius * Math.cos(lat) * Math.cos(lon),
      radius * Math.sin(lat),
      radius * Math.cos(lat) * Math.sin(lon)
    )
  }

  const p1 = toVector3(source)
  const p2 = toVector3(target)

  // Create curved path using quadratic Bezier
  const curve = new THREE.QuadraticBezierCurve3(
    p1,
    new THREE.Vector3(0, 0, 0), // Control point at center
    p2
  )

  const points = curve.getPoints(50)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Color based on type and value
  let lineColor = 0x00ff00
  let opacity = Math.abs(correlation) * 0.6

  if (lineType === 'correlation') {
    lineColor = correlation < 0 ? 0xff0055 : 0x00ff00
  } else if (lineType === 'supply') {
    lineColor = 0xff8800
    opacity = Math.min(Math.abs(correlation) * 0.8, 0.8)
  } else if (lineType === 'geopolitical') {
    lineColor = 0xffff00
    opacity = 0.4
  }

  const material = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: opacity,
    linewidth: 2,
  })

  const line = new THREE.Line(geometry, material)

  // Add flowing particle animation
  animateFlowParticles(line, lineColor)

  return line
}

const animateFlowParticles = (line: THREE.Line, color: number) => {
  const particleCount = 20
  const particles = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      color: color,
      size: 0.8,
      transparent: true,
      sizeAttenuation: true,
    })
  )

  let time = 0
  const positions: number[] = []
  const linePoints = line.geometry.attributes.position.array as Float32Array

  const animate = () => {
    time = (time + 0.005) % 1

    for (let i = 0; i < particleCount; i++) {
      const t = (time + i / particleCount) % 1
      const index = Math.floor(t * ((linePoints.length / 3) - 1)) * 3

      positions[i * 3] = linePoints[index]
      positions[i * 3 + 1] = linePoints[index + 1]
      positions[i * 3 + 2] = linePoints[index + 2]
    }

    particles.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    )
    particles.geometry.attributes.position.needsUpdate = true

    requestAnimationFrame(animate)
  }

  animate()
  line.parent?.add(particles)
}
```

### 7. ORBITAL RINGS
**Purpose:** Visual data layers representing different metrics (market cap, volatility, geopolitical risk)

**Implementation:**
```typescript
const createOrbitalRing = (
  radius: number,
  color: number,
  rotationAxis: 'x' | 'y' | 'z' = 'z',
  label: string = ''
) => {
  // Create circular geometry
  const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI)
  const points = curve.getPoints(256)
  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Main line
  const material = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.6,
    linewidth: 1,
  })

  const ring = new THREE.Line(geometry, material)

  // Glow effect
  const glowMaterial = new THREE.LineBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.2,
    linewidth: 3,
  })
  const glowRing = new THREE.Line(geometry, glowMaterial)

  // Apply rotation for perspective
  const rotations = {
    x: Math.PI / 4,
    y: Math.PI / 6,
    z: 0,
  }

  ring.rotation[rotationAxis] = rotations[rotationAxis]
  glowRing.rotation[rotationAxis] = rotations[rotationAxis]

  ring.userData = { rotationAxis, label }

  return { ring, glowRing }
}

const animateOrbitalRings = (rings: Array<{ ring: THREE.Line }>) => {
  const animate = () => {
    rings.forEach((ringPair, index) => {
      const axis = ringPair.ring.userData.rotationAxis || 'z'
      const speed = 0.0001 * (1 + index * 0.5)

      if (axis === 'x') ringPair.ring.rotation.x += speed
      if (axis === 'y') ringPair.ring.rotation.y += speed
      if (axis === 'z') ringPair.ring.rotation.z += speed
    })

    requestAnimationFrame(animate)
  }

  animate()
}
```

### 8. GEOPOLITICAL RISK ZONES
**Risk Levels:**
- CRITICAL: Blood red (#ff0055), pulsing 0.8-1.0 opacity
- HIGH: Orange (#ff8800), pulsing 0.6-0.8 opacity
- MEDIUM: Yellow (#ffff00), pulsing 0.4-0.6 opacity

**Implementation:**
```typescript
interface RiskZone {
  name: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  boundaries: Array<{ lat: number; lon: number }>
  affectedCompanies: string[]
}

const createRiskZone = (zone: RiskZone) => {
  // Convert lat/lon to 3D points
  const points = zone.boundaries.map(point => {
    const lat = point.lat * (Math.PI / 180)
    const lon = point.lon * (Math.PI / 180)
    const radius = 50.2

    return new THREE.Vector3(
      radius * Math.cos(lat) * Math.cos(lon),
      radius * Math.sin(lat),
      radius * Math.cos(lat) * Math.sin(lon)
    )
  })

  const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // Color based on severity
  const colorMap = {
    CRITICAL: 0xff0055,
    HIGH: 0xff8800,
    MEDIUM: 0xffff00,
  }

  const material = new THREE.LineBasicMaterial({
    color: colorMap[zone.severity],
    linewidth: 3,
    transparent: true,
    opacity: 0.8,
  })

  const riskLine = new THREE.Line(geometry, material)

  // Pulsing animation
  let time = 0
  const pulse = () => {
    time += 0.016 // ~60fps
    const pulse = Math.sin(time * 3) * 0.2 + 0.6

    const opacityMap = {
      CRITICAL: [0.8, 1.0],
      HIGH: [0.6, 0.8],
      MEDIUM: [0.4, 0.6],
    }

    const [min, max] = opacityMap[zone.severity]
    material.opacity = min + pulse * (max - min)

    requestAnimationFrame(pulse)
  }

  pulse()
  riskLine.userData = { zone }

  return riskLine
}
```

### 9. REAL-TIME DATA UPDATES
**Update Frequency:** Every 5 seconds during market hours
**Update Types:** Price, change %, volume, risk scores

**Implementation:**
```typescript
const setupDataUpdates = (scene: THREE.Scene, updateInterval: number = 5000) => {
  let updateTimer: NodeJS.Timeout

  const updateLabels = async () => {
    try {
      const stockData = await fetch('/api/stocks').then(r => r.json())

      scene.traverse(object => {
        if (object instanceof THREE.Sprite && object.userData.ticker) {
          const newData = stockData[object.userData.ticker]

          if (newData) {
            object.userData.changePercent = newData.changePercent
            object.userData.price = newData.price

            // Regenerate label texture
            const canvas = document.createElement('canvas')
            canvas.width = 256
            canvas.height = 128
            const ctx = canvas.getContext('2d')!

            // Redraw with new data
            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.strokeStyle = '#00ff88'
            ctx.lineWidth = 2
            ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)

            ctx.fillStyle = '#00ff88'
            ctx.font = 'bold 40px monospace'
            ctx.fillText(newData.ticker, 10, 70)

            const changeColor = newData.changePercent >= 0 ? '#00ff00' : '#ff0055'
            ctx.fillStyle = changeColor
            ctx.font = '32px monospace'
            ctx.fillText(
              `${newData.changePercent >= 0 ? '+' : ''}${newData.changePercent.toFixed(2)}%`,
              140,
              70
            )

            object.material.map = new THREE.CanvasTexture(canvas)
            object.material.map.needsUpdate = true
          }
        }
      })
    } catch (error) {
      console.error('Failed to update stock data:', error)
    }
  }

  updateTimer = setInterval(updateLabels, updateInterval)

  return () => clearInterval(updateTimer)
}
```

---

## COLOR PALETTE (Reference)

| Use Case | Hex Code | RGB |
|----------|----------|-----|
| Black background | #000000 | 0, 0, 0 |
| Neon green (text/borders) | #00ff88 | 0, 255, 136 |
| Electric blue (positive) | #0088ff | 0, 136, 255 |
| Bright cyan (accents) | #00ffff | 0, 255, 255 |
| Blood red (critical) | #ff0055 | 255, 0, 85 |
| Deep orange (warning) | #ff8800 | 255, 136, 0 |
| Gold (highlights) | #ffff00 | 255, 255, 0 |

---

## PERFORMANCE OPTIMIZATION

### Memory Management
```typescript
const disposeGlobe = (scene: THREE.Scene, renderer: THREE.WebGLRenderer) => {
  scene.traverse(object => {
    if (object instanceof THREE.Mesh) {
      object.geometry.dispose()
      if (Array.isArray(object.material)) {
        object.material.forEach(m => m.dispose())
      } else {
        object.material.dispose()
      }
    }
  })

  renderer.dispose()
  renderer.domElement.remove()
}
```

### LOD (Level of Detail)
```typescript
const createLODMesh = (
  highPolyGeom: THREE.Geometry,
  medPolyGeom: THREE.Geometry,
  lowPolyGeom: THREE.Geometry,
  material: THREE.Material
) => {
  const lod = new THREE.LOD()

  const highPoly = new THREE.Mesh(highPolyGeom, material)
  const medPoly = new THREE.Mesh(medPolyGeom, material)
  const lowPoly = new THREE.Mesh(lowPolyGeom, material)

  lod.addLevel(highPoly, 0)
  lod.addLevel(medPoly, 50)
  lod.addLevel(lowPoly, 100)

  return lod
}
```

### Throttling Updates
```typescript
const throttleUpdate = (callback: () => void, interval: number) => {
  let lastUpdate = 0

  return () => {
    const now = Date.now()
    if (now - lastUpdate >= interval) {
      callback()
      lastUpdate = now
    }
  }
}
```

---

## INTERACTIVE CONTROLS

### Mouse Drag to Rotate
```typescript
const setupMouseControls = (scene: THREE.Group, camera: THREE.Camera) => {
  let isDragging = false
  let previousMousePosition = { x: 0, y: 0 }

  document.addEventListener('mousedown', e => {
    isDragging = true
    previousMousePosition = { x: e.clientX, y: e.clientY }
  })

  document.addEventListener('mousemove', e => {
    if (isDragging) {
      const deltaX = e.clientX - previousMousePosition.x
      const deltaY = e.clientY - previousMousePosition.y

      scene.rotation.y += deltaX * 0.005
      scene.rotation.x += deltaY * 0.005

      previousMousePosition = { x: e.clientX, y: e.clientY }
    }
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })
}
```

### Zoom with Mouse Wheel
```typescript
const setupZoom = (camera: THREE.PerspectiveCamera) => {
  const minZoom = 60
  const maxZoom = 200

  document.addEventListener('wheel', e => {
    e.preventDefault()

    if (e.deltaY > 0) {
      camera.position.z = Math.min(camera.position.z + 5, maxZoom)
    } else {
      camera.position.z = Math.max(camera.position.z - 5, minZoom)
    }
  })
}
```

---

## DATA STRUCTURES

### Company Configuration
```typescript
interface Company {
  ticker: string
  name: string
  sector: string
  hq: {
    lat: number
    lon: number
    city: string
    country: string
  }
  marketCap: number
  price: number
  changePercent: number
  volume: number
  govContracts: number
  riskScore: number
  operations: Array<{
    type: 'Manufacturing' | 'R&D' | 'Distribution' | 'Service'
    location: string
    country: string
  }>
  supplyChain: Array<{
    tier: 'Tier-1' | 'Tier-2' | 'Critical'
    company: string
    location: string
    country: string
    riskLevel?: 'low' | 'medium' | 'high' | 'critical'
  }>
}
```

### Risk Zone Configuration
```typescript
interface RiskZone {
  name: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  boundaries: Array<{ lat: number; lon: number }>
  affectedCompanies: string[]
  description: string
  lastUpdated: Date
}
```

---

## TROUBLESHOOTING

### Issue: Labels are backward when looking at globe from certain angles
**Solution:** Use THREE.Sprite with `sizeAttenuation: true` instead of billboarded meshes. Sprites always face camera.

### Issue: Flow line particles disappear or stutter
**Solution:** Use lower particle count (15-20 max) per line. Update positions every 2-3 frames instead of every frame.

### Issue: Globe texture appears stretched or distorted
**Solution:** Ensure texture is equirectangular projection (2:1 aspect ratio). Use standard UV mapping (0-1 range).

### Issue: Performance drops with 100+ labels
**Solution:** Implement frustum culling manually or use THREE.InstancedMesh for repeated geometry. Update labels that are on-screen only.

### Issue: Geopolitical risk zones pulse unevenly
**Solution:** Use `requestAnimationFrame` instead of `setInterval` for animation timing. Keep pulse function independent per zone.

---

## BEST PRACTICES

1. **Separate Concerns:** Keep scene setup, data fetching, and animation in separate functions
2. **Resource Cleanup:** Always dispose geometries, materials, and textures on unmount
3. **Update Frequency:** Limit real-time updates to 5-10 second intervals
4. **Mobile Optimization:** Load lower-res textures on mobile, reduce particle count
5. **Accessibility:** Provide text alternatives for color-coded data
6. **Documentation:** Comment complex shaders and animation logic
7. **Testing:** Test globe rotation, zoom, label updates independently
8. **Performance Monitoring:** Use WebGL stats.js to monitor FPS and memory

---

## FUTURE ENHANCEMENTS

- [ ] WebGL2 rendering for better shader capabilities
- [ ] Post-processing effects (bloom, depth of field)
- [ ] VR headset support with Three.js VR controller
- [ ] Sound design (audio cues for critical alerts)
- [ ] Historical timeline replay with animation
- [ ] Network graph overlay (company relationships)
- [ ] Custom shader material for advanced effects
- [ ] Multi-user synchronized viewing (WebSocket)
- [ ] AR overlay integration
- [ ] Machine learning-based anomaly detection visualization

---

## REFERENCES

**Documentation:**
- Three.js Docs: https://threejs.org/docs/
- WebGL 2.0 Spec: https://www.khronos.org/webgl/wiki/
- Earth Textures: NASA Blue Marble (public domain)

**Performance Tools:**
- stats.js: Frame rate and memory monitoring
- Chrome DevTools WebGL Debugger: Shader inspection

**Related Skills:**
- Canvas 2D Rendering (for heat maps)
- GLSL Shader Programming (for atmospherics)
- Real-time Data Pipeline Architecture
- React Three.js Integration Patterns

