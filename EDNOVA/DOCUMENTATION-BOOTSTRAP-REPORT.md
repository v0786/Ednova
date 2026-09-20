# EDNOVA Documentation Bootstrap Report

| Field | Value |
|---|---|
| Document ID | GOV-BOOT-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-GOVERNANCE/00-MASTER-SDLC-PROMPT.md, 00-GOVERNANCE/02-DOCUMENT-INDEX.md, 00-GOVERNANCE/CURRENT-PHASE.md |

## Outcome

The EDNOVA documentation bootstrap first action is complete as an initial working baseline. No application features were implemented. The repository is not ready for Phase 1 implementation because required product, ownership, architecture, security, privacy, API, data, and acceptance decisions remain open.

## Repository inspected

Inspection date: 2026-09-21.

- Workspace root: D:/Ednova.
- The requested /docs/EDNOVA/00-GOVERNANCE/MASTER-SDLC-PROMPT.md was not available as an absolute Windows path.
- The governing prompt was found at D:/Ednova/MASTER-SDLC-PROMPT.md and copied without content changes to docs/EDNOVA/00-GOVERNANCE/00-MASTER-SDLC-PROMPT.md and the requested compatibility path docs/EDNOVA/00-GOVERNANCE/MASTER-SDLC-PROMPT.md.
- The workspace is not a Git repository; no branch, commit, or Git status baseline is available.
- The repository contains no application source code, package manifest, lockfile, database migration, Supabase configuration, environment template, test suite, CI/CD configuration, deployment configuration, or infrastructure configuration.
- The only pre-existing project documentation files found were docs/EDNOVA/01-PRODUCT/FRD.md and docs/EDNOVA/02-DISCOVERY/USER-JOURNEYS.md.

## Existing documentation discovered

### docs/EDNOVA/01-PRODUCT/FRD.md

This is a DRAFT with EDP-002 metadata and a detailed functional register. It contains useful domain ideas but also includes unapproved or conflicting material: IT Admin instead of the governing initial role vocabulary, Library and optional Finance modules, mobile/SMS assumptions, and a reference to a missing EDP-001 BRD. It was preserved unchanged.

### docs/EDNOVA/02-DISCOVERY/USER-JOURNEYS.md

This is a DRAFT with EDD-003 metadata and eight detailed journeys. It contains useful workflow prompts but uses illustrative names, dates, counts, mobile-app/push/offline/SMS/camera assumptions, AI opportunities, and example operational metrics that are not validated by the governing prompt. It was preserved unchanged.

## Existing implementation discovered

None. No feature, schema, API, UI, test, deployment, or runtime implementation was found. No application tests were executable.

## Documentation structure created

The complete top-level documentation structure from the governing prompt was created under docs/EDNOVA/00-GOVERNANCE through docs/EDNOVA/13-MAINTENANCE. The existing 01-PRODUCT and 02-DISCOVERY directories were not deleted or renamed.

## Documents created

### Governance

- 00-GOVERNANCE/00-MASTER-SDLC-PROMPT.md
- 00-GOVERNANCE/MASTER-SDLC-PROMPT.md
- 00-GOVERNANCE/01-DOCUMENT-CONTROL.md
- 00-GOVERNANCE/02-DOCUMENT-INDEX.md
- 00-GOVERNANCE/03-TRACEABILITY-MATRIX.md
- 00-GOVERNANCE/04-DEFINITION-OF-DONE.md
- 00-GOVERNANCE/05-CHANGE-MANAGEMENT.md
- 00-GOVERNANCE/06-ARCHITECTURE-DECISION-RECORDS.md
- 00-GOVERNANCE/CURRENT-PHASE.md

### Requirements

- 01-REQUIREMENTS/01-BRD.md
- 01-REQUIREMENTS/02-FRD.md
- 01-REQUIREMENTS/03-SRS.md
- 01-REQUIREMENTS/04-PROJECT-CHARTER.md
- 01-REQUIREMENTS/05-FEASIBILITY-STUDY.md
- 01-REQUIREMENTS/06-COST-ESTIMATION.md
- 01-REQUIREMENTS/07-PROJECT-SCOPE.md

### Discovery

- 02-DISCOVERY/01-PROBLEM-STATEMENT.md
- 02-DISCOVERY/02-USERS-AND-PERSONAS.md
- 02-DISCOVERY/03-USER-JOURNEYS.md
- 02-DISCOVERY/04-USE-CASES.md
- 02-DISCOVERY/05-USER-STORIES.md
- 02-DISCOVERY/06-ACCEPTANCE-CRITERIA.md
- 02-DISCOVERY/07-FUNCTIONAL-REQUIREMENTS.md
- 02-DISCOVERY/08-NON-FUNCTIONAL-REQUIREMENTS.md

### Architecture and UX

- 03-ARCHITECTURE/01-SYSTEM-ARCHITECTURE.md
- 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md
- 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md
- 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md
- 03-ARCHITECTURE/08-SECURITY-ARCHITECTURE.md
- 06-UX/00-UX-ARCHITECTURE.md

### API, QA, and project management

- 05-API/01-API-STANDARDS.md
- 09-QA/01-QA-STRATEGY.md
- 09-QA/02-TEST-STRATEGY.md
- 10-PROJECT-MANAGEMENT/01-PROJECT-PLAN.md
- 10-PROJECT-MANAGEMENT/04-RISK-REGISTER.md

### Module specifications

