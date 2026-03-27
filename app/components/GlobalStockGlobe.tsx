'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { TrendingUp, TrendingDown, Globe, Activity, Zap, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const MARKET_HUBS = [
  { name: 'New York', lat: 40.7128, lng: -74.006, country: 'USA', exchange: 'NYSE/NASDAQ', tickers: ['PLTR','NVDA','BA','LMT'], marketCap: '52.3T', volume: '12.8B', change: +1.24, color: '#00ff88' },
  { name: 'London', lat: 51.5074, lng: -0.1278, country: 'UK', exchange: 'LSE', tickers: ['BAE','RYCEY'], marketCap: '3.2T', volume: '2.1B', change: -0.38, color: '#00ccff' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, country: 'Japan', exchange: 'TSE', tickers: ['MHI','KHI'], marketCap: '6.1T', volume: '3.4B', change: +0.87, color: '#ff6600' },
  { name: 'Shanghai', lat: 31.2304, lng: 121.4737, country: 'China', exchange: 'SSE', tickers: ['AVIC','CASIC'], marketCap: '7.8T', volume: '5.2B', change: -1.12, color: '#ff3366' },
  { name: 'Frankfurt', lat: 50.1109, lng: 8.6821, country: 'Germany', exchange: 'FRA', tickers: ['AIR','RHM'], marketCap: '2.4T', volume: '1.3B', change: +0.56, color: '#9966ff' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, country: 'Australia', exchange: 'ASX', tickers: ['ASB','EOS'], marketCap: '1.8T', volume: '0.8B', change: +0.34, color: '#ffcc00' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, country: 'Singapore', exchange: 'SGX', tickers: ['STE'], marketCap: '0.7T', volume: '0.4B', change: -0.21, color: '#00ffcc' },
  { name: 'Tel Aviv', lat: 32.0853, lng: 34.7818, country: 'Israel', exchange: 'TASE', tickers: ['ESLT','ELBIT'], marketCap: '0.3T', volume: '0.2B', change: +2.15, color: '#66ff66' },
  { name: 'Seoul', lat: 37.5665, lng: 126.978, country: 'S.Korea', exchange: 'KRX', tickers: ['KAI','LIG'], marketCap: '2.1T', volume: '1.8B', change: +0.93, color: '#ff9966' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, country: 'India', exchange: 'BSE', tickers: ['HAL','BEL','BDL'], marketCap: '4.2T', volume: '2.6B', change: +1.67, color: '#ff66cc' },
  { name: 'Toronto', lat: 43.6532, lng: -79.3832, country: 'Canada', exchange: 'TSX', tickers: ['CAE','MDA'], marketCap: '2.9T', volume: '1.1B', change: +0.45, color: '#66ccff' },
  { name: 'Riyadh', lat: 24.7136, lng: 46.6753, country: 'Saudi', exchange: 'TADAWUL', tickers: ['SAMI','AEC'], marketCap: '2.7T', volume: '0.9B', change: -0.78, color: '#cc9900' },
];

const SECTOR_DATA = [
  { name: 'Defence Primes', change: +2.4, color: '#00ff88' },
  { name: 'Cybersecurity', change: +1.8, color: '#00ccff' },
  { name: 'Semiconductors', change: -0.6, color: '#ff6600' },
  { name: 'AI / ML', change: +3.1, color: '#9966ff' },
  { name: 'Space & Launch', change: +1.2, color: '#ffcc00' },
  { name: 'Nuclear', change: +0.9, color: '#ff3366' },
  { name: 'Quantum', change: -1.3, color: '#ff66cc' },
  { name: 'GovCloud', change: +0.7, color: '#66ccff' },
];

