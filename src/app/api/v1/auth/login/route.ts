import { NextRequest, NextResponse } from 'next/server';
import { createAccessToken, createRefreshToken } from '@/lib/auth';
import { db } from '@/lib/db';
import * as crypto from 'crypto';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
  }

  if (process.env.MOCK_MODE === 'true') {
    const mockPayload = { sub: 'mock-user-123', email: email.toLowerCase(), role: 'learner', tenantId: 'mock-tenant' };
    const accessToken = await createAccessToken(mockPayload);
    const refreshToken = await createRefreshToken(mockPayload);

    const res = NextResponse.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: 'mock-user-123',
        firstName: 'Review',
        lastName: 'Practitioner',
        email: email.toLowerCase(),
        role: 'learner',
        jobTitle: 'Medical Doctor',
        department: 'Clinical Medicine'
      }
    });

    res.cookies.set('access_token', accessToken, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 28800 });
    return res;
  }

  const users = await db.query(
    'SELECT * FROM users WHERE email = $1 AND is_active = TRUE AND tenant_id = $2',
    [email.toLowerCase(), process.env.NEXT_PUBLIC_TENANT_ID]
  );
  const user = users.rows[0];
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const hash = crypto.createHash('sha256').update(password).digest('hex');
  if (user.password_hash !== hash) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  await db.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

  const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenant_id };
  const accessToken = await createAccessToken(payload);
  const refreshToken = await createRefreshToken(payload);

  const res = NextResponse.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
      jobTitle: user.job_title,
      department: user.department
    }
  });

  res.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60
  });
  res.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60
  });

  return res;
}
