'use client'

import React, { useState, useCallback } from 'react'

export interface GlobeSearchFilters {
  search: string
  sector?: string
  minPrice?: number
  maxPrice?: number
  minChange?: number
  severityMin?: number
}

interface SearchPanelProps {
  onFilterChange: (filters: GlobeSearchFilters) => void
}

const SECTORS = ['Defense', 'Deep-Tech', 'Aerospace', 'Cybersecurity', 'Energy', 'Quantum']

export default function GlobeSearchPanel({ onFilterChange }: SearchPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState<string>('')
  const [minPrice, setMinPrice] = useState<number>()
  const [maxPrice, setMaxPrice] = useState<number>()
  const [minChange, setMinChange] = useState<number>()
  const [severityMin, setSeverityMin] = useState<number>()

  const handleFilterChange = useCallback(() => {
    onFilterChange({
      search,
      sector: sector || undefined,
      minPrice,
      maxPrice,
      minChange,
      severityMin,
    })
  }, [search, sector, minPrice, maxPrice, minChange, severityMin, onFilterChange])

  React.useEffect(() => {
    handleFilterChange()
  }, [handleFilterChange])

  const handleReset = () => {
    setSearch('')
    setSector('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setMinChange(undefined)
    setSeverityMin(undefined)
  }

  const activeFilters = [search, sector, minPrice, maxPrice, minChange, severityMin].filter(
    (f) => f !== undefined && f !== ''
  ).length

  return (
    <div className="fixed top-8 left-8 z-40">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-lg bg-[#000814] border border-[#00ff52] text-[#00ff52] font-mono text-xs hover:bg-[#00ff52] hover:text-[#000814] transition"
      >
        ⚙️ FILTERS {activeFilters > 0 && <span className="ml-2 text-[#ff3366]">({activeFilters})</span>}
      </button>

      {/* Filter Panel */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-72 p-5 rounded-lg bg-[#000814] border border-[#00ff52] shadow-2xl mt-2">
          <div className="text-xs font-mono text-[#00ff52] mb-4 tracking-wider">GLOBE FILTERS</div>

          {/* Search */}
          <div className="mb-4">
            <label className="block text-xs font-mono text-[#666] mb-2">SEARCH</label>
            <input
              type="text"
              placeholder="Ticker or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono placeholder-[#555] focus:border-[#00ff52] focus:outline-none"
            />
          </div>

          {/* Sector */}
          <div className="mb-4">
            <label className="block text-xs font-mono text-[#666] mb-2">SECTOR</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono focus:border-[#00ff52] focus:outline-none"
            >
              <option value="">All Sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="mb-4">
            <label className="block text-xs font-mono text-[#666] mb-2">PRICE RANGE</label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice || ''}
                onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono placeholder-[#555] focus:border-[#00ff52] focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice || ''}
                onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono placeholder-[#555] focus:border-[#00ff52] focus:outline-none"
              />
            </div>
          </div>

          {/* Change % */}
          <div className="mb-4">
            <label className="block text-xs font-mono text-[#666] mb-2">MIN CHANGE %</label>
            <input
              type="number"
              placeholder="e.g. 1.5"
              value={minChange || ''}
              onChange={(e) => setMinChange(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono placeholder-[#555] focus:border-[#00ff52] focus:outline-none"
            />
          </div>

          {/* Severity (Hotspots) */}
          <div className="mb-4">
            <label className="block text-xs font-mono text-[#666] mb-2">MIN GEO SEVERITY</label>
            <input
              type="number"
              placeholder="1-10"
              min="1"
              max="10"
              value={severityMin || ''}
              onChange={(e) => setSeverityMin(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 bg-[#111] border border-[#333] rounded text-[#fff] text-xs font-mono placeholder-[#555] focus:border-[#00ff52] focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 border-t border-[#333] pt-4">
            <button
              onClick={() => {
                handleReset()
                setIsOpen(false)
              }}
              className="flex-1 px-3 py-2 rounded text-xs font-mono bg-transparent border border-[#666] text-[#666] hover:border-[#00ff52] hover:text-[#00ff52] transition"
            >
              Reset
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-2 rounded text-xs font-mono bg-[#00ff52] text-[#000814] hover:bg-[#00dd42] transition font-bold"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
