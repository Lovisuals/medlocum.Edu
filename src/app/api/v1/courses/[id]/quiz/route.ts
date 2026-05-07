import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: courseId } = await params;

  const quiz = await db.query(
    `SELECT q.id, q.title, q.pass_mark as "passMark", q.max_attempts as "maxAttempts", q.cooldown_hrs as "cooldownHrs"
     FROM quizzes q
     WHERE q.course_id = $1`,
    [courseId]
  );

  if (!quiz.rows[0]) {
    return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
  }

  const questions = await db.query(
    `SELECT q.id, q.body, q.type, q.difficulty, q.explanation,
            (SELECT jsonb_agg(jsonb_build_object('id', a.id, 'body', a.body)) 
             FROM answers a WHERE a.question_id = q.id) as answers
     FROM questions q
     WHERE q.quiz_id = $1
     ORDER BY q.sort_order ASC`,
    [quiz.rows[0].id]
  );

  return NextResponse.json({
    ...quiz.rows[0],
    questions: questions.rows
  });
}
