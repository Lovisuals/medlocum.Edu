import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';
import { evaluateAdaptive, notifyManager } from '@/lib/quiz-engine';
import { invalidateDashboard } from '@/lib/cache';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: attemptId } = await params;
  const { responses } = await req.json();
  const uid = session.sub as string;

  const attempt = await db.query(
    `SELECT qa.*, qz.pass_mark, qz.max_attempts, qz.course_id
     FROM quiz_attempts qa
     JOIN quizzes qz ON qz.id = qa.quiz_id
     WHERE qa.id = $1 AND qa.user_id = $2`,
    [attemptId, uid]
  );
  if (!attempt.rows[0]) return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });

  const questions = await db.query(
    `SELECT q.id, q.body, q.explanation, q.difficulty,
            a.id AS correct_id, a.body AS correct_body
     FROM questions q
     JOIN answers a ON a.question_id = q.id AND a.is_correct = TRUE
     WHERE q.quiz_id = $1`,
    [attempt.rows[0].quiz_id]
  );

  let correct = 0;
  const wrongTopics: string[] = [];
  const feedback = questions.rows.map(q => {
    const ok = responses[q.id] === q.correct_id;
    if (ok) correct++;
    else wrongTopics.push(q.body.substring(0, 80));
    return {
      questionId: q.id,
      questionBody: q.body,
      userAnswerId: responses[q.id],
      correctAnswerId: q.correct_id,
      isCorrect: ok,
      explanation: q.explanation
    };
  });

  const score = Math.round((correct / questions.rows.length) * 100);
  const passed = score >= attempt.rows[0].pass_mark;

  const attemptCountRes = await db.query(
    `SELECT COUNT(*) FROM quiz_attempts WHERE user_id = $1 AND quiz_id = $2`,
    [uid, attempt.rows[0].quiz_id]
  );
  const attemptNum = parseInt(attemptCountRes.rows[0].count);

  await db.query(
    `UPDATE quiz_attempts SET score = $1, passed = $2, responses = $3, completed_at = NOW() WHERE id = $4`,
    [score, passed, JSON.stringify(responses), attemptId]
  );

  if (passed) {
    await db.query(
      `UPDATE enrolments SET status = 'completed', score = $1, completed_at = NOW()
       WHERE user_id = $2 AND course_id = $3`,
      [score, uid, attempt.rows[0].course_id]
    );
    await invalidateDashboard(uid);
  }

  const adaptive = evaluateAdaptive(score, attemptNum, attempt.rows[0].pass_mark, attempt.rows[0].max_attempts, wrongTopics);

  if (adaptive.notifyManager) {
    await notifyManager(uid, attempt.rows[0].course_id);
  }

  return NextResponse.json({ score, passed, feedback, adaptive });
}
