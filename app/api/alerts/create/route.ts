import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { ticker, target_price, sms_enabled } = await request.json()

    if (!ticker || !target_price) {
      return NextResponse.json(
        { error: 'Ticker and target price required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Store alert in Supabase
    const { data, error } = await supabase
      .from('user_alerts')
      .insert({
        user_id: user.id,
        ticker: ticker.toUpperCase(),
        target_price: parseFloat(target_price),
        sms_enabled: sms_enabled ?? true,
        created_at: new Date(),
      })
      .select()

    if (error) {
      console.error('Failed to create alert:', error)
      return NextResponse.json(
        { error: 'Failed to create alert' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `Alert armed for ${ticker} at $${target_price}`,
        alert: data?.[0],
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create alert error:', error)
    return NextResponse.json(
      { error: 'Failed to create alert' },
      { status: 500 }
    )
  }
}
