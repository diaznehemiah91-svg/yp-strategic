'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SectorData {
  date: string;
  'Defence': number;
  'Defence IT': number;
  'Cyber': number;
  'Semiconductors': number;
  'Space': number;
  'Quantum': number;
  'Nuclear': number;
}

// Generate 7 days of sector performance data
const generateSectorMomentumData = (): SectorData[] => {
  const data: SectorData[] = [];
  const today = new Date();
  const sectors = ['Defence', 'Defence IT', 'Cyber', 'Semiconductors', 'Space', 'Quantum', 'Nuclear'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const dayData: any = {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    // Generate realistic sector performance with some correlation
    const baseShift = Math.sin((6 - i) * 0.5) * 2;
    sectors.forEach((sector, idx) => {
      const volatility = 0.8 + Math.random() * 0.4;
      const trend = (idx - 3) * 0.3 * volatility;
      dayData[sector] = baseShift + trend + (Math.random() - 0.5) * 1.5;
    });

    data.push(dayData);
  }

  return data;
};

const SECTOR_COLORS: Record<string, string> = {
  'Defence': '#00ff52',
  'Defence IT': '#00d4ff',
  'Cyber': '#ff3355',
  'Semiconductors': '#f0c040',
  'Space': '#a78bfa',
  'Quantum': '#60a5fa',
  'Nuclear': '#f97316',
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[rgba(2,3,4,0.95)] border border-[rgba(0,255,80,0.2)] rounded p-3 backdrop-blur-sm">
        <p className="font-mono text-[10px] text-[var(--text-bright)] mb-2">{payload[0].payload.date}</p>
        {payload.map((entry: any, idx: number) => (
          <p
            key={idx}
            className="font-mono text-[9px]"
            style={{ color: entry.color }}
          >
            {entry.name}: {entry.value > 0 ? '+' : ''}{entry.value.toFixed(2)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function SectorMomentum() {
  const data = generateSectorMomentumData();
  const sectors = Object.keys(SECTOR_COLORS);

  // Get current momentum for each sector
  const currentMomentum = data[data.length - 1];

  return (
    <div className="glass p-5 mb-6 fade-up d5">
      <h3 className="font-mono text-xs text-[var(--accent)] tracking-[2px] mb-4 flex items-center gap-2">
        <span>◆ SECTOR MOMENTUM (7-DAY)</span>
        <span className="text-[9px] text-[var(--text-dim)]">Relative strength index</span>
      </h3>

      {/* Chart */}
      <div className="mb-4 -mx-2">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,255,80,0.05)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="rgba(58,90,68,0.5)"
              style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
            />
            <YAxis
              stroke="rgba(58,90,68,0.5)"
              style={{ fontSize: '10px', fontFamily: 'JetBrains Mono' }}
              label={{ value: 'Change %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', paddingBottom: '8px' }}
            />

            {sectors.map(sector => (
              <Line
                key={sector}
                type="monotone"
                dataKey={sector}
                stroke={SECTOR_COLORS[sector]}
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sector Summary Cards */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[rgba(0,255,80,0.12)]">
        {sectors.map(sector => {
          const momentum = (currentMomentum as any)[sector];
          const isPositive = momentum > 0;

          return (
            <div
              key={sector}
              className="p-2 bg-[rgba(0,255,80,0.05)] border border-[rgba(0,255,80,0.1)] rounded"
            >
              <div
                className="font-mono font-bold text-[10px] mb-1"
                style={{ color: SECTOR_COLORS[sector] }}
              >
                {sector}
              </div>
              <div className={`font-mono text-[11px] font-bold ${isPositive ? 'text-[var(--accent)]' : 'text-[var(--accent3)]'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(momentum).toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
