import { NextRequest, NextResponse } from 'next/server'

const NEWS_API_KEY = process.env.NEWSAPI_KEY || '4b733412e13b47779458f9d1c24e5825'
const NEWS_API_BASE = 'https://newsapi.org/v2'

let cachedNews: any[] | null = null
let cacheTime: number | null = null
const CACHE_DURATION = 5 * 60 * 1000

const locationCoordinates: Record<string, { lat: number; lng: number; region: string }> = {
  ukraine: { lat: 48.3794, lng: 31.1656, region: 'Eastern Europe' },
  russia: { lat: 61.524, lng: 105.3188, region: 'Russia' },
  israel: { lat: 31.0461, lng: 34.8516, region: 'Middle East' },
  us: { lat: 37.0902, lng: -95.7129, region: 'North America' },
  china: { lat: 35.8617, lng: 104.1954, region: 'Asia' },
  japan: { lat: 36.2048, lng: 138.2529, region: 'Asia-Pacific' },
  nato: { lat: 50.8503, lng: 4.3517, region: 'Europe' },
  cyber: { lat: 0, lng: 0, region: 'Global' },
}

function calculateSeverity(title: string, description: string | null): 'critical' | 'high' | 'low' {
  const text = `${title} ${description || ''}`.toLowerCase()
  const criticalKeywords = ['attack', 'crisis', 'war', 'invasion', 'missile', 'nuclear']
  const highKeywords = ['escalation', 'conflict', 'sanctions', 'breach', 'threat']
  if (criticalKeywords.some(k => text.includes(k))) return 'critical'
  if (highKeywords.some(k => text.includes(k))) return 'high'
  return 'low'
}

function identifyCategory(title: string): string {
  const text = title.toLowerCase()
  if (text.includes('military') || text.includes('war')) return 'MILITARY'
  if (text.includes('cyber')) return 'CYBER'
  if (text.includes('economic')) return 'ECONOMICS'
  if (text.includes('defense')) return 'DEFENSE'
  return 'GENERAL'
}

function extractCoordinates(article: { title: string; description: string | null }) {
  const text = `${article.title} ${article.description || ''}`.toLowerCase()
  for (const [location, coords] of Object.entries(locationCoordinates)) {
    if (text.includes(location)) return coords
  }
  return null
}

function formatTimeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

async function fetchNewsFromAPI() {
  try {
    const q = encodeURIComponent('(military OR conflict OR geopolitical OR cyber OR defense) AND (security OR incident OR threat)')
    const url = `${NEWS_API_BASE}/everything?q=${q}&sortBy=publishedAt&pageSize=50&apiKey=${NEWS_API_KEY}`
    const response = await fetch(url)
    if (!response.ok) return []
    const data = await response.json()
    if (data.status !== 'ok') return []

    return data.articles.map((article: any, index: number) => ({
      id: `${article.url}-${index}`,
      source: article.source.name,
      title: article.title,
      description: article.description,
      severity: calculateSeverity(article.title, article.description),
      time: formatTimeAgo(article.publishedAt),
      category: identifyCategory(article.title),
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      coordinates: extractCoordinates({ title: article.title, description: article.description }),
    })).filter((item: any) => item.severity !== 'low' || Math.random() > 0.7).slice(0, 30)
  } catch (error) {
    console.error('NewsAPI fetch failed:', error)
    return []
  }
}

export async function GET(req: NextRequest) {
  try {
    const now = Date.now()
    if (cachedNews && cacheTime && now - cacheTime < CACHE_DURATION) {
      return NextResponse.json(cachedNews)
    }
    const newsData = await fetchNewsFromAPI()
    cachedNews = newsData
    cacheTime = now
    return NextResponse.json(newsData)
  } catch (error) {
    console.error('[NEWS API ERROR]', error)
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}
