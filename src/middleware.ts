import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =====================================
  // 1. Next.js 内部・静的ファイルは完全スルー
  // =====================================
  if (
    pathname.startsWith('/_next') || 
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|webp|gif|woff|woff2|ttf|eot)$/i)
  ) {
    return NextResponse.next();
  }

  // =====================================
  // 2. 認証を除外するパス
  // =====================================
  const excludedPaths = ['/login', '/api'];
  const isExcluded = excludedPaths.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isExcluded) {
    return NextResponse.next();
  }

  // =====================================
  // 3. /admin パスの保護
  // =====================================
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('session');

    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // =====================================
  // 4. その他のパスは通す
  // =====================================
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
