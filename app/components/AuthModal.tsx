'use client'

import { useState } from 'react'
import { registerUser } from '@/app/actions/auth'
import { ShieldAlert, X } from 'lucide-react'

export default function AuthModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle')
  const [email, setEmail] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (formData: FormData) => {
    setStatus('loading')
    try {
      await registerUser(formData)
      setStatus('success')
      setTimeout(() => {
        setEmail('')
        setStatus('idle')
        onClose()
      }, 2000)
    } catch (error) {
      setStatus('idle')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="border border-[var(--border)] bg-[var(--surface)] p-8 max-w-md w-full relative shadow-[0_0_60px_rgba(0,255,80,0.1)]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <ShieldAlert className="mx-auto text-[var(--accent)] mb-2 animate-pulse" size={40} />
          <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Initialize Access</h2>
          <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mt-2">Free Intelligence Tier Registration</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER_OPERATOR_EMAIL"
            required
            className="w-full bg-black border border-[var(--border)] p-4 text-[var(--accent)] font-mono text-sm placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] outline-none transition-all"
          />

          <button
            type="submit"
            disabled={status !== 'idle'}
            className="w-full bg-[var(--accent)] text-black py-4 font-black uppercase text-xs hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? 'AUTHORIZING...' : status === 'success' ? 'ACCESS GRANTED' : 'REQUEST TERMINAL ACCESS'}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-center text-[10px] text-[var(--accent)] animate-bounce">
            CHECK YOUR INBOX FOR VERIFICATION SIGNAL.
          </p>
        )}

        <p className="text-[8px] text-[var(--text-dim)] mt-6 text-center uppercase leading-tight">
          By registering, you agree to receive real-time signal alerts and deep-tech briefings.
        </p>
      </div>
    </div>
  )
}
