# EDNOVA Acceptance Criteria

| Field | Value |
|---|---|
| Document ID | DISC-AC-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 05-USER-STORIES.md, 07-FUNCTIONAL-REQUIREMENTS.md, 03-TRACEABILITY-MATRIX.md |

## Initial acceptance criteria

### AC-FND-001 — Tenant and scope isolation

- Given a user is scoped to School A, when the client submits a School B identifier, then the server and database deny access.
- Given a teacher is assigned to one grade/division/subject, when the teacher requests unrelated student data, then the request is denied.
- Given an audit event is generated, when an ordinary user attempts to alter it, then the operation is denied.

### AC-FND-002 — Foundation setup

- Given an authorized school administrator, when the administrator creates School → Academic Year → Grade → Division → Subject, then each record is linked to the correct parent.
- Given valid users and students, when the administrator creates enrollments, then the enrollment is visible only within the authorized school.
- Given a duplicate or invalid parent record, when the request is submitted, then no partial unsafe record is silently created.

### AC-FND-003 — Historical identity

- Given a student has a prior enrollment, when a later enrollment is created, then the prior enrollment remains unchanged.
- Given a student has multiple academic-year enrollments, when authorized history is viewed, then the same permanent identity connects them.

### AC-FND-004 — Permissions

- Given a user has no capability for a protected action, when the user calls the API directly, then the action is denied even if a UI control is hidden.
- Given a parent is linked to one child, when the parent requests another child’s record, then the request is denied.

### AC-ATT-001 — Attendance

- Given a teacher is assigned to Class 7-B, when today’s attendance is opened, then only authorized students are displayed.
- Given attendance already exists, when the teacher opens it, then the existing record is shown and duplicate creation is prevented.
- Given a supported status is selected, when the teacher saves, then the status and actor are recorded.

### AC-ATT-002 — Attendance correction

- Given an original record exists, when a correction is submitted, then original record, request, reason, decision state, and audit linkage remain available.
- Given an unauthorized user requests approval, when the action is submitted, then it is denied.

### AC-ACA-001 — Connected learning

- Given a published Today's Note, when an authorized student opens it, then subject, topic, concepts, homework, and approved resources are visible.
- Given a learning activity is linked to an assignment or assessment, when progress is calculated, then the relationship is traceable.

### AC-EXAM-001 — Examination controls

- Given an exam is outside its access window, when a student attempts entry, then access is denied.
- Given autosave or submit is retried, when the same operation is repeated, then duplicate attempts are not created.
- Given a connection interruption occurs, when the approved recovery path is followed, then saved state and final submission behavior are explicit and auditable.

### AC-PRIV-001 — Privacy

- Given a requester is not authorized, when a student-data export is requested, then data is not disclosed.
- Given an approved lifecycle request, when it is fulfilled, then the action, scope, policy basis, and result are logged.

### AC-NFR-001 — Measurable quality

- Given approved workload targets exist, when the system is benchmarked, then results are recorded against those targets.
- Given an accessibility requirement applies, when the relevant workflow is tested, then defects are recorded and dispositioned.

### AC-GATE-001 — Isolated future module

- Given Security & Gate Management is later approved, when a Security Staff operator uses a gate workflow, then access is limited to the assigned tenant, campus, and gate.
- Given a verification request, when it is processed, then only the minimum approved data is disclosed and the event is auditable.
- Given an academic record is requested by Security Staff, when no separate capability exists, then the request is denied.

### AC-GATE-002 — Provider-neutral integration

- Given a future provider adapter receives an event, when authentication, signature/replay, schema, tenant mapping, and deduplication pass, then it can enter the approved synchronization workflow.
- Given the same provider event is delivered more than once, when it is processed, then no duplicate EDNOVA event is created.
- Given the provider is unavailable or sends invalid data, when synchronization runs, then a bounded retry/error state is recorded without bypassing local authorization.
