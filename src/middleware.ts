/* eslint-disable @next/next/no-server-import-in-page */
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOCKED_COUNTRIES = [
  'US', // United States
  'UM', // United States Minor Outlying Islands
]

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(req: NextRequest) {
  const country = req.geo?.country || 'US'

  const isCountryBlocked = BLOCKED_COUNTRIES.includes(country)

  if (!isCountryBlocked || req.nextUrl.pathname === '/not-available') {
    return NextResponse.next()
  }

  return NextResponse.rewrite(new URL('/not-available', req.url))
}
