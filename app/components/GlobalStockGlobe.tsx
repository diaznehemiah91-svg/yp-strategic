'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { X, TrendingUp, AlertTriangle, MapPin } from 'lucide-react'

const COMPANY_DATA = [
  {
    ticker: 'LMT',
    name: 'Lockheed Martin',
    sector: 'Defence Primes',
    hq: { city: 'Bethesda, MD', lat: 38.9816, lng: -77.1043, country: 'USA' },
    marketCap: 215.5,
    operations: [
      { type: 'Manufacturing', location: 'Grand Prairie, TX', country: 'USA', employees: 2400 },
      { type: 'R&D', location: 'Orlando, FL', country: 'USA', focus: 'Missiles & Defense' },
      { type: 'Manufacturing', location: 'Fort Worth, TX', country: 'USA', employees: 3200 },
    ],
    supplyChain: [
      { tier: 'Tier-1', company: 'Collins Aerospace', location: 'Connecticut', country: 'USA' },
      { tier: 'Tier-2', company: 'TSMC', location: 'Taiwan', country: 'Taiwan', riskLevel: 'high' },
    ],
    govContracts: 127,
    riskScore: 7.2,
  },
  {
    ticker: 'RTX',
    name: 'RTX Corporation',
    sector: 'Defence Primes',
    hq: { city: 'Arlington, VA', lat: 38.8816, lng: -77.0945, country: 'USA' },
    marketCap: 278.3,
    operations: [
      { type: 'Manufacturing', location: 'Waltham, MA', country: 'USA', employees: 1800 },
      { type: 'R&D', location: 'East Hartford, CT', country: 'USA', focus: 'Aerospace Systems' },
    ],
    supplyChain: [
      { tier: 'Tier-1', company: 'Safran', location: 'France', country: 'France' },
    ],
    govContracts: 215,
    riskScore: 6.1,
  },
  {
    ticker: 'NOC',
    name: 'Northrop Grumman',
    sector: 'Defence Primes',
    hq: { city: 'Falls Church, VA', lat: 38.8808, lng: -77.1513, country: 'USA' },
    marketCap: 135.8,
    operations: [
      { type: 'Manufacturing', location: 'Melbourne, FL', country: 'USA', employees: 2100 },
      { type: 'Space Systems', location: 'Redondo Beach, CA', country: 'USA', focus: 'Satellites' },
    ],
    supplyChain: [
      { tier: 'Tier-1', company: 'DRS Technologies', location: 'New York', country: 'USA' },
    ],
    govContracts: 98,
    riskScore: 5.8,
  },
  {
    ticker: 'GD',
    name: 'General Dynamics',
    sector: 'Defence Primes',
    hq: { city: 'Reston, VA', lat: 38.9586, lng: -77.3627, country: 'USA' },
    marketCap: 95.2,
    operations: [
      { type: 'Combat Systems', location: 'Detroit, MI', country: 'USA', employees: 3100 },
    ],
    supplyChain: [],
    govContracts: 156,
    riskScore: 6.5,
  },
  {
    ticker: 'BA',
    name: 'Boeing',
    sector: 'Defence Primes',
    hq: { city: 'Arlington, VA', lat: 38.8870, lng: -77.0995, country: 'USA' },
    marketCap: 198.7,
    operations: [
      { type: 'Commercial Aircraft', location: 'Seattle, WA', country: 'USA', employees: 28000 },
      { type: 'Defence Space', location: 'Long Beach, CA', country: 'USA', employees: 6500 },
    ],
    supplyChain: [
      { tier: 'Tier-1', company: 'Spirit AeroSystems', location: 'Oklahoma', country: 'USA' },
      { tier: 'Tier-2', company: 'MTU Aero Engines', location: 'Germany', country: 'Germany' },
    ],
    govContracts: 187,
    riskScore: 8.3,
  },
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    sector: 'Defence IT',
    hq: { city: 'Denver, CO', lat: 39.7392, lng: -104.9903, country: 'USA' },
    marketCap: 64.2,
    operations: [
      { type: 'Software Development', location: 'Palo Alto, CA', country: 'USA' },
      { type: 'Government', location: 'Washington, DC', country: 'USA' },
    ],
    supplyChain: [
      { tier: 'Cloud', company: 'AWS', location: 'Multiple', country: 'USA' },
    ],
    govContracts: 42,
    riskScore: 4.2,
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    sector: 'Semiconductors',
    hq: { city: 'Santa Clara, CA', lat: 37.3687, lng: -121.9453, country: 'USA' },
    marketCap: 1285.9,
    operations: [
      { type: 'Design', location: 'San Jose, CA', country: 'USA' },
      { type: 'Fabless', location: 'Multiple', country: 'Taiwan', focus: 'TSMC Partnership' },
    ],
    supplyChain: [
      { tier: 'Critical', company: 'TSMC', location: 'Taiwan', country: 'Taiwan', riskLevel: 'critical' },
      { tier: 'Tier-1', company: 'Samsung', location: 'South Korea', country: 'South Korea' },
    ],
    govContracts: 18,
    riskScore: 9.1,
  },
  {
    ticker: 'CRWD',
    name: 'CrowdStrike',
    sector: 'Cybersecurity',
    hq: { city: 'Austin, TX', lat: 30.2672, lng: -97.7431, country: 'USA' },
    marketCap: 38.5,
    operations: [
      { type: 'Engineering', location: 'Sunnyvale, CA', country: 'USA' },
    ],
    supplyChain: [
      { tier: 'Cloud', company: 'AWS', location: 'Global', country: 'USA' },
    ],
    govContracts: 23,
    riskScore: 3.1,
  },
]

