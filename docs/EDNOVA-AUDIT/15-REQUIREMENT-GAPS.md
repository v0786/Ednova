# 15 — REQUIREMENT GAPS & DEFICIENCIES

## 1. Executive Summary
This document cataloging requirement gaps, missing specifications, un-enforced server-side checks, missing UI forms, and testing deficiencies across EDNOVA.

---

## 2. Requirement Gap Inventory

### GAP-01: UI Forms for Student Registration & Teacher Creation
- **Domain**: People & Enrollment Management.
- **Description**: While `academicActions.ts` provides backend functions (`enrollStudent`, `assignTeacher`), the web UI at `/admin/people` contains visual lists and buttons but lacks dynamic modal forms or server-action-connected inputs to create and register new students or teachers dynamically.
- **Impact**: Admin cannot dynamically add a new student or teacher directly from the web browser without database seed scripts.
- **Resolution**: Build modal form components in `/admin/people` connected to `enrollStudent` and `assignTeacher` server actions.

### GAP-02: Missing Multi-Tenant Database Initialization Script in Docker Compose
- **Domain**: Deployment & Container Infrastructure.
- **Description**: `docker-compose.yml` mounts only `app/supabase/schema.sql` into Docker's `/docker-entrypoint-initdb.d/`. Migrations 02 through 11 are ignored when bringing up a fresh environment.
- **Impact**: Fresh Docker deployments crash when invoking server actions targeting tables created in migrations 02-11.
- **Resolution**: Create a single concatenated initialization script (`00_full_schema.sql`) or mount all 11 migration files into `/docker-entrypoint-initdb.d/`.

### GAP-03: Lack of Automated E2E Security & RLS Test Suites
- **Domain**: QA & Testing.
- **Description**: The repository currently contains only one security test file (`authSecurityCheck.ts`), which performs type assertion. There are no automated integration or Playwright E2E tests verifying that School A users are blocked from School B data.
- **Impact**: Multi-tenant isolation is enforced in code, but automated regression testing is missing.
- **Resolution**: Add an E2E security test script (Vitest / Playwright) validating cross-tenant isolation and RLS boundaries.

### GAP-04: UI Form Wiring for Attendance Roster Submission
- **Domain**: Attendance System.
- **Description**: `/admin/attendance/page.tsx` uses a static mock array (`INITIAL_ROSTER`) and local React state. Calling "Save Roster Attendance" sets a local state flag `submitted=true` without executing `submitAttendanceRoster()`.
- **Impact**: Attendance submitted via web UI is not saved to PostgreSQL database.
- **Resolution**: Wire `/admin/attendance/page.tsx` to invoke `submitAttendanceRoster()` from `attendanceActions.ts` with real database parameters.

### GAP-05: Real-Time Parent Notification Trigger on Attendance Absent Status
- **Domain**: Communication & Notifications.
- **Description**: `notificationActions.ts` provides `queueNotification()`, and attendance marking supports `ABSENT` status. However, `submitAttendanceRoster()` does not automatically trigger `queueNotification()` when a student is marked `ABSENT`.
- **Impact**: Parents do not receive an immediate push/SMS notification when their child is marked absent.
- **Resolution**: Add an automated trigger inside `submitAttendanceRoster()` to queue an `ABSENT_ALERT` notification when an `ABSENT` status is submitted.

---

## 3. Prioritized Gap Closure Roadmap for MVP

1. **Step 1 (Critical)**: Fix Docker Compose migration mounting so all 11 SQL migrations execute on startup.
2. **Step 2 (Critical)**: Wire `/admin/school-setup` form to `createSchoolTenant` & `createAcademicYear` server actions.
3. **Step 3 (Critical)**: Add interactive Student Enrollment & Teacher Assignment modal forms to `/admin/people` connected to `academicActions.ts`.
4. **Step 4 (Critical)**: Wire `/admin/attendance` page to execute `submitAttendanceRoster()` server action.
5. **Step 5 (Important)**: Add automated multi-tenant isolation security test script.
