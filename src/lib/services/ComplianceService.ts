/**
 * ComplianceService.ts — Medical Locum Jobs Academy (Nigeria)
 * GOVERNANCE L2: All MDCN/NMCN compliance logic lives ONLY here.
 * Authority: MedLocum Jobs Nigeria Architecture Team
 */

import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';
import { db } from '@/lib/db';

// ─── Nigerian Regulatory Constants ────────────────────────────────────────────
const MDCN_CME_THRESHOLD = 50;   // Annual CME hours required for MDCN doctors
const NMCN_CME_THRESHOLD = 35;   // Annual CPD hours required for NMCN nurses
const ETHICS_MODULE_PATTERN = '%Ethics%Jurisprudence%';
const MDCN_LICENSE_REGEX = /^M\d{6}$/;
const NMCN_LICENSE_REGEX = /^N[M]?\/(19|20)\d{2}\/\d{3,6}$/;

// ─── AES-256-GCM Encryption (NDPA Compliance) ─────────────────────────────────
const RAW_SECRET = process.env.NIN_ENCRYPTION_SECRET ?? 'medlocum-ng-nin-aes-secret-key!';

function deriveKey(): Buffer {
  return scryptSync(RAW_SECRET, 'medlocum-ng-salt', 32);
}

/** Encrypts PII (NIN / license number) → `iv:tag:ciphertext` hex triplet */
export function encryptPII(plaintext: string): string {
  const key = deriveKey();
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  return `${iv.toString('hex')}:${cipher.getAuthTag().toString('hex')}:${enc.toString('hex')}`;
}

/** Decrypts a value produced by `encryptPII` */
export function decryptPII(ciphertext: string): string {
  const [ivHex, tagHex, encHex] = ciphertext.split(':');
  if (!ivHex || !tagHex || !encHex) throw new Error('ComplianceService: malformed PII ciphertext.');
  const decipher = createDecipheriv('aes-256-gcm', deriveKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encHex, 'hex')), decipher.final()]).toString('utf8');
}

// ─── License Format Validation ────────────────────────────────────────────────
export function isValidMdcnLicenseFormat(license: string): boolean {
  return MDCN_LICENSE_REGEX.test(license.trim().toUpperCase());
}

