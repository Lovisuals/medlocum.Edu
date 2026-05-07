# IMPLEMENTATION GOVERNANCE & CONTROL PROTOCOL

To ensure the **Medical Locum Jobs Academy** is built with enterprise integrity and zero deviations from the [IMPLEMENTATION_BLUEPRINT.md](IMPLEMENTATION_BLUEPRINT.md), this protocol must be loaded by any AI agent or coder before executing a single line of code.

## 1. THE TRIPLE-LOCK CONSTRAINTS

### L1: THE SCHEMA LOCK (Data Integrity)
- **Rule**: No API or Frontend code may be written until the `prisma/schema.prisma` is validated against the Blueprint.
- **Constraint**: If a coder attempts to use a field not in the schema (e.g., `gdpr_status` instead of `ndpa_status`), the execution must HALT.
- **Verification**: Run `npx prisma validate` after every model change.

### L2: THE COMPLIANCE LOCK (Medical Logic)
- **Rule**: All compliance logic must reside in `@/lib/services/ComplianceService.ts`. No "inline" compliance checks in components.
- **Constraint**: Every compliance function must account for the **MDCN/NMCN** registration status.
- **Zero Stub Policy**: Use of `// TODO`, `/* Placeholder */`, or `throw new Error("Not implemented")` is a violation of this protocol. Every endpoint must be fully functional.

### L3: THE BRAND LOCK (Visual Integrity)
- **Rule**: Direct hex codes or ad-hoc Tailwind classes are FORBIDDEN in components.
- **Constraint**: All styling must use the CSS variables defined in `src/app/globals.css`.
- **UI Logic**: Any button not following the `radius-full` (pill shape) constraint must be refactored immediately.

---

## 2. AGENTIC DIRECTION (Directing the AI Coder)

To direct an AI coder to execute the plan without hallucination, use the following **Prompt Chain Logic**:

### Phase 1: Context Loading
"Read `IMPLEMENTATION_BLUEPRINT.md` and `GOVERNANCE.md`. Identify the Emerald/Gold branding tokens and the MDCN data models. Do not write code yet. Summarize the 3 most critical compliance requirements for a Nigerian Doctor."

### Phase 2: Atomic Generation
"Generate the `ComplianceService.ts` first. Ensure the `checkPlacementReadiness` function correctly filters for MDCN license verification and ethics module completion. Use absolute imports. No stubs."

### Phase 3: Gatekeeper Review
"Compare the generated code against Section 4.2 of the Blueprint. Does it handle QR code generation for Nigerian certificates? If not, rewrite it now."

---

## 3. AUTOMATED ENFORCEMENT (The "Governor" Script)

Add a `pre-commit` or `pre-build` script that scans the codebase for:
1.  **UK Keywords**: Scan for "NHS", "GMC", "CQC", "GDPR". If found, fail the build.
2.  **Stubs**: Scan for "TODO", "Placeholder". If found, fail the build.
3.  **Hex Codes**: Scan for hardcoded hex colors outside of `globals.css`.

---
**GOVERNANCE STATUS**: ACTIVE
**AUTHORITY**: MedLocum Jobs Nigeria Architecture Team
