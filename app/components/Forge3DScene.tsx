'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function Forge3DScene() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const bombersRef = useRef<THREE.Group[]>([])
  const particlesRef = useRef<THREE.Points | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    sceneRef.current = scene

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00ff52, 0.3)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x00a8ff, 1.5)
    pointLight.position.set(5, 5, 5)
    pointLight.castShadow = true
    scene.add(pointLight)

    const spotLight = new THREE.SpotLight(0xff3355, 0.8)
    spotLight.position.set(-5, 8, 5)
    spotLight.castShadow = true
    scene.add(spotLight)

    // Create 3D Stealth Bomber (geometric)
    const createBomber = (offset: number) => {
      const bomber = new THREE.Group()

      // Main fuselage (angular, stealth-like)
      const fuselageGeom = new THREE.BoxGeometry(2, 0.6, 0.5)
      const fuselageMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        metalness: 0.9,
        roughness: 0.1,
      })
      const fuselage = new THREE.Mesh(fuselageGeom, fuselageMat)
      fuselage.castShadow = true
      bomber.add(fuselage)

      // Wings (delta wing design)
      const wingGeom = new THREE.ConeGeometry(1.5, 0.1, 8)
      const wingMat = new THREE.MeshStandardMaterial({
        color: 0x00ff52,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x00ff52,
        emissiveIntensity: 0.3,
      })
      const leftWing = new THREE.Mesh(wingGeom, wingMat)
      leftWing.position.set(-1, 0, 0)
      leftWing.rotation.z = Math.PI / 4
      leftWing.castShadow = true
      bomber.add(leftWing)

      const rightWing = new THREE.Mesh(wingGeom, wingMat)
      rightWing.position.set(1, 0, 0)
      rightWing.rotation.z = -Math.PI / 4
      rightWing.castShadow = true
      bomber.add(rightWing)

      // Cockpit (glowing blue)
      const cockpitGeom = new THREE.SphereGeometry(0.3, 16, 16)
      const cockpitMat = new THREE.MeshStandardMaterial({
        color: 0x00a8ff,
        metalness: 0.4,
        roughness: 0.1,
        emissive: 0x00a8ff,
        emissiveIntensity: 0.8,
      })
      const cockpit = new THREE.Mesh(cockpitGeom, cockpitMat)
      cockpit.position.set(0.7, 0.2, 0)
      cockpit.castShadow = true
      bomber.add(cockpit)

      // Engine glow
      const engineGeom = new THREE.SphereGeometry(0.2, 16, 16)
      const engineMat = new THREE.MeshStandardMaterial({
        color: 0xff6b35,
        emissive: 0xff6b35,
        emissiveIntensity: 1,
      })
      const engine = new THREE.Mesh(engineGeom, engineMat)
      engine.position.set(-1, -0.3, 0)
      engine.castShadow = true
      bomber.add(engine)

      // Hardware layers (will separate on explosion)
      const hardwareGeom = new THREE.BoxGeometry(0.3, 0.2, 0.3)
      const hardwareMat = new THREE.MeshStandardMaterial({
        color: 0xffa500,
        metalness: 0.8,
        roughness: 0.3,
      })

      // Electronics layer 1
      const hw1 = new THREE.Mesh(hardwareGeom, hardwareMat.clone())
      hw1.position.set(0.3, 0.4, 0.2)
      hw1.userData.startPos = hw1.position.clone()
      hw1.userData.explosionDir = new THREE.Vector3(0.3, 0.4, 0.2).normalize()
      bomber.add(hw1)

      // Electronics layer 2
      const hw2 = new THREE.Mesh(hardwareGeom, hardwareMat.clone())
      hw2.position.set(-0.5, 0.3, -0.3)
      hw2.userData.startPos = hw2.position.clone()
      hw2.userData.explosionDir = new THREE.Vector3(-0.5, 0.3, -0.3).normalize()
      bomber.add(hw2)

      // Electronics layer 3
      const hw3 = new THREE.Mesh(hardwareGeom, hardwareMat.clone())
      hw3.position.set(0, -0.4, 0.25)
      hw3.userData.startPos = hw3.position.clone()
      hw3.userData.explosionDir = new THREE.Vector3(0, -0.4, 0.25).normalize()
      bomber.add(hw3)

      bomber.position.x = offset
      bomber.userData.startPos = bomber.position.clone()
      return bomber
    }

    const bomber1 = createBomber(-2)
    const bomber2 = createBomber(0)
    const bomber3 = createBomber(2)

    scene.add(bomber1)
    scene.add(bomber2)
    scene.add(bomber3)
    bombersRef.current = [bomber1, bomber2, bomber3]

    // Create particle effect
    const particleCount = 200
    const particleGeom = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const particleMat = new THREE.PointsMaterial({
      color: 0x00ff52,
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particleGeom, particleMat)
    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate bombers
      bombersRef.current?.forEach((bomber) => {
        bomber.rotation.x += 0.003
        bomber.rotation.y += 0.005
      })

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0003
        particlesRef.current.rotation.y += 0.0005
      }

      renderer.render(scene, camera)
    }
    animate()

    // Scroll handler
    const handleScroll = () => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      const viewportHeight = window.innerHeight
      const sectionStart = rect.top
      const containerHeight = containerRef.current?.offsetHeight || 1

      let progress = 0
      if (sectionStart <= 0) {
        progress = Math.min(1, -sectionStart / (containerHeight - viewportHeight))
      }
      progress = Math.max(0, Math.min(1, progress))

      setIsInView(progress > 0 && progress < 1)

      // Apply explosion effect based on scroll
      bombersRef.current?.forEach((bomber) => {
        const children = bomber.children
        children.forEach((child: any) => {
          if (child.userData.startPos) {
            // Move hardware components outward on explosion
            const explosionForce = progress * 5
            child.position.copy(child.userData.startPos)
            child.position.addScaledVector(
              child.userData.explosionDir,
              explosionForce
            )

            // Rotate hardware during explosion
            if (progress > 0.3) {
              child.rotation.x += progress * 0.1
              child.rotation.y += progress * 0.15
              child.rotation.z += progress * 0.08
            }
          }
        })
      })

      // Scale and fade particles
      if (particlesRef.current) {
        particlesRef.current.scale.set(
          1 + progress * 2,
          1 + progress * 2,
          1 + progress * 2
        )
        const material = particlesRef.current.material as THREE.PointsMaterial
        material.opacity = 0.6 * (1 - progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

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
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      {/* Section Header */}
      <div className="mb-4 fade-up d6">
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Forge — 3D Indicator Builder
        </div>
      </div>

      {/* 3D Scene Container */}
      <div
        ref={containerRef}
        className="relative w-full bg-black rounded-lg border border-[var(--border)] mb-7 overflow-hidden"
        style={{
          height: '300vh',
          perspective: '1200px',
        }}
      >
        {/* Text Overlay */}
        <div
          className="fixed left-0 right-0 top-1/2 z-10 -translate-y-1/2 text-center pointer-events-none transition-opacity duration-500"
          style={{
            opacity: isInView ? 1 : 0,
          }}
        >
          <h2 className="font-mono text-3xl md:text-5xl font-black text-[var(--accent)] uppercase tracking-tighter mb-4">
            Forge IDE
          </h2>
          <p className="font-mono text-sm md:text-base text-white max-w-2xl mx-auto leading-relaxed px-4">
            See inside the volume.<br />
            Build indicators that detect institutional footprints
            <br />
            before the market knows.
          </p>
          <div className="mt-6 font-mono text-[10px] text-[var(--accent2)] uppercase tracking-wider">
            ↓ Scroll to initialize hardware layer explosion ↓
          </div>
        </div>

        {/* Corner indicators */}
        <div className="absolute top-8 left-8 z-20 font-mono text-[10px] text-[var(--accent)] opacity-50 tracking-widest pointer-events-none">
          [3D FORGE SYSTEM]
        </div>
        <div className="absolute bottom-8 right-8 z-20 font-mono text-[10px] text-[var(--accent)] opacity-50 tracking-widest pointer-events-none">
          LIVE 3D RENDER
        </div>
      </div>

      {/* Forge IDE Panel */}
      <div className="glass mb-7 fade-up d6">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)]">
          <h3 className="font-mono text-xs text-[var(--accent2)] tracking-[2px]">
            ◆ FORGE
          </h3>
          <div className="flex gap-1">
            {['Visual', 'Pine Script', 'Python', 'MQL5'].map((tab, i) => (
              <span
                key={tab}
                className={`font-mono text-[10px] px-3 py-1.5 rounded cursor-pointer tracking-wider transition-all ${
                  i === 1
                    ? 'bg-[rgba(0,212,255,0.08)] text-[var(--accent2)] border border-[rgba(0,212,255,0.15)]'
                    : 'text-[var(--text-dim)] hover:text-[var(--accent2)]'
                }`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2" style={{ minHeight: 220 }}>
          {/* Editor */}
          <div className="p-4 border-r border-[var(--border)] font-mono text-[11px] leading-[1.8] text-[var(--text-dim)]">
            <div>
              <span className="opacity-25 mr-3 select-none">1</span>
              <span className="italic opacity-35">{'// CVD Divergence + Volume Spike'}</span>
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">2</span>
              <span className="text-[var(--accent2)]">indicator</span>(
              <span className="text-[var(--gold)]">{'"YP CVD Divergence"'}</span>
              , overlay=<span className="text-[var(--accent2)]">true</span>)
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">3</span>
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">4</span>
              <span className="text-[var(--accent)]">cvd</span> ={' '}
              <span className="text-[var(--accent2)]">ta.cum</span>(close {'>'}
              open ? volume : -volume)
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">5</span>
              <span className="text-[var(--accent)]">cvd_sma</span> ={' '}
              <span className="text-[var(--accent2)]">ta.sma</span>(cvd,{' '}
              <span className="text-[var(--gold)]">20</span>)
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">6</span>
              <span className="text-[var(--accent)]">vol_spike</span> = volume{' '}
              {'>'} <span className="text-[var(--accent2)]">ta.sma</span>(volume,{' '}
              <span className="text-[var(--gold)]">20</span>) *{' '}
              <span className="text-[var(--gold)]">2.0</span>
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">7</span>
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">8</span>
              <span className="italic opacity-35">
                {'// Bearish divergence detection'}
              </span>
            </div>
            <div>
              <span className="opacity-25 mr-3 select-none">9</span>
              <span className="text-[var(--accent)]">div_bear</span> ={' '}
              <span className="text-[var(--accent2)]">ta.rising</span>(close,{' '}
              <span className="text-[var(--gold)]">5</span>)
              <span className="text-[var(--accent2)]"> and </span>
              <span className="text-[var(--accent2)]">ta.falling</span>(cvd,{' '}
              <span className="text-[var(--gold)]">5</span>)
            </div>
          </div>
          {/* Preview */}
          <div className="p-4 flex flex-col gap-2.5">
            <div
              className="flex-1 bg-[rgba(0,0,0,0.4)] border border-[var(--border)] rounded-lg relative overflow-hidden"
              style={{ minHeight: 170 }}
            >
              <svg
                viewBox="0 0 400 160"
                fill="none"
                className="absolute bottom-[10%] left-[5%] w-[90%] h-[70%]"
              >
                <defs>
                  <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff52" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#00ff52" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,130 L25,118 L50,105 L75,95 L100,100 L125,82 L150,72 L175,78 L200,60 L225,48 L250,55 L275,38 L300,42 L325,28 L350,32 L375,18 L400,22"
                  stroke="#00ff52"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M0,130 L25,118 L50,105 L75,95 L100,100 L125,82 L150,72 L175,78 L200,60 L225,48 L250,55 L275,38 L300,42 L325,28 L350,32 L375,18 L400,22 L400,160 L0,160Z"
                  fill="url(#cg)"
                />
                <polygon points="279,30 275,22 283,22" fill="#ff3355" />
                <text x="287" y="26" fill="#ff3355" fontSize="8" fontFamily="JetBrains Mono">
                  DIV
                </text>
              </svg>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                defaultValue="Create a CVD divergence alert with volume spike confirmation"
                readOnly
                className="flex-1 bg-[rgba(0,0,0,0.3)] border border-[var(--border)] rounded-md px-3.5 py-2 font-mono text-[10px] text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
              />
              <button className="bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] border-none rounded-md px-3.5 py-2 text-[10px] font-bold text-[var(--bg)] cursor-pointer font-sans whitespace-nowrap hover:shadow-[0_0_20px_rgba(0,255,80,0.3)] transition-shadow">
                ⚡ Generate
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
