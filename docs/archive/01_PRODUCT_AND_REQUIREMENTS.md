# EDNOVA — Product & Requirements

## 1. Product Identity

**EDNOVA** is a secure, installable, on-premise School & College Planning, Operations, Safety, Feedback and Intelligence Platform.

EDNOVA is designed for:
- Schools
- Higher-secondary institutions
- Colleges

### Current product boundary

EDNOVA is **not an LMS** in the current product scope.

LMS-style capabilities such as course selling, SCORM, video hosting, learning marketplaces, advanced mastery-learning workflows and similar learning-platform features are **future scope** unless explicitly approved through change management.

## 2. Core Objective

EDNOVA helps an institution plan and operate daily activities while maintaining secure records, feedback, safety/incident information, academic records, auditability and useful intelligence.

The platform must help authorized users understand:
- What was planned
- What happened
- Who was involved
- What evidence exists
- What action was taken
- What remains unresolved
- What recurring patterns exist

## 3. Deployment

The primary deployment is on the institution's main server.

```text
Institution Server
├── EDNOVA Web/API
├── PostgreSQL
├── File Storage
├── Audit Engine
├── AI Gateway
└── Local Services
```

Core institution operations must not depend on continuous internet availability.

Optional central services may provide:
- Licensing
- Activation
- Update metadata
- Support
- Optional remote owner services
- Optional cloud backup
- Optional external AI

## 4. User Roles

Canonical roles:
- Platform / Product Owner
- Institution Owner
- Principal
- School/College Admin
- Admin Staff
- Teacher
- Security Guard
- Student
- Parent/Guardian where enabled

Every role requires explicit permissions and data visibility rules.

## 5. Student Information

At minimum:
- Student ID
- Admission number
- Name
- Batch
- Academic year
- Program / Class / Grade
- Division / Section
- Roll number
- Subjects
- Attendance
- Assessments
- Class test results
- Internal assessment
- Examination results
- Grades
- Academic history
- Guardian relationship
- Status

Historical enrollment must remain connected to the permanent student identity.

## 6. Academic Structure

Schools may use:

```text
Institution
→ Academic Year
→ Grade / Program
→ Batch / Division
→ Subject
→ Student
```

Colleges may use:

```text
Institution
→ Academic Year
→ Department
→ Program
→ Semester
→ Batch
→ Course
→ Section
→ Student
```

The architecture must remain configurable rather than assuming one educational hierarchy.

## 7. Core Functional Domains

### Institution Management
- Institution profile
- Campus / branch
- Academic years
- Calendar
- Settings

### People
- Students
- Teachers
- Admin staff
- Security staff
- Guardians
- Relationships
- Enrollment

### Planning
- Timetable
- Teacher schedule
- Student schedule
- Events
- Academic calendar

### Attendance
- Present
- Absent
- Late
- Half day
- Excused
- Correction requests
- Approval
- Audit

### Academic Records
- Subjects
- Assessments
- Class tests
- Internal assessments
- Exams/results
- Grades
- Historical results

### Feedback
- Suggestions
- Complaints
- Academic concerns
- Safety concerns
- Facility issues
- Security concerns
- Bullying/harassment concerns
- Staff/teacher concerns
- General feedback

Confidentiality levels:
- NORMAL
- CONFIDENTIAL
- RESTRICTED

Workflow:

```text
SUBMITTED
→ ACKNOWLEDGED
→ CLASSIFIED
→ ASSIGNED
→ UNDER REVIEW
→ ACTION
→ RESPONSE
→ RESOLVED
→ CLOSED
```

Also support reopen, escalation, evidence, attachments, SLA and audit history.

### Incident Management

Incidents must capture:
- Incident ID
- Reporter
- Date/time
- Location
- Category
- Severity
- People involved
- Description
- Evidence
- Investigator
- Actions
- Timeline
- Escalations
- Response
- Resolution
- Closure

The incident timeline must distinguish:
- Recorded facts
- User statements
- Evidence
- Administrative actions
- AI-generated summaries
- Human conclusions

### Security Gate
- Student movement
- Staff movement
- Visitor check-in/out
- Pickup verification
- Security incidents
- Emergency workflows

### Communication
- Announcements
- Notifications
- Optional email/push adapters
- Role-based delivery

### Reporting
- Attendance reports
- Academic reports
- Feedback reports
- Incident reports
- Security reports
- Operational trends
- Owner dashboards

## 8. Owner Intelligence

Authorized owners need institution-level or multi-institution visibility according to scope.

The owner experience may include:
- unresolved feedback
- incidents
- safety trends
- attendance aggregates
- academic aggregates
- operational trends
- system health
- license/deployment state
- AI-assisted summaries

AI insights must remain traceable to source records.

## 9. Non-Functional Requirements

EDNOVA must prioritize:
- Security
- Tenant isolation
- Auditability
- Reliability
- Maintainability
- Testability
- Recoverability
- Accessibility
- Performance
- Backward-compatible migrations

## 10. Privacy

For every sensitive data class document:
- What is collected
- Why it is collected
- Who can access it
- Retention
- Export
- Modification
- Deletion/anonymization
- Audit requirements

Do not collect unnecessary student information.

## 11. Future Scope

Legacy documentation contains broader learning/LMS-style concepts. These are retained as future possibilities rather than current implementation scope:
- Course marketplace
- SCORM
- Video learning
- Advanced learning/mastery engine
- Learning-gap engine
- Online course platform
- Similar LMS features

Any return of these features to active scope requires a documented change request.
