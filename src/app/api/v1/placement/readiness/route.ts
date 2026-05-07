import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { checkPlacementReadiness } from '@/lib/services/ComplianceService';

/**
 * GET /api/v1/placement/readiness
 * 
 * Fetches the user's placement readiness status by running the multi-gate
 * compliance check (MDCN/NMCN license, CME units, ethics module, mandatory courses).
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.sub as string;
    const readiness = await checkPlacementReadiness(userId);

    return NextResponse.json({
      userId: readiness.userId,
      isReady: readiness.isReady,
      status: readiness.isReady ? 'READY' : 'NOT READY',
      blockers: readiness.blockers,
      complianceSnapshot: {
        license: {
          verified: readiness.licenseStatus?.status === 'verified',
          status: readiness.licenseStatus?.status || 'missing',
          body: readiness.licenseStatus?.body || 'PENDING',
          expiry: readiness.licenseStatus?.expiryDate,
          isExpired: readiness.licenseStatus?.isExpired || false,
        },
        cme: {
          earned: readiness.cmeStatus?.earned || 0,
          required: readiness.cmeStatus?.required || 0,
          isSufficient: readiness.cmeStatus?.isSufficient || false,
        },
        modules: {
          ethicsComplete: readiness.ethicsModuleComplete,
          mandatoryCoursesComplete: readiness.mandatoryCoursesComplete,
        }
      },
      assessedAt: readiness.assessedAt.toISOString(),
    });
  } catch (error: any) {
    console.error('Placement Readiness API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    );
  }
}
