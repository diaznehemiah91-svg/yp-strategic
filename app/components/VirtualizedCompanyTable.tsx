'use client'
import React, { useState, useMemo } from 'react'
import AlertModal from './AlertModal'

interface Company {
  id: number
  ticker: string
  name: string
  sector: string
  price: number
  change_pct: number
}

interface VirtualizedCompanyTableProps {
  companies: Company[]
}

export default function VirtualizedCompanyTable({ companies }: VirtualizedCompanyTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState<string | null>(null)
  const [alertModalOpen, setAlertModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  const sectors = useMemo(() => Array.from(new Set(companies.map(c => c.sector))), [companies])

  const filtered = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.ticker.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           c.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSector = !selectedSector || c.sector === selectedSector
      return matchesSearch && matchesSector
    })
  }, [companies, searchTerm, selectedSector])


  return (
    <>
      <div className="w-full bg-black border border-[var(--border)] rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-[var(--accent)] font-mono mb-4">[ COMPANY TERMINAL ]</h2>

        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search ticker or company name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-transparent border-b border-[var(--accent)] text-[var(--text-bright)] font-mono focus:outline-none"
          />

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedSector(null)}
              className={`px-3 py-1 font-mono text-xs ${!selectedSector ? 'bg-[var(--accent)] text-black' : 'border border-[var(--accent)] text-[var(--accent)]'}`}
            >
              ALL
            </button>
            {sectors.map(sector => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1 font-mono text-xs ${selectedSector === sector ? 'bg-[var(--accent)] text-black' : 'border border-[var(--accent)] text-[var(--accent)]'}`}
              >
                {sector}
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs font-mono text-[var(--text-dim)] mb-4">
          Showing {filtered.length} of {companies.length} companies
        </div>

        {filtered.length > 0 && (
          <div className="max-h-[600px] overflow-y-auto">
            {filtered.map((company, index) => (
              <div key={company.id} className="flex items-center px-4 py-3 border-b border-[rgba(0,255,80,0.1)] hover:bg-[rgba(0,255,80,0.05)] transition-colors">
                <div className="flex-1">
                  <div className="text-sm font-mono font-bold text-[var(--accent)]">{company.ticker}</div>
                  <div className="text-xs text-[var(--text-dim)]">{company.name}</div>
                </div>
                <div className="w-24 text-right">
                  <div className="text-sm font-mono text-[var(--text-bright)]">${company.price.toFixed(2)}</div>
                  <div className={`text-xs font-mono ${company.change_pct >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {company.change_pct >= 0 ? '+' : ''}{company.change_pct.toFixed(2)}%
                  </div>
                </div>
                <div className="w-20 text-xs text-[var(--text-dim)]">{company.sector}</div>
                <button
                  onClick={() => {
                    setSelectedCompany(company)
                    setAlertModalOpen(true)
                  }}
                  className="ml-4 text-[var(--accent)] hover:text-[var(--accent2)] transition-colors"
                  title="Set price alert"
                >
                  🔔
                </button>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-8 text-[var(--text-dim)] font-mono">
            No companies found
          </div>
        )}
      </div>

      {selectedCompany && (
        <AlertModal
          isOpen={alertModalOpen}
          onClose={() => {
            setAlertModalOpen(false)
            setSelectedCompany(null)
          }}
          company={selectedCompany}
        />
      )}
    </>
  )
}
