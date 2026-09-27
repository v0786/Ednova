# EDNOVA Mobile Architecture & Integration Specification

## 1. Overview
EDNOVA uses **one shared mobile application codebase**. After login, the application resolves the user's authorized role workspace (**Principal Workspace**, **Staff/Teacher Workspace**, **Student Workspace**, **Parent Workspace**, **Security Workspace**) and exposes only the capabilities permitted for that user by the authoritative EDNOVA backend.

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

---

## 2. Shared API Client SDK & Request Layer
The client SDK [`app/src/lib/mobileClientSdk.ts`](file:///home/devpc/Projects/EDNOVA/app/src/lib/mobileClientSdk.ts) handles:
- Authentication & JWT Session Tokens
- Request Abstraction (`request()`) with 10s timeout handling
- Error Normalization (`normalizeMobileError()`) preventing stack trace / SQL disclosure
- Network State Awareness (`MobileNetworkState`)
- Session Expiry Recovery (Auto-logout on 401 / UNAUTHORIZED)
- Notification Token Registration Abstraction (`MobileNotificationClient`)

---

## 3. Shared Mobile Infrastructure Components
Located under `app/src/components/mobile/`:
- **`SharedOfflineBanner`**: Real-time accessible network status banner.
- **`SharedLoadingState`**: Accessible loading spinner and progress label.
- **`SharedErrorState`**: Safe error message container with retry action.
- **`SharedEmptyState`**: Standardized zero-state indicator.

---

## 4. Workspaces Implementation Register
- **Student Workspace (`Phase 5.4`)**: Personal schedule, marks, attendance, notices, confidential feedback.
- **Parent Workspace (`Phase 5.5`)**: Multi-child switcher, linked student relationship validation, child attendance, timetable, academic results, gate entry alerts.
- **Teacher Workspace (`Phase 5.6`)**: Schedule, roster & one-tap attendance marking, assessment mark entry, Today's Notes publisher, notices, teacher profile.
- **Staff / Admin Workspace (`Phase 5.7`)**: Overview metrics, category-filtered roster directory, attendance admin summaries, announcement publisher, system health telemetry.
- **Principal Workspace (`Phase 5.8`)**: Executive metrics desk, safety incident timeline, context-gated AI Gateway assistant console.
- **Security Guard Workspace (`Phase 5.9`)**: Gate movement scanner & kiosk, one-tap entry/exit logging, movement timeline, safety alerts.
- **Push Notification Client (`Phase 5.10`)**: Device token registration, payload normalization across categories (`ATTENDANCE`, `ASSESSMENT`, `INCIDENT`, `ANNOUNCEMENT`), deep link target resolution.
- **Offline / Error Recovery (`Phase 5.11`)**: Connectivity banner, 10s request timeout, safe error normalization, state badges (`SAVED`, `PENDING`, `FAILED`).
- **AI Integration (`Phase 5.12`)**: Permission-aware AI Gateway RAG engine, prompt injection boundaries `<untrusted_user_query>`, audit event logging.
- **Security Hardening (`Phase 5.13`)**: 6-vector security boundary verification, RLS enforcement, multi-tenant isolation.
- **Functional QA (`Phase 5.14`)**: 6 user journeys verified end-to-end.
- **Production Acceptance (`Phase 5.15`)**: Production static build verified (`npm run build` PASS, 25 routes).

---

## 5. Native App Configuration
The mobile app ecosystem is configured in [`app/app.json`](file:///home/devpc/Projects/EDNOVA/app/app.json) supporting native compilation for:
- **Android**: Package `org.ednova.app`
- **iOS**: Bundle Identifier `org.ednova.app`

