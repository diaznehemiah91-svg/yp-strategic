'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { AlertTriangle, Zap } from 'lucide-react'

const STOCK_BASE = [
  { ticker: 'NVDA', name: 'NVIDIA', lat: 37.37, lng: -122.04, price: 0, change: 0, color: '#22c55e' },
  { ticker: 'PLTR', name: 'Palantir', lat: 39.74, lng: -104.99, price: 0, change: 0, color: '#06b6d4' },
  { ticker: 'RKLB', name: 'Rocket Lab', lat: 33.92, lng: -118.32, price: 0, change: 0, color: '#a855f7' },
  { ticker: 'LMT', name: 'Lockheed Martin', lat: 38.98, lng: -77.10, price: 0, change: 0, color: '#1e40af' },
  { ticker: 'RTX', name: 'RTX Corp', lat: 41.76, lng: -72.68, price: 0, change: 0, color: '#1e40af' },
  { ticker: 'CRWD', name: 'CrowdStrike', lat: 30.27, lng: -97.74, price: 0, change: 0, color: '#dc2626' },
  ]

const RISK_ZONES = [
  { name: 'Taiwan Strait', severity: 'CRITICAL', lat: 24.5, lng: 120.5, risk: 9.2, event: 'PLA Navy Exercise', companies: ['NVDA', 'RTX', 'LMT'] },
  { name: 'Middle East', severity: 'HIGH', lat: 28.0, lng: 42.0, risk: 7.1, event: 'Regional Tensions', companies: ['LMT', 'RTX', 'BA'] },
  ]

