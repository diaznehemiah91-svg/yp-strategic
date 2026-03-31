import { NextResponse } from 'next/server';

export async function GET() {
    const mockReports = [
      {
              id: 1,
              title: 'Defence Tech Consolidation',
              summary: 'Market consolidation accelerating. Anduril gaining $1.5B Series C. PLTR expanding autonomous systems.',
              timestamp: new Date().toISOString(),
              priority: 'HIGH',
              sector: 'Defence',
      },
      {
              id: 2,
              title: 'AI Sector Momentum',
              summary: 'OpenAI GPT-5 rumors fueling speculation. Commercial AI adoption reaching inflection point.',
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              priority: 'HIGH',
              sector: 'AI',
      },
      {
              id: 3,
              title: 'Capital Flow Analysis',
              summary: 'Defense budget increases 12% YoY. Private equity showing strong appetite for cyber firms.',
              timestamp: new Date(Date.now() - 7200000).toISOString(),
              priority: 'MEDIUM',
              sector: 'Capital',
      },
      {
              id: 4,
              title: 'Geopolitical Signals',
              summary: 'Supply chain vulnerabilities exposed. Taiwan strait tensions rise. Reshoring initiatives accelerate.',
              timestamp: new Date(Date.now() - 10800000).toISOString(),
              priority: 'CRITICAL',
              sector: 'Geo',
      },
        ];

  return NextResponse.json({ reports: mockReports });
}
