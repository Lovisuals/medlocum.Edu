import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: entryId } = await params;
  const uid = session.sub as string;

  await db.query(
    `DELETE FROM learning_log_entries WHERE id = $1 AND user_id = $2`,
    [entryId, uid]
  );

  return new NextResponse(null, { status: 204 });
}
