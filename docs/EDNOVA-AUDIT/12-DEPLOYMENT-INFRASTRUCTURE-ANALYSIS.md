# 12 — DEPLOYMENT & INFRASTRUCTURE ANALYSIS

## 1. Executive Summary
This document analyzes the deployment architecture, container configuration, helper scripts, and infrastructure management components of EDNOVA based on `docs/core/05_EDNOVA_DEPLOYMENT_AND_OPERATIONS.md`, `docker-compose.yml`, `app/Dockerfile`, and `scripts/`.

---

## 2. Infrastructure Specifications

### Target On-Premise System Requirements
- **OS**: Linux (Ubuntu 22.04 LTS / RHEL 9 recommended).
- **CPU**: Minimum 2 Cores (4 Cores recommended for >1000 users).
- **RAM**: Minimum 4GB (8GB recommended).
- **Storage**: Minimum 20GB free space.
- **Runtime**: Docker Engine 24+ with Docker Compose v2.

---

## 3. Docker Containerization Stack (`docker-compose.yml`)

```yaml
version: '3.8'

services:
  ednova-app:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: ednova_app_server
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_SUPABASE_URL=http://ednova-database:5432
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=ednova-production-anon-key-placeholder
      - SUPABASE_SERVICE_ROLE_KEY=ednova-production-service-key-placeholder
      - EDNOVA_SERVER_IDENTITY=sch-server-onpremise-001
    depends_on:
      - ednova-database
    volumes:
      - ednova_storage:/app/storage

  ednova-database:
    image: postgres:15-alpine
    container_name: ednova_postgres_db
    restart: always
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ednova_db
      - POSTGRES_USER=ednova_admin
      - POSTGRES_PASSWORD=ednova_secure_password_2026
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./app/supabase/schema.sql:/docker-entrypoint-initdb.d/01_schema.sql
```

---

## 4. Executable Operations Scripts

### 1. Hardware Preflight Check (`scripts/preflight.sh`)
- Checks Linux kernel, CPU core count, available RAM, and disk space before starting containers.

### 2. Automated Database Backup Engine (`scripts/backup.sh`)
- Dumps PostgreSQL database using `pg_dump`, compresses into a `.tar.gz` archive, and logs backup metadata.

### 3. Disaster Recovery Restore Engine (`scripts/restore.sh`)
- Extracts `.tar.gz` backup archive and restores PostgreSQL schema and data.

---

## 5. Inconsistencies & Deployment Audit Findings

1. **Docker Compose Init Script Scope**:
   - `docker-compose.yml` mounts `./app/supabase/schema.sql` to `/docker-entrypoint-initdb.d/01_schema.sql`.
   - **Finding**: Migration files `02_` through `11_` in `app/supabase/migrations/` are NOT automatically mounted in `docker-compose.yml`.
   - **Impact**: Initializing a fresh database via Docker Compose loads `schema.sql` but omits migration tables (`attendance_correction_requests`, `audit_events`, `academic_assessments`, etc.).
   - **Recommendation**: Concatenate or mount all migration files in `/docker-entrypoint-initdb.d/`.

2. **Placeholder Supabase Keys**:
   - `docker-compose.yml` contains placeholder keys (`ednova-production-anon-key-placeholder`).
   - Must be configured with real environment variables prior to production launch.
