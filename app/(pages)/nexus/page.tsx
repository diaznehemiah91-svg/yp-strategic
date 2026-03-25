'use client'

import React, { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: 'dod',
    position: { x: 250, y: 0 },
    data: { label: 'U.S. DEPT OF DEFENSE' },
    style: {
      background: 'rgba(6, 78, 59, 0.5)',
      color: '#fff',
      border: '2px solid var(--accent)',
      fontFamily: 'monospace',
      padding: '12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: 'bold',
    },
  },
  {
    id: 'pltr',
    position: { x: 50, y: 150 },
    data: { label: 'PALANTIR (PLTR)' },
    style: {
      background: '#000',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      fontFamily: 'monospace',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
  },
  {
    id: 'rtx',
    position: { x: 450, y: 150 },
    data: { label: 'RTX CORP (RTX)' },
    style: {
      background: '#000',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      fontFamily: 'monospace',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
  },
  {
    id: 'lmt',
    position: { x: 250, y: 150 },
    data: { label: 'LOCKHEED (LMT)' },
    style: {
      background: '#000',
      color: 'var(--accent)',
      border: '1px solid var(--accent)',
      fontFamily: 'monospace',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
  },
  {
    id: 'ukraine',
    position: { x: 150, y: 350 },
    data: { label: 'THEATRE: UKRAINE' },
    style: {
      background: 'rgba(217, 119, 6, 0.2)',
      color: '#f59e0b',
      border: '1px solid #f59e0b',
      fontFamily: 'monospace',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
  },
  {
    id: 'pacific',
    position: { x: 350, y: 350 },
    data: { label: 'THEATRE: PACIFIC' },
    style: {
      background: 'rgba(217, 119, 6, 0.2)',
      color: '#f59e0b',
      border: '1px solid #f59e0b',
      fontFamily: 'monospace',
      padding: '8px',
      borderRadius: '4px',
      fontSize: '11px',
    },
  },
]

const initialEdges = [
  {
    id: 'e1-2',
    source: 'dod',
    target: 'pltr',
    label: '$178M TITAN',
    animated: true,
    style: { stroke: 'var(--accent)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--accent)', fontFamily: 'monospace', fontSize: '10px' },
  },
  {
    id: 'e1-3',
    source: 'dod',
    target: 'rtx',
    label: '$4.7B PATRIOT',
    animated: true,
    style: { stroke: 'var(--accent)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--accent)', fontFamily: 'monospace', fontSize: '10px' },
  },
  {
    id: 'e1-4',
    source: 'dod',
    target: 'lmt',
    label: '$2.3B AIR DEF',
    animated: true,
    style: { stroke: 'var(--accent)', strokeWidth: 2 },
    labelStyle: { fill: 'var(--accent)', fontFamily: 'monospace', fontSize: '10px' },
  },
  {
    id: 'e2-5',
    source: 'pltr',
    target: 'ukraine',
    label: 'Intel Support',
    style: { stroke: '#f59e0b', strokeWidth: 1 },
    labelStyle: { fill: '#f59e0b', fontFamily: 'monospace', fontSize: '9px' },
  },
  {
    id: 'e3-5',
    source: 'rtx',
    target: 'ukraine',
    label: 'Air Defence',
    style: { stroke: '#f59e0b', strokeWidth: 1 },
    labelStyle: { fill: '#f59e0b', fontFamily: 'monospace', fontSize: '9px' },
  },
  {
    id: 'e4-5',
    source: 'lmt',
    target: 'ukraine',
    label: 'Ground Systems',
    style: { stroke: '#f59e0b', strokeWidth: 1 },
    labelStyle: { fill: '#f59e0b', fontFamily: 'monospace', fontSize: '9px' },
  },
  {
    id: 'e3-6',
    source: 'rtx',
    target: 'pacific',
    label: 'Naval Systems',
    style: { stroke: '#f59e0b', strokeWidth: 1 },
    labelStyle: { fill: '#f59e0b', fontFamily: 'monospace', fontSize: '9px' },
  },
]

export default function NexusPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((connection: Connection) => {
    setEdges((eds) => addEdge(connection, eds))
  }, [setEdges])

  return (
    <main className="h-screen bg-black flex flex-col">
      <div className="p-6 border-b border-[var(--border)] bg-[var(--surface)]">
        <h1 className="text-3xl font-black text-white italic tracking-tighter">NEXUS_ECOSYSTEM_MAP</h1>
        <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-widest mt-2">Visualizing Capital Allocation & Strategic Deployment</p>
      </div>

      <div className="flex-1 w-full bg-black">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Background color="rgba(6, 78, 59, 0.1)" gap={20} />
          <Controls />
          <MiniMap
            nodeColor="rgba(0, 255, 80, 0.2)"
            maskColor="rgba(0, 0, 0, 0.7)"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          />
        </ReactFlow>
      </div>
    </main>
  )
}
