# User Journeys

| Field | Value |
|---|---|
| Document ID | EDD-003 |
| Version | 1.0 |
| Status | DRAFT |
| Owner | TBD |
| Created Date | 2026-09-21 |
| Last Updated | 2026-09-21 |
| Review Date | TBD |
| Related Documents | TBD |

---

## Journey 1: Teacher Takes Daily Attendance

| Field | Details |
|---|---|
| Journey ID | J-01 |
| User Persona | Michael - Class Teacher (P-02) |
| Goal | Record daily attendance for the class accurately in under 2 minutes and trigger notifications for absent students |

### Steps

1. **Login**: Teacher logs into EDNOVA on classroom tablet at the start of the day
2. **Navigate**: Teacher selects "Attendance" from the main navigation and chooses today's date and current class section
3. **View Roster**: System displays the class student roster with default "Present" status pre-selected for all students
4. **Mark Exceptions**: Teacher marks 2 students as "Absent" and 1 as "Late (15 min)" by tapping on student cards
5. **Add Note**: Teacher adds a note to the Late student: "Parents notified traffic delay"
6. **Verify & Submit**: Teacher reviews the attendance summary (34 Present, 2 Absent, 1 Late) and clicks "Submit"
7. **Confirm**: System confirms successful save and displays confirmation toast
8. **Auto-Notify**: System automatically sends attendance notification to parents of the 2 Absent and 1 Late student via in-app notification and optional SMS
9. **Sync**: Attendance data is immediately visible on school admin dashboards and parent portals

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1 | Login screen | Web/Tablet App |
| 2 | Attendance module navigation | Web/Tablet App |
| 3 | Student roster grid | Web/Tablet App |
| 4-5 | Status marking and note entry | Web/Tablet App |
| 6-7 | Submit button + confirmation | Web/Tablet App |
| 8 | Parent attendance alert | Mobile App Push / SMS |
| 9 | Admin dashboard + Parent portal | Web App + Mobile App |

### Pain Points

- Paper registers require manual tallying and separate data entry for reporting
- No automated parent notification means absences go unreported for hours or days
- Late arrivals are not consistently tracked or flagged
- Admin cannot see attendance data until the register is physically returned to the office

### Opportunities

- Enable voice-assisted attendance marking or AI photo-based attendance for even faster capture
- Trigger automated follow-up workflows for students with recurring absences (e.g., 3+ absences = flag to counselor)
- Predict chronic absenteeism patterns using historical data
- Integrate attendance with automatic student check-in via RFID or ID card scan

---

## Journey 2: Student Submits Assignment

| Field | Details |
|---|---|
| Journey ID | J-02 |
| User Persona | Alex - Student (P-04) |
| Goal | Submit a completed assignment before the deadline and receive confirmation of submission |

### Steps

1. **Login**: Student opens EDNOVA mobile app while on the school bus ride home
2. **Dashboard**: Dashboard shows "3 assignments due this week" with one highlighted "Due Tomorrow: Math Chapter 5 Problem Set"
3. **Open Assignment**: Student taps the highlighted card and views assignment details (description, rubric, attachment, deadline 23:59 tonight)
4. **Complete Work**: Student completes the assignment offline using a tablet and saves the PDF file
5. **Return to App**: Later that evening, student re-opens the app from a home laptop to ensure stable connection
6. **Upload**: Student clicks "Upload Submission," selects the PDF file, adds a text note: "Completed all questions, please see page 3 for diagram in Q7"
7. **Preview & Confirm**: Student previews the uploaded file to confirm correct document, clicks "Submit Assignment"
8. **Receipt**: System displays submission confirmation with timestamp, submission ID, and acknowledgment "Your assignment has been submitted successfully. You may revise before the deadline."
9. **Notification**: Student receives push notification on phone confirming submission, with a reminder that revisions are accepted until the deadline

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1-2 | Mobile app login + dashboard with due-now prompts | Mobile App |
| 3 | Assignment detail view | Mobile App |
| 4 | Offline work (external tools) | Student device |
| 5-7 | Upload flow on web app | Web App (Laptop) |
| 8 | Submission confirmation screen | Web App |
| 9 | Submission push notification | Mobile App Push |

