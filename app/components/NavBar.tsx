'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import SearchTerminal from './SearchTerminal';

const navItems = [
  { label: 'Signal', href: '#signal' },
  { label: 'Contractors', href: '#contractors' },
  { label: 'Crypto', href: '#crypto' },
  { label: 'Macro', href: '#macro' },
  { label: 'Forge', href: '#forge' },
  { label: 'Nexus', href: '#nexus' },
];

export default function NavBar() {
  const [active, setActive] = useState('Signal');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
    <nav className="glass flex items-center justify-between px-5 py-3 mb-6 fade-up d1">
      <div className="font-mono font-bold text-sm text-[var(--accent)] tracking-[3px] flex items-center gap-2.5">
        <div className="w-2.5 h-2.5 bg-[var(--accent)] rounded-full animate-pulse shadow-[0_0_12px_var(--accent)]" />
        Y.P Strategicresearch
      </div>
      <div className="hidden md:flex gap-5">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setActive(item.label)}
            className={`font-mono text-[11px] tracking-[1.5px] uppercase no-underline transition-colors cursor-pointer relative ${
              active === item.label ? 'text-[var(--accent)]' : 'text-[var(--text-dim)] hover:text-[var(--accent)]'
            }`}
          >
            {item.label}
            {active === item.label && (
              <span className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[var(--accent)] rounded-sm" />
            )}
          </a>
        ))}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 font-mono text-[10px] tracking-[1px] uppercase px-3 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text-dim)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
        >
          <Search size={11} />
          <span className="hidden sm:inline">Search</span>
          <span className="opacity-40">⌘K</span>
        </button>
        <button className="font-mono text-[10px] tracking-[1.5px] uppercase px-4 py-2 rounded border border-[var(--border)] bg-transparent text-[var(--text-dim)] cursor-pointer hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all">
          Terminal Login
        </button>
        <button className="font-mono text-[10px] tracking-[1.5px] uppercase px-4 py-2 rounded border-none bg-[var(--accent)] text-[var(--bg)] font-semibold shadow-[0_0_20px_rgba(0,255,80,0.2)] cursor-pointer">
          Intel Vault
        </button>
      </div>
    </nav>

    <SearchTerminal
      open={searchOpen}
      onClose={() => setSearchOpen(false)}
      onSelect={() => setSearchOpen(false)}
    />
    </>
  );
}
