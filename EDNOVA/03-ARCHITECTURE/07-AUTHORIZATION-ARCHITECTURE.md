# EDNOVA Authorization Architecture

| Field | Value |
|---|---|
| Document ID | ARCH-AUTHZ-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 03-DOMAIN-ARCHITECTURE.md, 08-SECURITY-ARCHITECTURE.md, 04-DATABASE/05-RLS-POLICIES.md |

## Model

The proposed model combines role-based permissions with capability and relationship scope. Roles provide a baseline; assignments and relationships constrain access to a school, academic year, grade, division, subject, student, or child.

## Initial roles

| Role | Intended baseline scope | Exact capabilities |
|---|---|---|
| SUPER_ADMIN | Platform | TBD; must not imply unrestricted student access without policy |
| SCHOOL_ADMIN | One school | Configure school and authorized records |
| PRINCIPAL | One school | Oversight and approved approvals/reports |
| TEACHER | Assigned teaching scope | Assigned classes, divisions, subjects, students |
| STUDENT | Own identity and authorized learning | Own records and eligible class work |
| PARENT/GUARDIAN | Linked child relationship | Linked child records only |
| SECURITY_STAFF | Assigned campus and gate scope | Verification and gate operations only; academic data is not implied |
| CAMPUS_SECURITY_ADMIN | Assigned campus or approved school scope | Manage gates, authorized lists, incidents, and security reports only |

## Enforcement layers

1. UI hides unavailable actions for clarity.
2. Server/API validates authenticated identity, tenant, capability, relationship, and target scope.
3. Domain rules validate assignment, time window, lifecycle, and historical constraints.
4. PostgreSQL constraints and RLS enforce data boundaries.
5. Audit records security and administrative decisions.

The UI is never the security boundary.

## Required authorization questions

- What exact capability names and role bundles exist?
- Can PRINCIPAL approve attendance corrections and publish results?
- How is SUPER_ADMIN break-glass access approved and audited?
- How are teacher substitutions and temporary assignments represented?
- How are parent/guardian relationships verified and revoked?
- Which reports contain aggregated or personally identifiable data?

All answers are TBD and require review before implementation.

## Future Security & Gate Management authorization

SECURITY_STAFF and CAMPUS_SECURITY_ADMIN are future roles, not additions to the active Phase 1 role baseline. Security Staff access must be constrained by school, optional campus, and assigned gate. A verification workflow may disclose only the minimum data needed to verify a person, guardian relationship, visitor, or vehicle; it must not grant academic-record access.

Future capabilities should be separate from academic capabilities, for example security:verify-person, security:manage-gate, security:manage-visitor, security:manage-vehicle, security:report-incident, security:view-history, security:manage-authorized-list, and security:manage-provider. Exact names and approval rules are TBD.

External provider credentials, mappings, webhooks, and synchronization operations require service-side capabilities and must not be available to Security Staff by default.
