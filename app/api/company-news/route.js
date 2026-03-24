export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol');

  if (!symbol) {
    return Response.json({ error: 'Symbol required' }, { status: 400 });
  }

  try {
    const FINNHUB_KEY = process.env.FINNHUB_KEY;
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];

    const res = await fetch(
      `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${weekAgo}&to=${today}&token=${FINNHUB_KEY}`
    );
    const articles = await res.json();

    const filtered = articles.slice(0, 10).map(a => ({
      headline: a.headline,
      summary: a.summary,
      source: a.source,
      url: a.url,
      datetime: new Date(a.datetime * 1000),
      image: a.image,
    }));

    return Response.json(filtered, {
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
