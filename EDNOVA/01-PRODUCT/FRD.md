# Functional Requirements Document (FRD)

| Field | Value |
|-------|-------|
| **Document ID** | EDP-002 |
| **Version** | 1.0 |
| **Status** | DRAFT |
| **Owner** | TBD |
| **Created Date** | 2026-09-21 |
| **Last Updated** | 2026-09-21 |
| **Review Date** | TBD |
| **Related Documents** | EDP-001 (BRD), TBD |

---

## 1. Purpose

This Functional Requirements Document (FRD) defines the detailed functional requirements for the EDNOVA Education Management Information System. It decomposes the business requirements documented in EDP-001 (BRD) into module-specific functional requirements with clear descriptions, priorities, and traceability to source requirements. This document serves as the basis for system design, development, and acceptance testing.

## 2. Scope

This FRD covers the functional requirements for all core modules of the EDNOVA platform: Tenant & School Management, User & RBAC, Student Information, Class & Section, Attendance, Daily Academics, Assignments, Exams & Assessment, Learning Content, Library, Communication, Reports & Analytics, Finance (Optional), and Parent Portal.

The requirements are structured at a summary-to-medium detail level. Specific behaviors requiring further analysis are marked as TBD. Detailed interface specifications, data models, and technical design are outside the scope of this document and will be covered in the SRS (EDP-003) and technical design documents.

## 3. System Overview

EDNOVA is a multi-tenant SaaS platform combining Student Information System (SIS) and Learning Management System (LMS) capabilities for K-12 educational institutions. The system serves five primary user roles: School Admin, Teacher, Student, Parent, and IT Admin (platform-level). All modules operate within a shared-nothing multi-tenant architecture ensuring complete data isolation between tenant schools.

## 4. Functional Requirements by Module

### 4.1 Tenant & School Management

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-TSM-001 | IT Admin shall be able to create new tenant/school instances with unique identifiers, names, and base configurations. | Must | BRD BR-FR-01 |
| FR-TSM-002 | System shall enforce complete logical data isolation between tenants such that no tenant can access another tenant's data under any conditions. | Must | BRD BR-FR-01 |
| FR-TSM-003 | IT Admin shall be able to configure tenant-level settings including time zone, date formats, currency (TBD), language defaults, and regional settings. | Must | BRD BR-FR-02 |
| FR-TSM-004 | School Admin shall be able to configure school-specific branding including name, logo, color scheme, and banner within limits defined by the platform. | Should | BRD BR-FR-02 |
| FR-TSM-005 | IT Admin shall be able to deactivate, suspend, or permanently delete tenant instances with appropriate safeguards (TBD: data retention and deletion procedures). | Must | BRD BR-FR-01 |
| FR-TSM-006 | School Admin shall be able to configure academic year structure including terms, semesters, quarters, grading periods, and holiday calendars. | Must | BRD BR-FR-02 |
| FR-TSM-007 | School Admin shall be able to configure tenant-level grading scales, grade bands, and GPA calculation rules (TBD: calculation formula details). | Should | BRD BR-FR-02 |
| FR-TSM-008 | System shall provide tenant-level audit logs capturing all administrative configuration changes with timestamps and user attribution. | Must | BRD BR-NFR-06 |
| FR-TSM-009 | IT Admin shall be able to view tenant subscription status, usage metrics, and apply feature toggles per tenant (TBD: feature toggle framework). | Could | BRD BR-FR-01 |
| FR-TSM-010 | School Admin shall be able to manage school-level custom fields for student profiles, class records, and other entities (TBD: field type constraints). | Could | BRD BR-FR-02 |

