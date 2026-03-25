// ─────────────────────────────────────────────────────────
// /api/alerts — Price Alert Management
// GET: Retrieve user alerts
// POST: Create alert
// PATCH: Update alert status
// DELETE: Remove alert
// ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 });
  }

  // TODO: Implement with Prisma when DATABASE_URL is set
  // const alerts = await prisma.priceAlert.findMany({
  //   where: { userId, active: true },
  //   orderBy: { createdAt: 'desc' }
  // });

  // For now, return mock data
  return Response.json({
    alerts: [
      {
        id: '1',
        ticker: 'PLTR',
        condition: 'price_above',
        value: 35,
        active: true,
        triggered: false,
      },
      {
        id: '2',
        ticker: 'LMT',
        condition: 'price_below',
        value: 450,
        active: true,
        triggered: true,
        triggeredAt: new Date().toISOString(),
      },
      {
        id: '3',
        ticker: 'NVDA',
        condition: 'volume_spike',
        value: 50,
        active: true,
        triggered: false,
      },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, ticker, condition, value } = body;

    if (!userId || !ticker || !condition || value === undefined) {
      return Response.json(
        { error: 'userId, ticker, condition, and value required' },
        { status: 400 }
      );
    }

    // TODO: Implement with Prisma
    // const alert = await prisma.priceAlert.create({
    //   data: { userId, ticker, condition, value, active: true }
    // });

    return Response.json(
      { success: true, message: `Alert created for ${ticker}` },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create alert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { alertId, active } = body;

    if (!alertId || active === undefined) {
      return Response.json(
        { error: 'alertId and active status required' },
        { status: 400 }
      );
    }

    // TODO: Implement with Prisma
    // await prisma.priceAlert.update({
    //   where: { id: alertId },
    //   data: { active }
    // });

    return Response.json({ success: true, message: 'Alert updated' });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to update alert' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const alertId = searchParams.get('id');

  if (!alertId) {
    return Response.json({ error: 'alert id required' }, { status: 400 });
  }

  // TODO: Implement with Prisma
  // await prisma.priceAlert.delete({ where: { id: alertId } });

  return Response.json({ success: true, message: 'Alert deleted' });
}
