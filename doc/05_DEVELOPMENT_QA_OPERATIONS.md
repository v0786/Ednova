# EDNOVA — Development, QA, Release & Operations

## 1. Engineering Principles

EDNOVA must be:
- specification-first
- traceable
- incremental
- testable
- secure
- auditable
- maintainable
- scalable
- production-oriented

Documentation is part of the engineering system.

## 2. Agent Operating Procedure

Whenever working on EDNOVA:

```text
Inspect repository
↓
Inspect documentation
↓
Determine current phase
↓
Determine implementation status
↓
Determine requirements
↓
Check whether requested work is documented
↓
Update documentation if needed
↓
Validate architecture compatibility
↓
Implement approved scope
↓
Run tests
↓
Fix defects
↓
Update documentation
↓
Update traceability
↓
Produce implementation report
```

## 3. Coding Rules

- Executable work must produce real TypeScript/SQL/Next.js/Android code as applicable.
- Markdown is documentation, not implementation.
- Never trust client inputs.
- Never expose service-role credentials.
- Never commit secrets.
- Never hardcode tenant IDs.
- Never bypass authorization.
- Never silently alter audit history.
- Never overwrite historical academic records without an approved migration/change process.
- Avoid unnecessary infrastructure.
- Do not add microservices without architectural justification.

## 4. Change Management

Create a Change Request for changes affecting:
- database schema
- authorization
- security
- API contracts
- workflows
- phase boundaries
- historical data
- architecture

Change request fields:
- Problem
- Requested change
- Reason
- Affected modules
- Architecture impact
- Database impact
- Security impact
- Migration required
- Backward compatibility
- Decision
- Approver

## 5. Architecture Decisions

Significant decisions should record:
- context
- problem
- options
- decision
- reason
- consequences
- rejected alternatives
- date
- status

## 6. Testing

Required layers may include:
- unit tests
- domain tests
- API/server-action tests
- database/RLS tests
- authorization tests
- integration tests
- UI tests
- Android tests
- end-to-end tests
- security tests
- performance tests
- UAT

Never claim a test passed unless it actually ran.

## 7. Security Testing

Test:
- tenant isolation
- IDOR
- privilege escalation
- role boundary
- confidential feedback access
- incident access
- audit tampering
- export permissions
- file upload abuse
- session security
- prompt injection
- AI data leakage

## 8. Performance

Define measurable targets for:
- initial page load
- dashboards
- roster loading
- attendance
- large datasets
- API latency
- database queries
- mobile synchronization where applicable

Do not invent benchmark results.

## 9. Quality Gate

Existing project context identifies:

```text
npm run build
```

inside `app/` as a basic build-quality gate.

A phase should not be marked complete unless:
- scope is complete
- requirements are satisfied
- documentation is updated
- database changes are documented
- API changes are documented
- UX is complete
- tests pass
- security review passes
- acceptance criteria pass
- known issues are recorded
- traceability is complete
- sign-off is recorded

## 10. Statuses

Use:
- NOT_STARTED
- DOCUMENTING
- READY_FOR_IMPLEMENTATION
- IN_PROGRESS
- BLOCKED
- IN_REVIEW
- TESTING
- SECURITY_REVIEW
- UAT
- COMPLETED
- DEFERRED

Never mark work complete without evidence.

## 11. Deployment

Production deployment must include:
- installation
- configuration
- activation
- database migration
- backup
- health check
- rollback plan
- monitoring
- logs
- recovery process

## 12. Operations

Monitor:
- server health
- application health
- database health
- storage
- AI
- notifications
- backup
- license
- updates
- security events

## 13. Incident Response

Operational incidents must have:
- detection
- severity
- owner
- timeline
- containment
- resolution
- post-incident review
- corrective actions

## 14. Release

Every release should record:
- version
- requirements included
- migrations
- API changes
- UI/mobile changes
- security changes
- tests
- known issues
- rollback procedure

## 15. Maintenance

Maintain:
- dependencies
- security patches
- database migrations
- backups
- monitoring
- documentation
- test suites
- deployment scripts

## 16. Stop Conditions

Stop and report if:
- requirements conflict
- architecture conflicts
- migration is unsafe
- authorization is unclear
- tenant isolation cannot be guaranteed
- existing functionality would break
- required information is missing
- scope exceeds current phase
- a security vulnerability is discovered
- critical tests fail
- documentation contradicts implementation

Do not guess.
