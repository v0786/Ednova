# 16 — BASIC MVP SCOPE & BOUNDARY ANALYSIS

## 1. Executive Summary
This document establishes the precise boundary for the **EDNOVA Basic MVP** by combining specifications with the Basic MVP Build Prompt. Features are categorized into MUST HAVE, SHOULD HAVE, DEFERRED, and EXCLUDED.

---

## 2. Basic MVP Scope Classification Matrix

```text
                                  EDNOVA FEATURE SCOPE
                                           │
  ┌───────────────────────┬────────────────┴───────────────────────┬───────────────────────┐
  │                       │                                       │                       │
MUST HAVE               SHOULD HAVE                             DEFERRED                EXCLUDED
(Phase 1 & 2 Core)      (Phase 3 Enhancements)                  (Phase 4 Advanced Ops)  (Out of Scope)
- School Setup          - Master Timetable Grid                 - Security Gate Kiosk   - LMS Course Store
- Academic Year         - Today's Notes Authoring               - Incident Timelines    - SCORM Engine
- Grade & Division      - Assessment Mark Entry                 - Multi-channel Queue   - Video Streaming
- Student Enrollment    - Parent Child View                     - AI Gateway RAG        - Learning Gap AI
- Teacher Assignment    - Attendance Corrections                - Signed Verifier
- Roster Attendance
```

---

## 3. Scope Details & Rationale

### MUST HAVE (Basic MVP Vertical Slice)
1. **Multi-Tenant Foundation**:
   - Create School Tenant (`schools` table & `createSchoolTenant` server action).
   - Create Academic Year (`academic_years` table & `createAcademicYear` server action).
   - Create Grade & Division (`grades` & `divisions` tables).
2. **People & Enrollment**:
   - Create & Register Student Profiles (`profiles` & `student_enrollments`).
   - Create & Assign Teacher Profiles (`teacher_assignments`).
3. **Daily Attendance Lifecycle**:
   - Teacher views assigned class division roster.
   - Teacher marks daily roster attendance (`PRESENT`, `ABSENT`, `LATE`, `HALF_DAY`, `EXCUSED`).
   - Idempotent submit saves to `daily_attendance` table in PostgreSQL.
   - Student views personal attendance log on Student Portal.
4. **Security & Audit Foundation**:
   - 4-Layer Security (`verifyServerSession`, `validateTenantAccess`, `get_user_school_id()`).
   - Append-only audit logging (`audit_events` & `prevent_audit_tampering()` trigger).

### SHOULD HAVE (Primary Additions for MVP Verification)
1. **Today's Notes Publishing**: Teachers broadcast daily lesson topic and homework to student portal.
2. **Timetable Grid View**: Display division schedule and teacher class list.
3. **Attendance Correction Workflow**: Teachers submit correction request; Admin approves or rejects.
4. **Parent Linkage & Lookup**: Parent views linked child attendance log after relationship check.

### DEFERRED (Advanced Modules Present in Backend but Deferred for Initial MVP Slice)
1. **Security Gate Visitor Kiosk**: Gate check-in/out badge logging.
2. **Safety Incident Timeline Console**: Facts timeline, evidence attachments, escalation tracking.
3. **Multi-Channel Outbox Workers**: Background delivery workers for SMS, WhatsApp, and Email.
4. **AI Gateway RAG Assistant**: Institutional prompt query engine.
5. **Signed License Verifier**: Cryptographic license key validation.

### OUT OF SCOPE (Explicitly Excluded Product Boundaries)
1. **LMS Course Store & Video Streaming**: EDNOVA is not an LMS.
2. **SCORM & Public Marketplace**: Excluded from product scope.
3. **Automated Course Selling**: Excluded from product scope.
4. **Learning-Gap & Mastery Engines**: Excluded from product scope.

---

## 4. MVP Vertical Slice Sequence Map

```text
[Step 1: Admin Login]
        ↓
[Step 2: Provision School Tenant -> "St. Jude High School" (Code: SJHS-2026)]
        ↓
[Step 3: Create Academic Year -> "2026-2027"]
        ↓
[Step 4: Create Grade -> "Grade 7" & Division -> "Section A"]
        ↓
[Step 5: Create & Enroll Student -> "Alex Rivera" (Roll #701)]
        ↓
[Step 6: Create & Assign Teacher -> "Prof. Sarah Jenkins" (Subject: Physics)]
        ↓
[Step 7: Teacher Login -> Select Grade 7 Section A -> Open Roster]
        ↓
[Step 8: Mark Attendance -> Alex Rivera: PRESENT -> Submit Roster]
        ↓
[Step 9: Database Upsert in daily_attendance + Audit Event Created]
        ↓
[Step 10: Student Login -> View Attendance Dashboard -> Displays 100% Present]
```
