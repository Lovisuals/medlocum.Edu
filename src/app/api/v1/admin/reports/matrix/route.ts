import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const result = await db.query(
    `SELECT u.id as "userId", u.first_name as "firstName", u.last_name as "lastName", u.job_title as "jobTitle",
            jsonb_object_agg(e.course_id, e.status) as enrolments
     FROM users u
     LEFT JOIN enrolments e ON e.user_id = u.id
     WHERE u.tenant_id = $1
     GROUP BY u.id, u.first_name, u.last_name, u.job_title`,
    [process.env.NEXT_PUBLIC_TENANT_ID || 'medlocumjobs']
  );

  return NextResponse.json(result.rows);
}
