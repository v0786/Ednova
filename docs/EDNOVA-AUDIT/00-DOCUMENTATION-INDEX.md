# 00 — DOCUMENTATION INDEX & INVENTORY

## 1. Executive Summary
This document provides a comprehensive inventory of all documentation files found in the EDNOVA repository (`/home/devpc/Documents/Default Project/Ednova`). Files are cataloged, categorized, and evaluated for currency, purpose, dependencies, and conflicts.

---

## 2. Directory Structure Overview
Documentation in EDNOVA exists in two main root locations (`docs/` and `doc/`), with `doc/` serving as a historical or parallel copy of early phase reports. Active specifications are maintained under `docs/`.

```text
docs/
├── core/                                    # Six Core Foundation Specifications
│   ├── 01_EDNOVA_ARCHITECTURE.md
│   ├── 02_EDNOVA_PRODUCT_SPECIFICATION.md
│   ├── 03_EDNOVA_SECURITY_AND_AUTHORIZATION.md
│   ├── 04_EDNOVA_IMPLEMENTATION_ROADMAP.md
│   ├── 05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md
│   └── 06_EDNOVA_AI_AND_FUTURE_SYSTEM.md
│
├── mobile/                                  # Mobile Client Specifications & Workspaces (18 files)
│   ├── MOBILE_ARCHITECTURE.md
│   ├── MOBILE_AUTHENTICATION_AND_SESSION.md
│   ├── MOBILE_DESIGN_SYSTEM.md
│   ├── MOBILE_SCREEN_MAP.md
│   ├── MOBILE_IMPLEMENTATION.md
│   ├── MOBILE_GAP_ANALYSIS.md
│   ├── MOBILE_QA_MATRIX.md
│   ├── MOBILE_OFFLINE_AND_ERROR_RECOVERY.md
│   ├── MOBILE_SECURITY_HARDENING.md
│   ├── MOBILE_SECURITY_WORKSPACE.md
│   ├── MOBILE_STAFF_ADMIN_WORKSPACE.md
│   ├── MOBILE_TEACHER_WORKSPACE.md
│   ├── MOBILE_STUDENT_WORKSPACE.md (in Phase 5 report)
│   ├── MOBILE_PARENT_WORKSPACE.md
│   ├── MOBILE_PRINCIPAL_WORKSPACE.md
│   ├── MOBILE_PUSH_NOTIFICATIONS.md
│   ├── MOBILE_AI_INTEGRATION.md
│   ├── MOBILE_PRODUCTION_RELEASE.md
│   └── PHASE_5_IMPLEMENTATION_PLAN.md
│
├── additional/                              # Gap Analyses & Implementation Reports (24 files)
│   ├── EDNOVA_CURRENT_STATE.md
│   ├── BACKEND_GAP_ANALYSIS.md
│   ├── BACKEND_CONTRACT_VERIFICATION.md
│   ├── BACKEND_IMPLEMENTATION_REPORT.md
│   ├── FRONTEND_IMPLEMENTATION_REPORT.md
│   ├── WEB_IMPLEMENTATION_GAP_ANALYSIS.md
│   ├── RESPONSIVE_WEB_UX_IMPLEMENTATION.md
│   ├── RESPONSIVE_WEB_UX_IMPLEMENTATION_REPORT.md
│   ├── DEPLOYMENT_GAP_ANALYSIS.md
│   ├── DOCUMENTATION_INTEGRITY_AUDIT.md
│   ├── DOCUMENTATION_INFORMATION_LOSS_AUDIT.md
│   ├── PHASE_2_DEPLOYMENT_IMPLEMENTATION_REPORT.md
│   ├── PHASE_3_WEB_IMPLEMENTATION_REPORT.md
│   ├── PHASE_4_MOBILE_IMPLEMENTATION_REPORT.md
│   ├── PHASE_4_MOBILE_COMPLETION_REPORT.md
│   ├── PHASE_5_1_MOBILE_SHELL_REPORT.md
│   ├── PHASE_5_2_AUTHENTICATION_IMPLEMENTATION_REPORT.md
│   ├── PHASE_5_3_SHARED_MOBILE_INFRASTRUCTURE_IMPLEMENTATION_REPORT.md
│   ├── PHASE_5_4_STUDENT_WORKSPACE_IMPLEMENTATION_REPORT.md
│   ├── PHASE_5_5_PARENT_WORKSPACE_IMPLEMENTATION_REPORT.md
│   ├── PHASE_5_6_5_7_IMPLEMENTATION_REPORT.md
│   ├── PHASE_5_8_5_9_5_10_IMPLEMENTATION_REPORT.md
│   └── PHASE_5_11_5_15_FINAL_IMPLEMENTATION_REPORT.md
│
└── archive/                                 # Historical Documentation Archive (12 files)
    ├── 01_PRODUCT_AND_REQUIREMENTS.md
    ├── 02_ARCHITECTURE_SECURITY.md
    ├── 03_DOMAIN_DATABASE_API.md
    ├── 04_UX_APPLICATIONS.md
    ├── 05_DEVELOPMENT_QA_OPERATIONS.md
    ├── 06_MASTER_PLAN_AND_TASKS.md
    ├── DEPLOYMENT_GUIDE.md
    ├── MOBILE_DESIGN_BACKEND_GAPS.md
    ├── MOBILE_DESIGN_SYSTEM.md
    ├── MOBILE_IMPLEMENTATION.md
    ├── MOBILE_SCREEN_MAP.md
    └── SINGLE_MOBILE_APP_ARCHITECTURE.md
```

