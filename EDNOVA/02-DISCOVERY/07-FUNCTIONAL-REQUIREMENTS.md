# EDNOVA Functional Requirements Register

| Field | Value |
|---|---|
| Document ID | DISC-FR-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/02-FRD.md, 05-USER-STORIES.md, 06-ACCEPTANCE-CRITERIA.md |

## Requirement format

Each requirement has ID, title, priority, actor, precondition, description, and acceptance criteria. The initial register below is intentionally limited to the governing baseline and is not a claim that every field for every domain is final.

## Initial register

| ID | Title | Priority | Actor | Phase |
|---|---|---|---|---|
| REQ-FND-001 | Tenant hierarchy and isolation | MUST | All roles | 1 |
| REQ-FND-002 | Foundation creation and enrollment | MUST | SCHOOL_ADMIN | 1 |
| REQ-FND-003 | Permanent student identity | MUST | SCHOOL_ADMIN | 1 |
| REQ-FND-004 | Capability-based permissions | MUST | All roles | 1 |
| REQ-ATT-001 | Attendance recording | MUST | TEACHER | 2 |
| REQ-ATT-002 | Attendance correction audit | MUST | TEACHER, SCHOOL_ADMIN | 2 |
| REQ-ACA-001 | Today's Notes learning connection | MUST | TEACHER, STUDENT | 3 |
| REQ-ASM-001 | Assignment lifecycle | MUST | TEACHER, STUDENT | 4 |
| REQ-PRJ-001 | Project workflow | SHOULD | TEACHER, STUDENT | 4 |
| REQ-EXAM-001 | Computer examination controls | MUST | TEACHER, STUDENT | 5 |
| REQ-LEARN-001 | Learning gaps and progress | MUST | TEACHER, STUDENT | 6 |
| REQ-COM-001 | Role-scoped communication | SHOULD | Authorized users | 3/7 |
| REQ-REP-001 | Reports and dashboards | MUST | Authorized users | 2-7 |
| REQ-SEC-001 | Audit and security events | MUST | System | All |
| REQ-PRIV-001 | Privacy lifecycle | MUST | System and operators | All |
| REQ-GATE-001 | Future Security & Gate Management boundary | FUTURE / TBD | Security Staff, campus administrators | Future |
| REQ-GATE-002 | Future provider-neutral security integration | FUTURE / TBD | Platform operator | Future |

## Open detail

Field-level schemas, exact status enumerations beyond those explicitly provided, notification matrix, file limits, grading calculations, curriculum rules, report definitions, deletion behavior, and jurisdictional requirements are TBD or require CR/ADR review.
