import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await db.query(
    `SELECT e.id, e.speciality, e.bio,
            u.first_name as "firstName", u.last_name as "lastName", u.avatar_url as "avatarUrl", u.job_title as "jobTitle"
     FROM experts e
     JOIN users u ON u.id = e.user_id
     WHERE e.tenant_id = $1
     ORDER BY e.sort_order ASC`,
    [process.env.NEXT_PUBLIC_TENANT_ID || 'medlocumjobs']
  );

  return NextResponse.json(result.rows);
}