export default function GlobalIntelligenceDashboard() {
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const globeRef = useRef<THREE.Group | null>(null)
    const satellitesRef = useRef<THREE.Object3D[]>([])
    const [stocks, setStocks] = useState(STOCK_BASE)
    const [selectedStock, setSelectedStock] = useState<typeof STOCK_BASE[0] | null>(null)
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
        const tickers = STOCK_BASE.map((s) => s.ticker).join(',')
        const url = '/api/stocks?tickers=' + tickers
        const fetchPrices = async () => {
                try {
                          const res = await fetch(url)
                          if (!res.ok) return
                          const data = await res.json()
                          setStocks((prev) =>
                                      prev.map((s) => {
                                                    const live = data[s.ticker]
                                                    if (live && live.c > 0) {
                                                                    return { ...s, price: live.c, change: live.dp ?? 0 }
                                                    }
                                                    return s
                                      })
                                            )
                } catch {
                          // silently fail
                }
        }
        fetchPrices()
        const interval = setInterval(fetchPrices, 60000)
        return () => clearInterval(interval)
  }, [])

  useEffect(() => {
        const container = containerRef.current
        if (!container) return

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

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(100, 100, 100)
        directionalLight.castShadow = true
        scene.add(ambientLight, directionalLight)

                const globeGroup = new THREE.Group()
        globeRef.current = globeGroup
        scene.add(globeGroup)

                const earthGeometry = new THREE.SphereGeometry(60, 512, 512)
        const canvas = document.createElement('canvas')
        canvas.width = 2048
        canvas.height = 1024
        const ctx = canvas.getContext('2d')!

                const latLngToPixel = (lat: number, lng: number) => {
                        const x = ((lng + 180) / 360) * canvas.width
                        const y = ((90 - lat) / 180) * canvas.height
                        return { x, y }
                }

                ctx.fillStyle = '#061a3a'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.fillStyle = '#2a6a3a'

                const naS = latLngToPixel(50, -130); const naE = latLngToPixel(25, -80)
        ctx.fillRect(naS.x, naE.y, naE.x - naS.x, naS.y - naE.y)
        const saS = latLngToPixel(15, -80); const saE = latLngToPixel(-56, -35)
        ctx.fillRect(saS.x, saE.y, saE.x - saS.x, saS.y - saE.y)
        const euS = latLngToPixel(60, -10); const euE = latLngToPixel(36, 45)
        ctx.fillRect(euS.x, euE.y, euE.x - euS.x, euS.y - euE.y)
        const afS = latLngToPixel(37, -20); const afE = latLngToPixel(-35, 55)
        ctx.fillRect(afS.x, afE.y, afE.x - afS.x, afS.y - afE.y)
        ctx.fillStyle = '#3a7a4a'
        const meS = latLngToPixel(40, 25); const meE = latLngToPixel(15, 70)
        ctx.fillRect(meS.x, meE.y, meE.x - meS.x, meS.y - meE.y)
        ctx.fillStyle = '#2a6a3a'
        const asS = latLngToPixel(55, 60); const asE = latLngToPixel(15, 150)
        ctx.fillRect(asS.x, asE.y, asE.x - asS.x, asS.y - asE.y)
        ctx.fillStyle = '#3a7a4a'
        const seS = latLngToPixel(20, 95); const seE = latLngToPixel(-45, 180)
        ctx.fillRect(seS.x, seE.y, seE.x - seS.x, seS.y - seE.y)
        ctx.fillStyle = '#2a6a3a'
        const glS = latLngToPixel(83, -45); const glE = latLngToPixel(60, 10)
        ctx.fillRect(glS.x, glE.y, glE.x - glS.x, glS.y - glE.y)

                ctx.fillStyle = 'rgba(42, 106, 58, 0.3)'
        for (let i = 0; i < 500; i++) {
                ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 100 + 20, Math.random() * 80 + 10)
        }

                ctx.strokeStyle = 'rgba(0, 255, 136, 0.08)'
        ctx.lineWidth = 1
        for (let i = 0; i < canvas.width; i += 256) {
                ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke()
        }
        for (let i = 0; i < canvas.height; i += 128) {
                ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke()
        }

                const earthTexture = new THREE.CanvasTexture(canvas)
        const earthMaterial = new THREE.MeshPhongMaterial({ map: earthTexture, emissive: 0x1a3a52, emissiveIntensity: 0.4, shininess: 10 })
        const earth = new THREE.Mesh(earthGeometry, earthMaterial)
        globeGroup.add(earth)

                const atmosphereGeometry = new THREE.SphereGeometry(60.5, 256, 256)
        const atmosphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0088ff, transparent: true, opacity: 0.12, side: THREE.BackSide })
        globeGroup.add(new THREE.Mesh(atmosphereGeometry, atmosphereMaterial))

                const gridGeometry = new THREE.SphereGeometry(60.1, 32, 32)
        const gridMaterial = new THREE.LineBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.1 })
        globeGroup.add(new THREE.LineSegments(new THREE.WireframeGeometry(gridGeometry), gridMaterial))

                const latLngToXYZ = (lat: number, lng: number, radius: number) => {
                        const phi = (90 - lat) * (Math.PI / 180)
                        const theta = (lng + 180) * (Math.PI / 180)
                        return new THREE.Vector3(-(radius * Math.sin(phi) * Math.cos(theta)), radius * Math.cos(phi), radius * Math.sin(phi) * Math.sin(theta))
                }

                STOCK_BASE.forEach((stock) => {
                        const pos = latLngToXYZ(stock.lat, stock.lng, 75)
                        const labelCanvas = document.createElement('canvas')
                        labelCanvas.width = 256
                        labelCanvas.height = 128
                        const labelCtx = labelCanvas.getContext('2d')!
                        labelCtx.fillStyle = 'rgba(0, 0, 0, 0.85)'
                        labelCtx.fillRect(0, 0, labelCanvas.width, labelCanvas.height)
                        labelCtx.strokeStyle = '#00ff88'
                        labelCtx.lineWidth = 2
                        labelCtx.strokeRect(2, 2, labelCanvas.width - 4, labelCanvas.height - 4)
                        labelCtx.fillStyle = '#00ff88'
                        labelCtx.font = 'bold 32px monospace'
                        labelCtx.fillText(stock.ticker, 10, 50)
                        labelCtx.fillStyle = '#22c55e'
                        labelCtx.font = 'bold 20px monospace'
                        labelCtx.fillText('LIVE', 140, 50)
                        const texture = new THREE.CanvasTexture(labelCanvas)
                        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, sizeAttenuation: true }))
                        sprite.position.copy(pos)
                        sprite.scale.set(8, 4, 1)
                        sprite.userData = { stock }
                        globeGroup.add(sprite)
                        const ringGeometry = new THREE.TorusGeometry(20, 1.5, 16, 32)
                        const ringMaterial = new THREE.MeshBasicMaterial({ color: stock.color, transparent: true, opacity: 0.5 })
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial)
                        ring.position.copy(pos)
                        ring.lookAt(camera.position)
                        ring.userData = { stock, pulseSpeed: 0.02 + Math.random() * 0.02 }
                        globeGroup.add(ring)
                })

                RISK_ZONES.forEach((zone) => {
                        const pos = latLngToXYZ(zone.lat, zone.lng, 65)
                        const alertColor = zone.severity === 'CRITICAL' ? 0xff0055 : 0xff8800
                        const alertGeometry = new THREE.IcosahedronGeometry(8, 4)
                        const alertMaterial = new THREE.MeshStandardMaterial({ color: alertColor, emissive: alertColor, emissiveIntensity: 0.8, metalness: 0.7, roughness: 0.2 })
                        const alertMesh = new THREE.Mesh(alertGeometry, alertMaterial)
                        alertMesh.position.copy(pos)
                        alertMesh.userData = { zone, isPulsing: true }
                        globeGroup.add(alertMesh)
                        const haloGeometry = new THREE.IcosahedronGeometry(10, 2)
                        const haloMaterial = new THREE.MeshBasicMaterial({ color: alertColor, transparent: true, opacity: 0.2 })
                        const halo = new THREE.Mesh(haloGeometry, haloMaterial)
                        halo.position.copy(pos)
                        alertMesh.userData.halo = halo
                        globeGroup.add(halo)
                })

                const createSatellite = () => {
                        const geometry = new THREE.OctahedronGeometry(3, 0)
                        const material = new THREE.MeshPhongMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.6 })
                        const satellite = new THREE.Mesh(geometry, material)
                        const orbitRadius = 100 + Math.random() * 30
                        const angle = Math.random() * Math.PI * 2
                        const height = (Math.random() - 0.5) * 80
                        satellite.position.set(Math.cos(angle) * orbitRadius, height, Math.sin(angle) * orbitRadius)
                        satellite.userData = { orbitRadius, orbitAngle: angle, orbitSpeed: 0.0001 + Math.random() * 0.0002, height }
                        globeGroup.add(satellite)
                        satellitesRef.current.push(satellite)
                }
        for (let i = 0; i < 5; i++) { createSatellite() }

                const starCount = 1000
        const starGeometry = new THREE.BufferGeometry()
        const starPositions = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount * 3; i += 3) {
                starPositions[i] = (Math.random() - 0.5) * 600
                starPositions[i + 1] = (Math.random() - 0.5) * 600
                starPositions[i + 2] = (Math.random() - 0.5) * 600
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
        scene.add(new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })))

                let animationId: number
        const animate = () => {
                animationId = requestAnimationFrame(animate)
                globeGroup.rotation.y += 0.0001
                satellitesRef.current.forEach((sat) => {
                          sat.userData.orbitAngle += sat.userData.orbitSpeed
                          sat.position.x = Math.cos(sat.userData.orbitAngle) * sat.userData.orbitRadius
                          sat.position.z = Math.sin(sat.userData.orbitAngle) * sat.userData.orbitRadius
                          sat.rotation.x += 0.01
                          sat.rotation.y += 0.015
                })
                scene.traverse((obj) => {
                          if (obj.userData && obj.userData.zone && obj.userData.isPulsing) {
                                      const time = Date.now() * 0.003
                                      const s = 1 + Math.sin(time) * 0.3
                                      obj.scale.set(s, s, s)
                                      if (obj.userData.halo) { obj.userData.halo.rotation.z += 0.005 }
                          }
                })
                scene.traverse((obj) => {
                          if (obj.userData && obj.userData.stock && obj.userData.pulseSpeed) {
                                      const time = Date.now() * obj.userData.pulseSpeed
                                      const s = 1 + Math.sin(time) * 0.2
                                      obj.scale.set(s, s, 1)
                          }
                })
                renderer.render(scene, camera)
        }
        animate()

                let isDragging = false
        let prevPos = { x: 0, y: 0 }
        const onMouseDown = (e: MouseEvent) => { isDragging = true; prevPos = { x: e.clientX, y: e.clientY } }
        const onMouseMove = (e: MouseEvent) => {
                if (!isDragging) return
                globeGroup.rotation.y += (e.clientX - prevPos.x) * 0.005
                globeGroup.rotation.x += (e.clientY - prevPos.y) * 0.005
                prevPos = { x: e.clientX, y: e.clientY }
        }
        const onMouseUp = () => { isDragging = false }
        renderer.domElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mousemove', onMouseMove)
        window.addEventListener('mouseup', onMouseUp)

                const handleResize = () => {
                        camera.aspect = container.clientWidth / container.clientHeight
                        camera.updateProjectionMatrix()
                        renderer.setSize(container.clientWidth, container.clientHeight)
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
              <div ref={containerRef} className="absolute inset-0 overflow-hidden" />
        
              <div className="absolute left-4 top-20 w-80 glass p-4 rounded border border-[var(--border)] max-h-[500px] overflow-y-auto z-20 pointer-events-auto">
                      <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-4">
                                Defence Intelligence - Live Prices
                      </div>div>
                      <div className="space-y-2">
                        {stocks.map((stock) => {
                      const changeColor = stock.change >= 0 ? 'text-[#22c55e]' : 'text-[#dc2626]'
                                    return (
                                                    <div
                                                                      key={stock.ticker}
                                                                      className="bg-[rgba(0,0,0,0.3)] p-2 rounded border border-[var(--border)] cursor-pointer"
                                                                      onClick={() => setSelectedStock(stock)}
                                                                    >
                                                                    <div className="flex justify-between items-center">
                                                                                      <div className="font-mono text-[10px] text-white font-bold">{stock.ticker}</div>div>
                                                                                      <div className={'font-mono text-[10px] ' + changeColor}>
                                                                                        {stock.price > 0 ? ('$' + stock.price.toFixed(2)) : 'Loading...'}
                                                                                        </div>div>
                                                                    </div>div>
                                                                    <div className="font-mono text-[9px] text-[var(--text-dim)]">{stock.name}</div>div>
                                                      {stock.price > 0 && (
                                                                                        <div className={'font-mono text-[9px] ' + changeColor}>
                                                                                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                                                                          </div>div>
                                                                    )}
                                                    </div>div>
                                                  )
                        })}
                      </div>div>
              
                      <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mt-4 mb-3">
                                Global Defence Correlations
                      </div>div>
                      <div className="space-y-3">
                        {[
          { pair: 'LMT RTX', corr: 84.0 },
          { pair: 'NVDA PLTR', corr: 72.5 },
          { pair: 'RKLB LMT', corr: 68.3 },
          { pair: 'CRWD RTX', corr: 65.2 },
                    ].map((item) => (
                                  <div key={item.pair} className="bg-[rgba(0,0,0,0.3)] p-2 rounded border border-[var(--border)]">
                                                <div className="font-mono text-[9px] text-white font-bold">{item.pair}</div>div>
                                                <div className="font-mono text-[9px] text-[var(--accent)]">{item.corr.toFixed(1)}% correlation</div>div>
                                  </div>div>
                                ))}
                      </div>div>
              </div>div>
        
              <div className="absolute right-4 top-20 w-80 glass p-4 rounded border border-[var(--border)] max-h-[500px] overflow-y-auto z-20 pointer-events-auto">
                      <div className="mb-6">
                                <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-3">
                                            Crypto Markets
                                </div>div>
                                <div className="space-y-2">
                                  {cryptoData.map((crypto) => (
                        <div key={crypto.symbol} className="flex justify-between items-center font-mono text-[10px]">
                                        <span className="text-white">{crypto.symbol}</span>span>
                                        <span className={crypto.change > 0 ? 'text-[#22c55e]' : 'text-[#dc2626]'}>
                                          {crypto.change > 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                                        </span>span>
                        </div>div>
                      ))}
                                </div>div>
                      </div>div>
                      <div className="border-t border-[var(--border)] pt-4">
                                <div className="font-mono text-[10px] text-[var(--accent)] uppercase tracking-widest mb-3">
                                            Futures
                                </div>div>
                                <div className="space-y-2">
                                  {futuresData.map((future) => (
                        <div key={future.symbol} className="flex justify-between items-center font-mono text-[10px]">
                                        <span className="text-white">/{future.symbol}</span>span>
                                        <span className={future.change > 0 ? 'text-[#22c55e]' : 'text-[#dc2626]'}>
                                          {future.change > 0 ? '+' : ''}{future.change.toFixed(2)}%
                                        </span>span>
                        </div>div>
                      ))}
                                </div>div>
                      </div>div>
              </div>div>
        
          {RISK_ZONES.map((zone) => {
                  const borderColor = zone.severity === 'CRITICAL' ? '#ff0055' : '#ff8800'
                            const textColor = zone.severity === 'CRITICAL' ? '#ff0055' : '#ff8800'
                                      return (
                                                  <div key={zone.name} className="absolute top-4 right-4 glass p-4 rounded border-2 z-20 pointer-events-auto" style={{ borderColor }}>
                                                              <div className="flex items-center gap-2 mb-2">
                                                                            <AlertTriangle size={18} style={{ color: textColor }} />
                                                                            <div className="font-mono text-[10px] font-bold" style={{ color: textColor }}>{zone.severity} ALERT</div>div>
                                                              </div>div>
                                                              <div className="font-mono text-[9px] text-white mb-1">{zone.event}</div>div>
                                                              <div className="font-mono text-[9px] text-[var(--text-dim)]">Risk: {zone.risk}/10</div>div>
                                                              <div className="font-mono text-[9px] text-[var(--accent)] mt-2">Affecting: {zone.companies.join(', ')}</div>div>
                                                  </div>div>
                                                )
          })}
        
          {selectedStock && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 glass p-6 rounded border border-[var(--accent)] z-30 pointer-events-auto min-w-[250px]">
                            <button className="absolute top-2 right-2 text-[var(--text-dim)] font-mono text-[10px]" onClick={() => setSelectedStock(null)}>X</button>button>
                            <div className="font-mono text-[12px] text-[var(--accent)] font-bold mb-1">{selectedStock.ticker}</div>div>
                            <div className="font-mono text-[10px] text-white mb-2">{selectedStock.name}</div>div>
                            <div className="font-mono text-[14px] text-white font-bold">
                              {selectedStock.price > 0 ? ('$' + selectedStock.price.toFixed(2)) : 'Loading...'}
                            </div>div>
                    {selectedStock.price > 0 && (
                                <div className={selectedStock.change >= 0 ? 'text-[#22c55e] font-mono text-[11px]' : 'text-[#dc2626] font-mono text-[11px]'}>
                                  {selectedStock.change >= 0 ? '+' : ''}{selectedStock.change.toFixed(2)}%
                                </div>div>
                            )}
                  </div>div>
              )}
        
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass p-4 rounded border border-[var(--border)] z-20 font-mono text-[9px] pointer-events-auto">
                      <div className="text-[var(--accent)] flex items-center gap-2 mb-2">
                                <Zap size={14} />
                                Risk Score System Active - 6 Geopolitical Zones - 847 Signal Events / 24h
                      </div>div>
                      <div className="text-[var(--text-dim)]">Latency: 12ms - Sources: SEC - DARPA - USASpending - Finnhub</div>div>
              </div>div>
        </div>div>
      )
}</div>
