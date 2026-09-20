# EDNOVA Feasibility Study

| Field | Value |
|---|---|
| Document ID | PM-FEAS-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 01-BRD.md, 03-SRS.md, 03-ARCHITECTURE/01-SYSTEM-ARCHITECTURE.md, 10-PROJECT-MANAGEMENT/04-RISK-REGISTER.md |

## Executive conclusion

Technical feasibility is PROPOSED but not validated because the repository contains no implementation or environment. Organizational, financial, legal/privacy, operational, and schedule feasibility are TBD.

## Technical feasibility

The master prompt specifies a conventional modular-monolith direction: Next.js, React, TypeScript, Supabase, PostgreSQL, Auth, Storage, and RLS. This is a plausible direction for the documented domains, but feasibility still requires proof of:

- tenant isolation and RLS design;
- authorization scope for school, grade, division, subject, and child relationships;
- historical student identity and enrollment model;
- exam autosave, timer, interruption, and submission integrity;
- storage, file validation, audit, backup, and recovery;
- expected scale, performance, accessibility, and browser support.

No prototype or benchmark exists.

## Organizational feasibility

School workflows, implementation partners, support model, training capacity, and decision owners are TBD.

## Financial feasibility

Budget, staffing, Supabase/storage costs, notification costs, support costs, and total cost of ownership are TBD. Cost estimation is intentionally not fabricated.

## Legal and privacy feasibility

Student-data jurisdiction, applicable privacy laws, data residency, consent, retention, access requests, deletion/anonymization, and contracts are TBD. A privacy/security review is required before production.

## Operational feasibility

Backup, monitoring, incident response, support, deployment, disaster recovery, SLA, and maintenance are TBD.

## Go/no-go questions

The project cannot be declared feasible for implementation until the open questions above have owners and decisions, and Phase 1 architecture/security review passes.

