-- ============================================================
-- EDNOVA FEEDBACK & INCIDENT MANAGEMENT SYSTEM (Phase 10 & 11)
-- Architecture: Multi-tenant, Confidentiality Levels, Immutable Audit Logs
-- ============================================================

DO $$ BEGIN
    CREATE TYPE feedback_category AS ENUM (
        'SUGGESTION', 'COMPLAINT', 'QUESTION', 'ACADEMIC_CONCERN',
        'SAFETY_CONCERN', 'FACILITY_ISSUE', 'STAFF_CONCERN',
        'BULLYING_HARASSMENT', 'TRANSPORT_CONCERN', 'SECURITY_CONCERN', 'GENERAL'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE feedback_confidentiality AS ENUM ('NORMAL', 'CONFIDENTIAL', 'RESTRICTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE feedback_status AS ENUM (
        'SUBMITTED', 'ACKNOWLEDGED', 'UNDER_REVIEW', 'ASSIGNED',
        'IN_PROGRESS', 'WAITING_FOR_INFORMATION', 'RESOLVED', 'CLOSED', 'REOPENED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE incident_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS feedback_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category feedback_category NOT NULL DEFAULT 'GENERAL',
    confidentiality feedback_confidentiality NOT NULL DEFAULT 'NORMAL',
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    location VARCHAR(150),
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    status feedback_status NOT NULL DEFAULT 'SUBMITTED',
    assigned_to UUID REFERENCES profiles(id),
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. INCIDENTS TABLE
CREATE TABLE IF NOT EXISTS incident_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- SAFETY, SECURITY, FACILITY, EMERGENCY
    severity incident_severity NOT NULL DEFAULT 'MEDIUM',
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150),
    evidence_urls JSONB DEFAULT '[]'::jsonb,
    assigned_investigator UUID REFERENCES profiles(id),
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN', -- OPEN, INVESTIGATING, RESOLVED, CLOSED
    resolution_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 3. INCIDENT TIMELINE AUDIT HISTORY TABLE ("What Actually Happened")
CREATE TABLE IF NOT EXISTS incident_timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    incident_id UUID NOT NULL REFERENCES incident_records(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL REFERENCES profiles(id),
    event_type VARCHAR(50) NOT NULL, -- REPORTED, ACKNOWLEDGED, INVESTIGATOR_ASSIGNED, EVIDENCE_ADDED, RESOLVED
    summary TEXT NOT NULL,
    is_ai_generated BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR INCIDENT & FEEDBACK QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_feedback_school_status ON feedback_records(school_id, status);
CREATE INDEX IF NOT EXISTS idx_incidents_school_severity ON incident_records(school_id, severity, status);
CREATE INDEX IF NOT EXISTS idx_timeline_incident ON incident_timeline_events(incident_id, timestamp ASC);

-- RLS SECURITY POLICIES
ALTER TABLE feedback_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_timeline_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY feedback_school_isolation ON feedback_records
    FOR ALL USING (school_id = get_user_school_id());

CREATE POLICY incident_school_isolation ON incident_records
    FOR ALL USING (school_id = get_user_school_id());

CREATE POLICY timeline_isolation ON incident_timeline_events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM incident_records ir
            WHERE ir.id = incident_id AND ir.school_id = get_user_school_id()
        )
    );
