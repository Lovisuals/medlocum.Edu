import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const result = await db.query(
    `SELECT r.id, r.title, r.file_url as "fileUrl", r.file_type as "fileType",
            cat.name as category, cat.color_hex as "categoryColor"
     FROM resources r
     LEFT JOIN categories cat ON cat.id = r.category_id
     WHERE r.tenant_id = $1
     ORDER BY cat.sort_order ASC, r.title ASC`,
    [process.env.NEXT_PUBLIC_TENANT_ID || 'medlocumjobs']
  );

  return NextResponse.json(result.rows);
}
