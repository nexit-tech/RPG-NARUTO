import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function decodeJWT(token: string) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authCookie = request.cookies.get('sb-auth-token');
  let user = null;

  if (authCookie) {
    try {
      const parsed = JSON.parse(decodeURIComponent(authCookie.value));
      user = decodeJWT(parsed.access_token);
    } catch {
      user = null;
    }
  }

  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const role = user.user_metadata?.role;

  if (pathname.startsWith('/adminpage') || pathname.startsWith('/admin-campanha')) {
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/player', request.url));
    }
  }

  if (pathname.startsWith('/player') && role === 'admin') {
    return NextResponse.redirect(new URL('/adminpage', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/adminpage/:path*',
    '/admin-campanha/:path*',
    '/player/:path*',
  ],
};