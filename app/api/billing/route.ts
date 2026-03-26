import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/app/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { email, userId } = await request.json()

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email and userId required' },
        { status: 400 }
      )
    }

    const priceId = process.env.STRIPE_PRICE_ID

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID not configured' },
        { status: 500 }
      )
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/terminal?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/?cancelled=true`,
      metadata: {
        userId,
      },
    })

    return NextResponse.json(
      { sessionId: session.id, url: session.url },
      { status: 200 }
    )
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

// Webhook handler for Stripe events
export async function PUT(request: NextRequest) {
  try {
    const event = await request.json()

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const userId = session.metadata.userId

      // Update user subscription in Supabase
      const supabase = await createClient()
      await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          stripe_id: session.subscription,
          status: 'active',
          current_period_end: new Date(session.expires_at * 1000),
        })

      // Update user tier
      await supabase
        .from('users')
        .update({ subscription_tier: 'premium' })
        .eq('id', userId)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}
