import { NextRequest, NextResponse } from 'next/server'

async function sendSms(to: string, body: string): Promise<boolean> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromNumber) {
    console.error('Missing Twilio credentials')
    return false
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        From: fromNumber,
        To: to,
        Body: body,
      }).toString(),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Twilio API error:', error)
      return false
    }

    const data = await response.json()
    console.log(`✓ SMS sent to ${to}`)
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { phone_number } = await request.json()

    if (!phone_number) {
      return NextResponse.json({ error: 'Phone number required' }, { status: 400 })
    }

    let formattedNumber = phone_number
    if (!phone_number.startsWith('+')) {
      formattedNumber = `+1${phone_number.replace(/\D/g, '')}`
    }

    const testMessage = '[YP-STRATEGIC] NVDA at $150.25 entered buy zone (target: $145.00). Access: ypstrategicresearch.com'
    const success = await sendSms(formattedNumber, testMessage)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to send SMS. Check Twilio credentials.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: `✓ Test SMS sent to ${formattedNumber}`,
        test_message: testMessage,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test SMS error:', error)
    return NextResponse.json(
      { error: `Failed: ${error instanceof Error ? error.message : 'Unknown'}` },
      { status: 500 }
    )
  }
}
