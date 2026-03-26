'use client';
import { useEffect, useRef } from 'react';

interface Props {
  id: string;
  size: string;
  className?: string;
}

export default function AdSlot({ id, size, className = '' }: Props) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseId = typeof window !== 'undefined' ? (window as any).__NEXT_DATA__?.props?.pageProps?.adsenseId : null;

  useEffect(() => {
    // Track impression
    fetch('/api/ads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slot: id, page: window.location.pathname, clicked: false }),
    }).catch(() => {});

    // Load AdSense if configured
    if (adsenseId && adRef.current) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch {}
    }
  }, [id, adsenseId]);

  const [w, h] = size.split('x');

  return (
    <div
      ref={adRef}
      id={id}
      className={`ad-slot ${className}`}
      onClick={() => {
        fetch('/api/ads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slot: id, page: window.location.pathname, clicked: true }),
        }).catch(() => {});
      }}
    >
      {adsenseId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'inline-block', width: `${w}px`, height: `${h}px` }}
          data-ad-client={adsenseId}
          data-ad-slot={id}
        />
      ) : (
        <a
          href="#pricing"
          className="flex items-center justify-center gap-3 w-full h-full text-center no-underline group"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-mono text-[9px] tracking-[2px] uppercase text-[var(--text-dim)] group-hover:text-[var(--accent)] transition-colors">
            Unlock Real-Time Intelligence —{' '}
            <span className="text-[var(--accent)] font-bold">Upgrade to Pro · $29/mo</span>
            <span className="ml-2 opacity-60">→</span>
          </span>
        </a>
      )}
    </div>
  );
}
