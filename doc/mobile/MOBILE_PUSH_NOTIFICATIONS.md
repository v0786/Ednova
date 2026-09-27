# EDNOVA Mobile Push Notification Integration Specification

## 1. Overview
The mobile notification infrastructure handles device token registration, payload normalization, category payload handling (`ATTENDANCE`, `ASSESSMENT`, `INCIDENT`, `ANNOUNCEMENT`), and role-aware deep link target resolution via `EdnovaMobileClient`.

---

## 2. Notification Flow & Security Boundary
```text
Backend Event Trigger
        │
        ▼
Role & Scope Verification
        │
        ▼
APNS / FCM Payload Generation
        │
        ▼
Device Push Receipt
        │
        ▼
Deep Link Execution -> Re-validates Auth & RLS Context -> Workspace View
```

- **Deep Link Security Guard**: Deep links never bypass authentication. Navigating via a deep link triggers a session check and RLS authorization verification prior to displaying target data.
- **Token Registration**: Device tokens are registered via `registerPushDeviceToken()` and associated with the authenticated session `userId`. Token cleanup is executed automatically on session logout.
