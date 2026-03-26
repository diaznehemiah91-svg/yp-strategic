'use client'
import React, { useState } from 'react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'password' | 'payment'>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone }),
      })
      if (res.ok) setStep('payment')
      else setError('Sign up failed')
    } catch {
      setError('Error signing up')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/billing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userId: email }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setError('Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md px-6 py-8 bg-black border border-[rgba(0,255,80,0.3)] rounded-lg shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-[var(--accent)]">✕</button>

        {step === 'email' && (
          <form onSubmit={(e) => { e.preventDefault(); setStep('password') }}>
            <h2 className="text-lg font-bold text-[var(--accent)] mb-6 font-mono tracking-wide">[ INITIALIZE ACCESS ]</h2>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 bg-transparent border-b border-[var(--accent)] text-[var(--text-bright)] font-mono mb-4" placeholder="your@email.com" required />
            <button type="submit" className="w-full px-4 py-2 bg-[var(--accent)] text-black font-mono font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,80,0.5)]">NEXT →</button>
          </form>
        )}

        {step === 'password' && (
          <form onSubmit={(e) => { e.preventDefault(); handleSignUp(e) }}>
            <h2 className="text-lg font-bold text-[var(--accent)] mb-6 font-mono tracking-wide">[ SET PASSWORD ]</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-transparent border-b border-[var(--accent)] text-[var(--text-bright)] font-mono mb-4" minLength={12} placeholder="••••••••••••" required />
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 bg-transparent border-b border-[var(--accent)] text-[var(--text-bright)] font-mono mb-4" placeholder="+1 (555) 000-0000" />
            {error && <div className="text-red-500 text-xs font-mono mb-4">{error}</div>}
            <button type="submit" disabled={loading || password.length < 12} className="w-full px-4 py-2 bg-[var(--accent)] text-black font-mono font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,80,0.5)]">{loading ? 'PROCESSING...' : 'PROCEED TO PAYMENT →'}</button>
          </form>
        )}

        {step === 'payment' && (
          <div>
            <h2 className="text-lg font-bold text-[var(--accent)] mb-6 font-mono tracking-wide">[ CONFIRM PAYMENT ]</h2>
            <div className="bg-[rgba(0,255,80,0.05)] border border-[var(--accent)] rounded p-4 mb-6 font-mono text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-[var(--text-dim)]">Intel Vault Premium</span>
                <span className="text-[var(--accent)] font-bold">$29.00</span>
              </div>
              <div className="text-xs text-[var(--text-dim)]">Billed monthly. Cancel anytime.</div>
            </div>
            {error && <div className="text-red-500 text-xs font-mono mb-4">{error}</div>}
            <button onClick={handlePayment} disabled={loading} className="w-full px-4 py-2 bg-[var(--accent)] text-black font-mono font-bold text-sm hover:shadow-[0_0_20px_rgba(0,255,80,0.5)]">{loading ? 'REDIRECTING...' : '[ ARM PAYMENT ] →'}</button>
          </div>
        )}
      </div>
    </div>
  )
}
