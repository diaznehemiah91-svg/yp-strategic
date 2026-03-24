import { NextResponse } from 'next/server';

// In production, this writes to PostgreSQL via Prisma
// For now, logs to console and returns success
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { slot, page, clicked, revenue } = body;

    // TODO: Wire to Prisma when DATABASE_URL is set
    // await prisma.adImpression.create({ data: { slot, page, clicked, revenue } });

    console.log(`[AD] ${clicked ? 'CLICK' : 'IMPRESSION'} | slot=${slot} page=${page} rev=$${revenue || 0}`);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  // Returns ad performance summary — for admin dashboard / bank reports
  // TODO: Aggregate from Prisma
  const mockStats = {
    today: { impressions: 4820, clicks: 147, revenue: 22.40, ctr: 3.05 },
    week: { impressions: 31200, clicks: 980, revenue: 148.60, ctr: 3.14 },
    month: { impressions: 124800, clicks: 3920, revenue: 594.40, ctr: 3.14 },
    topSlots: [
      { slot: 'feed-inline', impressions: 12400, clicks: 520, revenue: 78.80 },
      { slot: 'sidebar', impressions: 9800, clicks: 310, revenue: 46.50 },
      { slot: 'banner-top', impressions: 8200, clicks: 280, revenue: 42.00 },
    ],
  };
  return NextResponse.json({ data: mockStats, timestamp: new Date().toISOString() });
}
