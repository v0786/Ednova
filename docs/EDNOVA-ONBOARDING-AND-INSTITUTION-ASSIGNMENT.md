# EDNOVA — Onboarding & Institution Assignment Architecture

## Executive Summary
This document specifies the architecture, state transitions, security controls, and workflow specifications for the **EDNOVA Onboarding and Institution Assignment System**. 

The fundamental architectural principle of EDNOVA is the **strict separation between Account Registration and Institution Membership**. A user can register an EDNOVA identity without belonging to a school. Normal users **cannot** self-assign a school or select an administrative role. Institution creation and membership assignment are reserved strictly for a **Verified Principal**.

---

## 1. Core Architecture Principles

1. **Identity vs Membership Decoupling**:
   - Creating an account (`ACCOUNT_CREATED`) does NOT create a school membership.
   - Initial user state: `schoolId: null`, `role: null`, `status: PENDING_SCHOOL_ASSIGNMENT`.

2. **Principal Authority Boundary**:
   - A normal registration flow cannot create a Principal account.
   - Principal onboarding requires Google Identity -> Basic Account -> **Mobile OTP Verification** (`PRINCIPAL_VERIFIED`).
   - Only a verified Principal can create an institution and assign roles/memberships.

3. **Resumable Institution Setup**:
   - Progressive wizard state (`DRAFT` -> `SETUP` -> `ACTIVE`).
   - Progress percentage calculated dynamically across Profile, Academic Year, Classes/Sections, Subjects, Teachers, Students, and Assignments.

4. **Multi-Tenant Security Discipline**:
   - All server actions enforce `verifyServerSession()` and `validateTenantAccess()`.
   - Never trust client-provided `school_id`, `role`, or `membership_id`.

---

## 2. User State Machine

```text
[ Registration ]
       │
       ▼
ACCOUNT_CREATED ────────── (Waiting for Principal Assignment)
(schoolId: null, role: null)
       │
       ├─────────────────────────────────┐
       │ (Direct Principal Assignment)   │ (Invitation Code + Approval)
       ▼                                 ▼
SCHOOL_ASSIGNED                   MEMBERSHIP_REQUEST (PENDING)
       │                                 │
       ▼                                 ▼
 ROLE_ASSIGNED ────────────────────► ACTIVE (Full Workspace Access)
```

### Principal Registration Lifecycle

```text
Google Identity ──► Basic Account ──► Mobile OTP Request ──► OTP Verification ──► PRINCIPAL_VERIFIED ──► Create Institution ──► ACTIVE
```

---

## 3. Server Actions API Specifications

### `registerNormalUser(input)`
Registers an EDNOVA identity.
- Enforces `schoolId: null`, `role: null`, `status: ACCOUNT_CREATED`.

### `requestPrincipalMobileOtp(mobileNumber)`
Sends 6-digit OTP code to registered mobile phone.
- Rate-limited to max 3 attempts per 10 minutes.
- 5-minute expiration window.

### `verifyPrincipalMobileOtp(input)`
Validates OTP code server-side and upgrades user state to `PRINCIPAL_VERIFIED`.

### `createInstitutionByPrincipal(input)`
Generates unique human-readable code (e.g. `EDN-MH-MUM-RQ2JO`) and initializes setup at 25% progress.

### `updateInstitutionSetupProgress(institutionId, step, updates)`
Persists step configuration dynamically without losing partial progress.

### `assignUserToInstitution(input)`
Authorized Principal assigns user to target institution with specified role, class, section, and subjects.

---

## 4. Verification & Test Metrics

- **Master Acceptance Test Suite**: 54 / 54 scenarios passed (100.0% success rate).
- **Next.js Production Build**: `npm run build` compiled 43/43 routes with 0 errors.
