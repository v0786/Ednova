# EDNOVA — Deployment & On-Premise Infrastructure Gap Analysis

## 1. Current State Assessment

| Component | Status | Location | Notes |
|---|---|---|---|
| **Docker Containerization** | MISSING | `deploy/` | Needs multi-container Docker Compose setup (`ednova-app`, `postgres`, `storage`). |
| **System Preflight Checklist** | MISSING | `scripts/preflight.sh` | Needs OS, RAM (min 8GB), Disk (min 50GB), CPU, PostgreSQL check script. |
| **On-Premise Installer** | MISSING | `scripts/install.sh` | Needs single-command automated installer for school servers. |
| **Database Initializer & Migrations** | PARTIALLY IMPLEMENTED | `app/supabase/migrations/` | Migrations 01-11 exist; needs automated runner script. |
| **Backup Infrastructure** | MISSING | `scripts/backup.sh`, `lib/actions/backupActions.ts` | Needs automated DB, file, and metadata tarball exporter. |
| **Restore & Disaster Recovery** | MISSING | `scripts/restore.sh`, `lib/actions/backupActions.ts` | Needs verification and restore runner. |
| **Health Check Endpoint** | PARTIALLY IMPLEMENTED | `app/src/app/admin/system-health/page.tsx` | UI exists; needs full backend health status server action. |
| **System Maintenance Mode** | MISSING | `app/src/lib/actions/maintenanceActions.ts` | Needs maintenance state toggle guard. |
| **Cryptographic License Activator** | IMPLEMENTED | `app/src/lib/actions/licenseActions.ts` | License key verifier exists; needs server identity binding. |

---

## 2. Phase 2 Target Deliverables Architecture

```text
               ON-PREMISE SCHOOL / COLLEGE SERVER
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   [ scripts/install.sh ]               [ scripts/preflight.sh ]
   (Automated Installer)                (CPU/RAM/Disk System Check)
            │
            ├──────────────► [ docker-compose.yml ]
            │                ├── App (Next.js Node Container)
            │                ├── Database (PostgreSQL + RLS Schema)
            │                └── Storage (Persistent Local Files)
            │
            ├──────────────► [ scripts/backup.sh & restore.sh ]
            │                (Automated DB & Storage Tarball Backups)
            │
            └──────────────► [ app/src/lib/actions/ ]
                             ├── backupActions.ts (Backup/Restore API)
                             ├── healthActions.ts (System Health Diagnostics)
                             └── maintenanceActions.ts (Maintenance Mode)
```
