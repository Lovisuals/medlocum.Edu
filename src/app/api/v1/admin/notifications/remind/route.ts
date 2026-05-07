import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  const session = await getSessionFromCookies();
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { userId, courseId, message } = await req.json();

  // This would typically queue a job for the worker
  console.log(`[REMIND] Admin ${session.sub} sent reminder to ${userId} for course ${courseId}: ${message}`);

  return NextResponse.json({ success: true, message: 'Reminder queued' });
}
