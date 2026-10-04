# 02 — REQUIREMENT MAP & TRACEABILITY MATRIX

## 1. Executive Summary
This document provides a mapped inventory of functional and non-functional requirements extracted across EDNOVA core specifications, database migrations, server action contracts, and UI application routes.

---

## 2. Functional Requirements (FR)

### FR-01: Authentication & Session Management
- **FR-01.1**: The system must support session authentication via Next.js cookies and Supabase Auth.
- **FR-01.2**: Protected routes (`/admin`, `/teacher`, `/student`, `/owner`, `/mobile`) must block unauthenticated requests.
- **FR-01.3**: Authenticated users must be associated with an active profile containing a valid `school_id` and canonical `role`.
- **Source**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` & `app/src/lib/auth/rbacGuard.ts`

### FR-02: Institutional Tenant Management
- **FR-02.1**: The system must support multi-tenant school provisioning (`schools` entity: `id`, `name`, `code`, `address`, `contact_email`, `contact_phone`).
- **FR-02.2**: Each school must define one or more Academic Years (e.g. "2026-2027") with `start_date`, `end_date`, and `is_current` status.
- **FR-02.3**: Schools must support Grade/Department creation and Division/Section mapping.
- **FR-02.4**: Multi-institution operations oversight must be accessible to `PLATFORM_OWNER` and `INSTITUTION_OWNER` roles.
- **Source**: `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` & `app/supabase/schema.sql`

### FR-03: People & Enrollment Management
- **FR-03.1**: Permanent student identity must be maintained in `profiles` (or `users`) and linked to institution `school_id`.
- **FR-03.2**: Student enrollment must be academic-year-specific (`student_enrollments` table: `student_id`, `school_id`, `academic_year_id`, `grade_id`, `division_id`, `roll_number`). Changing academic years must not overwrite past historical enrollment.
- **FR-03.3**: Teacher assignments must map a teacher to an academic year, division, and subject (`teacher_assignments` table).
- **FR-03.4**: Parent/Guardian relationships must be explicitly linked to student profiles (`parent_student_relationships` table).
- **Source**: `docs/archive/01_PRODUCT_AND_REQUIREMENTS.md` (Lines 73-94) & `app/supabase/schema.sql`

### FR-04: Daily Attendance & Correction Workflow
- **FR-04.1**: Teachers/Admins must be able to record daily roster attendance for an assigned division (`daily_attendance` table).
- **FR-04.2**: Attendance statuses must include `PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`.
- **FR-04.3**: Idempotent attendance submission must update existing records rather than creating duplicate entries for the same student/date.
- **FR-04.4**: Modification of submitted attendance records must go through an attendance correction workflow (`attendance_correction_requests` table: `original_status`, `requested_status`, `reason`, `approval_status`, `reviewed_by`, `reviewed_at`).
- **FR-04.5**: Attendance history must be viewable by authorized students (their own) and parents (their verified children).
- **Source**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` & `app/supabase/migrations/05_attendance_system.sql`

### FR-05: Timetable & Class Schedules
- **FR-05.1**: Admins must be able to configure timetable entries mapping day of week, period/time slot, division, subject, teacher, and room.
- **FR-05.2**: The system must enforce collision checks preventing double-booking of teachers, divisions, or rooms in the same time slot.
- **Source**: `app/supabase/migrations/04_timetable_and_calendar.sql` & `app/src/lib/actions/timetableActions.ts`

### FR-06: Daily Academics ("Today's Notes")
- **FR-06.1**: Teachers must be able to publish daily lesson summaries ("Today's Notes") containing topic, summary, concepts covered, textbook pages, and homework details for their assigned classes.
- **Source**: `app/supabase/schema.sql` (`todays_notes` table) & `app/src/lib/actions/academicActions.ts`

### FR-07: Assessments & Mark Entry
- **FR-07.1**: Teachers must be able to create assessments (class tests, mid-terms, final exams) and record student marks (`student_marks` table).
- **FR-07.2**: Mark lookup for students and parents must verify relationship boundaries.
- **Source**: `app/supabase/migrations/11_complete_backend_entities.sql` & `app/src/lib/actions/assessmentActions.ts`

### FR-08: Safety, Incidents & Confidential Feedback
- **FR-08.1**: Confidential feedback (suggestions, complaints) with privacy tiers (`NORMAL`, `CONFIDENTIAL`, `RESTRICTED`) must be supported.
- **FR-08.2**: Security incidents must maintain an append-only timeline tracking facts, statements, evidence, and actions.
- **Source**: `app/supabase/migrations/06_feedback_and_incidents.sql` & `app/src/lib/actions/feedbackIncidentActions.ts`

### FR-09: Security Gate & Visitor Kiosk
- **FR-09.1**: Gate security staff must be able to log student entry/exit events and check visitors in/out with badge tracking.
- **Source**: `app/supabase/migrations/03_security_gate_tables.sql` & `app/src/lib/actions/gateActions.ts`

### FR-10: Multi-Channel Notifications & Audit Engine
- **FR-10.1**: Notifications must be queued for delivery across `IN_APP`, `PUSH`, `EMAIL`, `SMS`, `WHATSAPP` channels.
- **FR-10.2**: Sensitive system mutations must emit immutable records in `audit_events` (or `audit_logs`).
- **Source**: `app/supabase/migrations/09_append_only_audit_locks.sql` & `10_canonical_roles_and_notifications.sql`

---

## 3. Non-Functional Requirements (NFR)

### NFR-01: Multi-Tenant Data Isolation
- **NFR-01.1**: Every institution's data must be completely isolated. Cross-tenant access must raise a security error.
- **NFR-01.2**: Database Row Level Security (RLS) using `get_user_school_id()` must filter all query results.
- **NFR-01.3**: Server Actions must execute `validateTenantAccess(schoolId, session)` before executing mutations.
- **Source**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` & `app/src/lib/auth/rbacGuard.ts`

### NFR-02: Security Authority & Anti-IDOR
- **NFR-02.1**: Client-supplied IDs (schoolId, studentId, teacherId) must never be trusted without server-side verification.
- **NFR-02.2**: Audit logs must be locked against modification or deletion via database trigger (`prevent_audit_tampering()`).
- **Source**: `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` & `app/supabase/migrations/09_append_only_audit_locks.sql`

### NFR-03: On-Premise Reliability & Hardware Preflight
- **NFR-03.1**: The core system must operate on-premise without requiring continuous internet connectivity.
- **NFR-03.2**: Deployment must run via Docker Compose with hardware preflight validation (`scripts/preflight.sh`).
- **Source**: `docs/core/05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md` & `docker-compose.yml`

### NFR-04: UI Accessibility & Touch Target Standards
- **NFR-04.1**: Web & Mobile UI controls must comply with touch-target sizing (minimum 44px × 44px on mobile).
- **NFR-04.2**: User interfaces must provide explicit loading, empty, error, and success states.
- **Source**: `docs/mobile/MOBILE_DESIGN_SYSTEM.md` & `app/src/app/admin/attendance/page.tsx`
