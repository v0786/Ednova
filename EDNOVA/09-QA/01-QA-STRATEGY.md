# EDNOVA QA Strategy

| Field | Value |
|---|---|
| Document ID | QA-STRAT-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-GOVERNANCE/04-DEFINITION-OF-DONE.md, 09-QA/02-TEST-STRATEGY.md, 03-TRACEABILITY-MATRIX.md |

## Quality objectives

Verify that EDNOVA meets documented requirements without weakening tenant isolation, privacy, auditability, accessibility, history preservation, exam integrity, or responsive usability.

## Quality approach

- Shift left: review requirements, UX, data, API, and security before implementation.
- Test the full requirement-to-release traceability chain.
- Treat authorization and RLS as testable behavior, not configuration assumptions.
- Use realistic, non-production test data with tenant and relationship boundaries.
- Test both expected flows and unsafe/retry/error paths.
- Record evidence, environment, data, date, result, defect link, and tester.

## Quality gates

| Gate | Entry | Exit |
|---|---|---|
| Requirements review | Draft requirement exists | IDs, acceptance, dependencies, risks reviewed |
| Design review | Approved-enough requirements | Architecture, schema, API, UX, security coverage |
| Implementation review | Design approved | Code review, unit tests, docs updated |
| Integration | Component tests available | Cross-module, RLS, authorization, error paths pass |
| Acceptance | Feature is testable | Acceptance criteria pass; known issues accepted |
| Release | Phase scope complete | Security, performance, accessibility, deployment, rollback, sign-off |

## Current evidence

No QA execution occurred because no application or test suite exists in the inspected repository.

