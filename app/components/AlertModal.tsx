'use client'
import React, { useState } from 'react'

interface Company {
  ticker: string
  price: number
}

interface AlertModalProps {
  isOpen: boolean
  onClose: () => void
  company: Company
}

export default function AlertModal({ isOpen, onClose, company }: AlertModalProps) {
  const [targetPrice, setTargetPrice] = useState(company.price.toString())
  const [smsEnabled, setSmsEnabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  if (!isOpen) return null

  const handleArmSignal = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/alerts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticker: company.ticker,
          target_price: parseFloat(targetPrice),
          sms_enabled: smsEnabled,
        }),
      })

      if (res.ok) {
        setMessage('✓ Signal armed')
        setTimeout(() => onClose(), 1500)
      } else {
        setMessage('Failed to arm signal')
      }
    } catch {
      setMessage('Error setting alert')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md px-6 py-8 bg-black border border-[var(--accent)] rounded-lg">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--accent)]">✕</button>

        <h2 className="text-lg font-bold text-[var(--accent)] mb-6 font-mono tracking-wide">[ {company.ticker} BUYING LEVEL ZONE ]</h2>

        <form onSubmit={handleArmSignal}>
          <div className="mb-4">
            <label className="block text-xs text-[var(--text-dim)] font-mono mb-2">CURRENT PRICE</label>
            <div className="text-sm font-mono text-[var(--text-bright)]">${company.price.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-[var(--text-dim)] font-mono mb-2">TARGET PRICE</label>
            <input
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="w-full px-3 py-2 bg-transparent border-b border-[var(--accent)] text-[var(--text-bright)] font-mono focus:outline-none"
              placeholder="0.00"
              required
            />
          </div>

          <div className="mb-6 flex items-center gap-3">
            <input
              type="checkbox"
              id="smsToggle"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="w-4 h-4 cursor-pointer"
            />
            <label htmlFor="smsToggle" className="text-xs font-mono text-[var(--text-dim)] cursor-pointer">
              Enable SMS notifications
            </label>
          </div>

          {message && (
            <div className={`text-xs font-mono mb-4 ${message.includes('✓') ? 'text-green-400' : 'text-red-400'}`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-[var(--accent)] text-black font-mono font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,80,0.5)] disabled:opacity-50"
          >
            {loading ? 'ARMING...' : '[ ARM SIGNAL ]'}
          </button>
        </form>
      </div>
    </div>
  )
}
