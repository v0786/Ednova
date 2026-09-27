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

## 2. Shared API Client SDK
The client SDK [`app/src/lib/mobileClientSdk.ts`](file:///home/devpc/Projects/EDNOVA/app/src/lib/mobileClientSdk.ts) handles:
- Authentication & JWT Session Tokens
- Strict Server-side Role Guard Validation
- Linked Child Access Control for Parents
- Push Notification Token Registration

---

## 3. Native App Configuration
The mobile app ecosystem is configured in [`app/app.json`](file:///home/devpc/Projects/EDNOVA/app/app.json) supporting native compilation for:
- **Android**: Package `org.ednova.app`
- **iOS**: Bundle Identifier `org.ednova.app`
