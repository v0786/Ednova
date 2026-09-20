# EDNOVA Security Architecture

| Field | Value |
|---|---|
| Document ID | ARCH-SEC-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-AUTHORIZATION-ARCHITECTURE.md, 04-DATABASE/05-RLS-POLICIES.md, 02-DISCOVERY/08-NON-FUNCTIONAL-REQUIREMENTS.md |

## Threat boundary

EDNOVA handles student data in a multi-tenant system. Threats include cross-tenant access, IDOR, privilege escalation, unsafe file access, session compromise, injection, accidental data loss, duplicate or forged academic events, exam access outside a window, and unauthorized history changes.

## Required controls

- Supabase Auth or approved authentication with secure session and reset handling.
- Server-side permission checks plus PostgreSQL RLS.
- Tenant context derived from trusted identity and validated on every protected operation.
- Input and file validation, safe storage paths, content-type/size policy, and download authorization.
- CSRF/session/origin protections appropriate to the chosen framework and deployment.
- Rate limiting where appropriate, especially authentication, sensitive actions, and exam endpoints.
- Audit of authentication, authorization failures, administrative changes, corrections, exam events, and security events.
- Secrets remain server-side; service-role credentials are never exposed to clients.
- Privacy-by-design data minimization, retention, export, deletion/anonymization, and access controls.
- Security review, RLS review, permission audit, performance testing, and load testing before production.
- Future gate-security controls must apply minimum-necessary disclosure to student, teacher, staff, guardian, visitor, photo, and vehicle data, with separate retention and privacy review.

## Exam security

Document actual access windows, attempt limits, timer authority, autosave, duplicate submission prevention, randomization, evaluation, publication, and audit controls. Browser examinations are not cheat-proof. Any monitoring or proctoring requires a separate privacy/security decision and human-review process.

## Security status

No controls are implemented or tested in this repository. This document is a required design baseline only.

## Future external security integrations

Any MyGate or other provider connection must use a server-side integration layer with API key or OAuth-based authentication where supported, least-privilege provider permissions, secret isolation, request signing or equivalent verification, webhook replay protection, schema validation, rate/error handling, retries with bounded backoff, idempotency, duplicate detection, correlation IDs, and audit logging. Provider outages must not bypass EDNOVA authorization or corrupt the local audit trail.

Visitor photos, basic visitor details, vehicle identifiers, emergency alerts, incidents, and searchable gate history are sensitive. The future design must define purpose, access, retention, export, correction, deletion/anonymization, and data-subject handling before implementation.
