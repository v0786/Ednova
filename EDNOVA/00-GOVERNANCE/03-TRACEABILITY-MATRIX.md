# EDNOVA Traceability Matrix

| Field | Value |
|---|---|
| Document ID | GOV-TRC-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/01-BRD.md, 02-DISCOVERY/07-FUNCTIONAL-REQUIREMENTS.md, 09-QA/02-TEST-STRATEGY.md |

## Evidence boundary

This is an initial design-time matrix. The repository contains no application code, tests, migrations, or deployment artifacts. Code, execution results, acceptance, and release references are therefore TBD, not passed.

## Initial traceability

| Requirement | User story | Acceptance | UX flow | Architecture | DB entity | API | UI | Unit | Integration | E2E | Security | Phase | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| REQ-FND-001 tenant hierarchy and isolation | US-FND-001 | AC-FND-001 | UX-FND-001 | ARCH-SYS-001, ARCH-DATA-001, ARCH-AUTHZ-001 | DB-FND-001 | API-FND-001 | UI-FND-001 | TC-FND-001 | TC-FND-002 | TC-FND-003 | TC-SEC-001 | Phase 1 | DOCUMENTING |
| REQ-FND-002 foundation setup and enrollment | US-FND-002 | AC-FND-002 | UX-FND-002 | ARCH-DOM-001 | DB-FND-002 | API-FND-002 | UI-FND-002 | TC-FND-004 | TC-FND-005 | TC-FND-006 | TC-SEC-002 | Phase 1 | DOCUMENTING |
| REQ-FND-003 permanent student identity and history | US-FND-003 | AC-FND-003 | UX-FND-003 | ARCH-DATA-001 | DB-PEO-001 | API-PEO-001 | UI-PEO-001 | TC-PEO-001 | TC-PEO-002 | TC-PEO-003 | TC-SEC-003 | Phase 1 | DOCUMENTING |
| REQ-FND-004 role and capability authorization | US-FND-004 | AC-FND-004 | UX-FND-004 | ARCH-AUTHZ-001, ARCH-SEC-001 | DB-SEC-001 | API-SEC-001 | UI-SEC-001 | TC-SEC-004 | TC-SEC-005 | TC-SEC-006 | TC-SEC-007 | Phase 1 | DOCUMENTING |
| REQ-ATT-001 controlled attendance recording | US-ATT-001 | AC-ATT-001 | UX-ATT-001 | ARCH-DOM-001, ARCH-AUTHZ-001 | DB-ATT-001 | API-ATT-001 | UI-ATT-001 | TC-ATT-001 | TC-ATT-002 | TC-ATT-003 | TC-ATT-004 | Phase 2 | DOCUMENTING |
| REQ-ATT-002 correction history and audit | US-ATT-002 | AC-ATT-002 | UX-ATT-002 | ARCH-SEC-001 | DB-ATT-002 | API-ATT-002 | UI-ATT-002 | TC-ATT-005 | TC-ATT-006 | TC-ATT-007 | TC-ATT-008 | Phase 2 | DOCUMENTING |
| REQ-ACA-001 connected learning loop | US-ACA-001 | AC-ACA-001 | UX-ACA-001 | ARCH-DOM-001, ARCH-DATA-001 | DB-ACA-001 | API-ACA-001 | UI-ACA-001 | TC-ACA-001 | TC-ACA-002 | TC-ACA-003 | TC-SEC-009 | Phase 3+ | DOCUMENTING |
| REQ-EXAM-001 exam integrity controls | US-EXAM-001 | AC-EXAM-001 | UX-EXAM-001 | ARCH-SEC-001, ARCH-AUTHZ-001 | DB-EXAM-001 | API-EXAM-001 | UI-EXAM-001 | TC-EXAM-001 | TC-EXAM-002 | TC-EXAM-003 | TC-EXAM-004 | Phase 5 | DOCUMENTING |
| REQ-PRIV-001 student-data privacy controls | US-PRIV-001 | AC-PRIV-001 | UX-PRIV-001 | ARCH-SEC-001, ARCH-DATA-001 | DB-SEC-002 | API-SEC-002 | UI-PRIV-001 | TC-PRIV-001 | TC-PRIV-002 | TC-PRIV-003 | TC-PRIV-004 | All | DOCUMENTING |
| REQ-NFR-001 measurable performance targets | US-NFR-001 | AC-NFR-001 | UX-NFR-001 | ARCH-SYS-001 | DB-NFR-001 | API-NFR-001 | UI-NFR-001 | TC-PERF-001 | TC-PERF-002 | TC-PERF-003 | TC-SEC-010 | All | TBD |

## Completion rules

An empty implementation or test cell is not evidence of completion. Each TBD cell must be replaced with an approved artifact reference, an executed test reference, or an explicitly accepted deferral.