const TRADE_ROUTES = [
  { from: 0, to: 1, intensity: 0.8 },
  { from: 0, to: 2, intensity: 0.9 },
  { from: 0, to: 4, intensity: 0.7 },
  { from: 1, to: 4, intensity: 0.6 },
  { from: 2, to: 3, intensity: 0.5 },
  { from: 0, to: 8, intensity: 0.7 },
  { from: 0, to: 9, intensity: 0.6 },
  { from: 0, to: 7, intensity: 0.8 },
  { from: 1, to: 6, intensity: 0.5 },
  { from: 2, to: 5, intensity: 0.4 },
  { from: 0, to: 10, intensity: 0.6 },
  { from: 0, to: 11, intensity: 0.5 },
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

interface ProjectionConfig {
  rotateLambda: number;
  rotatePhi: number;
  scale: number;
  cx: number;
  cy: number;
}

function orthoProject(lon: number, lat: number, cfg: ProjectionConfig): [number, number, boolean] {
  const lambda = degToRad(lon + cfg.rotateLambda);
  const phi = degToRad(lat);
  const cosPhi = Math.cos(phi);
  const x = cosPhi * Math.sin(lambda);
  const y = -Math.sin(phi);
  const z = cosPhi * Math.cos(lambda);
  const rotPhi = degToRad(cfg.rotatePhi);
  const y2 = y * Math.cos(rotPhi) - z * Math.sin(rotPhi);
  const z2 = y * Math.sin(rotPhi) + z * Math.cos(rotPhi);
  const visible = z2 > -0.1;
  return [cfg.cx + x * cfg.scale, cfg.cy + y2 * cfg.scale, visible];
}

function projectPoint(lon: number, lat: number, cfg: ProjectionConfig): { x: number; y: number; visible: boolean } {
  const [px, py, visible] = orthoProject(lon, lat, cfg);
  return { x: px, y: py, visible };
}

function drawGlobe(
  ctx: CanvasRenderingContext2D, width: number, height: number,
  rotation: number, tilt: number, time: number, hoveredHub: number | null, dpr: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.32;
  const cfg: ProjectionConfig = { rotateLambda: rotation, rotatePhi: tilt, scale: radius, cx, cy };

  ctx.clearRect(0, 0, width * dpr, height * dpr);
  ctx.save();
  ctx.scale(dpr, dpr);

  // Atmosphere glow
  const atmosGrad = ctx.createRadialGradient(cx, cy, radius * 0.9, cx, cy, radius * 1.5);
  atmosGrad.addColorStop(0, 'rgba(0, 255, 136, 0.08)');
  atmosGrad.addColorStop(0.4, 'rgba(0, 200, 255, 0.04)');
  atmosGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = atmosGrad;
  ctx.fillRect(0, 0, width, height);

  // Globe sphere
  const globeGrad = ctx.createRadialGradient(cx - radius * 0.3, cy - radius * 0.3, 0, cx, cy, radius);
  globeGrad.addColorStop(0, 'rgba(15, 25, 40, 0.95)');
  globeGrad.addColorStop(0.7, 'rgba(5, 15, 30, 0.98)');
  globeGrad.addColorStop(1, 'rgba(0, 8, 20, 1)');
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = globeGrad;
  ctx.fill();

  // Atmosphere ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  const ringGrad = ctx.createRadialGradient(cx, cy, radius - 2, cx, cy, radius + 4);
  ringGrad.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
  ringGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Graticule
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.06)';
  ctx.lineWidth = 0.5;
  for (let lat = -80; lat <= 80; lat += 20) {
    ctx.beginPath();
    let started = false;
    for (let lon = -180; lon <= 180; lon += 3) {
      const p = projectPoint(lon, lat, cfg);
      if (p.visible) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); }
      else { started = false; }
    }
    ctx.stroke();
  }
  for (let lon = -180; lon < 180; lon += 20) {
    ctx.beginPath();
    let started = false;
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = projectPoint(lon, lat, cfg);
      if (p.visible) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); }
      else { started = false; }
    }
    ctx.stroke();
  }

  // Continents
  CONTINENTS.forEach(continent => {
    continent.forEach(ring => {
      ctx.beginPath();
      let started = false;
      ring.forEach(([lon, lat]) => {
        const p = projectPoint(lon, lat, cfg);
        if (p.visible) { if (!started) { ctx.moveTo(p.x, p.y); started = true; } else ctx.lineTo(p.x, p.y); }
      });
      ctx.closePath();
      ctx.fillStyle = 'rgba(0, 255, 136, 0.08)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  });

  // Trade route arcs
  TRADE_ROUTES.forEach(route => {
    const fromHub = MARKET_HUBS[route.from];
    const toHub = MARKET_HUBS[route.to];
    const p1 = projectPoint(fromHub.lng, fromHub.lat, cfg);
    const p2 = projectPoint(toHub.lng, toHub.lat, cfg);
    if (p1.visible && p2.visible) {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - 30 * route.intensity;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      const pulse = 0.3 + 0.3 * Math.sin(time * 0.002 + route.from);
      ctx.strokeStyle = `rgba(0, 255, 136, ${pulse * route.intensity * 0.4})`;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
      const t = ((time * 0.001 + route.from * 0.5) % 1);
      const px = p1.x * (1 - t) * (1 - t) + 2 * midX * t * (1 - t) + p2.x * t * t;
      const py = p1.y * (1 - t) * (1 - t) + 2 * midY * t * (1 - t) + p2.y * t * t;
      ctx.beginPath();
      ctx.arc(px, py, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 255, 200, 0.8)';
      ctx.fill();
    }
  });

  // Market hub dots
  MARKET_HUBS.forEach((hub, i) => {
    const p = projectPoint(hub.lng, hub.lat, cfg);
    if (!p.visible) return;
    const isHovered = hoveredHub === i;
    const pulseSize = 3 + 1.5 * Math.sin(time * 0.003 + i);
    const baseSize = isHovered ? 7 : pulseSize;
    const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, baseSize * 4);
    glowGrad.addColorStop(0, hub.color + '60');
    glowGrad.addColorStop(1, hub.color + '00');
    ctx.beginPath();
    ctx.arc(p.x, p.y, baseSize * 4, 0, Math.PI * 2);
    ctx.fillStyle = glowGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, baseSize, 0, Math.PI * 2);
    ctx.fillStyle = hub.color;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(p.x, p.y, baseSize * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    const ringPhase = (time * 0.002 + i * 0.7) % 1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, baseSize + ringPhase * 15, 0, Math.PI * 2);
    ctx.strokeStyle = hub.color + Math.floor((1 - ringPhase) * 80).toString(16).padStart(2, '0');
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  // Orbital rings with ticker data
  for (let ring = 0; ring < 3; ring++) {
    const ringRadius = radius * (1.15 + ring * 0.12);
    const ringSpeed = 0.0003 * (ring + 1);
    const ringAlpha = 0.15 - ring * 0.03;
    const ringTilt = 15 + ring * 25;
    ctx.beginPath();
    for (let angle = 0; angle < 360; angle += 2) {
      const a = degToRad(angle + time * ringSpeed * 180 / Math.PI);
      const tiltRad = degToRad(ringTilt);
      const x = cx + ringRadius * Math.cos(a);
      const y = cy + ringRadius * Math.sin(a) * Math.cos(tiltRad);
      if (angle === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    const ringColors = ['#00ff88', '#00ccff', '#9966ff'];
    ctx.strokeStyle = ringColors[ring] + Math.floor(ringAlpha * 255).toString(16).padStart(2, '0');
    ctx.lineWidth = 1;
    ctx.stroke();

    const tickerSets = [
      ['PLTR +3.2%', 'NVDA -0.8%', 'BA +1.9%', 'LMT +0.7%', 'RTX +1.1%', 'NOC -0.4%'],
      ['BTC +1.4%', 'ETH +2.2%', '/ES +0.8%', '/NQ +1.1%', 'GLD +0.4%', '/CL -0.9%'],
      ['SPY +0.6%', 'QQQ +0.9%', 'IWM -0.3%', 'DIA +0.4%', 'VIX -2.1%', 'TLT +0.8%'],
    ];
    const tickers = tickerSets[ring];
    tickers.forEach((ticker, ti) => {
      const a = degToRad((ti / tickers.length) * 360 + time * ringSpeed * 180 / Math.PI);
      const tiltRad = degToRad(ringTilt);
      const tx = cx + ringRadius * Math.cos(a);
      const ty = cy + ringRadius * Math.sin(a) * Math.cos(tiltRad);
      const tz = ringRadius * Math.sin(a) * Math.sin(tiltRad);
      if (tz > -ringRadius * 0.3) {
        const opacity = Math.min(1, (tz + ringRadius * 0.3) / (ringRadius * 0.6));
        ctx.font = '600 9px monospace';
        ctx.fillStyle = `rgba(255,255,255,${opacity * 0.7})`;
        ctx.textAlign = 'center';
        ctx.fillText(ticker, tx, ty - 6);
      }
    });
  }

  // Floating data cards
  MARKET_HUBS.forEach((hub, i) => {
    const p = projectPoint(hub.lng, hub.lat, cfg);
    if (!p.visible || hoveredHub === i) return;
    const showPhase = Math.sin(time * 0.001 + i * 1.5);
    if (showPhase < 0.5) return;
    const cardX = p.x + 12;
    const cardY = p.y - 18;
    const alpha = (showPhase - 0.5) * 2;
    ctx.save();
    ctx.globalAlpha = alpha * 0.85;
    const cardW = 62;
    const cardH = 22;
    ctx.fillStyle = 'rgba(0, 10, 20, 0.85)';
    ctx.strokeStyle = hub.color + '60';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 3);
    ctx.fill();
    ctx.stroke();
    ctx.font = '600 7px monospace';
    ctx.fillStyle = hub.color;
    ctx.textAlign = 'left';
    ctx.fillText(hub.exchange.substring(0, 6), cardX + 4, cardY + 9);
    const changeColor = hub.change >= 0 ? '#00ff88' : '#ff4444';
    ctx.fillStyle = changeColor;
    ctx.font = '700 8px monospace';
    ctx.fillText((hub.change >= 0 ? '+' : '') + hub.change.toFixed(1) + '%', cardX + 4, cardY + 18);
    ctx.restore();
  });

  // AI Powered Analytics label
  const baseY = cy + radius + 45;
  ctx.font = '600 10px monospace';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 255, 136, 0.5)';
  ctx.fillText('AI  POWERED  ANALYTICS', cx, baseY);

  // Scanning line
  const scanY = cy - radius + ((time * 0.05) % (radius * 2));
  if (scanY >= cy - radius && scanY <= cy + radius) {
    const scanWidth = Math.sqrt(radius * radius - (scanY - cy) * (scanY - cy)) * 2;
    const scanGrad = ctx.createLinearGradient(cx - scanWidth / 2, scanY, cx + scanWidth / 2, scanY);
    scanGrad.addColorStop(0, 'rgba(0, 255, 136, 0)');
    scanGrad.addColorStop(0.5, 'rgba(0, 255, 136, 0.08)');
    scanGrad.addColorStop(1, 'rgba(0, 255, 136, 0)');
    ctx.fillStyle = scanGrad;
    ctx.fillRect(cx - scanWidth / 2, scanY - 1, scanWidth, 2);
  }

  ctx.restore();
}

export default function GlobalStockGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const rotationRef = useRef(0);
  const [hoveredHub, setHoveredHub] = useState<number | null>(null);
  const [selectedHub, setSelectedHub] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [globalIndex, setGlobalIndex] = useState({ value: 7847.32, change: +1.24 });
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouseX = useRef(0);
  const dragRotation = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalIndex(prev => {
        const delta = (Math.random() - 0.48) * 5;
        const newVal = prev.value + delta;
        return { value: newVal, change: prev.change + (Math.random() - 0.5) * 0.1 };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastMouseX.current;
      dragRotation.current += dx * 0.3;
      lastMouseX.current = e.clientX;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;
    const radius = Math.min(w, h) * 0.32;
    const totalRotation = rotationRef.current + dragRotation.current;
    const cfg: ProjectionConfig = { rotateLambda: totalRotation, rotatePhi: -15, scale: radius, cx: w / 2, cy: h / 2 };
    let found = -1;
    MARKET_HUBS.forEach((hub, i) => {
      const p = projectPoint(hub.lng, hub.lat, cfg);
      if (p.visible) {
        const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
        if (dist < 20) found = i;
      }
    });
    setHoveredHub(found >= 0 ? found : null);
  }, []);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  const handleClick = useCallback(() => {
    if (hoveredHub !== null) setSelectedHub(hoveredHub === selectedHub ? null : hoveredHub);
    else setSelectedHub(null);
  }, [hoveredHub, selectedHub]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
    };
    resize();
    window.addEventListener('resize', resize);
    let startTime = performance.now();
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      rotationRef.current = elapsed * 0.008;
      const totalRotation = rotationRef.current + dragRotation.current;
      drawGlobe(ctx, w, h, totalRotation, -15, elapsed, hoveredHub, dpr);
      animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isVisible, hoveredHub]);

  const hub = selectedHub !== null ? MARKET_HUBS[selectedHub] : null;

  return (
    <section ref={containerRef} className="relative w-full py-12 overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(0,5,10,1) 0%, rgba(0,10,20,1) 50%, rgba(0,5,10,1) 100%)' }}>
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
          <span className="text-sm font-bold text-white font-mono">{globalIndex.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <span className={`text-xs font-mono font-bold ${globalIndex.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {globalIndex.change >= 0 ? '+' : ''}{globalIndex.change.toFixed(2)}%
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
            {SECTOR_DATA.map((sector, i) => (
              <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-colors">
                <span className="text-[10px] font-mono text-gray-400">{sector.name}</span>
                <span className={`text-[10px] font-mono font-bold ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {sector.change >= 0 ? '+' : ''}{sector.change}%
                </span>
              </div>
            ))}
          </div>

          <div className="relative" style={{ minHeight: 420 }}>
            <canvas ref={canvasRef} className="w-full cursor-grab active:cursor-grabbing" style={{ height: 420 }}
              onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
              onMouseLeave={() => { isDragging.current = false; setHoveredHub(null); }} onClick={handleClick} />
            {hoveredHub !== null && (
              <div className="absolute pointer-events-none z-20 px-3 py-2 rounded-lg bg-black/90 border border-emerald-500/30 backdrop-blur-sm"
                   style={{ left: '50%', top: '50%', transform: 'translate(-50%, -120%)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full" style={{ background: MARKET_HUBS[hoveredHub].color }} />
                  <span className="text-xs font-bold text-white">{MARKET_HUBS[hoveredHub].name}</span>
                  <span className="text-[9px] text-gray-500 font-mono">{MARKET_HUBS[hoveredHub].exchange}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-gray-400 font-mono">MCap: {MARKET_HUBS[hoveredHub].marketCap}</span>
                  <span className={`text-[10px] font-mono font-bold ${MARKET_HUBS[hoveredHub].change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {MARKET_HUBS[hoveredHub].change >= 0 ? '+' : ''}{MARKET_HUBS[hoveredHub].change}%
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="hidden lg:block space-y-1.5">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-mono tracking-wider text-cyan-400 uppercase">Signal Feed</span>
            </div>
            {MARKET_HUBS.slice(0, 8).map((hub, i) => (
              <div key={i}
                   className={`flex items-center justify-between px-2.5 py-1.5 rounded border transition-all cursor-pointer ${selectedHub === i ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/[0.02] border-white/[0.04] hover:border-cyan-500/20'}`}
                   onClick={() => setSelectedHub(selectedHub === i ? null : i)}>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: hub.color }} />
                  <span className="text-[10px] font-mono text-gray-300">{hub.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  {hub.change >= 0 ? <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" /> : <ArrowDownRight className="w-2.5 h-2.5 text-red-400" />}
                  <span className={`text-[10px] font-mono font-bold ${hub.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {hub.change >= 0 ? '+' : ''}{hub.change.toFixed(1)}%
                  </span>
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
                  <h3 className="text-sm font-bold text-white">{hub.name} \u2014 {hub.exchange}</h3>
                  <p className="text-[10px] text-gray-500 font-mono">{hub.country}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold font-mono ${hub.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {hub.change >= 0 ? '+' : ''}{hub.change}%
                </div>
                <div className="text-[10px] text-gray-500 font-mono">Vol: {hub.volume}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] text-gray-500 font-mono mb-0.5">Market Cap</div>
                <div className="text-xs font-bold text-white font-mono">{hub.marketCap}</div>
              </div>
              <div className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] text-gray-500 font-mono mb-0.5">Volume</div>
                <div className="text-xs font-bold text-white font-mono">{hub.volume}</div>
              </div>
              <div className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] text-gray-500 font-mono mb-0.5">Key Tickers</div>
                <div className="text-xs font-bold text-emerald-400 font-mono">{hub.tickers.join(', ')}</div>
              </div>
              <div className="px-2.5 py-2 rounded bg-white/[0.03] border border-white/[0.06]">
                <div className="text-[9px] text-gray-500 font-mono mb-0.5">Exchange</div>
                <div className="text-xs font-bold text-cyan-400 font-mono">{hub.exchange}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="lg:hidden mt-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {SECTOR_DATA.map((sector, i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: sector.color }} />
              <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">{sector.name}</span>
              <span className={`text-[10px] font-mono font-bold ${sector.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {sector.change >= 0 ? '+' : ''}{sector.change}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute top-0 left-0 w-24 h-24 border-l border-t border-emerald-500/10" />
      <div className="absolute top-0 right-0 w-24 h-24 border-r border-t border-emerald-500/10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 border-l border-b border-emerald-500/10" />
      <div className="absolute bottom-0 right-0 w-24 h-24 border-r border-b border-emerald-500/10" />
    </section>
  );
}
