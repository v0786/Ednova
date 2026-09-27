-- ============================================================
-- EDNOVA COMPREHENSIVE DOMAIN MIGRATION (Phase 02)
-- Architecture: Multi-tenant, RLS-enforced, Audit-enabled
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUM TYPES
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'STUDENT', 'PARENT', 'SECURITY_STAFF');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE attendance_status AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'EXCUSED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gate_event_type AS ENUM ('ENTRY', 'EXIT', 'VISITOR_CHECKIN', 'VISITOR_CHECKOUT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID,
    actor_id UUID,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id UUID,
    payload JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SCHOOL SAFETY GATE EVENTS TABLE
CREATE TABLE IF NOT EXISTS security_gate_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    person_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    person_type VARCHAR(50) NOT NULL, -- STUDENT, STAFF, VISITOR
    person_name VARCHAR(255) NOT NULL,
    event_type gate_event_type NOT NULL,
    gate_identifier VARCHAR(100) DEFAULT 'MAIN_GATE',
    recorded_by UUID REFERENCES profiles(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT
);

-- 3. PARENT-STUDENT RELATIONSHIPS TABLE
CREATE TABLE IF NOT EXISTS parent_student_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) DEFAULT 'GUARDIAN', -- FATHER, MOTHER, GUARDIAN
    is_primary_contact BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, parent_id, student_id)
);

-- INDEXES FOR OPERATIONAL PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_audit_school_actor ON audit_logs(school_id, actor_id);
CREATE INDEX IF NOT EXISTS idx_gate_events_school_timestamp ON security_gate_events(school_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_parent_student_link ON parent_student_relationships(parent_id, student_id);

-- RLS POLICIES FOR GATE AND RELATIONSHIPS
ALTER TABLE security_gate_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_student_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY gate_school_isolation ON security_gate_events
    FOR ALL USING (school_id = get_user_school_id());

CREATE POLICY parent_relationship_isolation ON parent_student_relationships
    FOR ALL USING (school_id = get_user_school_id());
