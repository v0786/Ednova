# EDNOVA — Deployment & Operations Specification

## 1. On-Premise System Requirements
- **OS**: Linux Kernel (Ubuntu 22.04 LTS / RHEL 9 recommended).
- **CPU**: Minimum 2 CPU Cores (4 Cores recommended for >1000 users).
- **RAM**: Minimum 4GB RAM (8GB RAM recommended).
- **Storage**: Minimum 20GB free space.

---

## 2. Executable Infrastructure Scripts & Configs

| Script / Config | Location | Function |
|---|---|---|
| **Preflight System Check** | [`scripts/preflight.sh`](file:///home/devpc/Projects/EDNOVA/scripts/preflight.sh) | Hardware checklist (CPU, RAM, Disk). |
| **Docker Compose Engine** | [`docker-compose.yml`](file:///home/devpc/Projects/EDNOVA/docker-compose.yml) | Multi-container setup (`ednova_app_server`, `ednova_postgres_db`). |
| **App Containerfile** | [`app/Dockerfile`](file:///home/devpc/Projects/EDNOVA/app/Dockerfile) | Multi-stage Node 20 standalone runner build. |
| **Automated Backup Engine** | [`scripts/backup.sh`](file:///home/devpc/Projects/EDNOVA/scripts/backup.sh) | Encrypted DB, attachments, & metadata exporter. |
| **Disaster Recovery Restore** | [`scripts/restore.sh`](file:///home/devpc/Projects/EDNOVA/scripts/restore.sh) | Tarball restoration engine. |
| **Health Diagnostics API** | [`healthActions.ts`](file:///home/devpc/Projects/EDNOVA/app/src/lib/actions/healthActions.ts) | System health diagnostics server action. |
| **Maintenance Toggle Action**| [`maintenanceActions.ts`](file:///home/devpc/Projects/EDNOVA/app/src/lib/actions/maintenanceActions.ts) | Controlled system maintenance mode toggle. |
| **Backup Management Action**| [`backupActions.ts`](file:///home/devpc/Projects/EDNOVA/app/src/lib/actions/backupActions.ts) | Admin panel UI backup execution trigger. |
