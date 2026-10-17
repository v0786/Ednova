# Ednova Agent Team — Operating Protocol

## Mission
Build and verify EDNOVA — a multi-tenant educational platform — using the inspect-plan-build-test-review-fix loop with persistent documentation and evidence-based reporting.

## The Development Loop

```
[INSPECT] → [PLAN] → [ASSIGN] → [IMPLEMENT] → [TEST] → [REVIEW] → [FIX] → [VERIFY] → [RECORD] ↺
     ↑                                                                                           |
     └───────────────────────────────────────────────────────────────────────────────────────────┘
```

### Phase 1: Inspect
**Owner**: Orchestrator (with Specialist support)

1. Read project instructions (`CLAUDE.md`, `AGENTS.md`)
2. Audit repository structure and existing code
3. Identify tech stack and patterns already in use
4. Review existing documentation (PRD, ARCHITECTURE, TASK, MEMORY packs)
5. Check git status and recent commits
6. Run existing tests to establish baseline

**Evidence Required**:
- File structure summary
- Current implementation status
- Test baseline results
- List of blockers or technical debt

---

### Phase 2: Plan
**Owner**: Orchestrator + Product & Architecture Specialist

1. Define concrete milestone scope
2. Create dependency-aware task breakdown
3. Assign acceptance criteria (testable, verifiable)
4. Identify file ownership (avoid conflicts)
5. Set integration checkpoints

**Evidence Required**:
- Updated `TASK_LEDGER.md` with task IDs
- Dependency graph or list
- Acceptance criteria per task
- File ownership map

---

### Phase 3: Assign
**Owner**: Orchestrator

1. Assign one Specialist per task (accountable owner)
2. Specialist may delegate to Helpers for parallel work
3. Set explicit deadlines or checkpoints
4. Confirm understanding of acceptance criteria

**Rules**:
- One owner per file/module
- Parallel work only for independent tasks
- Explicit handoff points for dependencies

---

### Phase 4: Implement
**Owner**: Specialist (with Helper support)

1. Read relevant existing code before writing
2. Follow established patterns in the codebase
3. Preserve working functionality
4. Make small, reviewable changes
5. Run linters and type checks during work

**Evidence Required**:
- List of files changed
- Rationale for any pattern deviations
- Self-test results before submission

---

### Phase 5: Test
**Owner**: Specialist + QA & Security Specialist

1. Run unit tests: `npm test`
2. Run type checks: `npx tsc --noEmit`
3. Run linter: `npm run lint`
4. Manual verification of acceptance criteria
5. Screenshot/video evidence for UI changes

**Evidence Required**:
- Test output (pass/fail counts)
- Lint/type check results
- Screenshots for UI verification
- Manual test checklist completed

---

### Phase 6: Review
**Owner**: QA & Security Specialist (independent)

1. Code review for correctness, security, maintainability
2. Verify acceptance criteria met
3. Check for regressions
4. Security scan for secrets, vulnerabilities
5. Accessibility review (if UI changes)

**Evidence Required**:
- Review comments or approval
- Security scan results
- Regression test results

---

### Phase 7: Fix
**Owner**: Error Recovery Specialist (with original implementer)

1. Record error in `ERROR_LEDGER.md`
2. Root-cause analysis
3. Minimal targeted fix
4. Retest the specific failure
5. Regression test surrounding code

**One-Error-at-a-Time Protocol**:
- Record exact error, expected behavior, reproduction steps
- Identify root cause from evidence (no speculation)
- One focused fix per iteration
- Bundle no unrelated refactoring
- Verify fix + run regressions
- Close only when all checks pass

---

### Phase 8: Verify
**Owner**: Orchestrator

1. Integrate changes from all Specialists
2. Check API contracts and cross-module compatibility
3. Run full test suite
4. Verify build succeeds
5. Validate security boundaries

**Evidence Required**:
- Integrated change summary
- Full test suite results
- Build verification
- Security boundary check results

---

### Phase 9: Record
**Owner**: Orchestrator (with Specialist input)

1. Update `TASK_LEDGER.md` with completion status
2. Update `TEAM_STATUS.md` with current milestone progress
3. Record any decisions in `DECISIONS.md`
4. Close or update errors in `ERROR_LEDGER.md`
5. Document next actions

---

## Task Management

