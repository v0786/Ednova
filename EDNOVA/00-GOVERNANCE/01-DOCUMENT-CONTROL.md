# EDNOVA Document Control

| Field | Value |
|---|---|
| Document ID | GOV-DOC-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 00-MASTER-SDLC-PROMPT.md, 02-DOCUMENT-INDEX.md, 05-CHANGE-MANAGEMENT.md |

## Purpose

This document defines how EDNOVA engineering documentation is identified, reviewed, baselined, changed, and retired. The governing prompt is the primary source of truth until an approved change request or architecture decision changes it.

## Control rules

- Controlled documents use the metadata fields above.
- New requirements use stable identifiers such as REQ-FND-001, REQ-ATT-001, or REQ-EXAM-001.
- User stories, acceptance criteria, tests, APIs, database entities, UX flows, defects, change requests, and architecture decisions use the identifier patterns in the governing prompt.
- Existing identifiers are not casually renumbered. Legacy identifiers are retained in preserved drafts and are mapped during normalization.
- A document may say KNOWN, ASSUMED, PROPOSED, TBD, or VALIDATED. These labels are evidence boundaries, not approval states.
- APPROVED, IMPLEMENTED, and VERIFIED require recorded review or execution evidence. No bootstrap document is approved by this report.
- Changes affecting architecture, schema, authorization, security, API contracts, historical data, or phase boundaries require a change request and, where applicable, an ADR.
- Documents are updated before implementation work that depends on them.

## Status meanings

| Status | Meaning |
|---|---|
| DRAFT | Authored but not approved. |
| IN_REVIEW | Submitted for review; approval is not implied. |
| APPROVED | Reviewed by the designated owner and approver. |
| IMPLEMENTING | Approved content is being implemented. |
| IMPLEMENTED | The described change exists, but verification may remain. |
| VERIFIED | Required evidence and acceptance are recorded. |
| SUPERSEDED | Replaced by a newer controlled document. |

## Initial baseline

The 2026-09-21 bootstrap baseline contains the governing prompt, canonical initial documents, and two preserved legacy drafts. There is no Git repository or commit baseline in the inspected workspace. The bootstrap is therefore identified by its filesystem date and this report, not by a commit hash.

## Review responsibilities

Owners and approvers are TBD. Until assigned, documents remain DRAFT and no phase gate is considered signed off.

