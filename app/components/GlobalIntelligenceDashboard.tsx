'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { TrendingUp, AlertTriangle, Zap } from 'lucide-react'

const STOCKS = [
  { ticker: 'NVDA', name: 'NVIDIA', lat: 37.37, lng: -122.04, price: 875.32, change: 2.45, color: '#22c55e' },
  { ticker: 'PLTR', name: 'Palantir', lat: 39.74, lng: -104.99, price: 28.64, change: 3.21, color: '#06b6d4' },
  { ticker: 'RKLB', name: 'Rocket Lab', lat: 33.92, lng: -118.32, price: 12.89, change: 1.15, color: '#a855f7' },
  { ticker: 'LMT', name: 'Lockheed Martin', lat: 38.98, lng: -77.10, price: 456.78, change: -0.82, color: '#1e40af' },
  { ticker: 'RTX', name: 'RTX Corp', lat: 41.76, lng: -72.68, price: 312.45, change: 1.92, color: '#1e40af' },
  { ticker: 'CRWD', name: 'CrowdStrike', lat: 30.27, lng: -97.74, price: 142.56, change: 2.11, color: '#dc2626' },
]

const RISK_ZONES = [
  {
    name: 'Taiwan Strait',
    severity: 'CRITICAL',
    lat: 24.5,
    lng: 120.5,
    risk: 9.2,
    event: 'PLA Navy Exercise',
    companies: ['NVDA', 'RTX', 'LMT'],
  },
  {
    name: 'Middle East',
    severity: 'HIGH',
    lat: 28.0,
    lng: 42.0,
    risk: 7.1,
    event: 'Regional Tensions',
    companies: ['LMT', 'RTX', 'BA'],
  },
]

