'use client'

import { useState } from 'react'
import { Zap, Terminal, Copy } from 'lucide-react'

export default function ForgeMonster() {
  const [prompt, setPrompt] = useState('')
  const [script, setScript] = useState('// INITIALIZE FORGE TO GENERATE SCRIPT...')
  const [loading, setLoading] = useState(false)

  const handleForge = async () => {
    if (!prompt.trim()) return

    setLoading(true)
    try {
      const res = await fetch('/api/forge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, ticker: 'GLOBAL' }),
      })
      const data = await res.json()
      setScript(data.script || 'Error generating script')
    } catch (error) {
      setScript('// Error: Failed to generate script. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const copyScript = () => {
    navigator.clipboard.writeText(script)
  }

  return (
    <div className="min-h-screen bg-black text-[var(--accent)] font-mono p-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Input Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_0_20px_rgba(0,255,80,0.05)]">
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <Zap size={20} className="fill-[var(--accent)]" /> FORGE MONSTER
            </h2>
            <p className="text-[10px] text-[var(--text-dim)] mb-6 leading-tight uppercase tracking-widest">
              Neural Engine v4.1 // Pine Script Generator
            </p>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your 'Monster' strategy (e.g. 3-EMA cross with Volume Spike and RSI Divergence)..."
              className="w-full h-48 bg-black border border-[var(--border)] p-4 text-sm text-[var(--text-bright)] placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] outline-none transition-all font-mono"
            />

            <button
              onClick={handleForge}
              disabled={loading || !prompt.trim()}
              className="w-full mt-4 bg-[var(--accent)] text-black font-black py-4 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all uppercase tracking-tighter"
            >
              {loading ? 'COMPILING NEURAL PATHS...' : 'CONSTRUCT SCRIPT'}
            </button>
          </div>
        </div>

        {/* Code Output Area */}
        <div className="lg:col-span-8 border border-[var(--border)] bg-black relative">
          <div className="absolute top-0 left-0 right-0 bg-[var(--surface2)] p-2 border-b border-[var(--border)] flex justify-between items-center">
            <span className="text-[9px] font-bold text-[var(--text-dim)] px-2 flex items-center gap-2">
              <Terminal size={12} /> OUTPUT_STREAM_V5.PINE
            </span>
            <button
              onClick={copyScript}
              className="text-[9px] hover:text-[var(--accent)] flex items-center gap-1 bg-[var(--surface2)] hover:bg-[var(--surface)] px-2 py-1 transition-all"
            >
              <Copy size={12} /> COPY_TO_TRADINGVIEW
            </button>
          </div>

          <pre className="p-8 pt-14 text-sm text-[var(--accent2)] overflow-auto h-[700px] leading-relaxed whitespace-pre-wrap break-words scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-black">
            <code>{script}</code>
          </pre>

          {loading && (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="animate-pulse text-xs tracking-[0.5em] text-[var(--accent)]">GENERATING_LOGIC</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
