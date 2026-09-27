# EDNOVA Phase 5 Implementation Plan

## 1. Executive Summary & Objective
Phase 5 authorizes the full, incremental implementation of the **EDNOVA Single Mobile Application**. Building upon the Phase 4 mobile foundation, Phase 5 delivers the production user experience and dynamic workspace capabilities across Student, Parent, Teacher, Staff/Admin, Principal, and Security roles while strictly preserving backend Row-Level Security (RLS) authority.

---

## 2. Non-Negotiable Architecture
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

- **Single Application Codebase**: `mobile-core` under `app/src/app/mobile/`.
- **Backend Authority**: Client-side workspace resolution determines UI layout only. PostgreSQL RLS and server actions strictly validate all data requests.

---

## 3. Sub-Phase Implementation Register

| Sub-Phase | Title | Focus Area | Status |
|---|---|---|---|
| **5.1** | Native Mobile Shell | Application Shell, Navigation Container, Shared UI Shell & States | **COMPLETE** |
| **5.2** | Authentication & Session Flow | Login, Logout, Session Restoration, Token Expiry | **COMPLETE** |
| **5.3** | Shared Mobile Infrastructure | Shared SDK, Error Handler, Storage Strategy, Notification Client | **COMPLETE** |
| **5.4** | Student Workspace | Schedule, Marks, Attendance, Announcements, Profile, Feedback | **COMPLETE** |
| **5.5** | Parent Workspace | Child Selector, Attendance, Gate Alerts, Report Cards | **COMPLETE** |
| **5.6** | Teacher Workspace | Roster Attendance, Today's Notes, Assessment Marks, Timetable | PLANNED |
| **5.7** | Staff / Admin Workspace | Roster Management, Operations Control, System Alerts | PLANNED |
| **5.8** | Principal Workspace | Executive Decision Desk, Safety Alerts, AI Gateway Integration | PLANNED |
| **5.9** | Security Guard Workspace | Gate Entry/Exit Kiosk, Visitor Badges, Emergency Alerts | PLANNED |
| **5.10** | Push Notifications | APNS/FCM Registration, Category Payload Dispatch, Deep Linking | PLANNED |
| **5.11** | Offline / Error Recovery | Network Failure Banners, Offline Draft Warning, Session Recovery | PLANNED |
| **5.12** | AI Integration | Context-Gated AI Assistant for Principal/Teacher/Student | PLANNED |
| **5.13** | Security Hardening | Cross-Role Access Guard Tests, Tenant Isolation Audit | PLANNED |
| **5.14** | Functional QA | End-to-End User Journey Verification | PLANNED |
| **5.15** | Production Acceptance | Production Bundle Verification & Deployment Handoff | PLANNED |

---

## 4. Phase 5.1 Detail — Native Mobile Shell Foundation
- **Navigation Engine**: Dynamic workspace switcher integrated into `app/src/app/mobile/page.tsx`.
- **Shared Mobile Shell Components**: Standardized headers, role workspace tab bars, loading indicators, offline banners, and unauthorized alert screens.
- **Routing Engine**: Maps `/mobile/workspaces/[role]` to dedicated modular views (`student`, `parent`, `teacher`, `admin`, `principal`, `security`).

---

## 5. Security & Verification Requirements
- All data fetch operations invoke backend server actions (`attendanceActions.ts`, `parentActions.ts`, `assessmentActions.ts`).
- Verification via TypeScript compilation and Next.js static site generation (`npm run build`).
