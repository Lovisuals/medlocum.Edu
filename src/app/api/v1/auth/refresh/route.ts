import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, createAccessToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const { refresh_token } = await req.json();
  if (!refresh_token) {
    return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
  }

  const payload = await verifyRefreshToken(refresh_token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
  }

  const accessToken = await createAccessToken({
    sub: payload.sub,
    email: payload.email,
    role: payload.role,
    tenantId: payload.tenantId
  });

  const res = NextResponse.json({ access_token: accessToken });
  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60
  });

  return res;
}
