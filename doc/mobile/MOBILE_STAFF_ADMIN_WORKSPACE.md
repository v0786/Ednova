# EDNOVA Mobile Staff & Admin Workspace Specification

## 1. Overview
The **Staff & Admin Workspace** equips institutional administrators (`SCHOOL_ADMIN`, `SUPER_ADMIN`, `ADMIN_STAFF`) with operational governance controls across student and faculty rosters, class-level attendance aggregations, school-wide announcement publishing, and system telemetry monitoring (`app/src/app/mobile/workspaces/admin/page.tsx`).

---

## 2. Security & Role Architecture
- **Canonical Roles Supported**: `ADMIN_STAFF`, `SCHOOL_ADMIN`, `SUPER_ADMIN`, `INSTITUTION_OWNER`.
- **Multi-Tenant Scope**: All operations filter strictly by `school_id` derived from session JWT.
- **Role Hierarchy Enforcement**: Administrative permissions vary by role. Announcement publishing and system telemetry require administrative credentials verified by server-side RBAC guards.

---

## 3. Implemented Capabilities
1. **Institutional Dashboard**:
   - Total Enrolled Students & Faculty Count.
   - Aggregate Daily Attendance Percentage (95.8%).
   - Pending Operational Approval Tasks.

2. **Roster Directory & Filter**:
   - Category switcher (`ALL`, `STUDENTS`, `TEACHERS`, `STAFF`).
   - Role badges and email verification indicators.

3. **Attendance Administration**:
   - Class-level attendance percentages and exception summary logs.

4. **School Announcement Publisher**:
   - Target audience selection (`ALL`, `STUDENTS`, `PARENTS`, `TEACHERS`, `STAFF`).
   - Title, Content, and Pinned Notice toggle.
   - Server persistence via `createAnnouncement()`.

5. **System Health & Telemetry**:
   - Real-time service status indicators for Database, RLS Engine, AI Gateway, and Mobile Push Client.