### 4.2 User & RBAC

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-URB-001 | System shall support five core user roles: School Admin, Teacher, Student, Parent, and IT Admin with role-specific permission sets. | Must | BRD BR-FR-14 |
| FR-URB-002 | School Admin shall be able to create, read, update, and deactivate user accounts for their tenant (excluding IT Admin accounts). | Must | BRD BR-FR-14 |
| FR-URB-003 | System shall implement Role-Based Access Control (RBAC) where permissions are assigned to roles and roles are assigned to users. | Must | BRD BR-FR-14 |
| FR-URB-004 | School Admin shall be able to create custom roles with permission subsets of the standard five roles (TBD: permission granularity level). | Should | BRD BR-FR-14 |
| FR-URB-005 | System shall support user account self-registration for parents and students with admin approval workflow (TBD: approval rules). | Should | BRD BR-FR-14 |
| FR-URB-006 | System shall enforce secure password policies including minimum length, complexity requirements, and expiration (TBD: specific policy values). | Must | BRD BR-NFR-02 |
| FR-URB-007 | System shall support password reset via email or SMS verification (TBD: SMS provider integration). | Must | BRD BR-NFR-02 |
| FR-URB-008 | System shall track user login history including timestamp, IP address, device info, and login success/failure status. | Must | BRD BR-NFR-06 |
| FR-URB-009 | System shall support multi-factor authentication (MFA) as an optional user-level and admin-mandated feature (TBD: MFA methods). | Should | BRD BR-NFR-02 |
| FR-URB-010 | School Admin shall be able to batch import users via CSV template with data validation and error reporting. | Should | BRD BR-FR-03 |
| FR-URB-011 | System shall support linking parent accounts to one or multiple student accounts with relationship type specification. | Must | BRD BR-FR-13 |
| FR-URB-012 | System shall automatically disable user access after configurable period of inactivity (TBD: default inactivity period). | Could | BRD BR-NFR-02 |

### 4.3 Student Information

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-STU-001 | School Admin shall be able to create and maintain student records including personal demographics, contact information, and emergency contacts. | Must | BRD BR-FR-03 |
| FR-STU-002 | System shall support student enrollment workflow including academic year, class, section, and subject allocation. | Must | BRD BR-FR-03 |
| FR-STU-003 | School Admin shall be able to manage student admissions status pipeline (TBD: admissions stages and workflows). | Should | BRD BR-FR-03 |
| FR-STU-004 | System shall maintain complete student academic history across academic years including grades, attendance summaries, and achievements. | Must | BRD BR-FR-03 |
| FR-STU-005 | School Admin shall be able to batch import student records via CSV with validation and duplicate detection (TBD: matching rules). | Must | BRD BR-FR-03 |
| FR-STU-006 | System shall support student status management (active, inactive, withdrawn, transferred, graduated, suspended). | Must | BRD BR-FR-03 |
| FR-STU-007 | School Admin shall be able to generate student ID cards with barcode/QR code and customizable templates (TBD: template engine). | Could | BRD BR-FR-03 |
| FR-STU-008 | Student and Parent users shall be able to view and update limited profile information with admin approval (TBD: editable fields list). | Should | BRD BR-FR-03 |
| FR-STU-009 | System shall support student document upload and management (e.g., birth certificate, medical records) with role-based access controls. | Should | BRD BR-FR-03 |
| FR-STU-010 | System shall support configurable student categories and tags (e.g., scholarship, special needs, honors) for filtering and reporting. | Could | BRD BR-FR-03 |

### 4.4 Class & Section

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-CLS-001 | School Admin shall be able to create and manage classes (grade levels) and sections within each academic year. | Must | BRD BR-FR-04 |
| FR-CLS-002 | School Admin shall be able to assign class teachers, subject teachers, and students to specific sections. | Must | BRD BR-FR-04 |
| FR-CLS-003 | System shall support subject and curriculum configuration per class/section including teaching hours and syllabus mapping. | Must | BRD BR-FR-04 |
| FR-CLS-004 | School Admin shall be able to manage timetable creation including period structure, subject allocation, and teacher assignment (TBD: automated scheduling). | Should | BRD BR-FR-06 |
| FR-CLS-005 | Teachers shall be able to view and filter class rosters with student profiles for their assigned sections. | Must | BRD BR-FR-04 |
| FR-CLS-006 | School Admin shall be able to manage student transfers between sections within the same academic year with audit trail. | Should | BRD BR-FR-03 |
| FR-CLS-007 | System shall support section-level subject electives and optional course selection workflows (TBD: elective management). | Could | BRD BR-FR-04 |

