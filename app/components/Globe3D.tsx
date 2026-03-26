'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createGlobe } from './globe/createGlobe'
import { createRings, animateRings } from './globe/createRings'
import { createHotspots, animateHotspots } from './globe/createHotspots'
import { createTickers, updateTickerVisibility } from './globe/createTickers'
import { createCorrelationArcs, animateCorrelationArcs } from './globe/createCorrelationArcs'
import { createPedestal, animatePedestal } from './globe/createPedestal'
import { fetchLiveStockPrices, updateTickerDataOnGlobe, setupDataPolling } from './globe/dataBinding'
import { setupMobileControls } from './globe/mobileControls'
import { setupRaycasting } from './globe/raycaster'

interface GlobeFilters {
  search?: string
  sector?: string
  minPrice?: number
  maxPrice?: number
  minChange?: number
  severityMin?: number
}

interface Globe3DProps {
  onSelection?: (selection: { type: 'ticker' | 'hotspot' | 'none'; data?: any }) => void
  filters?: GlobeFilters
}

export default function Globe3D({ onSelection, filters }: Globe3DProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current) return

    // Store reference for cleanup
    const container = containerRef.current
    let animationId: number | null = null

    // Async initialization to load OrbitControls
    const initializeGlobe = async () => {
      try {
        console.log('[Globe3D] Initializing globe...')
        // @ts-expect-error - type declarations not available for three examples
        const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')
        console.log('[Globe3D] OrbitControls loaded')

      // ===== SCENE SETUP =====
      console.log('[Globe3D] Creating scene...')
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000814)
      console.log('[Globe3D] Scene created')

      // ===== CAMERA =====
      const camera = new THREE.PerspectiveCamera(
        75,
        container.clientWidth / container.clientHeight,
        0.1,
        10000
      )
      camera.position.z = 8

      // ===== WEBGL RENDERER =====
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(container.clientWidth, container.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFShadowMap
      container.appendChild(renderer.domElement)
      rendererRef.current = renderer
      console.log('[Globe3D] WebGL Renderer initialized:', {
        width: container.clientWidth,
        height: container.clientHeight,
        pixelRatio: window.devicePixelRatio,
      })

      // ===== LIGHTING =====
      const ambientLight = new THREE.AmbientLight(0x111122, 0.3)
      scene.add(ambientLight)

      const sunLight = new THREE.DirectionalLight(0xfff5e0, 1.2)
      sunLight.position.set(5, 3, 5)
      sunLight.castShadow = true
      scene.add(sunLight)

      const rimLight = new THREE.DirectionalLight(0x3366ff, 0.4)
      rimLight.position.set(-5, 2, -5)
      scene.add(rimLight)

      const accentLight = new THREE.PointLight(0x00ff52, 0.2, 20)
      accentLight.position.set(0, -4, 0)
      scene.add(accentLight)

      // ===== CREATE GLOBE COMPONENTS =====
      console.log('[Globe3D] Creating globe components...')
      const globeGroup = new THREE.Group()
      scene.add(globeGroup)

      // Add Earth globe
      const globe = createGlobe()
      globeGroup.add(globe)
      console.log('[Globe3D] Earth globe added')

      // Add orbital rings
      const rings = createRings()
      globeGroup.add(rings)
      console.log('[Globe3D] Orbital rings added')

      // Add geopolitical hotspots
      const { group: hotspotsGroup } = createHotspots()
      globeGroup.add(hotspotsGroup)
      console.log('[Globe3D] Hotspots added')

      // Add stock ticker cards
      const { group: tickersGroup } = createTickers()
      globeGroup.add(tickersGroup)
      console.log('[Globe3D] Ticker sprites added')

      // Add correlation arcs between stocks
      const { group: arcsGroup } = createCorrelationArcs()
      globeGroup.add(arcsGroup)
      console.log('[Globe3D] Correlation arcs added')

      // Add pedestal base
      const pedestalGroup = createPedestal()
      scene.add(pedestalGroup)
      console.log('[Globe3D] Pedestal base added')

      // ===== LIVE DATA BINDING =====
      const tickers = ['LMT', 'RTX', 'PLTR', 'NVDA', 'CRWD', 'OKLO', 'RKLB', 'IONQ']
      let cleanupDataPolling: (() => void) | null = null

      // Set up live price updates
      cleanupDataPolling = setupDataPolling(tickers, (liveData) => {
        const tickerSprites = tickersGroup.children
        updateTickerDataOnGlobe(tickerSprites as any, liveData)
      }, 5000) // Update every 5 seconds

      // ===== MOBILE GESTURE CONTROLS =====
      let cleanupMobileControls: (() => void) | null = null
      if (container) {
        cleanupMobileControls = setupMobileControls(container, camera, globeGroup)
      }

      // ===== RAYCASTING FOR INTERACTION =====
      let cleanupRaycasting: (() => void) | null = null
      if (container && onSelection) {
        cleanupRaycasting = setupRaycasting(container, camera, scene, onSelection)
        console.log('[Globe3D] Raycasting interaction enabled')
      }

      // ===== ORBIT CONTROLS =====
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.autoRotate = true
      controls.autoRotateSpeed = 2
      controls.minDistance = 4
      controls.maxDistance = 12
      controls.enablePan = false
      controls.enableZoom = true

      // ===== STARFIELD BACKGROUND =====
      const starsGeometry = new THREE.BufferGeometry()
      const starCount = 1000
      const positions = new Float32Array(starCount * 3)
      for (let i = 0; i < starCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200
        positions[i + 1] = (Math.random() - 0.5) * 200
        positions[i + 2] = (Math.random() - 0.5) * 200
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.6,
      })
      const stars = new THREE.Points(starsGeometry, starsMaterial)
      scene.add(stars)

      // ===== ANIMATION LOOP =====
      let lastTime = Date.now()

      const animate = () => {
        animationId = requestAnimationFrame(animate)

        const currentTime = Date.now()
        const deltaTime = (currentTime - lastTime) / 1000
        lastTime = currentTime

        // Update controls
        controls.update()

        // Animate globe rotation
        if (!controls.isDragging) {
          globeGroup.rotation.y += 0.0001
        }

        // Animate rings
        animateRings(rings, deltaTime)

        // Animate hotspots
        animateHotspots(hotspotsGroup, deltaTime)

        // Update ticker visibility based on camera
        updateTickerVisibility(tickersGroup, camera)

        // Apply filters to tickers and hotspots
        if (filters) {
          tickersGroup.children.forEach((child: any) => {
            if (child.tickerData) {
              const ticker = child.tickerData
              let visible = true

              if (filters.search) {
                visible =
                  visible &&
                  (ticker.ticker.toLowerCase().includes(filters.search.toLowerCase()) ||
                    ticker.ticker.toLowerCase().startsWith(filters.search.toLowerCase()))
              }

              if (filters.minPrice !== undefined) {
                const price = parseFloat(ticker.price.replace('$', ''))
                visible = visible && price >= filters.minPrice
              }

              if (filters.maxPrice !== undefined) {
                const price = parseFloat(ticker.price.replace('$', ''))
                visible = visible && price <= filters.maxPrice
              }

              child.visible = visible
            }
          })

          hotspotsGroup.children.forEach((child: any) => {
            if (child.hotspotData || child.isHotspotCore) {
              const hotspot = child.hotspotData
              let visible = true

              if (filters.severityMin !== undefined && hotspot) {
                visible = visible && hotspot.severity >= filters.severityMin
              }

              child.visible = visible
            }
          })
        }

        // Animate correlation arcs
        animateCorrelationArcs(arcsGroup)

        // Animate pedestal
        animatePedestal(pedestalGroup)

        // Render
        renderer.render(scene, camera)
      }

      animate()
      console.log('[Globe3D] Animation loop started - Globe is rendering!')

      // ===== HANDLE RESIZE =====
      const handleResize = () => {
        const width = container.clientWidth
        const height = container.clientHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)

      // ===== RETURN CLEANUP =====
      return () => {
        window.removeEventListener('resize', handleResize)
        if (cleanupDataPolling) {
          cleanupDataPolling()
        }
        if (cleanupMobileControls) {
          cleanupMobileControls()
        }
        if (cleanupRaycasting) {
          cleanupRaycasting()
        }
        if (animationId !== null) {
          cancelAnimationFrame(animationId)
        }
        if (container && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
      } catch (error) {
        console.error('[Globe3D] FATAL ERROR during initialization:', error)
        console.error('[Globe3D] Stack:', error instanceof Error ? error.stack : 'unknown')
        throw error
      }
    }

    // Initialize and setup cleanup
    let cleanup: (() => void) | null = null

    initializeGlobe()
      .then((cleanupFn) => {
        cleanup = cleanupFn
        console.log('[Globe3D] ✅ Globe fully initialized and running')
      })
      .catch((error) => {
        console.error('[Globe3D] ❌ Failed to initialize Globe3D:', error)
        if (container) {
          container.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:red;font-family:monospace;background:#000814">
            <div>
              <div style="color:#ff3366;font-size:14px">ERROR: Failed to load 3D Globe</div>
              <div style="color:#888;font-size:12px;margin-top:8px">${error instanceof Error ? error.message : 'Unknown error'}</div>
              <div style="color:#888;font-size:11px;margin-top:4px">Check browser console for details</div>
            </div>
          </div>`
        }
      })

    // Cleanup on unmount
    return () => {
      if (cleanup) {
        cleanup()
      }
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return <div ref={containerRef} className="w-full h-screen bg-[#000814] relative overflow-hidden" />
}
