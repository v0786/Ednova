# Module Specification — Assignments

| Field | Value |
|---|---|
| Document ID | MOD-ASM-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 02-DISCOVERY/03-USER-JOURNEYS.md |

## Purpose

Manage assignment creation, distribution, submission, review, feedback, grades, and late submission.

## Actors

TEACHER, STUDENT, PARENT/GUARDIAN, SCHOOL_ADMIN as approved.

## Requirements

REQ-ASM-001.

## User stories

US-ASM-001: As a student, I want to submit authorized work and see a receipt. Teacher and parent stories are TBD.

## User flow

Draft → configure class/division/topic/instructions/dates/type/marks → publish/open → student views → submits → review/feedback/grade → complete or resubmission.

## Database entities

DB-ASM-001: assignment, distribution, submission, submission_version, review, feedback, grade, rubric, attachment reference.

## API requirements

API-ASM-001: lifecycle, submission, review, and grade operations with idempotency, due-date validation, file policy, and scope checks.

## UI requirements

Teacher editor, student detail/submission/receipt, reviewer queue, feedback, status and deadline indicators, and accessible file controls.

## Permissions

Teachers manage assigned class/subject; students submit only their own work; parents read linked child status if approved; publication and grading capabilities are explicit.

## Validation

Required title/instructions/context, valid date order, submission type, marks/rubric, file type/size, status transition, and late policy.

## Error states

Closed assignment, invalid type/file, duplicate submit, late policy conflict, unauthorized student, reviewer conflict, and upload failure.

## Edge cases

Resubmission, extension, group assignment, missing file, timezone/deadline boundary, withdrawn student, and teacher reassignment.

## Audit requirements

Audit publish, deadline change, submission version, review, grade, feedback, return, and resubmission decision.

## Acceptance criteria

AC-ASM-001: lifecycle, scoped submission, receipt, and review behavior pass after detailed criteria are approved.

## Test cases

TC-ASM-001 lifecycle; TC-ASM-002 file validation; TC-ASM-003 duplicate/late submission; TC-ASM-004 grading scope and audit.