### Pain Points

- Forgetting assignment deadlines when only communicated verbally in class
- Losing printed assignment sheets or having illegible instructions
- Submitting via email attachments that may go to spam or lack confirmation
- No record of exactly when an assignment was submitted (disputes about lateness)
- Cannot revise submissions even if deadline has not passed

### Opportunities

- Enable offline assignment download and submission synchronization when connectivity returns
- Provide AI-powered due date reminders via push notification (48h, 24h, 2h before deadline)
- Allow draft submissions with auto-save so students don't lose work in progress
- Support peer review workflows for eligible assignments

---

## Journey 3: Teacher Grades and Returns Assignment

| Field | Details |
|---|---|
| Journey ID | J-03 |
| User Persona | Priya - Subject Teacher (P-03) |
| Goal | Grade a batch of student submissions efficiently with rubric-aligned feedback and return grades to students and parents |

### Steps

1. **Login**: Teacher opens EDNOVA after school on home laptop
2. **Grade Queue**: Dashboard shows "12 submissions awaiting grading: Math Chapter 5 (Class 8A)"
3. **Open Grading View**: Teacher clicks the card and enters the grading interface, with rubric pre-loaded on the left and first student submission displayed inline (PDF viewer)
4. **Grade Submission 1**: Teacher evaluates against rubric (3 criteria, 10 marks each), enters scores: 9/10, 8/10, 10/10, total 27/30. Adds inline comment: "Excellent approach on Q5"
5. **Next Student**: Teacher clicks "Next" and the system auto-saves, loads the next student submission; repeats for 12 submissions over 45 minutes
6. **Bulk Publish**: After grading the last student, teacher sees summary showing 12 graded, 0 ungraded
7. **Review & Release**: Teacher reviews class score distribution (min 18, max 29, avg 24), adjusts one borderline grade, then clicks "Publish All"
8. **Notify**: System publishes grades to all students simultaneously, sends in-app notifications to all 12 students and their parents, and logs the publication event
9. **Record**: All grades are automatically written to the class grade book and subject performance dashboard

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1-2 | Login + dashboard grading queue | Web App (Laptop) |
| 3-5 | Inline grading interface with rubric | Web App |
| 6-7 | Summary + publish action | Web App |
| 8 | Grade published notification to students + parents | Mobile App Push / In-App |
| 9 | Grade book auto-update | Backend + Admin Dashboard |

### Pain Points

- Collecting physical papers and manually recording grades into spreadsheets takes hours
- No rubric integration means inconsistent grading across students
- Returning papers physically means students may lose them; parents never see detailed feedback
- Separate systems for grading and grade books require double data entry
- No visibility into grading progress for department heads or exam coordinators

### Opportunities

- AI-assisted grading for objective question types (MCQ, fill-in-blank) with human review
- Grading analytics to detect pattern biases across sections or teachers
- Grade moderation workflow with second marker for high-stakes assessments
- Parent-accessible feedback comments alongside grades to support home learning

---

## Journey 4: Parent Views Child Progress Report

| Field | Details |
|---|---|
| Journey ID | J-04 |
| User Persona | Elena - Parent (P-05) |
| Goal | Understand child's current academic standing, attendance pattern, and areas for concern between formal report periods |

### Steps

1. **Notification**: Parent receives push notification: "Mid-term progress report available for your child" while at work
2. **Open App**: Parent opens EDNOVA mobile app during a break and authenticates
3. **Child Dashboard**: Parent lands on child dashboard showing: Attendance 92% (below class average 96%), Overall Academics: B+ (top 35% of class)
4. **Deep Dive - Attendance**: Parent taps "Attendance" tile, sees timeline of 4 absences (3 sick, 1 unexcused on date 2026-09-15) and chart trend showing declining attendance last 2 weeks
5. **Deep Dive - Academics**: Parent taps "Academics" tile, sees per-subject breakdown: Math B, English A-, Science A, History C+
6. **Low Score Alert**: History C+ is flagged "below target"; parent taps it and sees recent assignment scores, noting 2 assignments submitted late with 50% penalty each
7. **Teacher Message**: Parent taps "Contact Class Teacher" button, writes message: "Concerned about History grade and 9/15 unexcused absence. Available for call this evening?"
8. **Send & Confirm**: Message is sent to class teacher with attached context (attendance and grade summary); parent receives delivery confirmation
9. **Follow-up**: Teacher responds within 2 hours; the conversation thread remains accessible in the app with full history

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1 | Progress report available push notification | Mobile App Push |
| 2-3 | Login + child summary dashboard | Mobile App |
| 4-6 | Attendance timeline + per-subject breakdown | Mobile App |
| 7-8 | In-app messaging to teacher with context | Mobile App |
| 9 | Two-way message thread | Mobile App + Teacher Web App |