- 07-MODULE-SPECS/01-SCHOOL-MANAGEMENT.md
- 07-MODULE-SPECS/02-PEOPLE.md
- 07-MODULE-SPECS/03-SCHEDULE.md
- 07-MODULE-SPECS/04-ATTENDANCE.md
- 07-MODULE-SPECS/05-DAILY-ACADEMICS.md
- 07-MODULE-SPECS/06-ASSIGNMENTS.md
- 07-MODULE-SPECS/07-PROJECTS.md
- 07-MODULE-SPECS/08-EXAMINATION.md
- 07-MODULE-SPECS/09-LEARNING.md
- 07-MODULE-SPECS/10-COMMUNICATION.md
- 07-MODULE-SPECS/11-REPORTING.md
- 07-MODULE-SPECS/12-SECURITY-AUDIT.md

### Report

- DOCUMENTATION-BOOTSTRAP-REPORT.md

## Documents updated

None. Existing FRD and user-journeys drafts were intentionally preserved unchanged. The governing prompt was copied to the canonical and requested compatibility paths; the source file at the repository root was not modified.

## Missing information

- Product owner, architecture owner, security/privacy owner, QA/UAT owner, delivery owner, and approvers.
- First-school segment, geography, curriculum, academic calendar, terminology, and operating workflows.
- Role/capability matrix, SUPER_ADMIN break-glass policy, PRINCIPAL responsibilities, teacher assignment rules, and guardian verification.
- Privacy jurisdiction, legal basis, consent, retention, export, correction, deletion/anonymization, data residency, and data-subject request process.
- Expected schools, users, records, files, concurrent exams, workload patterns, performance targets, availability, RPO/RTO, SLA, and supported browsers/devices.
- Exact Phase 1 fields, constraints, migrations, RLS policies, API routes/contracts, UI designs, test data, test environments, and acceptance evidence.
- Authentication/reset/MFA details, file types/limits, notification channels, storage policy, logging/monitoring, deployment, backup, incident response, and support model.
- Budget, staffing, schedule, vendors, integrations, release model, and school onboarding plan.

## Assumptions recorded

The following are labeled PROPOSED or ASSUMED in the generated documents and require review:

- The master prompt’s Next.js/React/TypeScript, Supabase/PostgreSQL/Auth/Storage/RLS, responsive web, and modular-monolith direction is the initial architecture baseline.
- PostgreSQL is the source of truth for governed academic records.
- Initial roles use the master prompt vocabulary.
- A permanent student identity with historical enrollments is required.
- Native mobile, offline, push, SMS, AI, camera, proctoring, Library, Finance, payments, government integrations, and other legacy additions are not assumed in the initial scope.
- Exact design details are TBD where their dependencies are incomplete.

## Conflicts and change requests

- CR-001: Legacy IT Admin/five-role vocabulary conflicts with the governing initial roles.
- CR-002: Legacy Library and Finance scope is not in the governing initial domain list.
- CR-003: Legacy mobile app, push, offline, SMS, camera, and provider assumptions conflict with the unconfirmed responsive-web baseline.
- CR-004: Legacy AI/proctoring opportunities require explicit security/privacy decisions and cannot imply cheat-proof examinations.
- CR-005: Legacy FR-* IDs and missing EDP-001 BRD break the canonical REQ-* traceability baseline.

The full change-request records are in 00-GOVERNANCE/05-CHANGE-MANAGEMENT.md. Initial ADR records are in 00-GOVERNANCE/06-ARCHITECTURE-DECISION-RECORDS.md.

## Risks

The highest risks are tenant isolation/RLS failure, unclear authorization, mishandling of student data, unapproved scope growth, historical data loss, underspecified exam integrity, absent performance targets, and absent decision owners. The initial register is in 10-PROJECT-MANAGEMENT/04-RISK-REGISTER.md.

## Verification performed

- Repository file inventory: completed.
- Existing documentation review: completed for the two discovered project drafts.
- Directory bootstrap: completed.
- Initial document generation: completed.
- Application build/test/runtime verification: not applicable; no implementation or test suite exists.
- Git branch/commit verification: unavailable; workspace is not a Git repository.
- Browser, deployment, Supabase, database, security, performance, and UAT verification: not performed and not claimed.

## Recommended next step

Review and approve this bootstrap baseline with named owners. Resolve CR-001 through CR-005. Then complete the Phase 1 Foundation design package: detailed requirements and acceptance criteria, role/capability matrix, tenant-safe data model, RLS policies, API contracts, UX flows, security/privacy decisions, synthetic test data, and a Phase 1 test plan. Do not implement application features until the Phase 1 gate is approved.

## Current phase

Phase 1 — Foundation.

Phase status: DOCUMENTING. Implementation status: NOT_STARTED.

## Current phase readiness

NOT READY FOR IMPLEMENTATION.

Documentation bootstrap readiness: INITIAL BASELINE CREATED.  
Phase 1 requirements readiness: INCOMPLETE.  
Phase 1 implementation readiness: BLOCKED pending review and missing information above.  
Phase 1 sign-off: NOT CREATED and NOT APPROVED.

## Post-bootstrap future-scope update — 2026-09-21

Security & Gate Management was added as a FUTURE SCOPE ONLY module for schools and colleges. The update adds:

- 07-MODULE-SPECS/13-SECURITY-GATE-MANAGEMENT.md.
- Future requirement identifiers REQ-GATE-001 and REQ-GATE-002.
- Future campus, gate, visitor, entry/exit, vehicle, incident, alert, provider, webhook, and synchronization extension points.
- Future SECURITY_STAFF and CAMPUS_SECURITY_ADMIN role boundaries.
- Provider-neutral integration guidance for MyGate or other approved providers.
- CR-006, ADR-003, risk RISK-011, and future traceability rows.

This update does not change the active phase, does not authorize database migrations, and does not implement MyGate or any external security API.
