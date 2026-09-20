# EDNOVA User Stories

| Field | Value |
|---|---|
| Document ID | DISC-US-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-BRD.md, 03-USER-JOURNEYS.md, 06-ACCEPTANCE-CRITERIA.md, 03-TRACEABILITY-MATRIX.md |

## Initial stories

### US-FND-001

As a platform or school administrator, I want school data isolated by tenant and scope, so that users cannot access unrelated school records.

Priority: MUST  
Actor: SUPER_ADMIN or SCHOOL_ADMIN  
Preconditions: Tenant and capability context exists.  
Dependencies: REQ-FND-001, REQ-FND-004.  
Related module: School Management, Security & Audit.  
Acceptance: AC-FND-001.

### US-FND-002

As a school administrator, I want to create the academic hierarchy and enroll students, so that the school has a usable foundation.

Priority: MUST  
Actor: SCHOOL_ADMIN  
Preconditions: Authorized school context.  
Dependencies: REQ-FND-002.  
Related module: School Management and People.  
Acceptance: AC-FND-002.

### US-FND-003

As a school administrator, I want one student identity across academic years, so that historical learning and enrollment remain connected.

Priority: MUST  
Actor: SCHOOL_ADMIN  
Preconditions: Student identity exists.  
Dependencies: REQ-FND-003.  
Related module: People.  
Acceptance: AC-FND-003.

### US-FND-004

As an authorized user, I want permissions based on role and assignment scope, so that I can do my work without seeing unrelated records.

Priority: MUST  
Actor: All roles  
Preconditions: Role and scope are assigned.  
Dependencies: REQ-FND-004.  
Related module: Security & Audit.  
Acceptance: AC-FND-004.

### US-ATT-001

As a teacher, I want to record attendance for my assigned class, so that the school has a reliable daily record.

Priority: MUST  
Actor: TEACHER  
Preconditions: Assignment and attendance window exist.  
Dependencies: REQ-ATT-001.  
Related module: Attendance.  
Acceptance: AC-ATT-001.

### US-ATT-002

As an approving administrator, I want attendance corrections to retain their original record and decision trail, so that changes remain accountable.

Priority: MUST  
Actor: SCHOOL_ADMIN  
Preconditions: Original attendance exists.  
Dependencies: REQ-ATT-002.  
Related module: Attendance and Security & Audit.  
Acceptance: AC-ATT-002.

### US-ACA-001

As a student, I want Today's Notes connected to homework, resources, assignments, and assessment, so that I can follow the learning loop.

Priority: MUST  
Actor: STUDENT  
Preconditions: Authorized class context.  
Dependencies: REQ-ACA-001.  
Related module: Daily Academics and Learning.  
Acceptance: AC-ACA-001.

### US-EXAM-001

As a student, I want exam responses and submission state protected during the allowed window, so that interruptions do not silently lose my work.

Priority: MUST  
Actor: STUDENT  
Preconditions: Eligible scheduled exam.  
Dependencies: REQ-EXAM-001.  
Related module: Examination.  
Acceptance: AC-EXAM-001.

### US-PRIV-001

As a data subject or authorized guardian, I want student data handled according to documented privacy rules, so that access and lifecycle actions are accountable.

Priority: MUST  
Actor: PARENT/GUARDIAN or authorized operator  
Preconditions: Identity and relationship can be verified.  
Dependencies: REQ-PRIV-001.  
Related module: Security & Audit.  
Acceptance: AC-PRIV-001.

### US-NFR-001

As a school user, I want measurable response and reliability targets, so that the system can be evaluated honestly.

Priority: MUST  
Actor: All users  
Preconditions: Workload and target definitions exist.  
Dependencies: REQ-NFR-001.  
Related module: Cross-cutting.  
Acceptance: AC-NFR-001.

### US-GATE-001

As future Security Staff, I want to verify a person or visitor at my assigned gate, so that campus entry decisions are recorded and scoped.

Priority: FUTURE / TBD  
Actor: SECURITY_STAFF  
Preconditions: Future role, gate, verification policy, and privacy policy are approved.  
Dependencies: REQ-GATE-001.  
Related module: Security & Gate Management.  
Acceptance: AC-GATE-001.

### US-GATE-002

As a platform operator, I want security providers connected through adapters, so that EDNOVA can support multiple providers without coupling the academic core to MyGate.

Priority: FUTURE / TBD  
Actor: Platform operator  
Preconditions: Provider access and contract are approved.  
Dependencies: REQ-GATE-002.  
Related module: Security & Gate Management and Security & Audit.  
Acceptance: AC-GATE-002.
