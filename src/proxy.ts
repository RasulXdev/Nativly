import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

const protectedRoutes = [
  '/dashboard',
  '/tutors',
  '/schedule',
  '/lessons',
  '/messages',
  '/room',
  '/wallet',
  '/settings',
  '/tutor-dashboard',
  '/tutor-schedule',
  '/tutor-students',
  '/tutor-earnings',
  '/tutor-settings',
  '/admin',
]

const authRoutes = ['/login', '/register', '/forgot-password']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Strip locale prefix for route checking
  const pathnameWithoutLocale = pathname.replace(/^\/(az|en|ru)/, '') || '/'

  // Handle Supabase session refresh
  const { response, user } = await updateSession(request)

  // Check if it's a protected route
  const isProtected = protectedRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`)
  )

  // Check if it's an auth route
  const isAuthRoute = authRoutes.some(
    (route) =>
      pathnameWithoutLocale === route ||
      pathnameWithoutLocale.startsWith(`${route}/`)
  )

  // Redirect unauthenticated users from protected routes
  if (isProtected && !user) {
    const locale = pathname.split('/')[1] || 'az'
    const loginUrl = new URL(`/${locale}/login`, request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const locale = pathname.split('/')[1] || 'az'
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url))
  }

  // Apply intl middleware for locale routing
  const intlResponse = intlMiddleware(request)
  if (intlResponse) return intlResponse

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/',
    '/(az|en|ru)/:path*',
  ],
}
