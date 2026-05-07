import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { cacheGet, cacheSet } from '@/lib/cache';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const cacheKey = `catalogue:${category || 'all'}:${search || ''}`;

  const cached = await cacheGet<object>(cacheKey);
  if (cached && !search) return NextResponse.json(cached);

  const params: string[] = [];
  let where = `WHERE c.is_published = TRUE AND c.tenant_id = $1`;
  params.push(process.env.NEXT_PUBLIC_TENANT_ID || 'medlocumjobs');

  if (category) {
    params.push(category);
    where += ` AND cat.slug = $${params.length}`;
  }
  if (search) {
    params.push(`%${search}%`);
    where += ` AND (c.title ILIKE $${params.length} OR c.description ILIKE $${params.length})`;
  }

  const result = await db.query(
    `SELECT c.id, c.title, c.description, c.thumbnail_url as "thumbnailUrl",
            c.duration_mins as "durationMins", c.is_mandatory as "isMandatory",
            c.passing_score as "passingScore",
            cat.name as category, cat.slug as "categorySlug", cat.color_hex as "categoryColor"
     FROM courses c
     JOIN categories cat ON cat.id = c.category_id
     ${where}
     ORDER BY c.is_mandatory DESC, cat.sort_order ASC, c.title ASC`,
    params
  );

  const data = { courses: result.rows, total: result.rows.length };
  if (!search) await cacheSet(cacheKey, data, 1800);

  return NextResponse.json(data);
}
