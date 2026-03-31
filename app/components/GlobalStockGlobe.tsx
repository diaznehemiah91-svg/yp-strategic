'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import {
  X, Search, TrendingUp, TrendingDown, Globe2, ChevronRight,
  Zap, Activity, BarChart2, ExternalLink, Filter, RefreshCw
} from 'lucide-react'
import {
  GLOBE_COMPANIES_FILTERED,
  SECTOR_CONFIG,
  getSectorHex,
  type GlobeCompany,
  type SectorKey,
} from '@/app/lib/sp500-companies'

// ─── Types ───────────────────────────────────────────────────────────────────
interface PriceData {
  ticker: string
  price: number
  change: number
  changePct: number
  high: number
  low: number
  open: number
  prevClose: number
}

interface TooltipState {
  x: number
  y: number
  company: GlobeCompany
  price?: PriceData
}

// ─── Constants ───────────────────────────────────────────────────────────────
const GLOBE_RADIUS = 2.5
const PIN_MIN_SIZE = 0.025
const PIN_MAX_SIZE = 0.14
const CAMERA_DEFAULT_Z = 6.5
const CAMERA_MIN_Z = 3.5
const CAMERA_MAX_Z = 10

// ─── Helpers ─────────────────────────────────────────────────────────────────
function latLngToVec3(lat: number, lng: number, radius = GLOBE_RADIUS): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

function pinSize(marketCap: number): number {
  // Log-scale sizing between min and max
  const logMin = Math.log(0.3)
  const logMax = Math.log(3200)
  const logCap = Math.log(Math.max(marketCap, 0.3))
  const t = (logCap - logMin) / (logMax - logMin)
  return PIN_MIN_SIZE + t * (PIN_MAX_SIZE - PIN_MIN_SIZE)
}

function formatPrice(p: number): string {
  if (p >= 1000) return `$${(p / 1000).toFixed(2)}K`
  return `$${p.toFixed(2)}`
}

function formatMarketCap(mc: number): string {
  if (mc >= 1000) return `$${(mc / 1000).toFixed(1)}T`
  return `$${mc.toFixed(0)}B`
}

