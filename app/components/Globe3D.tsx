'use client'

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { createGlobe } from './globe/createGlobe'
import { createRings, animateRings } from './globe/createRings'
import { createHotspots, animateHotspots } from './globe/createHotspots'
import { createTickers, updateTickerVisibility } from './globe/createTickers'

export default function Globe3D() {
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
      // @ts-expect-error - type declarations not available for three examples
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')

      // ===== SCENE SETUP =====
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x000814)

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
      const globeGroup = new THREE.Group()
      scene.add(globeGroup)

      // Add Earth globe
      const globe = createGlobe()
      globeGroup.add(globe)

      // Add orbital rings
      const rings = createRings()
      globeGroup.add(rings)

      // Add geopolitical hotspots
      const { group: hotspotsGroup } = createHotspots()
      globeGroup.add(hotspotsGroup)

      // Add stock ticker cards
      const { group: tickersGroup } = createTickers()
      globeGroup.add(tickersGroup)

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

        // Render
        renderer.render(scene, camera)
      }

      animate()

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
        if (animationId !== null) {
          cancelAnimationFrame(animationId)
        }
        if (container && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement)
        }
        renderer.dispose()
      }
    }

    // Initialize and setup cleanup
    let cleanup: (() => void) | null = null

    initializeGlobe()
      .then((cleanupFn) => {
        cleanup = cleanupFn
      })
      .catch((error) => {
        console.error('Failed to initialize Globe3D:', error)
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
