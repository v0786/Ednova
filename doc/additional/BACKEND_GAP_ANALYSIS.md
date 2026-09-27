# EDNOVA — Comprehensive Backend Gap Analysis Report

## 1. Domain Coverage & Status Inventory

| Domain | Status | File / Location | Database Objects | Security & Contract Status | Required Action |
|---|---|---|---|---|---|
| **Multi-Tenant Root** | IMPLEMENTED | `01_schema.sql` | `schools`, `profiles` | RLS active (`get_user_school_id()`) | Fully verified |
| **Parent-Student Linkage** | IMPLEMENTED | `02_security_gate_domain.sql`, `parentActions.ts` | `parent_student_relationships` | Strict check; raises `SECURITY_VIOLATION` on unauthorized lookup | Fully verified |
| **Security Gate Kiosk** | IMPLEMENTED | `03_security_gate_tables.sql`, `11_complete_backend_entities.sql` | `security_gate_events`, `security_visitors` | RLS active; restricted visibility | Fully verified |
| **Timetable & Conflicts** | IMPLEMENTED | `04_timetable_and_calendar.sql` | `timetable_entries` | Unique constraints prevent double-booking | Conflict validation active |
| **Attendance System** | IMPLEMENTED | `05_attendance_system.sql` | `daily_attendance`, `attendance_corrections` | Audit history preserved | Fully verified |
| **Feedback & Incidents** | IMPLEMENTED | `06_feedback_and_incidents.sql` | `feedback_records`, `incident_records`, `incident_timeline_events` | Confidentiality levels enforced | Timeline audit active |
| **License & Health** | IMPLEMENTED | `07_license_and_system_health.sql` | `deployment_licenses`, `system_health_snapshots` | Cryptographic signed verifier | Verified |
| **College Structure** | IMPLEMENTED | `08_college_academic_structure.sql` | `college_departments`, `college_programs` | College hierarchy isolated | Verified |
| **Audit Locks** | IMPLEMENTED | `09_append_only_audit_locks.sql` | `audit_logs` | Trigger lock `prevent_audit_tampering` active | Immutable locks verified |
| **Notifications Queue** | IMPLEMENTED | `10_canonical_roles_and_notifications.sql`, `notificationActions.ts` | `notification_queues` | Multi-channel queue with retry states | Verified |
| **File Security** | IMPLEMENTED | `10_canonical_roles_and_notifications.sql`, `fileActions.ts` | `file_attachments` | MIME validation + 10MB limit | Verified |
| **Assessments & Marks** | IMPLEMENTED | `11_complete_backend_entities.sql`, `assessmentActions.ts` | `academic_assessments`, `student_marks` | Parent/student access locked | Verified |
| **AI Gateway & RAG** | IMPLEMENTED | `aiGatewayActions.ts` | N/A (Dynamic Service) | Inherits user RLS context; injection protection active | Verified |

---

## 2. Role Union & Security Matrix Resolution
- **Canonical Product Roles**: `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `PRINCIPAL`, `SCHOOL_ADMIN`, `ADMIN_STAFF`, `TEACHER`, `SECURITY_GUARD`, `STUDENT`, `PARENT`.
- **Database Alignment**: Supports canonical role definitions as well as legacy aliases (`SUPER_ADMIN`, `SECURITY_STAFF`).
- **Enforcement**: `rbacGuard.ts` enforces role validation server-side across all database operations.
