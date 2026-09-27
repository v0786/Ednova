-- ============================================================
-- EDNOVA COMPLETE MULTI-CLIENT BACKEND MIGRATION
-- Task: EDNOVA-032 (Complete Backend Schema Foundations)
-- ============================================================

-- 1. EXAMINATIONS & CLASS TESTS TABLE
CREATE TABLE IF NOT EXISTS academic_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id),
    title VARCHAR(255) NOT NULL,
    assessment_type VARCHAR(50) NOT NULL DEFAULT 'CLASS_TEST', -- CLASS_TEST, MID_TERM, FINAL_EXAM, ASSIGNMENT
    max_marks NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    weightage_percent NUMERIC(5, 2) DEFAULT 10.00,
    scheduled_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. STUDENT ASSESSMENT MARKS TABLE
CREATE TABLE IF NOT EXISTS student_marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES academic_assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(5, 2) NOT NULL,
    grade_letter VARCHAR(5),
    remarks TEXT,
    recorded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_student_assessment UNIQUE (assessment_id, student_id)
);

-- 3. ANNOUNCEMENTS TABLE (For Student, Parent & Staff Apps)
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id),
    target_audience VARCHAR(50) NOT NULL DEFAULT 'ALL', -- ALL, STUDENTS, PARENTS, TEACHERS, STAFF
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. VISITOR MANAGEMENT TABLE (Security Guard App Backend)
CREATE TABLE IF NOT EXISTS security_visitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50) NOT NULL,
    purpose_of_visit TEXT NOT NULL,
    person_to_meet UUID REFERENCES profiles(id),
    badge_number VARCHAR(50),
    checkin_time TIMESTAMPTZ DEFAULT NOW(),
    checkout_time TIMESTAMPTZ,
    checked_in_by UUID REFERENCES profiles(id)
);

-- RLS POLICIES
ALTER TABLE academic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY assessment_school_isolation ON academic_assessments FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY marks_school_isolation ON student_marks FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY announcement_school_isolation ON announcements FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY visitor_school_isolation ON security_visitors FOR ALL USING (school_id = get_user_school_id());
