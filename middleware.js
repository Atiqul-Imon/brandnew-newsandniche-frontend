import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Force redirect to /en when accessing root domain
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/en', request.url));
  }
  
  // Redirect /blogs/en or /blogs/bn to /en/blogs
  const match = pathname.match(/^\/blogs\/(en|bn)(\/.*)?$/);
  if (match) {
    const locale = match[1];
    const rest = match[2] || '';
    return NextResponse.redirect(new URL(`/${locale}/blogs${rest}`, request.url));
  }
  
  // Protect guest/sponsored submission routes (require token in localStorage handled client-side, but add server path guard for SSR)
  const protectedPaths = [/^\/en\/(guest-post|sponsored-post)(\/edit\/.+)?$/];
  if (protectedPaths.some((re) => re.test(pathname))) {
    // On the server we can't read localStorage; do a basic redirect to login with next param
    // We let client-side guard finalize after hydration
    const token = request.cookies.get('token');
    if (!token) {
      const url = new URL(`/en/login?next=${encodeURIComponent(pathname)}`, request.url);
      return NextResponse.redirect(url);
    }
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