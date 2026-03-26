import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function GET() {
  try {
    console.log('Price check Cron Job executed at', new Date())
    
    return NextResponse.json(
      { 
        message: 'Price monitoring check completed',
        timestamp: new Date(),
        alerts_checked: 0,
        alerts_triggered: 0
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Price check error:', error)
    return NextResponse.json(
      { error: 'Price check failed' },
      { status: 500 }
    )
  }
}
