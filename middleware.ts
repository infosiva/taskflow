import { auth } from '@/auth'
import { NextResponse } from 'next/server'

// Public paths — no auth required
const PUBLIC = ['/', '/login', '/signup', '/demo', '/pricing', '/docs', '/api/dev-login', '/admin']

export default auth((req) => {
  const { pathname } = req.nextUrl
  const host = req.headers.get('host') ?? ''
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1')
  const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith(p + '/'))

  // Dev bypass — on localhost, skip auth so boards are accessible without login
  if (isLocalhost && process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

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
