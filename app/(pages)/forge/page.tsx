'use client'

import { useState } from 'react'
import { Cpu, Download, AlertCircle } from 'lucide-react'

export default function ForgePage() {
  const [input, setInput] = useState('')
  const [ticker, setTicker] = useState('PLTR')
  const [code, setCode] = useState('// Your generated Pine Script will appear here...\n// Press GENERATE SCRIPT to create a trading strategy')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateStrategy = async () => {
    if (!input.trim()) {
      setError('Please describe your trading strategy first.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/forge/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, ticker }),
      })

      if (!response.ok) throw new Error('Forge engine overload')

      const data = await response.json()
      setCode(data.script || 'Error generating script')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate script')
      setCode('// Error generating Pine Script\n// Check your API key and try again.')
    } finally {
      setLoading(false)
    }
  }

  const exportScript = () => {
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(code))
    element.setAttribute('download', `${ticker}_strategy.pine`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <main className="min-h-screen bg-black text-[var(--accent)] font-mono pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="glass mb-6 border border-[var(--border)] p-6 fade-up d1">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Cpu className="animate-pulse" size={24} />
              <div>
                <h1 className="font-black uppercase tracking-tighter text-2xl">FORGE</h1>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest">AI-Powered Trading Strategy Generator</p>
              </div>
            </div>
            <button
              onClick={exportScript}
              disabled={code.startsWith('//')}
              className="flex items-center gap-2 text-[10px] border border-[var(--accent)] px-4 py-2 hover:bg-[var(--accent)]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold tracking-widest"
            >
              <Download size={12} /> Export Pine
            </button>
          </div>
          <p className="text-[11px] text-[var(--text-dim)]">
            Describe your trading strategy and Forge will generate professional TradingView Pine Script v5 code.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-up d2">
          {/* Input Section */}
          <div className="glass border border-[var(--border)] p-6 flex flex-col gap-4 h-[600px]">
            <div>
              <label className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-widest block mb-2">
                Ticker Symbol
              </label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                placeholder="e.g. PLTR, RTX, LMT"
                className="w-full bg-[var(--surface2)] border border-[var(--border)] px-3 py-2 text-[13px] text-[var(--text-bright)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)] transition-all rounded font-mono mb-4"
              />
            </div>

            <div className="flex-1 flex flex-col">
              <label className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-widest mb-2">
                Strategy Parameters
              </label>
              <textarea
                className="flex-1 bg-[var(--surface2)] border border-[var(--border)] px-3 py-3 text-[13px] text-[var(--text-bright)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)] transition-all rounded resize-none font-mono"
                placeholder={`Example: Build a buy signal when:\n- RSI dips below 30 (oversold)\n- Volume spikes 20% above 20-day avg\n- Price breaks above 50-day MA\n\nUse red (#ff3355) for sells, green (#00ff52) for buys.`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex gap-2 bg-[var(--accent3)]/10 border border-[var(--accent3)]/30 px-3 py-2 rounded text-[11px] text-[var(--accent3)]">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={generateStrategy}
              disabled={loading}
              className="w-full bg-[var(--accent)] text-black font-black py-3 hover:bg-white transition-all uppercase text-[12px] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed rounded"
            >
              {loading ? 'SEQUENCING...' : 'GENERATE SCRIPT'}
            </button>
          </div>

          {/* Code Output Section */}
          <div className="glass border border-[var(--border)] p-6 flex flex-col h-[600px] relative bg-black/80">
            <div className="flex justify-between items-center mb-3 pb-3 border-b border-[var(--border)]">
              <span className="text-[10px] text-[var(--text-dim)] uppercase font-bold tracking-widest">Output: Pine Script v5</span>
              <span className="text-[9px] bg-[var(--surface2)] px-2 py-1 rounded text-[var(--text-dim)]">
                {code.split('\n').length} lines
              </span>
            </div>
            <pre className="flex-1 overflow-auto text-[12px] text-[var(--accent2)] leading-relaxed whitespace-pre-wrap break-words scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-black">
              <code>{code}</code>
            </pre>
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 fade-up d3">
          <div className="glass border border-[var(--border)] p-4">
            <p className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-widest mb-2">📊 Supported Indicators</p>
            <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
              RSI, MACD, Bollinger Bands, Moving Averages, Volume Analysis, Momentum, Divergence Detection
            </p>
          </div>
          <div className="glass border border-[var(--border)] p-4">
            <p className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-widest mb-2">⚙️ Output Format</p>
            <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
              Professional Pine Script v5 with comments, color coding, and optimized for TradingView charts
            </p>
          </div>
          <div className="glass border border-[var(--border)] p-4">
            <p className="text-[10px] uppercase font-bold text-[var(--text-dim)] tracking-widest mb-2">🚀 Next Step</p>
            <p className="text-[11px] text-[var(--text-dim)] leading-relaxed">
              Copy the script to TradingView Pine Script Editor and backtest on historical data
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
