-- ============================================================
-- EDNOVA TIMETABLE & CALENDAR MIGRATION
-- ============================================================

CREATE TABLE IF NOT EXISTS timetable_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    division_id UUID NOT NULL REFERENCES divisions(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1=Monday, 7=Sunday
    period_number INT NOT NULL CHECK (period_number > 0),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- CONSTRAINTS: Prevent teacher or division slot double-booking
    CONSTRAINT unique_division_period UNIQUE (school_id, academic_year_id, division_id, day_of_week, period_number),
    CONSTRAINT unique_teacher_period UNIQUE (school_id, academic_year_id, teacher_id, day_of_week, period_number)
);

CREATE TABLE IF NOT EXISTS academic_calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('HOLIDAY', 'EXAM', 'EVENT', 'HALF_DAY')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX IF NOT EXISTS idx_timetable_division ON timetable_entries(division_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_timetable_teacher ON timetable_entries(teacher_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_calendar_school_date ON academic_calendar_events(school_id, start_date);

-- RLS POLICIES
ALTER TABLE timetable_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY timetable_school_isolation ON timetable_entries
    FOR ALL USING (school_id = get_user_school_id());

CREATE POLICY calendar_school_isolation ON academic_calendar_events
    FOR ALL USING (school_id = get_user_school_id());
