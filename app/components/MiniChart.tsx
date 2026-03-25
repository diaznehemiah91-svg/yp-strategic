'use client';
import { useEffect, useRef } from 'react';

interface MiniChartProps {
  price: number;
  change: number;
  height?: number;
}

function generate7DayData(currentPrice: number, change: number) {
  const points = 28; // 4 data points per day × 7 days
  const startPrice = currentPrice - change * 1.8;
  const data = [];

  for (let i = 0; i < points; i++) {
    const t = i / (points - 1);
    const trend = change * t;
    const noise = (Math.random() - 0.5) * currentPrice * 0.008;
    const value = Math.max(0.01, startPrice + trend + noise);

    const d = new Date();
    d.setDate(d.getDate() - 7);
    d.setHours(0, 0, 0, 0);
    d.setTime(d.getTime() + i * (7 * 24 * 60 * 60 * 1000) / points);

    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');

    data.push({ time: `${yyyy}-${mm}-${dd}`, value: +value.toFixed(2) });
  }

  // Deduplicate by date (lightweight-charts requires unique times)
  const seen = new Set<string>();
  return data.filter(d => {
    if (seen.has(d.time)) return false;
    seen.add(d.time);
    return true;
  });
}

export default function MiniChart({ price, change, height = 120 }: MiniChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let chart: any;
    (async () => {
      try {
        const { createChart, ColorType } = await import('lightweight-charts');
        const el = containerRef.current;
        if (!el) return;

        chart = createChart(el, {
          width: el.clientWidth,
          height,
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#3a5a44',
          },
          grid: {
            vertLines: { color: 'rgba(0,255,80,0.04)' },
            horzLines: { color: 'rgba(0,255,80,0.04)' },
          },
          rightPriceScale: {
            borderColor: 'rgba(0,255,80,0.08)',
            textColor: '#3a5a44',
          },
          timeScale: {
            borderColor: 'rgba(0,255,80,0.08)',
            fixLeftEdge: true,
            fixRightEdge: true,
          },
          crosshair: { mode: 0 },
          handleScroll: false,
          handleScale: false,
        });

        const lineColor = change >= 0 ? '#00ff52' : '#ff3355';
        const areaTopColor = change >= 0 ? 'rgba(0,255,82,0.15)' : 'rgba(255,51,85,0.15)';

        const series = chart.addAreaSeries({
          lineColor,
          topColor: areaTopColor,
          bottomColor: 'transparent',
          lineWidth: 2,
        });

        series.setData(generate7DayData(price, change));
        chart.timeScale().fitContent();
      } catch (e) {
        console.warn('[MiniChart] Failed to load lightweight-charts', e);
      }
    })();

    return () => {
      try { chart?.remove(); } catch {}
    };
  }, [price, change, height]);

  return (
    <div
      ref={containerRef}
      style={{ height }}
      className="w-full rounded overflow-hidden"
    />
  );
}
