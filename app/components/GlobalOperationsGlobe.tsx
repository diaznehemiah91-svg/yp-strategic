'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { X } from 'lucide-react'

const COMPANY_LOCATIONS = [
  // DEFENCE PRIMES
  {
    ticker: 'LMT',
    name: 'Lockheed Martin',
    sector: 'Defence Primes',
    hq: { lat: 38.89, lng: -77.03, city: 'Bethesda, MD' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — F-35 Assembly' },
      { lat: 35.68, lng: 139.69, region: 'Japan — Aegis Systems' },
      { lat: -33.86, lng: 151.2, region: 'Australia — Integrated Defence' },
      { lat: 32.08, lng: 34.78, region: 'Israel — Arrow Missile Defense' },
      { lat: 24.47, lng: 54.37, region: 'UAE — THAAD Operations' },
    ],
  },
  {
    ticker: 'RTX',
    name: 'RTX Corporation',
    sector: 'Defence Primes',
    hq: { lat: 41.76, lng: -72.68, city: 'Arlington, VA' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — Pratt & Whitney MRO' },
      { lat: 48.85, lng: 2.35, region: 'France — Thales Partnership' },
      { lat: 1.35, lng: 103.82, region: 'Singapore — Raytheon Asia Pacific' },
      { lat: 25.27, lng: 55.29, region: 'Dubai — Middle East Defence Hub' },
    ],
  },
  {
    ticker: 'NOC',
    name: 'Northrop Grumman',
    sector: 'Defence Primes',
    hq: { lat: 38.88, lng: -77.1, city: 'Falls Church, VA' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — EAWS Cyber Centre' },
      { lat: -33.86, lng: 151.2, region: 'Australia — Space Systems' },
      { lat: 32.08, lng: 34.78, region: 'Israel — Litening Pod Production' },
    ],
  },
  {
    ticker: 'GD',
    name: 'General Dynamics',
    sector: 'Defence Primes',
    hq: { lat: 38.88, lng: -77.1, city: 'Reston, VA' },
    operations: [
      { lat: 45.42, lng: -75.69, region: 'Canada — LAV Manufacturing' },
      { lat: 51.5, lng: -0.12, region: 'UK — Ajax Vehicle Programme' },
      { lat: 24.47, lng: 54.37, region: 'UAE — Armored Vehicle Services' },
    ],
  },
  {
    ticker: 'BA',
    name: 'Boeing',
    sector: 'Defence Primes',
    hq: { lat: 38.9, lng: -77.03, city: 'Arlington, VA' },
    operations: [
      { lat: 47.61, lng: -122.33, region: 'Seattle — Commercial + KC-46' },
      { lat: -33.86, lng: 151.2, region: 'Australia — Loyal Wingman' },
      { lat: 51.5, lng: -0.12, region: 'UK — P-8A Poseidon' },
      { lat: 37.57, lng: 126.97, region: 'South Korea — F-15EX' },
      { lat: 26.07, lng: 50.55, region: 'Bahrain — F-16 Support' },
    ],
  },
  {
    ticker: 'HII',
    name: 'Huntington Ingalls',
    sector: 'Defence Primes',
    hq: { lat: 36.97, lng: -76.42, city: 'Newport News, VA' },
    operations: [{ lat: 30.39, lng: -88.88, region: 'Pascagoula, MS — Shipbuilding' }],
  },
  // DEFENCE IT
  {
    ticker: 'PLTR',
    name: 'Palantir Technologies',
    sector: 'Defence IT',
    hq: { lat: 37.55, lng: -122.27, city: 'Denver, CO' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — NHS + GCHQ Contracts' },
      { lat: 48.85, lng: 2.35, region: 'France — DGSI Intelligence' },
      { lat: 50.11, lng: 8.68, region: 'Germany — BND Operations' },
      { lat: 32.08, lng: 34.78, region: 'Israel — IDF Gotham Deployment' },
      { lat: 48.38, lng: 31.16, region: 'Ukraine — Battlefield AI' },
    ],
  },
  {
    ticker: 'LDOS',
    name: 'Leidos Holdings',
    sector: 'Defence IT',
    hq: { lat: 38.88, lng: -77.1, city: 'Reston, VA' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — Defence Digital Services' },
      { lat: -33.86, lng: 151.2, region: 'Australia — Electronic Warfare' },
    ],
  },
  // CYBERSECURITY
  {
    ticker: 'CRWD',
    name: 'CrowdStrike',
    sector: 'Cybersecurity',
    hq: { lat: 33.02, lng: -96.84, city: 'Austin, TX' },
    operations: [
      { lat: 51.5, lng: -0.12, region: 'UK — EMEA Threat Operations' },
      { lat: 1.35, lng: 103.82, region: 'Singapore — APAC SOC' },
      { lat: 35.68, lng: 139.69, region: 'Japan — Enterprise Endpoint' },
      { lat: 19.07, lng: 72.87, region: 'India — Threat Research Lab' },
    ],
  },
  // SEMICONDUCTORS
  {
    ticker: 'NVDA',
    name: 'NVIDIA',
    sector: 'Semiconductors',
    hq: { lat: 37.37, lng: -122.04, city: 'Santa Clara, CA' },
    operations: [
      { lat: 25.03, lng: 121.56, region: 'Taiwan — TSMC Fabrication' },
      { lat: 37.57, lng: 126.97, region: 'South Korea — Samsung Foundry' },
      { lat: 52.52, lng: 13.4, region: 'Germany — Automotive AI' },
      { lat: 32.08, lng: 34.78, region: 'Israel — Mellanox R&D' },
      { lat: 19.07, lng: 72.87, region: 'India — GPU Cloud Infra' },
    ],
  },
  // SPACE
  {
    ticker: 'RKLB',
    name: 'Rocket Lab',
    sector: 'Space',
    hq: { lat: 33.92, lng: -118.32, city: 'Long Beach, CA' },
    operations: [
      { lat: -39.26, lng: 177.86, region: 'New Zealand — Mahia Launch Complex' },
      { lat: 37.84, lng: -75.48, region: 'Virginia — Wallops Launch' },
    ],
  },
  // QUANTUM
  {
    ticker: 'IONQ',
    name: 'IonQ',
    sector: 'Quantum',
    hq: { lat: 39.29, lng: -76.61, city: 'College Park, MD' },
    operations: [
      { lat: 47.61, lng: -122.33, region: 'Seattle — Azure Quantum' },
      { lat: 52.52, lng: 13.4, region: 'Germany — EU Quantum Initiative' },
    ],
  },
]

