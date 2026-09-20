# Module Specification — Projects

| Field | Value |
|---|---|
| Document ID | MOD-PRJ-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 05-ASSIGNMENTS.md, 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md |

## Purpose

Support project milestones, student or group assignment, drafts, review, final submission, presentation, and evaluation.

## Actors

TEACHER, STUDENT, SCHOOL_ADMIN as approved.

## Requirements

REQ-PRJ-001.

## User stories

US-PRJ-001: As a student, I want project milestones and feedback, so that long-running work is clear. Detailed stories TBD.

## User flow

Create project → define milestones → assign student/group → collect draft → review → final submission → presentation → evaluate.

## Database entities

DB-PRJ-001: project, milestone, membership, draft, submission, presentation, evaluation.

## API requirements

API-PRJ-001: scoped project lifecycle, membership, submission, and evaluation with concurrency and audit handling.

## UI requirements

Timeline/milestone view, group membership clarity, draft/final distinction, reviewer feedback, presentation scheduling, and accessible status.

## Permissions

Teachers manage assigned projects; students manage permitted drafts/submissions; administrators oversee within capability; group members cannot see unrelated groups.

## Validation

Valid membership, milestone order, due dates, submission status, evaluation range, and group access.

## Error states

Invalid member, closed milestone, duplicate final, unauthorized peer data, stale review, and evaluation conflict.

## Edge cases

Student transfer, group change, absent presenter, milestone extension, partial group submission, and reassessment.

## Audit requirements

Record membership, milestone, draft, submission, presentation, evaluation, and approval changes.

## Acceptance criteria

AC-PRJ-001: Project lifecycle and group scope are testable; detailed thresholds and rubric policy TBD.

## Test cases

TC-PRJ-001 lifecycle; TC-PRJ-002 group isolation; TC-PRJ-003 final submission; TC-PRJ-004 evaluation/audit.

