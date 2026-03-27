'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Globe, Activity, Zap, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const MARKET_HUBS = [
  { name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA', exchange: 'NYSE', tickers: ['PLTR','NVDA','BA','LMT'], marketCap: '52.3T', volume: '12.8B', change: +1.24, color: '#00ff88' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', exchange: 'LSE', tickers: ['BAE','RYCEY'], marketCap: '3.2T', volume: '2.1B', change: -0.38, color: '#00ccff' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', exchange: 'TSE', tickers: ['MHI','KHI'], marketCap: '6.1T', volume: '3.4B', change: +0.87, color: '#ff6600' },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', exchange: 'SSE', tickers: ['AVIC'], marketCap: '7.8T', volume: '5.2B', change: -1.12, color: '#ff3366' },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: 'Germany', exchange: 'FRA', tickers: ['AIR','RHM'], marketCap: '2.4T', volume: '1.3B', change: +0.56, color: '#9966ff' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', exchange: 'ASX', tickers: ['ASB'], marketCap: '1.8T', volume: '0.8B', change: +0.34, color: '#ffcc00' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', exchange: 'SGX', tickers: ['STE'], marketCap: '0.7T', volume: '0.4B', change: -0.21, color: '#00ffcc' },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', exchange: 'TASE', tickers: ['ESLT'], marketCap: '0.3T', volume: '0.2B', change: +2.15, color: '#66ff66' },
  { name: 'Seoul', lat: 37.5665, lng: 126.978, country: 'S.Korea', exchange: 'KRX', tickers: ['KAI'], marketCap: '2.1T', volume: '1.8B', change: +0.93, color: '#ff9966' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', exchange: 'BSE', tickers: ['HAL','BEL'], marketCap: '4.2T', volume: '2.6B', change: +1.67, color: '#ff66cc' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', exchange: 'TSX', tickers: ['CAE'], marketCap: '2.9T', volume: '1.1B', change: +0.45, color: '#66ccff' },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, country: 'Saudi', exchange: 'TADAWUL', tickers: ['SAMI'], marketCap: '2.7T', volume: '0.9B', change: -0.78, color: '#cc9900' },
];

const SECTOR_DATA = [
  { name: 'Defence Primes', change: +2.4, color: '#00ff88' },
  { name: 'Cybersecurity', change: +1.8, color: '#00ccff' },
  { name: 'Semiconductors', change: -0.6, color: '#ff6600' },
  { name: 'AI / ML', change: +3.1, color: '#9966ff' },
  { name: 'Space', change: +1.2, color: '#ffcc00' },
  { name: 'Nuclear', change: +0.9, color: '#ff3366' },
  { name: 'Quantum', change: -1.3, color: '#ff66cc' },
  { name: 'GovCloud', change: +0.7, color: '#66ccff' },
];

const TRADE_ROUTES = [
  { from: 0, to: 1, intensity: 0.8 }, { from: 0, to: 2, intensity: 0.9 },
  { from: 0, to: 4, intensity: 0.7 }, { from: 1, to: 4, intensity: 0.6 },
  { from: 2, to: 3, intensity: 0.5 }, { from: 0, to: 8, intensity: 0.7 },
  { from: 0, to: 9, intensity: 0.6 }, { from: 0, to: 7, intensity: 0.8 },
  { from: 1, to: 6, intensity: 0.5 }, { from: 2, to: 5, intensity: 0.4 },
];

const CONTINENTS: [number,number][][][] = [
  [[[-130,50],[-125,60],[-100,60],[-80,45],[-65,45],[-80,25],[-100,20],[-120,30],[-130,50]]],
  [[[-80,10],[-60,10],[-35,-5],[-40,-20],[-55,-30],[-70,-55],[-75,-20],[-80,10]]],
  [[[0,35],[10,35],[30,45],[40,55],[30,60],[10,55],[0,50],[-10,45],[0,35]]],
  [[[-15,35],[10,35],[35,30],[50,10],[45,-10],[35,-35],[20,-35],[10,-5],[-15,5],[-15,35]]],
  [[[40,55],[60,55],[80,50],[100,55],[120,55],[140,50],[130,30],[120,20],[100,10],[80,25],[60,25],[40,35],[40,55]]],
  [[[115,-15],[130,-12],[150,-15],[155,-25],[150,-38],[130,-32],[115,-22],[115,-15]]],
];

function degToRad(d: number) { return d * Math.PI / 180; }

function orthoProject(lon: number, lat: number, rotation: number, tilt: number, scale: number, cx: number, cy: number): [number, number, boolean] {
  const lambda = degToRad(lon + rotation);
  const phi = degToRad(lat);
  const cosPhi = Math.cos(phi);
  const x = cosPhi * Math.sin(lambda);
  const y = -Math.sin(phi);
  const z = cosPhi * Math.cos(lambda);
  const rotPhi = degToRad(tilt);
  const y2 = y * Math.cos(rotPhi) - z * Math.sin(rotPhi);
  const z2 = y * Math.sin(rotPhi) + z * Math.cos(rotPhi);
  return [cx + x * scale, cy + y2 * scale, z2 > -0.1];
}

function drawGlobe(ctx: CanvasRenderingContext2D, w: number, h: number, rot: number, tilt: number, t: number, hovered: number | null, dpr: number) {
  const cx = w / 2, cy = h / 2;
  const R = Math.min(w, h) * 0.32;
  ctx.clearRect(0, 0, w * dpr, h * dpr);
  ctx.save(); ctx.scale(dpr, dpr);

  // Atmosphere
  const ag = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.5);
  ag.addColorStop(0, 'rgba(0,255,136,0.08)'); ag.addColorStop(0.4, 'rgba(0,200,255,0.04)'); ag.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = ag; ctx.fillRect(0, 0, w, h);

  // Globe
  const gg = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, 0, cx, cy, R);
  gg.addColorStop(0, 'rgba(15,25,40,0.95)'); gg.addColorStop(0.7, 'rgba(5,15,30,0.98)'); gg.addColorStop(1, 'rgba(0,8,20,1)');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = gg; ctx.fill();
  const rg = ctx.createRadialGradient(cx, cy, R - 2, cx, cy, R + 4);
  rg.addColorStop(0, 'rgba(0,255,136,0.3)'); rg.addColorStop(1, 'rgba(0,255,136,0)');
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = rg; ctx.lineWidth = 3; ctx.stroke();

  // Graticule
  ctx.strokeStyle = 'rgba(0,255,136,0.06)'; ctx.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 20) {
    ctx.beginPath(); let s = false;
    for (let lon = -180; lon <= 180; lon += 3) {
      const [px, py, v] = orthoProject(lon, lat, rot, tilt, R, cx, cy);
      if (v) { if (!s) { ctx.moveTo(px, py); s = true; } else ctx.lineTo(px, py); } else s = false;
    } ctx.stroke();
  }
  for (let lon = -180; lon < 180; lon += 20) {
    ctx.beginPath(); let s = false;
    for (let lat = -90; lat <= 90; lat += 3) {
      const [px, py, v] = orthoProject(lon, lat, rot, tilt, R, cx, cy);
      if (v) { if (!s) { ctx.moveTo(px, py); s = true; } else ctx.lineTo(px, py); } else s = false;
    } ctx.stroke();
  }

  // Continents
  CONTINENTS.forEach(c => c.forEach(ring => {
    ctx.beginPath(); let s = false;
    ring.forEach(([lon, lat]) => {
      const [px, py, v] = orthoProject(lon, lat, rot, tilt, R, cx, cy);
      if (v) { if (!s) { ctx.moveTo(px, py); s = true; } else ctx.lineTo(px, py); }
    });
    ctx.closePath(); ctx.fillStyle = 'rgba(0,255,136,0.08)'; ctx.fill();
    ctx.strokeStyle = 'rgba(0,255,136,0.25)'; ctx.lineWidth = 1; ctx.stroke();
  }));

  // Trade routes
  TRADE_ROUTES.forEach(route => {
    const f = MARKET_HUBS[route.from], to = MARKET_HUBS[route.to];
    const [x1, y1, v1] = orthoProject(f.lng, f.lat, rot, tilt, R, cx, cy);
    const [x2, y2, v2] = orthoProject(to.lng, to.lat, rot, tilt, R, cx, cy);
    if (v1 && v2) {
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - 30 * route.intensity;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(mx, my, x2, y2);
      const pulse = 0.3 + 0.3 * Math.sin(t * 0.002 + route.from);
      ctx.strokeStyle = 'rgba(0,255,136,' + (pulse * route.intensity * 0.4) + ')';
      ctx.lineWidth = 1; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]);
      const p = ((t * 0.001 + route.from * 0.5) % 1);
      const px = x1*(1-p)*(1-p) + 2*mx*p*(1-p) + x2*p*p;
      const py = y1*(1-p)*(1-p) + 2*my*p*(1-p) + y2*p*p;
      ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,255,200,0.8)'; ctx.fill();
    }
  });

  // Hub dots
  MARKET_HUBS.forEach((hub, i) => {
    const [px, py, v] = orthoProject(hub.lng, hub.lat, rot, tilt, R, cx, cy);
    if (!v) return;
    const sz = hovered === i ? 7 : 3 + 1.5 * Math.sin(t * 0.003 + i);
    const glow = ctx.createRadialGradient(px, py, 0, px, py, sz * 4);
    glow.addColorStop(0, hub.color + '60'); glow.addColorStop(1, hub.color + '00');
    ctx.beginPath(); ctx.arc(px, py, sz * 4, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, sz, 0, Math.PI * 2); ctx.fillStyle = hub.color; ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, sz * 0.4, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
    const rp = (t * 0.002 + i * 0.7) % 1;
    ctx.beginPath(); ctx.arc(px, py, sz + rp * 15, 0, Math.PI * 2);
    ctx.strokeStyle = hub.color + Math.floor((1 - rp) * 80).toString(16).padStart(2, '0');
    ctx.lineWidth = 1; ctx.stroke();
  });

  // Orbital rings
  for (let ring = 0; ring < 3; ring++) {
    const rr = R * (1.15 + ring * 0.12);
    const rs = 0.0003 * (ring + 1);
    const ra = 0.15 - ring * 0.03;
    const rt = 15 + ring * 25;
    ctx.beginPath();
    for (let a = 0; a < 360; a += 2) {
      const ar = degToRad(a + t * rs * 180 / Math.PI);
      const tr = degToRad(rt);
      const x = cx + rr * Math.cos(ar);
      const y = cy + rr * Math.sin(ar) * Math.cos(tr);
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const rc = ['#00ff88', '#00ccff', '#9966ff'];
    ctx.strokeStyle = rc[ring] + Math.floor(ra * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 1; ctx.stroke();

    const ts = [
      ['PLTR +3.2%', 'NVDA -0.8%', 'BA +1.9%', 'LMT +0.7%', 'RTX +1.1%', 'NOC -0.4%'],
      ['BTC +1.4%', 'ETH +2.2%', '/ES +0.8%', '/NQ +1.1%', 'GLD +0.4%', '/CL -0.9%'],
      ['SPY +0.6%', 'QQQ +0.9%', 'IWM -0.3%', 'DIA +0.4%', 'VIX -2.1%', 'TLT +0.8%'],
    ];
    ts[ring].forEach((ticker, ti) => {
      const ar = degToRad((ti / ts[ring].length) * 360 + t * rs * 180 / Math.PI);
      const tr = degToRad(rt);
      const tx = cx + rr * Math.cos(ar);
      const ty = cy + rr * Math.sin(ar) * Math.cos(tr);
      const tz = rr * Math.sin(ar) * Math.sin(tr);
      if (tz > -rr * 0.3) {
        const op = Math.min(1, (tz + rr * 0.3) / (rr * 0.6));
        ctx.font = '600 9px monospace'; ctx.fillStyle = 'rgba(255,255,255,' + (op * 0.7) + ')';
        ctx.textAlign = 'center'; ctx.fillText(ticker, tx, ty - 6);
      }
    });
  }

  // Floating cards
  MARKET_HUBS.forEach((hub, i) => {
    const [px, py, v] = orthoProject(hub.lng, hub.lat, rot, tilt, R, cx, cy);
    if (!v || hovered === i) return;
    const sp = Math.sin(t * 0.001 + i * 1.5);
    if (sp < 0.5) return;
    const cardX = px + 12, cardY = py - 18;
    const alpha = (sp - 0.5) * 2;
    ctx.save(); ctx.globalAlpha = alpha * 0.85;
    ctx.fillStyle = 'rgba(0,10,20,0.85)'; ctx.strokeStyle = hub.color + '60'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.rect(cardX, cardY, 62, 22); ctx.fill(); ctx.stroke();
    ctx.font = '600 7px monospace'; ctx.fillStyle = hub.color; ctx.textAlign = 'left';
    ctx.fillText(hub.exchange.substring(0, 6), cardX + 4, cardY + 9);
    ctx.fillStyle = hub.change >= 0 ? '#00ff88' : '#ff4444';
    ctx.font = '700 8px monospace';
    ctx.fillText((hub.change >= 0 ? '+' : '') + hub.change.toFixed(1) + '%', cardX + 4, cardY + 18);
    ctx.restore();
  });

  // Bottom label
  ctx.font = '600 10px monospace'; ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0,255,136,0.5)'; ctx.fillText('AI  POWERED  ANALYTICS', cx, cy + R + 45);

  // Scan line
  const sy = cy - R + ((t * 0.05) % (R * 2));
  if (sy >= cy - R && sy <= cy + R) {
    const sw = Math.sqrt(R * R - (sy - cy) * (sy - cy)) * 2;
    const sg = ctx.createLinearGradient(cx - sw / 2, sy, cx + sw / 2, sy);
    sg.addColorStop(0, 'rgba(0,255,136,0)'); sg.addColorStop(0.5, 'rgba(0,255,136,0.08)'); sg.addColorStop(1, 'rgba(0,255,136,0)');
    ctx.fillStyle = sg; ctx.fillRect(cx - sw / 2, sy - 1, sw, 2);
  }
  ctx.restore();
}

