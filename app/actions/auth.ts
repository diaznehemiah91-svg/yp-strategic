'use server'

export async function registerUser(formData: FormData) {
  const email = formData.get('email') as string

  if (!email || !email.includes('@')) {
    return { success: false, error: 'Invalid email' }
  }

  // TODO: In production, save to database:
  // await db.user.create({ data: { email, createdAt: new Date() } })
  // Send verification email via Resend or similar

  console.log(`[AUTH] New operator registered: ${email}`)

  // Simulate network delay for authentic feel
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return { success: true, message: 'Registration successful' }
}
