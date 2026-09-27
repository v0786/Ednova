# EDNOVA — Backend Contract Verification Report

## 1. Role Enum Audit & Resolution
- **Canonical Product Specification Roles (01_PRODUCT_AND_REQUIREMENTS.md)**: 8 Core Canonical Roles (`PLATFORM_OWNER`, `INSTITUTION_OWNER`, `PRINCIPAL`, `SCHOOL_ADMIN`, `ADMIN_STAFF`, `TEACHER`, `SECURITY_GUARD`, `STUDENT`) + `PARENT` (when guardian features are enabled).
- **Backend Implementation (`rbacGuard.ts` & `02_` / `10_` migrations)**: The PostgreSQL `user_role` type supports the full union:
  - `PLATFORM_OWNER`
  - `INSTITUTION_OWNER`
  - `SUPER_ADMIN` (Legacy alias for Platform Owner)
  - `SCHOOL_ADMIN`
  - `ADMIN_STAFF`
  - `PRINCIPAL`
  - `TEACHER`
  - `SECURITY_GUARD`
  - `SECURITY_STAFF` (Legacy alias for Security Guard)
  - `STUDENT`
  - `PARENT`
- **Resolution**: The frontend applications map canonical UI entry points to these 8 primary role groups, honoring both canonical role names and legacy aliases via `rbacGuard.ts`.

---

## 2. Comprehensive Module Implementation Status Matrix

| Module / Domain | Status | Database Migration | Server Action Contract | RLS Isolation |
|---|---|---|---|---|
| **Multi-Tenant Root** | IMPLEMENTED | `01_schema.sql` | `rbacGuard.ts` | Verified (`get_user_school_id()`) |
| **People & Students** | IMPLEMENTED | `01_schema.sql` | `academicActions.ts` | Verified |
| **Parent-Student Linkage** | IMPLEMENTED | `02_security_gate_domain.sql` | `parentActions.ts` | Verified (`parent_student_relationships`) |
| **Timetable & Calendar** | IMPLEMENTED | `04_timetable_and_calendar.sql` | `timetableActions.ts` | Verified |
| **Attendance & Roster** | IMPLEMENTED | `05_attendance_system.sql` | `attendanceActions.ts` | Verified |
| **Feedback System** | IMPLEMENTED | `06_feedback_and_incidents.sql` | `feedbackIncidentActions.ts` | Verified |
| **Incident Management** | IMPLEMENTED | `06_feedback_and_incidents.sql` | `feedbackIncidentActions.ts` | Verified ("What Actually Happened" Timeline) |
| **Security Gate Kiosk** | IMPLEMENTED | `03_security_gate_tables.sql` | `gateActions.ts` | Verified |
| **System Health & License** | IMPLEMENTED | `07_license_and_system_health.sql` | `licenseActions.ts` | Verified (Signed Key Verifier) |
| **College Structure** | IMPLEMENTED | `08_college_academic_structure.sql` | `academicActions.ts` | Verified |
| **Append-Only Audit Locks**| IMPLEMENTED | `09_append_only_audit_locks.sql` | `09_append_only_audit_locks.sql` | Verified (Trigger lock `prevent_audit_tampering`) |
| **Notifications Queue** | IMPLEMENTED | `10_canonical_roles_and_notifications.sql` | `notificationActions.ts` | Verified |
| **File Attachments Security**| IMPLEMENTED | `10_canonical_roles_and_notifications.sql` | `fileActions.ts` | Verified (MIME check + 10MB Ceiling) |
| **Assessments & Marks** | IMPLEMENTED | `11_complete_backend_entities.sql` | `assessmentActions.ts` | Verified |
| **Announcements** | IMPLEMENTED | `11_complete_backend_entities.sql` | `announcementActions.ts` | Verified |
| **AI Gateway & RAG** | IMPLEMENTED | N/A (Dynamic Service) | `aiGatewayActions.ts` | Verified (Inherits user's RLS session) |

---

## 3. Verified Security & Contract Boundaries
1. **Parent-Student Security**: `getStudentMarksForParent()` inside `assessmentActions.ts` raises an explicit `SECURITY_VIOLATION` if a parent attempts to query an unlinked student ID.
2. **Untrusted Data Boundary**: `aiGatewayActions.ts` strips HTML tags and wraps user feedback within `<untrusted_user_query>` tags to prevent prompt injection.
3. **Audit Lock**: PostgreSQL triggers reject any `UPDATE` or `DELETE` on `audit_events`.
