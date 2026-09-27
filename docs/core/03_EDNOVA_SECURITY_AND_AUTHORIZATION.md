# EDNOVA — Security & Authorization Architecture

## 1. Security Authority Principle

> **Frontend visibility is NOT security. Backend authorization is authoritative.**

Security boundaries are enforced at the database (PostgreSQL Row Level Security) and server action layers (`verifyServerSession()`, `validateTenantAccess()`).

---

## 2. Four-Layer Security Model

```text
Layer 1: Authentication     ---> Verify valid session (user_id)
Layer 2: Tenant Isolation   ---> Verify institution context (get_user_school_id())
Layer 3: Canonical RBAC     ---> Enforce baseline role permissions
Layer 4: Resource Scope     ---> Validate DB relationships (parent-student, teacher assignments)
```

---

## 3. Scope & Boundary Enforcement
- **Student Data Isolation**: Students can query only their own user ID records.
- **Parent Security Boundary**: Parent queries require positive verification in `parent_student_relationships` DB table before returning child records.
- **Teacher Assignment Boundary**: Teachers can access/modify student rosters and marks only for assigned classes/subjects.
- **Security Guard Boundary**: Security roles are blocked from accessing student academic records or teacher administrative data.
- **Append-Only Audit**: All sensitive mutations (marks entry, attendance corrections, gate movements) create immutable records in `audit_logs`.
