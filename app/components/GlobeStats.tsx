'use client'

import React, { useState, useEffect } from 'react'

interface StatsData {
  activeStocks: number
  activeHotspots: number
  avgSeverity: number
  volumeMultiplier: number
  latency: number
  dataFresh: boolean
  topGainer?: { ticker: string; change: number }
  topLoser?: { ticker: string; change: number }
}

export default function GlobeStats() {
  const [stats, setStats] = useState<StatsData>({
    activeStocks: 8,
    activeHotspots: 5,
    avgSeverity: 6.8,
    volumeMultiplier: 2.34,
    latency: 47,
    dataFresh: true,
    topGainer: { ticker: 'OKLO', change: 5.44 },
    topLoser: { ticker: 'NVDA', change: -0.84 },
  })

  useEffect(() => {
    // Simulate live stat updates
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        latency: Math.max(12, Math.floor(Math.random() * 150)),
        dataFresh: Math.random() > 0.1,
        volumeMultiplier: (Math.random() * 3 + 1).toFixed(2) as unknown as number,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed bottom-8 left-8 z-40 text-xs font-mono">
      <div className="bg-[#000814] border border-[#00d4ff] rounded-lg p-4 w-80">
        <div className="flex items-center gap-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${stats.dataFresh ? 'bg-[#00ff52]' : 'bg-[#ff6622]'} animate-pulse`} />
          <div className="text-[#00d4ff]">GLOBE INTEL STATUS</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3 pb-3 border-b border-[#333]">
          {/* Active Stocks */}
          <div className="p-2 rounded bg-[#0a2540] border border-[#00ff52]">
            <div className="text-[#00ff52] font-bold">{stats.activeStocks}</div>
            <div className="text-[#666] text-[10px]">ACTIVE STOCKS</div>
          </div>

          {/* Hotspots */}
          <div className="p-2 rounded bg-[#2a0a0a] border border-[#ff3366]">
            <div className="text-[#ff3366] font-bold">{stats.activeHotspots}</div>
            <div className="text-[#666] text-[10px]">GEO HOTSPOTS</div>
          </div>

          {/* Avg Severity */}
          <div className="p-2 rounded bg-[#1a1a0a] border border-[#ffcc00]">
            <div className="text-[#ffcc00] font-bold">{stats.avgSeverity.toFixed(1)}/10</div>
            <div className="text-[#666] text-[10px]">AVG SEVERITY</div>
          </div>

          {/* Volume */}
          <div className="p-2 rounded bg-[#0a1a2a] border border-[#00d4ff]">
            <div className="text-[#00d4ff] font-bold">{stats.volumeMultiplier}x</div>
            <div className="text-[#666] text-[10px]">VOLUME MULT</div>
          </div>
        </div>

        {/* Performance */}
        <div className="mb-3 pb-3 border-b border-[#333]">
          <div className="text-[#666] text-[10px] mb-2">PRICE ACTION</div>
          <div className="flex gap-2">
            {stats.topGainer && (
              <div className="flex-1 p-2 rounded bg-[#0a2540] border border-[#00ff52]">
                <div className="text-[#00ff52] font-bold text-xs">{stats.topGainer.ticker}</div>
                <div className="text-[#00ff52] text-[10px]">+{stats.topGainer.change}%</div>
              </div>
            )}
            {stats.topLoser && (
              <div className="flex-1 p-2 rounded bg-[#2a0a0a] border border-[#ff3366]">
                <div className="text-[#ff3366] font-bold text-xs">{stats.topLoser.ticker}</div>
                <div className="text-[#ff3366] text-[10px]">{stats.topLoser.change}%</div>
              </div>
            )}
          </div>
        </div>

        {/* API Status */}
        <div className="flex justify-between items-center">
          <div className="text-[#666]">LATENCY</div>
          <div className="text-[#00d4ff]">{stats.latency}ms</div>
        </div>
      </div>
    </div>
  )
}