### Pain Points

- Only receiving report cards twice a year, missing early warning signs
- No way to distinguish between a child's performance and class norms
- Contacting teachers is indirect (via child, school office, or unstructured WhatsApp)
- Difficulty understanding context behind a grade (which assignments, which topics)
- No correlation between attendance trends and academic performance

### Opportunities

- AI-powered early warning system identifying at-risk students (attendance drop + grade drop pattern)
- Push notifications when assignment is graded with score below TBD threshold
- Suggested talking points for parent-teacher conversations based on child's data
- Comparison benchmarks: how child compares to own past performance, class average, grade-level standard
- Integration with calendar to schedule parent-teacher conferences directly from the portal

---

## Journey 5: Student Takes Online Exam

| Field | Details |
|---|---|
| Journey ID | J-05 |
| User Persona | Alex - Student (P-04) |
| Goal | Complete a scheduled online exam within the allowed time window, with confidence that responses are saved and submitted correctly |

### Steps

1. **Scheduled Reminder**: Student receives push notification at 8:00 AM: "Math Midterm exam window opens at 9:00 AM. Duration: 60 minutes. Ensure stable connection."
2. **Pre-exam Check**: Student opens EDNOVA on school laptop 10 minutes before start; exam card shows "Exam opens in 8 minutes"; student verifies camera (if enabled) and network connectivity via system check
3. **Enter Exam**: At 9:00 AM, the "Start Exam" button activates; student clicks it, reads and accepts exam conduct rules, enters the exam
4. **Auto-save Responses**: Student answers MCQ questions and types essay responses; system auto-saves every TBD seconds; timer counts down from 60:00 in the header
5. **Flag for Review**: Student flags question 12 for later review; moves through remaining questions
6. **Network Blip**: Student's Wi-Fi disconnects briefly; system shows "Offline mode - responses cached locally"
7. **Reconnect**: Network returns after 90 seconds; system syncs cached responses automatically and shows "All responses saved" confirmation
8. **Review & Submit**: With 5 minutes remaining, student reviews flagged question 12, changes the answer, then clicks "Submit Exam"; system shows summary of all attempted questions, confirms 24/25 answered, student confirms final submission
9. **Confirmation**: System displays exam completion screen: "Exam submitted successfully. Your responses have been recorded. Results will be published on 2026-09-25 by 16:00."

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1 | Exam pre-reminder push notification | Mobile App Push |
| 2 | Exam entry card with system check | Web App (Laptop) |
| 3 | Exam rules acknowledgement + exam entry | Web App |
| 4, 6, 7 | Auto-save indicator + offline mode banner | Web App |
| 5, 8 | Question navigation + flag for review + submit flow | Web App |
| 9 | Submission confirmation screen | Web App |

### Pain Points

- Printed exam papers can be lost or require manual distribution logistics
- No auto-save in many online exam tools means lost work on browser crash
- Cannot review or revise answers easily with paper exams
- Offline interruptions during online exams cause anxiety and lost responses
- No clear confirmation that responses were actually received by the system

### Opportunities

- AI proctoring hints (window switch detection, copy-paste prevention) with flag for teacher review (not automatic claims of cheating)
- Question-level time analytics for teachers to identify excessively easy or difficult items
- Accommodation profiles (extra time, screen reader support, font size) for students with documented needs
- Post-exam immediate availability of correct answers and explanations for low-stakes formative assessments

---

## Journey 6: Admin Onboards New School Year / Classes

