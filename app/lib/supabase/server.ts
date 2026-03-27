import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || 'placeholder-key'

export const createClient = async (cookieStore?: AwaiteReturnType<typeof cookies>) => {
    const store = cookieStore || (await cookies())

    return createServerClient(
          supabaseUrl,
          supabaseKey,
      {
              cookies: {
                        getAll() {
                                    return store.getAll()
                        },
                        setAll(cookiesToSet) {
                                    try {
                                                  cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options))
                                    } catch {
                                                  // setAll called from Server Component - ignore
                                    }
                        },
              },
      },
        )
}