---

## 3. Inventory & Classification Table

| Filename | Path | Document Type | Apparent Purpose | Version / Date | Status | Currentness | Conflicts Identified |
|---|---|---|---|---|---|---|---|
| `README.md` | `/README.md` | DEPLOYMENT / OVERVIEW | Project entry point, quickstart, overview | Current | Active | CURRENT | None |
| `01_EDNOVA_ARCHITECTURE.md` | `docs/core/` | ARCHITECTURE | Core technical architecture & single mobile app strategy | Current | Active | CURRENT | Phrasing vs legacy 4 mobile apps |
| `02_EDNOVA_PRODUCT_SPECIFICATION.md` | `docs/core/` | PRODUCT | Core product boundaries, roles, academic structures | Current | Active | CURRENT | Roles: 8 vs 10 roles |
| `03_EDNOVA_SECURITY_AND_AUTHORIZATION.md` | `docs/core/` | SECURITY | Security authority, 4-layer model, RLS rules | Current | Active | CURRENT | None |
| `04_EDNOVA_IMPLEMENTATION_ROADMAP.md` | `docs/core/` | ROADMAP | Master sequence & deliverables summary | Current | Active | CURRENT | Phase 5 status claims |
| `05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md` | `docs/core/` | DEPLOYMENT | On-premise deployment specs & script mappings | Current | Active | CURRENT | None |
| `06_EDNOVA_AI_AND_FUTURE_SYSTEM.md` | `docs/core/` | ARCHITECTURE / AI | AI Gateway context security & capabilities | Current | Active | CURRENT | AI active vs MVP Exclusion |
| `MOBILE_ARCHITECTURE.md` | `docs/mobile/` | MOBILE / ARCH | Single Mobile App architecture strategy | Phase 4/5 | Active | CURRENT | None |
| `MOBILE_DESIGN_SYSTEM.md` | `docs/mobile/` | MOBILE / UI | Mobile design tokens, components, status badges | Phase 4 | Active | CURRENT | None |
| `MOBILE_SCREEN_MAP.md` | `docs/mobile/` | MOBILE / UX | Role workspace screens & navigation map | Phase 4 | Active | CURRENT | None |
| `MOBILE_IMPLEMENTATION.md` | `docs/mobile/` | MOBILE / CODE | Cross-platform app setup & client SDK integration | Phase 4 | Active | CURRENT | Wording: "4 apps" vs 1 app |
| `EDNOVA_CURRENT_STATE.md` | `docs/additional/` | IMPLEMENTATION REPORT | Factual status audit of codebase & database | Current | Active | CURRENT | Claims 85% completion |
| `BACKEND_GAP_ANALYSIS.md` | `docs/additional/` | GAP ANALYSIS | Coverage matrix for backend server actions | Phase 1 | Active | CURRENT | None |
| `BACKEND_CONTRACT_VERIFICATION.md` | `docs/additional/` | CONTRACT / API | TypeScript interface verification against schema | Phase 1 | Active | CURRENT | None |
| `DOCUMENTATION_INTEGRITY_AUDIT.md` | `docs/additional/` | AUDIT | Integrity audit of paths & documentation structure | Current | Active | CURRENT | None |
| `DOCUMENTATION_INFORMATION_LOSS_AUDIT.md` | `docs/additional/` | AUDIT | Audit comparing archived vs core documents | Current | Active | CURRENT | None |
| `01_PRODUCT_AND_REQUIREMENTS.md` | `docs/archive/` | PRODUCT | Original product vision & domain definitions | Historical | Archived | HISTORICAL | Lists LMS as future scope |
| `02_ARCHITECTURE_SECURITY.md` | `docs/archive/` | SECURITY | Original security model & server guidelines | Historical | Archived | HISTORICAL | None |
| `03_DOMAIN_DATABASE_API.md` | `docs/archive/` | DATABASE | Original entity definitions & schema planning | Historical | Archived | HISTORICAL | Table name differences |
| `04_UX_APPLICATIONS.md` | `docs/archive/` | UI/UX | Early UX layout specs for web & mobile | Historical | Archived | HISTORICAL | Route path differences |
| `05_DEVELOPMENT_QA_OPERATIONS.md` | `docs/archive/` | TESTING / DEPLOY | Early test & deployment strategies | Historical | Archived | HISTORICAL | None |
| `06_MASTER_PLAN_AND_TASKS.md` | `docs/archive/` | PROJECT MANAGEMENT | Granular task list (TASK-001 through TASK-014) | Historical | Archived | HISTORICAL | None |

---

## 4. Documentation Authority Hierarchy
1. **Core Foundation Specs** (`docs/core/*`): Primary authority for product vision, architecture, security, and deployment.
2. **Current Implementation Code & Schema** (`app/src/*`, `app/supabase/migrations/*`): Primary authority for actual working state.
3. **Mobile Suite Specs** (`docs/mobile/*`): Primary authority for mobile SDK and workspace design.
4. **Additional & Gap Reports** (`docs/additional/*`): Secondary verification and current state assessments.
5. **Archive** (`docs/archive/*`): Historical reference only; superseded by core and schema.
