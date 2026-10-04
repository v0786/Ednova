# 06 — DATABASE & DATA MODEL ANALYSIS

## 1. Executive Summary
This document presents the technical analysis of the EDNOVA PostgreSQL database schema based on inspection of base schema file (`app/supabase/schema.sql`) and 11 SQL migration files (`app/supabase/migrations/02_security_gate_domain.sql` through `11_complete_backend_entities.sql`).

---

## 2. Conceptual Entity-Relationship Model

```text
[schools] (Multi-tenant Root)
  ├── [profiles] (Users & Auth Profiles: SUPER_ADMIN, SCHOOL_ADMIN, TEACHER, STUDENT, PARENT, etc.)
  │     ├── [parent_student_relationships] (Guardian -> Student link)
  │     └── [file_attachments] (Uploaded documents)
  │
  ├── [academic_years] (Term Boundaries e.g. "2026-2027")
  │     ├── [grades] (Grade 7, Grade 8...)
  │     │    └── [divisions] (Section A, Section B...)
  │     │         ├── [student_enrollments] (Student + AcademicYear + Grade + Division)
  │     │         ├── [teacher_assignments] (Teacher + Division + Subject)
  │     │         ├── [daily_attendance] (Student + Division + Date + Status)
  │     │         │     └── [attendance_correction_requests] (Audit & Correction Workflow)
  │     │         ├── [todays_notes] (Daily Lesson Summaries)
  │     │         ├── [timetable_entries] (Period Schedule Grid)
  │     │         └── [academic_assessments] (Class Tests, Exams)
  │     │               └── [student_marks] (Student Assessment Marks)
  │     │
  │     └── [subjects] (Mathematics, Physics...)
  │
  ├── [college_departments] (For College Hierarchy)
  │     └── [college_programs] (For College Programs)
  │
  ├── [feedback_records] (Suggestions, Complaints)
  ├── [incident_records] (Safety & Security Incidents)
  │     └── [incident_timeline_events] (Timeline Audit Events)
  ├── [security_gate_events] (Student Movement Logs)
  ├── [security_visitors] (Visitor Check-in/out)
  ├── [notification_queues] (Multi-channel Outbox)
  ├── [deployment_licenses] (System License Verification)
  ├── [system_health_snapshots] (Hardware Diagnostics)
  └── [audit_events] / [audit_logs] (Append-only Audit Lock)
```

---

## 3. Database Schema Evaluation & Implementation Status