const SECTOR_COLORS: Record<string, string> = {
  'Defence Primes': '#1e40af',
  'Defence IT': '#06b6d4',
  Cybersecurity: '#dc2626',
  Semiconductors: '#22c55e',
  Space: '#a855f7',
  Energy: '#f97316',
}

const latLngToXYZ = (lat: number, lng: number, radius: number = 2.5) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

export default function GlobalStockGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const pinsRef = useRef<Map<string, THREE.Object3D>>(new Map())
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  const [selectedCompany, setSelectedCompany] = useState<(typeof COMPANY_DATA)[0] | null>(null)
  const [hoveredTicker, setHoveredTicker] = useState<string | null>(null)
  const [stockPrices, setStockPrices] = useState<Record<string, { price: number; change: number }>>({})
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })

  // Fetch stock prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('/api/stocks')
        const data = await response.json()
        const priceMap: Record<string, { price: number; change: number }> = {}
        data.forEach((stock: any) => {
          priceMap[stock.ticker] = {
            price: stock.price,
            change: stock.change,
          }
        })
        setStockPrices(priceMap)
      } catch (error) {
        console.error('Failed to fetch stock prices:', error)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 6
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00d4ff, 1)
    pointLight.position.set(4, 4, 4)
    scene.add(pointLight)

    // Globe Group
    const globeGroup = new THREE.Group()
    globeRef.current = globeGroup
    scene.add(globeGroup)

    // Create Globe
    const globeGeom = new THREE.SphereGeometry(2.5, 128, 128)
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0a1628,
      emissive: 0x001a3d,
      wireframe: false,
      shininess: 10,
    })
    const globe = new THREE.Mesh(globeGeom, globeMat)
    globeGroup.add(globe)

    // Wireframe overlay
    const wireframeGeom = new THREE.SphereGeometry(2.52, 64, 64)
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.06,
    })
    const wireframeLines = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireframeGeom),
      wireframeMat
    )
    globeGroup.add(wireframeLines)

    // Atmospheric glow
    const glowGeom = new THREE.SphereGeometry(2.6, 64, 64)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    })
    const glow = new THREE.Mesh(glowGeom, glowMat)
    globeGroup.add(glow)

    // Create company pins
    COMPANY_DATA.forEach((company, index) => {
      const pos = latLngToXYZ(company.hq.lat, company.hq.lng)

      const pinGroup = new THREE.Group()
      pinGroup.position.copy(pos)
      pinGroup.userData = {
        company,
        ticker: company.ticker,
      }

      // Bubble size based on market cap (normalized)
      const bubbleScale = Math.min(0.08 + (company.marketCap / 500) * 0.1, 0.25)

      // Pin sphere
      const pinGeom = new THREE.SphereGeometry(bubbleScale, 20, 20)
      const pinColor = SECTOR_COLORS[company.sector] || '#00d4ff'
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.6,
        metalness: 0.7,
        roughness: 0.2,
      })
      const pinMesh = new THREE.Mesh(pinGeom, pinMat)
      pinGroup.add(pinMesh)

      // Pulsing ring
      const ringGeom = new THREE.TorusGeometry(bubbleScale * 1.8, bubbleScale * 0.15, 16, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.5,
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      pinGroup.add(ring)

      pinGroup.userData.pulseRing = ring
      pinGroup.userData.bubbleScale = bubbleScale
      pinGroup.scale.set(0, 0, 0)

      globeGroup.add(pinGroup)
      pinsRef.current.set(company.ticker, pinGroup)

      // Animate appearance
      setTimeout(() => {
        const startTime = Date.now()
        const duration = 400
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          pinGroup.scale.set(progress, progress, progress)
          if (progress < 1) requestAnimationFrame(animate)
        }
        animate()
      }, index * 40)

      // Create supply chain pins
      company.supplyChain.forEach((supplier) => {
        // Simulate supply chain location (would use real coordinates in production)
        const offsetLat = company.hq.lat + (Math.random() - 0.5) * 15
        const offsetLng = company.hq.lng + (Math.random() - 0.5) * 15
        const supPos = latLngToXYZ(offsetLat, offsetLng)

        const supGeom = new THREE.SphereGeometry(bubbleScale * 0.5, 12, 12)
        const supColor = supplier.riskLevel === 'critical' ? '#dc2626' : supplier.riskLevel === 'high' ? '#f97316' : '#fbbf24'
        const supMat = new THREE.MeshStandardMaterial({
          color: supColor,
          emissive: supColor,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.6,
        })
        const supPin = new THREE.Mesh(supGeom, supMat)
        supPin.position.copy(supPos)
        supPin.userData = {
          company,
          isSupplier: true,
          supplier: supplier.company,
        }
        globeGroup.add(supPin)
      })
    })

    // Background stars
    const starCount = 500
    const starGeom = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 50
      starPositions[i + 1] = (Math.random() - 0.5) * 50
      starPositions[i + 2] = (Math.random() - 0.5) * 50
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, sizeAttenuation: true })
    const stars = new THREE.Points(starGeom, starMat)
    scene.add(stars)

    // Animation Loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      if (!isDragging) {
        targetRotationRef.current.y += 0.0002
      }

      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1

      if (globeGroup) {
        globeGroup.rotation.x = rotationRef.current.x
        globeGroup.rotation.y = rotationRef.current.y
      }

      // Animate pins with stock performance
      pinsRef.current.forEach((pin, ticker) => {
        const price = stockPrices[ticker]
        if (pin.userData.pulseRing) {
          const time = Date.now() * 0.003
          const pulse = 0.7 + Math.sin(time) * 0.4
          pin.userData.pulseRing.scale.set(pulse, pulse, 1)

          // Color change based on stock performance
          if (price && price.change > 0) {
            pin.userData.pulseRing.material.color.set(0x22c55e) // Green
          } else if (price && price.change < 0) {
            pin.userData.pulseRing.material.color.set(0xdc2626) // Red
          }
        }

        // Scale bubble based on trading activity (simulated)
        if (hoveredTicker === ticker) {
          pin.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.1)
        } else {
          pin.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // Mouse interactions
    const onMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      dragStartRef.current = { x: e.clientX, y: e.clientY }
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1

      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x
        const deltaY = e.clientY - dragStartRef.current.y
        targetRotationRef.current.y += deltaX * 0.01
        targetRotationRef.current.x += deltaY * 0.01
        dragStartRef.current = { x: e.clientX, y: e.clientY }
      } else {
        raycasterRef.current.setFromCamera(mouseRef.current, camera)
        const pins = Array.from(pinsRef.current.values())
        const intersects = raycasterRef.current.intersectObjects(pins, true)

        if (intersects.length > 0) {
          const pin = intersects[0].object.parent as THREE.Object3D
          setHoveredTicker(pin.userData?.ticker || null)
        } else {
          setHoveredTicker(null)
        }
      }
    }

    const onMouseUp = () => {
      setIsDragging(false)
    }

    const onClick = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1

      raycasterRef.current.setFromCamera(mouseRef.current, camera)
      const pins = Array.from(pinsRef.current.values())
      const intersects = raycasterRef.current.intersectObjects(pins, true)

      if (intersects.length > 0) {
        const pin = intersects[0].object.parent as THREE.Object3D
        const company = pin.userData?.company
        if (company) {
          setSelectedCompany(company)
        }
      }
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    container.addEventListener('click', onClick)

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
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      container.removeEventListener('click', onClick)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [isDragging, hoveredTicker, stockPrices])

  const getStockColor = (change: number) => {
    return change > 0 ? '#22c55e' : change < 0 ? '#dc2626' : '#94a3b8'
  }

  return (
    <>
      {/* Section Header */}
      <div className="mb-4 fade-up d6">
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Global Stock Intelligence Globe
        </div>
      </div>

      {/* Stats Bar */}
      <div className="glass mb-4 p-4 fade-up d6">
        <div className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-dim)]">
          {COMPANY_DATA.length} Companies Tracked · {COMPANY_DATA.reduce((acc, c) => acc + c.operations.length, 0)} Global Operations · Risk Score System Active
        </div>
      </div>

      {/* 3D Globe */}
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-lg border border-[var(--border)] mb-7 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: '70vh', perspective: '1200px' }}
      />

      {/* Hover Tooltip */}
      {hoveredTicker && stockPrices[hoveredTicker] && (
        <div className="fixed bottom-4 left-4 glass p-4 rounded border border-[var(--border)] z-20 font-mono text-[10px]">
          <div className="text-white font-bold mb-2">{hoveredTicker}</div>
          <div className="flex items-center gap-2">
            <span className="text-[var(--text-dim)]">$</span>
            <span className="text-white">{stockPrices[hoveredTicker].price.toFixed(2)}</span>
            <span className={getStockColor(stockPrices[hoveredTicker].change)}>
              {stockPrices[hoveredTicker].change > 0 ? '+' : ''}{stockPrices[hoveredTicker].change.toFixed(2)}%
            </span>
          </div>
          <div className="text-[var(--text-dim)] mt-2">Click for details</div>
        </div>
      )}

      {/* Detail Panel */}
      {selectedCompany && (
        <div className="fixed right-0 top-0 h-screen w-[420px] glass border-l border-[var(--border)] overflow-y-auto z-30 shadow-[0_0_50px_rgba(0,255,80,0.1)]">
          <div className="sticky top-0 bg-black/80 backdrop-blur p-6 border-b border-[var(--border)]">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-2xl font-black text-white">{selectedCompany.ticker}</div>
                <div className="font-mono text-xs text-[var(--text-dim)]">{selectedCompany.name}</div>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Stock Price */}
            {stockPrices[selectedCompany.ticker] && (
              <div className="mt-4 pt-4 border-t border-[var(--border)]">
                <div className="flex items-baseline gap-3">
                  <div className="font-mono text-xl font-bold text-white">
                    ${stockPrices[selectedCompany.ticker].price.toFixed(2)}
                  </div>
                  <div
                    className="font-mono text-sm font-bold flex items-center gap-1"
                    style={{ color: getStockColor(stockPrices[selectedCompany.ticker].change) }}
                  >
                    <TrendingUp size={14} />
                    {stockPrices[selectedCompany.ticker].change > 0 ? '+' : ''}
                    {stockPrices[selectedCompany.ticker].change.toFixed(2)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            {/* Headquarters */}
            <div>
              <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <MapPin size={12} />◆ Headquarters
              </div>
              <div className="font-mono text-[10px]">
                <div className="text-white font-bold">{selectedCompany.hq.city}</div>
                <div className="text-[var(--text-dim)]">{selectedCompany.hq.country}</div>
                <div className="text-[var(--text-dim)] text-[9px] mt-1">
                  {selectedCompany.hq.lat.toFixed(4)}°, {selectedCompany.hq.lng.toFixed(4)}°
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div>
              <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3">◆ Key Metrics</div>
              <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded border border-[var(--border)]">
                  <div className="text-[var(--text-dim)]">Market Cap</div>
                  <div className="text-white font-bold">${selectedCompany.marketCap}B</div>
                </div>
                <div className="bg-[rgba(0,0,0,0.3)] p-3 rounded border border-[var(--border)]">
                  <div className="text-[var(--text-dim)]">Gov Contracts</div>
                  <div className="text-white font-bold">{selectedCompany.govContracts}</div>
                </div>
              </div>
            </div>

            {/* Geopolitical Risk */}
            <div>
              <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3 flex items-center gap-2">
                <AlertTriangle size={12} />◆ Risk Assessment
              </div>
              <div className="relative h-2 bg-[rgba(0,0,0,0.3)] rounded overflow-hidden border border-[var(--border)]">
                <div
                  className="h-full bg-gradient-to-r from-[#22c55e] to-[#dc2626]"
                  style={{ width: `${(selectedCompany.riskScore / 10) * 100}%` }}
                />
              </div>
              <div className="font-mono text-[9px] text-[var(--text-dim)] mt-2 flex justify-between">
                <span>Geopolitical Risk</span>
                <span className="text-white font-bold">{selectedCompany.riskScore}/10</span>
              </div>
            </div>

            {/* Operations */}
            <div>
              <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3">
                ◆ Operations ({selectedCompany.operations.length})
              </div>
              <div className="space-y-2">
                {selectedCompany.operations.map((op: any, i) => (
                  <div key={i} className="bg-[rgba(0,0,0,0.3)] p-3 rounded border border-[var(--border)] font-mono text-[9px]">
                    <div className="text-white font-bold">{op.type}</div>
                    <div className="text-[var(--text-dim)]">{op.location}, {op.country}</div>
                    {op.employees && <div className="text-[var(--accent2)]">{op.employees.toLocaleString()} employees</div>}
                    {op.focus && <div className="text-[var(--accent)]">{op.focus}</div>}
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Chain */}
            {selectedCompany.supplyChain.length > 0 && (
              <div>
                <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3">
                  ◆ Supply Chain ({selectedCompany.supplyChain.length})
                </div>
                <div className="space-y-2">
                  {selectedCompany.supplyChain.map((supplier, i) => (
                    <div key={i} className="bg-[rgba(0,0,0,0.3)] p-3 rounded border border-[var(--border)] font-mono text-[9px]">
                      <div className="text-white font-bold">{supplier.company}</div>
                      <div className="text-[var(--text-dim)]">{supplier.location}, {supplier.country}</div>
                      {supplier.riskLevel && (
                        <div
                          className="text-[9px] font-bold mt-1"
                          style={{
                            color:
                              supplier.riskLevel === 'critical'
                                ? '#dc2626'
                                : supplier.riskLevel === 'high'
                                  ? '#f97316'
                                  : '#22c55e',
                          }}
                        >
                          {supplier.riskLevel.toUpperCase()} RISK
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