export function isValidNmcnLicenseFormat(license: string): boolean {
  return NMCN_LICENSE_REGEX.test(license.trim().toUpperCase());
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type RegulatoryBody = 'MDCN' | 'NMCN';

export interface LicenseVerificationStatus {
  body: RegulatoryBody;
  licenseNumber: string;
  status: 'pending' | 'verified' | 'rejected';
  isExpired: boolean;
  expiryDate: Date | null;
}

export interface CmeComplianceStatus {
  earned: number;
  required: number;
  isSufficient: boolean;
  year: number;
}

export interface PlacementReadinessResult {
  userId: string;
  isReady: boolean;
  blockers: string[];
  licenseStatus: LicenseVerificationStatus | null;
  cmeStatus: CmeComplianceStatus | null;
  ethicsModuleComplete: boolean;
  mandatoryCoursesComplete: boolean;
  assessedAt: Date;
}

// ─── Internal Helpers ─────────────────────────────────────────────────────────

async function getUserProfile(userId: string) {
  const r = await db.query<{ tenant_id: string; license_number: string | null }>(
    `SELECT tenant_id, license_number FROM users WHERE id = $1`,
    [userId],
  );
  if (!r.rows.length) return null;
  const { tenant_id, license_number } = r.rows[0];
  const body: RegulatoryBody =
    license_number?.trim().toUpperCase().startsWith('N') ? 'NMCN' : 'MDCN';
  return { tenantId: tenant_id, regulatoryBody: body, licenseNumber: license_number };
}

async function fetchLicenseStatus(userId: string): Promise<LicenseVerificationStatus | null> {
  const r = await db.query<{
    body: string; license_number: string; status: string; expiry_date: Date | null;
  }>(
    `SELECT body, license_number, status, expiry_date
     FROM license_verifications
     WHERE user_id = $1 AND body IN ('MDCN','NMCN')
     ORDER BY created_at DESC LIMIT 1`,
    [userId],
  );
  if (!r.rows.length) return null;
  const row = r.rows[0];
  return {
    body: row.body as RegulatoryBody,
    licenseNumber: row.license_number,
    status: row.status as 'pending' | 'verified' | 'rejected',
    isExpired: row.expiry_date ? new Date(row.expiry_date) < new Date() : false,
    expiryDate: row.expiry_date,
  };
}

async function fetchCmeStatus(userId: string, body: RegulatoryBody): Promise<CmeComplianceStatus> {
  const year = new Date().getFullYear();
  const r = await db.query<{ cme_units: string; mdcn_requirement: string; nmcn_requirement: string }>(
    `SELECT cme_units, mdcn_requirement, nmcn_requirement
     FROM cpd_summary WHERE user_id = $1 AND year = $2`,
    [userId, year],
  );
  const required = body === 'MDCN' ? MDCN_CME_THRESHOLD : NMCN_CME_THRESHOLD;
  if (!r.rows.length) return { earned: 0, required, isSufficient: false, year };
  const row = r.rows[0];
  const earned = parseFloat(row.cme_units);
  const reqFromDb = body === 'MDCN' ? parseFloat(row.mdcn_requirement) : parseFloat(row.nmcn_requirement);
  return { earned, required: reqFromDb, isSufficient: earned >= reqFromDb, year };
}

async function fetchEthicsCompletion(userId: string): Promise<boolean> {
  const r = await db.query<{ count: string }>(
    `SELECT COUNT(*) AS count FROM enrolments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.user_id = $1 AND e.status = 'completed' AND c.title ILIKE $2`,
    [userId, ETHICS_MODULE_PATTERN],
  );
  return parseInt(r.rows[0]?.count ?? '0', 10) > 0;
}

async function fetchMandatoryStatus(userId: string, tenantId: string) {
  const total = parseInt(
    (await db.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM courses
       WHERE tenant_id=$1 AND is_mandatory=true AND is_published=true`,
      [tenantId],
    )).rows[0]?.count ?? '0',
    10,
  );
  if (total === 0) return { complete: true, total: 0, done: 0 };
  const done = parseInt(
    (await db.query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM enrolments e
       JOIN courses c ON e.course_id = c.id
       WHERE e.user_id=$1 AND c.tenant_id=$2
         AND c.is_mandatory=true AND c.is_published=true AND e.status='completed'`,
      [userId, tenantId],
    )).rows[0]?.count ?? '0',
    10,
  );
  return { complete: done >= total, total, done };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * checkPlacementReadiness — Primary MDCN/NMCN compliance gate.
 *
 * Evaluates four criteria per GOVERNANCE.md L2 and Blueprint §4.2:
 *   1. MDCN/NMCN license must be `verified` and non-expired.
 *   2. Annual CME units must meet the regulatory threshold.
 *   3. "Ethics & Jurisprudence in Nigerian Medical Practice" must be completed.
 *   4. All tenant mandatory courses must be completed.
 *
 * Result is persisted to `placement_readiness` for audit purposes.
 * This is the SINGLE SOURCE OF TRUTH — no other module may override it.
 */
export async function checkPlacementReadiness(userId: string): Promise<PlacementReadinessResult> {
  const assessedAt = new Date();
  const blockers: string[] = [];

  const profile = await getUserProfile(userId);
  if (!profile) throw new Error(`ComplianceService: user not found — ${userId}`);
  const { tenantId, regulatoryBody } = profile;

  // Gate 1: License
  const licenseStatus = await fetchLicenseStatus(userId);
  if (!licenseStatus) {
    blockers.push(`No ${regulatoryBody} license on file. Submit your license for verification.`);
  } else if (licenseStatus.status === 'pending') {
    blockers.push(`${regulatoryBody} license (${licenseStatus.licenseNumber}) is pending verification. Allow 2–5 business days.`);
  } else if (licenseStatus.status === 'rejected') {
    blockers.push(`${regulatoryBody} license (${licenseStatus.licenseNumber}) was rejected. Contact support@medlocumjobs.ng.`);
  } else if (licenseStatus.isExpired) {
    blockers.push(`${regulatoryBody} license expired on ${licenseStatus.expiryDate?.toLocaleDateString('en-NG')}. Renew before placement.`);
  }

  // Gate 2: CME Units
  const cmeStatus = await fetchCmeStatus(userId, regulatoryBody);
  if (!cmeStatus.isSufficient) {
    const deficit = cmeStatus.required - cmeStatus.earned;
    blockers.push(`Insufficient CME: ${cmeStatus.earned}/${cmeStatus.required} units. Complete ${deficit} more unit(s).`);
  }

  // Gate 3: Ethics & Jurisprudence module
  const ethicsComplete = await fetchEthicsCompletion(userId);
  if (!ethicsComplete) {
    blockers.push('Complete the "Ethics & Jurisprudence in Nigerian Medical Practice" module to qualify.');
  }

  // Gate 4: Mandatory courses
  const mandatory = await fetchMandatoryStatus(userId, tenantId);
  if (!mandatory.complete) {
    blockers.push(`${mandatory.total - mandatory.done} mandatory course(s) remain incomplete.`);
  }

  const isReady = blockers.length === 0;

  // Persist assessment for audit trail
  await db.query(
    `INSERT INTO placement_readiness
       (user_id, is_ready, mandatory_complete, role_modules_complete, blockers, assessed_at, tenant_id)
     VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7)`,
    [userId, isReady, mandatory.done, ethicsComplete ? 1 : 0, JSON.stringify(blockers), assessedAt, tenantId],
  );

  return { userId, isReady, blockers, licenseStatus, cmeStatus, ethicsModuleComplete: ethicsComplete, mandatoryCoursesComplete: mandatory.complete, assessedAt };
}

/**
 * getLatestPlacementReadiness — Retrieves the last persisted assessment.
 * Used by dashboard widgets without re-running the full compliance evaluation.
 */
export async function getLatestPlacementReadiness(userId: string): Promise<{
  isReady: boolean; blockers: string[]; mandatoryComplete: number; roleModulesComplete: number; assessedAt: Date;
} | null> {
  const r = await db.query<{
    is_ready: boolean; blockers: unknown; mandatory_complete: number; role_modules_complete: number; assessed_at: Date;
  }>(
    `SELECT is_ready, blockers, mandatory_complete, role_modules_complete, assessed_at
     FROM placement_readiness WHERE user_id=$1 ORDER BY assessed_at DESC LIMIT 1`,
    [userId],
  );
  if (!r.rows.length) return null;
  const row = r.rows[0];
  return {
    isReady: row.is_ready,
    blockers: Array.isArray(row.blockers) ? (row.blockers as string[]) : [],
    mandatoryComplete: row.mandatory_complete,
    roleModulesComplete: row.role_modules_complete,
    assessedAt: row.assessed_at,
  };
}
