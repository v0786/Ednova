# EDNOVA Definition of Done

| Field | Value |
|---|---|
| Document ID | GOV-DOD-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-MASTER-SDLC-PROMPT.md, 03-TRACEABILITY-MATRIX.md, 05-CHANGE-MANAGEMENT.md |

## Feature-level completion

A feature is DONE only when all applicable items have evidence:

- Requirement, user story, acceptance criteria, UX flow, data model, API contract, authorization, UI specification, implementation, tests, acceptance, and documentation are traceable.
- Tenant and capability authorization are enforced server-side and at the database/RLS layer where applicable.
- Validation, constraints, error states, audit requirements, and historical-data behavior are documented and implemented.
- Unit, integration, E2E, and security tests pass where applicable. Performance and accessibility tests are included where applicable.
- No secrets, service-role credentials, hardcoded tenant identifiers, or client-only security decisions are introduced.
- Responsive and accessible behavior is verified for the supported web workflows.
- Known issues are recorded with severity and disposition.

## Phase-gate completion

A phase is COMPLETE only when its scope, documentation, database/API/UX artifacts, tests, security review, acceptance criteria, known issues, traceability, and sign-off are recorded. The relevant PHASE-n-SIGNOFF.md must exist and be approved.

## Documentation completion

Controlled documents must have metadata, stable identifiers, dependency references, evidence labels, and review status. A document is not approved merely because it exists.

## Bootstrap gate

The current bootstrap creates initial documentation and exposes missing information. It does not satisfy the Phase 1 implementation gate. Phase 1 remains DOCUMENTING until owners, decisions, detailed requirements, and acceptance evidence are available.