| Field | Details |
|---|---|
| Journey ID | J-06 |
| User Persona | Sarah - School Admin (P-01) + David - Platform Admin (P-06) |
| Goal | Configure the academic year, set up classes and sections, and enroll students and teachers for the upcoming school term |

### Steps

1. **Initiate**: 2 weeks before term start, Platform Admin logs in and navigates to "Academic Year Setup"
2. **Create Year**: Creates new academic year 2026-2027 with term dates (Semester 1: Sep 2026 - Jan 2027; Semester 2: Feb 2027 - Jun 2027), holiday calendar imported via CSV
3. **School Template**: Applies school-level defaults (attendance time windows, grade scale, subject offerings per grade level)
4. **Bulk Import Users**: Platform Admin uploads CSV file containing 600 students (with grade level, parent contact info) and 45 teachers; system validates records, flags 8 errors (duplicate emails, missing parent data), admin fixes and re-uploads
5. **Class Structure**: School Admin creates class sections per grade: Grade 6 (4 sections: A, B, C, D), Grade 7 (4 sections), ..., Grade 12 (3 sections each for Science/Commerce/Humanities)
6. **Assign Homeroom Teachers**: School Admin assigns 1 homeroom teacher per class section (bulk assign from dropdowns)
7. **Assign Subject Teachers**: School Admin assigns subject teachers per section-subject (e.g., 8A-Math → Priya, 8B-Math → John); system validates no teacher has more than TBD sections per term
8. **Enroll Students**: Platform Admin runs bulk enrollment: assigns Grade 6 students to 6A/6B/6C/6D via round-robin distribution (or house system TBD)
9. **Verify & Go-Live**: School Admin reviews dashboards: 600 students, 45 teachers, 32 class sections, 0 unassigned. Sends welcome email/SMS to all users with login instructions. Academic year marked as "Active."

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1-3 | Academic year configuration wizard | Web App (Admin Console) |
| 4 | CSV upload with validation + error report | Web App |
| 5-7 | Class section + teacher assignment grids | Web App |
| 8 | Bulk enrollment job with progress bar | Web App |
| 9 | Verification dashboard + bulk welcome communication trigger | Web App |

### Pain Points

- Manual class creation and student enrollment in spreadsheets takes weeks
- No validation of teacher workload during assignment leads to over-scheduling conflicts
- Duplicate user records and missing data fields create ongoing cleanup issues
- No automated welcome communication; IT team spends days resetting first-login passwords
- No rollback capability if enrollment is configured incorrectly after go-live

### Opportunities

- AI-assisted student class balancing (maintain gender ratio, academic distribution, IEP needs per section)
- Previous year structure cloning with delta updates (reuse classes, promote students to next grade)
- Integration with student admissions/enquiry module for seamless new student onboarding
- Automatic welcome email/SMS with self-service password reset link, reducing IT support tickets

---

## Journey 7: Teacher Creates and Schedules Exam

| Field | Details |
|---|---|
| Journey ID | J-07 |
| User Persona | Priya - Subject Teacher (P-03) |
| Goal | Create an exam paper from the question bank, set a schedule window, and publish it to one or more class sections |

### Steps

1. **Navigate**: Teacher opens Exam module, clicks "Create New Exam"
2. **Basic Info**: Enters exam name "Mathematics - Chapter 5 Quiz", selects subject "Math", class sections 8A and 8B, exam type "Formative Quiz"
3. **Set Schedule**: Sets date window: 2026-09-28 09:00 - 2026-09-28 11:00, duration 45 minutes, "Single attempt", "Auto-submit on timeout"
4. **Build Question Paper**: Clicks "Add Questions from Question Bank"; filters by subject=Math, chapter=5, difficulty=Easy/Medium/Hard, tags=algebra; system shows question pool with preview
5. **Select Questions**: Selects 15 MCQ (1 mark each), 3 Short Answer (5 marks each), 1 Long Answer (10 marks); total 40 marks; system validates syllabus coverage map
6. **Randomization**: Enables "Shuffle question order per student" and "Shuffle MCQ option order" to reduce cheating risk
7. **Configure Settings**: Sets: allow calculator = Yes, allow back navigation = Yes, auto-save interval = 30 seconds; proctoring hints = window-switch flagging enabled
8. **Review & Approve**: Previews student view of the exam; clicks "Submit for Approval" to Exam Coordinator (Rachel)
9. **Publish**: Exam Coordinator reviews and approves; exam moves to "Scheduled" status; system sends calendar invite and 48h pre-reminder push notification to all students in 8A/8B

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 1-3 | Exam creation wizard (basic info + schedule) | Web App |
| 4-5 | Question bank browser + paper builder | Web App |
| 6-7 | Exam configuration settings panel | Web App |
| 8 | Preview + approval workflow trigger | Web App |
| 9 | Exam Coordinator approval + student calendar invites | Web App + Mobile App Push |

