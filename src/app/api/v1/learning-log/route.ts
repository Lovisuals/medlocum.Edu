import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  const entries = await db.query(
    `SELECT id, title, description, category, duration_mins as "durationMins",
            learned_date as "learnedDate", entry_type as "entryType", course_id as "courseId"
     FROM learning_log_entries
     WHERE user_id = $1 AND learned_date BETWEEN $2 AND $3
     ORDER BY learned_date DESC`,
    [uid, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
  );

  const totalMins = entries.rows.reduce((sum: number, e: any) => sum + (e.durationMins || 0), 0);

  return NextResponse.json({ total_mins: totalMins, entries: entries.rows });
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const uid = session.sub as string;
  const { title, description, category, duration_mins, learned_date } = await req.json();

  if (!title || !learned_date) {
    return NextResponse.json({ error: 'Title and learned_date required' }, { status: 400 });
  }

  const result = await db.query(
    `INSERT INTO learning_log_entries (user_id, title, description, category, duration_mins, learned_date, entry_type)
     VALUES ($1, $2, $3, $4, $5, $6, 'manual') RETURNING *`,
    [uid, title, description, category, duration_mins, learned_date]
  );

  return NextResponse.json(result.rows[0], { status: 201 });
}
