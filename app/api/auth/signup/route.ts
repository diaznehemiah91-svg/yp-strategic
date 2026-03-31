import { createClient } from '@/app/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, phone } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    if (!supabase) return NextResponse.json({ error: 'Auth service not configured' }, { status: 503 })

    // Sign up user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Store phone number in users table if provided
    if (phone && data.user) {
      await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email,
          phone_number: phone,
          subscription_tier: 'free',
        })
    }

    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
