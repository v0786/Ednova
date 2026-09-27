-- ============================================================
-- EDNOVA CANONICAL ROLES & PERMISSION MATRIX MIGRATION
-- Task: EDNOVA-031 (Backend Foundation Alignment)
-- ============================================================

-- 1. UPDATE USER_ROLE ENUM WITH ALL 8 CANONICAL ROLES
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'PLATFORM_OWNER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'INSTITUTION_OWNER';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'ADMIN_STAFF';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'SECURITY_GUARD';

-- 2. NOTIFICATIONS ENGINE SCHEMAS (EDNOVA-018)
CREATE TABLE IF NOT EXISTS notification_queues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('IN_APP', 'PUSH', 'EMAIL', 'SMS', 'WHATSAPP')),
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    payload JSONB DEFAULT '{}'::jsonb,
    delivery_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (delivery_status IN ('PENDING', 'SENT', 'FAILED', 'RETRY')),
    retry_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

-- 3. SECURE FILE METADATA & SIGNED ACCESS LOGS (EDNOVA-019)
CREATE TABLE IF NOT EXISTS file_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    is_malware_scanned BOOLEAN DEFAULT TRUE,
    access_permission_role VARCHAR(50) DEFAULT 'NORMAL',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Isolation
ALTER TABLE notification_queues ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY notif_school_isolation ON notification_queues FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY file_school_isolation ON file_attachments FOR ALL USING (school_id = get_user_school_id());