// ─── Build latitude/longitude grid lines ─────────────────────────────────────
function buildGraticule(): THREE.LineSegments {
  const points: number[] = []
  const r = GLOBE_RADIUS + 0.01

  // Latitude circles every 30°
  for (const lat of [-60, -30, 0, 30, 60]) {
    const segs = 128
    for (let i = 0; i <= segs; i++) {
      const lng = (i / segs) * 360 - 180
      const v = latLngToVec3(lat, lng, r)
      points.push(v.x, v.y, v.z)
    }
  }

  // Longitude lines every 30°
  for (let lng = -180; lng < 180; lng += 30) {
    const segs = 64
    for (let i = 0; i <= segs; i++) {
      const lat = (i / segs) * 180 - 90
      const v = latLngToVec3(lat, lng, r)
      points.push(v.x, v.y, v.z)
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
  const mat = new THREE.LineBasicMaterial({
    color: 0x0ea5e9,
    transparent: true,
    opacity: 0.07,
  })
  return new THREE.LineSegments(geo, mat)
}

// ─── Build simplified continent dot cloud ────────────────────────────────────
// Approximate land coordinate pairs (lat, lng) for major continents
const LAND_DOTS: [number, number][] = [
  // North America
  [49,  -125], [49,  -120], [49, -114], [49, -110], [49, -100], [49, -95], [49, -88], [49, -82],
  [45,  -124], [45,  -118], [45, -112], [45, -106], [45, -100], [45, -94], [45, -88], [45, -82], [45, -76], [45, -70],
  [40,  -124], [40,  -120], [40, -114], [40, -108], [40, -102], [40, -96],  [40, -90], [40, -84], [40, -78], [40, -72],
  [35,  -120], [35,  -115], [35, -109], [35, -103], [35, -97],  [35, -91],  [35, -85], [35, -79], [35, -76], [35, -78],
  [30,  -118], [30,  -112], [30, -106], [30, -98],  [30, -92],  [30, -86],  [30, -82], [30, -81],
  [25,  -110], [25,  -105], [25, -100], [25, -97],  [25, -91],  [25, -82],  [25, -80],
  [20,  -105], [20,  -100], [20, -95],  [20, -90],  [20, -87],  [20, -83],  [20, -78],
  [15,  -92],  [15, -88],   [15, -84],  [15, -80],
  [60,  -145], [60,  -135], [60, -125], [60, -115], [60, -105], [60, -95], [60, -80], [60, -70],
  [65,  -165], [65,  -155], [65, -140], [65, -130], [65, -120], [65, -110], [65, -100], [65, -85], [65, -75],
  [70,  -165], [70,  -155], [70, -145], [70, -135], [70, -125], [70, -115],
  // Greenland
  [72, -55], [72, -45], [72, -35], [75, -60], [75, -45], [78, -65], [78, -50],
  // South America
  [10, -75], [10, -68], [5, -78], [5, -72], [5, -62], [0, -78], [0, -72], [0, -65], [0, -52],
  [-5, -80], [-5, -75], [-5, -70], [-5, -62], [-5, -52], [-5, -42],
  [-10, -78], [-10, -72], [-10, -66], [-10, -58], [-10, -48], [-10, -38],
  [-15, -75], [-15, -68], [-15, -60], [-15, -52], [-15, -42],
  [-20, -70], [-20, -62], [-20, -54], [-20, -44],
  [-25, -70], [-25, -65], [-25, -57], [-25, -48],
  [-30, -70], [-30, -65], [-30, -58], [-30, -52],
  [-35, -72], [-35, -66], [-35, -60], [-35, -56],
  [-40, -72], [-40, -65], [-40, -62],
  [-45, -73], [-45, -68],
  [-50, -75], [-50, -70], [-50, -68],
  [-55, -72], [-55, -68],
  // Europe
  [36, -8], [36, 0], [36, 8], [36, 14], [38, -8], [38, 0], [38, 8], [38, 14], [38, 20],
  [40, -8], [40, 0], [40, 8], [40, 14], [40, 20], [40, 26], [42, -8], [42, 0], [42, 8], [42, 14], [42, 20], [42, 26],
  [44, -8], [44, 0], [44, 8], [44, 14], [44, 20], [44, 26], [46, 6], [46, 12], [46, 18], [46, 24],
  [48, -4], [48, 2], [48, 8], [48, 14], [48, 20], [48, 26],
  [50, -4], [50, 2], [50, 8], [50, 14], [50, 20], [50, 26], [52, -4], [52, 2], [52, 8], [52, 14], [52, 20], [52, 26],
  [54, -2], [54, 8], [54, 14], [54, 20], [54, 26], [56, 8], [56, 14], [56, 20], [56, 26],
  [58, 6], [58, 14], [58, 20], [58, 26], [60, 6], [60, 14], [60, 20], [60, 26], [62, 8], [62, 16], [62, 22], [62, 28],
  [64, 14], [64, 20], [64, 26], [64, 32], [66, 14], [66, 22], [66, 28], [66, 34],
  // Africa
  [36, 8], [36, 14], [35, 10], [35, 25],
  [30, -6], [30, 0], [30, 10], [30, 20], [30, 30],
  [25, -14], [25, 0], [25, 10], [25, 20], [25, 30], [25, 38],
  [20, -18], [20, -10], [20, 0], [20, 10], [20, 20], [20, 30], [20, 38],
  [15, -18], [15, -10], [15, 0], [15, 10], [15, 20], [15, 30], [15, 38], [15, 44],
  [10, -15], [10, -8], [10, 0], [10, 10], [10, 18], [10, 28], [10, 38], [10, 44],
  [5, -8], [5, 0], [5, 8], [5, 16], [5, 26], [5, 34], [5, 42],
  [0, 8], [0, 14], [0, 22], [0, 30], [0, 38],
  [-5, 10], [-5, 18], [-5, 26], [-5, 34], [-5, 42],
  [-10, 14], [-10, 22], [-10, 30], [-10, 36],
  [-15, 14], [-15, 22], [-15, 30], [-15, 36],
  [-20, 18], [-20, 26], [-20, 34],
  [-25, 18], [-25, 26], [-25, 32],
  [-30, 18], [-30, 26], [-30, 30],
  [-34, 18], [-34, 24], [-34, 28],
  // Asia (West)
  [36, 30], [36, 36], [36, 42], [36, 48], [38, 32], [38, 38], [38, 44], [38, 50], [38, 56],
  [40, 32], [40, 38], [40, 44], [40, 50], [40, 56], [40, 62], [40, 68],
  [42, 44], [42, 50], [42, 56], [42, 62], [42, 68], [44, 46], [44, 52], [44, 58], [44, 64], [44, 70],
  [30, 30], [30, 36], [30, 42], [30, 48], [30, 54], [30, 60], [30, 66], [30, 72],
  [25, 32], [25, 38], [25, 44], [25, 50], [25, 56], [25, 62], [25, 68],
  [20, 34], [20, 40], [20, 46], [20, 52], [20, 58], [20, 66], [20, 72], [20, 78],
  // Asia (East)
  [50, 80], [50, 90], [50, 100], [50, 110], [50, 120], [50, 128],
  [45, 80], [45, 90], [45, 100], [45, 110], [45, 120], [45, 130], [45, 136],
  [40, 76], [40, 86], [40, 96], [40, 106], [40, 116], [40, 122],
  [35, 72], [35, 80], [35, 90], [35, 100], [35, 110], [35, 120], [35, 128],
  [30, 70], [30, 78], [30, 88], [30, 98], [30, 108], [30, 118], [30, 124],
  [25, 68], [25, 78], [25, 88], [25, 98], [25, 108], [25, 118],
  [20, 72], [20, 80], [20, 88], [20, 94], [20, 100], [20, 105],
  [15, 74], [15, 80], [15, 88], [15, 96], [15, 102],
  [10, 76], [10, 80], [10, 100], [10, 104],
  [5, 100], [5, 104], [5, 108],
  [0, 100], [0, 106], [0, 112], [0, 118],
  [-5, 104], [-5, 110], [-5, 116], [-5, 122],
  // Japan/Korea
  [36, 128], [36, 132], [36, 136], [38, 124], [38, 128], [38, 132], [38, 136],
  [34, 130], [34, 134], [34, 138], [32, 130], [32, 134], [32, 138],
  // Russia/North Asia
  [55, 38], [55, 50], [55, 62], [55, 74], [55, 86], [55, 100], [55, 115], [55, 130], [55, 140], [55, 152],
  [60, 40], [60, 56], [60, 70], [60, 84], [60, 100], [60, 118], [60, 136], [60, 152], [60, 162],
  [65, 44], [65, 60], [65, 78], [65, 96], [65, 115], [65, 134], [65, 152], [65, 168],
  // Australia
  [-15, 130], [-15, 136], [-20, 118], [-20, 124], [-20, 130], [-20, 136], [-20, 142], [-20, 148],
  [-25, 114], [-25, 120], [-25, 128], [-25, 135], [-25, 142], [-25, 148],
  [-30, 116], [-30, 122], [-30, 130], [-30, 138], [-30, 146], [-30, 152],
  [-35, 116], [-35, 122], [-35, 130], [-35, 138], [-35, 146], [-35, 150],
  [-38, 140], [-38, 146], [-40, 142], [-40, 148],
]

function buildContinentDots(): THREE.Points {
  const r = GLOBE_RADIUS + 0.015
  const positions: number[] = []
  LAND_DOTS.forEach(([lat, lng]) => {
    const v = latLngToVec3(lat, lng, r)
    positions.push(v.x, v.y, v.z)
  })
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({
    color: 0x1e40af,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.5,
  })
  return new THREE.Points(geo, mat)
}

// ─── Stars background ─────────────────────────────────────────────────────────
function buildStars(): THREE.Points {
  const count = 1800
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 80
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, sizeAttenuation: true, transparent: true, opacity: 0.7 })
  return new THREE.Points(geo, mat)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GlobalStockGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // Three.js refs (don't trigger re-renders)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const globeGroupRef = useRef<THREE.Group | null>(null)
  const pinMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map())
  const pinMaterialsRef = useRef<Map<string, THREE.MeshStandardMaterial>>(new Map())
  const raycasterRef = useRef(new THREE.Raycaster())
  const mouseRef = useRef(new THREE.Vector2())
  const animFrameRef = useRef(0)

  // Interaction state refs (avoid stale closures in animation loop)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0 })
  const rotXRef = useRef(0.15)
  const rotYRef = useRef(-0.5)
  const targetRotXRef = useRef(0.15)
  const targetRotYRef = useRef(-0.5)
  const autoRotateRef = useRef(true)
  const zoomRef = useRef(CAMERA_DEFAULT_Z)
  const targetZoomRef = useRef(CAMERA_DEFAULT_Z)
  const pricesRef = useRef<Record<string, PriceData>>({})
  const hoveredTickerRef = useRef<string | null>(null)
  const activeSectorsRef = useRef<Set<SectorKey>>(new Set(Object.keys(SECTOR_CONFIG) as SectorKey[]))
  const searchFilterRef = useRef<string>('')

  // React UI state
  const [prices, setPrices] = useState<Record<string, PriceData>>({})
  const [pricesLoaded, setPricesLoaded] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<GlobeCompany | null>(null)
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const [activeSectors, setActiveSectors] = useState<Set<SectorKey>>(
    new Set(Object.keys(SECTOR_CONFIG) as SectorKey[])
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [statsExpanded, setStatsExpanded] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [gainersCount, setGainersCount] = useState(0)
  const [losersCount, setLosersCount] = useState(0)

  // ─── Fetch prices ───────────────────────────────────────────────────────────
  const fetchPrices = useCallback(async () => {
    try {
      const res = await fetch('/api/globe-prices')
      const data = await res.json()
      const p: Record<string, PriceData> = data.prices ?? {}
      pricesRef.current = p
      setPrices(p)
      setPricesLoaded(true)
      setLastUpdate(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }))
      const gainers = Object.values(p).filter(x => x.changePct > 0).length
      const losers  = Object.values(p).filter(x => x.changePct < 0).length
      setGainersCount(gainers)
      setLosersCount(losers)
    } catch {
      // Fail silently — the globe still renders with mock structural data
    }
  }, [])

  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000) // refresh every 30s
    return () => clearInterval(interval)
  }, [fetchPrices])

  // ─── Update pin materials when prices change ────────────────────────────────
  useEffect(() => {
    pinMaterialsRef.current.forEach((mat, ticker) => {
      const p = prices[ticker]
      if (!p) return
      if (p.changePct > 0) {
        const intensity = Math.min(p.changePct / 5, 1) * 0.8 + 0.2
        mat.emissive.set(0x22c55e)
        mat.emissiveIntensity = intensity
        mat.color.set(0x22c55e)
      } else if (p.changePct < 0) {
        const intensity = Math.min(Math.abs(p.changePct) / 5, 1) * 0.8 + 0.2
        mat.emissive.set(0xef4444)
        mat.emissiveIntensity = intensity
        mat.color.set(0xef4444)
      } else {
        // Sector base color when flat
        const company = GLOBE_COMPANIES_FILTERED.find(c => c.ticker === ticker)
        if (company) {
          const hex = getSectorHex(company.sector)
          mat.emissive.set(hex)
          mat.emissiveIntensity = 0.4
          mat.color.set(hex)
        }
      }
    })
  }, [prices])

  // ─── Update pin visibility on sector/search filter change ──────────────────
  useEffect(() => {
    activeSectorsRef.current = activeSectors
    searchFilterRef.current = searchQuery.toLowerCase()
    pinMeshesRef.current.forEach((mesh, ticker) => {
      const company = GLOBE_COMPANIES_FILTERED.find(c => c.ticker === ticker)
      if (!company) return
      const sectorVisible = activeSectors.has(company.sector)
      const searchVisible = searchQuery === '' ||
        company.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      mesh.visible = sectorVisible && searchVisible
    })
  }, [activeSectors, searchQuery])

  // ─── Three.js scene setup ───────────────────────────────────────────────────
  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000814)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(55, container.clientWidth / container.clientHeight, 0.1, 200)
    camera.position.z = CAMERA_DEFAULT_Z
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = false
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.25))
    const sunLight = new THREE.DirectionalLight(0x88aaff, 1.2)
    sunLight.position.set(8, 5, 6)
    scene.add(sunLight)
    const fillLight = new THREE.DirectionalLight(0x002244, 0.4)
    fillLight.position.set(-5, -3, -5)
    scene.add(fillLight)

    // Globe group
    const globeGroup = new THREE.Group()
    globeGroup.rotation.x = rotXRef.current
    globeGroup.rotation.y = rotYRef.current
    globeGroupRef.current = globeGroup
    scene.add(globeGroup)

    // ── Globe sphere ──
    const globeGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 128, 128)
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x020e22,
      emissive: 0x000814,
      specular: 0x0044aa,
      shininess: 20,
    })
    globeGroup.add(new THREE.Mesh(globeGeo, globeMat))

    // ── Continent dots ──
    globeGroup.add(buildContinentDots())

    // ── Graticule (lat/lng lines) ──
    globeGroup.add(buildGraticule())

    // ── Atmospheric glow (outer sphere) ──
    const atmosGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.055, 64, 64)
    const atmosMat = new THREE.MeshBasicMaterial({
      color: 0x0066ff,
      transparent: true,
      opacity: 0.045,
      side: THREE.BackSide,
    })
    globeGroup.add(new THREE.Mesh(atmosGeo, atmosMat))

    // ── Inner rim glow ──
    const rimGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.01, 64, 64)
    const rimMat = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      transparent: true,
      opacity: 0.025,
      side: THREE.FrontSide,
    })
    globeGroup.add(new THREE.Mesh(rimGeo, rimMat))

    // ── Company pins ──
    GLOBE_COMPANIES_FILTERED.forEach((company, idx) => {
      const pos = latLngToVec3(company.hq.lat, company.hq.lng)
      const size = pinSize(company.marketCap)

      const pinGroup = new THREE.Group()
      pinGroup.position.copy(pos)
      // Orient pin perpendicular to globe surface
      pinGroup.lookAt(0, 0, 0)
      pinGroup.rotateX(Math.PI / 2)
      pinGroup.userData = { ticker: company.ticker, company }

      const sectorHex = getSectorHex(company.sector)

      // Main pin sphere
      const pinGeo = new THREE.SphereGeometry(size, 16, 16)
      const pinMat = new THREE.MeshStandardMaterial({
        color: sectorHex,
        emissive: sectorHex,
        emissiveIntensity: 0.45,
        metalness: 0.3,
        roughness: 0.4,
      })
      const pinMesh = new THREE.Mesh(pinGeo, pinMat)
      pinMesh.userData = { ticker: company.ticker, company }
      pinGroup.add(pinMesh)

      // Pulse ring
      const ringGeo = new THREE.RingGeometry(size * 1.6, size * 2.2, 24)
      const ringMat = new THREE.MeshBasicMaterial({
        color: sectorHex,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.userData = { isPulseRing: true, baseOpacity: 0.35, ticker: company.ticker }
      pinGroup.add(ring)

      pinGroup.scale.setScalar(0)
      globeGroup.add(pinGroup)

      pinMeshesRef.current.set(company.ticker, pinMesh)
      pinMaterialsRef.current.set(company.ticker, pinMat)

      // Staggered entrance animation
      setTimeout(() => {
        const start = Date.now()
        const enter = () => {
          const t = Math.min((Date.now() - start) / 600, 1)
          const ease = 1 - Math.pow(1 - t, 3)
          pinGroup.scale.setScalar(ease)
          if (t < 1) requestAnimationFrame(enter)
        }
        enter()
      }, idx * 8)
    })

    // ── Stars ──
    scene.add(buildStars())

    // ─── Animation loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock()
    const tmpVec3 = new THREE.Vector3(1, 1, 1)

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate)
      const elapsed = clock.getElapsedTime()

      // Auto-rotate when not dragging
      if (autoRotateRef.current && !isDraggingRef.current) {
        targetRotYRef.current += 0.00025
      }

      // Smooth rotation lerp
      rotXRef.current += (targetRotXRef.current - rotXRef.current) * 0.08
      rotYRef.current += (targetRotYRef.current - rotYRef.current) * 0.08

      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = rotXRef.current
        globeGroupRef.current.rotation.y = rotYRef.current
      }

      // Smooth zoom lerp
      zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.1
      if (cameraRef.current) cameraRef.current.position.z = zoomRef.current

      // Animate pulse rings
      pinMeshesRef.current.forEach((mesh, ticker) => {
        const pinGroup = mesh.parent
        if (!pinGroup) return
        const ring = pinGroup.children[1] as THREE.Mesh
        if (!ring?.userData?.isPulseRing) return
        const ringMat = ring.material as THREE.MeshBasicMaterial
        const t = (elapsed * 1.8) % (Math.PI * 2)
        const pulse = 0.15 + Math.sin(t) * 0.2
        ringMat.opacity = pulse

        const scale = 1 + Math.sin(t * 0.8) * 0.15
        ring.scale.set(scale, scale, 1)

        // Hover scale
        if (hoveredTickerRef.current === ticker) {
          pinGroup.scale.lerp(tmpVec3.set(1.4, 1.4, 1.4), 0.12)
        } else {
          pinGroup.scale.lerp(tmpVec3.set(1, 1, 1), 0.1)
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    // ─── Mouse/touch interaction ───────────────────────────────────────────────
    const getCanvasXY = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect()
      if ('touches' in e) {
        return {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        }
      }
      return {
        x: (e as MouseEvent).clientX - rect.left,
        y: (e as MouseEvent).clientY - rect.top,
        clientX: (e as MouseEvent).clientX,
        clientY: (e as MouseEvent).clientY,
      }
    }

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getCanvasXY(e)
      isDraggingRef.current = true
      autoRotateRef.current = false
      dragStartRef.current = { x, y }
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const { x, y, clientX, clientY } = getCanvasXY(e)
      const rect = container.getBoundingClientRect()

      if (isDraggingRef.current) {
        const dx = x - dragStartRef.current.x
        const dy = y - dragStartRef.current.y
        targetRotYRef.current += dx * 0.008
        targetRotXRef.current += dy * 0.008
        targetRotXRef.current = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotXRef.current))
        dragStartRef.current = { x, y }
        setTooltip(null)
        hoveredTickerRef.current = null
        return
      }

      // Raycasting for hover
      const nx = ((x) / rect.width) * 2 - 1
      const ny = -((y) / rect.height) * 2 + 1
      mouseRef.current.set(nx, ny)

      if (!cameraRef.current || !sceneRef.current) return
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)

      const pins = Array.from(pinMeshesRef.current.values()).filter(m => m.visible)
      const hits = raycasterRef.current.intersectObjects(pins, false)

      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh
        const ticker = hit.userData?.ticker as string
        if (ticker && ticker !== hoveredTickerRef.current) {
          hoveredTickerRef.current = ticker
          const company = GLOBE_COMPANIES_FILTERED.find(c => c.ticker === ticker)
          if (company) {
            setTooltip({
              x: clientX,
              y: clientY,
              company,
              price: pricesRef.current[ticker],
            })
          }
          container.style.cursor = 'pointer'
        } else if (ticker) {
          // Update tooltip position
          setTooltip(prev => prev ? { ...prev, x: clientX, y: clientY } : prev)
        }
      } else {
        hoveredTickerRef.current = null
        setTooltip(null)
        container.style.cursor = 'grab'
      }
    }

    const onPointerUp = () => {
      isDraggingRef.current = false
      setTimeout(() => { autoRotateRef.current = true }, 3000)
    }

    const onClick = (e: MouseEvent) => {
      if (Math.abs(e.movementX) > 3 || Math.abs(e.movementY) > 3) return
      const rect = container.getBoundingClientRect()
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1
      mouseRef.current.set(nx, ny)
      if (!cameraRef.current) return
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current)
      const pins = Array.from(pinMeshesRef.current.values()).filter(m => m.visible)
      const hits = raycasterRef.current.intersectObjects(pins, false)
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh
        const company = hit.userData?.company as GlobeCompany
        if (company) {
          setSelectedCompany(company)
          autoRotateRef.current = false
        }
      }
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      targetZoomRef.current = Math.max(
        CAMERA_MIN_Z,
        Math.min(CAMERA_MAX_Z, targetZoomRef.current + e.deltaY * 0.005)
      )
    }

    const onResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      cameraRef.current.aspect = w / h
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(w, h)
    }

    container.addEventListener('mousedown', onPointerDown)
    container.addEventListener('touchstart', onPointerDown, { passive: true })
    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('touchmove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchend', onPointerUp)
    container.addEventListener('click', onClick)
    container.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      container.removeEventListener('mousedown', onPointerDown)
      container.removeEventListener('touchstart', onPointerDown)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchend', onPointerUp)
      container.removeEventListener('click', onClick)
      container.removeEventListener('wheel', onWheel)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      pinMeshesRef.current.clear()
      pinMaterialsRef.current.clear()
    }
  }, []) // Only runs once

  // ─── Derived data ────────────────────────────────────────────────────────────
  const visibleCompanies = GLOBE_COMPANIES_FILTERED.filter(c =>
    activeSectors.has(c.sector) &&
    (searchQuery === '' ||
      c.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const selectedPrice = selectedCompany ? prices[selectedCompany.ticker] : null

  // Top movers
  const topMovers = Object.values(prices)
    .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
    .slice(0, 5)

  const toggleSector = useCallback((sector: SectorKey) => {
    setActiveSectors(prev => {
      const next = new Set(prev)
      if (next.has(sector)) {
        if (next.size > 1) next.delete(sector)
      } else {
        next.add(sector)
      }
      return next
    })
  }, [])

  const selectAllSectors = useCallback(() => {
    setActiveSectors(new Set(Object.keys(SECTOR_CONFIG) as SectorKey[]))
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '80vh', minHeight: 600, background: '#000814' }}>

      {/* ── Three.js Canvas ── */}
      <div
        ref={canvasRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />

      {/* ── Top Bar ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-start justify-between p-4 pointer-events-none">
        {/* Left: Title + Stats */}
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 mb-2">
            <Globe2 size={14} className="text-[#0ea5e9]" />
            <span className="font-mono text-[10px] tracking-[3px] uppercase text-[#0ea5e9]">
              Global Stock Intelligence
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
          </div>
          {pricesLoaded && (
            <div className="flex gap-3 font-mono text-[9px]">
              <span className="text-[#22c55e]">{gainersCount} ▲ Gainers</span>
              <span className="text-[#ef4444]">{losersCount} ▼ Losers</span>
              <span className="text-[#64748b]">{visibleCompanies.length} shown</span>
            </div>
          )}
          {lastUpdate && (
            <div className="font-mono text-[8px] text-[#334155] mt-0.5">
              Updated {lastUpdate}
            </div>
          )}
        </div>

        {/* Right: Controls */}
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={fetchPrices}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase text-[#0ea5e9] border border-[#0ea5e9]/30 bg-[#000814]/80 backdrop-blur px-3 py-1.5 rounded hover:border-[#0ea5e9]/60 transition-colors"
          >
            <RefreshCw size={10} />
            Refresh
          </button>
          <button
            onClick={() => setShowFilters(f => !f)}
            className={`flex items-center gap-1.5 font-mono text-[9px] tracking-widest uppercase border backdrop-blur px-3 py-1.5 rounded transition-colors ${
              showFilters
                ? 'text-[#0ea5e9] border-[#0ea5e9]/60 bg-[#0ea5e9]/10'
                : 'text-[#64748b] border-[#1e293b] bg-[#000814]/80 hover:border-[#0ea5e9]/40'
            }`}
          >
            <Filter size={10} />
            Filters
          </button>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="absolute top-16 left-4 z-20 w-64">
        <div className="relative">
          <Search size={11} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569]" />
          <input
            type="text"
            placeholder="Search ticker or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full font-mono text-[11px] bg-[#000814]/90 border border-[#1e293b] text-[#94a3b8] placeholder-[#334155] rounded px-3 py-1.5 pl-8 focus:outline-none focus:border-[#0ea5e9]/50 backdrop-blur"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94a3b8]">
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* ── Sector Filters Panel ── */}
      {showFilters && (
        <div className="absolute top-16 right-4 z-20 w-56 bg-[#000814]/95 border border-[#1e293b] rounded backdrop-blur p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] text-[#0ea5e9] uppercase tracking-widest">Sectors</span>
            <button onClick={selectAllSectors} className="font-mono text-[8px] text-[#475569] hover:text-[#0ea5e9] transition-colors">
              All
            </button>
          </div>
          <div className="space-y-1">
            {(Object.entries(SECTOR_CONFIG) as [SectorKey, typeof SECTOR_CONFIG[SectorKey]][]).map(([key, cfg]) => {
              const count = GLOBE_COMPANIES_FILTERED.filter(c => c.sector === key).length
              const active = activeSectors.has(key)
              return (
                <button
                  key={key}
                  onClick={() => toggleSector(key)}
                  className={`w-full flex items-center justify-between px-2 py-1 rounded text-left transition-all ${
                    active ? 'bg-[#0f172a] opacity-100' : 'opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
                    <span className="font-mono text-[9px] text-[#94a3b8]">{cfg.label}</span>
                  </div>
                  <span className="font-mono text-[8px] text-[#475569]">{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Bottom: Legend + Scroll hint ── */}
      <div className="absolute bottom-4 left-4 z-20 space-y-2">
        {/* Sector color legend */}
        <div className="flex flex-wrap gap-2">
          {(Object.entries(SECTOR_CONFIG) as [SectorKey, typeof SECTOR_CONFIG[SectorKey]][]).slice(0, 6).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.color }} />
              <span className="font-mono text-[8px] text-[#475569]">{cfg.label}</span>
            </div>
          ))}
        </div>
        <div className="font-mono text-[8px] text-[#1e293b] tracking-widest uppercase">
          Drag to rotate · Scroll to zoom · Click pin for details
        </div>
      </div>

      {/* ── Bottom-right: Top Movers ── */}
      {pricesLoaded && topMovers.length > 0 && (
        <div className="absolute bottom-4 right-4 z-20 w-52">
          <button
            onClick={() => setStatsExpanded(e => !e)}
            className="w-full flex items-center justify-between font-mono text-[9px] text-[#0ea5e9] uppercase tracking-widest mb-1.5"
          >
            <span className="flex items-center gap-1.5">
              <Activity size={10} />
              Top Movers
            </span>
            {statsExpanded ? <ChevronRight size={10} className="rotate-90" /> : <ChevronRight size={10} />}
          </button>
          {statsExpanded && (
            <div className="bg-[#000814]/90 border border-[#1e293b] rounded backdrop-blur p-2 space-y-1">
              {topMovers.map(p => (
                <div key={p.ticker} className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-[#94a3b8] w-14 truncate">{p.ticker}</span>
                  <span className="text-[#64748b]">{formatPrice(p.price)}</span>
                  <span className={p.changePct >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                    {p.changePct >= 0 ? '+' : ''}{p.changePct.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Zoom Controls ── */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1">
        <button
          onClick={() => { targetZoomRef.current = Math.max(CAMERA_MIN_Z, targetZoomRef.current - 0.8) }}
          className="w-7 h-7 flex items-center justify-center font-mono text-[14px] text-[#475569] border border-[#1e293b] bg-[#000814]/80 rounded hover:border-[#0ea5e9]/50 hover:text-[#0ea5e9] transition-colors"
        >+</button>
        <button
          onClick={() => { targetZoomRef.current = Math.min(CAMERA_MAX_Z, targetZoomRef.current + 0.8) }}
          className="w-7 h-7 flex items-center justify-center font-mono text-[14px] text-[#475569] border border-[#1e293b] bg-[#000814]/80 rounded hover:border-[#0ea5e9]/50 hover:text-[#0ea5e9] transition-colors"
        >−</button>
      </div>

      {/* ── Hover Tooltip ── */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          <div className="bg-[#000814]/95 border border-[#1e293b] rounded p-3 shadow-xl backdrop-blur min-w-[180px]">
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="font-mono text-[13px] font-black text-white">{tooltip.company.ticker}</span>
              <span className="font-mono text-[9px] text-[#475569]">{tooltip.company.exchange}</span>
            </div>
            <div className="font-mono text-[9px] text-[#64748b] mb-2 leading-tight">{tooltip.company.name}</div>
            {tooltip.price ? (
              <div className="space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-white">{formatPrice(tooltip.price.price)}</span>
                  <span
                    className="font-mono text-[10px] font-bold flex items-center gap-0.5"
                    style={{ color: tooltip.price.changePct >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {tooltip.price.changePct >= 0 ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {tooltip.price.changePct >= 0 ? '+' : ''}{tooltip.price.changePct.toFixed(2)}%
                  </span>
                </div>
                <div className="font-mono text-[8px] text-[#334155]">
                  H: {formatPrice(tooltip.price.high)}  L: {formatPrice(tooltip.price.low)}
                </div>
              </div>
            ) : (
              <div className="font-mono text-[9px] text-[#334155]">Loading price...</div>
            )}
            <div className="mt-2 pt-1.5 border-t border-[#1e293b] flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: SECTOR_CONFIG[tooltip.company.sector]?.color }} />
              <span className="font-mono text-[8px] text-[#475569]">{SECTOR_CONFIG[tooltip.company.sector]?.label}</span>
              <span className="font-mono text-[8px] text-[#334155] ml-auto">{tooltip.company.hq.city}</span>
            </div>
            <div className="font-mono text-[7px] text-[#1e293b] mt-1">Click to open detail</div>
          </div>
        </div>
      )}

      {/* ── Company Detail Panel ── */}
      {selectedCompany && (
        <div className="absolute right-0 top-0 h-full w-[340px] bg-[#000814]/98 border-l border-[#1e293b] overflow-y-auto z-30 backdrop-blur">
          {/* Header */}
          <div className="sticky top-0 bg-[#000814] border-b border-[#1e293b] p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-mono text-2xl font-black text-white tracking-tight">{selectedCompany.ticker}</div>
                <div className="font-mono text-[10px] text-[#475569] leading-tight mt-0.5">{selectedCompany.name}</div>
              </div>
              <button
                onClick={() => { setSelectedCompany(null); autoRotateRef.current = true }}
                className="text-[#334155] hover:text-[#0ea5e9] transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>

            {/* Sector badge */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] uppercase tracking-widest mb-3"
              style={{
                color: SECTOR_CONFIG[selectedCompany.sector]?.color,
                borderColor: SECTOR_CONFIG[selectedCompany.sector]?.color + '40',
                background: SECTOR_CONFIG[selectedCompany.sector]?.color + '15',
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: SECTOR_CONFIG[selectedCompany.sector]?.color }} />
              {SECTOR_CONFIG[selectedCompany.sector]?.label}
            </div>

            {/* Price */}
            {selectedPrice ? (
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xl font-bold text-white">{formatPrice(selectedPrice.price)}</span>
                  <span
                    className="font-mono text-sm font-bold flex items-center gap-1"
                    style={{ color: selectedPrice.changePct >= 0 ? '#22c55e' : '#ef4444' }}
                  >
                    {selectedPrice.changePct >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {selectedPrice.changePct >= 0 ? '+' : ''}{selectedPrice.changePct.toFixed(2)}%
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    ['Open', formatPrice(selectedPrice.open)],
                    ['High', formatPrice(selectedPrice.high)],
                    ['Low', formatPrice(selectedPrice.low)],
                  ].map(([label, val]) => (
                    <div key={label} className="bg-[#0a0f1a] border border-[#1e293b] rounded p-2 text-center">
                      <div className="font-mono text-[7px] text-[#334155] uppercase mb-0.5">{label}</div>
                      <div className="font-mono text-[9px] text-[#94a3b8]">{val}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="font-mono text-[9px] text-[#334155] animate-pulse">Fetching live price...</div>
            )}
          </div>

          {/* Body */}
          <div className="p-5 space-y-5">
            {/* Market Cap */}
            <div>
              <div className="font-mono text-[8px] text-[#0ea5e9] uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <BarChart2 size={10} />◆ Market Intelligence
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ['Market Cap', formatMarketCap(selectedCompany.marketCap)],
                  ['Exchange', selectedCompany.exchange],
                ].map(([label, val]) => (
                  <div key={label} className="bg-[#0a0f1a] border border-[#1e293b] rounded p-3">
                    <div className="font-mono text-[7px] text-[#334155] uppercase mb-1">{label}</div>
                    <div className="font-mono text-[11px] text-white font-bold">{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* HQ Location */}
            <div>
              <div className="font-mono text-[8px] text-[#0ea5e9] uppercase tracking-widest mb-2">◆ Headquarters</div>
              <div className="bg-[#0a0f1a] border border-[#1e293b] rounded p-3 font-mono">
                <div className="text-[11px] text-white font-bold">{selectedCompany.hq.city}</div>
                <div className="text-[9px] text-[#475569]">{selectedCompany.hq.country}</div>
                <div className="text-[8px] text-[#334155] mt-1">
                  {selectedCompany.hq.lat.toFixed(4)}° N, {Math.abs(selectedCompany.hq.lng).toFixed(4)}° {selectedCompany.hq.lng >= 0 ? 'E' : 'W'}
                </div>
              </div>
            </div>

            {/* Price change bar */}
            {selectedPrice && (
              <div>
                <div className="font-mono text-[8px] text-[#0ea5e9] uppercase tracking-widest mb-2">◆ Day Range</div>
                <div className="bg-[#0a0f1a] border border-[#1e293b] rounded p-3">
                  <div className="flex justify-between font-mono text-[8px] text-[#475569] mb-1.5">
                    <span>{formatPrice(selectedPrice.low)}</span>
                    <span>{formatPrice(selectedPrice.high)}</span>
                  </div>
                  <div className="relative h-1.5 bg-[#1e293b] rounded overflow-hidden">
                    {selectedPrice.high > selectedPrice.low && (
                      <>
                        <div
                          className="absolute top-0 left-0 h-full rounded"
                          style={{
                            width: `${((selectedPrice.price - selectedPrice.low) / (selectedPrice.high - selectedPrice.low)) * 100}%`,
                            background: selectedPrice.changePct >= 0 ? '#22c55e' : '#ef4444',
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div className="font-mono text-[7px] text-[#334155] mt-1 text-center">
                    Prev Close: {formatPrice(selectedPrice.prevClose)}
                  </div>
                </div>
              </div>
            )}

            {/* Sector peers */}
            <div>
              <div className="font-mono text-[8px] text-[#0ea5e9] uppercase tracking-widest mb-2">◆ Sector Peers</div>
              <div className="space-y-1">
                {GLOBE_COMPANIES_FILTERED
                  .filter(c => c.sector === selectedCompany.sector && c.ticker !== selectedCompany.ticker)
                  .slice(0, 5)
                  .map(peer => {
                    const pp = prices[peer.ticker]
                    return (
                      <button
                        key={peer.ticker}
                        onClick={() => setSelectedCompany(peer)}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-[#0a0f1a] border border-[#1e293b] rounded hover:border-[#0ea5e9]/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold text-[#94a3b8]">{peer.ticker}</span>
                          <span className="font-mono text-[8px] text-[#334155] truncate max-w-[80px]">{peer.name}</span>
                        </div>
                        {pp && (
                          <span
                            className="font-mono text-[9px]"
                            style={{ color: pp.changePct >= 0 ? '#22c55e' : '#ef4444' }}
                          >
                            {pp.changePct >= 0 ? '+' : ''}{pp.changePct.toFixed(2)}%
                          </span>
                        )}
                      </button>
                    )
                  })}
              </div>
            </div>

            {/* Link to deep dive */}
            <a
              href={`/contractor/${selectedCompany.ticker}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded border font-mono text-[10px] uppercase tracking-widest transition-all hover:-translate-y-0.5"
              style={{
                color: SECTOR_CONFIG[selectedCompany.sector]?.color,
                borderColor: SECTOR_CONFIG[selectedCompany.sector]?.color + '50',
                background: SECTOR_CONFIG[selectedCompany.sector]?.color + '08',
              }}
            >
              <ExternalLink size={10} />
              Open Deep-Dive Brief
            </a>

            {/* Data source note */}
            <div className="font-mono text-[7px] text-[#1e293b] text-center">
              Data via Finnhub · {lastUpdate ? `Updated ${lastUpdate}` : 'Loading...'}
            </div>
          </div>
        </div>
      )}

      {/* ── Loading overlay ── */}
      {!pricesLoaded && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#000814]/80 border border-[#1e293b] rounded px-3 py-1.5 backdrop-blur">
          <Zap size={10} className="text-[#0ea5e9] animate-pulse" />
          <span className="font-mono text-[9px] text-[#475569]">Fetching live market data...</span>
        </div>
      )}
    </div>
  )
}
