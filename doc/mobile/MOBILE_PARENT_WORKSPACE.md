# EDNOVA Mobile Parent Workspace Specification

## 1. Overview
The Parent Workspace provides guardians with secure access to their linked children's institutional records within the **Single Mobile Application Architecture**.

```text
AUTHENTICATED PARENT
        │
        ▼
parent_student_relationships
        │
 ┌──────┴──────┐
 │             │
CHILD A     CHILD B
 │             │
 ▼             ▼
[ Attendance | Timetable | Assessment Marks | Gate Alerts | Notices ]
```

> **Security Rule**: A parent does not receive unrestricted student access. A parent can access only children linked to that authenticated parent through the authoritative `parent_student_relationships` table.

---

## 2. Core Modules
- **Linked Child Selector**: Multi-child toggle switcher automatically populated from backend relationships. If no linked child exists, a clear zero-state banner is rendered.
- **Child Dashboard**: Quick overview showing attendance percentage, next class, latest assessment grade, and gate entry status.
- **Child Attendance Log**: Summary (Present/Absent/Late counts) and daily attendance timeline with visual status indicators (`✓ Present`, `✕ Absent`, `⚠ Late`).
- **Child Timetable**: Daily schedule of assigned classes, subjects, room numbers, and teachers.
- **Child Academic Results**: Mid-term and class test marks, maximum marks, letter grades, and assessment dates.
- **Gate Entry / Exit Alerts**: Live security gate events for student entry and exit tracking.
- **Parent Notices & Announcements**: School announcements targeted to `PARENTS` or `ALL`.

---

## 3. Backend Authorization & Relationship Guard
All requests passed via `EdnovaMobileClient.getChildAcademicDetails()` enforce:
1. Active Supabase SSR session token.
2. Tenant isolation check (`schoolId`).
3. Relationship validation (`parent_id = session.userId` AND `student_id = selectedChildId`).
4. Rejection of unauthorized child selection attempts with `FORBIDDEN` error.
