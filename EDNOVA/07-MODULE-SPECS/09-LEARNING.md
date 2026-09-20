# Module Specification — Learning

| Field | Value |
|---|---|
| Document ID | MOD-LEARN-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md |

## Purpose

Connect curriculum, concepts, objectives, practice, revision, mastery, progress, and What I Missed to academic evidence.

## Actors

TEACHER, STUDENT, PARENT/GUARDIAN where approved, SCHOOL_ADMIN.

## Requirements

REQ-LEARN-001 and REQ-ACA-001.

## User stories

US-ACA-001 and US-LEARN-001: As a student, I want learning gaps and revision connected to my work, so that I can improve.

## User flow

Define curriculum/objective → connect lesson/practice/assignment/assessment → record evidence → identify gap → assign revision → reassess → update progress.

## Database entities

DB-LEARN-001: curriculum, concept, objective, practice, revision, mastery, progress, learning_history, missed_class linkage.

## API requirements

API-LEARN-001: authorized progress read/write, evidence linkage, gap/revision workflow, and derived-view consistency.

## UI requirements

Subject/chapter/topic/objective views, progress indicators, gap explanation, revision actions, and What I Missed links to missed classes, notes, homework, assignments, resources, announcements, and deadlines.

## Permissions

Students see own progress; teachers see assigned students; parents see linked child summaries; administrators see authorized aggregates.

## Validation

Valid curriculum context, evidence ownership, objective linkage, status transitions, and no unsupported mastery inference.

## Error states

Missing evidence, stale progress, unauthorized student, unavailable resource, reassessment conflict, and derived-data delay.

## Edge cases

Absence, transfer, changed curriculum, multiple assessments, incomplete data, retake, and conflicting evidence.

## Audit requirements

Record progress evidence, gap/revision decisions, reassessment, and any manual override with actor and reason.

## Acceptance criteria

AC-LEARN-001: learning evidence remains traceable and What I Missed connects absence to authorized catch-up items; details TBD.

## Test cases

TC-LEARN-001 linkage; TC-LEARN-002 scope; TC-LEARN-003 absence/catch-up; TC-LEARN-004 reassessment.

