# EDNOVA API Standards

| Field | Value |
|---|---|
| Document ID | API-STD-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-REQUIREMENTS/03-SRS.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md, 09-QA/02-TEST-STRATEGY.md |

## Boundary

API or server-action contracts are required before implementation. The concrete transport, route list, OpenAPI document, and generated clients are TBD.

## Standards

- Use explicit versioning and stable resource names; versioning strategy is TBD.
- Require authentication for protected operations.
- Derive tenant and user scope from trusted server context; do not trust client-supplied school, class, teacher, or student access claims.
- Authorize every read and mutation at the server/API boundary and rely on database/RLS enforcement as defense in depth.
- Validate input, file metadata, lifecycle transitions, time windows, idempotency keys, and relationships.
- Use a consistent error envelope with safe public message, machine-readable code, field details where safe, correlation ID, and no sensitive internals.
- Use pagination for collection endpoints; cursor versus offset and default/max page sizes are TBD.
- Use idempotency for attendance submission, corrections, exam autosave/submission, and other retry-sensitive mutations.
- Return explicit lifecycle and audit metadata where users need confirmation.
- Define rate limits for authentication, sensitive actions, bulk operations, and exam operations. Values are TBD.
- Avoid exposing internal identifiers or data beyond the caller’s capability.
- Document deprecation, backward compatibility, and migration behavior before changing contracts.

## Initial contract IDs

API-FND-001 tenant context and authorization; API-FND-002 foundation hierarchy and enrollment; API-PEO-001 student identity/enrollment; API-ATT-001 attendance; API-ATT-002 attendance correction; API-ACA-001 Today's Notes; API-ASM-001 assignments; API-EXAM-001 examination; API-SEC-001 security/audit; API-SEC-002 privacy requests; API-GATE-001 future gate operations; API-GATE-002 future provider synchronization.

## Not yet created

OpenAPI.yaml, authentication detail, authorization detail, error-handling detail, pagination rules, rate-limit policy, and endpoint-specific schemas remain to be authored after requirements and data design review.

## Future provider integration standards

Security & Gate Management providers must be integrated through adapters rather than provider-specific routes in core academic modules. Each adapter must define authentication, permission scope, request/response validation, provider-to-EDNOVA mapping, webhook verification, event ordering, retry policy, idempotency key, duplicate handling, error taxonomy, timeout behavior, and audit fields. MyGate is a possible provider, not a hardcoded architectural dependency. No provider API is called or implemented during the current phases.
