import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export const createClient = async (cookieStore?: Awaited<ReturnType<typeof cookies>>) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) return null

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
    }
  )
}
