# EDNOVA Domain Architecture

| Field | Value |
|---|---|
| Document ID | ARCH-DOM-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-SYSTEM-ARCHITECTURE.md, 04-DATABASE/01-DATABASE-DESIGN.md, 07-MODULE-SPECS |

## Domain map

| Domain | Primary responsibility | Key relationships |
|---|---|---|
| School Management | Schools, years, grades, divisions, subjects, settings, calendar | Root tenant and academic context |
| People | Users, students, teachers, parents, relationships, enrollments, assignments | Identity and authorization scope |
| Schedule | Timetable, teacher/student/class schedules, events | Academic day and attendance context |
| Attendance | Daily records, windows, corrections, reports | Enrollment, schedule, audit |
| Daily Academics | Notes, lessons, topics, objectives, resources, homework | Learning loop |
| Assignments | Creation, distribution, submission, review, feedback, grades | Daily academics and learning |
| Projects | Milestones, groups, drafts, presentations, evaluation | Assignment/learning context |
| Examination | Questions, exams, attempts, answers, timer, results | Learning, authorization, audit |
| Learning | Curriculum, concepts, objectives, practice, revision, mastery, gaps | Notes, assignments, exams, attendance |
| Communication | Announcements, notifications, messages, parent communication | Role-scoped event delivery |
| Reporting | Attendance, assignment, exam, progress, class, school reports | Read models over authorized data |
| Security & Audit | Authentication, authorization, RLS, audit, security events | Cross-cutting control plane |
| Security & Gate Management | Future campus security, gates, visitors, vehicles, entry/exit, incidents, alerts, reports, provider integrations | Optional future boundary; must not couple directly to academic workflows |

## Core learning-loop relationships

Teaching produces Today's Notes and lessons. Notes reference topics, concepts, objectives, resources, and homework. Practice and assignments reference those learning objects. Assessments and exams produce results. Results identify gaps. Revision and reassessment update progress and mastery. Attendance is linked to missed classes and What I Missed. Exact entity cardinality is TBD in the database design.

## Module rules

- A module owns its business rules but may reference other modules through documented contracts.
- Shared identifiers carry tenant and scope context.
- Reporting is downstream from governed records; it must not become an alternate source of truth.
- Audit is not an excuse to expose sensitive history to unauthorized roles.

## Future Security & Gate Management boundary

This domain is FUTURE SCOPE ONLY and is not active in the current development phases. It should be isolated as a modular domain that shares only approved contracts for school, optional campus, person/guardian verification, notification, and audit context.

The future module may provide Security Staff login, role-based access, student/teacher/staff/visitor verification, digital gate entry/exit, visitor management, parent/guardian verification, QR/ID verification, visitor photo/basic details, vehicle entry/exit, authorized visitor/vehicle lists, emergency/security alerts, incident reporting, gate-wise monitoring, administrator notifications, history/reports, searchable logs, and multiple campuses/gates.

External security platforms, including MyGate, must connect through a provider-neutral secure integration layer. A provider adapter must isolate provider-specific authentication, field mapping, event/webhook handling, retries, deduplication, errors, and audit from the EDNOVA domain model.
