# EDNOVA Functional Requirements Document

| Field | Value |
|---|---|
| Document ID | REQ-DOC-FRD-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-BRD.md, 03-SRS.md, 02-DISCOVERY/07-FUNCTIONAL-REQUIREMENTS.md |

## Scope

This canonical FRD decomposes the governing prompt into initial functional requirements. It covers the twelve governed domains and the seven phases. Detailed field definitions, jurisdiction-specific rules, and approved UI/API contracts remain TBD.

The earlier draft at 01-PRODUCT/FRD.md is preserved unchanged. Its FR-* identifiers, IT Admin role, Library and Finance scope, and mobile/SMS assumptions are not silently treated as the EDNOVA baseline; see CR-001 through CR-005.

## Functional requirement register

| ID | Title | Priority | Phase | Actor |
|---|---|---|---|---|
| REQ-FND-001 | Isolate school tenants across all layers | MUST | 1 | All roles |
| REQ-FND-002 | Create foundation hierarchy and enroll students | MUST | 1 | SCHOOL_ADMIN |
| REQ-FND-003 | Preserve student identity and historical enrollment | MUST | 1 | SCHOOL_ADMIN |
| REQ-FND-004 | Enforce role and capability permissions | MUST | 1 | All roles |
| REQ-PEO-001 | Manage people and relationships | MUST | 2 | SCHOOL_ADMIN |
| REQ-SCH-001 | Manage timetable and schedules | MUST | 3 | SCHOOL_ADMIN, TEACHER, STUDENT |
| REQ-ATT-001 | Record controlled attendance | MUST | 2 | TEACHER |
| REQ-ATT-002 | Preserve attendance corrections and audit | MUST | 2 | TEACHER, SCHOOL_ADMIN |
| REQ-ACA-001 | Connect Today's Notes to the learning loop | MUST | 3 | TEACHER, STUDENT |
| REQ-ASM-001 | Manage assignment lifecycle | MUST | 4 | TEACHER, STUDENT |
| REQ-PRJ-001 | Manage project milestones and evaluation | SHOULD | 4 | TEACHER, STUDENT |
| REQ-EXAM-001 | Manage controlled computer examinations | MUST | 5 | TEACHER, STUDENT |
| REQ-LEARN-001 | Track learning gaps and progress | MUST | 6 | TEACHER, STUDENT |
| REQ-COM-001 | Deliver governed academic communication | SHOULD | 3/7 | School users |
| REQ-REP-001 | Provide role-scoped reporting | MUST | 2-7 | Authorized users |
| REQ-SEC-001 | Record security and administrative audit events | MUST | 1-7 | System |
| REQ-PRIV-001 | Govern student-data privacy actions | MUST | 1-7 | System and operators |
| REQ-GATE-001 | Future Security & Gate Management boundary | FUTURE / TBD | Future | Security Staff, campus administrators |
| REQ-GATE-002 | Future provider-neutral security integration | FUTURE / TBD | Future | Platform operator |

## Requirements

### REQ-FND-001 — Isolate school tenants across all layers

Priority: MUST  
Actor: Any authenticated or unauthenticated request  
Precondition: A tenant context is required for tenant-scoped data.  
Description: Application, server/API, database, and RLS controls shall prevent cross-school access. The client is never trusted to enforce isolation.  
Acceptance criteria: A request using a different school identifier cannot read or mutate another school record; the denial is testable and auditable where appropriate.

### REQ-FND-002 — Create foundation hierarchy and enroll students

Priority: MUST  
Actor: SCHOOL_ADMIN  
Precondition: The administrator is authorized for the school.  
Description: Phase 1 shall allow creation of School, Academic Year, Grade, Division, Subject, Users, Students, and enrollments.  
Acceptance criteria: An administrator can complete the hierarchy without hardcoded IDs and can see the resulting enrollment.

### REQ-FND-003 — Preserve student identity and historical enrollment

Priority: MUST  
Actor: SCHOOL_ADMIN  
Precondition: A student identity exists.  
Description: Each academic-year enrollment is a historical record associated with the same permanent student identity.  
Acceptance criteria: Moving a student to a later year or division does not overwrite prior enrollment.

### REQ-FND-004 — Enforce role and capability permissions

Priority: MUST  
Actor: All roles  
Precondition: Role and scope have been assigned.  
Description: Initial roles and assignment scopes are documented and enforced outside the UI.  
Acceptance criteria: A teacher can access only authorized grade/division/subject records; parent access is limited to linked child records.

### REQ-ATT-001 — Record controlled attendance

Priority: MUST  
Actor: TEACHER  
Precondition: Teacher is assigned to the class and an attendance window is valid.  
Description: Record PRESENT, ABSENT, LATE, HALF_DAY, or EXCUSED and leave room for future statuses.  
Acceptance criteria: Only authorized students are displayed; existing attendance is shown; duplicate/conflicting records are prevented.

### REQ-ATT-002 — Preserve attendance corrections and audit

Priority: MUST  
Actor: TEACHER and SCHOOL_ADMIN  
Precondition: An original attendance record exists.  
Description: A correction preserves original record, correction request, decision, decision maker, timestamp, and audit log.  
Acceptance criteria: Approve/reject actions do not erase the prior state.

### REQ-ACA-001 — Connect Today's Notes to the learning loop

Priority: MUST  
Actor: TEACHER and STUDENT  
Precondition: Subject, class, topic, and learning context exist.  
Description: Today's Notes supports subject, topic, summary, concepts, textbook pages, homework, attachments, resources, and visibility, with links to learning and assessment.  
Acceptance criteria: A student can find the note and related work for an authorized class.

### REQ-ASM-001 — Manage assignment lifecycle

Priority: MUST  
Actor: TEACHER and STUDENT  
Precondition: Assignment scope and dates are valid.  
Description: Support creation, distribution, submission, review, feedback, grades, and late-submission handling.  
Acceptance criteria: Status transitions and due-date behavior are validated and auditable.

### REQ-EXAM-001 — Manage controlled computer examinations

Priority: MUST  
Actor: Exam-authorized teacher/coordinator and STUDENT  
Precondition: Exam is scheduled and the student is eligible.  
Description: Support access windows, attempt limits, timer authority, auto-save, auto-submit, review/flag, result integrity, and audit.  
Acceptance criteria: Refresh, interruption, duplicate submission, timer, and unauthorized access scenarios have defined behavior; no cheat-proof claim is made.

### REQ-SEC-001 — Record security and administrative audit events

Priority: MUST  
Actor: System  
Precondition: A governed action occurs.  
Description: Capture authentication, authorization, security events, administrative activity, and relevant record changes.  
Acceptance criteria: Audit data is protected from ordinary user mutation and has retention rules marked TBD until approved.

## Status

The register is ready for review, not implementation. Requirements outside the initial baseline, exact validation rules, error copy, and all detailed acceptance cases remain TBD.

## Future module boundary

Security & Gate Management is a future domain only. It is not included in the active Phase 1-7 implementation gate and does not authorize MyGate or any other external integration. Its extension points are documented in 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md, and 07-MODULE-SPECS/13-SECURITY-GATE-MANAGEMENT.md.