### Pain Points

- Writing exam papers from scratch each time is repetitive and inconsistent across sections
- No question difficulty tagging means papers are too easy or too hard accidentally
- Scheduling conflicts with other exams discovered too late (e.g., same time window for 2 subjects)
- Printing and distributing physical exam papers is costly and risks leaks
- No automated proctoring hints even for basic red flags (window navigation, copy-paste)

### Opportunities

- AI-assisted question paper generation based on syllabus blueprint (difficulty distribution, topic coverage)
- Schedule conflict detection: warn if target sections have another exam within TBD hours
- Question usage analytics to identify overused or poorly performing questions (discrimination index)
- Collaborative exam authoring with shared drafts among subject department teachers
- Exam paper versioning and rollback for last-minute corrections before publishing

---

## Journey 8: Admin Generates Compliance Report

| Field | Details |
|---|---|
| Journey ID | J-08 |
| User Persona | Sarah - School Admin (P-01) |
| Goal | Generate a government-required compliance report (attendance, enrollment, academic performance) in the prescribed format without manual data compilation |

### Steps

1. **Trigger**: School Admin receives email reminder: "Regional Education Board Annual Compliance Report due 2026-10-15"
2. **Navigate**: Admin logs into EDNOVA, opens Reports module, selects "Compliance Reports"
3. **Select Template**: Chooses template "Annual Enrollment & Attendance Report - Region X, Format 2026" (system has pre-built jurisdiction-specific templates)
4. **Set Parameters**: Sets reporting period: Academic Year 2025-2026 (full year), all grade levels, all sections
5. **Generate Preview**: System runs report query; after TBD seconds, displays on-screen preview with summary numbers: 580 students enrolled (avg 96.2% attendance), 14 students with >10% absenteeism, 100% teacher qualification compliance
6. **Validate Data**: Admin drills into 14 high-absenteeism students to confirm accuracy, adjusts one incorrectly coded attendance record, refreshes report
7. **Export**: Selects export format = PDF (official submission) + XLSX (working copy), clicks "Export"
8. **Download & Verify**: System generates files, provides download link; Admin opens PDF, verifies formatting matches the government template exactly (header, tables, page breaks, signature block)
9. **Submit & Log**: Admin submits PDF to the education board portal; returns to EDNOVA, marks the report as "Submitted" with date and reference ID; event logged in audit trail with admin user ID and timestamp

### Touchpoints

| # | Touchpoint | Channel |
|---|---|---|
| 2-3 | Report module + compliance template catalog | Web App (Admin Console) |
| 4-5 | Parameter selection + report preview with drill-down | Web App |
| 6 | Data correction + report refresh | Web App |
| 7-8 | Export dialog + PDF/XLSX download | Web App |
| 9 | Report submission logging + audit trail | Web App (Backend) |

### Pain Points

- Compiling reports manually from multiple spreadsheets and paper registers takes 1-2 weeks
- Formatting reports to match exact government template requirements takes additional days
- Inconsistent data definitions across sources lead to re-submissions and penalty risks
- No audit trail of who generated what version of a report and when
- Historical reports stored as files on shared drives with no search or version control

### Opportunities

- Template marketplace: community-contributed regional compliance templates (moderated)
- Scheduled report generation with auto-delivery to specific admin users on recurring cadence
- Direct API integration with government education portals for one-click submission (where supported)
- Version history and comparison of report revisions over time
- AI-powered data validation flags potentially anomalous numbers before submission (unusually high/low attendance, enrollment mismatches)
