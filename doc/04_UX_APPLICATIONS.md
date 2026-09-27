# EDNOVA — UX, Design System & Applications

## 1. Design Direction

Current design direction:
- Modern dark aesthetic
- Deep slate/navy foundation
- High-contrast cards
- Indigo primary
- Emerald success
- Amber warning
- Rose security/danger
- Inter/sans-serif body typography
- Monospace for IDs, roll numbers, timestamps and status badges
- Lucide icons
- Responsive layouts
- Accessible components

## 2. Core Web Experiences

### Owner Desktop
Focus:
- multi-institution oversight
- operational trends
- unresolved issues
- safety/incident summaries
- aggregate academic/attendance metrics
- deployment/license state
- system health

### School/College Admin Desktop
Focus:
- institution setup
- academic structure
- people
- timetable
- attendance
- assessments
- grades
- feedback
- incidents
- security
- notifications
- reports
- audit
- system health

### Principal Experience
Focus:
- institutional dashboard
- attendance approvals
- safety incident review
- escalation
- operational summaries
- reports

## 3. Mobile Client Application Architecture & Workspaces

EDNOVA adopts **ONE SINGLE MOBILE APPLICATION** codebase (`mobile-core`) operating on top of a dynamic **Role & Permission Workspace Engine**:

```text
                         EDNOVA MOBILE APP
                                │
                                ▼
                       AUTHENTICATED USER
                                │
                    ┌───────────┴───────────┐
                    │                       │
                SCHOOL ID                USER ROLE
                    │                       │
                    └───────────┬───────────┘
                                ▼
                       PERMISSION ENGINE
                                │
   ┌───────────┬───────────┬────┴──────┬───────────┬───────────┐
   │           │           │           │           │           │
STUDENT     PARENT      TEACHER      STAFF     PRINCIPAL   SECURITY
   │           │           │           │           │           │
   ▼           ▼           ▼           ▼           ▼           ▼
Student     Parent      Teacher      Staff     Principal   Security
Workspace  Workspace   Workspace   Workspace   Workspace   Workspace
```

### Design Philosophy
> **SIMPLE → CLEAR → FRIENDLY → FAST → ACCESSIBLE → SECURE**
- Icon + explicit text labels required for all statuses (`✓ Present`, `✕ Absent`, `⚠ Pending`).

### Dynamic Role Workspaces
- **Student Workspace**: Personalized timetable, attendance percentage, class test marks, letter grades, announcements.
- **Parent Workspace**: Linked child selector (strictly validated against `parent_student_relationships` DB linkage), gate alerts, report cards.
- **Teacher Workspace**: One-tap roster attendance entry, class schedule, test mark entry, Today's Notes publisher.
- **Staff / Admin Workspace**: Institutional rosters, operational notifications, reports.
- **Principal Workspace**: Executive decision desk, attendance aggregates, safety alerts, AI Assistant console.
- **Security Guard Workspace**: Gate kiosk check-ins, visitor badge creation, emergency alerts. No unrestricted academic data.

## 4. Current Implemented Views

Existing design references include:
- platform landing/monitoring page
- school setup kiosk
- people management
- security gate kiosk
- timetable matrix
- attendance marking
- daily academics
- incident console

## 5. UX Rules

Important workflows must clearly show:
- current user
- current institution
- permission scope
- record status
- audit-relevant actions
- errors
- confirmation for sensitive operations

Do not hide security boundaries behind visual design alone.

## 6. Feedback UX

Submission should allow:
- category
- description
- confidentiality
- optional location
- optional attachment
- optional anonymity/confidentiality according to policy

Users should see status progression where policy allows.

## 7. Incident UX

Incident console should show a chronological timeline.

Separate:
- facts
- statements
- evidence
- actions
- approvals
- AI summaries
- human decisions

Sensitive incidents require restricted access indicators.

## 8. Accessibility

Target:
- keyboard accessibility
- clear focus states
- readable contrast
- semantic controls
- usable forms
- error messages
- responsive layouts

## 9. Mobile Principles

Mobile apps should use the same domain/API/authorization foundations as web.

Do not duplicate business rules inside Android clients.

The server remains authoritative.

## 10. Information Architecture

The product should prioritize:
1. Dashboard
2. People
3. Academic Planning
4. Attendance
5. Feedback
6. Incidents
7. Security
8. Reports
9. Notifications
10. Audit
11. AI
12. System Health

Exact navigation may differ by role.
