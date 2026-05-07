import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'current';

  const result = await db.query(
    `SELECT id, title, description, status, target_date as "targetDate", created_at as "createdAt"
     FROM objectives
     WHERE user_id = $1 AND status = $2
     ORDER BY target_date ASC`,
    [uid, status]
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { title, description, target_date } = await req.json();

  if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 });

  const result = await db.query(
    `INSERT INTO objectives (user_id, title, description, target_date, status)
     VALUES ($1, $2, $3, $4, 'current') RETURNING *`,
    [uid, title, description, target_date]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
