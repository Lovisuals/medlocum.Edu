import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { id: userId } = await params;
  const { courseId, dueDate } = await req.json();

  if (!courseId) return NextResponse.json({ error: 'courseId required' }, { status: 400 });

  await db.query(
    `INSERT INTO user_course_assignments (user_id, course_id, assigned_by, due_date)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, course_id) DO UPDATE SET due_date = $4`,
    [userId, courseId, session.sub, dueDate]
  );

  // Auto-enrol if not already
  await db.query(
    `INSERT INTO enrolments (user_id, course_id, status)
     VALUES ($1, $2, 'not_started')
     ON CONFLICT DO NOTHING`,
    [userId, courseId]
  );

  return NextResponse.json({ success: true });
}
