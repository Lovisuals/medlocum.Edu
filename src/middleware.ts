import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/auth';

const publicPaths = ['/login', '/auth/callback'];
const apiPublicPaths = [
  '/api/v1/auth/login',
  '/api/v1/auth/sso',
  '/api/v1/auth/refresh',
  '/api/v1/auth/forgot-password',
  '/api/v1/auth/reset-password'
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();
  if (apiPublicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();

  const token = req.cookies.get('access_token')?.value;
  const headerToken = req.headers.get('authorization')?.replace('Bearer ', '');
  const tokenToVerify = headerToken || token;

  if (!tokenToVerify) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifyAccessToken(tokenToVerify);
  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)']
};
