# EDNOVA Mobile Authentication & Session Specification

## 1. Authentication Strategy

> **Login determines identity. Permissions determine capability.**

EDNOVA Mobile relies on the authoritative EDNOVA backend for authentication. No password hashing or authentication logic is handled locally on the client.

```text
APPLICATION START
      │
      ▼
CHECK STORED SESSION
      │
 ┌────┴────┐
 │         │
NO       EXISTS
 │         │
 ▼         ▼
LOGIN   VALIDATE
 │         │
 ▼         ▼
AUTHENTICATE
      │
      ▼
CREATE SESSION
      │
      ▼
STORE SECURELY
      │
      ▼
RESOLVE USER → ROLE → WORKSPACE
```

---

## 2. Session Lifecycle States

| Auth State | Description | Next Action |
|---|---|---|
| `UNAUTHENTICATED` | No valid session stored or user logged out. | Display Login Screen. |
| `CHECKING_SESSION` | Application startup session restoration check. | Render Splash / Loading Spinner. |
| `AUTHENTICATING` | Credentials submitted to backend authentication API. | Show Progress / Disable Button. |
| `AUTHENTICATED` | Active session verified; role resolved. | Route to Dynamic Role Workspace. |
| `SESSION_EXPIRED` | Backend returns 401 or token expired. | Clear Credentials & Prompt Re-Login. |
| `UNAUTHORIZED` | User attempted access to unauthorized resource. | Display Security Alert. |
| `OFFLINE` | No network connection available. | Display Offline Banner. |
| `MAINTENANCE` | System in maintenance mode. | Display Maintenance Screen. |

---

## 3. Platform Secure Storage
- **Android**: `EncryptedSharedPreferences` via Master Key API.
- **iOS**: iOS Keychain Services (`kSecClassGenericPassword`).
- Plaintext storage (`localStorage`, plain files, raw SQLite) is strictly prohibited for authentication tokens.

---

## 4. Parent & Teacher Security Boundaries
- **Parent Boundary**: Parent sessions contain `parentId`. Lookups for children are validated backend server-side via `parent_student_relationships`.
- **Teacher Boundary**: Teacher sessions are restricted by backend assigned classes and subjects.
