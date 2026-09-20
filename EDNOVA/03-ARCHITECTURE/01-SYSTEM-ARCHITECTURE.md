# EDNOVA System Architecture

| Field | Value |
|---|---|
| Document ID | ARCH-SYS-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/03-SRS.md, 05-DOMAIN-ARCHITECTURE.md, 06-DATA-ARCHITECTURE.md, 08-SECURITY-ARCHITECTURE.md |

## Architecture status

PROPOSED design constraints inherited from the governing prompt. No implementation exists in the inspected repository and no architecture is validated.

## Target shape

User browser  
→ responsive Next.js/React/TypeScript application  
→ server/API or server-action boundary  
→ domain-oriented modules in a modular monolith  
→ Supabase Auth and server-side authorization  
→ PostgreSQL source of truth with RLS  
→ Supabase Storage for governed files  
→ audit and notification integration points

## Architectural principles

- Keep domain relationships connected around the learning loop.
- Use PostgreSQL as the source of truth for governed academic records.
- Enforce tenant and capability checks in application, server/API, database, and RLS layers.
- Prefer a modular monolith; do not introduce microservices without an approved ADR.
- Keep external providers optional until their purpose, privacy, cost, failure, and contract are approved.
- Treat client input and visibility as untrusted.
- Preserve historical records and audit evidence.

## Boundaries

| Boundary | Responsibility | Status |
|---|---|---|
| Web UI | Responsive workflows, accessibility, role-scoped presentation | Proposed |
| Server/API | Validation, authorization, orchestration, idempotency, errors | Proposed |
| Domain modules | Business rules and cross-domain relationships | Proposed |
| Auth | Authentication, sessions, reset, identity linkage | Governing direction; details TBD |
| PostgreSQL | Source of truth, constraints, history, RLS | Governing direction; schema TBD |
| Storage | Files and attachments with scoped access | Governing direction; policy TBD |
| Audit | Security/admin/academic event evidence | Required; model TBD |
| Integrations | Notifications and external services | TBD |
| Future campus-security integration | Provider-neutral adapter and authenticated webhook boundary for Security & Gate Management | Future / TBD; no provider dependency |

## Quality attributes

Security, privacy, auditability, scalability, testability, maintainability, accessibility, responsive behavior, backup, monitoring, and recovery are first-class requirements. Targets and measurement plans are TBD.

## Architecture decisions required

Formal review is required for tenant context propagation, role/capability model, storage access, notification delivery, exam consistency, deployment topology, backup/recovery, and data residency. See ADR-001 and CR-001 through CR-004.

## Future extension boundary

Security & Gate Management should be added as a separate domain module with contracts to the shared school/optional campus context, identity/guardian verification, notifications, reporting, and audit services. Future provider adapters should sit behind a secure integration layer so MyGate and other providers can be added or replaced without coupling provider schemas to academic modules. This is an architectural extension point only; no implementation or migration is authorized.
