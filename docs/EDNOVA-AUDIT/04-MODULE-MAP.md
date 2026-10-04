# 04 — MODULE MAP & CAPABILITIES INVENTORY

## 1. Executive Summary
This document provides a domain module map of the EDNOVA platform, covering all 15 operational modules identified across specifications, database migrations, server action files, and web/mobile routes.

---

## 2. Module Inventory

### 1. School & Institution Management
- **Purpose**: Provision multi-tenant institution accounts, set campus parameters, and establish academic year boundaries.
- **Target Users**: `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `SUPER_ADMIN`, `SCHOOL_ADMIN`.
- **Inputs**: School name, school code, address, email, phone, academic year start/end dates.
- **Outputs**: Active tenant record, default academic year boundary.
- **Database Entities**: `schools`, `academic_years`.
- **APIs / Actions**: `academicActions.ts` (`createSchoolTenant`, `createAcademicYear`).
- **UI Surfaces**: `/admin/school-setup`, `/owner`.
- **Status**: **IMPLEMENTED**.

### 2. People & Identity Management
- **Purpose**: Manage user accounts, student profiles, teacher records, staff roles, and parent-student links.
- **Target Users**: `SCHOOL_ADMIN`, `ADMIN_STAFF`, `SUPER_ADMIN`.
- **Inputs**: User email, full name, role, phone number, avatar URL, guardian links.
- **Outputs**: Active user profile, role classification, active status.
- **Database Entities**: `profiles`, `parent_student_relationships`.
- **APIs / Actions**: `parentActions.ts` (`linkParentToStudent`).
- **UI Surfaces**: `/admin/people`, `/login`.
- **Status**: **IMPLEMENTED**.

### 3. Academic Structure (Schools & Colleges)
- **Purpose**: Configure grades, divisions, sections, subjects, college departments, programs, and semesters.
- **Target Users**: `SCHOOL_ADMIN`, `ADMIN_STAFF`.
- **Inputs**: Grade name/code, division name, subject name/code, department, program, semester.
- **Outputs**: Configured hierarchy tree.
- **Database Entities**: `grades`, `divisions`, `subjects`, `college_departments`, `college_programs`.
- **APIs / Actions**: `academicActions.ts`.
- **UI Surfaces**: `/admin/daily-academics`, `/admin/school-setup`.
- **Status**: **IMPLEMENTED**.

### 4. Student Enrollment & Teacher Assignment
- **Purpose**: Map permanent student identities to specific academic-year enrollments (Grade/Division) and assign teachers to subject/division pairs.
- **Target Users**: `SCHOOL_ADMIN`, `ADMIN_STAFF`.
- **Inputs**: Student ID, Academic Year ID, Grade ID, Division ID, Roll Number, Teacher ID, Subject ID.
- **Outputs**: `student_enrollments` record, `teacher_assignments` record.
- **Database Entities**: `student_enrollments`, `teacher_assignments`.
- **APIs / Actions**: `academicActions.ts`.
- **UI Surfaces**: `/admin/people`.
- **Status**: **IMPLEMENTED**.

### 5. Daily Attendance & Corrections
- **Purpose**: One-tap roster attendance entry for teachers, correction request submit/review workflow, and history viewing.
- **Target Users**: `TEACHER`, `SCHOOL_ADMIN`, `PRINCIPAL`, `STUDENT`, `PARENT`.
- **Inputs**: Division ID, date, student roster status (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`), correction reasons.
- **Outputs**: Daily attendance records, correction request audit trails, attendance percentages.
- **Database Entities**: `daily_attendance`, `attendance_correction_requests`.
- **APIs / Actions**: `attendanceActions.ts` (`submitAttendanceRoster`, `requestAttendanceCorrection`).
- **UI Surfaces**: `/admin/attendance`, `/teacher`, `/student`, `/mobile`.
- **Status**: **IMPLEMENTED**.

### 6. Daily Academics ("Today's Notes")
- **Purpose**: Faculty broadcasting of daily lesson topics, concept tags, textbook pages, and homework assignments.
- **Target Users**: `TEACHER`, `STUDENT`, `PARENT`.
- **Inputs**: Division ID, Subject ID, Topic, Summary, Concept tags, Textbook pages, Homework details.
- **Outputs**: Published "Today's Notes" item visible to students/parents.
- **Database Entities**: `todays_notes`.
- **APIs / Actions**: `academicActions.ts` (`publishTodaysNote`).
- **UI Surfaces**: `/teacher`, `/admin/daily-academics`, `/student`, `/mobile`.
- **Status**: **IMPLEMENTED**.

### 7. Timetable & Schedule Management
- **Purpose**: Configure master class timetables, period slots, room allocations, and collision prevention.
- **Target Users**: `SCHOOL_ADMIN`, `ADMIN_STAFF`, `TEACHER`, `STUDENT`.
- **Inputs**: Day of week, period timing, division, subject, teacher, room number.
- **Outputs**: Weekly timetable grid, conflict alerts.
- **Database Entities**: `timetable_entries`.
- **APIs / Actions**: `timetableActions.ts`.
- **UI Surfaces**: `/admin/timetable`, `/teacher`, `/student`.
- **Status**: **IMPLEMENTED**.