export default function GlobalStockGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const rotRef = useRef(0)
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState<number | null>(null)
  const [visible, setVisible] = useState(false)
  const [gIdx, setGIdx] = useState({ value: 7847.32, change: 1.24 })
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const lastX = useRef(0)
  const dragRot = useRef(0)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 })
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setGIdx(p => ({ value: p.value + (Math.random() - 0.48) * 5, change: p.change + (Math.random() - 0.5) * 0.1 }))
    }, 3000)
    return () => clearInterval(iv)
  }, [])

  const onDown = useCallback((e: React.MouseEvent) => { dragging.current = true; lastX.current = e.clientX }, [])
  const onUp = useCallback(() => { dragging.current = false }, [])
  const onClick = useCallback(() => {
    if (hovered !== null) setSelected(hovered === selected ? null : hovered)
    else setSelected(null)
  }, [hovered, selected])

  const onMove = useCallback((e: React.MouseEvent) => {
    if (dragging.current) { dragRot.current += (e.clientX - lastX.current) * 0.3; lastX.current = e.clientX }
    const c = canvasRef.current
    if (!c) return
    const r = c.getBoundingClientRect()
    const mx = e.clientX - r.left, my = e.clientY - r.top
    const radius = Math.min(r.width, r.height) * 0.32
    const totalR = rotRef.current + dragRot.current
    let found = -1
    MARKET_HUBS.forEach((hub, i) => {
      const [px, py, v] = orthoProject(hub.lng, hub.lat, totalR, -15, radius, r.width / 2, r.height / 2)
      if (v && Math.sqrt((mx - px) ** 2 + (my - py) ** 2) < 20) found = i
    })
    setHovered(found >= 0 ? found : null)
  }, [])

  useEffect(() => {
    const c = canvasRef.current
    if (!c || !visible) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const p = c.parentElement
      if (!p) return
      c.width = p.clientWidth * dpr; c.height = p.clientHeight * dpr
      c.style.width = p.clientWidth + 'px'; c.style.height = p.clientHeight + 'px'
    }
    resize(); window.addEventListener('resize', resize)
    const t0 = performance.now()
    const anim = (t: number) => {
      const el = t - t0, dw = c.width / dpr, dh = c.height / dpr
      rotRef.current = el * 0.008
      drawGlobe(ctx, dw, dh, rotRef.current + dragRot.current, -15, el, hovered, dpr)
      animRef.current = requestAnimationFrame(anim)
    }
    animRef.current = requestAnimationFrame(anim)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener('resize', resize) }
  }, [visible, hovered])

  const hub = selected !== null ? MARKET_HUBS[selected] : null
  const changeClass = (v: number) => v >= 0 ? 'text-emerald-400' : 'text-red-400'
  const changeStr = (v: number) => (v >= 0 ? '+' : '') + v.toFixed(1) + '%'

  return (
    <section ref={containerRef} className="relative w-full py-8 overflow-hidden" style={{ background: 'linear-gradient(180deg, #000508 0%, #000a14 50%, #000508 100%)' }}>
      <div className="text-center mb-4 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-3">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] font-mono tracking-[0.2em] text-emerald-400 uppercase">Global Intelligence Network</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Global Stock <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Intelligence</span>
        </h2>
        <p className="text-xs text-gray-500 font-mono">Real-time defence-tech market analysis across 12 global exchanges</p>
      </div>

      <div className="flex justify-center mb-4 px-4">
        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-lg bg-black/40 border border-emerald-500/10">
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-mono text-gray-400">GLOBAL DEFENCE INDEX</span>
          </div>
          <span className="text-sm font-bold text-white font-mono">{gIdx.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={"text-xs font-mono font-bold " + changeClass(gIdx.change)}>
            {gIdx.change >= 0 ? '+' : ''}{gIdx.change.toFixed(2)}%
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr_200px] gap-4 items-start">
          <div className="hidden lg:block space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-mono tracking-wider text-emerald-400 uppercase">Sector Performance</span>
            </div>
            {SECTOR_DATA.map((s, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-colors">
                <span className="text-[10px] font-mono text-gray-400">{s.name}</span>
                <span className={"text-[10px] font-mono font-bold " + changeClass(s.change)}>{changeStr(s.change)}</span>
              </div>
            ))}
          </div>

          <div className="relative" style={{ height: 500 }}>
            <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing"
              onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp}
              onMouseLeave={() => { dragging.current = false; setHovered(null) }} onClick={onClick} />
            {hovered !== null && (
              <div className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-black/90 border border-emerald-500/30 backdrop-blur-sm"
                   style={{ left: '50%', top: '50%', transform: 'translate(-50%, -120%)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: MARKET_HUBS[hovered].color }} />
                  <span className="text-xs font-bold text-white">{MARKET_HUBS[hovered].name}</span>
                  <span className="text-[9px] text-gray-500 font-mono">{MARKET_HUBS[hovered].exchange}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-mono">MCap: {MARKET_HUBS[hovered].marketCap}</span>
                  <span className={"text-[10px] font-mono font-bold " + changeClass(MARKET_HUBS[hovered].change)}>{changeStr(MARKET_HUBS[hovered].change)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">Signal Feed</span>
            </div>
            {MARKET_HUBS.slice(0, 8).map((h, i) => (
              <div key={i}
                   className={"flex items-center justify-between px-2.5 py-1.5 rounded border transition-all cursor-pointer " + (selected === i ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/[0.04] hover:border-cyan-500/20')}
                   onClick={() => setSelected(selected === i ? null : i)}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: h.color }} />
                  <span className="text-[10px] font-mono text-gray-300">{h.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {h.change >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                  <span className={"text-[10px] font-mono font-bold " + changeClass(h.change)}>{changeStr(h.change)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {hub && (
          <div className="mt-4 mx-auto max-w-2xl p-4 rounded-xl bg-black/50 border border-emerald-500/20 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: hub.color }} />
                <div>
                  <h3 className="text-sm font-bold text-white">{hub.name} &mdash; {hub.exchange}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{hub.country}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={"text-lg font-bold font-mono " + changeClass(hub.change)}>{changeStr(hub.change)}</div>
                <div className="text-[10px] text-gray-500 font-mono">Vol: {hub.volume}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: 'Market Cap', value: hub.marketCap, cls: 'text-white' },
                { label: 'Volume', value: hub.volume, cls: 'text-white' },
                { label: 'Key Tickers', value: hub.tickers.join(', '), cls: 'text-emerald-400' },
                { label: 'Exchange', value: hub.exchange, cls: 'text-cyan-400' },
              ].map((item, i) => (
                <div key={i} className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-[9px] text-gray-500 font-mono mb-0.5">{item.label}</div>
                  <div className={"text-xs font-bold font-mono " + item.cls}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden mt-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {SECTOR_DATA.map((s, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{s.name}</span>
              <span className={"text-[10px] font-mono font-bold " + changeClass(s.change)}>{changeStr(s.change)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-emerald-500/10" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-emerald-500/10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-emerald-500/10" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-emerald-500/10" />
    </section>
  )
}
