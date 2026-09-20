# Module Specification — Daily Academics

| Field | Value |
|---|---|
| Document ID | MOD-ACA-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 06-UX/00-UX-ARCHITECTURE.md |

## Purpose

Connect timetable and teaching activity to Today's Notes, lessons, topics, objectives, resources, and homework.

## Actors

TEACHER, STUDENT, SCHOOL_ADMIN, PARENT/GUARDIAN where approved.

## Requirements

REQ-ACA-001.

## User stories

US-ACA-001.

## User flow

Teacher selects authorized class/subject → records note fields → attaches approved resources → sets visibility → saves/publishes → authorized learner views related work.

## Database entities

DB-ACA-001: daily_note, lesson, topic, learning_objective, resource, homework, attachment reference.

## API requirements

API-ACA-001: draft/publish/read with scope checks, attachment authorization, visibility rules, and audit.

## UI requirements

Structured note editor for Subject, Topic, Summary, Concepts, Textbook Pages, Homework, Attachments, Additional Resources, and Visibility. Student dashboard must expose authorized notes and work.

## Permissions

Teachers manage assigned context; students read authorized content; parents see approved child-related content; administrators manage configuration within school scope.

## Validation

Required subject/topic/context, valid visibility, attachment policy, resource ownership, publish state, and date context.

## Error states

Missing context, invalid attachment, unauthorized resource, publish failure, stale draft, and inaccessible related work.

## Edge cases

Notes for canceled classes, corrections after publication, shared resources across sections, missing textbook pages, and student absence.

## Audit requirements

Record draft/publish/unpublish, visibility changes, attachment changes, and actor/scope.

## Acceptance criteria

AC-ACA-001.

## Test cases

TC-ACA-001 note creation; TC-ACA-002 visibility; TC-ACA-003 link to learning; TC-SEC-009 unauthorized resource access.

