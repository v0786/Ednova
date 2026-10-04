# 17 — SOURCE OF TRUTH DIRECTORY

## 1. Executive Summary
This document establishes the official **Single Source of Truth (SSOT)** rules for EDNOVA across all product, architectural, database, security, API, UI, mobile, testing, and deployment domains.

---

## 2. Master Source of Truth Authority Matrix

| Domain Topic | Official Source of Truth File / Path | Precedence Tier | Conflict Resolution Rule |
|---|---|:---:|---|
| **Product Purpose & Scope** | `docs/core/02_EDNOVA_PRODUCT_SPECIFICATION.md` | Tier 1 (Spec) | Overrides archived files and generic prompt descriptions. Confirms non-LMS boundary. |
| **System Architecture** | `docs/core/01_EDNOVA_ARCHITECTURE.md` | Tier 1 (Spec) | Establishes single mobile app & multi-tenant server architecture. |
| **Security & RLS Rules** | `docs/core/03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` & `app/src/lib/auth/rbacGuard.ts` | Tier 1 (Code & Security) | Backend Server Actions and PostgreSQL RLS policies take precedence over UI. |
| **Database Schema** | `app/supabase/schema.sql` & `app/supabase/migrations/02_` to `11_` | Tier 1 (DB Schema) | Physical SQL schema files take precedence over documentation diagrams. |
| **API & Server Actions** | `app/src/lib/actions/*.ts` | Tier 1 (Code) | Executable TypeScript action interfaces take precedence over markdown API tables. |
| **UI Design & Workspaces** | `docs/mobile/MOBILE_DESIGN_SYSTEM.md` & `app/src/app/*` | Tier 2 (UI Code & Spec) | Defines dark theme tokens and touch-target minimums (44px). |
| **Mobile Architecture** | `docs/mobile/MOBILE_ARCHITECTURE.md` & `app/src/lib/mobileClientSdk.ts` | Tier 1 (Code & Spec) | Confirms single mobile app codebase (`mobile-core`) with dynamic workspace resolution. |
| **Deployment & Container Stack**| `docs/core/05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md`, `docker-compose.yml`, `scripts/` | Tier 1 (Ops Code) | Executable bash scripts and Docker Compose file take precedence over deployment text. |

---

## 3. Conflict Resolution Hierarchy Rules

When a contradiction is encountered during development or maintenance, apply the following order of precedence:

```text
       TIER 1: Physical Executable Code & Database Migrations
       (app/src/lib/auth/rbacGuard.ts, app/supabase/migrations/*.sql, app/src/lib/actions/*.ts)
                                  │
                                  ▼
       TIER 2: Active Core Specifications
       (docs/core/01_ through 06_, docs/mobile/MOBILE_ARCHITECTURE.md)
                                  │
                                  ▼
       TIER 3: Additional Implementation Reports
       (docs/additional/EDNOVA_CURRENT_STATE.md, BACKEND_GAP_ANALYSIS.md)
                                  │
                                  ▼
       TIER 4: Historical Archive Files
       (docs/archive/*)
```

1. **Code vs Documentation**: Physical database migrations and TypeScript server guards are authoritative for runtime behavior.
2. **Core Specs vs Archive**: `docs/core/*` supersedes `docs/archive/*` and `doc/*`.
3. **Security Authority**: Server-side guards in `rbacGuard.ts` and RLS policies in PostgreSQL override any client-side UI logic.
