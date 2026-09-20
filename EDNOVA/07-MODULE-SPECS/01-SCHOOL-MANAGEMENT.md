# Module Specification — School Management

| Field | Value |
|---|---|
| Document ID | MOD-SCH-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md |

## Purpose

Provide the tenant and academic structure required by every other domain.

## Actors

SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, and authorized staff.

## Requirements

REQ-FND-001 and REQ-FND-002: isolate schools and create School → Academic Year → Grade → Division → Subject.

## User stories

US-FND-001 and US-FND-002.

## User flow

Authorize school context → create or select academic year → create grades/divisions/subjects → validate parent relationships → save → review audit.

## Database entities

DB-FND-001: school, academic_year, grade, division, subject, school_settings, academic_calendar. Exact schema TBD.

## API requirements

API-FND-001 tenant context; API-FND-002 structure CRUD with authorization, validation, idempotency, and safe errors.

## UI requirements

Desktop-first administrative forms and lists with visible school/year context, parent-child navigation, validation, empty states, and confirmation for destructive or history-sensitive actions.

## Permissions

School-scoped capabilities; SUPER_ADMIN scope TBD; no client-supplied school ID may broaden access.

## Validation

Required names/keys, school ownership, valid year dates, uniqueness within parent, valid lifecycle transitions, and no orphan records. Exact constraints TBD.

## Error states

Unauthorized scope, duplicate record, invalid dates, missing parent, stale update, database failure, and partial operation must be clear and recoverable.

## Edge cases

Overlapping academic years, renamed divisions, archived subjects, transfer between divisions, and attempted cross-school references.

## Audit requirements

Log create/update/archive, actor, tenant, target, timestamp, decision, and before/after values where appropriate.

## Acceptance criteria

AC-FND-001 and AC-FND-002.

## Test cases

TC-FND-001 cross-tenant denial; TC-FND-004 valid hierarchy; TC-FND-005 duplicate/invalid parent handling; TC-SEC-001 authorization boundary.

