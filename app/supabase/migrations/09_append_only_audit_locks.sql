-- ============================================================
-- EDNOVA APPEND-ONLY AUDIT LOGGING & TRIGGER LOCKS MIGRATION
-- Task: EDNOVA-017
-- ============================================================

-- APPEND-ONLY AUDIT TRAIL TABLE
CREATE TABLE IF NOT EXISTS audit_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES profiles(id),
    actor_role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- PREVENT UPDATE OR DELETE ON AUDIT_EVENTS
CREATE OR REPLACE FUNCTION prevent_audit_tampering()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'TAMPER_ERROR: Audit logs are append-only. Modification or deletion is prohibited by security policy.';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_prevent_audit_update_delete ON audit_events;

CREATE TRIGGER trg_prevent_audit_update_delete
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_audit_tampering();

-- RLS Isolation
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY audit_school_isolation ON audit_events FOR ALL USING (school_id = get_user_school_id());
