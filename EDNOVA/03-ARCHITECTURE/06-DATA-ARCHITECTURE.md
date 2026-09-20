# EDNOVA Database Architecture

| Field | Value |
|---|---|
| Document ID | ARCH-DATA-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-SYSTEM-ARCHITECTURE.md, 03-DATABASE/01-DATABASE-DESIGN.md, 03-DATABASE/05-RLS-POLICIES.md |

## Design position

PostgreSQL is the proposed source of truth. Supabase provides the proposed database, Auth, Storage, and RLS platform direction. No schema, migration, or RLS policy exists in the repository.

## Required data invariants

- Every tenant-scoped record is associated with a school.
- Academic context follows School → Academic Year → Grade → Division → Student Enrollment.
- A student has a permanent identity; enrollments are historical records.
- Assignment and teacher scopes are explicit; access is not inferred from UI.
- Attendance correction appends a request and decision trail without erasing the original.
- Exam attempts, answers, autosave state, submissions, and result publication are integrity-sensitive.
- Audit records are protected and linked to the actor, time, action, target, result, and relevant change context.

## Initial entity areas

| ID | Entity area | Examples | State |
|---|---|---|---|
| DB-FND-001 | Tenant and academic structure | school, academic_year, grade, division, subject | Proposed |
| DB-FND-002 | Enrollment | student, enrollment, teacher_assignment | Proposed |
| DB-PEO-001 | People and relationships | user, teacher, parent, guardian relationship | Proposed |
| DB-SCH-001 | Schedule | timetable, class_schedule, event | Proposed |
| DB-ATT-001 | Attendance | attendance_record, attendance_window | Proposed |
| DB-ATT-002 | Attendance history | correction_request, decision, audit link | Proposed |
| DB-ACA-001 | Daily academics | note, lesson, topic, objective, resource, homework | Proposed |
| DB-ASM-001 | Assignments | assignment, distribution, submission, feedback, grade | Proposed |
| DB-PRJ-001 | Projects | project, milestone, membership, evaluation | Proposed |
| DB-EXAM-001 | Examination | question, exam, attempt, answer, result | Proposed |
| DB-LEARN-001 | Learning | curriculum, concept, practice, revision, mastery | Proposed |
| DB-COM-001 | Communication | announcement, notification, message | Proposed |
| DB-REP-001 | Reporting | authorized report projections/definitions | Proposed |
| DB-SEC-001 | Security and audit | role, capability, audit_event, security_event | Proposed |
| DB-GATE-001 | Future campus structure | campus, gate, gate_scope | Future / TBD |
| DB-GATE-002 | Future visitor management | visitor, visitor_photo, authorized_visitor | Future / TBD |
| DB-GATE-003 | Future entry/exit events | gate_event, verification_event, entry_exit_record | Future / TBD |
| DB-GATE-004 | Future vehicle management | vehicle, authorized_vehicle, vehicle_event | Future / TBD |
| DB-GATE-005 | Future incidents and alerts | security_incident, alert, notification reference | Future / TBD |
| DB-GATE-006 | Future provider integration | integration_provider, provider_mapping, webhook_event, sync_attempt | Future / TBD |

## Schema work required before implementation

Define keys, tenant columns, foreign keys, uniqueness, status histories, temporal rules, soft-delete/anonymization semantics, file references, indexes, RLS policies, migrations, retention, backup, and restore behavior. Detailed documents are not yet present and remain TBD.

## Future extension points

The academic tenant hierarchy remains the root. A future campus entity may be an optional school child, with gates scoped to a campus. Security events should reference a tenant, campus, gate, actor/subject reference where permitted, visitor or vehicle reference where applicable, and an immutable event identity. Visitor photos and basic details require minimum-necessary collection, access controls, retention, and deletion/anonymization policy.

Provider data must not become the academic source of truth. Store provider identity, mapping, synchronization state, webhook/event identity, validation result, retry state, and audit references in an integration boundary. Use idempotency and unique provider-event keys to prevent duplicate records. No migration or external provider schema is authorized now.
