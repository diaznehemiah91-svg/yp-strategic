'use client'

import { useState } from 'react'
import LivePrice from '@/app/components/LivePrice'

export default function CryptoPage() {
  const cryptoAssets = [
    { symbol: 'BTC', name: 'Bitcoin', role: 'Macro Hedge' },
    { symbol: 'ETH', name: 'Ethereum', role: 'Smart Contracts' },
    { symbol: 'SOL', name: 'Solana', role: 'High Speed' },
    { symbol: 'RENDER', name: 'Render', role: 'GPU Network' },
    { symbol: 'FET', name: 'Fetch.ai', role: 'AI Agents' },
    { symbol: 'LINK', name: 'Chainlink', role: 'Oracle Layer' },
  ]

  return (
    <main className="min-h-screen bg-black text-[var(--accent)] font-mono pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-8 mb-10 flex justify-between items-end fade-up d1">
          <div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter">DIGITAL_ASSETS</h1>
            <p className="text-xs text-[var(--text-dim)] uppercase tracking-widest mt-2">Strategic Liquidity // Cyber-Tech Tokens</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-[var(--text-dim)] uppercase">Global Crypto Cap</p>
            <p className="text-2xl font-bold text-[var(--accent)]">$2.84T</p>
          </div>
        </div>

        {/* Ticker Tape */}
        <div className="glass border border-[var(--border)] mb-10 p-4 overflow-hidden fade-up d2">
          <div className="flex gap-8 animate-marquee whitespace-nowrap">
            {cryptoAssets.map((asset) => (
              <div key={asset.symbol} className="flex gap-2 items-center shrink-0">
                <span className="font-bold text-white">{asset.symbol}</span>
                <span className="text-[var(--text-dim)] text-xs">$---.--</span>
              </div>
            ))}
            {cryptoAssets.map((asset) => (
              <div key={`${asset.symbol}-2`} className="flex gap-2 items-center shrink-0">
                <span className="font-bold text-white">{asset.symbol}</span>
                <span className="text-[var(--text-dim)] text-xs">$---.--</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-up d3">
          {cryptoAssets.map((asset) => (
            <div
              key={asset.symbol}
              className="glass border border-[var(--border)] p-6 hover:border-[var(--accent)] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-2xl font-black text-white">{asset.symbol}</span>
                  <p className="text-[10px] text-[var(--text-dim)] uppercase mt-1">{asset.name}</p>
                </div>
                <span className="text-[9px] bg-[rgba(0,255,80,0.1)] px-2 py-1 text-[var(--text-dim)] uppercase border border-[var(--border)] rounded">
                  {asset.role}
                </span>
              </div>

              <div className="my-6 py-4 border-y border-[var(--border)]">
                <LivePrice ticker={asset.symbol} />
              </div>

              <button className="w-full py-2 border border-[var(--border)] text-[10px] uppercase font-bold hover:bg-[var(--surface2)] transition-all rounded text-[var(--text-dim)] hover:text-[var(--accent)]">
                View On-Chain Intel
              </button>
            </div>
          ))}
        </div>

        {/* Signal Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12 fade-up d4">
          <div className="lg:col-span-2 glass border border-[var(--border)] p-6">
            <h3 className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-widest mb-4 border-b border-[var(--border)] pb-2">
              Crypto-Defence Signal Wire
            </h3>
            <div className="space-y-4">
              <div className="border-l-2 border-[var(--accent)] pl-4 py-2">
                <p className="text-sm text-white">Institutional BTC Inflow: +$2.4B (Weekly)</p>
                <p className="text-[9px] text-[var(--text-dim)] uppercase mt-1">12:45 UTC • SOURCE: ON-CHAIN</p>
              </div>
              <div className="border-l-2 border-[var(--border)] pl-4 py-2">
                <p className="text-sm text-[var(--text)]">Render Network expands DoD cloud compute pilot</p>
                <p className="text-[9px] text-[var(--text-dim)] uppercase mt-1">10:20 UTC • SOURCE: NEWSAPI</p>
              </div>
              <div className="border-l-2 border-[var(--accent3)] pl-4 py-2">
                <p className="text-sm text-[var(--text)]">Solana validators spike 15% MoM (Defense adoption)</p>
                <p className="text-[9px] text-[var(--text-dim)] uppercase mt-1">08:12 UTC • SOURCE: CHAIN_METRICS</p>
              </div>
            </div>
          </div>

          {/* Alert CTA */}
          <div className="glass border border-[var(--accent)] bg-[rgba(0,255,80,0.08)] p-6">
            <h3 className="font-black text-white uppercase text-sm mb-2">Get Volatility Alerts</h3>
            <p className="text-[10px] text-[var(--text-dim)] uppercase mb-4">Real-time crypto + defence signals</p>
            <input
              type="email"
              placeholder="YOUR_EMAIL"
              className="w-full bg-black border border-[var(--border)] p-2 text-[11px] text-[var(--text-bright)] placeholder:text-[var(--text-dim)] outline-none focus:border-[var(--accent)] transition-all mb-2"
            />
            <button className="w-full bg-[var(--accent)] text-black py-2 font-black text-[10px] uppercase hover:bg-white transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
