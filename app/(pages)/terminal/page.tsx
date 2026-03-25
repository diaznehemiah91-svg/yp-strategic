import { Metadata } from 'next';
import TerminalEmulator from '@/app/components/TerminalEmulator';
import ThreeBackground from '@/app/components/ThreeBackground';

export const metadata: Metadata = {
  title: 'Command Terminal | Y.P Strategic Research',
  description: 'Real-time terminal interface for advanced stock scanning, analysis, and portfolio management.',
};

export default function TerminalPage() {
  return (
    <>
      <ThreeBackground />

      <div className="relative z-10 h-screen flex flex-col bg-[var(--bg)] overflow-hidden">
        {/* HEADER */}
        <div className="border-b border-[rgba(0,255,80,0.12)] px-6 py-4 bg-[rgba(2,3,4,0.8)]">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-mono text-lg font-bold text-[var(--accent)] mb-1">
              ◆ COMMAND TERMINAL
            </h1>
            <p className="font-mono text-[10px] text-[var(--text-dim)] tracking-wide">
              Real-time market intelligence • Type /help for available commands
            </p>
          </div>
        </div>

        {/* TERMINAL AREA */}
        <div className="flex-1 overflow-hidden">
          <TerminalEmulator />
        </div>

        {/* FOOTER */}
        <div className="border-t border-[rgba(0,255,80,0.12)] px-6 py-3 bg-[rgba(2,3,4,0.8)]">
          <p className="font-mono text-[9px] text-[var(--text-dim)]">
            Connected to ypstrategicresearch.com • Press Ctrl+C to clear • Type /save to export session
          </p>
        </div>
      </div>
    </>
  );
}
