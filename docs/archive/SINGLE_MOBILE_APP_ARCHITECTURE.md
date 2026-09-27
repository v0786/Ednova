# EDNOVA — Single Mobile App Architecture Specification

## 1. Core Architecture Strategy

> **Login determines identity. Permissions determine capability.**

EDNOVA utilizes **ONE SINGLE MOBILE APPLICATION** codebase (`mobile-core`) operating on top of a dynamic **Role & Permission Workspace Engine**.

```text
                         EDNOVA MOBILE APP
                                │
                                ▼
                         LOGIN / SESSION
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

---

## 2. Four-Layer Authorization Boundary

1. **Layer 1 — Authentication**: Validates session authenticity (`user_id`).
2. **Layer 2 — Tenant Isolation**: Validates institution context (`school_id`).
3. **Layer 3 — Role Baseline**: Determines baseline workspace environment (`STUDENT`, `PARENT`, `TEACHER`, `SCHOOL_ADMIN`, `PRINCIPAL`, `SECURITY_GUARD`).
4. **Layer 4 — Resource Scope**: Server-side authorization verifying relationships (e.g. `parent_student_relationships` DB validation, teacher class assignments).

---

## 3. Modular Workspaces Directory Structure

```text
app/src/
├── lib/
│   └── mobileClientSdk.ts        # Unified Mobile SDK Client
└── app/
    └── mobile/                   # Shared Mobile Resolver Route
        ├── page.tsx              # Single Mobile Navigation Engine
        └── workspaces/
            ├── student/          # Student Workspace (Schedule, Marks, Attendance)
            ├── parent/           # Parent Workspace (Linked Child Selector, Gate Alerts)
            ├── teacher/          # Teacher Workspace (Roster Attendance, Mark Entry)
            ├── admin/            # Staff / Admin Workspace (Rosters, Reports)
            ├── principal/        # Principal Workspace (Executive Desk, AI Gateway)
            └── security/         # Security Guard Workspace (Gate Kiosk, Visitor Badges)
```

---

## 4. Implementation Phasing Strategy

- **Step 1 — Shared Core Foundation**: Single SDK, session resolver, bottom navigation engine.
- **Step 2 — Student Workspace**: Schedule, marks, attendance, announcements.
- **Step 3 — Parent Workspace**: Linked child selector, real-time gate entry notifications.
- **Step 4 — Teacher Workspace**: One-tap roster attendance, test mark entry.
- **Step 5 — Staff / Admin Workspace**: Institutional management.
- **Step 6 — Principal Workspace**: Executive overview, AI assistant console.
- **Step 7 — Security Guard Workspace**: Visitor check-in/out, gate events.
