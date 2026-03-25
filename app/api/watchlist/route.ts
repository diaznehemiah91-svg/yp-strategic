// ─────────────────────────────────────────────────────────
// /api/watchlist — User Watchlist Management
// GET: Retrieve user watchlists
// POST: Create/update watchlist
// DELETE: Remove watchlist
// ─────────────────────────────────────────────────────────

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return Response.json({ error: 'userId required' }, { status: 400 });
  }

  // TODO: Implement with Prisma when DATABASE_URL is set
  // const watchlists = await prisma.userWatchlist.findMany({
  //   where: { userId },
  //   orderBy: { createdAt: 'desc' }
  // });

  // For now, return mock data
  return Response.json({
    watchlists: [
      { id: '1', name: 'Defence Contractors', tickers: ['LMT', 'RTX', 'NOC', 'GD', 'BA'], isPublic: false },
      { id: '2', name: 'AI & Semiconductors', tickers: ['NVDA', 'PLTR', 'AMD', 'INTC'], isPublic: true, views: 42 },
      { id: '3', name: 'Cybersecurity', tickers: ['CRWD', 'PANW', 'FTNT', 'S'], isPublic: false },
    ],
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, tickers, isPublic } = body;

    if (!userId || !name || !tickers) {
      return Response.json(
        { error: 'userId, name, and tickers required' },
        { status: 400 }
      );
    }

    // TODO: Implement with Prisma
    // const watchlist = await prisma.userWatchlist.create({
    //   data: { userId, name, tickers, isPublic }
    // });

    return Response.json(
      { success: true, message: `Watchlist "${name}" created` },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create watchlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const watchlistId = searchParams.get('id');

  if (!watchlistId) {
    return Response.json({ error: 'watchlist id required' }, { status: 400 });
  }

  // TODO: Implement with Prisma
  // await prisma.userWatchlist.delete({ where: { id: watchlistId } });

  return Response.json({ success: true, message: 'Watchlist deleted' });
}
