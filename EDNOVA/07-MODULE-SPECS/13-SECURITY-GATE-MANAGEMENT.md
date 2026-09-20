# Future Module Specification — Security & Gate Management

| Field | Value |
|---|---|
| Document ID | MOD-GATE-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/01-BRD.md, 01-REQUIREMENTS/02-FRD.md, 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 03-ARCHITECTURE/06-DATA-ARCHITECTURE.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md, 03-ARCHITECTURE/08-SECURITY-ARCHITECTURE.md |

## Scope status

FUTURE SCOPE ONLY. This module is not part of the active Phase 1-7 implementation work. No Security & Gate Management feature, MyGate integration, or external security API is authorized by this document.

## Purpose

Provide a future MyGate-style security experience for schools and colleges while remaining a modular, provider-neutral part of the EDNOVA ecosystem. The module will support campus access operations without granting Security Staff implicit access to academic records.

## Actors

- SECURITY_STAFF: future role with assigned campus/gate scope.
- CAMPUS_SECURITY_ADMIN: future role with approved campus/security-management scope.
- SCHOOL_ADMIN and PRINCIPAL: future oversight capabilities, subject to approval.
- Student, teacher, staff member, parent/guardian, visitor, and vehicle subject to verification.
- SUPER_ADMIN or integration operator for future provider configuration.
- External security provider, such as MyGate, only when formally approved and technically/commercially available.

## Requirements

- REQ-GATE-001: reserve a modular future Security & Gate Management boundary.
- REQ-GATE-002: support provider-neutral external integration design.
- REQ-BIZ-FUT-001: preserve academic core isolation and future extensibility.
- REQ-BIZ-FUT-002: support multiple security providers through an integration layer.

Planned capability areas are security-staff login and RBAC, dedicated responsive web/mobile-friendly interface, student/teacher/staff and visitor verification, digital gate entry/exit, parent/guardian verification, QR/ID verification, visitor photo/basic details, vehicle events, authorized visitor/vehicle lists, emergency/security alerts, incidents, gate-wise monitoring, administrator notifications including real-time behavior where an approved channel supports it, history/reports, searchable logs, and multiple campuses/gates. Exact workflows and policy rules are TBD.

## User stories

### US-GATE-001

As future Security Staff, I want to verify a person or visitor at my assigned gate, so that campus entry decisions are recorded and scoped.

Priority: FUTURE / TBD. Preconditions: Future role, gate, verification policy, and privacy policy are approved. Dependencies: REQ-GATE-001. Related module: Security & Gate Management.

### US-GATE-002

As a platform operator, I want security providers connected through adapters, so that EDNOVA can support more than one provider without coupling the academic core to MyGate.

Priority: FUTURE / TBD. Preconditions: Provider access and contract are approved. Dependencies: REQ-GATE-002. Related module: Security & Gate Management and Security & Audit.

## User flows

### UX-GATE-001 — Gate verification

Select assigned campus/gate → scan QR/ID or search permitted record → show minimum necessary verification details → capture entry/exit result → record timestamp, actor, gate, and event identity → notify approved administrator if policy requires.

### UX-GATE-002 — Visitor registration

Create or find visitor → capture approved basic details/photo and host/purpose → validate authorized visitor list or approval → issue visitor reference/QR if approved → record entry → record exit or overdue state.

### UX-GATE-003 — Vehicle event

Select gate → identify vehicle or authorized vehicle record → capture entry/exit → link permitted visitor/host where applicable → record event and alert outcome.

### UX-GATE-004 — Incident and emergency alert

Security Staff records incident or triggers approved alert → system validates capability and required details → notifies authorized administrators → preserves incident history and follow-up state.

### UX-GATE-005 — Provider synchronization

Provider adapter receives authenticated API response or webhook → verifies source and replay protection → validates payload → maps provider identity to EDNOVA tenant/campus/gate/entity → deduplicates by provider event identity → applies approved event transition → records retry/error/audit state.

## Database entities

- DB-GATE-001: campus, gate, gate_scope.
- DB-GATE-002: visitor, visitor_photo, authorized_visitor.
- DB-GATE-003: gate_event, verification_event, entry_exit_record.
- DB-GATE-004: vehicle, authorized_vehicle, vehicle_event.
- DB-GATE-005: security_incident, alert, notification reference.
- DB-GATE-006: integration_provider, provider_mapping, webhook_event, sync_attempt.

