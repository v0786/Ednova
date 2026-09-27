-- ============================================================
-- EDNOVA COLLEGE ACADEMIC STRUCTURE MIGRATION
-- Task: EDNOVA-016
-- ============================================================

-- DEPARTMENTS TABLE
CREATE TABLE IF NOT EXISTS college_departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    head_of_department_id UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_dept_code UNIQUE (school_id, code)
);

-- PROGRAMS TABLE (e.g. B.Tech Computer Science, B.Sc Physics)
CREATE TABLE IF NOT EXISTS college_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES college_departments(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    total_semesters INT NOT NULL DEFAULT 8,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_program_code UNIQUE (school_id, code)
);

-- SEMESTERS TABLE
CREATE TABLE IF NOT EXISTS college_semesters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES college_programs(id) ON DELETE CASCADE,
    semester_number INT NOT NULL CHECK (semester_number > 0),
    title VARCHAR(50) NOT NULL, -- e.g. "Semester 1", "Fall 2026"
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_semester_num UNIQUE (school_id, program_id, semester_number)
);

-- SECTIONS / BATCHES TABLE
CREATE TABLE IF NOT EXISTS college_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES college_semesters(id) ON DELETE CASCADE,
    section_name VARCHAR(20) NOT NULL, -- e.g. "Section A"
    max_capacity INT DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE college_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE college_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY dept_school_isolation ON college_departments FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY prog_school_isolation ON college_programs FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY sem_school_isolation ON college_semesters FOR ALL USING (school_id = get_user_school_id());
CREATE POLICY sec_school_isolation ON college_sections FOR ALL USING (school_id = get_user_school_id());
