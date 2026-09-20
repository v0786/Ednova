# EDNOVA Risk Register

| Field | Value |
|---|---|
| Document ID | PM-RISK-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/05-FEASIBILITY-STUDY.md, 00-GOVERNANCE/05-CHANGE-MANAGEMENT.md, 09-QA/01-QA-STRATEGY.md |

## Initial risks

| ID | Risk | Likelihood | Impact | Mitigation / response | Owner | Status |
|---|---|---|---|---|---|---|
| RISK-001 | No implementation or runtime evidence exists. | High | High | Establish repository, environment, and deployment decisions before coding. | TBD | Open |
| RISK-002 | Tenant isolation or RLS design is incomplete. | Medium | Critical | Review data model, threat model, RLS, and negative tests before Phase 1 implementation. | TBD | Open |
| RISK-003 | Role vocabulary conflicts with preserved legacy FRD. | High | High | Resolve CR-001 and baseline a permission matrix. | TBD | Open |
| RISK-004 | Legacy scope adds Library, Finance, mobile, AI, push, or SMS without approval. | High | High | Resolve CR-002 and CR-003; keep unapproved items out of implementation. | TBD | Open |
| RISK-005 | Privacy jurisdiction and retention rules are unknown. | High | Critical | Identify applicable jurisdiction and privacy owner before handling real data. | TBD | Open |
| RISK-006 | Exam interruption and submission integrity are underspecified. | Medium | High | Define state machine, timer authority, autosave, idempotency, and tests before Phase 5. | TBD | Open |
| RISK-007 | Performance targets and expected scale are unknown. | High | High | Gather workload volumes and define measurable targets before benchmarking. | TBD | Open |
| RISK-008 | No approvers, product owner, or UAT owner are named. | High | High | Assign governance roles and reviewers. | TBD | Open |
| RISK-009 | Historical data changes could erase academic evidence. | Medium | Critical | Use append-only/history-preserving model and migration review. | TBD | Open |
| RISK-010 | Sensitive real student data may enter an unprepared environment. | Medium | Critical | Use synthetic data until privacy, access, storage, and retention controls are approved. | TBD | Open |
| RISK-011 | Future gate/security data or provider events could expose more student, guardian, visitor, or vehicle data than necessary. | Medium | Critical | Keep the module future-only; design minimum-necessary disclosure, campus/gate scope, provider isolation, retention, webhook security, and audit before implementation. | TBD | Open |
