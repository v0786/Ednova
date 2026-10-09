-- Ensure one daily attendance row per student per school/day, preventing duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_attendance_school_student_date
ON daily_attendance (school_id, student_id, date);