| Entity / Table Name | Schema / Migration Source | Documented | Implemented | Key Constraints & Indexes | RLS Policy Active | Status |
|---|---|:---:|:---:|---|:---:|:---:|
| `schools` | `schema.sql` | YES | YES | PK `id`, `code` UNIQUE | YES | IMPLEMENTED |
| `profiles` | `schema.sql` | YES | YES | PK `id` -> `auth.users(id)`, FK `school_id` | YES (`get_user_school_id()`) | IMPLEMENTED |
| `academic_years` | `schema.sql` | YES | YES | PK `id`, FK `school_id` | YES | IMPLEMENTED |
| `grades` | `schema.sql` | YES | YES | PK `id`, FK `school_id` | YES | IMPLEMENTED |
| `divisions` | `schema.sql` | YES | YES | PK `id`, FK `grade_id`, FK `school_id` | YES | IMPLEMENTED |
| `subjects` | `schema.sql` | YES | YES | PK `id`, FK `school_id` | YES | IMPLEMENTED |
| `student_enrollments` | `schema.sql` | YES | YES | FKs: `student_id`, `school_id`, `academic_year_id`, `grade_id`, `division_id` | YES | IMPLEMENTED |
| `teacher_assignments` | `schema.sql` | YES | YES | FKs: `teacher_id`, `school_id`, `academic_year_id`, `division_id`, `subject_id` | YES | IMPLEMENTED |
| `daily_attendance` | `schema.sql` & Migration 05 | YES | YES | FKs: `school_id`, `student_id`, `division_id`. Index: `(school_id, date, division_id)` | YES | IMPLEMENTED |
| `attendance_correction_requests` | Migration 05 | YES | YES | FKs: `school_id`, `attendance_id`, `requested_by`, `reviewed_by`. Status CHECK | YES | IMPLEMENTED |
| `todays_notes` | `schema.sql` | YES | YES | FKs: `school_id`, `teacher_id`, `division_id`, `subject_id` | YES | IMPLEMENTED |
| `timetable_entries` | Migration 04 | YES | YES | FKs: `school_id`, `division_id`, `subject_id`, `teacher_id`. Collision index | YES | IMPLEMENTED |
| `academic_assessments` | Migration 11 | YES | YES | FKs: `school_id`, `academic_year_id`, `division_id`, `subject_id`, `teacher_id` | YES | IMPLEMENTED |
| `student_marks` | Migration 11 | YES | YES | FKs: `assessment_id`, `student_id`, `school_id`. UNIQUE `(assessment_id, student_id)` | YES | IMPLEMENTED |
| `parent_student_relationships` | Migration 02 | YES | YES | FKs: `parent_id`, `student_id`, `school_id`. UNIQUE `(parent_id, student_id)` | YES | IMPLEMENTED |
| `feedback_records` | Migration 06 | YES | YES | FKs: `school_id`, `author_id`. Confidentiality enum | YES | IMPLEMENTED |
| `incident_records` | Migration 06 | YES | YES | FKs: `school_id`, `reporter_id`, `investigator_id` | YES | IMPLEMENTED |
| `incident_timeline_events` | Migration 06 | YES | YES | FK `incident_id`. Timeline category CHECK | YES | IMPLEMENTED |
| `security_gate_events` | Migration 02 & 03 | YES | YES | FKs: `school_id`, `student_id`, `recorded_by` | YES | IMPLEMENTED |
| `security_visitors` | Migration 11 | YES | YES | FKs: `school_id`, `person_to_meet`, `checked_in_by` | YES | IMPLEMENTED |
| `notification_queues` | Migration 10 | YES | YES | FKs: `school_id`, `recipient_id`. Channel & status CHECKs | YES | IMPLEMENTED |
| `file_attachments` | Migration 10 | YES | YES | FKs: `school_id`, `uploaded_by`. Size limit check | YES | IMPLEMENTED |
| `deployment_licenses` | Migration 07 | YES | YES | Signed cryptographic payload verifier | YES | IMPLEMENTED |
| `system_health_snapshots` | Migration 07 | YES | YES | Hardware telemetry metrics | YES | IMPLEMENTED |
| `college_departments` | Migration 08 | YES | YES | College structural hierarchy | YES | IMPLEMENTED |
| `college_programs` | Migration 08 | YES | YES | College structural hierarchy | YES | IMPLEMENTED |
| `audit_events` | Migration 09 | YES | YES | Append-only trigger lock `prevent_audit_tampering()` | YES | IMPLEMENTED |

---

## 4. Key Enums Defined

```sql
CREATE TYPE user_role AS ENUM (
    'PLATFORM_OWNER', 'INSTITUTION_OWNER', 'SUPER_ADMIN', 
    'SCHOOL_ADMIN', 'ADMIN_STAFF', 'PRINCIPAL', 
    'TEACHER', 'SECURITY_GUARD', 'SECURITY_STAFF', 
    'STUDENT', 'PARENT'
);

CREATE TYPE attendance_status AS ENUM (
    'PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED'
);

CREATE TYPE assignment_status AS ENUM (
    'DRAFT', 'PUBLISHED', 'OPEN', 'SUBMITTED', 
    'UNDER_REVIEW', 'REVIEWED', 'RESUBMISSION_REQUIRED', 'COMPLETED'
);

CREATE TYPE exam_status AS ENUM (
    'DRAFT', 'SCHEDULED', 'OPEN', 'IN_PROGRESS', 
    'SUBMITTED', 'EVALUATING', 'COMPLETED', 'PUBLISHED'
);
```

---

## 5. Security & Isolation Mechanisms in Database

### Multi-Tenant Anchor Function
```sql
CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
  SELECT school_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;
```

Every table in EDNOVA enables Row Level Security (RLS) and attaches a tenant isolation policy:
```sql
CREATE POLICY school_isolation ON <table_name>
    FOR ALL USING (school_id = get_user_school_id());
```

### Append-Only Lock on Audit Trail
```sql
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'TAMPER_ERROR: Audit logs are append-only. Modification or deletion is prohibited by security policy.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_update_delete
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();
```
This PostgreSQL trigger explicitly prevents `UPDATE` or `DELETE` queries on `audit_events`, protecting audit integrity even against privileged database connections.
