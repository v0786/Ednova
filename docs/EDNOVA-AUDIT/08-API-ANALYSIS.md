# 08 — API & SERVER ACTIONS ANALYSIS

## 1. Executive Summary
EDNOVA uses Next.js 16 TypeScript Server Actions (`'use server'`) as its primary API and backend contract layer. This document audits all 10 core domain action files and 4 operational infrastructure action files located in `app/src/lib/actions/`.

---

## 2. Server Action Inventory & Contract Evaluation

### 1. `academicActions.ts`
- **Actions Included**: `createSchoolTenant`, `createAcademicYear`, `createGrade`, `createDivision`, `createSubject`, `enrollStudent`, `assignTeacher`, `publishTodaysNote`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL'])`.
- **Tenant Validation**: `validateTenantAccess(input.schoolId, session)`.
- **Validation**: Requires mandatory fields (e.g. topic, summary, schoolId, names).
- **Database Interaction**: Inserts into `schools`, `academic_years`, `grades`, `divisions`, `subjects`, `student_enrollments`, `teacher_assignments`, `todays_notes`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 2. `attendanceActions.ts`
- **Actions Included**: `submitAttendanceRoster`, `requestAttendanceCorrection`, `reviewAttendanceCorrection`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL'])`.
- **Tenant Validation**: `validateTenantAccess(input.schoolId, session)`.
- **Validation**: Roster array must not be empty; valid status enum (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`).
- **Database Interaction**: Upserts into `daily_attendance` (`onConflict: 'school_id,student_id,date'`), inserts into `attendance_correction_requests`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 3. `timetableActions.ts`
- **Actions Included**: `createTimetableEntry`, `getDivisionTimetable`, `getTeacherSchedule`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'PRINCIPAL', 'STUDENT'])`.
- **Collision Checking**: Queries existing timetable entries for teacher, division, or room double-booking before insertion.
- **Database Interaction**: `timetable_entries`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 4. `assessmentActions.ts`
- **Actions Included**: `createAssessment`, `recordStudentMarks`, `getStudentMarksForParent`, `getStudentMarksForStudent`.
- **Authentication**: `verifyServerSession()`.
- **Security Check**: For parent requests, calls `parent_student_relationships` validation before returning mark data.
- **Database Interaction**: `academic_assessments`, `student_marks`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 5. `parentActions.ts`
- **Actions Included**: `linkParentToStudent`, `getLinkedChildren`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PARENT'])`.
- **Validation**: Verifies valid parent and student profile IDs in same school tenant.
- **Database Interaction**: `parent_student_relationships`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 6. `feedbackIncidentActions.ts`
- **Actions Included**: `submitFeedback`, `createIncidentReport`, `addIncidentTimelineEvent`.
- **Authentication**: `verifyServerSession()`.
- **Confidentiality Check**: Enforces privacy levels (`NORMAL`, `CONFIDENTIAL`, `RESTRICTED`).
- **Database Interaction**: `feedback_records`, `incident_records`, `incident_timeline_events`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 7. `gateActions.ts`
- **Actions Included**: `logSecurityGateEvent`, `checkinVisitor`, `checkoutVisitor`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'SECURITY_GUARD', 'SECURITY_STAFF'])`.
- **Database Interaction**: `security_gate_events`, `security_visitors`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 8. `notificationActions.ts`
- **Actions Included**: `queueNotification`, `getPendingNotifications`, `markNotificationDelivered`.
- **Authentication**: `verifyServerSession()`.
- **Channel Check**: Validates channel (`IN_APP`, `PUSH`, `EMAIL`, `SMS`, `WHATSAPP`).
- **Database Interaction**: `notification_queues`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 9. `fileActions.ts`
- **Actions Included**: `registerFileAttachment`, `getFileAttachmentMetadata`.
- **Authentication**: `verifyServerSession()`.
- **Validation**: 10MB size limit check, MIME type verification, malware scan flag.
- **Database Interaction**: `file_attachments`.
- **Contract Status**: **VERIFIED & COMPILING**.

### 10. `aiGatewayActions.ts`
- **Actions Included**: `queryAiGateway`.
- **Authentication**: `verifyServerSession(['SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'INSTITUTION_OWNER', 'PLATFORM_OWNER'])`.
- **Security Defense**: Context retrieval bound to authenticated session `school_id`; strips raw HTML tags; prompt injection filtering.
- **Contract Status**: **VERIFIED & COMPILING**.

### 11-14. Operational Actions (`licenseActions.ts`, `healthActions.ts`, `maintenanceActions.ts`, `backupActions.ts`)
- **Functions**: Cryptographic signed license verification, system health diagnostic snapshots, maintenance mode toggle, manual backup execution.
- **Contract Status**: **VERIFIED & COMPILING**.

---

## 3. Summary API Matrix

| Module | Action File | Auth Guard Active | Tenant Isolation Active | RLS Aligned | Status |
|---|---|:---:|:---:|:---:|:---:|
| Academic & Setup | `academicActions.ts` | YES | YES | YES | COMPILING |
| Attendance | `attendanceActions.ts` | YES | YES | YES | COMPILING |
| Timetable | `timetableActions.ts` | YES | YES | YES | COMPILING |
| Assessments | `assessmentActions.ts` | YES | YES | YES | COMPILING |
| Parent Linkage | `parentActions.ts` | YES | YES | YES | COMPILING |
| Feedback & Incidents | `feedbackIncidentActions.ts` | YES | YES | YES | COMPILING |
| Security Gate | `gateActions.ts` | YES | YES | YES | COMPILING |
| Notifications | `notificationActions.ts` | YES | YES | YES | COMPILING |
| File Storage | `fileActions.ts` | YES | YES | YES | COMPILING |
| AI Gateway | `aiGatewayActions.ts` | YES | YES | YES | COMPILING |
| Operations | `healthActions.ts` etc. | YES | YES | YES | COMPILING |
