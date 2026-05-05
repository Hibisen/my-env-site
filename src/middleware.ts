import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // 除外パス
  const excludedPaths = ['/login', '/api', '/functions', '/_next'];
  const isExcluded = excludedPaths.some((path) => pathname.startsWith(path));

  if (isExcluded) {
    return NextResponse.next();
  }

  // 保護されたパス
  const protectedPaths = ['/admin'];
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (isProtected) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
