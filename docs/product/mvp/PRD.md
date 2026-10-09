# MVP Release — PRD

## Purpose and scope
Minimum valuable institution-ready release. This pack defines the requirements for the mvp release within EDNOVA and is scoped to what is currently known or planned from the repository.

## Target users
- Platform owners and institutional stakeholders
- Administrators, teachers, students, parents, and security personnel as applicable
- Support and operations staff

## Problems being solved
- Reduce fragmented school operations into a single institution-aware workflow
- Preserve tenant boundaries between institutions and users
- Support role-aware access for operational and academic tasks
- Create a predictable system for onboarding, academics, assessment, and communication

## Functional requirements
- REQ-MVP-001: The pack must define its primary user and operational workflow.
- REQ-MVP-002: The pack must respect shared authentication and authorization contracts.
- REQ-MVP-003: The pack must document interface dependencies and expected upstream/downstream packs.
- REQ-MVP-004: The pack must define a clear MVP or planned-scope boundary.

## Non-functional requirements
- Role-based authorization and institution-scoped data isolation
- Clear API and UI contracts
- Graceful handling of failure, loading, and empty states
- Security-first posture for sensitive academic and operational records

## User stories
- As an institutional admin, I want to manage academic and operational workflows without cross-tenant leakage.
- As a teacher, I want a clear classroom workflow for attendance, materials, assessments, and reporting.
- As a student, I want clear visibility into my schedule, assignments, and results.
- As a parent, I want access only to the relevant student associations and approved information.

## Primary workflows
1. Identify actor and their highest-priority workflow.
2. Validate session and role context.
3. Enforce tenant and resource boundaries.
4. Execute the workflows against current server actions and UI routes.
5. Record actions and exceptions in audit-friendly logs.

## Permissions and access boundaries
The current repository implements a shared role model in app/src/lib/auth/rbacGuard.ts. This pack must not redefine roles in conflict with the shared model without explicit resolution.

## Dependencies on other packs
- Shared pack defines global rules and cross-cutting security terms.
- Backend pack owns server contracts and tenant-aware data access.
- UI packs depend on shared design conventions and common role model.

## Priorities
- P0: Identity, tenant isolation, and authorization
- P1: Core user workflow and institutional operations
- P2: enhancements, reporting, and future integrations

## Acceptance criteria
- Requirements are explicit and uniquely identified.
- Dependencies and ownership are documented.
- Security and permission constraints are stated.
- Implementation scope is clear about what is verified versus future/planned.

## Explicit exclusions
- This pack does not claim implementation of unverified modules or features.
- This pack does not redefine shared security rules in conflict with the platform model.

## Evidence status
- VERIFIED: repository structure and server-side auth patterns are visible in source.
- PARTIALLY_VERIFIED: workflows that rely on app pages and actions but lack direct end-to-end tests.
- PLANNED: future or optional features not implemented in the current codebase.
