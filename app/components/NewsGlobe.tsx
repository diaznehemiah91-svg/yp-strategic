'use client'

import React, { useEffect, useRef, useState } from 'react'

interface NewsItem {
  id: number
  source: string
  title: string
  severity: 'critical' | 'high' | 'low'
  time: string
  category: string
  coordinates?: {
    lat: number
    lng: number
  }
}

export default function NewsGlobe() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [currentFilter, setCurrentFilter] = useState<'all' | 'critical' | 'high' | 'low'>('all')
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    fetchNewsFromGlint()
    const interval = setInterval(fetchNewsFromGlint, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchNewsFromGlint = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        setNewsData(data.length > 0 ? data : getMockNewsData())
      } else {
        setNewsData(getMockNewsData())
      }
    } catch (error) {
      console.warn('Could not fetch news, using mock data:', error)
      setNewsData(getMockNewsData())
    }
  }

  const getMockNewsData = (): NewsItem[] => [
    {
      id: 1,
      source: 'NEXTA',
      title: 'Critical geopolitical event detected in Eastern Europe',
      severity: 'critical',
      time: '2m ago',
      category: 'GEOPOLITICS',
      coordinates: { lat: 51.5074, lng: -0.1278 }
    },
    {
      id: 2,
      source: 'Bloomberg',
      title: 'Global defence spending increases amid tensions',
      severity: 'high',
      time: '15m ago',
      category: 'DEFENCE',
      coordinates: { lat: 40.7128, lng: -74.006 }
    },
    {
      id: 3,
      source: 'Reuters',
      title: 'Regional stability concerns emerge',
      severity: 'high',
      time: '32m ago',
      category: 'GEOPOLITICS',
      coordinates: { lat: 35.6762, lng: 139.6503 }
    },
    {
      id: 4,
      source: 'AP News',
      title: 'Market recovery continues in tech sector',
      severity: 'low',
      time: '1h ago',
      category: 'BUSINESS',
      coordinates: { lat: -33.8688, lng: 151.2093 }
    },
    {
      id: 5,
      source: 'FT',
      title: 'AI defence systems development accelerates',
      severity: 'high',
      time: '1h 23m ago',
      category: 'AI/TECH',
      coordinates: { lat: 48.8566, lng: 2.3522 }
    },
  ]

  const filteredNews = currentFilter === 'all'
    ? newsData
    : newsData.filter(item => item.severity === currentFilter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-[#ff3232] border-[#ff3232] bg-[rgba(255,50,50,0.1)]'
      case 'high':
        return 'text-[#ffa500] border-[#ffa500] bg-[rgba(255,165,0,0.1)]'
      case 'low':
        return 'text-[#00c896] border-[#00c896] bg-[rgba(0,200,150,0.1)]'
      default:
        return 'text-[var(--text-dim)]'
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-black via-[rgba(10,14,39,0.8)] to-black border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-8">
        {/* Globe Area */}
        <div className="lg:col-span-2 h-[500px] relative rounded-lg border border-[var(--border)] bg-gradient-to-br from-[rgba(0,50,40,0.3)] to-[rgba(10,14,39,0.5)] overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🌍</div>
              <p className="text-[var(--text-dim)] text-sm">3D Globe Visualization</p>
              <p className="text-[10px] text-[var(--text-dim)] mt-2">
                {newsData.length} Global Events Tracked
              </p>
            </div>
          </div>

          {/* Globe Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className="w-10 h-10 bg-[rgba(0,255,200,0.1)] border border-[var(--accent2)] rounded hover:bg-[rgba(0,255,200,0.2)] flex items-center justify-center text-[var(--accent2)] transition-all"
              title="Toggle Auto Rotate"
            >
              ⟲
            </button>
            <button className="w-10 h-10 bg-[rgba(0,255,200,0.1)] border border-[var(--accent2)] rounded hover:bg-[rgba(0,255,200,0.2)] flex items-center justify-center text-[var(--accent2)] transition-all">
              +
            </button>
            <button className="w-10 h-10 bg-[rgba(0,255,200,0.1)] border border-[var(--accent2)] rounded hover:bg-[rgba(0,255,200,0.2)] flex items-center justify-center text-[var(--accent2)] transition-all">
              −
            </button>
          </div>

          {/* Stats */}
          <div className="absolute bottom-4 left-4 flex gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-[var(--accent2)] uppercase tracking-widest opacity-70">Live Events</span>
              <span className="text-2xl font-bold text-[var(--accent2)] font-mono">{newsData.length}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] text-[var(--accent2)] uppercase tracking-widest opacity-70">Sources</span>
              <span className="text-2xl font-bold text-[var(--accent2)] font-mono">12+</span>
            </div>
          </div>
        </div>

        {/* News Feed */}
        <div className="lg:col-span-3 h-[500px] flex flex-col border border-[var(--border)] rounded-lg bg-[rgba(10,14,39,0.3)] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] bg-gradient-to-r from-[rgba(0,255,200,0.1)] to-transparent">
            <h3 className="text-[var(--accent2)] font-bold text-sm uppercase tracking-widest mb-4">
              🌐 Global News Feed
            </h3>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'critical', 'high', 'low'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCurrentFilter(filter)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest transition-all border ${
                    currentFilter === filter
                      ? 'bg-[rgba(0,255,200,0.2)] border-[var(--accent2)] text-[var(--accent2)]'
                      : 'bg-transparent border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent2)] hover:text-[var(--accent2)]'
                  }`}
                >
                  {filter === 'all' ? 'All Events' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
                </button>
              ))}
            </div>
          </div>

          {/* News Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredNews.length > 0 ? (
              filteredNews.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-b border-[var(--border)] hover:bg-[rgba(0,255,200,0.05)] transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[rgba(0,255,200,0.2)] text-[var(--accent2)] px-2 py-1 rounded font-bold">
                        {item.source}
                      </span>
                      <span className="text-[11px] text-[var(--text-dim)]">{item.time}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${getSeverityColor(item.severity)} uppercase`}>
                      {item.severity}
                    </span>
                  </div>

                  <h4 className="text-sm text-white mb-2 font-semibold group-hover:text-[var(--accent2)] transition-colors">
                    {item.title}
                  </h4>

                  <div className="flex gap-3 text-[10px] text-[var(--text-dim)]">
                    <span className="bg-[rgba(0,255,200,0.1)] px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--text-dim)] text-sm">
                No news items in this category
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[rgba(0,0,0,0.3)] text-[9px] text-[var(--text-dim)] text-center">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}
