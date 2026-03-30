'use client'

import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { OrbitControls, Line, Html, Text } from '@react-three/drei'
import * as THREE from 'three'
import { geoInterpolate } from 'd3-geo'
import { useMemo, useRef, useState, useCallback, useEffect } from 'react'
import { Globe, Activity, Zap, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

/* =========================
     TYPES
  ========================= */
type Hub = {
    id: string
    name: string
    lat: number
    lng: number
    country: string
    exchange: string
    tickers: string[]
    marketCap: string
    volume: string
    change: number
    color: string
    importance: number
}

type Link = {
    from: string
    to: string
    strength: number
}

type SectorItem = {
    name: string
    change: number
    color: string
}

/* =========================
     DATA (ALL 12 HUBS FROM OLD)
  ========================= */
const hubs: Hub[] = [
  { id: 'ny', name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA', exchange: 'NYSE', tickers: ['PLTR','NVDA','BA','LMT'], marketCap: '52.3T', volume: '12.8B', change: +1.24, color: '#00ff88', importance: 1 },
  { id: 'ldn', name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', exchange: 'LSE', tickers: ['BAE','RYCEY'], marketCap: '3.2T', volume: '2.1B', change: -0.38, color: '#00ccff', importance: 0.9 },
  { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', exchange: 'TSE', tickers: ['MHI','KHI'], marketCap: '6.1T', volume: '3.4B', change: +0.87, color: '#ff6600', importance: 0.85 },
  { id: 'shanghai', name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', exchange: 'SSE', tickers: ['AVIC'], marketCap: '7.8T', volume: '5.2B', change: -1.12, color: '#ff3366', importance: 0.8 },
  { id: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: 'Germany', exchange: 'FRA', tickers: ['AIR','RHM'], marketCap: '2.4T', volume: '1.3B', change: +0.56, color: '#9966ff', importance: 0.7 },
  { id: 'sydney', name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', exchange: 'ASX', tickers: ['ASB'], marketCap: '1.8T', volume: '0.8B', change: +0.34, color: '#ffcc00', importance: 0.6 },
  { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', exchange: 'SGX', tickers: ['STE'], marketCap: '0.7T', volume: '0.4B', change: -0.21, color: '#00ffcc', importance: 0.6 },
  { id: 'tlv', name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', exchange: 'TASE', tickers: ['ESLT'], marketCap: '0.3T', volume: '0.2B', change: +2.15, color: '#66ff66', importance: 1 },
  { id: 'seoul', name: 'Seoul', lat: 37.5665, lng: 126.978, country: 'S.Korea', exchange: 'KRX', tickers: ['KAI'], marketCap: '2.1T', volume: '1.8B', change: +0.93, color: '#ff9966', importance: 0.7 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', exchange: 'BSE', tickers: ['HAL','BEL'], marketCap: '4.2T', volume: '2.6B', change: +1.67, color: '#ff66cc', importance: 0.75 },
  { id: 'toronto', name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', exchange: 'TSX', tickers: ['CAE'], marketCap: '2.9T', volume: '1.1B', change: +0.45, color: '#66ccff', importance: 0.65 },
  { id: 'riyadh', name: 'Riyadh', lat: 24.7136, lng: 46.6753, country: 'Saudi', exchange: 'TADAWUL', tickers: ['SAMI'], marketCap: '2.7T', volume: '0.9B', change: -0.78, color: '#cc9900', importance: 0.65 },
  ]

const links: Link[] = [
  { from: 'ny', to: 'ldn', strength: 0.8 },
  { from: 'ny', to: 'tokyo', strength: 0.9 },
  { from: 'ny', to: 'frankfurt', strength: 0.7 },
  { from: 'ldn', to: 'frankfurt', strength: 0.6 },
  { from: 'tokyo', to: 'shanghai', strength: 0.5 },
  { from: 'ny', to: 'seoul', strength: 0.7 },
  { from: 'ny', to: 'mumbai', strength: 0.6 },
  { from: 'ny', to: 'tlv', strength: 0.8 },
  { from: 'ldn', to: 'singapore', strength: 0.5 },
  { from: 'tokyo', to: 'sydney', strength: 0.4 },
  ]

const SECTOR_DATA: SectorItem[] = [
  { name: 'Defence Primes', change: +2.4, color: '#00ff88' },
  { name: 'Cybersecurity', change: +1.8, color: '#00ccff' },
  { name: 'Semiconductors', change: -0.6, color: '#ff6600' },
  { name: 'AI / ML', change: +3.1, color: '#9966ff' },
  { name: 'Space', change: +1.2, color: '#ffcc00' },
  { name: 'Nuclear', change: +0.9, color: '#ff3366' },
  { name: 'Quantum', change: -1.3, color: '#ff66cc' },
  { name: 'GovCloud', change: +0.7, color: '#66ccff' },
  ]

/* =========================
     GEO -> 3D (D3 inspired)
  ========================= */
function latLngToVector(lat: number, lng: number, radius = 2.5) {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        )
}

/* =========================
   EARTH LAYER
========================= */
function EarthLayer() {
    const meshRef = useRef<THREE.Mesh>(null)

  return (
        <>
          {/* Core sphere */}
              <mesh ref={meshRef}>
                      <sphereGeometry args={[2.5, 64, 64]} />
                      <meshStandardMaterial
                                  color="#08121a"
                                  roughness={0.8}
                                  metalness={0.3}
                                />
              </mesh>mesh>
          {/* Atmosphere glow */}
              <mesh>
                      <sphereGeometry args={[2.7, 64, 64]} />
                      <meshBasicMaterial
                                  color="#00ff88"
                                  transparent
                                  opacity={0.05}
                                  side={THREE.BackSide}
                                />
              </mesh>mesh>
          {/* Outer atmosphere */}
              <mesh>
                      <sphereGeometry args={[2.85, 64, 64]} />
                      <meshBasicMaterial
                                  color="#00ccff"
                                  transparent
                                  opacity={0.02}
                                  side={THREE.BackSide}
                                />
              </mesh>mesh>
          {/* Graticule lines */}
              <GraticuleLayer />
        </>>
      )
}

/* =========================
   GRATICULE LAYER
   ========================= */
function GraticuleLayer() {
    const gratLines = useMemo(() => {
          const lines: THREE.Vector3[][] = []
                // Latitude lines
                for (let lat = -80; lat <= 80; lat += 20) {
                        const pts: THREE.Vector3[] = []
                                for (let lng = -180; lng <= 180; lng += 5) {
                                          pts.push(latLngToVector(lat, lng, 2.52))
                                }
                        lines.push(pts)
                }
          // Longitude lines
          for (let lng = -180; lng < 180; lng += 20) {
                  const pts: THREE.Vector3[] = []
                          for (let lat = -90; lat <= 90; lat += 5) {
                                    pts.push(latLngToVector(lat, lng, 2.52))
                          }
                  lines.push(pts)
          }
          return lines
    }, [])
      
        return (
              <>
                {gratLines.map((pts, i) => (
                        <Line
                                    key={`grat-${i}`}
                                    points={pts}
                                    color="#00ff88"
                                    lineWidth={0.3}
                                    transparent
                                    opacity={0.08}
                                  />
                      ))}
              </>>
            )
}

/* =========================
   HUB LAYER (with hover)
   ========================= */
function HubLayer({ onHover, onSelect, hoveredId }: {
    onHover: (id: string | null) => void
    onSelect: (id: string) => void
    hoveredId: string | null
}) {
    return (
          <>
            {hubs.map((h) => (
                    <HubDot key={h.id} hub={h} onHover={onHover} onSelect={onSelect} isHovered={hoveredId === h.id} />
                  ))}
          </>>
        )
}

function HubDot({ hub, onHover, onSelect, isHovered }: {
    hub: Hub
    onHover: (id: string | null) => void
    onSelect: (id: string) => void
    isHovered: boolean
}) {
    const pos = useMemo(() => latLngToVector(hub.lat, hub.lng), [hub.lat, hub.lng])
        const meshRef = useRef<THREE.Mesh>(null)
            const glowRef = useRef<THREE.Mesh>(null)
                const ringRef = useRef<THREE.Mesh>(null)
                  
                    useFrame(({ clock }) => {
                          const t = clock.getElapsedTime()
                                if (meshRef.current) {
                                        const scale = isHovered ? 1.8 : 1 + 0.2 * Math.sin(t * 2 + hub.lat)
                                                meshRef.current.scale.setScalar(scale)
                                }
                          if (glowRef.current) {
                                  const glowScale = isHovered ? 3 : 2 + 0.5 * Math.sin(t * 1.5 + hub.lng)
                                          glowRef.current.scale.setScalar(glowScale)
                          }
                          if (ringRef.current) {
                                  const ringScale = 1 + ((t * 0.5 + hub.lat * 0.01) % 1) * 3
                                          const ringOpacity = 1 - ((t * 0.5 + hub.lat * 0.01) % 1)
                                                  ringRef.current.scale.setScalar(ringScale);
                                  (ringRef.current.material as THREE.MeshBasicMaterial).opacity = ringOpacity * 0.5
                          }
                    })
                      
                        const color = new THREE.Color(hub.color)
                          
                            return (
                                  <group position={pos}>
                                    {/* Glow */}
                                        <mesh ref={glowRef}>
                                                <sphereGeometry args={[0.06 * hub.importance, 16, 16]} />
                                                <meshBasicMaterial color={hub.color} transparent opacity={0.15} />
                                        </mesh>mesh>
                                    {/* Core dot */}
                                        <mesh
                                                  ref={meshRef}
                                                  onPointerOver={() => onHover(hub.id)}
                                                  onPointerOut={() => onHover(null)}
                                                  onClick={() => onSelect(hub.id)}
                                                >
                                                <sphereGeometry args={[0.04 * hub.importance, 16, 16]} />
                                                <meshBasicMaterial color={hub.color} />
                                        </mesh>mesh>
                                    {/* Center bright point */}
                                        <mesh>
                                                <sphereGeometry args={[0.015, 12, 12]} />
                                                <meshBasicMaterial color="#ffffff" />
                                        </mesh>mesh>
                                    {/* Pulse ring */}
                                        <mesh ref={ringRef}>
                                                <ringGeometry args={[0.04, 0.05, 32]} />
                                                <meshBasicMaterial color={hub.color} transparent opacity={0.5} side={THREE.DoubleSide} />
                                        </mesh>mesh>
                                    {/* Tooltip on hover */}
                                    {isHovered && (
                                            <Html distanceFactor={8} position={[0, 0.15, 0]} center>
                                                      <div style={{
                                                          background: 'rgba(0,10,20,0.92)',
                                                          border: `1px solid ${hub.color}60`,
                                                          borderRadius: 8,
                                                          padding: '8px 12px',
                                                          backdropFilter: 'blur(10px)',
                                                          pointerEvents: 'none',
                                                          minWidth: 160,
                                                          fontFamily: 'monospace',
                                            }}>
                                                                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                                                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: hub.color }} />
                                                                                <span style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{hub.name}</span>span>
                                                                                <span style={{ color: '#666', fontSize: 9 }}>{hub.exchange}</span>span>
                                                                  </div>div>
                                                                  <div style={{ display: 'flex', gap: 12, fontSize: 10 }}>
                                                                                <span style={{ color: '#888' }}>MCap: {hub.marketCap}</span>span>
                                                                                <span style={{ color: hub.change >= 0 ? '#00ff88' : '#ff4444', fontWeight: 'bold' }}>
                                                                                  {hub.change >= 0 ? '+' : ''}{hub.change.toFixed(2)}%
                                                                                </span>span>
                                                                  </div>div>
                                                                  <div style={{ color: '#555', fontSize: 9, marginTop: 4 }}>
                                                                    {hub.tickers.join(' | ')}
                                                                  </div>div>
                                                      </div>div>
                                            </Html>Html>
                                        )}
                                  </group>group>
                                )
                              }
                              
                              /* =========================
                                 ARC LAYER (D3 interpolation)
                                 ========================= */
function ArcLayer() {
    return (
          <>
            {links.map((link, i) => (
                    <ArcLine key={i} link={link} index={i} />
                  ))}
          </>>
        )
}

function ArcLine({ link, index }: { link: Link; index: number }) {
    const from = hubs.find(h => h.id === link.from)!
        const to = hubs.find(h => h.id === link.to)!
          
            const points = useMemo(() => {
                  const interpolate = geoInterpolate(
                          [from.lng, from.lat],
                          [to.lng, to.lat]
                        )
                        const pts: THREE.Vector3[] = []
                              for (let t = 0; t <= 1; t += 0.02) {
                                      const [lng, lat] = interpolate(t)
                                              const v = latLngToVector(lat, lng)
                                                      const height = Math.sin(Math.PI * t) * (0.6 + link.strength)
                                                              v.multiplyScalar(1 + height * 0.15)
                                                                      pts.push(v)
                              }
                  return pts
            }, [from.lng, from.lat, to.lng, to.lat, link.strength])
              
                return (
                      <Line
                              points={points}
                              color="#00ff88"
                              lineWidth={1}
                              transparent
                              opacity={0.35 + link.strength * 0.2}
                            />
                    )
}

/* =========================
   PULSE LAYER (data flow)
   ========================= */
function PulseLayer() {
    const refs = useRef<THREE.Mesh[]>([])
      
        useFrame(({ clock }) => {
              const t = clock.getElapsedTime()
                    refs.current.forEach((mesh, i) => {
                            if (!mesh || !links[i]) return
                                    const link = links[i]
                                            const from = hubs.find(h => h.id === link.from)!
                                                    const to = hubs.find(h => h.id === link.to)!
                                                            const interpolate = geoInterpolate(
                                                                      [from.lng, from.lat],
                                                                      [to.lng, to.lat]
                                                                    )
                                                                    const tt = (t * 0.1 + i * 0.2) % 1
                                                                            const [lng, lat] = interpolate(tt)
                                                                                    const pos = latLngToVector(lat, lng)
                                                                                            const height = Math.sin(Math.PI * tt) * (0.6 + link.strength)
                                                                                                    pos.multiplyScalar(1 + height * 0.15)
                                                                                                            mesh.position.copy(pos)
                      })
        })
          
            return (
                  <>
                    {links.map((link, i) => {
                            const from = hubs.find(h => h.id === link.from)!
                                      return (
                                                  <mesh
                                                                key={i}
                                                                ref={(el) => { if (el) refs.current[i] = el }}
                                                              >
                                                              <sphereGeometry args={[0.03, 12, 12]} />
                                                              <meshBasicMaterial color={from.color} transparent opacity={0.9} />
                                                  </mesh>mesh>
                                                )
                  })}
                  </>>
                )
}

/* =========================
   SCAN LINE EFFECT
   ========================= */
function ScanLine() {
    const meshRef = useRef<THREE.Mesh>(null)
      
        useFrame(({ clock }) => {
              if (!meshRef.current) return
                    const t = clock.getElapsedTime()
                          const y = Math.sin(t * 0.3) * 2.5
                                meshRef.current.position.y = y
        })
          
            return (
                  <mesh ref={meshRef} rotation={[0, 0, 0]}>
                        <ringGeometry args={[2.5, 2.55, 64]} />
                        <meshBasicMaterial color="#00ff88" transparent opacity={0.08} side={THREE.DoubleSide} />
                  </mesh>mesh>
                )
}

/* =========================
   ORBITAL RINGS
   ========================= */
function OrbitalRings() {
    const groupRef = useRef<THREE.Group>(null)
      
        useFrame(({ clock }) => {
              if (!groupRef.current) return
                    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
        })
          
            const rings = useMemo(() => {
                  const configs = [
                    { radius: 3.0, tilt: 0.3, color: '#00ff88', opacity: 0.12 },
                    { radius: 3.3, tilt: 0.8, color: '#00ccff', opacity: 0.08 },
                    { radius: 3.6, tilt: 1.2, color: '#9966ff', opacity: 0.06 },
                        ]
                        return configs.map((c, i) => {
                                const pts: THREE.Vector3[] = []
                                        for (let a = 0; a <= 360; a += 2) {
                                                  const rad = (a * Math.PI) / 180
                                                            pts.push(new THREE.Vector3(
                                                                        c.radius * Math.cos(rad),
                                                                        c.radius * Math.sin(rad) * Math.sin(c.tilt),
                                                                        c.radius * Math.sin(rad) * Math.cos(c.tilt)
                                                                      ))
                                        }
                                return { ...c, pts, key: i }
                        })
            }, [])
              
                return (
                      <group ref={groupRef}>
                        {rings.map((r) => (
                                <Line
                                            key={r.key}
                                            points={r.pts}
                                            color={r.color}
                                            lineWidth={0.5}
                                            transparent
                                            opacity={r.opacity}
                                          />
                              ))}
                      </group>group>
                    )
}

/* =========================
   MAIN 3D SCENE
   ========================= */
function GlobeScene({ onHover, onSelect, hoveredId }: {
    onHover: (id: string | null) => void
    onSelect: (id: string) => void
    hoveredId: string | null
}) {
    return (
          <>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <pointLight position={[-5, -5, 5]} intensity={0.3} color="#00ccff" />
                <EarthLayer />
                <HubLayer onHover={onHover} onSelect={onSelect} hoveredId={hoveredId} />
                <ArcLayer />
                <PulseLayer />
                <ScanLine />
                <OrbitalRings />
                <OrbitControls
                          autoRotate
                          autoRotateSpeed={0.4}
                          enableZoom={true}
                          minDistance={3.5}
                          maxDistance={12}
                          enablePan={false}
                        />
          </>>
        )
}

/* =========================
   MAIN COMPONENT (UI + 3D)
   ========================= */
export default function GlobalStockGlobe() {
    const [hoveredId, setHoveredId] = useState<string | null>(null)
        const [selectedId, setSelectedId] = useState<string | null>(null)
            const [gIdx, setGIdx] = useState({ value: 7847.32, change: 1.24 })
              
                useEffect(() => {
                      const iv = setInterval(() => {
                              setGIdx(p => ({
                                        value: p.value + (Math.random() - 0.48) * 5,
                                        change: p.change + (Math.random() - 0.5) * 0.1,
                              }))
                      }, 3000)
                            return () => clearInterval(iv)
                }, [])
                  
                    const onHover = useCallback((id: string | null) => setHoveredId(id), [])
                        const onSelect = useCallback((id: string) => {
                              setSelectedId(prev => prev === id ? null : id)
                        }, [])
                          
                            const selectedHub = selectedId ? hubs.find(h => h.id === selectedId) : null
                                const changeClass = (v: number) => v >= 0 ? 'text-emerald-400' : 'text-red-400'
                                    const changeStr = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%'
                                      
                                        return (
                                              <section className="relative w-full py-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000508 0%, #000a14 50%, #000508 100%)' }}>
                                                {/* HEADER */}
                                                    <div className="text-center mb-4 px-4">
                                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-3">
                                                                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                                                                      <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-400 uppercase">Global Intelligence Network</span>span>
                                                            </div>div>
                                                            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                                                      Global Stock <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence</span>span>
                                                            </h2>h2>
                                                            <p className="text-xs text-gray-500 font-mono">Real-time defence-tech market analysis across 12 global exchanges</p>p>
                                                    </div>div>
                                              
                                                {/* GLOBAL INDEX BAR */}
                                                    <div className="flex justify-center mb-4 px-4">
                                                            <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/10">
                                                                      <div className="flex items-center gap-2">
                                                                                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                                                                                  <span className="text-[10px] font-mono text-gray-400">GLOBAL DEFENCE INDEX</span>span>
                                                                      </div>div>
                                                                      <span className="text-sm font-bold text-white font-mono">
                                                                        {gIdx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                      </span>span>
                                                                      <span className={'text-xs font-mono font-bold ' + changeClass(gIdx.change)}>
                                                                        {gIdx.change >= 0 ? '+' : ''}{gIdx.change.toFixed(2)}%
                                                                      </span>span>
                                                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                            </div>div>
                                                    </div>div>
                                              
                                                {/* MAIN GRID: Sectors | Globe | Signal Feed */}
                                                    <div className="relative max-w-7xl mx-auto px-4">
                                                            <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-4 items-start">
                                                              {/* LEFT: Sector Performance */}
                                                                      <div className="hidden lg:block space-y-1.5">
                                                                                  <div className="flex items-center gap-2 mb-2">
                                                                                                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                                                                                                <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">Sector Performance</span>span>
                                                                                  </div>div>
                                                                        {SECTOR_DATA.map((s, i) => (
                                                              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-colors">
                                                                              <span className="text-[10px] font-mono text-gray-400">{s.name}</span>span>
                                                                              <span className={'text-[10px] font-mono font-bold ' + changeClass(s.change)}>{changeStr(s.change)}</span>span>
                                                              </div>div>
                                                            ))}
                                                                      </div>div>
                                                            
                                                              {/* CENTER: 3D Globe */}
                                                                      <div className="relative" style={{ height: 600 }}>
                                                                                  <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
                                                                                                <GlobeScene onHover={onHover} onSelect={onSelect} hoveredId={hoveredId} />
                                                                                  </Canvas>Canvas>
                                                                      </div>div>
                                                            
                                                              {/* RIGHT: Signal Feed */}
                                                                      <div className="hidden lg:block space-y-1.5">
                                                                                  <div className="flex items-center gap-2 mb-2">
                                                                                                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                                                                                                <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">Signal Feed</span>span>
                                                                                  </div>div>
                                                                        {hubs.slice(0, 8).map((h, i) => (
                                                              <div
                                                                                key={h.id}
                                                                                className={'flex items-center justify-between px-2.5 py-1.5 rounded border transition-all cursor-pointer ' +
                                                                                                    (selectedId === h.id ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/[0.04] hover:border-cyan-500/20')}
                                                                                onClick={() => onSelect(h.id)}
                                                                              >
                                                                              <div className="flex items-center gap-1.5">
                                                                                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: h.color }} />
                                                                                                <span className="text-[10px] font-mono text-gray-300">{h.name}</span>span>
                                                                              </div>div>
                                                                              <div className="flex items-center gap-1">
                                                                                {h.change >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                                                                                                <span className={'text-[10px] font-mono font-bold ' + changeClass(h.change)}>{changeStr(h.change)}</span>span>
                                                                              </div>div>
                                                              </div>div>
                                                            ))}
                                                                      </div>div>
                                                            </div>div>
                                                    
                                                      {/* SELECTED HUB DETAIL CARD */}
                                                      {selectedHub && (
                                                          <div className="mt-4 mx-auto max-w-2xl p-4 rounded-xl bg-black/50 border border-emerald-500/20 backdrop-blur-sm">
                                                                      <div className="flex items-center justify-between mb-3">
                                                                                    <div className="flex items-center gap-3">
                                                                                                    <div className="w-3 h-3 rounded-full" style={{ background: selectedHub.color }} />
                                                                                                    <div>
                                                                                                                      <h3 className="text-sm font-bold text-white">{selectedHub.name} &mdash; {selectedHub.exchange}</h3>h3>
                                                                                                                      <p className="text-[10px] text-gray-500 font-mono">{selectedHub.country}</p>p>
                                                                                                      </div>div>
                                                                                    </div>div>
                                                                                    <div className="text-right">
                                                                                                    <div className={'text-lg font-bold font-mono ' + changeClass(selectedHub.change)}>{changeStr(selectedHub.change)}</div>div>
                                                                                                    <div className="text-[10px] text-gray-500 font-mono">Vol: {selectedHub.volume}</div>div>
                                                                                    </div>div>
                                                                      </div>div>
                                                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                                        {[
                                                            { label: 'Market Cap', value: selectedHub.marketCap, cls: 'text-white' },
                                                            { label: 'Volume', value: selectedHub.volume, cls: 'text-white' },
                                                            { label: 'Key Tickers', value: selectedHub.tickers.join(', '), cls: 'text-emerald-400' },
                                                            { label: 'Exchange', value: selectedHub.exchange, cls: 'text-cyan-400' },
                                                                          ].map((item, i) => (
                                                                                            <div key={i} className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                                                                                                              <div className="text-[9px] text-gray-500 font-mono mb-0.5">{item.label}</div>div>
                                                                                                              <div className={'text-xs font-bold font-mono ' + item.cls}>{item.value}</div>div>
                                                                                              </div>div>
                                                                                          ))}
                                                                      </div>div>
                                                          </div>div>
                                                            )}
                                                    </div>div>
                                              
                                                {/* MOBILE SECTORS */}
                                                    <div className="lg:hidden mt-4 px-4">
                                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                              {SECTOR_DATA.map((s, i) => (
                                                            <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
                                                                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
                                                                          <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{s.name}</span>span>
                                                                          <span className={'text-[10px] font-mono font-bold ' + changeClass(s.change)}>{changeStr(s.change)}</span>span>
                                                            </div>div>
                                                          ))}
                                                            </div>div>
                                                    </div>div>
                                              
                                                {/* CORNER ACCENTS */}
                                                    <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-emerald-500/10" />
                                                    <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-emerald-500/10" />
                                                    <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-emerald-500/10" />
                                                    <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-emerald-500/10" />
                                              </section>section>
                                            )
                                          }</></></></></></>
