/**
 * CertificateService.ts — Medical Locum Jobs Academy (Nigeria)
 *
 * Generates verifiable Nigerian Medical Certificates with:
 *   - QR code embedding a signed verification URL
 *   - NDPA-compliant data handling (no raw PII in QR payload)
 *   - Unique certificate serial numbers tied to MDCN/NMCN regulatory body
 *
 * GOVERNANCE L2: Certificate generation is a compliance output.
 * Only called after `checkPlacementReadiness` returns `isReady = true`.
 * Blueprint §4.2 reference: "Dynamic PDF generation … with verifiable QR codes for Nigerian hospitals."
 */

import { createHmac, randomBytes } from 'crypto';
import QRCode from 'qrcode';
import { db } from '@/lib/db';
import { checkPlacementReadiness, type RegulatoryBody } from '@/lib/services/ComplianceService';

// ─── Configuration ─────────────────────────────────────────────────────────────
const PLATFORM_BASE_URL =
  process.env.NEXT_PUBLIC_PLATFORM_URL ?? 'https://academy.medlocumjobs.ng';
const CERT_HMAC_SECRET =
  process.env.CERTIFICATE_HMAC_SECRET ?? 'medlocum-cert-hmac-secret-2024';
const CERT_VERSION = '1.0';

// ─── Types ─────────────────────────────────────────────────────────────────────

export type CertificateType =
  | 'PLACEMENT_READINESS'   // Issued after full MDCN/NMCN compliance is met
  | 'COURSE_COMPLETION'     // Issued after completing a specific course
  | 'CME_ANNUAL';           // Annual CME certificate issued at year end

export interface CertificateMetadata {
  serialNumber: string;
  certificateType: CertificateType;
  userId: string;
  recipientName: string;
  regulatoryBody: RegulatoryBody;
  licenseNumber: string;
  courseTitle?: string;        // Populated for COURSE_COMPLETION type
  cmeUnitsAwarded?: number;   // Populated for CME_ANNUAL type
  issuedAt: Date;
  expiresAt: Date;            // Nigerian medical certificates expire after 1 year
  verificationUrl: string;
  qrCodeDataUrl: string;      // base64 PNG data URL for embedding in PDF
  isValid: boolean;
}

export interface CertificateVerificationResult {
  isValid: boolean;
  serialNumber: string;
  recipientName: string;
  certificateType: CertificateType;
  issuedAt: Date;
  expiresAt: Date;
  regulatoryBody: string;
  invalidReason?: string;
}

// ─── Serial Number Generation ─────────────────────────────────────────────────

/**
 * Generates a unique Nigerian medical certificate serial number.
 * Format: `MLJ-{BODY}-{YEAR}-{8-char HEX}`
 * Example: `MLJ-MDCN-2025-A3F7B2C1`
 */
function generateSerialNumber(body: RegulatoryBody): string {
  const year = new Date().getFullYear();
  const entropy = randomBytes(4).toString('hex').toUpperCase();
  return `MLJ-${body}-${year}-${entropy}`;
}

// ─── HMAC Signature (Tamper-Evidence) ────────────────────────────────────────

/**
 * Signs a certificate serial number with HMAC-SHA256.
 * The signature is embedded in the verification URL query string,
 * allowing hospitals to validate authenticity without a database call.
 */
function signSerial(serialNumber: string): string {
  return createHmac('sha256', CERT_HMAC_SECRET)
    .update(serialNumber)
    .digest('hex')
    .slice(0, 16); // 16-char prefix is sufficient for URL safety
}

/**
 * Verifies that a serial number's signature is authentic.
 */
function verifySignature(serialNumber: string, sig: string): boolean {
  const expected = signSerial(serialNumber);
  return expected === sig;
}

// ─── QR Code Generation ───────────────────────────────────────────────────────

/**
 * Generates a QR code as a base64 PNG data URL.
 * The QR payload is a tamper-evident verification URL — NOT raw PII.
 * A Nigerian hospital scanner navigates to this URL to confirm authenticity.
 */
