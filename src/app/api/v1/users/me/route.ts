import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { db } from '@/lib/db';
import { encryptPII, decryptPII } from '@/lib/services/ComplianceService';

export async function GET(req: NextRequest) {
  if (process.env.MOCK_MODE === 'true') {
    return NextResponse.json({
      firstName: 'Review',
      lastName: 'Practitioner',
      email: 'practitioner@example.ng',
      role: 'learner',
      jobTitle: 'Medical Doctor',
      department: 'Surgery',
      licenseNumber: 'MDCN/12345/TEMP'
    });
  }

  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const uid = session.sub as string;
    const result = await db.query(
      `SELECT id, first_name as "firstName", last_name as "lastName", email, role, job_title as "jobTitle", 
              department, avatar_url as "avatarUrl", nin, license_number as "licenseNumber"
       FROM users WHERE id = $1`,
      [uid]
    );

    if (!result.rows[0]) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const user = result.rows[0];
    
    // Decrypt PII for the owner (optional logic - usually we only show masked NIN)
    if (user.nin) {
      try { user.nin = decryptPII(user.nin); } catch { /* ignore if not encrypted yet */ }
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const uid = session.sub as string;
    const body = await req.json();
    const { firstName, lastName, jobTitle, department, nin, licenseNumber } = body;

    const encryptedNin = nin ? encryptPII(nin) : undefined;

    await db.query(
      `UPDATE users 
       SET first_name = COALESCE($1, first_name),
           last_name = COALESCE($2, last_name),
           job_title = COALESCE($3, job_title),
           department = COALESCE($4, department),
           nin = COALESCE($5, nin),
           license_number = COALESCE($6, license_number)
       WHERE id = $7`,
      [firstName, lastName, jobTitle, department, encryptedNin, licenseNumber, uid]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