### 8. Assessments & Student Marks
- **Purpose**: Create class tests, mid-terms, and final exams; record student marks; generate letter grades.
- **Target Users**: `TEACHER`, `SCHOOL_ADMIN`, `STUDENT`, `PARENT`.
- **Inputs**: Division ID, Subject ID, Assessment title, Max marks, Weightage, Student marks obtained.
- **Outputs**: Recorded marks, letter grade, assessment summary.
- **Database Entities**: `academic_assessments`, `student_marks`.
- **APIs / Actions**: `assessmentActions.ts` (`recordStudentMarks`, `getStudentMarksForParent`).
- **UI Surfaces**: `/teacher`, `/student`, `/mobile`.
- **Status**: **IMPLEMENTED**.

### 9. Safety & Incident Management
- **Purpose**: Log security/safety incidents with structured timelines (facts, statements, evidence, actions, conclusions).
- **Target Users**: `SCHOOL_ADMIN`, `PRINCIPAL`, `SECURITY_GUARD`, `INSTITUTION_OWNER`.
- **Inputs**: Incident category, severity, location, reporter, involved parties, statements, evidence files.
- **Outputs**: Active incident record, timeline events, resolution audit.
- **Database Entities**: `incident_records`, `incident_timeline_events`.
- **APIs / Actions**: `feedbackIncidentActions.ts`.
- **UI Surfaces**: `/admin/incidents`, `/owner`.
- **Status**: **IMPLEMENTED**.

### 10. Confidential Feedback Engine
- **Purpose**: Confidential channel for suggestions, complaints, and safety concerns with privacy level controls.
- **Target Users**: `STUDENT`, `PARENT`, `TEACHER`, `ADMIN_STAFF`, `SCHOOL_ADMIN`.
- **Inputs**: Feedback category, title, body, confidentiality level (`NORMAL`, `CONFIDENTIAL`, `RESTRICTED`).
- **Outputs**: Feedback ticket, review status history.
- **Database Entities**: `feedback_records`.
- **APIs / Actions**: `feedbackIncidentActions.ts`.
- **UI Surfaces**: `/admin/incidents`, `/mobile`.
- **Status**: **IMPLEMENTED**.

### 11. Security Gate & Visitor Management Kiosk
- **Purpose**: Security guard kiosk tracking student gate entry/exit movements and visitor check-in/out.
- **Target Users**: `SECURITY_GUARD`, `SCHOOL_ADMIN`, `PARENT`.
- **Inputs**: Visitor name, phone, purpose of visit, person to meet, badge number.
- **Outputs**: Gate event log, active visitor badge log.
- **Database Entities**: `security_gate_events`, `security_visitors`.
- **APIs / Actions**: `gateActions.ts`.
- **UI Surfaces**: `/admin/security-gate`, `/mobile/workspaces/security`.
- **Status**: **IMPLEMENTED**.

### 12. Multi-Channel Notification Dispatch Queue
- **Purpose**: Queue notifications for multi-channel delivery (`IN_APP`, `PUSH`, `EMAIL`, `SMS`, `WHATSAPP`).
- **Target Users**: System engine, `SCHOOL_ADMIN`, `TEACHER`.
- **Inputs**: Recipient ID, channel, title, body, payload JSON.
- **Outputs**: Queued notification, delivery status, retry count.
- **Database Entities**: `notification_queues`.
- **APIs / Actions**: `notificationActions.ts`.
- **UI Surfaces**: Mobile app push system, `/admin`.
- **Status**: **IMPLEMENTED**.

### 13. Secure File Attachments Engine
- **Purpose**: Managed local file attachments with MIME validation, size limits (10MB max), and malware check flags.
- **Target Users**: All authenticated roles.
- **Inputs**: File payload, MIME type, size, role access tier.
- **Outputs**: `file_attachments` record, local storage path.
- **Database Entities**: `file_attachments`.
- **APIs / Actions**: `fileActions.ts`.
- **UI Surfaces**: Lesson notes, incidents, assessments.
- **Status**: **IMPLEMENTED**.

### 14. Append-Only Audit Logging & Trigger Lock
- **Purpose**: Immutable audit log recording sensitive administrative mutations, attendance corrections, and security events.
- **Target Users**: System, `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `SUPER_ADMIN`.
- **Inputs**: Actor ID, actor role, action string, resource type, resource ID, metadata.
- **Outputs**: Immutable audit event record.
- **Database Entities**: `audit_events` (or `audit_logs`).
- **APIs / Actions**: PostgreSQL trigger function `prevent_audit_tampering()`.
- **UI Surfaces**: System logs view.
- **Status**: **IMPLEMENTED**.

### 15. AI Gateway & On-Premise Operations
- **Purpose**: Institutional intelligence assistant providing RAG summaries of attendance, incidents, and performance while respecting user session security boundaries.
- **Target Users**: `PRINCIPAL`, `SCHOOL_ADMIN`, `TEACHER`, `INSTITUTION_OWNER`.
- **Inputs**: User prompt query, session context.
- **Outputs**: Sanitized AI response, prompt log.
- **Database Entities**: Dynamic service / API.
- **APIs / Actions**: `aiGatewayActions.ts`, `healthActions.ts`, `licenseActions.ts`, `backupActions.ts`.
- **UI Surfaces**: `/admin/ai-gateway`, `/admin/system-health`.
- **Status**: **IMPLEMENTED**.
