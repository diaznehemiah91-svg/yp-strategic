/**
 * Test SMS endpoint - send a test alert to user's phone
 * POST /api/alerts/test-sms
 * Body: { phone_number: "+1234567890" }
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendSms, formatAlertMessage } from '@/app/lib/twilio'

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json()

    if (!phone_number) {
      return NextResponse.json(
        { error: 'Phone number required' },
        { status: 400 }
      )
    }

    // Format E.164 international format if not already
    let formattedNumber = phone_number
    if (!phone_number.startsWith('+')) {
      if (phone_number.startsWith('1')) {
        formattedNumber = `+${phone_number}`
      } else {
        formattedNumber = `+1${phone_number.replace(/\D/g, '')}`
      }
    }

    // Send test alert
    const testMessage = formatAlertMessage('NVDA', 150.25, 145.00)
    const success = await sendSms({
      to: formattedNumber,
      body: testMessage,
    })

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send SMS. Check Twilio credentials.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `Test SMS sent to ${formattedNumber}`,
        test_message: testMessage,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test SMS error:', error)
    return NextResponse.json(
      { error: `Failed to send test SMS: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
