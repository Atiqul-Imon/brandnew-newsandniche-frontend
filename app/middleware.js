import { NextResponse } from 'next/server';

// Optional: Memory monitoring (for development only)
function getMemoryUsage() {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const memUsage = process.memoryUsage();
    return {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      rss: Math.round(memUsage.rss / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024)
    };
  }
  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next();
  }

  // Memory monitoring (only in development)
  if (process.env.NODE_ENV === 'development') {
    const memory = getMemoryUsage();
    if (memory && memory.heapUsed > 400) { // 400MB threshold
      console.warn(`High memory usage: ${memory.heapUsed}MB`);
    }
  }

  // Add performance headers
  const response = NextResponse.next();
  response.headers.set('X-Response-Time', Date.now().toString());
  return response;
} 