# 11 — TESTING & QA ANALYSIS

## 1. Executive Summary
This document audits existing test suites, build compilation checks, and missing QA test requirements across EDNOVA web applications and server actions.

---

## 2. Existing Test Inspection
- **Active Code Test File**: `app/src/lib/actions/__tests__/authSecurityCheck.ts`.
  - Tests type correctness of `AuthSessionContext` and verifies that `validateTenantAccess()` throws an error when `requestSchoolId !== session.schoolId`.
- **Compilation Check**: `npm run build` succeeds cleanly with 0 TypeScript or Next.js build errors across 19 static application routes.
- **Automated E2E / Unit Test Suites**: **MISSING / NOT YET IMPLEMENTED**. (No Jest, Vitest, or Playwright configuration currently present in `package.json`).

---

## 3. Mandatory Test Coverage Requirements for Basic MVP

| Domain | Test Case Description | Expected Result | Implementation Status |
|---|---|---|:---:|
| **AUTH** | Valid credential login | Returns session token & profile | NOT VERIFIED |
| **AUTH** | Unauthenticated route access | Redirects to `/login` or throws UNAUTHORIZED | NOT VERIFIED |
| **SCHOOL** | Admin creates school tenant | Row created in `schools` table | NOT VERIFIED |
| **SCHOOL** | Admin creates academic year | Term boundary saved | NOT VERIFIED |
| **SCHOOL** | Admin creates grade & division | Structural hierarchy saved | NOT VERIFIED |
| **PEOPLE** | Admin creates & enrolls student | Student enrolled in target division | NOT VERIFIED |
| **PEOPLE** | Admin assigns teacher to division | Assignment saved in `teacher_assignments` | NOT VERIFIED |
| **AUTHORIZATION** | Teacher accesses unassigned class | Operation rejected with FORBIDDEN | NOT VERIFIED |
| **AUTHORIZATION** | Student accesses peer student marks | Operation rejected with FORBIDDEN | NOT VERIFIED |
| **TENANT ISOLATION** | School A admin requests School B data | Blocked with `SECURITY ALERT: Cross-tenant` | NOT VERIFIED |
| **ATTENDANCE** | Teacher submits daily roster attendance | Records created in `daily_attendance` | NOT VERIFIED |
| **ATTENDANCE** | Idempotent duplicate attendance submit | Updates existing row; zero duplicate rows | NOT VERIFIED |
| **ATTENDANCE** | Teacher requests attendance correction | Row created in `attendance_correction_requests` | NOT VERIFIED |
| **ATTENDANCE** | Admin approves attendance correction | Record updated; audit event generated | NOT VERIFIED |
| **AUDIT** | Attempt to UPDATE `audit_events` row | PostgreSQL raises `prevent_audit_tampering` | NOT VERIFIED |

---

## 4. Recommended Test Setup Strategy
For the Basic MVP phase, we recommend introducing a minimal test setup:
1. **Unit & Server Action Tests**: Add Vitest or Jest to test `rbacGuard.ts`, `attendanceActions.ts`, and `academicActions.ts`.
2. **Database & RLS Tests**: Execute a SQL test script verifying RLS policies for multi-tenant isolation.
3. **E2E Smoke Test**: Simple Playwright or Cypress script executing the end-to-end admin setup -> teacher login -> attendance entry -> student view workflow.
