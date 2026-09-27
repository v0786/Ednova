-- ============================================================
-- EDNOVA SECURITY GATE OPERATIONS MIGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS security_gate_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('STUDENT', 'STAFF', 'VISITOR')),
    person_identifier VARCHAR(100) NOT NULL, -- Student Roll / Staff ID / Visitor Badge
    person_name VARCHAR(255) NOT NULL,
    event_type VARCHAR(30) NOT NULL CHECK (event_type IN ('ENTRY', 'EXIT', 'VISITOR_CHECKIN', 'VISITOR_CHECKOUT')),
    gate_name VARCHAR(50) DEFAULT 'MAIN_GATE',
    notes TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_gate_logs_school_time ON security_gate_logs(school_id, timestamp DESC);

ALTER TABLE security_gate_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY gate_logs_school_isolation ON security_gate_logs
    FOR ALL USING (school_id = get_user_school_id());
