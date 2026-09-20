# EDNOVA Software Requirements Specification

| Field | Value |
|---|---|
| Document ID | REQ-DOC-SRS-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-BRD.md, 02-FRD.md, 02-DISCOVERY/08-NON-FUNCTIONAL-REQUIREMENTS.md, 03-ARCHITECTURE/01-SYSTEM-ARCHITECTURE.md |

## Purpose

This SRS translates the governing product direction into system-level constraints for design and implementation. It is intentionally design-stage: the repository has no code or runtime configuration to validate.

## System boundary

EDNOVA is a responsive web application for a multi-school academic operating system. The proposed platform boundary includes web UI, server/API or server-action boundary, authentication, authorization, domain services, PostgreSQL source of truth, storage, audit, and notification integration points. External identity, email/SMS/push, payment, government, native-app, and third-party learning integrations are TBD and are not assumed.

Future Security & Gate Management is an optional modular boundary. It may reference shared school, campus, person, and audit context through documented contracts, but it must not require a redesign of the academic core. MyGate or another provider may connect only through a secure integration layer after separate approval.

## System requirements

| ID | Requirement | Status |
|---|---|---|
| REQ-SYS-001 | Use Next.js, React, and TypeScript for the frontend unless an approved ADR changes the direction. | PROPOSED |
| REQ-SYS-002 | Use Supabase, PostgreSQL, Supabase Auth, Supabase Storage, and PostgreSQL RLS unless an approved ADR changes the direction. | PROPOSED |
| REQ-SYS-003 | Implement a modular monolith with domain-oriented modules and a server/API boundary. | PROPOSED |
| REQ-SYS-004 | Treat PostgreSQL as the source of truth for governed academic records. | PROPOSED |
| REQ-SYS-005 | Maintain tenant context and capability checks on every protected operation. | MUST |
| REQ-SYS-006 | Preserve historical enrollment and audit history. | MUST |
| REQ-SYS-007 | Expose behavior through documented contracts before implementation. | MUST |
| REQ-SYS-008 | Reserve an isolated, provider-neutral extension boundary for future Security & Gate Management. | FUTURE / TBD |

## Data and security constraints

- School isolation is required at application, server/API, database, and RLS layers.
- Client-provided tenant, class, teacher, or student identifiers are untrusted.
- Service-role credentials must never be exposed to the client.
- Inputs, files, session behavior, exam access, and rate limits require explicit validation and documentation.
- Student-data access, retention, export, modification, deletion/anonymization, and parent access are governed requirements; jurisdictional details are TBD.

## Operational constraints

Availability target, recovery objectives, concurrency target, monitoring, logging, deployment topology, supported browsers, data residency, and backup provider are TBD. No production readiness claim is made.

## Acceptance of this SRS

Approval requires named owners, resolved change requests, reviewed architecture, detailed Phase 1 schema/RLS/API contracts, and a testable requirements baseline.