### 4.5 Attendance

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-ATT-001 | Teachers shall be able to record daily or period-wise attendance for their assigned sections with configurable attendance codes (Present, Absent, Late, Excused, TBD). | Must | BRD BR-FR-05 |
| FR-ATT-002 | System shall validate attendance entries and prevent duplicate or conflicting attendance records. | Must | BRD BR-FR-05 |
| FR-ATT-003 | School Admin shall be able to define custom attendance codes, working days, and attendance rules (e.g., minimum attendance percentage thresholds). | Must | BRD BR-FR-05 |
| FR-ATT-004 | System shall automatically send attendance notifications to parents via in-app notification and optional email/SMS when student is marked absent or late (TBD: notification rules and timing). | Should | BRD BR-FR-05 |
| FR-ATT-005 | School Admin and Teachers shall be able to generate attendance reports by student, class, section, date range, and attendance code. | Must | BRD BR-FR-12 |
| FR-ATT-006 | Teachers shall be able to take attendance with a quick "mark all present" default and individual override capability. | Should | BRD BR-FR-05 |
| FR-ATT-007 | System shall support attendance correction workflow with teacher submission and admin approval for backdated changes. | Should | BRD BR-FR-05 |
| FR-ATT-008 | System shall calculate student attendance percentages and flag students falling below configurable thresholds (TBD: threshold values and escalation). | Must | BRD BR-FR-05 |
| FR-ATT-009 | School Admin shall be able to import bulk attendance from external devices/systems via CSV (TBD: biometric device integration). | Could | BRD BR-FR-05 |
| FR-ATT-010 | Parents shall be able to view their child's full attendance history with statistics and calendar visualization. | Must | BRD BR-FR-13 |

### 4.6 Daily Academics

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-ACA-001 | Teachers shall be able to create and manage lesson plans linked to syllabus topics, subjects, and classes. | Should | BRD BR-FR-06 |
| FR-ACA-002 | School Admin shall be able to configure syllabus structure including units, topics, learning outcomes, and estimated teaching hours per subject/class. | Must | BRD BR-FR-06 |
| FR-ACA-003 | Teachers shall be able to track syllabus completion progress against planned topics with percentage completion visualization. | Should | BRD BR-FR-06 |
| FR-ACA-004 | Teachers shall be able to log daily teaching activities including topics covered, resources used, and homework assigned (TBD: log template structure). | Could | BRD BR-FR-06 |
| FR-ACA-005 | School Admin shall be able to create and manage academic calendars with school events, holidays, exam periods, and parent-teacher meeting schedules. | Must | BRD BR-FR-06 |
| FR-ACA-006 | All users shall be able to view their personalized timetable with class schedule, subjects, teachers, and room assignments. | Must | BRD BR-FR-04 |

### 4.7 Assignments

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-ASM-001 | Teachers shall be able to create assignments with title, description, attachments, due date/time, maximum marks, and linked subject/topic. | Must | BRD BR-FR-07 |
| FR-ASM-002 | System shall support different assignment types: file upload submission, text response, online quiz (TBD: quiz engine details), and offline submission marking. | Should | BRD BR-FR-07 |
| FR-ASM-003 | Students shall be able to view, download attachments, and submit assignments before the due date with submission timestamp recording. | Must | BRD BR-FR-07 |
| FR-ASM-004 | System shall support assignment submission with file attachments (TBD: allowed file types and size limits) and version history tracking. | Must | BRD BR-FR-07 |
| FR-ASM-005 | Teachers shall be able to grade submitted assignments, provide numerical marks, written feedback, and file annotations (TBD: annotation tool scope). | Must | BRD BR-FR-07 |
| FR-ASM-006 | System shall send automated notifications to students for new assignments, approaching deadlines, and graded assignments with feedback. | Should | BRD BR-FR-07 |
| FR-ASM-007 | Teachers shall be able to extend due dates for individual students or entire sections with reason documentation. | Should | BRD BR-FR-07 |
| FR-ASM-008 | System shall track assignment submission status (not started, submitted, late, graded, returned) per student with dashboard summary. | Must | BRD BR-FR-07 |
| FR-ASM-009 | Parents shall be able to view their child's assignment list, submission status, grades, and teacher feedback. | Must | BRD BR-FR-13 |
| FR-ASM-010 | Teachers shall be able to export assignment grades to CSV and push marks to exam/assessment modules (TBD: grade transfer rules). | Could | BRD BR-FR-07 |

