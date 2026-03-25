'use client'

import React, { useEffect, useRef, useState } from 'react'

export default function ForgeVideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleScroll = () => {
      const container = containerRef.current
      const sticky = stickyRef.current
      if (!container) return

      // Get the position of the container relative to the viewport
      const rect = container.getBoundingClientRect()
      const containerHeight = container.offsetHeight
      const viewportHeight = window.innerHeight

      // Calculate scroll progress within this section (0 to 1)
      // Progress starts when section top enters viewport
      // Progress ends when section bottom leaves viewport
      const sectionStart = rect.top
      const sectionEnd = rect.bottom - viewportHeight

      let progress = 0
      if (sectionStart <= 0) {
        // Section is in or past viewport
        progress = Math.min(1, -sectionStart / (containerHeight - viewportHeight))
      }

      // Clamp progress between 0 and 1
      progress = Math.max(0, Math.min(1, progress))

      // Update video currentTime based on scroll progress
      if (video.duration) {
        video.currentTime = progress * video.duration
      }

      // Show/hide based on view
      setIsInView(progress > 0 && progress < 1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Section Header */}
      <div className="mb-4 fade-up d6">
        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[var(--accent)] flex items-center gap-2">
          <span className="w-6 h-px bg-[var(--accent)]" />◆ Forge — Visual Indicator Builder
        </div>
      </div>

      {/* Scroll Container - 300vh tall to allow long scroll duration */}
      <div
        ref={containerRef}
        className="relative bg-black"
        style={{ height: '300vh' }}
      >
        {/* Sticky Video Container - stays on screen as user scrolls */}
        <div
          ref={stickyRef}
          className="sticky top-0 w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Video - plays/scrubs with scroll */}
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            preload="metadata"
            playsInline
            muted
          >
            {/* Replace this URL with your actual Kling 3.0 video */}
            <source
              src="https://media.example.com/stealth-bomber-explosion.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>

          {/* Overlay - black gradient to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70" />

          {/* Text Overlay - fades in as video plays */}
          <div
            className="absolute bottom-12 left-0 right-0 px-8 text-center z-10 transition-opacity duration-500"
            style={{
              opacity: isInView ? 1 : 0,
            }}
          >
            <h2 className="font-mono text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">
              Forge IDE
            </h2>
            <p className="font-mono text-sm md:text-base text-[var(--accent)] max-w-2xl mx-auto leading-relaxed">
              See inside the volume.<br />
              Build indicators that detect institutional footprints
              <br />
              before the market knows.
            </p>
          </div>

          {/* Corner accent - technical aesthetic */}
          <div className="absolute top-8 left-8 font-mono text-[10px] text-[var(--accent)] opacity-50 tracking-widest">
            [FORGE SYSTEM ACTIVE]
          </div>
          <div className="absolute bottom-8 right-8 font-mono text-[10px] text-[var(--accent)] opacity-50 tracking-widest">
            SCROLL TO INITIALIZE →
          </div>
        </div>
      </div>

      {/* Forge IDE Panel - appears after scroll effect */}
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