const SECTOR_COLORS: Record<string, string> = {
  'Defence Primes': '#00ff52',
  'Defence IT': '#00d4ff',
  Cybersecurity: '#ff3355',
  Semiconductors: '#ffa500',
  Space: '#a855f7',
  Quantum: '#00ffff',
  'Nuclear / Energy': '#ffff00',
}

const latLngToXYZ = (lat: number, lng: number, radius: number = 2) => {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

export default function GlobalOperationsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeRef = useRef<THREE.Group | null>(null)
  const pinsRef = useRef<Map<string, THREE.Object3D>>(new Map())
  const arcsRef = useRef<THREE.Line[]>([])
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())

  const [selectedCompany, setSelectedCompany] = useState<(typeof COMPANY_LOCATIONS)[0] | null>(null)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(Object.keys(SECTOR_COLORS)))
  const [isDragging, setIsDragging] = useState(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const rotationRef = useRef({ x: 0, y: 0 })
  const targetRotationRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene Setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00ff52, 0.8)
    pointLight.position.set(3, 3, 3)
    scene.add(pointLight)

    const spotLight = new THREE.SpotLight(0x00d4ff, 0.6)
    spotLight.position.set(-3, 4, 3)
    scene.add(spotLight)

    // Globe Group
    const globeGroup = new THREE.Group()
    globeRef.current = globeGroup
    scene.add(globeGroup)

    // Create Globe
    const globeGeom = new THREE.SphereGeometry(2, 64, 64)
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x0a0f1a,
      emissive: 0x001a2e,
      wireframe: false,
      shininess: 5,
    })
    const globe = new THREE.Mesh(globeGeom, globeMat)
    globeGroup.add(globe)

    // Wireframe overlay (very subtle)
    const wireframeGeom = new THREE.SphereGeometry(2.01, 32, 32)
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x00ff52,
      transparent: true,
      opacity: 0.08,
      linewidth: 1,
    })
    const wireframeLines = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireframeGeom),
      wireframeMat
    )
    globeGroup.add(wireframeLines)

    // Atmospheric glow
    const glowGeom = new THREE.SphereGeometry(2.1, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    })
    const glow = new THREE.Mesh(glowGeom, glowMat)
    globeGroup.add(glow)

    // Create company pins with staggered animation
    COMPANY_LOCATIONS.forEach((company, index) => {
      const pos = latLngToXYZ(company.hq.lat, company.hq.lng)

      const pinGroup = new THREE.Group()
      pinGroup.position.copy(pos)
      pinGroup.userData = {
        company,
        ticker: company.ticker,
        isHQ: true,
      }

      // Pin geometry
      const pinGeom = new THREE.SphereGeometry(0.12, 16, 16)
      const pinColor = SECTOR_COLORS[company.sector] || '#00ff52'
      const pinMat = new THREE.MeshStandardMaterial({
        color: pinColor,
        emissive: pinColor,
        emissiveIntensity: 0.8,
        metalness: 0.8,
        roughness: 0.2,
      })
      const pinMesh = new THREE.Mesh(pinGeom, pinMat)
      pinGroup.add(pinMesh)

      // Pulsing ring
      const ringGeom = new THREE.TorusGeometry(0.2, 0.02, 16, 32)
      const ringMat = new THREE.MeshBasicMaterial({
        color: pinColor,
        transparent: true,
        opacity: 0.6,
      })
      const ring = new THREE.Mesh(ringGeom, ringMat)
      ring.userData.isPulsingRing = true
      pinGroup.add(ring)

      pinGroup.userData.pulseRing = ring
      pinGroup.scale.set(0, 0, 0)

      globeGroup.add(pinGroup)
      pinsRef.current.set(company.ticker, pinGroup)

      // Animate pin appearance
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
      }, index * 50)

      // Create operation pins
      company.operations.forEach((op) => {
        const opPos = latLngToXYZ(op.lat, op.lng)
        const opPinGeom = new THREE.SphereGeometry(0.06, 12, 12)
        const opPinMat = new THREE.MeshStandardMaterial({
          color: pinColor,
          emissive: pinColor,
          emissiveIntensity: 0.6,
          metalness: 0.6,
          roughness: 0.3,
          transparent: true,
          opacity: 0.7,
        })
        const opPin = new THREE.Mesh(opPinGeom, opPinMat)
        opPin.position.copy(opPos)
        opPin.userData = {
          company,
          isOperation: true,
          region: op.region,
        }
        globeGroup.add(opPin)
      })
    })

    // Background stars
    const starCount = 300
    const starGeom = new THREE.BufferGeometry()
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40
      starPositions[i + 1] = (Math.random() - 0.5) * 40
      starPositions[i + 2] = (Math.random() - 0.5) * 40
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, sizeAttenuation: true })
    const stars = new THREE.Points(starGeom, starMat)
    scene.add(stars)

    // Animation Loop
    let animationId: number
    const animate = () => {
      animationId = requestAnimationFrame(animate)

      // Auto-rotate globe
      if (!isDragging) {
        targetRotationRef.current.y += 0.0003
      }

      // Smooth damping
      rotationRef.current.x += (targetRotationRef.current.x - rotationRef.current.x) * 0.1
      rotationRef.current.y += (targetRotationRef.current.y - rotationRef.current.y) * 0.1

      if (globeGroup) {
        globeGroup.rotation.x = rotationRef.current.x
        globeGroup.rotation.y = rotationRef.current.y
      }

      // Animate pulsing rings
      pinsRef.current.forEach((pin) => {
        if (pin.userData.pulseRing) {
          const time = Date.now() * 0.003
          const pulse = 0.8 + Math.sin(time) * 0.3
          pin.userData.pulseRing.scale.set(pulse, pulse, 1)
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
        // Hover detection
        raycasterRef.current.setFromCamera(mouseRef.current, camera)
        const pins = Array.from(pinsRef.current.values())
        const intersects = raycasterRef.current.intersectObjects(pins, true)

        if (intersects.length > 0) {
          const pin = intersects[0].object.parent as THREE.Object3D
          setHoveredPin(pin.userData?.ticker || null)
        } else {
          setHoveredPin(null)
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

    // Handle resize
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
  }, [isDragging])

  const visibleCompanies = COMPANY_LOCATIONS.filter((c) => activeFilters.has(c.sector))
  const totalOperations = COMPANY_LOCATIONS.reduce((acc, c) => acc + c.operations.length, 0)
  const uniqueCountries = new Set(
    COMPANY_LOCATIONS.flatMap((c) => [c.hq.city.split(',')[1]?.trim(), ...c.operations.map((o) => o.region)])
  ).size

  return (
    <>
      {/* Section Header */}
      <div className="mb-4 fade-up d6">
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Forge — Global Operations Map
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass mb-4 p-4 fade-up d6">
        <div className="flex flex-col gap-3">
          <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest">
            Defence-Tech Intelligence Network
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(SECTOR_COLORS).map((sector) => {
              const isActive = activeFilters.has(sector)
              const sectorCompanies = COMPANY_LOCATIONS.filter((c) => c.sector === sector)
              return (
                <button
                  key={sector}
                  onClick={() => {
                    const newFilters = new Set(activeFilters)
                    if (isActive) {
                      newFilters.delete(sector)
                    } else {
                      newFilters.add(sector)
                    }
                    setActiveFilters(newFilters)
                  }}
                  className={`font-mono text-[9px] px-3 py-1.5 rounded whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[rgba(0,255,80,0.15)] border border-[var(--accent)] text-[var(--accent)]'
                      : 'bg-[rgba(0,0,0,0.3)] border border-[var(--border)] text-[var(--text-dim)]'
                  }`}
                >
                  {sector.split(' ')[0]} ({sectorCompanies.length})
                </button>
              )
            })}
          </div>
          <div className="font-mono text-[9px] text-[var(--text-dim)] uppercase tracking-widest">
            {visibleCompanies.length} Companies · {totalOperations} Global Operations · {uniqueCountries} Countries
          </div>
        </div>
      </div>

      {/* 3D Globe Container */}
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-lg border border-[var(--border)] mb-7 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ height: '70vh', perspective: '1200px' }}
      />

      {/* Hover Tooltip */}
      {hoveredPin && (
        <div className="fixed bottom-4 left-4 glass p-3 rounded border border-[var(--border)] z-20 font-mono text-[10px]">
          <div className="text-[var(--accent)]">{hoveredPin}</div>
          <div className="text-[var(--text-dim)]">Click for details</div>
        </div>
      )}

      {/* Side Panel */}
      {selectedCompany && (
        <div className="fixed right-0 top-0 h-screen w-80 glass border-l border-[var(--border)] p-6 overflow-y-auto z-30 shadow-[0_0_50px_rgba(0,255,80,0.1)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="font-mono text-lg font-black text-white mb-1">{selectedCompany.ticker}</div>
              <div className="font-mono text-xs text-[var(--text-dim)] mb-2">{selectedCompany.name}</div>
              <div
                className="inline-block font-mono text-[8px] px-2 py-1 rounded border"
                style={{
                  borderColor: SECTOR_COLORS[selectedCompany.sector],
                  color: SECTOR_COLORS[selectedCompany.sector],
                }}
              >
                {selectedCompany.sector}
              </div>
            </div>
            <button
              onClick={() => setSelectedCompany(null)}
              className="text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3">
              Headquarters
            </div>
            <div className="font-mono text-[10px] text-white mb-1">{selectedCompany.hq.city}</div>
            <div className="font-mono text-[9px] text-[var(--text-dim)] mb-4">{selectedCompany.hq.lat.toFixed(2)}°N, {Math.abs(selectedCompany.hq.lng).toFixed(2)}°W</div>
          </div>

          <div className="border-t border-[var(--border)] pt-4">
            <div className="font-mono text-[9px] text-[var(--accent)] uppercase tracking-widest mb-3">
              Operations ({selectedCompany.operations.length})
            </div>
            <div className="space-y-3">
              {selectedCompany.operations.map((op, i) => (
                <div key={i} className="text-[9px]">
                  <div className="text-white font-bold">{op.region}</div>
                  <div className="text-[var(--text-dim)]">{op.lat.toFixed(2)}°, {op.lng.toFixed(2)}°</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-[var(--border)] mt-4 pt-4 font-mono text-[9px]">
            <div className="text-[var(--accent)]">✓ Connections Active: {selectedCompany.operations.length}</div>
          </div>
        </div>
      )}
    </>
  )
}
