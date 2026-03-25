'use client'

import React, { useEffect, useState } from 'react'

interface NewsItem {
  id: string
  source: string
  title: string
  description?: string
  severity: 'critical' | 'high' | 'low'
  time: string
  category: string
  url?: string
  image?: string
  coordinates?: {
    lat: number
    lng: number
    region: string
  }
}

export default function NewsGlobe() {
  const [newsData, setNewsData] = useState<NewsItem[]>([])
  const [currentFilter, setCurrentFilter] = useState<'all' | 'critical' | 'high' | 'low'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (response.ok) {
        const data = await response.json()
        console.log('[NEWS] Fetched articles:', data.length)
        setNewsData(data.length > 0 ? data : getMockNewsData())
      } else {
        console.warn('[NEWS] API returned non-ok status, using mock data')
        setNewsData(getMockNewsData())
      }
    } catch (error) {
      console.warn('[NEWS] Fetch failed, using mock data:', error)
      setNewsData(getMockNewsData())
    } finally {
      setLoading(false)
    }
  }

  const getMockNewsData = (): NewsItem[] => [
    {
      id: '1',
      source: 'NEXTA',
      title: 'Critical geopolitical event detected in Eastern Europe',
      severity: 'critical',
      time: '2m ago',
      category: 'GEOPOLITICS',
      coordinates: { lat: 51.5074, lng: -0.1278, region: 'Europe' }
    },
    {
      id: '2',
      source: 'Bloomberg',
      title: 'Global defence spending increases amid tensions',
      severity: 'high',
      time: '15m ago',
      category: 'DEFENCE',
      coordinates: { lat: 40.7128, lng: -74.006, region: 'North America' }
    },
    {
      id: '3',
      source: 'Reuters',
      title: 'Regional stability concerns emerge',
      severity: 'high',
      time: '32m ago',
      category: 'GEOPOLITICS',
      coordinates: { lat: 35.6762, lng: 139.6503, region: 'Asia' }
    },
  ]

  const filteredNews = currentFilter === 'all'
    ? newsData
    : newsData.filter(item => item.severity === currentFilter)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-[rgba(255,50,50,0.1)] border-l-[var(--accent3)] text-[var(--accent3)]'
      case 'high':
        return 'bg-[rgba(255,165,0,0.1)] border-l-[var(--gold)] text-[var(--gold)]'
      case 'low':
        return 'bg-[rgba(0,200,150,0.1)] border-l-[var(--accent)] text-[var(--accent)]'
      default:
        return 'bg-[rgba(0,255,200,0.05)] border-l-[var(--accent)]'
    }
  }

  return (
    <div className="w-full bg-gradient-to-br from-[rgba(10,14,39,0.8)] via-black to-[rgba(10,14,39,0.6)] border border-[var(--border)] rounded-lg overflow-hidden mb-8 fade-up d6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[rgba(0,255,200,0.1)] to-transparent p-6 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-white uppercase tracking-tighter">🌐 Global News Intelligence</h2>
          <span className="text-[10px] text-[var(--text-dim)] font-mono">{newsData.length} articles</span>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'critical', 'high', 'low'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-widest transition-all border ${
                currentFilter === filter
                  ? 'bg-[rgba(0,255,200,0.2)] border-[var(--accent)] text-[var(--accent)]'
                  : 'bg-transparent border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {filter === 'all' ? '📊 All Events' : `${filter === 'critical' ? '🔴' : filter === 'high' ? '🟠' : '🟢'} ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-dim)]">
            <p className="animate-pulse">Loading intelligence feed...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-dim)]">
            <p>No articles in this category</p>
          </div>
        ) : (
          filteredNews.map((article) => (
            <a
              key={article.id}
              href={article.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`block p-4 border-b border-[var(--border)] border-l-4 transition-all hover:bg-[rgba(0,255,200,0.05)] cursor-pointer ${getSeverityColor(article.severity)}`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] bg-[rgba(0,255,200,0.2)] text-[var(--accent)] px-2 py-1 rounded font-bold">
                      {article.source}
                    </span>
                    <span className="text-[9px] text-[var(--text-dim)]">{article.time}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 leading-tight">
                    {article.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-[9px] bg-[rgba(0,255,200,0.1)] text-[var(--text-dim)] px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    {article.coordinates && (
                      <span className="text-[9px] text-[var(--text-dim)]">
                        📍 {article.coordinates.region}
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-1 rounded whitespace-nowrap ${getSeverityColor(article.severity).split(' ')[0]}`}>
                  {article.severity.toUpperCase()}
                </span>
              </div>
            </a>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-[rgba(0,0,0,0.3)] border-t border-[var(--border)] text-[9px] text-[var(--text-dim)] text-center">
        <p>Real-time data from 40K+ news sources • Updates every 5 minutes</p>
        <p className="mt-1">Click articles to read full intelligence • Powered by NewsAPI</p>
      </div>
    </div>
  )
}
