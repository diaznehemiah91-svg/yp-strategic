'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import GlobeDetailsPanel from './GlobeDetailsPanel'
import GlobeSearchPanel, { GlobeSearchFilters } from './GlobeSearchPanel'

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false })

export default function GlobeWithDetails() {
  const [selection, setSelection] = useState<{
    type: 'ticker' | 'hotspot' | 'none'
    data?: any
  }>({ type: 'none' })

  const [filters, setFilters] = useState<GlobeSearchFilters>({ search: '' })

  return (
    <div className="relative w-full h-screen">
      <Globe3D onSelection={setSelection} filters={filters} />
      <GlobeDetailsPanel type={selection.type} data={selection.data} />
      <GlobeSearchPanel onFilterChange={setFilters} />
    </div>
  )
}
