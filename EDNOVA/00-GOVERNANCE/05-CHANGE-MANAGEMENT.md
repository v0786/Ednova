# EDNOVA Change Management

| Field | Value |
|---|---|
| Document ID | GOV-CHG-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-MASTER-SDLC-PROMPT.md, 06-ARCHITECTURE-DECISION-RECORDS.md |

## When a change request is required

Create a change request for changes to database schema, authorization, security, API contracts, existing workflows, phase boundaries, historical data, or architecture. Do not resolve conflicts by silently editing the requirement baseline.

## Change-request template

CR-XXX
Problem:
Requested Change:
Reason:
Affected Modules:
Architecture Impact:
Database Impact:
Security Impact:
Migration Required: YES/NO
Backward Compatibility:
Decision:
Approver:

## Initial change requests

### CR-001 — Role vocabulary alignment

- Problem: The governing prompt defines initial roles SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, and PARENT/GUARDIAN. The preserved legacy FRD defines five roles including IT Admin and omits PRINCIPAL.
- Requested Change: Decide whether IT Admin maps to SUPER_ADMIN, whether PRINCIPAL is a separate capability set, and whether any custom-role model is approved.
- Reason: Role vocabulary affects authentication, authorization, RLS, UI, and audit behavior.
- Affected Modules: People, Security & Audit, Authorization.
- Architecture Impact: Authorization model.
- Database Impact: User-role and capability entities.
- Security Impact: Privilege boundaries.
- Migration Required: TBD.
- Backward Compatibility: Legacy FRD identifiers/content remain preserved but are not authoritative.
- Decision: TBD.
- Approver: TBD.

### CR-006 — Future Security & Gate Management extension

- Problem: A future school/campus security capability requires Security Staff, gates, visitors, vehicles, entry/exit events, incidents, alerts, reports, and provider integrations, but it must not expand the active implementation phases.
- Requested Change: Record Security & Gate Management as a future modular domain and reserve extension points in roles, data, authorization, API, audit, and integration architecture.
- Reason: Preserve future extensibility without authorizing implementation or coupling EDNOVA to MyGate.
- Affected Modules: School Management extension boundary, People, Security & Audit, Communication, Reporting, future Security & Gate Management.
- Architecture Impact: Add an isolated module boundary and provider-neutral integration layer.
- Database Impact: Reserve future campus, gate, visitor, vehicle, gate-event, incident, provider, and synchronization entities; no migration is authorized now.
- Security Impact: Requires least-privilege Security Staff access, minimum disclosure, webhook authentication, replay protection, deduplication, privacy, and audit review.
- Migration Required: NO current migration; TBD for future implementation.
- Backward Compatibility: Existing academic modules and tenant hierarchy remain unchanged.
- Decision: FUTURE SCOPE ONLY; implementation deferred.
- Approver: TBD.

### CR-002 — Legacy module scope

- Problem: The preserved FRD includes Library and Finance, while the governing domain list does not include them as initial EDNOVA domains.
- Requested Change: Confirm whether Library and Finance are out of scope, future scope, or approved extensions.
- Reason: Scope and phase planning must not expand silently.
- Affected Modules: Product scope, reporting, people, communication.
- Architecture Impact: TBD pending decision.
- Database Impact: None if deferred; TBD otherwise.
- Security Impact: TBD.
- Migration Required: TBD.
- Backward Compatibility: Preserve legacy content as historical draft.
- Decision: TBD.
- Approver: TBD.

### CR-003 — Client/channel assumptions

- Problem: Legacy journeys assume a mobile app, push notifications, offline synchronization, SMS, camera checks, and several named device flows. The governing technology direction specifies a responsive web application and mobile-friendly workflows; no mobile application or provider is present in the repository.
- Requested Change: Confirm the supported channel and separately approve any native app, offline, push, SMS, or camera capabilities.
- Reason: Channel decisions affect UX, API, storage, privacy, cost, and test scope.
- Affected Modules: UX, Communication, Assignments, Examination.
- Architecture Impact: Client and integration boundaries.
- Database Impact: Notification/device data if approved.
- Security Impact: Device/session and privacy controls.
- Migration Required: TBD.
- Backward Compatibility: Legacy journey remains preserved and illustrative only.
- Decision: TBD.
- Approver: TBD.

### CR-004 — Exam monitoring claims

- Problem: Legacy journey opportunities mention AI proctoring and window-switching controls. The governing prompt requires actual controls to be documented and forbids claiming browser-based examination is cheat-proof.
- Requested Change: Define the allowed exam integrity controls, evidence, privacy basis, and human-review process.
- Reason: Security and privacy risk.
- Affected Modules: Examination, Security & Audit, Privacy.
- Architecture Impact: TBD.
- Database Impact: Audit/security event model if approved.
- Security Impact: High; requires review.
- Migration Required: TBD.
- Backward Compatibility: No monitoring control is assumed by bootstrap.
- Decision: TBD.
- Approver: TBD.

### CR-005 — Requirement identifier normalization

- Problem: The legacy FRD uses FR-* identifiers and references a missing EDP-001 BRD; the governing prompt requires stable identifiers such as REQ-* and traceability across artifacts.
- Requested Change: Approve a mapping from legacy FR-* IDs to canonical REQ-* IDs without destructive renumbering.
- Reason: Traceability and document dependencies are currently broken.
- Affected Modules: Requirements and discovery.
- Architecture Impact: None.
- Database Impact: None.
- Security Impact: None.
- Migration Required: NO.
- Backward Compatibility: Preserve legacy IDs in a mapping appendix.
- Decision: TBD.
- Approver: TBD.
