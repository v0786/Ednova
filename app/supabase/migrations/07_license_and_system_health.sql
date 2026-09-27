-- ============================================================
-- EDNOVA LICENSE ACTIVATION & ON-PREMISE DEPLOYMENT MIGRATION
-- Task: EDNOVA-015
-- ============================================================

CREATE TABLE IF NOT EXISTS deployment_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    license_key VARCHAR(255) UNIQUE NOT NULL,
    activation_signature TEXT NOT NULL,
    issuer VARCHAR(100) NOT NULL DEFAULT 'EDNOVA Central License Authority',
    licensed_to_name VARCHAR(255) NOT NULL,
    max_students INT NOT NULL DEFAULT 1000,
    max_staff INT NOT NULL DEFAULT 100,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_verified_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SYSTEM HEALTH SNAPSHOTS TABLE (EDNOVA-028)
CREATE TABLE IF NOT EXISTS system_health_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    database_status VARCHAR(20) NOT NULL DEFAULT 'HEALTHY',
    storage_status VARCHAR(20) NOT NULL DEFAULT 'HEALTHY',
    ai_status VARCHAR(20) NOT NULL DEFAULT 'HEALTHY',
    api_status VARCHAR(20) NOT NULL DEFAULT 'HEALTHY',
    disk_free_gb NUMERIC(6, 2) NOT NULL,
    last_backup_at TIMESTAMPTZ,
    license_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Isolation
ALTER TABLE deployment_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY license_school_isolation ON deployment_licenses
    FOR ALL USING (school_id = get_user_school_id());

CREATE POLICY health_school_isolation ON system_health_snapshots
    FOR ALL USING (school_id = get_user_school_id());
