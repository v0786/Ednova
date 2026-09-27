# EDNOVA — Domain, Database & API Specification

## 1. Domain Model

EDNOVA is organized around domain-oriented modules.

### Institution
- institutions
- campuses
- academic years
- calendar
- settings

### Identity & People
- users
- profiles
- students
- teachers
- admin staff
- security staff
- guardians
- relationships
- roles
- permissions

### Academic Structure
- programs
- grades
- departments
- batches
- divisions/sections
- subjects/courses
- teacher assignments
- enrollments

### Planning
- timetable entries
- events
- schedules

### Attendance
- attendance records
- attendance windows
- correction requests
- approval history

### Academic Results
- assessments
- class tests
- internal assessments
- examinations
- marks
- grades
- results

### Feedback
- feedback records
- categories
- confidentiality
- assignment
- status
- responses
- escalation
- attachments
- audit

### Incidents
- incident records
- incident people
- evidence
- investigators
- timeline events
- actions
- approvals
- resolution

### Security Gate
- movement logs
- visitors
- pickup authorization
- security events

### Communication
- announcements
- notifications
- delivery records
- preferences

### Reporting
- report definitions
- aggregates
- generated reports
- evidence/source references

### AI
- AI requests
- retrieval context
- model provider
- output metadata
- AI audit records

### Deployment
- deployment identity
- license state
- installation state
- update state
- health state

## 2. Student Identity

A student has a permanent identity.

Enrollment is historical.

Example:

```text
Student X
2026–27 → Grade 7 → Division 7-A
2027–28 → Grade 8 → Division 8-B
```

Do not overwrite historical enrollment.

## 3. Database Principles

PostgreSQL is the source of truth.

Every tenant-owned domain table must carry an appropriate institution/school scope.

Use:
- foreign keys
- unique constraints
- check constraints
- indexes
- RLS
- migration files

## 4. Current Migration History

Existing implementation records:

```text
01_schema.sql
02_security_gate_domain.sql
03_security_gate_tables.sql
04_timetable_and_calendar.sql
05_attendance_system.sql
06_feedback_and_incidents.sql
```

Current entities include:
- schools
- profiles
- academic_years
- grades
- divisions
- subjects
- student_enrollments
- daily_attendance
- todays_notes
- parent_student_relationships
- audit_logs
- security_gate_logs
- timetable_entries
- attendance_correction_requests
- feedback_records
- incident_records
- incident_timeline_events

## 5. Database Integrity

Timetable must prevent:
- teacher double-booking
- division/class double-booking

Attendance corrections require approval history.

Sensitive changes require audit events.

Historical academic data must not be casually overwritten.

## 6. API Boundary

APIs/server actions must enforce:
- authentication
- tenant scope
- authorization
- input validation
- rate limiting where appropriate
- safe errors
- pagination for large datasets
- audit requirements

Never rely on UI visibility for security.

## 7. API Design

Every endpoint/action should document:
- purpose
- actor
- authorization
- request
- validation
- response
- errors
- audit events
- database effects
- rate limits
- idempotency requirements where relevant

## 8. AI API

AI requests must include:
- authenticated actor
- permission context
- allowed data scope
- request type
- audit metadata

The retrieval layer must not return data outside the actor's authorization.

## 9. Traceability

Each requirement should trace:

```text
Requirement
→ User Story
→ Acceptance Criteria
→ Domain
→ Database
→ API
→ UI/Mobile
→ Code
→ Tests
→ Security Test
```

## 10. Migration Policy

Schema changes require:
- migration
- compatibility review
- rollback/recovery consideration
- data impact analysis
- security/RLS review
- documentation update

Never silently change database contracts.
