import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Public paths — no auth required
const PUBLIC = ['/', '/login', '/signup', '/demo', '/pricing', '/docs']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (!req.auth && !isPublic) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth|api/chatbot).*)'],
}