These are extension points only. No migration is authorized. The future design must define tenant/campus/gate keys, immutable event identity, retention, deletion/anonymization, indexes, RLS, and provider mapping.

## API requirements

- API-GATE-001: future security-staff authentication, gate-scoped verification, visitor/vehicle events, incidents, alerts, history, and reports.
- API-GATE-002: future provider adapter operations with API key/OAuth authentication where supported, permission scope, validation, webhook/event synchronization, bounded retries, idempotency, duplicate prevention, and audit.
- External provider credentials remain server-side. Provider events must not bypass EDNOVA authorization or become an unvalidated source of truth.
- Exact routes, schemas, rate limits, timeouts, provider contracts, and availability behavior are TBD.

## UI requirements

- Future responsive web interface, with a dedicated security workflow optimized for rapid gate operations and mobile-friendly use.
- Visible school/campus/gate context and current operator scope.
- Minimal disclosure during verification.
- Clear entry/exit state, duplicate/retry state, visitor/vehicle status, alert severity, incident follow-up, and synchronization state.
- Searchable logs and reports for authorized administrators.
- Accessible keyboard, focus, contrast, screen-reader, and non-color status behavior.
- No native mobile app is assumed; any native client requires separate scope approval.

## Permissions

- SECURITY_STAFF: verify and record events only for assigned campus/gates; no implicit academic access.
- CAMPUS_SECURITY_ADMIN: manage gates, authorized lists, incidents, alerts, and security reports for assigned campus.
- SCHOOL_ADMIN/PRINCIPAL: future oversight only when explicitly granted.
- SUPER_ADMIN/integration operator: provider configuration and operational access only through separate capability and audit.
- Students, teachers, staff, guardians, and visitors are verification subjects, not automatically operators.
- Provider adapters use service-side capabilities; external systems cannot grant EDNOVA permissions.

## Validation

Validate tenant, campus, gate, operator scope, QR/ID format, person/guardian relationship, visitor approval, photo/file policy, vehicle identity, event type, event timestamp, duplicate/provider-event key, incident severity, alert recipient scope, payload signature, schema version, and lifecycle transition.

## Error states

Unauthenticated operator, unauthorized gate, unknown identity, expired visitor authorization, invalid QR/ID, duplicate entry/exit, missing exit, provider timeout, invalid webhook signature, replayed event, mapping failure, rate limit, notification failure, and audit persistence failure.

## Edge cases

Multiple campuses and gates, staff working across approved gates, visitor without pre-registration, guardian with multiple linked children, student or teacher identity not found, vehicle without an authorized record, gate offline, duplicate provider delivery, out-of-order webhook, provider outage, emergency override, event correction, visitor photo retention expiry, and revoked authorization during an active visit.

## Audit requirements

Audit login, role/capability decisions, verification attempts, entry/exit, visitor and vehicle changes, photo access, authorized-list changes, incidents, alerts, emergency actions, provider credentials/configuration, webhook validation, mapping, retries, duplicates, failures, and administrative searches. Audit must be tenant/campus scoped and protected from ordinary mutation.

## Acceptance criteria

### AC-GATE-001 — Isolated future module

- Given Security & Gate Management is later approved, when a Security Staff operator uses a gate workflow, then access is limited to the assigned tenant/campus/gate.
- Given a verification request, when it is processed, then only the minimum approved data is disclosed and the event is auditable.
- Given an academic record is requested by Security Staff, when no separate capability exists, then the request is denied.

### AC-GATE-002 — Provider-neutral integration

- Given a future provider adapter receives an event, when authentication, signature/replay, schema, tenant mapping, and deduplication pass, then the event can enter the approved synchronization workflow.
- Given the same provider event is delivered more than once, when it is processed, then no duplicate EDNOVA event is created.
- Given the provider is unavailable or sends invalid data, when synchronization runs, then the system records a bounded retry/error state without bypassing local authorization.

## Test cases

- TC-GATE-001: Security Staff gate-scope authorization.
- TC-GATE-002: minimum-disclosure verification and academic-data denial.
- TC-GATE-003: duplicate entry/exit and event idempotency.
- TC-GATE-004: visitor/vehicle/incident audit trail.
- TC-GATE-005: provider API key/OAuth secret isolation.
- TC-GATE-006: webhook signature and replay protection.
- TC-GATE-007: duplicate and out-of-order provider events.
- TC-GATE-008: provider timeout, retry, mapping failure, and audit behavior.

All tests are future design targets. No test has been executed.
