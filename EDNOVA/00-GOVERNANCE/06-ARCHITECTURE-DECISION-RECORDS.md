# EDNOVA Architecture Decision Records

| Field | Value |
|---|---|
| Document ID | GOV-ADR-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-MASTER-SDLC-PROMPT.md, 05-CHANGE-MANAGEMENT.md, 03-ARCHITECTURE/01-SYSTEM-ARCHITECTURE.md |

## ADR format

ADR-XXX
Title:
Context:
Problem:
Options:
Decision:
Reason:
Consequences:
Alternatives rejected:
Date:
Status:
Approver:

## Initial ADR register

### ADR-001 — Governing technology direction

- Title: Modular monolith with Next.js, React, TypeScript, Supabase, PostgreSQL, Auth, Storage, and RLS.
- Context: The governing prompt supplies this technology direction unless an approved ADR changes it.
- Problem: The repository has no implementation or configuration that validates the direction.
- Options: Adopt the governing direction; replace it; introduce additional infrastructure.
- Decision: PROPOSED baseline only; formal architecture review is required before implementation.
- Reason: This records the inherited constraint without silently treating it as an implementation decision.
- Consequences: Detailed system, data, security, deployment, and cost validation remain required.
- Alternatives rejected: None; no alternative has been evaluated.
- Date: 2026-09-21.
- Status: IN_REVIEW.
- Approver: TBD.

### ADR-003 — Provider-neutral Security & Gate Management boundary

- Title: Isolate future campus-security capabilities behind a modular provider adapter boundary.
- Context: Schools and colleges may later need gate operations and external security-platform connectivity, including a possible MyGate integration.
- Problem: A provider-specific integration or direct coupling to academic tables would create lock-in and increase security/privacy blast radius.
- Options: Build directly against one provider; add a provider-neutral adapter/integration layer; defer all extension planning.
- Decision: PROPOSED future architecture rule: reserve an isolated Security & Gate Management module with provider adapters, secure API/webhook ingress, explicit contracts, idempotency, retries, validation, and audit.
- Reason: Support multiple providers and preserve the academic core without authorizing implementation now.
- Consequences: Future design must define provider credentials, event mapping, tenant/campus/gate scope, retention, failure handling, and consent/privacy controls.
- Alternatives rejected: Direct MyGate coupling is rejected as the baseline because it would not support multiple providers.
- Date: 2026-09-21.
- Status: IN_REVIEW.
- Approver: TBD.

### ADR-002 — Permanent student identity with historical enrollment

- Title: Preserve one student identity across academic years.
- Context: The governing prompt requires history to remain connected rather than overwritten.
- Problem: Enrollment changes must not destroy historical context.
- Options: Permanent identity with versioned enrollments; new identity each year; overwrite current enrollment.
- Decision: PROPOSED requirement baseline: permanent identity with historical enrollment records.
- Reason: It is an explicit product constraint and supports learning history, parent access, reporting, and audit.
- Consequences: Data model, authorization, exports, deletion/anonymization, and migration rules must preserve history.
- Alternatives rejected: Overwriting history conflicts with the governing prompt.
- Date: 2026-09-21.
- Status: IN_REVIEW.
- Approver: TBD.
