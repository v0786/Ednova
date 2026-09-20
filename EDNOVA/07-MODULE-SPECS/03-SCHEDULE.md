# Module Specification — Schedule

| Field | Value |
|---|---|
| Document ID | MOD-SCHD-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 06-UX/00-UX-ARCHITECTURE.md |

## Purpose

Represent timetable, teacher schedule, student schedule, class schedule, and events for the academic context.

## Actors

SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, PARENT/GUARDIAN as permitted.

## Requirements

REQ-SCH-001.

## User stories

US-SCH-001: As a teacher or student, I want my authorized schedule, so that I know the current academic context.

## User flow

Configure period/calendar → assign class, subject, division, and teacher → validate conflicts → publish → show role-scoped schedule.

## Database entities

DB-SCH-001: timetable, schedule_entry, class_schedule, event, academic_calendar reference. Exact recurrence and timezone model TBD.

## API requirements

API-SCH-001: scoped schedule read and administrative mutation; conflict detection and timezone handling required.

## UI requirements

Calendar/list views must show date, time, subject, class, division, teacher, and current scope, with accessible alternatives to visual calendar.

## Permissions

Administrators configure; teachers see assigned schedules; students see own schedule; parents see child-relevant schedule only if approved.

## Validation

Valid academic year, no unauthorized assignment, valid time ranges, timezone, conflict rules, and event visibility.

## Error states

Conflict, closed academic year, missing assignment, invalid date, stale publication, and unauthorized view.

## Edge cases

Substitution, cancellation, holidays, overlapping rooms or teachers, daylight/timezone changes, and schedule changes after attendance exists.

## Audit requirements

Record schedule publication, changes, cancellations, actor, reason, and affected scope.

## Acceptance criteria

AC-SCH-001: authorized users see only their schedule; conflicts are rejected or explicitly resolved. Detailed criteria TBD.

## Test cases

TC-SCH-001 scope; TC-SCH-002 conflict; TC-SCH-003 calendar/holiday; TC-SCH-004 substitution and audit.

