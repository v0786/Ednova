# Ednova Agent Team — Topology

## Overview
This document defines the agent team structure for EDNOVA — a multi-tenant educational platform with Next.js 16, React 19, Supabase, and Capacitor mobile apps.

## Orchestrator
**Current Session (Chief Orchestrator)**
- **Responsibilities**: Planning, task assignment, coordination, integration, final verification, and user communication
- **Authority**: Decisions on architecture, scope changes, priority shifts
- **Deliverables**: Milestone plans, task assignments, integrated changes, status reports

---

## Six Specialist Agents

### 1. Product & Architecture Specialist
**Lead**: `product-manager`  
**Helpers**:
- `requirements-analyst` — Elicit, document, and trace requirements from PRDs
- `codebase-auditor` — Audit existing code, identify patterns, technical debt

**Responsibilities**:
- Define MVP scope and acceptance criteria
- Prioritize features based on user stories and business value
- Audit existing architecture and propose changes
- Maintain PRD, ARCHITECTURE, and DECISIONS documentation
- Resolve cross-pack dependencies and conflicts

**Key Files**:
- `docs/product/*/PRD.md`
- `docs/product/*/ARCHITECTURE.md`
- `docs/agent-team/DECISIONS.md`

**Current Focus**: Define next milestone (Academic Operations + Teacher Workspace) with clear acceptance criteria

---

### 2. Frontend & User Experience Specialist
**Lead**: `frontend-developer`  
**Helpers**:
- `ui-ux-designer` — Information architecture, responsive states, accessibility
- `component-implementation` — React components, hooks, client-side logic

**Responsibilities**:
- Implement responsive UI using Tailwind CSS v4
- Build accessible React 19 components
- Implement role-based workspace routing
- Optimize for mobile (touch targets, responsive layouts)
- Ensure cross-browser compatibility

**Key Files**:
- `app/src/app/**/*.tsx`
- `app/src/components/**/*.tsx`
- `app/src/app/globals.css`

**Current Focus**: Teacher workspace dashboard, timetable views, document preview modal

---

### 3. Backend & Database Specialist
**Lead**: `backend-database-developer`  
**Helpers**:
- `api-implementation` — Server actions, API contracts, business logic
- `schema-data-reviewer` — Database schema, migrations, RLS policies, data integrity

**Responsibilities**:
- Implement server actions for new features
- Maintain PostgreSQL schema and migrations
- Configure Supabase RLS policies for multi-tenant security
- Optimize queries for performance
- Ensure data consistency across operations

**Key Files**:
- `app/src/lib/actions/*.ts`
- Database migrations (via Supabase)
- `app/src/lib/auth/rbacGuard.ts`
- `app/src/lib/supabaseClient.ts`

**Current Focus**: Timetable scheduling APIs, conflict detection algorithms, document storage actions

---

### 4. Mobile & Integrations Specialist
**Lead**: `mobile-developer`  
**Helpers**:
- `android-specialist` — Capacitor Android configuration, native plugins
- `integration-connector` — Third-party integrations (when needed)

**Responsibilities**:
- Configure and maintain Capacitor Android wrapper
- Implement mobile-specific features (offline sync, push notifications)
- Ensure responsive mobile web as foundation
- Handle native plugin integration
- Manage app store submission preparation

**Key Files**:
- `app/android/` (Capacitor Android project)
- `app/capacitor.config.ts`
- `app/src/components/mobile/*.tsx`
- `app/src/lib/mobileClientSdk.ts`

**Current Focus**: Complete Android wrapper setup, test mobile workspace routing

---

### 5. Quality Assurance & Security Specialist
**Lead**: `qa-engineer`  
**Helpers**:
- `regression-test-engineer` — Test plans, automated tests, regression detection
- `security-reviewer` — Auth, authorization, secrets, input validation audits

**Responsibilities**:
- Create and execute test plans for each milestone
- Review security posture (RBAC, RLS, input validation)
- Run acceptance tests: `npm test`
- Validate tenant isolation and cross-boundary access
- Review for accessibility (WCAG) compliance

**Key Files**:
- `app/src/lib/actions/__tests__/*.test.ts`
- Security audit reports
- Test coverage reports

**Current Focus**: Validate MVP acceptance tests, security audit of attendance workflows, expand test coverage

---

### 6. Reliability, Error Recovery & Release Specialist
**Lead**: `devops-release-engineer`  
**Helpers**:
- `error-handler-solver` — Root-cause analysis, debugging, fixes
- `build-verification` — CI/CD, build pipeline, release readiness

**Responsibilities**:
- Maintain CI/CD pipeline (GitHub Actions or equivalent)
- Handle build failures and runtime errors
- Manage environment configuration
- Ensure production-readiness checklist
- Coordinate release verification and rollback procedures

**Key Files**:
- `.github/workflows/*.yml`
- `app/package.json` scripts
- Environment configuration docs
- `docs/agent-team/ERROR_LEDGER.md`

**Current Focus**: Verify build pipeline, document deployment steps, maintain error ledger

---

## Helper-to-Specialist Mapping

| Specialist | Helper 1 | Helper 2 |
|------------|----------|----------|
| Product & Architecture | requirements-analyst | codebase-auditor |
| Frontend & UX | ui-ux-designer | component-implementation |
| Backend & Database | api-implementation | schema-data-reviewer |
| Mobile & Integrations | android-specialist | integration-connector |
| QA & Security | regression-test-engineer | security-reviewer |
| Reliability & Release | error-handler-solver | build-verification |

---

## Communication Protocols

### Task Assignment Flow
1. **Orchestrator** creates task in `TASK_LEDGER.md`
2. **Orchestrator** assigns to **Specialist** (owner accountable)
3. **Specialist** may delegate to **Helper(s)** for parallel work
4. **Specialist** reports completion with evidence to **Orchestrator**
5. **Orchestrator** verifies and integrates

### Escalation Paths
- **Technical blockers** → Error Recovery Specialist
- **Security concerns** → QA & Security Specialist
- **Scope conflicts** → Product & Architecture Specialist
- **Build/CI issues** → Reliability & Release Specialist

### Documentation Requirements
- All decisions → `docs/agent-team/DECISIONS.md`
- All task status → `docs/agent-team/TASK_LEDGER.md`
- All errors → `docs/agent-team/ERROR_LEDGER.md`
- Team status → `docs/agent-team/TEAM_STATUS.md`

---

## Tool Configuration

### Claude Code Experimental Agent Teams
```json
// .claude/settings.local.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### Agent Definition Location
All reusable agent definitions: `.claude/agents/*.md`

---

## Current Milestone: "Academic Operations Sprint"

### Scope
Complete the in-progress features:
1. **Academic Operations** — Dynamic scheduling, timetable with conflict detection
2. **Teacher Workspace** — Dashboard, class rosters, lesson logs
3. **Learning Materials** — Document sharing, student preview modal

### Definition of Done
- [ ] All server actions implemented with RLS policies
- [ ] UI responsive and accessible
- [ ] Test coverage for new actions
- [ ] Security review passed
- [ ] Build succeeds with no errors
- [ ] Mobile routing verified

---

## Verification Checklist

- [ ] 1 Orchestrator defined (current session)
- [ ] 6 Specialists defined with clear responsibilities
- [ ] 12 Helpers defined (2 per specialist)
- [ ] Mapping verified (specialist → helpers)
- [ ] Communication protocols documented
- [ ] Task ledger created
- [ ] Error ledger created
- [ ] Decisions log created
- [ ] Team status tracking active
