-- ============================================================
-- EDNOVA ATTENDANCE & CORRECTION AUDIT MIGRATION
-- ============================================================

-- ATTENDANCE CORRECTION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS attendance_correction_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    attendance_id UUID NOT NULL REFERENCES daily_attendance(id) ON DELETE CASCADE,
    requested_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    original_status attendance_status NOT NULL,
    requested_status attendance_status NOT NULL,
    reason TEXT NOT NULL,
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    reviewed_by UUID REFERENCES profiles(id),
    review_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- INDEXES FOR ATTENDANCE PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_attendance_school_date_div ON daily_attendance(school_id, date, division_id);
CREATE INDEX IF NOT EXISTS idx_attendance_student_date ON daily_attendance(student_id, date);
CREATE INDEX IF NOT EXISTS idx_correction_status ON attendance_correction_requests(school_id, approval_status);

-- RLS POLICIES FOR CORRECTION REQUESTS
ALTER TABLE attendance_correction_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY correction_school_isolation ON attendance_correction_requests
    FOR ALL USING (school_id = get_user_school_id());
