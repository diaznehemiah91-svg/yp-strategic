'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import GlobeDetailsPanel from './GlobeDetailsPanel'

const Globe3D = dynamic(() => import('./Globe3D'), { ssr: false })

export default function GlobeWithDetails() {
  const [selection, setSelection] = useState<{
    type: 'ticker' | 'hotspot' | 'none'
    data?: any
  }>({ type: 'none' })

  return (
    <div className="relative w-full h-screen">
      <Globe3D onSelection={setSelection} />
      <GlobeDetailsPanel type={selection.type} data={selection.data} />
    </div>
  )
}
