# Module Specification — Attendance

| Field | Value |
|---|---|
| Document ID | MOD-ATT-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 02-DISCOVERY/06-ACCEPTANCE-CRITERIA.md, 03-ARCHITECTURE/08-SECURITY-ARCHITECTURE.md |

## Purpose

Record authorized attendance and preserve correction history and audit.

## Actors

TEACHER, SCHOOL_ADMIN, PRINCIPAL, STUDENT, PARENT/GUARDIAN, system.

## Requirements

REQ-ATT-001, REQ-ATT-002, and REQ-SEC-001.

## User stories

US-ATT-001 and US-ATT-002.

## User flow

Open valid window → load assigned roster → record PRESENT, ABSENT, LATE, HALF_DAY, or EXCUSED → validate → save idempotently → request correction if needed → approve/reject → report.

## Database entities

DB-ATT-001 attendance_record, attendance_status, attendance_window; DB-ATT-002 correction_request, decision, audit link.

## API requirements

API-ATT-001 record/read; API-ATT-002 correction and approval. Require server scope, window checks, duplicate prevention, idempotency, and audit.

## UI requirements

Fast roster entry, visible date/class/window, current saved state, clear exception status, correction reason, approval state, and accessible non-color indicators.

## Permissions

Teachers record only assigned classes; administrators approve within school capability; students/parents view only authorized records; no client-only authorization.

## Validation

Roster membership, window, supported status, one record per governed key, correction reason, decision authority, and stale-version handling.

## Error states

Window closed, unauthorized class, duplicate/conflict, invalid status, network retry, stale record, and approval already decided.

## Edge cases

Future statuses, half-day rules, excused evidence, schedule changes, transfer mid-year, correction race, and missing roster.

## Audit requirements

Retain original record, correction request, reason, decision, decision maker, timestamp, and audit event. Never silently rewrite history.

## Acceptance criteria

AC-ATT-001 and AC-ATT-002.

## Test cases

TC-ATT-001 valid record; TC-ATT-002 duplicate prevention; TC-ATT-003 unauthorized roster; TC-ATT-005 correction trail; TC-ATT-008 audit tamper denial.

