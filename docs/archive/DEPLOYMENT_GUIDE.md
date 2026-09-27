# EDNOVA — On-Premise Installation & Operational Deployment Guide

## 1. Hardware & System Requirements
- **Operating System**: Linux Kernel (Ubuntu 22.04 LTS or RHEL 9 recommended).
- **CPU**: Minimum 2 CPU Cores (4 Cores recommended for >1000 students).
- **RAM**: Minimum 4GB RAM (8GB RAM recommended).
- **Storage**: Minimum 20GB free disk space.
- **Runtimes**: Docker 24+ & Docker Compose v2.

---

## 2. Quick On-Premise Installation

1. **Clone or Extract Archive**:
   ```bash
   cd /home/devpc/Projects/EDNOVA
   ```

2. **Execute Hardware Preflight Check**:
   ```bash
   ./scripts/preflight.sh
   ```

3. **Start On-Premise Stack with Docker Compose**:
   ```bash
   docker compose up -d --build
   ```

---

## 3. Backup, Disaster Recovery & Maintenance

1. **Create Full System Backup (Database, Files, Metadata)**:
   ```bash
   ./scripts/backup.sh
   ```

2. **Restore System from Backup Archive**:
   ```bash
   ./scripts/restore.sh /path/to/ednova_backup_TIMESTAMP.tar.gz
   ```

3. **Check System Health Status**:
   Call server action `getSystemHealthDiagnostics()` or visit `/admin/system-health`.
