# EDNOVA Mobile Architecture & Integration Specification

## 1. Overview
The **EDNOVA Mobile Client Suite** connects all four mobile role applications (**Principal App**, **Staff/Teacher App**, **Student App**, **Parent App**) directly to the authoritative EDNOVA backend.

```text
                 EDNOVA SERVER
                      │
              Authoritative API
                      │
        ┌─────────────┼─────────────┐
        │             │             │
       WEB          MOBILE       OTHER CLIENTS
        │             │
        │       ┌─────┼─────┬─────┐
        │       │     │     │     │
        │   PRINCIPAL STAFF STUDENT PARENT
        │
        └──────────────┬──────────────┘
                       │
                  EDNOVA DB
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