### 4.8 Exams & Assessment

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-EXM-001 | School Admin shall be able to create and manage exam schedules including exam types (unit test, midterm, final, TBD), dates, durations, subjects, and assigned invigilators (TBD: invigilator role). | Must | BRD BR-FR-08 |
| FR-EXM-002 | School Admin shall be able to configure assessment structures including weightage distribution across exams, assignments, class participation, and other components. | Must | BRD BR-FR-08 |
| FR-EXM-003 | Teachers shall be able to enter and edit marks for their assigned subjects/exams with validation against maximum marks and allowed ranges. | Must | BRD BR-FR-08 |
| FR-EXM-004 | System shall calculate final grades, GPA, class rank, and student position based on configured assessment weightage and grading rules (TBD: detailed formula specifications). | Must | BRD BR-FR-08 |
| FR-EXM-005 | School Admin shall be able to approve exam marks before result publication with release workflow (draft → review → published). | Should | BRD BR-FR-08 |
| FR-EXM-006 | System shall generate standardized report cards with student performance summary, grades, attendance, teacher remarks, and visual grade comparisons. | Must | BRD BR-FR-08 |
| FR-EXM-007 | School Admin shall be able to customize report card templates with school branding and configurable sections (TBD: template design tool scope). | Should | BRD BR-FR-08 |
| FR-EXM-008 | Students and Parents shall be able to view published exam results, marksheets, and report cards in PDF format. | Must | BRD BR-FR-13 |
| FR-EXM-009 | School Admin shall be able to generate class-level and subject-level performance analysis reports including grade distribution, pass/fail percentages, and improvement trends. | Should | BRD BR-FR-08, BR-FR-12 |
| FR-EXM-010 | System shall support marks moderation workflow including grace marks, re-evaluation requests, and correction records with audit trail (TBD: moderation rules). | Could | BRD BR-FR-08 |

### 4.9 Learning Content

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-LRN-001 | Teachers shall be able to create and organize learning content as structured courses/lessons linked to subjects, classes, and syllabus topics. | Should | BRD BR-FR-09 |
| FR-LRN-002 | System shall support multiple content types: documents (PDF, DOC, TBD), presentations, videos (embedded or uploaded TBD), images, web links, and rich text content. | Should | BRD BR-FR-09 |
| FR-LRN-003 | Students shall be able to access learning materials, track viewing/reading progress (TBD: progress tracking mechanisms), and bookmark content. | Should | BRD BR-FR-09 |
| FR-LRN-004 | Teachers shall be able to control content visibility settings including release dates, access by section/student group, and prerequisites (TBD: prerequisites logic). | Should | BRD BR-FR-09 |
| FR-LRN-005 | System shall provide a centralized content library where teachers can store, organize, and reuse learning materials across classes/academic years. | Could | BRD BR-FR-09 |
| FR-LRN-006 | System shall support embedding external educational content from approved platforms via LTI or standard embed codes (TBD: LTI version support). | Could | BRD BR-FR-09 |

### 4.10 Library

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-LIB-001 | Librarian/School Admin shall be able to catalog library resources including books, periodicals, digital resources with standard bibliographic fields (TBD: MARC support). | Could | BRD BR-FR-10 |
| FR-LIB-002 | System shall support resource check-out and check-in workflows with due date tracking, fine calculation (TBD: fine rules), and reservation management. | Could | BRD BR-FR-10 |
| FR-LIB-003 | Students and Teachers shall be able to search the library catalog by title, author, ISBN, subject, keyword, and availability status. | Could | BRD BR-FR-10 |
| FR-LIB-004 | System shall generate library management reports including inventory summary, circulation statistics, overdue items, and fine collection. | Could | BRD BR-FR-10, BR-FR-12 |
| FR-LIB-005 | System shall support barcode scanning for library operations and ID card integration (TBD: barcode scanner compatibility). | Could | BRD BR-FR-10 |

### 4.11 Communication

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-COM-001 | School Admin shall be able to broadcast school-wide announcements to all users or targeted user groups (by role, class, section). | Must | BRD BR-FR-11 |
| FR-COM-002 | Teachers shall be able to send messages to parents of specific students, entire sections, or individual parents/students. | Must | BRD BR-FR-11 |
| FR-COM-003 | System shall support in-app messaging with read receipts, attachments, and conversation threading. | Should | BRD BR-FR-11 |
| FR-COM-004 | System shall deliver notifications via multiple channels: in-app notification, email, and optional SMS (TBD: channel preferences and SMS integration). | Should | BRD BR-FR-11 |
| FR-COM-005 | Users shall be able to configure notification preferences per category (attendance, assignments, exams, announcements, TBD). | Should | BRD BR-FR-11 |
| FR-COM-006 | System shall support event-based automated notifications: attendance alerts, assignment deadlines, exam schedules, report card publication (TBD: full notification matrix). | Must | BRD BR-FR-11 |
| FR-COM-007 | Parents shall be able to send messages to teachers with appropriate routing and response tracking (TBD: escalation for unanswered messages). | Should | BRD BR-FR-11, BR-FR-13 |
| FR-COM-008 | School Admin shall be able to manage parent-teacher meeting scheduling with time slot booking and attendance tracking (TBD: booking workflow). | Could | BRD BR-FR-11 |

