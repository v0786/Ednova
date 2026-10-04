# 05 — WORKFLOW MAP & BUSINESS PROCESSES

## 1. Executive Summary
This document details key operational business processes and workflows defined across EDNOVA specifications and server action implementations.

---

## 2. Core Business Workflows

### Workflow 1: Institutional School Provisioning
- **Actor**: `PLATFORM_OWNER`, `INSTITUTION_OWNER`, `SUPER_ADMIN`.
- **Preconditions**: User authenticated with owner/super-admin privileges.
- **Trigger**: New institution onboarding request.
- **Steps**:
  1. Admin opens `/admin/school-setup` or invokes `createSchoolTenant()`.
  2. Input school name, unique school code (e.g. `SJHS-2026`), campus address, administrative email, phone.
  3. System creates row in `schools` table.
  4. System initializes default Academic Year (e.g. "2026-2027").
  5. Audit log event `school.created` emitted.
- **Decision Points**: Check if school code is unique. If code exists, reject with error.
- **Data Created**: `schools` record, `academic_years` record, `audit_events` log.
- **Expected Result**: School tenant provisioned; ready for academic setup.
- **Failure Cases**: Code collision, missing required fields, unauthenticated user.

### Workflow 2: Academic Year & Structure Setup (Grades & Divisions)
- **Actor**: `SCHOOL_ADMIN`.
- **Preconditions**: School tenant exists; user is authorized `SCHOOL_ADMIN`.
- **Trigger**: Preparation for new academic year.
- **Steps**:
  1. Admin navigates to `/admin/school-setup`.
  2. Create Academic Year (name, start_date, end_date, is_current flag).
  3. Create Grades (e.g. "Grade 7", code "G7").
  4. Create Divisions for each Grade (e.g. "Section A", "Section B").
  5. Create Subjects (e.g. "Mathematics", code "MATH-101").
- **Data Created**: `academic_years`, `grades`, `divisions`, `subjects` records.
- **Expected Result**: Academic structure ready for student enrollment and teacher assignments.

### Workflow 3: Student Identity Registration & Annual Enrollment
- **Actor**: `SCHOOL_ADMIN`, `ADMIN_STAFF`.
- **Preconditions**: Active Academic Year, Grade, and Division exist.
- **Trigger**: New student admission or annual promotion.
- **Steps**:
  1. Admin creates user account profile (`profiles` table: full_name, email, role='STUDENT', school_id).
  2. Admin creates enrollment record (`student_enrollments` table: student_id, school_id, academic_year_id, grade_id, division_id, roll_number).
- **Critical Rule**: Permanent student profile in `profiles` remains unchanged across years; enrollment record in `student_enrollments` preserves historical placement.
- **Data Created**: `profiles` record, `student_enrollments` record, `audit_events` log.
- **Expected Result**: Student registered and enrolled in target class division.

### Workflow 4: Teacher Creation & Class/Subject Assignment
- **Actor**: `SCHOOL_ADMIN`.
- **Preconditions**: Teacher user account active; Division and Subject exist.
- **Trigger**: Faculty timetable assignment.
- **Steps**:
  1. Create teacher account profile (`profiles` table: role='TEACHER', school_id).
  2. Create assignment record (`teacher_assignments` table: teacher_id, school_id, academic_year_id, division_id, subject_id).
- **Data Created**: `teacher_assignments` record.
- **Expected Result**: Teacher authorized to mark attendance and enter marks for assigned division/subject.

### Workflow 5: Daily Roster Attendance Entry
- **Actor**: `TEACHER`, `SCHOOL_ADMIN`.
- **Preconditions**: Teacher assigned to Division; student roster enrolled.
- **Trigger**: Daily class period start.
- **Steps**:
  1. Teacher opens `/teacher` or `/admin/attendance` or mobile app.
  2. Select Division and Date.
  3. Roster displays enrolled students.
  4. Teacher marks status (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`) for each student.
  5. Teacher submits roster via `submitAttendanceRoster()`.
  6. Server action verifies session, validates tenant, and performs idempotent upsert (`daily_attendance` table).
  7. Audit log event `attendance.submitted` created.
- **Decision Points**: If attendance already exists for student/date, upsert updates the existing row without duplicating.
- **Expected Result**: Daily attendance locked in database.

### Workflow 6: Attendance Correction Request & Approval
- **Actor**: `TEACHER` (Requester) & `SCHOOL_ADMIN` / `PRINCIPAL` (Reviewer).
- **Preconditions**: Attendance record already submitted and locked.
- **Trigger**: Discovery of erroneous attendance status (e.g. student was marked ABSENT but arrived LATE with excuse).
- **Steps**:
  1. Teacher selects attendance record and clicks "Request Correction".
  2. Input requested status and mandatory reason text.
  3. System creates record in `attendance_correction_requests` with `approval_status = 'PENDING'`.
  4. Original record in `daily_attendance` remains untouched.
  5. Admin/Principal opens pending corrections panel.
  6. Reviewer approves or rejects request with review notes.
  7. If APPROVED, `daily_attendance` status is updated and `attendance_correction_requests` status becomes `APPROVED`.
  8. Immutable audit event `attendance.correction_approved` recorded.
- **Audit Requirement**: Original state, correction request, reason, reviewer, timestamp, and final state preserved.
- **Expected Result**: Attendance corrected without destroying historical trail.

### Workflow 7: Daily Academics ("Today's Notes") Publishing
- **Actor**: `TEACHER`.
- **Preconditions**: Assigned to Division & Subject.
- **Trigger**: End of lesson period.
- **Steps**:
  1. Teacher opens `/teacher` -> Author Today's Notes.
  2. Enter topic, summary, concept tags, textbook pages, homework details.
  3. Submit via `publishTodaysNote()`.
  4. Row inserted into `todays_notes`.
- **Expected Result**: Published note immediately visible on Student and Parent dashboards.

### Workflow 8: Security Kiosk Visitor Check-In & Check-Out
- **Actor**: `SECURITY_GUARD`.
- **Preconditions**: Kiosk app logged into `SECURITY_GUARD` session.
- **Trigger**: Visitor arrival at campus gate.
- **Steps**:
  1. Security Guard inputs visitor name, phone, purpose of visit, person to meet, badge number.
  2. Record created in `security_visitors` with `checkin_time = NOW()`.
  3. Upon visitor departure, Guard clicks "Check Out", setting `checkout_time = NOW()`.
- **Expected Result**: Campus entry/exit audit log maintained.
