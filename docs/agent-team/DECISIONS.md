# Ednova Agent Team — Decision Log

## Date: 2025-10-17

---

### DECISION-001: Team Topology
**Decision**: Adopt 1 Orchestrator → 6 Specialists → 12 Helpers structure

**Rationale**:
- Clear ownership with single accountable specialist per task
- Helpers provide focused expertise without diluting responsibility
- Scalable for parallel execution

**Alternatives Considered**:
- Flat structure (rejected: unclear ownership)
- More specialists (rejected: coordination overhead)

---

### DECISION-002: Subagent Type Mapping
**Decision**: Use available subagent types that best match required expertise

**Mapping**:
| Required Role | Available Subagent Type Used |
|---------------|------------------------------|
| qa-engineer | Test Automation Engineer |
| devops-release-engineer | SRE (Site Reliability Engineer) |
| backend-database-developer | Backend Architect |
| mobile-developer | Mobile App Builder |
| frontend-developer | Frontend Developer (available) |

**Rationale**:
- Custom agent types not available in current environment
- Available types have sufficient expertise overlap
- Explicit prompts provide domain-specific context

---

### DECISION-003: Test Runner Configuration
**Decision**: Add `tsx` as test runner instead of Jest/Vitest

**Implementation**:
```json
"test": "tsx src/lib/actions/__tests__/mvpAcceptanceTest.test.ts"
```

**Rationale**:
- Native TypeScript execution without compilation
- Faster than setting up Jest/Vitest infrastructure
- Compatible with existing test file patterns

**Trade-offs**:
- No watch mode
- No coverage reporting built-in
- May add vitest later for advanced features

---

### DECISION-004: Parallel Execution Strategy
**Decision**: Execute independent tasks in parallel, max 7 concurrent agents

**Current Batch**:
1. MVP Test Verification (QA-001)
2. Build Pipeline Verification (DEVOPS-001)
3. Teacher Dashboard Layout (FRONTEND-001)
4. Lesson Log Actions (BACKEND-003)
5. Android Capacitor Setup (MOBILE-001)
6. Study Material Upload (BACKEND-004)
7. Timetable Conflict Detection (BACKEND-002)

**Rationale**:
- Maximizes throughput while respecting system limits
- No file conflicts between parallel tasks (different files/domains)
- Faster milestone completion

---

### DECISION-005: File Ownership Pattern
**Decision**: Each task owns specific files; no shared editing during parallel execution

**Ownership Map**:
| Task | Primary Files |
|------|---------------|
| BACKEND-001 | `timetableActions.ts` |
| FRONTEND-001 | `teacher/layout.tsx`, `teacher/page.tsx` |
| BACKEND-003 | `academicActions.ts` |
| BACKEND-004 | `fileActions.ts` |
| BACKEND-002 | `timetableActions.ts` (append-only) |
| MOBILE-001 | `capacitor.config.ts`, `android/` |

**Conflict Prevention**:
- BACKEND-001 completed before BACKEND-002 started
- FRONTEND tasks wait for BACKEND completion

---

### DECISION-006: Dependency Management
**Decision**: Use explicit dependency tracking in TASK_LEDGER.md

**Critical Path**:
- BACKEND-001 → FRONTEND-002, FRONTEND-003
- BACKEND-004 → FRONTEND-004
- All Backend → SECURITY-001

**Rationale**:
- Clear visibility into blockers
- Enables accurate parallel scheduling
- Prevents premature task execution

---

## Decision Process

1. **Trigger**: Task conflict, technical choice, or architectural question
2. **Analysis**: Evaluate alternatives with trade-offs
3. **Selection**: Choose option with best risk/benefit ratio
4. **Documentation**: Record in DECISIONS.md with rationale
5. **Communication**: Update affected agents via task descriptions

---

### DECISION-007: GitHub Actions Workflow Created
**Decision**: Create comprehensive build.yml for CI/CD pipeline

**Workflow Features**:
- Build job: lint, type-check, build, artifact upload
- Test job: runs npm test
- Mobile build job: Capacitor sync + Android APK build
- Caching for npm dependencies
- Triggers on push/PR to main and develop branches

**Rationale**:
- Addresses DEVOPS-001 finding that CI/CD was missing
- Provides automated verification on every PR
- Enables artifact generation for releases

---

*Last Updated: 2025-10-17*
