import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: courseId } = await params;
  const uid = session.sub as string;

  const quiz = await db.query(
    `SELECT id, max_attempts, cooldown_hrs FROM quizzes WHERE course_id = $1`,
    [courseId]
  );

  if (!quiz.rows[0]) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const attempts = await db.query(
    `SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2`,
    [uid, quiz.rows[0].id]
  );

  if (parseInt(attempts.rows[0].count) >= quiz.rows[0].max_attempts) {
    return NextResponse.json({ error: 'Maximum attempts reached' }, { status: 403 });
  }

  const result = await db.query(
    `INSERT INTO quiz_attempts (user_id, quiz_id, started_at)
     VALUES ($1, $2, NOW()) RETURNING id`,
    [uid, quiz.rows[0].id]
  );

  return NextResponse.json({ attempt_id: result.rows[0].id });
}
