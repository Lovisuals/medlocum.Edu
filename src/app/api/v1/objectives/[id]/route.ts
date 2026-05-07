import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: objectiveId } = await params;
  const uid = session.sub as string;
  const body = await req.json();

  const allowedFields = ['title', 'description', 'status', 'target_date'];
  const updates: string[] = [];
  const values: any[] = [objectiveId, uid];

  allowedFields.forEach((field, i) => {
    if (body[field] !== undefined) {
      updates.push(`${field} = $${values.length + 1}`);
      values.push(body[field]);
    }
  });

  if (updates.length === 0) return NextResponse.json({ error: 'No fields to update' }, { status: 400 });

  const result = await db.query(
    `UPDATE objectives SET ${updates.join(', ')} 
     WHERE id = $1 AND user_id = $2 RETURNING *`,
    values
  );

  if (!result.rows[0]) return NextResponse.json({ error: 'Objective not found' }, { status: 404 });

  return NextResponse.json(result.rows[0]);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromCookies();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id: objectiveId } = await params;
  const uid = session.sub as string;

  await db.query(`DELETE FROM objectives WHERE id = $1 AND user_id = $2`, [objectiveId, uid]);

  return new NextResponse(null, { status: 204 });
}
