# EDNOVA — Master Plan, Phases, Tasks & Traceability

## 1. Master Development Sequence

```text
UNDERSTAND
↓
DOCUMENT
↓
VALIDATE
↓
DESIGN
↓
IMPLEMENT
↓
TEST
↓
SECURE
↓
ACCEPT
↓
DOCUMENT
↓
RELEASE
```

## 2. Long-Route Development Strategy

EDNOVA should use the long route rather than a rushed MVP.

### Phase 0 — Documentation & Repository Baseline
- inspect repository
- inspect current code
- inspect migrations
- inspect tests
- inspect deployment configuration
- establish six-document source of truth
- identify conflicts and future scope
- establish traceability

### Phase 1 — Foundation
- application scaffold
- configuration
- authentication
- sessions
- identity
- tenant/institution model
- roles
- permissions
- RLS
- audit foundation
- error handling

### Phase 2 — Institution & People
- institution setup
- academic years
- programs/grades
- departments
- batches
- divisions/sections
- students
- teachers
- admin staff
- security staff
- guardians
- relationships
- enrollment history

### Phase 3 — Planning
- academic calendar
- timetable
- teacher schedule
- student schedule
- event planning
- conflict prevention

### Phase 4 — Attendance
- attendance windows
- roster
- attendance states
- corrections
- approvals
- audit
- reporting

### Phase 5 — Academic Records
- subjects/courses
- class tests
- assessments
- marks
- grades
- examinations/results
- historical records
- reporting

### Phase 6 — Feedback & Incident Intelligence
- feedback submission
- confidentiality
- assignment
- escalation
- SLA
- response
- incident creation
- evidence
- timeline
- investigation
- actions
- resolution
- closure
- audit

### Phase 7 — Security Operations
- gate movement
- visitor management
- pickup verification
- security incidents
- emergency workflows
- security reporting

### Phase 8 — Communication
- announcements
- in-app notifications
- push
- email adapter
- notification preferences
- delivery/retry

### Phase 9 — Owner/Admin Experiences
- owner dashboard
- school/college admin dashboard
- principal dashboard
- reporting
- system health
- deployment/license state

### Phase 10 — Android
- shared API client
- secure token/session handling
- teacher
- school admin
- admin staff
- security guard
- student
- offline/retry behavior where required

### Phase 11 — AI
- AI provider abstraction
- AI gateway
- permission-aware retrieval
- context builder
- prompt injection defense
- classification
- summarization
- incident summarization
- trend detection
- owner assistant
- report generation
- output validation
- AI audit
- model monitoring

### Phase 12 — Deployment & Licensing
- signed activation
- deployment identity
- installation
- migrations
- local secrets
- update packages
- rollback
- backup
- restore
- disaster recovery
- system health

### Phase 13 — Security Hardening
- threat-model verification
- penetration testing
- RLS review
- authorization review
- session review
- file security review
- AI security review
- audit review
- privacy review

### Phase 14 — Production Acceptance
- UAT
- performance
- accessibility
- recovery testing
- release review
- documentation review
- final sign-off

## 3. Existing Implementation History

Existing completed tasks include:

- TASK-001 scaffold Next.js App Router/TypeScript/Tailwind
- TASK-002 core database schema and RLS
- TASK-003 server-side RBAC session guard
- TASK-004 school setup onboarding
- TASK-005 people/student enrollment
- TASK-006 security gate migrations
- TASK-007 security gate movement logger
- TASK-008 timetable migration
- TASK-009 timetable UI
- TASK-010 attendance migration/correction audit
- TASK-011 attendance roster UI
- TASK-012 daily academics/today's notes
- TASK-013 feedback/incident migration
- TASK-014 safety incident console

The existing register also identifies:
- TASK-015 Android API SDK
- TASK-016 Teacher Android
- TASK-017 Security Guard Android
- TASK-018 Student Android
- TASK-019 permission-aware AI gateway
- TASK-020 cryptographic license installer

These remaining tasks should be expanded into smaller dependency-aware tasks rather than treated as single large implementations.

## 4. Required Expansion of the Task Register

Examples:

### Foundation
- AUTH-001 identity model
- AUTH-002 authentication
- AUTH-003 session security
- AUTH-004 role model
- AUTH-005 permission model
- AUTH-006 RLS tests
- AUDIT-001 audit event model
- AUDIT-002 audit writer
- AUDIT-003 audit viewer
- AUDIT-004 audit integrity tests

