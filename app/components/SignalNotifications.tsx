'use client'

import React, { useState, useEffect, useCallback } from 'react'

export interface Signal {
  id: string
  type: 'price_alert' | 'market_signal' | 'geopolitical' | 'technical'
  title: string
  message: string
  ticker?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  timestamp: number
}

interface NotificationProps {
  signals: Signal[]
  onDismiss: (id: string) => void
}

function Notification({ signal, onDismiss }: { signal: Signal; onDismiss: () => void }) {
  const severityColors = {
    low: '#00ff52',
    medium: '#00d4ff',
    high: '#ff6622',
    critical: '#ff3366',
  }

  const severityBgColors = {
    low: 'rgba(0, 255, 82, 0.1)',
    medium: 'rgba(0, 212, 255, 0.1)',
    high: 'rgba(255, 102, 34, 0.1)',
    critical: 'rgba(255, 51, 102, 0.1)',
  }

  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const typeEmoji = {
    price_alert: '💰',
    market_signal: '📊',
    geopolitical: '⚠️',
    technical: '📈',
  }

  return (
    <div
      className="mb-3 p-4 rounded-lg border-2 overflow-hidden transition-all duration-300"
      style={{
        borderColor: severityColors[signal.severity],
        backgroundColor: severityBgColors[signal.severity],
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{typeEmoji[signal.type]}</span>
            <div className="text-sm font-mono font-bold" style={{ color: severityColors[signal.severity] }}>
              {signal.title}
            </div>
            {signal.ticker && (
              <div
                className="text-xs px-2 py-0.5 rounded font-mono"
                style={{
                  color: '#000814',
                  backgroundColor: severityColors[signal.severity],
                }}
              >
                {signal.ticker}
              </div>
            )}
          </div>
          <div className="text-xs text-[#aaa]">{signal.message}</div>
          <div className="text-[10px] text-[#666] mt-2">
            {new Date(signal.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="ml-3 text-[#666] hover:text-[#fff] text-xs font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

export default function SignalNotifications() {
  const [signals, setSignals] = useState<Signal[]>([])

  // Simulate incoming signals (in production, this would connect to WebSocket or polling)
  useEffect(() => {
    const mockSignals: Signal[] = [
      {
        id: '1',
        type: 'price_alert',
        title: 'BUY ZONE ACTIVATED',
        message: 'LMT entered buying level zone',
        ticker: 'LMT',
        severity: 'high',
        timestamp: Date.now() - 2000,
      },
      {
        id: '2',
        type: 'market_signal',
        title: 'SECTOR STRENGTH',
        message: 'Defence contractors showing +2.3% momentum',
        severity: 'medium',
        timestamp: Date.now() - 5000,
      },
      {
        id: '3',
        type: 'geopolitical',
        title: 'GEO RISK UPDATE',
        message: 'Taiwan Strait severity increased to 9/10',
        severity: 'critical',
        timestamp: Date.now() - 8000,
      },
    ]

    // Only show signals that are recent (within last 15 seconds)
    const recentSignals = mockSignals.filter((s) => Date.now() - s.timestamp < 15000)
    setSignals(recentSignals)

    // Simulate new signals arriving every 30 seconds
    const interval = setInterval(() => {
      const newSignal: Signal = {
        id: Date.now().toString(),
        type: ['price_alert', 'market_signal', 'geopolitical', 'technical'][
          Math.floor(Math.random() * 4)
        ] as Signal['type'],
        title: ['SIGNAL', 'ALERT', 'UPDATE', 'OPPORTUNITY'][Math.floor(Math.random() * 4)],
        message: 'Real-time market data streaming...',
        ticker: ['LMT', 'RTX', 'PLTR', 'NVDA', 'CRWD'][Math.floor(Math.random() * 5)],
        severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as Signal['severity'],
        timestamp: Date.now(),
      }
      setSignals((prev) => [newSignal, ...prev.slice(0, 4)])
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleDismiss = useCallback((id: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return (
    <div className="fixed top-8 right-8 w-[400px] max-h-[600px] overflow-y-auto z-40 pointer-events-auto">
      <div className="flex items-center gap-2 mb-3 px-2">
        <div className="w-2 h-2 bg-[#00ff52] rounded-full animate-pulse" />
        <div className="text-xs font-mono text-[#00ff52] tracking-wider">LIVE SIGNALS</div>
      </div>
      <div>
        {signals.length === 0 ? (
          <div className="text-xs text-[#666] text-center py-4 font-mono">
            Waiting for signals...
          </div>
        ) : (
          signals.map((signal) => (
            <Notification
              key={signal.id}
              signal={signal}
              onDismiss={() => handleDismiss(signal.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
