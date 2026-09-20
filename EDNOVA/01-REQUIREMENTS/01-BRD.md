# EDNOVA Business Requirements Document

| Field | Value |
|---|---|
| Document ID | REQ-DOC-BRD-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-GOVERNANCE/00-MASTER-SDLC-PROMPT.md, 01-REQUIREMENTS/02-FRD.md, 02-DISCOVERY/01-PROBLEM-STATEMENT.md |

## Evidence and scope

KNOWN content in this document comes from the governing EDNOVA prompt. Stakeholder interviews, school process evidence, regulatory jurisdiction, commercial model, budget, and implementation evidence are TBD. This is a business baseline, not an approval.

## Product vision

EDNOVA is a Digital Academic Operating System for Schools. It connects school structure, teachers, students, timetable, attendance, Today's Notes, assignments, projects, computer exams, results, learning gaps, revision, progress, parents, and school management in one integrated academic system.

The core loop is:

TEACH → TODAY'S NOTES → LEARN → PRACTICE → ASSIGNMENT → ASSESSMENT → IDENTIFY LEARNING GAPS → REVISION → RE-ASSESSMENT → MASTERY

## Business problem

Schools need connected academic records and workflows rather than isolated tools. The exact current-state process, baseline metrics, school segment, geography, and buying process are not available in the repository and must be validated with stakeholders.

## Business objectives

- Provide one connected academic record across school structure, enrollment, learning, assessment, and progress.
- Preserve a permanent student identity and historical enrollment across academic years.
- Give each authorized role only the school, class, subject, or child access appropriate to its capability.
- Support a phased path from foundation through production, parent access, and school operations.
- Make security, privacy, auditability, testing, and traceability part of the product rather than post-release work.

## Business requirements

### REQ-BIZ-001 — Integrated academic operating system

Priority: MUST  
Actor: School management and academic users  
Precondition: The platform has configured school and academic structure.  
Description: EDNOVA shall connect the learning loop and the related academic entities instead of delivering isolated modules.  
Acceptance criteria: A later approved design can trace teaching activity to learning, practice, assignments, assessment, learning gaps, revision, and re-assessment. Detailed entity and workflow definitions are TBD.

### REQ-BIZ-002 — Multi-school isolation

Priority: MUST  
Actor: All users  
Precondition: A user belongs to, or is authorized across, a school tenant.  
Description: Every school must be isolated at application, server/API, database, and RLS layers.  
Acceptance criteria: Cross-school access is denied even when a client supplies another school identifier. Test data and implementation are TBD.

### REQ-BIZ-003 — Academic hierarchy

Priority: MUST  
Actor: School administrator  
Precondition: An authorized administrator is signed in.  
Description: The platform shall support School → Academic Year → Grade → Division → Student Enrollment.  
Acceptance criteria: Phase 1 administration can create this hierarchy and enroll students without hardcoded identifiers.

### REQ-BIZ-004 — Historical student identity

Priority: MUST  
Actor: School administrator and authorized academic users  
Precondition: A student identity exists.  
Description: The student identity remains connected across academic years; historical enrollment is not overwritten.  
Acceptance criteria: A student can have distinct year/grade/division enrollments while retaining one identity. Exact transfer and deletion rules are TBD.

### REQ-BIZ-005 — Role and capability access

Priority: MUST  
Actor: Platform and school administrators  
Precondition: A user has an approved role and scope.  
Description: Initial roles are SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, and PARENT/GUARDIAN. Every role requires documented permissions, with capability checks where appropriate.  
Acceptance criteria: A teacher assigned to a grade, division, and subject cannot automatically access unrelated student records.

### REQ-BIZ-006 — Auditable academic records

Priority: MUST  
Actor: School management  
Precondition: A record-changing operation occurs.  
Description: Attendance corrections, administrative activity, security events, and other governed changes require auditability.  
Acceptance criteria: The final audit model records actor, time, target, action, result, and relevant before/after information where required. Exact retention is TBD.

### REQ-BIZ-007 — Privacy of student data

Priority: MUST  
Actor: EDNOVA operators and schools  
Precondition: Student data is collected or processed.  
Description: EDNOVA shall document data collected, purpose, access, retention, export, modification, deletion/anonymization, and parent/teacher/admin access.  
Acceptance criteria: No unnecessary personal information is collected; jurisdiction and legal basis remain TBD.

### REQ-BIZ-008 — Phase-gated delivery

Priority: MUST  
Actor: Product and engineering governance  
Precondition: A phase has a defined scope and gate.  
Description: Implementation shall proceed only after the relevant requirements, design, security, tests, acceptance, and sign-off are sufficiently defined.  
Acceptance criteria: Phase 2 cannot begin until Phase 1 acceptance tests pass and the Phase 1 gate is recorded.

## Stakeholders

| Stakeholder group | Concern | Named stakeholder |
|---|---|---|
| Platform operator | Tenant lifecycle, security, support, operations | TBD |
| School administrator | School setup, users, records, reports | TBD |
| Principal | Academic oversight and school performance | TBD |
| Teacher | Teaching, attendance, assignments, assessment | TBD |
| Student | Learning, practice, submissions, exams, progress | TBD |
| Parent/guardian | Child learning, attendance, results, communication | TBD |
| Privacy/regulatory authority | Student-data handling and retention | Jurisdiction and contact TBD |

## Business success measures

Target values, baseline measures, adoption goals, financial outcomes, and service levels are TBD. No performance, cost, or adoption claim is made by this bootstrap.

## Future business capability — Security & Gate Management

Status: FUTURE SCOPE ONLY; not part of the active Phase 1-7 implementation baseline.

EDNOVA may later provide a MyGate-style security experience for schools and colleges, integrated with the academic operating system through a separately authorized campus-security boundary. The future capability is intended to support Security Staff and campus administrators with gate operations, verification, visitors, vehicles, incidents, alerts, monitoring, history, and reports.

### REQ-BIZ-FUT-001 — Modular campus security capability

Priority: FUTURE / TBD  
Actor: Security Staff and campus administrators  
Precondition: Future scope is approved and a campus-security privacy/security review is complete.  
Description: EDNOVA shall be able to add Security & Gate Management without weakening academic tenant isolation or requiring a major rewrite of the core system.  
Acceptance criteria: The approved future design has isolated module boundaries, explicit campus/gate scope, extension entities, provider adapters, and traceability to security, privacy, API, and audit controls. Implementation is not authorized by this document.

### REQ-BIZ-FUT-002 — Provider-neutral integration

Priority: FUTURE / TBD  
Actor: Platform operator and security administrator  
Precondition: An external provider has approved commercial and technical access.  
Description: The future module shall support multiple security providers through a secure integration layer rather than a MyGate-specific dependency.  
Acceptance criteria: Provider authentication, permissions, validation, webhooks/events where available, retries, deduplication, and audit are represented in an approved contract. No provider integration is implemented now.
