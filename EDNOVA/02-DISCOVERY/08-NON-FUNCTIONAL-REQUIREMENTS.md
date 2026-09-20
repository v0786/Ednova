# EDNOVA Non-Functional Requirements

| Field | Value |
|---|---|
| Document ID | DISC-NFR-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/03-SRS.md, 03-ARCHITECTURE/08-SECURITY-ARCHITECTURE.md, 09-QA/02-TEST-STRATEGY.md |

## Initial NFR register

### REQ-NFR-001 — Measurable performance

Priority: MUST. Actor: All users.  
Description: Define measurable targets for initial page load, dashboard load, roster load, attendance, exam question loading, autosave, large datasets, concurrent exams, and database queries.  
Status: TARGETS TBD; no benchmark exists.

### REQ-NFR-002 — Security

Priority: MUST. Actor: System.  
Description: Enforce authentication, authorization, RLS, tenant isolation, server-side checks, input/file validation, secure storage, audit, rate limiting where appropriate, session and password/reset security, IDOR protection, and privilege-escalation protection.  
Status: REQUIRED by master prompt; implementation TBD.

### REQ-NFR-003 — Privacy

Priority: MUST. Actor: System and operators.  
Description: Govern collection, purpose, access, retention, export, modification, deletion/anonymization, and parent/teacher/admin access for student data.  
Status: REQUIRED; jurisdiction and policy values TBD.

### REQ-NFR-004 — Accessibility

Priority: MUST. Actor: All users.  
Description: Provide accessible components and define measurable accessibility testing for responsive web workflows.  
Status: Target standard and test tooling TBD.

### REQ-NFR-005 — Responsive compatibility

Priority: MUST. Actor: Student, parent, teacher, administrator.  
Description: Support desktop-first administration and mobile-friendly student and parent workflows in the responsive web application.  
Status: Browser matrix and device matrix TBD.

### REQ-NFR-006 — Auditability

Priority: MUST. Actor: System.  
Description: Preserve security events, administrative activity, attendance corrections, examination events, and governed historical changes.  
Status: Retention and access policy TBD.

### REQ-NFR-007 — Reliability and recovery

Priority: MUST. Actor: Operations.  
Description: Define backup, restore, disaster recovery, error handling, logging, monitoring, and recovery objectives.  
Status: RPO/RTO and service targets TBD.

### REQ-NFR-008 — Maintainability and traceability

Priority: MUST. Actor: Engineering.  
Description: Keep domain modules, API contracts, migrations, tests, documentation, and release evidence traceable.  
Status: Required; repository tooling TBD.

