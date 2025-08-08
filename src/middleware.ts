import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith('/dashboard')) {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'no-cache');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
  ],
}