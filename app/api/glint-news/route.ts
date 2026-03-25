import { NextRequest, NextResponse } from 'next/server'

interface NewsItem {
  id: number
  source: string
  title: string
  severity: 'critical' | 'high' | 'low'
  time: string
  category: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// Mock news data for demonstration
const mockNewsData: NewsItem[] = [
  {
    id: 1,
    source: 'NEXTA',
    title: 'Critical geopolitical event detected in Eastern Europe',
    severity: 'critical',
    time: '2m ago',
    category: 'GEOPOLITICS',
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: 2,
    source: 'Bloomberg',
    title: 'Global defence spending increases amid tensions',
    severity: 'high',
    time: '15m ago',
    category: 'DEFENCE',
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
  {
    id: 3,
    source: 'Reuters',
    title: 'Regional stability concerns emerge across Pacific theatre',
    severity: 'high',
    time: '32m ago',
    category: 'GEOPOLITICS',
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: 4,
    source: 'AP News',
    title: 'Market recovery continues in tech sector',
    severity: 'low',
    time: '1h ago',
    category: 'BUSINESS',
    coordinates: { lat: -33.8688, lng: 151.2093 }
  },
  {
    id: 5,
    source: 'FT',
    title: 'AI defence systems development accelerates globally',
    severity: 'high',
    time: '1h 23m ago',
    category: 'AI/TECH',
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 6,
    source: 'WSJ',
    title: 'Cyber threats intensify against infrastructure',
    severity: 'critical',
    time: '2h ago',
    category: 'CYBER',
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 7,
    source: 'Guardian',
    title: 'Defence contractor awarded major government contract',
    severity: 'high',
    time: '2h 45m ago',
    category: 'CONTRACTS',
    coordinates: { lat: 52.2296, lng: 21.0122 }
  },
  {
    id: 8,
    source: 'CNBC',
    title: 'Stock market shows mixed signals on earnings',
    severity: 'low',
    time: '3h ago',
    category: 'MARKETS',
    coordinates: { lat: 40.7128, lng: -74.006 }
  },
]

export async function GET(req: NextRequest) {
  try {
    // TODO: Connect to actual Glint API when credentials available
    // const response = await fetch('https://api.glint.trade/news', {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.GLINT_API_KEY}`,
    //   },
    // });
    //
    // if (!response.ok) {
    //   return NextResponse.json(mockNewsData);
    // }
    //
    // const data = await response.json();
    //
    // const newsItems = data.map((item: any) => ({
    //   id: item.id,
    //   source: item.source_name,
    //   title: item.title,
    //   severity: item.severity.toLowerCase(),
    //   time: formatTimeAgo(item.timestamp),
    //   category: item.category,
    //   coordinates: {
    //     lat: item.location.latitude,
    //     lng: item.location.longitude,
    //   },
    // }));
    //
    // return NextResponse.json(newsItems);

    // For now, return mock data
    // Shuffle array to simulate fresh data
    const shuffled = mockNewsData.sort(() => Math.random() - 0.5)

    return NextResponse.json(shuffled)
  } catch (error) {
    console.error('[GLINT NEWS ERROR]', error)
    return NextResponse.json(mockNewsData)
  }
}
