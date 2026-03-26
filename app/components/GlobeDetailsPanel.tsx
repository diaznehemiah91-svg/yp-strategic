'use client'

import React, { useState, useEffect } from 'react'

interface DetailsPanelProps {
  type: 'ticker' | 'hotspot' | 'none'
  data?: any
}

export default function GlobeDetailsPanel({ type, data }: DetailsPanelProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(type !== 'none')
  }, [type])

  if (!visible || !data) return null

  if (type === 'ticker') {
    const changeIsPositive = !data.change.startsWith('-')
    const changeColor = changeIsPositive ? '#00ff52' : '#ff3366'

    return (
      <div
        className="fixed bottom-8 right-8 z-50 p-6 rounded-lg bg-[#000814] border-2"
        style={{ borderColor: data.color }}
      >
        <div className="text-sm font-mono text-[#888] mb-2">STOCK SIGNAL</div>
        <div className="text-3xl font-bold mb-2" style={{ color: data.color }}>
          {data.ticker}
        </div>
        <div className="text-2xl font-bold mb-1">{data.price}</div>
        <div className="text-lg font-mono mb-4" style={{ color: changeColor }}>
          {data.change}
        </div>

        <div className="border-t border-[#333] pt-3 mt-3">
          <div className="text-xs text-[#666] mb-3">
            Position: {data.lat.toFixed(1)}°, {data.lng.toFixed(1)}°
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-full px-4 py-2 rounded font-mono text-xs bg-[#00ff52] text-[#000814] hover:bg-[#00dd42] transition"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    )
  }

  if (type === 'hotspot') {
    const severityColor =
      data.severity > 7 ? '#ff3366' : data.severity > 5 ? '#ff6622' : '#ffcc00'

    return (
      <div
        className="fixed bottom-8 right-8 z-50 p-6 rounded-lg bg-[#000814] border-2"
        style={{ borderColor: severityColor }}
      >
        <div className="text-sm font-mono text-[#888] mb-2">GEO RISK</div>
        <div className="text-2xl font-bold mb-2" style={{ color: severityColor }}>
          {data.label}
        </div>
        <div className="text-xs text-[#666] mb-3">Severity Level: {data.severity}/10</div>

        <div className="w-32 h-2 bg-[#222] rounded-full mb-3 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${(data.severity / 10) * 100}%`,
              backgroundColor: severityColor,
            }}
          />
        </div>

        <div className="border-t border-[#333] pt-3 mt-3">
          <div className="text-xs text-[#666] mb-3">
            Position: {data.lat.toFixed(1)}°, {data.lng.toFixed(1)}°
          </div>
          <button
            onClick={() => setVisible(false)}
            className="w-full px-4 py-2 rounded font-mono text-xs bg-[#00ff52] text-[#000814] hover:bg-[#00dd42] transition"
          >
            Close [ESC]
          </button>
        </div>
      </div>
    )
  }

  return null
}
