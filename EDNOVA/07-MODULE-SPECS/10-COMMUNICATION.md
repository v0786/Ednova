# Module Specification — Communication

| Field | Value |
|---|---|
| Document ID | MOD-COM-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 00-GOVERNANCE/05-CHANGE-MANAGEMENT.md |

## Purpose

Deliver governed announcements, notifications, messages, and parent communication within authorized relationships.

## Actors

SUPER_ADMIN, SCHOOL_ADMIN, PRINCIPAL, TEACHER, STUDENT, PARENT/GUARDIAN.

## Requirements

REQ-COM-001 and REQ-PRIV-001.

## User stories

US-COM-001: As an authorized school user, I want to communicate with the correct audience, so that academic information is timely and private.

## User flow

Compose → select allowed audience → validate scope/content → publish or send → record delivery state if supported → retain according to policy.

## Database entities

DB-COM-001: announcement, notification, message, conversation, recipient_scope, delivery_event, preference. Exact channels TBD.

## API requirements

API-COM-001: audience authorization, safe content/file validation, idempotent send, delivery status, and privacy controls.

## UI requirements

Audience and school context must be prominent; message status, read state, errors, and relationship scope must be clear. Native push, SMS, and email are not assumed.

## Permissions

Only approved capabilities can broadcast or message; teachers and parents communicate only through approved relationship scopes; recipients cannot infer unrelated records.

## Validation

Audience scope, content, attachment policy, sender capability, recipient relationship, rate limits, and retention.

## Error states

Unauthorized audience, invalid recipient, provider unavailable, duplicate send, blocked content/file, and retention restriction.

## Edge cases

Large audience, revoked relationship, duplicate delivery, school closure, muted preference, and provider outage.

## Audit requirements

Record sender, audience, content reference, send decision, delivery result, and administrative changes without exposing sensitive content unnecessarily.

## Acceptance criteria

AC-COM-001: messages and announcements cannot escape their approved audience; channel policy remains TBD.

## Test cases

TC-COM-001 audience; TC-COM-002 relationship revocation; TC-COM-003 duplicate/outage; TC-PRIV-002 communication privacy.

