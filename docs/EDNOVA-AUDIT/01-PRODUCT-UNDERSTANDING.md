# 01 — PRODUCT UNDERSTANDING & BOUNDARIES

## 1. Primary Product Identity & Purpose
**EDNOVA** is a production-grade, multi-tenant, installable, on-premise **Digital Academic & Operational Management Platform** for schools, higher-secondary institutions, and colleges.

### Primary Purpose
EDNOVA provides daily campus operations, student identity management, multi-tenant academic setup, daily attendance, schedule/timetable management, safety & incident logging, security gate kiosk tracking, class assessment entry, parent communications, and operational intelligence.

> **Source**: `docs/core/01_EDNOVA_ARCHITECTURE.md` (Lines 4-5) & `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` (Lines 4-5)

---

## 2. Target Organizations & Hierarchies
EDNOVA is designed to serve both K-12 schools and higher education institutions (colleges/universities) using configurable structural hierarchies:

### School Structure (K-12)
```text
Institution (School)
 └── Academic Year (e.g. 2026-2027)
      └── Grade (e.g. Grade 7)
           └── Division / Section (e.g. Section A)
                ├── Student Enrollment
                └── Teacher Assignment (Teacher → Subject → Division)
```

### College / University Structure
```text
Institution (College)
 └── Academic Year
      └── Department (e.g. Computer Science)
           └── Program (e.g. B.Tech CS)
                └── Semester (e.g. Semester 4)
                     └── Section
                          ├── Student Enrollment
                          └── Course / Subject Assignment
```

> **Source**: `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` (Section 3, Lines 32-35) & `docs/archive/01_PRODUCT_AND_REQUIREMENTS.md` (Lines 95-122)

---

## 3. Product Boundaries & Non-LMS Scope

### Explicit LMS Exclusion Rule
EDNOVA is **EXPLICITLY NOT AN LMS**. The official product specification states:

> **CRITICAL BOUNDARY**: EDNOVA is **NOT an LMS**. It does not host course marketplaces, SCORM packages, video streaming courses, or public learning catalogs.
> **Source**: `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` (Lines 6-7)

### Core Product Scope (Included)
1. **School & Campus Management**: School onboarding, academic year configuration, grade/department setup, division/section mapping.
2. **People & Roster Management**: User accounts, student profiles, teacher assignments, parent-student relationships.
3. **Attendance System**: Roster daily attendance (PRESENT, ABSENT, LATE, HALF_DAY, EXCUSED), correction requests, review workflows, append-only audit.
4. **Daily Academics**: "Today's Notes" lesson summaries, homework tags, textbook page assignments.
5. **Timetable & Schedule**: Master timetable grid, teacher class schedule, room allocations, collision detection.
6. **Assessments & Marks**: Class test creation, mark entry, letter grade calculation, student/parent mark lookup.
7. **Security Gate & Visitor Management**: Student movement events, visitor check-in/out kiosk, badge numbers.
8. **Safety & Incident Management**: Incident creation, facts timeline, statements, evidence attachments, escalation.
9. **Confidential Feedback**: Suggestions, complaints, safety concerns with confidentiality levels (NORMAL, CONFIDENTIAL, RESTRICTED).
10. **Multi-Channel Notifications**: Queue for IN_APP, PUSH, EMAIL, SMS, WHATSAPP notifications.
11. **On-Premise Operations & Intelligence**: Hardware preflight checks, local backup/restore scripts, signed license verifier, AI Gateway assistant.

---

## 4. Evaluation of the Core Academic/Learning Loop

### The Documented Academic Workflow vs LMS Loop
Some legacy prompts or generic academic models refer to a full LMS learning loop:
`TEACH → TODAY'S NOTES → LEARN → PRACTICE → ASSIGNMENT → ASSESSMENT → IDENTIFY LEARNING GAPS → REVISION → RE-ASSESSMENT → MASTERY`

In EDNOVA's actual specifications:
- **TEACH & TODAY'S NOTES**: SPECIFIED & IMPLEMENTED (`todays_notes` table and `academicActions.ts`).
- **ATTENDANCE**: SPECIFIED & IMPLEMENTED (`daily_attendance` table and `attendanceActions.ts`).
- **ASSESSMENT & MARKS**: SPECIFIED & IMPLEMENTED (`academic_assessments` & `student_marks` tables and `assessmentActions.ts`).
- **ASSIGNMENTS & PROJECTS**: DOCUMENTED IN ARCHIVE / PARTIALLY SPECIFIED.
- **LEARNING GAPS / REVISION / MASTERY ENGINE**: EXPLICITLY DEFERRED / EXCLUDED FROM CURRENT SCOPE (`docs/archive/01_PRODUCT_AND_REQUIREMENTS.md` Section 11, Lines 297-306).

---

## 5. Basic MVP Boundary Alignment
For the first **Basic MVP**, EDNOVA focuses strictly on the core administrative and attendance vertical slice:

```text
LOGIN
 ↓
ADMIN DASHBOARD
 ↓
CREATE SCHOOL
 ↓
CREATE ACADEMIC YEAR
 ↓
CREATE GRADE
 ↓
CREATE DIVISION
 ↓
CREATE SUBJECT
 ↓
CREATE TEACHER
 ↓
CREATE STUDENT
 ↓
ENROLL STUDENT
 ↓
ASSIGN TEACHER
 ↓
TEACHER LOGIN
 ↓
VIEW ASSIGNED CLASS
 ↓
TAKE ATTENDANCE
 ↓
SAVE ATTENDANCE
 ↓
STUDENT CAN VIEW ATTENDANCE
```

Advanced operational domains (Gate Kiosk, Incident Timelines, AI Gateway, Multi-channel Notifications) exist in the codebase but are secondary to the core MVP slice.
