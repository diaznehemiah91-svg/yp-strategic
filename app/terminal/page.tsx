'use client'

import { useEffect, useState } from 'react'
import VirtualizedCompanyTable from '@/app/components/VirtualizedCompanyTable'

const MOCK_COMPANIES = [
  { id: 1, ticker: 'NVDA', name: 'NVIDIA', sector: 'Deep-Tech', price: 875.32, change_pct: 2.45 },
  { id: 2, ticker: 'PLTR', name: 'Palantir', sector: 'Defence', price: 28.64, change_pct: 3.21 },
  { id: 3, ticker: 'RKLB', name: 'Rocket Lab', sector: 'Defence', price: 12.89, change_pct: 1.15 },
  { id: 4, ticker: 'LMT', name: 'Lockheed Martin', sector: 'Defence', price: 456.78, change_pct: -0.82 },
  { id: 5, ticker: 'RTX', name: 'RTX Corp', sector: 'Defence', price: 312.45, change_pct: 1.92 },
  { id: 6, ticker: 'CRWD', name: 'CrowdStrike', sector: 'Cyber', price: 142.56, change_pct: 2.11 },
  { id: 7, ticker: 'GOOG', name: 'Alphabet', sector: 'Deep-Tech', price: 139.45, change_pct: 1.23 },
  { id: 8, ticker: 'MSFT', name: 'Microsoft', sector: 'Deep-Tech', price: 424.56, change_pct: 0.89 },
  { id: 9, ticker: 'AMD', name: 'Advanced Micro Devices', sector: 'Deep-Tech', price: 189.12, change_pct: 2.34 },
  { id: 10, ticker: 'BA', name: 'Boeing', sector: 'Defence', price: 178.90, change_pct: -0.45 },
]

export default function TerminalPage() {
  const [companies, setCompanies] = useState(MOCK_COMPANIES)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-[var(--accent)] font-mono pt-20">
        [ INITIALIZING SYSTEMS ]
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--accent)] font-mono mb-2">
            [ GLOBAL INTELLIGENCE TERMINAL ]
          </h1>
          <p className="text-sm text-[var(--text-dim)] font-mono">
            2,600+ US-listed companies • Real-time pricing • Buy zone alerts
          </p>
        </div>

        <VirtualizedCompanyTable companies={companies} />
      </div>
    </div>
  )
}
