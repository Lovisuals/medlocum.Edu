# ENTERPRISE LMS IMPLEMENTATION BLUEPRINT (NIGERIAN MEDICAL ECOSYSTEM)

## 1. VISION & ARCHITECTURAL FOUNDATION
This blueprint transforms the current MedLocum Academy codebase into a scalable, enterprise-grade LMS tailored for the **Nigerian Medical Ecosystem**. The platform is designed to host 10,000+ active learners (Doctors, Nurses, AHPs) with zero performance degradation, strictly adhering to MDCN, NMCN, and NDPA (Nigeria Data Protection Act) requirements.

### Core Ecosystem Shift
- **Identity**: **Medical Locum Jobs (Nigeria)**.
- **UK Compliance (GMC/NMC/CQC)** → **Nigerian Compliance (MDCN/NMCN/FMoH)**.
- **UK Terminology (NHS/Locum)** → **Nigerian Terminology (Private/Public Hospitals, Residency, NYSC Doctors)**.
- **UK Data Protection (GDPR)** → **Nigeria Data Protection Act (NDPA)**.
- **Branding**: **MedLocum Jobs Original Brand (Blue & Green) / Premium Clinical Aesthetics**.

---

## 2. SURGICAL REFACTORING & CLEANUP
The codebase requires a transition from "prototype" to "enterprise" through strict decoupling and performance optimization.

### 2.1 Logic Decoupling
- Move all business logic from `/app` routes into `/lib/services`.
- Implement a `ComplianceService` to handle complex MDCN/NMCN logic centrally.
- Decouple AI Assistant logic into a pluggable provider pattern (OpenAI/Gemini/Anthropic).

### 2.2 Performance & Scalability
- **Redis Integration**: Use Redis for session management and caching course progress (100ms response time goal).
- **Asset Optimization**: Move all course thumbnails and SCORM assets to an Edge CDN (e.g., Cloudinary or AWS S3 with CloudFront).
- **Zustand for Client State**: Replace prop-drilling with Zustand for real-time progress tracking in the course player.

---

## 3. DATABASE MIGRATION BLUEPRINT
The database schema must be refactored to support Nigerian regulatory requirements and scalability.

### 3.1 Schema Refactoring (Prisma)
- **User Model Updates**:
    - Add `nin` (National ID) field (encrypted).
    - Add `licenseNumber` (MDCN/NMCN License) field.
    - Add `stateOfPractice` (Nigerian 36 states + FCT).
- **CPD Summary Table**:
    - Rename `nmcRequirement` to `nmcnRequirement`.
    - Rename `gmcRequirement` to `mdcnRequirement`.
    - Add `cmeUnits` (Continuing Medical Education Units) tracking.
- **License Verification Table**:
    - New table to track license verification status with regulatory bodies.

### 3.2 Data Handling & Security
- **Encryption**: Implement AES-256 encryption for PII (Personal Identifiable Information) including NIN and License numbers.
- **Data Residency**: Ensure PostgreSQL is hosted in a region that complies with Nigerian Data Protection laws (or use local cloud providers if required).
- **Audit Logs**: Implement a global `AuditLog` table to track every change to compliance records.

---

## 4. BACKEND WIRING & LOGIC
Every endpoint must be robust, rate-limited, and secure.

### 4.1 Authentication & Identity
- **SSO**: Implement Google/Microsoft SSO but prioritize **Nigerian Mobile Number (OTP)** login via Twilio/Termii for better accessibility.
- **Role-Based Access Control (RBAC)**: Strict hierarchy: `Learner`, `HospitalAdmin`, `RegulatoryOfficer`, `SuperAdmin`.

### 4.2 Compliance Matrix Logic
- **MDCN Gateway**: Logic that automatically unlocks "Placement Readiness" once the doctor achieves the required CME units and passes the "Ethics & Jurisprudence" module.
- **Certificate Generation**: Dynamic PDF generation using `react-pdf` with verifiable QR codes for Nigerian hospitals.

---

## 5. BRANDING & UI SYSTEM RECONFIGURATION
Enforcing the **Medical Locum Jobs** brand for the Nigerian market.

### 5.1 Color System
- **Primary**: `#2362EB` (MedLocum Blue).
- **Action**: `#34D399` (MedLocum Green).
- **Background**: `#FFFFFF` (Clinical White).
- **Text**: `#111827` (Deep Slate).

### 5.2 Typography
- **Headings**: `Outfit` (Bold, Modern).
- **Body**: `Inter` (High Readability).

---

## 6. ENTERPRISE SETUP GUIDE (ZERO PLACEHOLDERS)

### Step 1: Environment Configuration
```env
# Infrastructure
DATABASE_URL="postgresql://user:pass@host:5432/db"
REDIS_URL="redis://host:6379"
NEXTAUTH_SECRET="your-secret-key"

# Nigerian Ecosystem Settings
NEXT_PUBLIC_PLATFORM_NAME="Medical Locum Jobs Academy"
NEXT_PUBLIC_COUNTRY_CODE="NG"
NEXT_PUBLIC_COMPLIANCE_MODE="MDCN_NMCN"

# AI & Search
GEMINI_API_KEY="your-key"
ALGOLIA_APP_ID="your-id"
```

### Step 2: Deployment Strategy
- **Frontend/API**: Deploy on Vercel with Edge Functions for Nigerian regions.
- **Database**: Managed PostgreSQL (Railway/Neon).
- **Automation**: Use the command `npx prisma migrate deploy && npx prisma db seed && next start` as the build/start entry point to ensure the "Coded Database" is always loaded.
- **Worker**: Background worker (Inngest) for handling certificate generation and automated compliance emails.

---

## 7. CODER INSTRUCTIONS
1. **No Stubs**: Implement the full `ComplianceService.ts` before building the UI.
2. **Prisma First**: Run the migrations defined in `prisma/schema.prisma` before any API work.
3. **Pill Shapes**: Every UI element must follow the Pill-shape design language (border-radius: 9999px) for a premium feel.
4. **Error Boundaries**: Every course module must be wrapped in a robust Error Boundary to ensure learners never lose progress.

---
**ARCHITECT'S NOTE**: This platform is the digital backbone of Nigerian Medical Excellence. Treat every line of code with the seriousness of a surgical procedure.
