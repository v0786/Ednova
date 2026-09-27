# EDNOVA — Institutional Management & Intelligence Platform

## 1. Overview
EDNOVA is a production-grade, multi-tenant on-premise operational management platform for schools and colleges built on Next.js 16 (React 19, TypeScript 5, TailwindCSS v4) and PostgreSQL with Row-Level Security (RLS).

---

## 2. Documentation Architecture

```text
docs/
│
├── core/                                    # Six Core Foundation Documents
│   ├── 01_EDNOVA_ARCHITECTURE.md            # Technical Architecture
│   ├── 02_EDNOVA_PRODUCT_SPECIFICATION.md   # Product Scope & Rules
│   ├── 03_EDNOVA_SECURITY_AND_AUTHORIZATION.md # Security & Authorization Boundary
│   ├── 04_EDNOVA_IMPLEMENTATION_ROADMAP.md  # Development Sequence & Milestones
│   ├── 05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md# On-Premise Deployment & Operations
│   └── 06_EDNOVA_AI_AND_FUTURE_SYSTEM.md    # AI Gateway & Intelligence System
│
├── mobile/                                  # Mobile Client Documentation System
│   ├── MOBILE_ARCHITECTURE.md               # Single App Architecture Strategy
│   ├── MOBILE_DESIGN_SYSTEM.md              # UI/UX & Accessibility Specifications
│   ├── MOBILE_SCREEN_MAP.md                 # Role Workspaces & Screen Maps
│   ├── MOBILE_IMPLEMENTATION.md             # Native App Config & Integration Specs
│   ├── MOBILE_GAP_ANALYSIS.md               # Mobile Capabilities Matrix
│   └── MOBILE_PHASE_4_REPORT.md             # Phase 4 Implementation Report
│
├── additional/                              # Phase Implementation & Gap Reports
│   ├── BACKEND_GAP_ANALYSIS.md
│   ├── BACKEND_IMPLEMENTATION_REPORT.md
│   ├── DEPLOYMENT_GAP_ANALYSIS.md
│   ├── PHASE_2_DEPLOYMENT_IMPLEMENTATION_REPORT.md
│   ├── WEB_IMPLEMENTATION_GAP_ANALYSIS.md
│   ├── PHASE_3_WEB_IMPLEMENTATION_REPORT.md
│   ├── FRONTEND_IMPLEMENTATION_REPORT.md
│   └── EDNOVA_CURRENT_STATE.md
│
└── archive/                                 # Historical Documentation Archive
```

---

## 3. Quick Start & On-Premise Deployment

### Hardware Preflight Check
```bash
./scripts/preflight.sh
```

### Start Docker Stack
```bash
docker compose up -d --build
```

### Automated System Backup
```bash
./scripts/backup.sh
```
