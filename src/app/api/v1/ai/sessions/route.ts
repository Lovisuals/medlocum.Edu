import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  const result = await db.query(
    `SELECT id, assistant_type, created_at, updated_at,
            jsonb_array_length(messages) as message_count
     FROM ai_sessions
     WHERE user_id = $1 ${type ? 'AND assistant_type = $2' : ''}
     ORDER BY updated_at DESC`,
    type ? [uid, type] : [uid]
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { assistant_type } = await req.json();

  const result = await db.query(
    `INSERT INTO ai_sessions (user_id, assistant_type, messages)
     VALUES ($1, $2, '[]') RETURNING id, assistant_type, created_at`,
    [uid, assistant_type || 'coaching_companion']
  );

  return NextResponse.json({ session_id: result.rows[0].id, ...result.rows[0] });
}
