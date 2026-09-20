# Module Specification — Reporting

| Field | Value |
|---|---|
| Document ID | MOD-REP-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-ARCHITECTURE/05-DOMAIN-ARCHITECTURE.md, 03-ARCHITECTURE/07-AUTHORIZATION-ARCHITECTURE.md |

## Purpose

Provide authorized attendance, assignment, exam, student progress, class performance, and school performance reporting.

## Actors

PRINCIPAL, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT/GUARDIAN, SUPER_ADMIN as approved.

## Requirements

REQ-REP-001 and REQ-PRIV-001.

## User stories

US-REP-001: As an authorized decision maker, I want accurate scope-aware reports, so that I can act on academic information.

## User flow

Choose authorized report → set time/academic scope → validate access → generate from governed records → review → export or view → audit.

## Database entities

DB-REP-001: report_definition, report_run, authorized_projection, export_job, audit reference. Source records remain authoritative.

## API requirements

API-REP-001: report authorization, parameter validation, pagination/streaming for large data, export safety, and run audit.

## UI requirements

Show filters, scope, data freshness, definitions, empty/error states, accessible tables/charts, and export controls only when authorized.

## Permissions

Aggregates and student-level data follow role, school, class, subject, and child relationship scope.

## Validation

Allowed dimensions, date/year range, report definition, export format, row limits, and sensitive-field policy.

## Error states

Unauthorized scope, no data, stale source, expensive request, export failure, and partial job.

## Edge cases

Historical year, withdrawn student, incomplete assessment, concurrent report runs, and changed definitions.

## Audit requirements

Record report definition, parameters, requester, generated version, export, and access without leaking data to unauthorized viewers.

## Acceptance criteria

AC-REP-001: report results honor scope and source definitions; exact KPI and export policy TBD.

## Test cases

TC-REP-001 scope; TC-REP-002 historical data; TC-REP-003 export; TC-PRIV-003 sensitive report denial.

