import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;

  const result = await db.query(
    `SELECT id, title, goal, status, created_at as "createdAt"
     FROM learning_plans
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [uid]
  );

  return NextResponse.json(result.rows);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { goal } = await req.json();

  if (!goal) return NextResponse.json({ error: 'Goal is required' }, { status: 400 });

  // Note: In a real app, this would trigger an AI generation.
  // Here we insert the shell for the UI to then handle.
  const result = await db.query(
    `INSERT INTO learning_plans (user_id, goal, title)
     VALUES ($1, $2, $3) RETURNING id, title, goal, created_at as "createdAt"`,
    [uid, goal, `Plan for ${goal.substring(0, 30)}...`]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
