# EDNOVA — System & Technical Architecture

## 1. Executive Summary & Core Architectural Principles
EDNOVA is a production-grade on-premise operational management platform for schools and colleges.

```text
                               EDNOVA SERVER
                                     │
                              Authentication & RBAC
                                     │
                         Server Actions & RLS Guard
                                     │
          ┌──────────────────────────┼──────────────────────────┐
          │                          │                          │
     Owner Web                   Admin Web                 Teacher Web
      (/owner)                   (/admin)                   (/teacher)
          │                          │                          │
          ├──────────────────────────┼──────────────────────────┤
          │                          │                          │
     Student Web                Single Mobile App           AI Gateway
      (/student)                 (mobile-core)             (aiGateway.ts)
          │                          │                          │
          └──────────────────────────┴──────────────────────────┘
                                     │
                                     ▼
                          PostgreSQL + RLS Isolation
```

### Key Technical Pillars
- **Single Source of Truth**: The EDNOVA backend is authoritative for identity, authorization, academic logic, attendance, assessments, and notifications.
- **Backend Authorization Boundary**: Client interfaces (Web/Mobile) determination of UI components is purely UX optimization. Row-Level Security (RLS) and server actions enforce security.
- **Single Mobile App Architecture**: Uses **ONE SINGLE MOBILE APPLICATION** codebase (`mobile-core`) with dynamic workspace resolution.

---

## 2. Server & Database Architecture
- **Framework**: Next.js 16 (React 19, TypeScript 5, TailwindCSS v4).
- **Database Engine**: PostgreSQL with Row-Level Security (RLS) policies.
- **Tenant Isolation**: Anchor function `get_user_school_id()` ensures database rows are scoped strictly by institution.
- **Audit System**: Append-only trigger-based auditing on sensitive tables via `audit_logs`.

---

## 3. Web & Mobile Client Architecture
- **Web Applications**: Responsive web clients for Owner (`/owner`), Admin/Staff (`/admin`), Teacher (`/teacher`), Student (`/student`), and Auth (`/login`).
- **Single Mobile App**: Workspace dynamic resolver `resolveWorkspaceType()` maps authenticated sessions to Student, Parent, Teacher, Admin, Principal, or Security Workspaces.

---

## 4. Deployment & Storage Architecture
- **Containerization**: Multi-container Docker setup (`ednova_app_server`, `ednova_postgres_db`).
- **Local Storage**: Persistent local file attachments with MIME validation and size limits.
- **Disaster Recovery**: Automated `.tar.gz` compressed database and file exporter/restorer.
