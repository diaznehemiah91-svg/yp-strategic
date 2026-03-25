'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import SearchTerminal from './SearchTerminal'
import AuthModal from './AuthModal'

export default function NavBar() {
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(v => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const navItems = [
    { label: 'Signal Wire', href: '/signal', icon: '📡' },
    { label: 'News', href: '/news', icon: '🌐' },
    { label: 'Nexus Map', href: '/nexus', icon: '🗺' },
    { label: 'Tech Levels', href: '/levels', icon: '📊' },
    { label: 'Assets', href: '/assets', icon: '⚡' },
    { label: 'Forge IDE', href: '/forge', icon: '⚙️', highlight: true },
  ]

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      <nav className="border-b border-[var(--border)] bg-black/80 backdrop-blur-md px-5 py-3 sticky top-0 z-50 flex justify-between items-center gap-6">
        {/* Logo */}
        <Link href="/" className="group flex flex-col shrink-0">
          <span className="font-mono text-lg font-black text-[var(--accent)] group-hover:text-white transition-all tracking-tighter">
            Y.P STRATEGIC
          </span>
          <span className="font-mono text-[8px] text-[var(--text-dim)] font-bold uppercase tracking-widest">
            Research Platform
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden lg:flex gap-8 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-[10px] font-bold uppercase tracking-widest transition-all ${
                isActive(item.href)
                  ? 'text-[var(--accent)] border-b-2 border-[var(--accent)] pb-1'
                  : 'text-[var(--text-dim)] hover:text-[var(--accent)]'
              } ${item.highlight ? 'bg-[rgba(0,255,80,0.1)] px-3 py-1 border border-[var(--accent)]/30' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side: Search + Actions */}
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[1px] uppercase px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Search</span>
            <span className="opacity-50">⌘K</span>
          </button>
          <button
            onClick={() => setAuthOpen(true)}
            className="font-mono text-[10px] tracking-[1px] uppercase px-4 py-2 rounded border border-[var(--border)] bg-[var(--accent)] text-black font-semibold hover:bg-white transition-all cursor-pointer shadow-[0_0_20px_rgba(0,255,80,0.2)] hover:shadow-[0_0_30px_rgba(0,255,80,0.4)]"
          >
            Sign In
          </button>
        </div>
      </nav>

      <SearchTerminal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  )
}
