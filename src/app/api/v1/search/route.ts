import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const limit = parseInt(searchParams.get('limit') || '20');

  if (!q.trim()) return NextResponse.json({ total: 0, results: [] });

  const pattern = `%${q}%`;
  const courses = await db.query(
    `SELECT id, title, 'course' as type FROM courses
     WHERE title ILIKE $1 AND is_published = TRUE LIMIT $2`,
    [pattern, Math.ceil(limit / 2)]
  );
  const resources = await db.query(
    `SELECT id, title, 'resource' as type FROM resources
     WHERE title ILIKE $1 LIMIT $2`,
    [pattern, Math.floor(limit / 2)]
  );

  const results = [...courses.rows, ...resources.rows];
  return NextResponse.json({ total: results.length, results, query: q });
}
