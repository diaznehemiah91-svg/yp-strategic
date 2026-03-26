import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendSms, formatAlertMessage } from '@/app/lib/twilio'

export const maxDuration = 60

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!
)

// Fetch current price from Yahoo Finance
async function getPrice(ticker: string): Promise<number | null> {
  try {
    const response = await fetch(
      `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=price`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )

    if (!response.ok) return null

    const data = await response.json()
    return data.quoteSummary?.result?.[0]?.price?.regularMarketPrice?.raw || null
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error)
    return null
  }
}

export async function GET() {
  const startTime = new Date()
  let alertsChecked = 0
  let alertsTriggered = 0

  try {
    console.log('🔍 Price check Cron Job started at', startTime)

    // Fetch all active alerts with SMS enabled
    const { data: alerts, error } = await supabase
      .from('user_alerts')
      .select('*, users(phone_number)')
      .eq('sms_enabled', true)

    if (error) {
      console.error('Failed to fetch alerts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch alerts' },
        { status: 500 }
      )
    }

    if (!alerts || alerts.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: 'Price monitoring completed (no active alerts)',
          timestamp: startTime,
          alerts_checked: 0,
          alerts_triggered: 0,
        },
        { status: 200 }
      )
    }

    // Check each alert
    for (const alert of alerts) {
      alertsChecked++

      // Get current price
      const currentPrice = await getPrice(alert.ticker)

      if (currentPrice === null) {
        console.log(`⚠️  Could not fetch price for ${alert.ticker}`)
        continue
      }

      console.log(`${alert.ticker}: $${currentPrice} (target: $${alert.target_price})`)

      // Check if price hit target
      if (currentPrice <= alert.target_price) {
        // Get user's phone number
        const phoneNumber = alert.users?.phone_number
        if (!phoneNumber) {
          console.warn(`⚠️  No phone number for user ${alert.user_id}`)
          continue
        }

        // Check debounce (don't send 2 alerts within 5 mins)
        const lastAlertTime = alert.last_alert_sent_at ? new Date(alert.last_alert_sent_at) : null
        const now = new Date()
        const timeSinceLastAlert = lastAlertTime ? (now.getTime() - lastAlertTime.getTime()) / 1000 / 60 : Infinity

        if (timeSinceLastAlert < 5) {
          console.log(`⏭️  Skipping ${alert.ticker} (alert sent ${timeSinceLastAlert.toFixed(1)} mins ago)`)
          continue
        }

        // Send SMS
        const message = formatAlertMessage(alert.ticker, currentPrice, alert.target_price)
        const success = await sendSms({
          to: phoneNumber,
          body: message,
        })

        if (success) {
          // Update last_alert_sent_at
          await supabase
            .from('user_alerts')
            .update({ last_alert_sent_at: now })
            .eq('id', alert.id)

          alertsTriggered++
          console.log(`✅ SMS sent for ${alert.ticker}`)
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Price monitoring check completed',
        timestamp: startTime,
        alerts_checked: alertsChecked,
        alerts_triggered: alertsTriggered,
        duration_ms: new Date().getTime() - startTime.getTime(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Price check error:', error)
    return NextResponse.json(
      {
        error: 'Price check failed',
        timestamp: startTime,
        alerts_checked: alertsChecked,
        alerts_triggered: alertsTriggered,
      },
      { status: 500 }
    )
  }
}
