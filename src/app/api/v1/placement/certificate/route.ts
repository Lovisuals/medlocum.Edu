import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { issuePlacementReadinessCertificate } from '@/lib/services/CertificateService';

/**
 * GET /api/v1/placement/certificate
 * 
 * Generates and returns the Placement Readiness Certificate metadata.
 * In a real production app, this would generate a PDF via react-pdf or similar.
 * For now, it returns the metadata + QR code URL.
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userId = session.sub as string;
    const certificate = await issuePlacementReadinessCertificate(userId);

    return NextResponse.json(certificate);
  } catch (error: any) {
    console.error('Certificate Generation Error:', error);
    return NextResponse.json(
      { error: 'Failed to issue certificate', message: error.message },
      { status: 400 }
    );
  }
}
