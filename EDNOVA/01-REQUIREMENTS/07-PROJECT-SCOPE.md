# EDNOVA Project Scope

| Field | Value |
|---|---|
| Document ID | REQ-SCOPE-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-BRD.md, 02-FRD.md, 04-PROJECT-CHARTER.md, 00-GOVERNANCE/05-CHANGE-MANAGEMENT.md |

## In scope

- A multi-school academic operating system.
- School → Academic Year → Grade → Division → Student Enrollment.
- Initial roles SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, PARENT/GUARDIAN.
- The twelve governed domains: school management, people, schedule, attendance, daily academics, assignments, projects, examination, learning, communication, reporting, and security/audit.
- Future extension domain: Security & Gate Management for schools and colleges, isolated from the active phase scope and not scheduled for initial implementation.
- The seven development phases and their documented gates.
- Responsive web application, modular monolith, PostgreSQL source of truth, authentication, storage, and RLS direction.

## Phase boundaries

Phase 1 is foundation. Phase 2 adds students, teachers, relationships, assignments, and attendance. Phase 3 adds daily academic workflow. Phase 4 adds assignments and projects. Phase 5 adds computer examination. Phase 6 adds learning and progress. Phase 7 adds production, parent, and school platform requirements.

## Out of scope until approved

Native mobile applications, offline synchronization, push/SMS providers, AI features, proctoring/camera monitoring, library, finance, government-report integrations, payments, external LMS/LTI integrations, Security & Gate Management implementation, MyGate integration, other external security providers, and custom school-specific requirements are not part of the approved bootstrap scope. They may be added only through review and change management.

## Scope rules

- No feature enters implementation without requirements, UX, data, API, security, test, and acceptance coverage.
- Existing legacy drafts are inputs, not automatic scope.
- A change request is required for phase expansion or architecture/schema/security changes.
