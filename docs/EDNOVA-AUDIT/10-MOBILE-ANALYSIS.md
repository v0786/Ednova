# 10 — MOBILE ARCHITECTURE & WORKSPACE ANALYSIS

## 1. Executive Summary
This document analyzes the mobile client architecture of EDNOVA based on `docs/mobile/*` specifications, shared TypeScript mobile client SDK (`app/src/lib/mobileClientSdk.ts`), and mobile workspace route simulators (`/mobile/workspaces/*`).

---

## 2. Architecture Strategy: Single Mobile Application

> **Core Principle**: **ONE SINGLE MOBILE APPLICATION** codebase (`mobile-core`) with dynamic role workspace resolution.

Legacy documentation contained references to "four mobile role applications". This legacy wording was audited and corrected across active specifications (`docs/mobile/MOBILE_IMPLEMENTATION.md` and `docs/additional/DOCUMENTATION_INTEGRITY_AUDIT.md`).

```text
                  SINGLE MOBILE APPLICATION (org.ednova.app)
                                     │
                             AUTHENTICATION
                                     │
                      resolveWorkspaceType(userRole)
                                     │
  ┌───────────────┬───────────────┼───────────────┬───────────────┬───────────────┐
  │               │               │               │               │               │
Student         Parent          Teacher         Admin           Principal       Security
Workspace       Workspace       Workspace       Workspace       Workspace       Workspace
```

---

## 3. Shared Mobile Client SDK (`mobileClientSdk.ts`)
Mobile client capabilities are unified into a shared client SDK (`app/src/lib/mobileClientSdk.ts`) providing:

- **Session Context Resolver**: Retrieves authenticated token, user profile, role, and tenant `school_id`.
- **Workspace Type Resolver**: Executes `resolveWorkspaceType(role)` to load the correct role-specific workspace layout.
- **Offline & Network Recovery**: Listens to connectivity state (`networkState.ts`) and displays `SharedOfflineBanner.tsx`.
- **Push Notification Listener**: Receives multi-channel push payloads from `notification_queues`.
- **API Wrappers**: Encapsulates attendance marking, Today's Notes retrieval, assessment mark lookup, and visitor check-in.

---

## 4. Mobile Workspace Inventory & Capabilities

### 1. Student Workspace (`/mobile/workspaces/student`)
- **Capabilities**: View daily timetable, attendance summary percentage, recent test marks, Today's Notes, and announcements.
- **Restriction**: Bound strictly to student's own `user_id`.

### 2. Parent Workspace (`/mobile/workspaces/parent`)
- **Capabilities**: Child selector dropdown (linked via `parent_student_relationships`), real-time gate entry/exit alerts, child attendance log, academic marks.
- **Restriction**: Query fails if parent-child link is not verified in DB.

### 3. Teacher Workspace (`/mobile/workspaces/teacher`)
- **Capabilities**: One-tap roster attendance entry, Today's Notes authoring, assigned class schedule.

### 4. Admin Workspace (`/mobile/workspaces/admin`)
- **Capabilities**: Quick student enrollment lookup, active safety incident alerts, daily campus metrics.

### 5. Principal Workspace (`/mobile/workspaces/principal`)
- **Capabilities**: Daily campus summary metrics, pending attendance correction approvals, safety telemetry.

### 6. Security Guard Workspace (`/mobile/workspaces/security`)
- **Capabilities**: Kiosk gate event entry, visitor check-in/out form, emergency incident reporting.
- **Restriction**: Blocked from accessing student academic records or teacher administrative data.

---

## 5. Implementation & Packaging Status

- **Architecture & Specifications**: **100% SPECIFIED & VERIFIED**.
- **SDK Contracts & Web Simulators**: **IMPLEMENTED** (compiling cleanly at `/mobile` routes).
- **Native Android / iOS Compiled Binaries**: **DEFERRED / NOT YET PACKAGED** (Native React Native / Capacitor wrappers pending).