### 4.12 Reports & Analytics

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-RPT-001 | System shall provide role-based dashboards with key performance indicators and summary widgets for each user role upon login. | Must | BRD BR-FR-12 |
| FR-RPT-002 | School Admin shall have access to institutional dashboards showing attendance trends, academic performance, user engagement, and other institutional metrics (TBD: KPI list). | Must | BRD BR-FR-12 |
| FR-RPT-003 | Teachers shall have access to classroom dashboards showing attendance summary, assignment submission rates, grade distribution, and student progress indicators. | Must | BRD BR-FR-12 |
| FR-RPT-004 | System shall provide standard pre-built reports for all core modules (attendance, student demographics, exam results, assignment analytics, library circulation). | Must | BRD BR-FR-12 |
| FR-RPT-005 | All reports shall support export in PDF, CSV, and Excel formats with print-optimized layout. | Must | BRD BR-NFR-07 |
| FR-RPT-006 | School Admin shall be able to create custom reports using a report builder interface with field selection, filters, grouping, and sorting (TBD: builder complexity scope). | Should | BRD BR-FR-12 |
| FR-RPT-007 | System shall support report scheduling for automatic generation and email distribution to specified recipients on recurring intervals (TBD: scheduling engine). | Could | BRD BR-FR-12 |
| FR-RPT-008 | Parents and Students shall have access to student-level performance dashboards showing grade trends, attendance history, assignment completion, and teacher feedback. | Must | BRD BR-FR-13, BR-FR-12 |

### 4.13 Finance (Optional Module)

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-FIN-001 | School Admin shall be able to configure fee structures including tuition, miscellaneous fees, discounts, and scholarships per class and student category (TBD: fee category types). | Could | BRD BR-FR-15 |
| FR-FIN-002 | System shall generate student fee invoices with configurable billing cycles and payment due dates. | Could | BRD BR-FR-15 |
| FR-FIN-003 | School Admin shall be able to record payments, track balances, issue receipts, and manage payment plans (TBD: partial payment and installment rules). | Could | BRD BR-FR-15 |
| FR-FIN-004 | System shall support integration with online payment gateways for parent-initiated fee payments (TBD: gateway providers and settlement process). | Could | BRD BR-FR-15 |
| FR-FIN-005 | System shall generate fee collection reports, outstanding balance reports, and financial summaries (TBD: integration with external accounting excluded). | Could | BRD BR-FR-15 |

### 4.14 Parent Portal

| Requirement ID | Description | Priority | Source |
|----------------|-------------|----------|--------|
| FR-PAR-001 | System shall provide a dedicated parent portal interface with role-appropriate navigation and information access limited to their enrolled child(ren). | Must | BRD BR-FR-13 |
| FR-PAR-002 | Parents shall be able to view their child's real-time attendance records with daily and monthly summaries and alert notifications. | Must | BRD BR-FR-13 |
| FR-PAR-003 | Parents shall be able to view their child's assignment list, submission status, grades, and teacher feedback for each assignment. | Must | BRD BR-FR-13 |
| FR-PAR-004 | Parents shall be able to view published exam results, report cards, and progressive academic performance trends for their child. | Must | BRD BR-FR-13 |
| FR-PAR-005 | Parents shall be able to access school announcements, event calendars, and academic calendars relevant to their child's class. | Must | BRD BR-FR-13 |
| FR-PAR-006 | Parents with multiple children shall be able to switch between child profiles with a single account and unified dashboard summary. | Must | BRD BR-FR-13 |
| FR-PAR-007 | Parents shall be able to view and download learning materials and resources shared by teachers for their child's classes. | Should | BRD BR-FR-13 |
| FR-PAR-008 | Parents shall be able to update emergency contact information and profile details with appropriate validation/approval (TBD: approval workflow). | Should | BRD BR-FR-13 |
| FR-PAR-009 | Parents shall be able to initiate two-way communication with class teachers and subject teachers through the portal messaging system. | Should | BRD BR-FR-13 |
| FR-PAR-010 | System shall provide parent portal login credentials distribution workflow with secure access onboarding (TBD: credential distribution mechanism). | Must | BRD BR-FR-13 |
