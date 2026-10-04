# 07 — AUTHORIZATION & SECURITY ANALYSIS

## 1. Executive Summary
This document analyzes the security architecture and authorization enforcement model of EDNOVA based on `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md`, server action guards (`app/src/lib/auth/rbacGuard.ts`), and database Row Level Security (RLS) policies.

---

## 2. Security Authority Principle

> **Frontend visibility is NOT security. Backend authorization is authoritative.**
> **Source**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` (Line 5)

Client-side UI routing and dynamic menu filtering are treated strictly as UX enhancements. All security guarantees, tenant isolation boundaries, and privilege checks are enforced on the server via TypeScript Server Actions and database PostgreSQL RLS policies.

---

## 3. Four-Layer Security Architecture

```text
Layer 1: Authentication     ---> Verify valid Supabase auth session (user_id)
Layer 2: Tenant Isolation   ---> Verify institution context (get_user_school_id() & validateTenantAccess())
Layer 3: Canonical RBAC     ---> Enforce baseline role permissions (verifyServerSession([allowedRoles]))
Layer 4: Resource Scope     ---> Validate DB relationships (parent-student links, teacher assignments)
```

### Layer 1: Authentication
- Implemented using `@supabase/ssr` with Next.js cookie handling (`verifyServerSession()`).
- Rejects unauthenticated requests with error `UNAUTHORIZED: Authentication required.`

### Layer 2: Tenant Isolation
- Database level: Anchor function `get_user_school_id()` evaluates `auth.uid()` against `profiles.school_id`.
- Server action level: `validateTenantAccess(requestSchoolId, session)` verifies `requestSchoolId === session.schoolId`.
- Prevents cross-tenant leaks: A user from School A attempting to supply School B's `school_id` is immediately halted.

### Layer 3: Canonical Role-Based Access Control (RBAC)
- Functions accept explicit allowed role arrays (e.g., `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER'])`).
- Raises error `FORBIDDEN: Insufficient permissions for role...` if role is omitted from allowed list.

### Layer 4: Resource Relationship Scope
- **Parent-Student Boundary**: Parent queries require explicit join verification against `parent_student_relationships` before returning child records (`parentActions.ts`).
- **Teacher Roster Boundary**: Teachers can submit attendance or marks only for division/subject IDs assigned in `teacher_assignments`.
- **Student Data Isolation**: Students can query only their own user ID records.
- **Security Guard Boundary**: Security roles are blocked by RLS policies from accessing student academic records or teacher administrative data.

---

## 4. Anti-IDOR & Client ID Trust Defense

### Core Rule
> Client-provided IDs (schoolId, studentId, teacherId, classId, attendanceId) must **NEVER** be trusted as proof of authorization.

### Implementation Audit
- In `attendanceActions.ts` and `assessmentActions.ts`, the `schoolId` provided in the input payload is validated against `sessionContext.schoolId` using `validateTenantAccess()`.
- `recorded_by` and `teacher_id` fields are forced to `session.userId` on the server rather than trusting any ID sent from the client form.

---

## 5. Append-Only Audit Trail & Trigger Protection
- Administrative operations, attendance submissions, and correction requests produce immutable records in `audit_events`.
- Trigger function `prevent_audit_tampering()` blocks `UPDATE` or `DELETE` statements on `audit_events`, ensuring audit records cannot be silently modified or removed by application users.

---

## 6. Critical Security Test (Multi-School Isolation Test)

### Mandatory Test Scenario
To verify multi-tenant isolation, the following test configuration is defined:

```text
SCHOOL A                                  SCHOOL B
├── Teacher A                             ├── Teacher B
├── Student A                             ├── Student B
└── Grade 7 / Section 7-A                 └── Grade 7 / Section 7-A
```

### Verification Checks
1. **Teacher A Access Check**: Teacher A can retrieve roster and mark attendance for Student A (School A).
2. **Cross-Teacher Block**: Teacher A attempting to access Student B or Section 7-A of School B receives a `SECURITY ALERT: Cross-tenant access violation detected` error.
3. **Student Isolation**: Student A attempting to query Student B's attendance or marks receives an empty or forbidden response.
4. **URL ID Tampering**: Manually changing `schoolId` or `studentId` query parameters in API/Server Actions fails server-side validation.
5. **Database RLS Verification**: Direct SQL query under Teacher A session token returns 0 rows for School B tables.