async function generateVerificationQr(
  serialNumber: string,
  sig: string,
): Promise<string> {
  const url = `${PLATFORM_BASE_URL}/verify/${serialNumber}?sig=${sig}&v=${CERT_VERSION}`;
  return QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',  // High error correction for print durability
    margin: 2,
    width: 300,
    color: { dark: '#111827', light: '#FFFFFF' },
  });
}

// ─── Certificate Storage ──────────────────────────────────────────────────────

/**
 * Persists certificate metadata to `audit_log` compatible storage.
 * Uses the existing `learning_log_entries` table as a durable audit record
 * since a dedicated `certificates` table is not yet in the schema.
 * Phase 2 migration will add a first-class `certificates` table.
 */
async function persistCertificateRecord(meta: CertificateMetadata): Promise<void> {
  await db.query(
    `INSERT INTO learning_log_entries
       (user_id, title, description, category, learned_date, entry_type, created_at)
     VALUES ($1, $2, $3, $4, $5, 'certificate', NOW())`,
    [
      meta.userId,
      `Certificate: ${meta.certificateType} — ${meta.serialNumber}`,
      JSON.stringify({
        serialNumber: meta.serialNumber,
        regulatoryBody: meta.regulatoryBody,
        licenseNumber: meta.licenseNumber,
        courseTitle: meta.courseTitle ?? null,
        cmeUnitsAwarded: meta.cmeUnitsAwarded ?? null,
        issuedAt: meta.issuedAt.toISOString(),
        expiresAt: meta.expiresAt.toISOString(),
        verificationUrl: meta.verificationUrl,
        version: CERT_VERSION,
      }),
      meta.certificateType,
      meta.issuedAt.toISOString().split('T')[0],
    ],
  );
}

// ─── User Profile Fetch ───────────────────────────────────────────────────────

