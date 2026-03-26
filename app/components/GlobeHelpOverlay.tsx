'use client'

import React, { useState, useEffect } from 'react'

export default function GlobeHelpOverlay() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <>
      {/* Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full bg-[#00d4ff] text-[#000814] font-mono font-bold text-lg hover:bg-[#00ff52] transition flex items-center justify-center"
        title="Press ? for help"
      >
        ?
      </button>

      {/* Help Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-[#000814] border-2 border-[#00ff52] rounded-lg p-8 max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-mono font-bold text-[#00ff52]">GLOBE CONTROLS</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#00ff52] hover:text-[#ff3366] font-bold text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Viewing Controls */}
              <div>
                <div className="text-[#00d4ff] font-bold mb-2">VIEWING CONTROLS</div>
                <div className="space-y-1 text-[#aaa]">
                  <div><span className="text-[#00ff52]">Left Click Drag</span> — Rotate globe</div>
                  <div><span className="text-[#00ff52]">Scroll / Pinch</span> — Zoom in/out (4x-12x)</div>
                  <div><span className="text-[#00ff52]">Double Click</span> — Auto-rotate globe</div>
                  <div><span className="text-[#00ff52]">Right Click</span> — Pan view</div>
                </div>
              </div>

              {/* Interaction */}
              <div>
                <div className="text-[#00d4ff] font-bold mb-2">INTERACTION</div>
                <div className="space-y-1 text-[#aaa]">
                  <div><span className="text-[#00ff52]">Click Stock</span> — View details (price, change%)</div>
                  <div><span className="text-[#00ff52]">Click Hotspot</span> — View geopolitical risk</div>
                  <div><span className="text-[#00ff52]">ESC</span> — Close detail panel</div>
                </div>
              </div>

              {/* Interface */}
              <div>
                <div className="text-[#00d4ff] font-bold mb-2">INTERFACE</div>
                <div className="space-y-1 text-[#aaa]">
                  <div><span className="text-[#00ff52]">⚙️ Button (Top Left)</span> — Search & filter</div>
                  <div><span className="text-[#00ff52]">📊 Panel (Bottom Left)</span> — Live statistics</div>
                  <div><span className="text-[#00ff52]">Signal Panel (Top Right)</span> — Real-time alerts</div>
                </div>
              </div>

              {/* Keyboard Shortcuts */}
              <div>
                <div className="text-[#00d4ff] font-bold mb-2">KEYBOARD SHORTCUTS</div>
                <div className="space-y-1 text-[#aaa]">
                  <div><span className="text-[#00ff52]">?</span> — Toggle this help menu</div>
                  <div><span className="text-[#00ff52]">F</span> — Toggle fullscreen</div>
                  <div><span className="text-[#00ff52]">R</span> — Reset view to default</div>
                  <div><span className="text-[#00ff52]">Space</span> — Pause/resume animation</div>
                </div>
              </div>

              {/* Legend */}
              <div>
                <div className="text-[#00d4ff] font-bold mb-2">LEGEND</div>
                <div className="space-y-2 text-[#aaa]">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00ff52]" />
                    <span>Green Ring — Strong data connection / Positive signal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff3366]" />
                    <span>Red Ring — High severity / Negative signal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#00d4ff]" />
                    <span>Cyan Ring — Moderate signal strength</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#333] pt-4 mt-4 text-[#666]">
                <p>💡 Tip: Use filters to focus on specific stocks or high-risk areas</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 px-4 py-2 bg-[#00ff52] text-[#000814] font-bold font-mono rounded hover:bg-[#00dd42] transition"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  )
}
