# EDNOVA Mobile Teacher Workspace Specification

## 1. Overview
The **Teacher Workspace** provides assigned teaching faculty with role-scoped access to daily class schedules, student rosters, one-tap roster attendance entry, assessment mark recording, Today's Notes publishing, teacher notices, and personal profile information within the `mobile-core` application shell (`app/src/app/mobile/workspaces/teacher/page.tsx`).

---

## 2. Authorization & Data Scope Boundary
- **Teacher Security Model**: Authentication → Tenant Isolation (`school_id`) → TEACHER Role → Authorized Class/Subject Scope → Resource Access.
- **Authoritative Validation**: Client-supplied `teacherId`, `classId`, or `subjectId` parameters are NEVER trusted by frontend components. Server actions (`attendanceActions.ts`, `assessmentActions.ts`, `academicActions.ts`) resolve identity directly from the encrypted server session.
- **Cross-Teacher Isolation**: Teachers can ONLY inspect and record data for assigned classes (`cls-8a`, `cls-8b`, `cls-9a`). Unassigned class requests trigger a `FORBIDDEN` exception.

---

## 3. Core Modules & User Journeys
1. **Teacher Dashboard Overview**:
   - Today's Class Count & Roster Student Metrics.
   - Next Class Alert Card (Subject, Room Number, Start Time).
   - Pending Assessment Count & Today's Notes status.

2. **Today's Teaching Schedule**:
   - Schedule timeline listing Period Number, Subject, Grade/Division, Room Number, Time range, and status indicator (`COMPLETED`, `NOW`, `UPCOMING`).

3. **One-Tap Attendance Marking**:
   - Class Roster Switcher (`Class 8-A`, `Class 8-B`, `Class 9-A`).
   - Interactive 3-way toggle per student (`✓ PRESENT`, `✕ ABSENT`, `⚠ LATE`).
   - Roster Summary Confirmation Card displaying total roster count, present count, absent count, and late count prior to commit.
   - Idempotent upsert transaction via `submitAttendanceRoster()`.

4. **Assessment Mark Entry**:
   - Class and Assessment Selector (`Unit Test 1`, `Mid-Term Algebra`).
   - Range-bounded numeric input validation (`0 <= marks <= maxMarks`).
   - Server submission via `submitTeacherMarks()`.

5. **Today's Notes Publisher**:
   - Lesson Topic, Class Summary, and Homework Assignment inputs.
   - Server persistence via `publishTodaysNote()`.

6. **Notices & Teacher Profile**:
   - Targeted faculty announcements and departmental credentials.

---

## 4. Error & Offline Handling
- Network failures trigger `SharedOfflineBanner` and status indicators (`SAVED`, `PENDING`, `FAILED`, `NOT SENT`).
- Safe error normalization via `normalizeMobileError()` prevents internal database stack trace disclosure.
