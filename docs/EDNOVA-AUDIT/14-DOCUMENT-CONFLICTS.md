# 14 — DOCUMENT CONFLICTS & CONTRADICTION AUDIT

## 1. Executive Summary
This document records significant documentation, specification, and implementation contradictions identified during the repository audit. Each conflict includes source citations, impact analysis, recommended resolution, and whether a human product/architecture decision is required.

---

## 2. Identified Contradictions

### CONFLICT-01: Institutional Role Count Alignment (8 vs 10 Roles)
- **Source A**: `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` (Section 2, Lines 10-28) defines 6-8 roles (`Owner`, `Admin`, `Teacher`, `Student`, `Parent`, `Security Guard`).
- **Source B**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md`, `app/supabase/migrations/10_canonical_roles_and_notifications.sql`, and `app/src/lib/auth/rbacGuard.ts` define **10 canonical roles**:
  `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `SUPER_ADMIN`, `SCHOOL_ADMIN`, `ADMIN_STAFF`, `PRINCIPAL`, `TEACHER`, `SECURITY_GUARD`, `SECURITY_STAFF`, `STUDENT`, `PARENT`.
- **Conflict**: Document 02 omits `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `ADMIN_STAFF`, `SECURITY_STAFF` from its overview list, while database migrations and security guards explicitly support all 10 roles.
- **Why It Matters**: Authorization checks in code will fail or become ambiguous if role definitions do not match.
- **Potential Impact**: Low to Medium.
- **Recommended Resolution**: Adopt the 10 canonical roles defined in Migration 10 and `rbacGuard.ts` as canonical.
- **Needs Human Decision**: NO (Code and security guards already implement the 10 roles consistently).

---

### CONFLICT-02: Attendance Status Enumeration
- **Source A**: Early archive document `docs/archive/01_PRODUCT_AND_REQUIREMENTS.md` mentions `PRESENT`, `ABSENT`, `LATE`.
- **Source B**: Core schema `app/supabase/schema.sql`, Migration 05, and `attendanceActions.ts` define 5 statuses:
  `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`.
- **Source C**: Build prompt explicitly requests `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`.
- **Conflict**: Historical archive defined a narrower 3-status model.
- **Why It Matters**: Attendance marking UI and database constraints must support the required status set.
- **Potential Impact**: Low.
- **Recommended Resolution**: Preserve the 5-status enum (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`) currently implemented in `schema.sql` and `attendanceActions.ts`.
- **Needs Human Decision**: NO (All active sources and build prompt agree on 5 statuses).

---

### CONFLICT-03: Single Mobile App vs Legacy "Four Mobile Apps" Phrasing
- **Source A**: `docs/mobile/MOBILE_IMPLEMENTATION.md` legacy text: "connects all four mobile role applications".
- **Source B**: `docs/core/01_EDNOVA_ARCHITECTURE.md`, `docs/mobile/MOBILE_ARCHITECTURE.md`, `mobileClientSdk.ts`, and `docs/additional/DOCUMENTATION_INTEGRITY_AUDIT.md` explicitly mandate **ONE SINGLE MOBILE APPLICATION** codebase (`mobile-core`) with dynamic role workspace resolution.
- **Conflict**: Phrasing discrepancy between legacy text and current architecture.
- **Why It Matters**: Developers might build 4 separate mobile apps instead of 1 unified mobile app with dynamic workspace switching.
- **Potential Impact**: High (if wrong mobile architecture is chosen).
- **Recommended Resolution**: Confirm Single Mobile Application strategy (`mobile-core`). The legacy phrasing has been flagged in integrity audits.
- **Needs Human Decision**: NO (Core architecture 01 and mobile SDK already enforce 1 single mobile app).

---

### CONFLICT-04: Docker Compose DB Initialization vs Migration Pipeline
- **Source A**: `docker-compose.yml` mounts only `./app/supabase/schema.sql` to `/docker-entrypoint-initdb.d/01_schema.sql`.
- **Source B**: Database entities are spread across `schema.sql` and 10 migration files in `app/supabase/migrations/` (02 through 11).
- **Conflict**: Running `docker compose up` initializes a PostgreSQL container that executes `schema.sql` but skips migrations 02-11.
- **Why It Matters**: Fresh deployment via Docker Compose lacks tables like `attendance_correction_requests`, `audit_events`, `academic_assessments`, etc., causing server action SQL errors.
- **Potential Impact**: High for deployment.
- **Recommended Resolution**: Combine `schema.sql` and migrations 02-11 into a single entrypoint SQL script or mount all SQL files in order in `/docker-entrypoint-initdb.d/`.
- **Needs Human Decision**: NO (Technical fix required for deployment reliability).

---

### CONFLICT-05: LMS Scope vs LMS Learning Loop Requirements
- **Source A**: Generic academic workflows or legacy prompts describe LMS features (SCORM, video courses, learning-gap engines, mastery learning).
- **Source B**: `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` explicitly states: "EDNOVA is NOT an LMS. It does not host course marketplaces, SCORM packages, video streaming courses, or public learning catalogs."
- **Conflict**: Misconception about EDNOVA being an LMS.
- **Why It Matters**: Prevents scope creep into course streaming and SCORM engines.
- **Potential Impact**: High for product scope.
- **Recommended Resolution**: Maintain explicit non-LMS boundary. EDNOVA is an operational management, safety, attendance, and feedback platform.
- **Needs Human Decision**: NO (Explicitly settled in core spec 02).

---

### CONFLICT-06: Front-End UI Mock Roster vs Backend Server Actions Integration
- **Source A**: `/admin/attendance/page.tsx` uses a hardcoded `INITIAL_ROSTER` state array (`Alex Rivera`, `Sophia Chen`, etc.).
- **Source B**: `attendanceActions.ts` provides a complete server action `submitAttendanceRoster()` connected to PostgreSQL database tables.
- **Conflict**: Web UI components are currently using client mock state rather than calling the Server Actions.
- **Why It Matters**: Submitting attendance in the current UI does not mutate the PostgreSQL database.
- **Potential Impact**: Medium for MVP completion.
- **Recommended Resolution**: Connect form submit handlers in UI pages (`/admin/attendance`, `/admin/school-setup`, `/admin/people`) directly to `attendanceActions.ts` and `academicActions.ts`.
- **Needs Human Decision**: NO (Required engineering step for MVP).
