# Module Specification — People

| Field | Value |
|---|---|
| Document ID | MOD-PEO-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md |

## Purpose

Manage users, permanent student identities, teachers, parent/guardian relationships, enrollments, and teacher assignments.

## Actors

SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, PARENT/GUARDIAN.

## Requirements

REQ-FND-003, REQ-FND-004, and REQ-PEO-001.

## User stories

US-FND-003 and US-FND-004.

## User flow

Create or link user → establish identity → create relationship or assignment → enroll student for an academic year → review scope and history.

## Database entities

DB-PEO-001: user_profile, student, teacher, guardian_relationship, enrollment, teacher_assignment. Permanent identity and historical enrollment rules are required; field schema TBD.

## API requirements

API-PEO-001 identity/enrollment operations; relationship verification, scope checks, duplicate prevention, and safe export behavior.

## UI requirements

Search and detail views must show school/year context, identity versus enrollment distinction, relationship status, and history. Sensitive fields require capability checks.

## Permissions

School administrators manage school records; teachers see assigned people; parents see linked children; students see their own identity and permitted learning context.

## Validation

Identity uniqueness, valid relationship, school ownership, non-overlapping enrollment rules, assignment scope, and no historical overwrite.

## Error states

Duplicate identity, invalid relationship, overlapping enrollment, revoked access, unauthorized field, and stale update.

## Edge cases

Multiple guardians, one guardian linked to multiple children, transfers, withdrawn students, teacher reassignment, and historical year closure.

## Audit requirements

Audit identity changes, relationship changes, enrollment create/update/close, assignment changes, and access revocation.

## Acceptance criteria

AC-FND-003 and AC-FND-004.

## Test cases

TC-PEO-001 permanent identity; TC-PEO-002 historical enrollment; TC-PEO-003 relationship scope; TC-SEC-003 unauthorized person access.