### Feedback
- FB-001 feedback model
- FB-002 categories
- FB-003 confidentiality
- FB-004 submission
- FB-005 assignment
- FB-006 workflow
- FB-007 escalation
- FB-008 attachments
- FB-009 response
- FB-010 closure
- FB-011 audit
- FB-012 security tests

### Incident
- INC-001 incident model
- INC-002 people/location
- INC-003 evidence
- INC-004 timeline
- INC-005 investigator assignment
- INC-006 actions
- INC-007 escalation
- INC-008 resolution
- INC-009 closure
- INC-010 audit
- INC-011 authorization tests

### AI
- AI-001 provider interface
- AI-002 gateway
- AI-003 permission context
- AI-004 retrieval
- AI-005 prompt injection defense
- AI-006 classification
- AI-007 summarization
- AI-008 incident summarization
- AI-009 trend detection
- AI-010 owner assistant
- AI-011 output validation
- AI-012 AI audit
- AI-013 AI security tests

### Mobile
- MOB-001 shared API client
- MOB-002 secure session storage
- MOB-003 push foundation
- MOB-004 teacher app
- MOB-005 school admin app
- MOB-006 admin staff app
- MOB-007 security guard app
- MOB-008 student app
- MOB-009 offline/retry behavior
- MOB-010 mobile security testing

### Deployment
- DEP-001 deployment identity
- DEP-002 signed activation
- DEP-003 installer
- DEP-004 secret generation
- DEP-005 health checks
- DEP-006 backup
- DEP-007 restore
- DEP-008 update package
- DEP-009 rollback
- DEP-010 disaster recovery
- DEP-011 production verification

## 5. Task Definition

Every task must define:
- ID
- title
- purpose
- dependencies
- affected files/modules
- database impact
- API impact
- UI/mobile impact
- security impact
- tests
- acceptance criteria
- status

Do not use vague tasks such as "Build AI" or "Build mobile app."

## 6. Critical Path

The typical dependency chain is:

```text
Identity
→ Authentication
→ Tenant Isolation
→ Authorization
→ Database
→ Audit
→ Core Domains
→ API
→ Web/Mobile
→ AI
→ Deployment
→ Security Hardening
→ Production Acceptance
```

## 7. Phase Gate

A phase is complete only when:
- scope complete
- requirements satisfied
- documentation updated
- database documented
- API documented
- UX complete
- tests pass
- security review passes
- acceptance criteria pass
- known issues recorded
- traceability complete
- sign-off recorded

## 8. Traceability

Use:

```text
REQ
↓
USER STORY
↓
ACCEPTANCE CRITERIA
↓
DOMAIN
↓
DATABASE
↓
API
↓
WEB/MOBILE
↓
CODE
↓
TEST
↓
SECURITY TEST
↓
ACCEPTANCE
```

## 9. Documentation Change Control

When a requirement, architecture, security boundary, API, schema or phase changes:
1. Record the change.
2. Identify impact.
3. Update the affected section of these six documents.
4. Update task dependencies.
5. Update implementation status.
6. Re-run the documentation review.

## 10. Current Product Status

Current known implementation foundation:
- Next.js modular monolith
- PostgreSQL/Supabase direction
- RLS
- server-side RBAC
- school setup
- people/student enrollment
- security gate
- timetable
- attendance
- daily academics
- feedback/incident foundation

Current major work areas:
- Android
- expanded admin mobile
- AI
- licensing/installer
- full security hardening
- backup/recovery
- update/rollback
- owner experience
- production readiness

## 11. Final Definition of Done

EDNOVA is not considered production-ready until:
- requirements are traceable
- security boundaries are verified
- tenant isolation is tested
- audit is operational
- critical workflows work
- Android roles work
- owner/admin experiences work
- AI respects authorization
- backup/restore is tested
- installation/activation works
- updates/rollback work
- monitoring works
- UAT passes
- documentation matches implementation

## 12. Source Consolidation Rule

This six-document set replaces the previous fragmented documentation structure.

No new standalone specification document should be created unless the user explicitly approves it.

New information must be placed into the appropriate one of these six documents:
1. Product & Requirements
2. Architecture, Security & Deployment
3. Domain, Database & API
4. UX, Design & Applications
5. Development, QA & Operations
6. Master Plan, Phases, Tasks & Traceability
