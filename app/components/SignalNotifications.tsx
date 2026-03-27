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

function Notification({ signal, onDismiss }: { signal: Signal; onDismiss: () => void }) {
  const severityColors = {
    low: '#00ff52',
    medium: '#00d4ff',
    high: '#ff6622',
    critical: '#ff3366',
  }

  useEffect(() => {
    const timer = setTimeout(onDismiss, 8000)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const color = severityColors[signal.severity]
  return (
    <div style={{ borderColor: color, backgroundColor: color + '1a', border: '2px solid', borderRadius: 8, marginBottom: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ color, fontFamily: 'monospace', fontWeight: 'bold', fontSize: 12 }}>{signal.title}</span>
            {signal.ticker && (
              <span style={{ color: '#000', backgroundColor: color, padding: '2px 6px', borderRadius: 4, fontSize: 10, fontFamily: 'monospace' }}>{signal.ticker}</span>
            )}
          </div>
          <div style={{ color: '#aaa', fontSize: 11 }}>{signal.message}</div>
          <div style={{ color: '#666', fontSize: 10, marginTop: 8 }}>{new Date(signal.timestamp).toLocaleTimeString()}</div>
        </div>
        <button onClick={onDismiss} style={{ marginLeft: 12, color: '#666', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>X</button>
      </div>
    </div>
  )
}

export default function SignalNotifications() {
  const [signals, setSignals] = useState<Signal[]>([])

  useEffect(() => {
    const mockSignals: Signal[] = [
      { id: '1', type: 'price_alert', title: 'BUY ZONE ACTIVATED', message: 'LMT entered buying level zone', ticker: 'LMT', severity: 'high', timestamp: Date.now() - 2000 },
      { id: '2', type: 'market_signal', title: 'SECTOR STRENGTH', message: 'Defence contractors showing +2.3% momentum', severity: 'medium', timestamp: Date.now() - 5000 },
      { id: '3', type: 'geopolitical', title: 'GEO RISK UPDATE', message: 'Taiwan Strait severity increased to 9/10', severity: 'critical', timestamp: Date.now() - 8000 },
    ]
    setSignals(mockSignals.filter((s) => Date.now() - s.timestamp < 15000))

    const interval = setInterval(() => {
      const types: Signal['type'][] = ['price_alert', 'market_signal', 'geopolitical', 'technical']
      const severities: Signal['severity'][] = ['low', 'medium', 'high', 'critical']
      const newSignal: Signal = {
        id: Date.now().toString(),
        type: types[Math.floor(Math.random() * 4)],
        title: ['SIGNAL', 'ALERT', 'UPDATE', 'OPPORTUNITY'][Math.floor(Math.random() * 4)],
        message: 'Real-time market data streaming...',
        ticker: ['LMT', 'RTX', 'PLTR', 'NVDA', 'CRWD'][Math.floor(Math.random() * 5)],
        severity: severities[Math.floor(Math.random() * 4)],
        timestamp: Date.now(),
      }
      setSignals((prev) => [newSignal, ...prev.slice(0, 4)])
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleDismiss = useCallback((id: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== id))
  }, [])

  if (signals.length === 0) return null

  return (
    <div style={{ position: 'fixed', top: 32, right: 32, width: 400, maxHeight: 600, overflowY: 'auto', zIndex: 40, pointerEvents: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 8, height: 8, backgroundColor: '#00ff52', borderRadius: '50%' }} />
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: '#00ff52', letterSpacing: '0.1em' }}>LIVE SIGNALS</div>
      </div>
      <div>
        {signals.map((signal) => (
          <Notification key={signal.id} signal={signal} onDismiss={() => handleDismiss(signal.id)} />
        ))}
      </div>
    </div>
  )
}
