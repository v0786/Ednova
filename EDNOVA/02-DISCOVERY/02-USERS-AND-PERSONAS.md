# EDNOVA Users and Personas

| Field | Value |
|---|---|
| Document ID | DISC-PER-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-PROBLEM-STATEMENT.md, 03-USER-JOURNEYS.md, 04-USE-CASES.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md |

## Evidence boundary

These are role-based working personas derived from the governing prompt. Names, demographics, device ownership, accessibility needs, school context, and research validation are TBD. The named personas in the preserved legacy journey draft are illustrative and not validated.

## Initial personas

### P-01 — Platform operator

Role: SUPER_ADMIN.  
Goals: Manage the platform boundary, schools, security, and operational governance.  
Needs: Tenant lifecycle, controlled access, audit, support, and safe configuration.  
Access: Cross-school only where an explicit platform capability permits it.  
Open questions: Staffing, support workflow, break-glass access, and approval model.

### P-02 — School administrator

Role: SCHOOL_ADMIN.  
Goals: Configure school structure, people, enrollments, academic operations, and reports.  
Needs: Reliable setup, scoped administration, history, approvals, and audit.  
Access: One school, subject to capability and data scope.

### P-03 — Principal

Role: PRINCIPAL.  
Goals: Oversee academic and school performance.  
Needs: Role-scoped dashboards, reports, approvals, and announcements.  
Access: School scope subject to approved permissions.

### P-04 — Teacher

Role: TEACHER.  
Goals: Teach assigned students, record attendance, publish learning, assess work, and support progress.  
Needs: Assignment and class scope, low-friction workflows, feedback, and safe student access.  
Access: Assigned grade/division/subject only unless a capability explicitly grants more.

### P-05 — Student

Role: STUDENT.  
Goals: Learn, practice, submit work, take exams, review gaps, and see progress.  
Needs: Clear tasks, reliable saving, accessible content, and understandable results.  
Access: Own record and authorized classes, assignments, exams, and resources.

### P-06 — Parent or guardian

Role: PARENT/GUARDIAN.  
Goals: Understand and support linked child or children.  
Needs: Child-scoped attendance, learning, homework, assignments, exams, results, progress, announcements, and communication.  
Access: Only linked child records within authorized school relationships.

## Future personas

EXTERNAL_TEACHER, CONTRIBUTOR, EXAM_COORDINATOR, and ACCOUNTANT are future/optional roles in the master prompt. They are not part of the initial authorization baseline until approved.

