# Module Specification — Examination

| Field | Value |
|---|---|
| Document ID | MOD-EXAM-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 03-ARCHITECTURE/08-SECURITY-ARCHITECTURE.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md |

## Purpose

Provide controlled computer examinations from question bank through scheduling, attempt, evaluation, and result publication.

## Actors

TEACHER, PRINCIPAL/SCHOOL_ADMIN or approved coordinator, STUDENT, system.

## Requirements

REQ-EXAM-001 and REQ-SEC-001.

## User stories

US-EXAM-001.

## User flow

Create question → configure exam → schedule access window → eligible student enters → answer/autosave/flag → submit or auto-submit → evaluate → publish results → audit.

## Database entities

DB-EXAM-001: question, question_metadata, exam, section, exam_schedule, attempt, answer, autosave_state, result, publication_event.

## API requirements

API-EXAM-001: eligibility, start, autosave, resume, submit, evaluate, publish. Require server timer authority, idempotency, attempt limit, window checks, and safe retry behavior.

## UI requirements

Accessible question navigation, timer and save state, flag/review, interruption messaging, submission confirmation, and result publication state. No UI claim may imply cheat-proof behavior.

## Permissions

Authors manage authorized question/exam scope; students access only eligible scheduled attempts; evaluators see assigned responses; published results are read by authorized students/parents.

## Validation

Question metadata, marks, schedule, duration, attempt limit, eligibility, randomization settings, answer shape, timer, and result state.

## Error states

Outside window, no attempt, expired session, reconnect, autosave conflict, duplicate submission, timeout, unauthorized response, and publication failure.

## Edge cases

Refresh, network interruption, device change, timer drift, partial answers, manual evaluation, result correction, accommodation, and schedule changes.

## Audit requirements

Record access, start, autosave outcome, resume, flag, submit, timeout, evaluation, correction, publication, and security events. Monitoring/proctoring is not assumed.

## Acceptance criteria

AC-EXAM-001.

## Test cases

TC-EXAM-001 window/eligibility; TC-EXAM-002 autosave/interruption; TC-EXAM-003 duplicate/timeout; TC-EXAM-004 authorization and audit.