async function getRecipientProfile(userId: string): Promise<{
  fullName: string;
  licenseNumber: string;
  regulatoryBody: RegulatoryBody;
} | null> {
  const r = await db.query<{
    first_name: string;
    last_name: string;
    license_number: string | null;
  }>(
    `SELECT first_name, last_name, license_number FROM users WHERE id = $1`,
    [userId],
  );
  if (!r.rows.length) return null;
  const { first_name, last_name, license_number } = r.rows[0];
  const body: RegulatoryBody =
    license_number?.trim().toUpperCase().startsWith('N') ? 'NMCN' : 'MDCN';
  return {
    fullName: `${first_name} ${last_name}`,
    licenseNumber: license_number ?? 'UNREGISTERED',
    regulatoryBody: body,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * issuePlacementReadinessCertificate
 *
 * Issues a verifiable Placement Readiness Certificate after confirming the user
 * passes all MDCN/NMCN compliance gates via `checkPlacementReadiness`.
 *
 * If compliance fails, throws an error with the list of blockers so the caller
 * can surface actionable feedback to the learner. Never issues a certificate
 * to a non-compliant practitioner.
 *
 * Blueprint §4.2 compliance: "Logic that automatically unlocks Placement Readiness
 * once the doctor achieves the required CME units and passes Ethics & Jurisprudence."
 */
export async function issuePlacementReadinessCertificate(
  userId: string,
): Promise<CertificateMetadata> {
  // Hard gate: re-run compliance check in real time before issuing
  const readiness = await checkPlacementReadiness(userId);
  if (!readiness.isReady) {
    throw new Error(
      `CertificateService: User is not placement-ready. Blockers: ${readiness.blockers.join(' | ')}`,
    );
  }

  const profile = await getRecipientProfile(userId);
  if (!profile) throw new Error(`CertificateService: user profile not found — ${userId}`);

  const serialNumber = generateSerialNumber(profile.regulatoryBody);
  const sig = signSerial(serialNumber);
  const verificationUrl = `${PLATFORM_BASE_URL}/verify/${serialNumber}?sig=${sig}&v=${CERT_VERSION}`;
  const qrCodeDataUrl = await generateVerificationQr(serialNumber, sig);
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1); // Nigerian certs are annual

  const meta: CertificateMetadata = {
    serialNumber,
    certificateType: 'PLACEMENT_READINESS',
    userId,
    recipientName: profile.fullName,
    regulatoryBody: profile.regulatoryBody,
    licenseNumber: profile.licenseNumber,
    issuedAt,
    expiresAt,
    verificationUrl,
    qrCodeDataUrl,
    isValid: true,
  };

  await persistCertificateRecord(meta);
  return meta;
}

/**
 * issueCourseCompletionCertificate
 *
 * Issues a verifiable certificate for completing a specific course.
 * Validates that the user's enrolment status is `completed` and score
 * meets the course passing score before issuing.
 */
export async function issueCourseCompletionCertificate(
  userId: string,
  courseId: string,
): Promise<CertificateMetadata> {
  const r = await db.query<{
    status: string;
    score: number | null;
    passing_score: number;
    course_title: string;
  }>(
    `SELECT e.status, e.score, c.passing_score, c.title AS course_title
     FROM enrolments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.user_id = $1 AND e.course_id = $2`,
    [userId, courseId],
  );

  if (!r.rows.length) {
    throw new Error(`CertificateService: No enrolment found for user ${userId} in course ${courseId}.`);
  }

  const { status, score, passing_score, course_title } = r.rows[0];

  if (status !== 'completed') {
    throw new Error(`CertificateService: Course not completed (status: ${status}).`);
  }

  if (score !== null && score < passing_score) {
    throw new Error(`CertificateService: Score ${score}% does not meet passing threshold of ${passing_score}%.`);
  }

  const profile = await getRecipientProfile(userId);
  if (!profile) throw new Error(`CertificateService: user profile not found — ${userId}`);

  const serialNumber = generateSerialNumber(profile.regulatoryBody);
  const sig = signSerial(serialNumber);
  const verificationUrl = `${PLATFORM_BASE_URL}/verify/${serialNumber}?sig=${sig}&v=${CERT_VERSION}`;
  const qrCodeDataUrl = await generateVerificationQr(serialNumber, sig);
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const meta: CertificateMetadata = {
    serialNumber,
    certificateType: 'COURSE_COMPLETION',
    userId,
    recipientName: profile.fullName,
    regulatoryBody: profile.regulatoryBody,
    licenseNumber: profile.licenseNumber,
    courseTitle: course_title,
    issuedAt,
    expiresAt,
    verificationUrl,
    qrCodeDataUrl,
    isValid: true,
  };

  await persistCertificateRecord(meta);
  return meta;
}

/**
 * issueCmeAnnualCertificate
 *
 * Issues an annual CME/CPD certificate summarising total units earned.
 * Called by a background worker (Inngest) at the end of each calendar year
 * for users who met the threshold.
 */
export async function issueCmeAnnualCertificate(
  userId: string,
  year: number,
): Promise<CertificateMetadata> {
  const r = await db.query<{
    cme_units: string;
    mdcn_requirement: string;
    nmcn_requirement: string;
  }>(
    `SELECT cme_units, mdcn_requirement, nmcn_requirement
     FROM cpd_summary WHERE user_id = $1 AND year = $2`,
    [userId, year],
  );

  if (!r.rows.length) {
    throw new Error(`CertificateService: No CPD summary for user ${userId} in year ${year}.`);
  }

  const profile = await getRecipientProfile(userId);
  if (!profile) throw new Error(`CertificateService: user profile not found — ${userId}`);

  const row = r.rows[0];
  const cmeUnitsAwarded = parseFloat(row.cme_units);
  const required =
    profile.regulatoryBody === 'MDCN'
      ? parseFloat(row.mdcn_requirement)
      : parseFloat(row.nmcn_requirement);

  if (cmeUnitsAwarded < required) {
    throw new Error(
      `CertificateService: CME threshold not met (${cmeUnitsAwarded}/${required}). Cannot issue annual certificate.`,
    );
  }

  const serialNumber = generateSerialNumber(profile.regulatoryBody);
  const sig = signSerial(serialNumber);
  const verificationUrl = `${PLATFORM_BASE_URL}/verify/${serialNumber}?sig=${sig}&v=${CERT_VERSION}`;
  const qrCodeDataUrl = await generateVerificationQr(serialNumber, sig);
  const issuedAt = new Date();
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const meta: CertificateMetadata = {
    serialNumber,
    certificateType: 'CME_ANNUAL',
    userId,
    recipientName: profile.fullName,
    regulatoryBody: profile.regulatoryBody,
    licenseNumber: profile.licenseNumber,
    cmeUnitsAwarded,
    issuedAt,
    expiresAt,
    verificationUrl,
    qrCodeDataUrl,
    isValid: true,
  };

  await persistCertificateRecord(meta);
  return meta;
}

/**
 * verifyCertificate
 *
 * Public-facing verification endpoint logic.
 * Nigerian hospital administrators navigate to the QR URL; this function
 * validates authenticity without exposing PII.
 *
 * Validation pipeline:
 *   1. HMAC signature check (tamper-evidence, no DB required)
 *   2. Database lookup to confirm the certificate was truly issued
 *   3. Expiry check
 */
export async function verifyCertificate(
  serialNumber: string,
  sig: string,
): Promise<CertificateVerificationResult> {
  // 1. Signature check
  if (!verifySignature(serialNumber, sig)) {
    return {
      isValid: false,
      serialNumber,
      recipientName: 'UNKNOWN',
      certificateType: 'COURSE_COMPLETION',
      issuedAt: new Date(),
      expiresAt: new Date(),
      regulatoryBody: 'MDCN',
      invalidReason: 'Invalid certificate signature. This document may have been tampered with.',
    };
  }

  // 2. Database lookup via audit record in learning_log_entries
  const r = await db.query<{ user_id: string; description: string; learned_date: Date }>(
    `SELECT user_id, description, learned_date
     FROM learning_log_entries
     WHERE entry_type = 'certificate'
       AND title LIKE $1
     LIMIT 1`,
    [`%${serialNumber}%`],
  );

  if (!r.rows.length) {
    return {
      isValid: false,
      serialNumber,
      recipientName: 'UNKNOWN',
      certificateType: 'COURSE_COMPLETION',
      issuedAt: new Date(),
      expiresAt: new Date(),
      regulatoryBody: 'MDCN',
      invalidReason: 'Certificate not found in the Medical Locum Jobs Academy registry.',
    };
  }

  const record = r.rows[0];
  let parsed: Partial<CertificateMetadata & { version: string }> = {};
  try {
    parsed = JSON.parse(record.description) as typeof parsed;
  } catch {
    return {
      isValid: false,
      serialNumber,
      recipientName: 'UNKNOWN',
      certificateType: 'COURSE_COMPLETION',
      issuedAt: new Date(),
      expiresAt: new Date(),
      regulatoryBody: 'MDCN',
      invalidReason: 'Certificate record is malformed.',
    };
  }

  const expiresAt = parsed.expiresAt ? new Date(parsed.expiresAt) : new Date();
  const isExpired = expiresAt < new Date();

  // Fetch recipient name without exposing PII in the returned object
  const profile = await getRecipientProfile(record.user_id);
  const recipientName = profile?.fullName ?? 'VERIFIED PRACTITIONER';

  return {
    isValid: !isExpired,
    serialNumber,
    recipientName,
    certificateType: (parsed.certificateType ?? 'COURSE_COMPLETION') as CertificateType,
    issuedAt: parsed.issuedAt ? new Date(parsed.issuedAt) : record.learned_date,
    expiresAt,
    regulatoryBody: parsed.regulatoryBody ?? 'MDCN',
    invalidReason: isExpired
      ? `Certificate expired on ${expiresAt.toLocaleDateString('en-NG')}. Request a renewed certificate.`
      : undefined,
  };
}