### Task States
- `pending` — Not yet started
- `in_progress` — Actively being worked
- `in_review` — Implementation complete, under review
- `blocked` — Blocked by dependency or issue
- `completed` — Verified and integrated

### Task ID Format
`TASK-{YYYYMMDD}-{CATEGORY}-{NNN}`
- Example: `TASK-20251017-FRONTEND-001`
- Categories: FRONTEND, BACKEND, MOBILE, QA, SECURITY, DEVOPS, PRODUCT

### Acceptance Criteria Template
Every task must have:
1. **Given** — Initial state/context
2. **When** — Action taken
3. **Then** — Expected outcome (verifiable)
4. **Evidence** — How to prove it's done

---

## Error Management

### Error ID Format
`ERR-{YYYYMMDD}-{CATEGORY}-{NNN}`

### Error States
- `open` — Active, not yet diagnosed
- `diagnosed` — Root cause identified
- `in_fix` — Fix being implemented
- `fixed` — Fix applied, awaiting verification
- `verified` — Fix verified, error closed
- `wontfix` — Intentionally not fixed (documented reason)

### Error Record Template
```yaml
ID: ERR-20251017-BACKEND-001
Title: Brief description
Status: open/diagnosed/in_fix/fixed/verified/wontfix
Severity: critical/high/medium/low
Reporter: Agent name
Assignee: Agent name

Reproduction:
  1. Step 1
  2. Step 2

Expected: What should happen
Actual: What actually happens

Root Cause: Analysis (once diagnosed)
Fix: Description of fix (once implemented)
Verification: How retested
```

---

## Communication Patterns

### Daily Standup (per work cycle)
Each Specialist reports:
1. What was completed since last standup
2. What's in progress
3. Blockers or help needed
4. Next immediate action

### Task Handoffs
Format:
```
Task: TASK-20251017-BACKEND-001
Status: Completed
Deliverables:
- app/src/lib/actions/timetableActions.ts
- app/src/app/admin/timetable/page.tsx
Evidence:
- Tests pass: 12/12
- Screenshot: [attached]
Next: Ready for integration
```

### Blocker Escalation
Format:
```
Blocker: Brief description
Task: TASK-XXX (blocked by this)
Attempted: What was tried
Help Needed: Specific question or permission
Urgency:blocks milestone/delays feature/nice to have
```

---

## Quality Gates

### Pre-Commit Checklist
- [ ] Code compiles/builds
- [ ] Linter passes (`npm run lint`)
- [ ] Type checks pass (`npx tsc --noEmit`)
- [ ] Tests pass (`npm test`)
- [ ] No secrets in code
- [ ] No console.logs (unless intentional)

### Pre-Integration Checklist
- [ ] All task acceptance criteria met
- [ ] Independent review completed
- [ ] Security reviewed (if auth/data changes)
- [ ] No merge conflicts
- [ ] Documentation updated

### Release Readiness Checklist
- [ ] All milestone tasks completed
- [ ] Full regression test suite passes
- [ ] Security audit passed
- [ ] Build artifact created
- [ ] Rollback plan documented

---

## Agent Invocation Guide

### Specialist Delegation
```typescript
// Orchestrator calls Specialist
Agent({
  description: "Implement teacher dashboard",
  subagent_type: "frontend-developer",
  prompt: "Implement the teacher workspace dashboard per TASK-20251017-FRONTEND-001. ..."
})
```

### Helper Delegation
```typescript
// Specialist calls Helper
Agent({
  description: "Audit auth patterns",
  subagent_type: "codebase-auditor",
  prompt: "Audit app/src/lib/auth/rbacGuard.ts for patterns to follow in new feature..."
})
```

---

## Success Metrics

- **Quality**: Zero critical defects at milestone completion
- **Velocity**: Tasks completed per work cycle
- **Predictability**: Actual vs estimated task completion
- **Collaboration**: Clean handoffs, minimal rework
- **Documentation**: All decisions and status current

---

## Safety & Guardrails

1. **Never** commit/push without user approval
2. **Never** run destructive DB operations without confirmation
3. **Never** enable paid services without explicit permission
4. **Never** expose secrets in code or logs
5. **Always** preserve working functionality
6. **Always** ask before production changes
7. **Always** run tests before claiming completion

---

## Current Active Loop

**Milestone**: Academic Operations Sprint  
**Status**: PLAN phase → IMPLEMENT phase  
**Next Orchestrator Action**: Create task ledger and assign first batch of tasks
