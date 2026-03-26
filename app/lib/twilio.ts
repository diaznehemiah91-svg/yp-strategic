/**
 * Twilio SMS client for sending price alerts
 */

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromNumber = process.env.TWILIO_PHONE_NUMBER

export interface SendSmsOptions {
  to: string
  body: string
}

export async function sendSms({ to, body }: SendSmsOptions): Promise<boolean> {
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
    console.log(`✓ SMS sent to ${to} (SID: ${data.sid})`)
    return true
  } catch (error) {
    console.error('Error sending SMS:', error)
    return false
  }
}

/**
 * Format alert message for SMS (keep under 160 chars)
 */
export function formatAlertMessage(ticker: string, price: number, targetPrice: number): string {
  const priceStr = price.toFixed(2)
  const msg = `[YP-STRATEGIC] ${ticker} at $${priceStr} entered buy zone (target: $${targetPrice.toFixed(2)}). Access: ypstrategicresearch.com`
  return msg.length > 160 ? msg.substring(0, 157) + '...' : msg
}
