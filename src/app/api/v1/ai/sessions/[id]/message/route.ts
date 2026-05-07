import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';
import { chat, detectMode } from '@/lib/ai/session-handler';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: sessionId } = await params;
  const { content } = await req.json();
  const uid = session.sub as string;

  const aiSession = await db.query(
    `SELECT * FROM ai_sessions WHERE id = $1 AND user_id = $2`,
    [sessionId, uid]
  );
  if (!aiSession.rows[0]) return NextResponse.json({ error: 'Session not found' }, { status: 404 });

  const userRow = await db.query(
    `SELECT u.*, 
            ARRAY(SELECT c.title FROM enrolments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = u.id AND e.status = 'overdue') as overdue_courses,
            ARRAY(SELECT c.title FROM enrolments e JOIN courses c ON c.id = e.course_id WHERE e.user_id = u.id AND e.status = 'completed') as completed_courses
     FROM users u WHERE u.id = $1`,
    [uid]
  );
  const user = userRow.rows[0];

  const history = (aiSession.rows[0].messages as Array<{ role: string; content: string }>).slice(-20);
  const ctx = {
    userId: uid,
    firstName: user.first_name,
    lastName: user.last_name,
    jobTitle: user.job_title || 'Healthcare Professional',
    department: user.department || '',
    overdueCourses: user.overdue_courses || [],
    enrolledCourses: [],
    completedCourses: user.completed_courses || [],
    objectives: [],
    difficultyProfile: {}
  };

  const mode = detectMode(content, aiSession.rows[0].assistant_type);
  const { reply, detectedMode } = await chat(history as any, content, ctx, mode);

  const updatedMessages = [
    ...aiSession.rows[0].messages,
    { role: 'user', content, timestamp: new Date().toISOString() },
    { role: 'assistant', content: reply, timestamp: new Date().toISOString() }
  ];

  await db.query(
    `UPDATE ai_sessions SET messages = $1, updated_at = NOW() WHERE id = $2`,
    [JSON.stringify(updatedMessages), sessionId]
  );

  return NextResponse.json({ reply, mode: detectedMode });
}