export default function GlobalIntelligenceDashboard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const satellitesRef = useRef<THREE.Object3D[]>([])

  const [selectedStock, setSelectedStock] = useState<(typeof STOCKS)[0] | null>(null)
  const [activeRiskZone, setActiveRiskZone] = useState<(typeof RISK_ZONES)[0] | null>(null)
  const [cryptoData] = useState([
    { symbol: 'BTC', price: 52348.29, change: 1.42 },
    { symbol: 'ETH', price: 2856.41, change: 2.18 },
    { symbol: 'SOL', price: 112.34, change: -0.45 },
  ])
  const [futuresData] = useState([
    { symbol: 'ES', price: 5284.32, change: 0.82 },
    { symbol: 'NQ', price: 18634.28, change: 1.21 },
    { symbol: 'YM', price: 43215.67, change: 0.91 },
  ])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000814)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 10000)
    camera.position.z = 150
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(100, 100, 100)
    directionalLight.castShadow = true
    scene.add(ambientLight, directionalLight)

    // Create globe group
    const globeGroup = new THREE.Group()
    globeRef.current = globeGroup
    scene.add(globeGroup)

    // Create Earth with realistic colors (simulating satellite view)
    const earthGeometry = new THREE.SphereGeometry(60, 512, 512)

    // Create canvas-based Earth texture (satellite view)
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Helper: convert lat/lng to pixel coordinates
    const latLngToPixel = (lat: number, lng: number) => {
      const x = ((lng + 180) / 360) * canvas.width
      const y = ((90 - lat) / 180) * canvas.height
      return { x, y }
    }

    // Deep blue oceans
    ctx.fillStyle = '#061a3a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Land masses - brighter, more visible colors
    ctx.fillStyle = '#2a6a3a'  // Forest green for land

    // North America
    const naStart = latLngToPixel(50, -130)
    const naEnd = latLngToPixel(25, -80)
    ctx.fillRect(naStart.x, naEnd.y, naEnd.x - naStart.x, naStart.y - naEnd.y)

    // South America
    const saStart = latLngToPixel(15, -80)
    const saEnd = latLngToPixel(-56, -35)
    ctx.fillRect(saStart.x, saEnd.y, saEnd.x - saStart.x, saStart.y - saEnd.y)

    // Europe & Africa
    const eurStart = latLngToPixel(60, -10)
    const eurEnd = latLngToPixel(36, 45)
    ctx.fillRect(eurStart.x, eurEnd.y, eurEnd.x - eurStart.x, eurStart.y - eurEnd.y)

    // Africa
    const afStart = latLngToPixel(37, -20)
    const afEnd = latLngToPixel(-35, 55)
    ctx.fillRect(afStart.x, afEnd.y, afEnd.x - afStart.x, afStart.y - afEnd.y)

    // Middle East/Western Asia
    ctx.fillStyle = '#3a7a4a'
    const meStart = latLngToPixel(40, 25)
    const meEnd = latLngToPixel(15, 70)
    ctx.fillRect(meStart.x, meEnd.y, meEnd.x - meStart.x, meStart.y - meEnd.y)

    // Central/East Asia
    ctx.fillStyle = '#2a6a3a'
    const asiaStart = latLngToPixel(55, 60)
    const asiaEnd = latLngToPixel(15, 150)
    ctx.fillRect(asiaStart.x, asiaEnd.y, asiaEnd.x - asiaStart.x, asiaStart.y - asiaEnd.y)

    // Southeast Asia & Australia
    ctx.fillStyle = '#3a7a4a'
    const seaStart = latLngToPixel(20, 95)
    const seaEnd = latLngToPixel(-45, 180)
    ctx.fillRect(seaStart.x, seaEnd.y, seaEnd.x - seaStart.x, seaStart.y - seaEnd.y)

    // Greenland
    ctx.fillStyle = '#2a6a3a'
    const glStart = latLngToPixel(83, -45)
    const glEnd = latLngToPixel(60, 10)
    ctx.fillRect(glStart.x, glEnd.y, glEnd.x - glStart.x, glStart.y - glEnd.y)

    // Add subtle shading/noise for realism
    ctx.fillStyle = 'rgba(42, 106, 58, 0.3)'
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.fillRect(x, y, Math.random() * 100 + 20, Math.random() * 80 + 10)
    }

    // Add grid overlay
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 256) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 128) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    const earthTexture = new THREE.CanvasTexture(canvas)
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      emissive: 0x1a3a52,
      emissiveIntensity: 0.4,
      shininess: 10,
    })
    const earth = new THREE.Mesh(earthGeometry, earthMaterial)
    globeGroup.add(earth)

    // Atmospheric glow
    const atmosphereGeometry = new THREE.SphereGeometry(60.5, 256, 256)
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial)
    globeGroup.add(atmosphere)

    // Grid lines on globe
    const gridGeometry = new THREE.SphereGeometry(60.1, 32, 32)
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff88,
      transparent: true,
      opacity: 0.1,
    })
    const gridLines = new THREE.LineSegments(
      new THREE.WireframeGeometry(gridGeometry),
      gridMaterial
    )
    globeGroup.add(gridLines)

    // Stock ticker floating labels
    const latLngToXYZ = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lng + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }

    STOCKS.forEach((stock) => {
      const pos = latLngToXYZ(stock.lat, stock.lng, 75)

      // Create label
      const labelCanvas = document.createElement('canvas')
      labelCanvas.width = 256
      labelCanvas.height = 128
      const labelCtx = labelCanvas.getContext('2d')!

      labelCtx.fillStyle = 'rgba(0, 0, 0, 0.85)'
      labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height)
      labelCtx.strokeStyle = stock.change > 0 ? '#00ff88' : '#ff0055'
      labelCtx.lineWidth = 2
      labelCtx.strokeRect(2, 2, labelCanvas.width - 4, labelCanvas.height - 4)

      labelCtx.fillStyle = '#00ff88'
      labelCtx.font = 'bold 32px monospace'
      labelCtx.fillText(stock.ticker, 10, 50)

      const changeColor = stock.change > 0 ? '#22c55e' : '#dc2626'
      labelCtx.fillStyle = changeColor
      labelCtx.font = 'bold 24px monospace'
      labelCtx.fillText(`${stock.change > 0 ? '+' : ''}${stock.change.toFixed(2)}%`, 140, 50)

      const texture = new THREE.CanvasTexture(labelCanvas)
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: texture, sizeAttenuation: true })
      )
      sprite.position.copy(pos)
      sprite.scale.set(8, 4, 1)
      sprite.userData = { stock }

      globeGroup.add(sprite)

      // Pulse ring around stock
      const ringGeometry = new THREE.TorusGeometry(20, 1.5, 16, 32)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: stock.color,
        transparent: true,
        opacity: 0.5,
      })
      const ring = new THREE.Mesh(ringGeometry, ringMaterial)
      ring.position.copy(pos)
      ring.lookAt(camera.position)
      ring.userData = { stock, pulseSpeed: 0.02 + Math.random() * 0.02 }
      globeGroup.add(ring)
    })

    // Geopolitical risk zone indicators
    RISK_ZONES.forEach((zone) => {
      const pos = latLngToXYZ(zone.lat, zone.lng, 65)

      // Create alert marker
      const alertGeometry = new THREE.IcosahedronGeometry(8, 4)
      const alertMaterial = new THREE.MeshStandardMaterial({
        color: zone.severity === 'CRITICAL' ? 0xff0055 : 0xff8800,
        emissive: zone.severity === 'CRITICAL' ? 0xff0055 : 0xff8800,
        emissiveIntensity: 0.8,
        metalness: 0.7,
        roughness: 0.2,
      })
      const alertMesh = new THREE.Mesh(alertGeometry, alertMaterial)
      alertMesh.position.copy(pos)
      alertMesh.userData = { zone, isPulsing: true }
      globeGroup.add(alertMesh)

      // Alert halo
      const haloGeometry = new THREE.IcosahedronGeometry(10, 2)
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: zone.severity === 'CRITICAL' ? 0xff0055 : 0xff8800,
        transparent: true,
        opacity: 0.2,
      })
      const halo = new THREE.Mesh(haloGeometry, haloMaterial)
      halo.position.copy(pos)
      alertMesh.userData.halo = halo
      globeGroup.add(halo)
    })

    // Orbiting satellites
    const createSatellite = () => {
      const geometry = new THREE.OctahedronGeometry(3, 0)
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.6,
      })
      const satellite = new THREE.Mesh(geometry, material)

      // Random orbit
      const orbitRadius = 100 + Math.random() * 30
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * 80

      satellite.position.set(
        Math.cos(angle) * orbitRadius,
        height,
        Math.sin(angle) * orbitRadius
      )

      satellite.userData = {
        orbitRadius,
        orbitAngle: angle,
        orbitSpeed: 0.0001 + Math.random() * 0.0002,
        height,
      }

      globeGroup.add(satellite)
      satellitesRef.current.push(satellite)
    }

    // Create 5 satellites
    for (let i = 0; i < 5; i++) {
      createSatellite()
    }

    // Background stars
    const starCount = 1000
    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 600
      starPositions[i + 1] = (Math.random() - 0.5) * 600
      starPositions[i + 2] = (Math.random() - 0.5) * 600
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Animation loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Rotate globe
      globeGroup.rotation.y += 0.0001

      // Animate satellites
      satellitesRef.current.forEach((satellite) => {
        satellite.userData.orbitAngle += satellite.userData.orbitSpeed
        const radius = satellite.userData.orbitRadius
        const angle = satellite.userData.orbitAngle

        satellite.position.x = Math.cos(angle) * radius
        satellite.position.z = Math.sin(angle) * radius
        satellite.rotation.x += 0.01
        satellite.rotation.y += 0.015
      })

      // Pulse risk zone markers
      scene.traverse((obj) => {
        if (obj.userData?.zone && obj.userData?.isPulsing) {
          const time = Date.now() * 0.003
          obj.scale.set(
            1 + Math.sin(time) * 0.3,
            1 + Math.sin(time) * 0.3,
            1 + Math.sin(time) * 0.3
          )
          if (obj.userData.halo) {
            obj.userData.halo.rotation.z += 0.005
          }
        }
      })

      // Pulse stock rings
      scene.traverse((obj) => {
        if (obj.userData?.stock && obj.userData?.pulseSpeed) {
          const time = Date.now() * obj.userData.pulseSpeed
          obj.scale.set(1 + Math.sin(time) * 0.2, 1 + Math.sin(time) * 0.2, 1)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Mouse controls
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

        globeGroup.rotation.y += deltaX * 0.005
        globeGroup.rotation.x += deltaY * 0.005

        previousMousePosition = { x: e.clientX, y: e.clientY }
      }
    }

    const onMouseUp = () => {
      isDragging = false
    }

    renderer.domElement.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    const handleResize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      renderer.domElement.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div className="relative w-full h-screen bg-[#000814]">
      {/* Globe Container */}
      <div ref={containerRef} className="absolute inset-0 overflow-hidden" />

      {/* Left Sidebar - Correlations */}
      <div className="absolute left-4 top-20 w-80 glass p-4 rounded border border-[var(--border)] max-h-[400px] overflow-y-auto z-20 pointer-events-auto">
        <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-4">
          ◆ Global Defence Correlations
        </div>
        <div className="space-y-3">
          {[
            { pair: 'LMT ↔ RTX', corr: 84.0 },
            { pair: 'NVDA ↔ PLTR', corr: 72.5 },
            { pair: 'RKLB ↔ LMT', corr: 68.3 },
            { pair: 'CRWD ↔ RTX', corr: 65.2 },
          ].map((item) => (
            <div key={item.pair} className="bg-[rgba(0,0,0,0.3)] p-2 rounded border border-[var(--border)]">
              <div className="font-mono text-[9px] text-white font-bold">{item.pair}</div>
              <div className="font-mono text-[9px] text-[var(--accent)]">{item.corr.toFixed(1)}% correlation</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar - Crypto & Futures */}
      <div className="absolute right-4 top-20 w-80 glass p-4 rounded border border-[var(--border)] max-h-[500px] overflow-y-auto z-20 pointer-events-auto">
        <div className="mb-6">
          <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-3">
            ◆ Crypto Markets
          </div>
          <div className="space-y-2">
            {cryptoData.map((crypto) => (
              <div key={crypto.symbol} className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-white">{crypto.symbol}</span>
                <span className={crypto.change > 0 ? 'text-[#22c55e]' : 'text-[#dc2626]'}>
                  {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-3">
            ◆ Futures
          </div>
          <div className="space-y-2">
            {futuresData.map((future) => (
              <div key={future.symbol} className="flex justify-between items-center font-mono text-[10px]">
                <span className="text-white">/{future.symbol}</span>
                <span className={future.change > 0 ? 'text-[#22c55e]' : 'text-[#dc2626]'}>
                  {future.change > 0 ? '+' : ''}{future.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Right - Alert Panel */}
      {RISK_ZONES.map((zone) => (
        <div key={zone.name} className="absolute top-4 right-4 glass p-4 rounded border-2 z-20 pointer-events-auto"
          style={{ borderColor: zone.severity === 'CRITICAL' ? '#ff0055' : '#ff8800' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle
              size={18}
              style={{ color: zone.severity === 'CRITICAL' ? '#ff0055' : '#ff8800' }}
            />
            <div className="font-mono text-[10px] font-bold"
              style={{ color: zone.severity === 'CRITICAL' ? '#ff0055' : '#ff8800' }}>
              {zone.severity} ALERT
            </div>
          </div>
          <div className="font-mono text-[9px] text-white mb-1">{zone.event}</div>
          <div className="font-mono text-[9px] text-[var(--text-dim)]">Risk: {zone.risk}/10</div>
          <div className="font-mono text-[9px] text-[var(--accent)] mt-2">
            Affecting: {zone.companies.join(', ')}
          </div>
        </div>
      ))}

      {/* Bottom Center - Status */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass p-4 rounded border border-[var(--border)] z-20 font-mono text-[9px] pointer-events-auto">
        <div className="text-[var(--accent)] flex items-center gap-2 mb-2">
          <Zap size={14} />
          Risk Score System Active · 6 Geopolitical Zones · 847 Signal Events / 24h
        </div>
        <div className="text-[var(--text-dim)]">Latency: 12ms · Sources: SEC · DARPA · USASpending · Finnhub</div>
      </div>
    </div>
  )
}
