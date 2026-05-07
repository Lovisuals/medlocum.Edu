import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: sessionId } = await params;
  const uid = session.sub as string;

  const result = await db.query(
    `SELECT * FROM ai_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, uid]
  );

  if (!result.rows[0]) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  }

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: sessionId } = await params;
  const uid = session.sub as string;

  await db.query(
    `DELETE FROM ai_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, uid]
  );

  return new NextResponse(null, { status: 204 });
}
