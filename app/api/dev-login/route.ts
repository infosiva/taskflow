import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { users, sessions } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'crypto'

// DEV ONLY — auto-login as Siva without email. Never ships to production.
export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'dev only' }, { status: 403 })
  }

  // find or create siva user
  let [user] = await db.select().from(users).where(eq(users.email, 'info.siva@gmail.com'))
  if (!user) {
    const [created] = await db.insert(users).values({
      id: 'siva-dev',
      email: 'info.siva@gmail.com',
      name: 'Siva',
      emailVerified: new Date(),
    }).returning()
    user = created
  }

  // create a session
  const sessionToken = randomUUID()
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  await db.insert(sessions).values({
    sessionToken,
    userId: user.id,
    expires,
  }).onConflictDoNothing()

  const redirectTo = req.nextUrl.searchParams.get('to') ?? '/app'
  const res = NextResponse.redirect(new URL(redirectTo, req.url))

  // set the NextAuth session cookie
  const cookieName = process.env.NODE_ENV !== 'development'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'

  res.cookies.set(cookieName, sessionToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires,
  })

  return res
}
