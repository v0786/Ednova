# EDNOVA Test Strategy

| Field | Value |
|---|---|
| Document ID | QA-TEST-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-QA-STRATEGY.md, 00-GOVERNANCE/03-TRACEABILITY-MATRIX.md, 02-DISCOVERY/06-ACCEPTANCE-CRITERIA.md |

## Test levels

| Level | Focus | Initial examples |
|---|---|---|
| Unit | Pure rules, validation, permission decisions | Status transitions, tenant-scope predicates |
| Integration | Server/API, database, Auth, Storage, RLS | Cross-tenant denial, enrollment history, audit |
| E2E | Real user workflows | Foundation setup, attendance, assignment, exam |
| Security | Abuse and boundary behavior | IDOR, privilege escalation, service-role exposure, session/reset |
| Performance | Measured workload | Dashboard, roster, attendance, autosave, concurrent exam |
| Accessibility | Keyboard, screen reader, contrast, focus, errors | Responsive role workflows |
| UAT | School acceptance | Phase-specific acceptance scenarios |

## Required test data

Create synthetic tenants, academic years, grades, divisions, subjects, users, roles, teacher assignments, linked parents, students with multiple enrollments, attendance corrections, assignments, and exam attempts. Never use real student data in development or test without approved controls.

## High-risk tests

- Cross-tenant read and mutation.
- Teacher access outside assigned class/subject.
- Parent access outside linked child.
- Historical enrollment overwrite or deletion.
- Duplicate attendance and correction races.
- Exam access outside window, duplicate submit, timeout, reconnect, and autosave conflicts.
- Unsafe file upload/download.
- Audit tampering and retention behavior.

## Test status

Test cases, test data, automation, environments, baseline targets, and results are TBD. No test has passed in this repository.

