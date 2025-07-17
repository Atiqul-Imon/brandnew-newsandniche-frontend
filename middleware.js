import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Redirect /blogs/en or /blogs/bn to /en/blogs
  const match = pathname.match(/^\/blogs\/(en|bn)(\/.*)?$/);
  if (match) {
    const locale = match[1];
    const rest = match[2] || '';
    return NextResponse.redirect(new URL(`/${locale}/blogs${rest}`, request.url));
  }
  
  // Use next-intl middleware for locale handling
  return createMiddleware({
    locales: ['en', 'bn'],
    defaultLocale: 'en',
    localePrefix: 'always',
  })(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}; 