# EDNOVA UX Architecture

| Field | Value |
|---|---|
| Document ID | UX-ARCH-001 |
| Version | 0.1 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | 02-DISCOVERY/02-USERS-AND-PERSONAS.md, 02-DISCOVERY/03-USER-JOURNEYS.md, 03-ARCHITECTURE/01-SYSTEM-ARCHITECTURE.md |

## Experience direction

EDNOVA is a responsive web application with desktop-first administration and mobile-friendly student and parent workflows. A native mobile app is not assumed. Accessibility and clear scope indicators are mandatory design concerns.

## Information architecture

1. Home and role-scoped dashboard
2. School Management
3. People and enrollment
4. Schedule
5. Attendance
6. Daily Academics
7. Assignments and Projects
8. Examination
9. Learning and Progress
10. Communication
11. Reporting
12. Security and Audit for authorized administrators

## UX principles

- Make current school, academic year, grade, division, subject, and child context visible.
- Keep the core learning loop navigable without duplicating records.
- Show status, deadline, save state, and next action clearly.
- Design for keyboard, screen readers, contrast, focus, errors, and responsive layouts.
- Do not make unavailable actions appear available.
- Explain authorization failures without leaking unrelated record existence.
- Use confirmation and recovery for history-sensitive actions.
- Avoid claims the system cannot substantiate, including cheat-proof exams or real-time delivery.

## Initial flows

| ID | Flow | Actor | Status |
|---|---|---|---|
| UX-FND-001 | Establish school context and tenant-safe navigation | Admin | Proposed |
| UX-FND-002 | Create hierarchy and enroll students | SCHOOL_ADMIN | Proposed |
| UX-FND-003 | View historical student identity and enrollments | Authorized staff | Proposed |
| UX-FND-004 | Manage role/capability-aware navigation | All roles | Proposed |
| UX-ATT-001 | Record attendance | TEACHER | Proposed |
| UX-ATT-002 | Submit and approve correction | Teacher/Admin | Proposed |
| UX-ACA-001 | Create and view Today's Notes | Teacher/Student | Proposed |
| UX-ASM-001 | Create, submit, and review assignment | Teacher/Student | TBD |
| UX-EXAM-001 | Enter, save, review, and submit exam | Student | Proposed |
| UX-PRIV-001 | Process a governed privacy request | Authorized operator | TBD |
| UX-GATE-001 | Future gate verification and visitor workflow | SECURITY_STAFF | Future / TBD |
| UX-GATE-002 | Future provider synchronization status | CAMPUS_SECURITY_ADMIN | Future / TBD |

## Open design decisions

Navigation depth, content hierarchy, component library, typography, color, empty states, error copy, notification channels, file previews, exam interruption UX, localization, and user research validation are TBD.

## Future Security & Gate Management UX

The future security interface should be a dedicated, low-friction responsive workflow with persistent tenant/campus/gate context, minimum-disclosure verification cards, explicit entry/exit state, incident and emergency actions, searchable history, and provider synchronization status. It must remain permission-separated from academic dashboards. A native mobile client is not assumed.
