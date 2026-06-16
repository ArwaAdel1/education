---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - prd.md
  - architecture.md
  - EXPERIENCE.md
  - DESIGN.md
---

# Teacher AI Academy - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Teacher AI Academy, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

FR-1: A user can register as either a Teacher or a Student. Role determines dashboard and feature access.

FR-2: A registered user can log in with email + password. Authenticated users are routed directly to their dashboard. Session persists for at least 30 days.

FR-3: A user can reset their password via email. Reset email sent within 30 seconds; link expires after 1 hour.

FR-4: A teacher can edit their profile (name, subject, bio, photo, brand colors/logo). Changes reflect immediately on student-facing pages.

FR-5: A student can view and edit their name, email, and password. Profile shows their enrollment history with active/inactive status per month.

FR-6: A teacher can create, edit, delete, and reorder educational stages. Deleting a stage removes nested content with confirmation.

FR-7: A teacher can create, edit, delete, and reorder chapters within a stage.

FR-8: A teacher can create and manage lessons with: title, description, duration (minutes), order, YouTube URL, and PDF attachments (max 10 files, 50MB).

FR-10: A teacher can prompt the AI with parameters (question count, types [MCQ/Essay/TF], topics, difficulty) to generate a quiz draft. Generation completes within 20 seconds.

FR-11: A teacher can edit, delete, reorder, and manually add questions to a generated quiz before publishing.

FR-12: A teacher can publish and assign a quiz to a specific chapter. Students enrolled in that chapter see the quiz.

FR-13: MCQ and True/False questions are auto-graded immediately. Essay questions collected for manual teacher grading.

FR-14: Teacher sees their full content tree (stages → chapters → lessons) in a single view with quick-action buttons.

FR-15: Teacher sees a list of enrolled students with status (active/inactive), historical unlocked months, and per-lesson video engagement (% watched).

FR-16: A student can complete payment via Paymob hosted checkout. Successful payment triggers immediate enrollment activation.

FR-17: A student can enter a single-use universal promo code to unlock enrollment without payment.

FR-18: A support agent can generate a single-use universal promo code (8-char alphanumeric, non-guessable). Codes logged with timestamp and agent ID.

FR-19: Student dashboard has two tabs: "My Courses" (purchased chapters) and "All Content" (full stage→chapter tree with locked/unlocked states).

FR-20: Student sees assigned quizzes. Completed quizzes show scores for auto-graded questions.

FR-21: An enrolled student can send text questions to the AI Tutor and receive responses grounded in the teacher's content with references to specific lessons/materials.

FR-22: A persistent support button/link opens a WhatsApp chat pre-populated with the student's name and email. Available on all pages for enrolled students.

### NonFunctional Requirements

NFR-1: Payment error messages must be in Arabic/English based on user locale.

NFR-2: Arabic language support must be production-quality (Gemini API).

NFR-3: Embedding pipeline re-indexes on teacher content changes (new lesson → re-chunk → re-embed).

NFR-4: AI Tutor conversations are session-scoped with no long-term memory across sessions in v1.

NFR-5: The platform is fully bilingual (Arabic/English) — UI and content support both languages.

NFR-6: The platform is responsive web, mobile-first for student-facing screens, desktop-first for teacher-facing screens.

NFR-7: Lighthouse mobile score >70; dashboard loads <2s on 3G.

NFR-8: Per-student daily query cap for AI Tutor (configurable by teacher).

### Additional Requirements

AR-1: Single-tenant architecture — all data belongs to a single teacher. No tenant isolation layer needed. Data access enforced via Express.js middleware and Prisma query level.

AR-2: PostgreSQL with pgvector extension for RAG embeddings. No separate vector database needed for MVP.

AR-3: Paragraph-level chunking strategy for PDF text extraction and embedding.

AR-4: Shared RAG pipeline serving both AI Tutor (student queries) and AI Quiz Generator (teacher quiz creation).

AR-5: Paymob iframe/hosted checkout integration. PCI-compliant out of the box. Webhook endpoint for transaction callbacks.

AR-6: AWS S3 for PDF storage. Pre-signed URLs (60-minute expiry) for access-controlled downloads.

AR-7: AWS Elastic Beanstalk for deployment. RDS PostgreSQL managed database. Elastic Beanstalk handles load balancer, auto-scaling, SSL.

AR-8: Synchronous PDF text extraction and embedding processing for MVP (no Redis/queue). Add async queue only if bottlenecks emerge.

AR-9: CloudWatch (infrastructure logs) + Sentry free tier (error tracking) for monitoring.

AR-10: Global rate limiting: 100 requests per minute per IP using express-rate-limit.

AR-11: pdf-parse library for PDF text extraction (free, sufficient for born-digital PDFs).

AR-12: CI/CD via GitHub + Elastic Beanstalk. Database migrations run as part of deploy script.

AR-13: Secrets stored in AWS Systems Manager Parameter Store or Elastic Beanstalk environment properties.

### UX Design Requirements

UX-DR1: Landing page is teacher-branded (photo, name, subject) with one clear headline, CTA button with price, and social proof (student count).

UX-DR2: Signup flow uses Phone Number as the primary student identifier (not email). Fields: Full Name, Phone, Email, Password.

UX-DR3: Login uses Phone + Password only. Password reset via OTP sent to phone (not email).

UX-DR4: Signup → then pay flow: account created first, then redirected to enrollment/payment page.

UX-DR5: Student Dashboard has two tabs: "My Courses" (purchased chapters with progress bars) and "All Content" (full tree with locked/unlocked states and prices).

UX-DR6: Lesson View: embedded YouTube player + lesson info (title, description, duration) + PDF download buttons + next/previous navigation.

UX-DR7: Quiz Taking: MCQ (radio buttons), True/False (toggle), Essay (text area). Submit with confirmation dialog.

UX-DR8: Quiz Results: score card with percentage, correct/wrong answer highlighting, essay questions marked as "awaiting teacher grading".

UX-DR9: AI Tutor Chat: chat bubble UI with right-aligned student messages and left-aligned AI responses with citation chips linking to specific lessons.

UX-DR10: Daily query counter visible in AI Tutor header.

UX-DR11: Payment Screen: two enrollment path cards — Paymob online payment and Promo Code entry, presented equally.

UX-DR12: Teacher Dashboard: sidebar navigation (Dashboard, Content Manager, Quiz Generator, Students, Settings) + stats cards.

UX-DR13: Content Manager: left panel hierarchical tree (Stage → Chapter → Lesson) + right panel editor for selected item.

UX-DR14: AI Quiz Generator: 3-step wizard — (1) Prompt parameters, (2) Review/Edit questions, (3) Publish.

UX-DR15: Student Engagement View: table with student name, status, % video watched, quiz score, last activity. Expandable rows for per-lesson breakdown.

UX-DR16: Promo Code Generator (Support Agent): simple generate button + copy + usage log table.

UX-DR17: Visual identity: Deep Purple (#1A103D) primary, Cyan (#00C9DB) accent, Cairo typography (Google Fonts). Modern, clean, not childish.

UX-DR18: RTL (Arabic) default layout with seamless LTR (English) toggle. Language toggle in top navigation.

UX-DR19: Teacher screens built desktop-first; student screens built mobile-first.

UX-DR20: All buttons use 12px border radius. Cards use 14px border radius with subtle shadow. Input fields use 10px border radius, 48px height, cyan focus border.

### FR Coverage Map

| FR    | Epic                                | Description                                       |
| ----- | ----------------------------------- | ------------------------------------------------- |
| FR-1  | Epic 1: Identity & Access           | Register as teacher or student                    |
| FR-2  | Epic 1: Identity & Access           | Login with phone + password, 30-day JWT           |
| FR-3  | Epic 1: Identity & Access           | Password reset via phone OTP                      |
| FR-4  | Epic 1: Identity & Access           | Teacher profile (subject, bio, photo, brand)      |
| FR-5  | Epic 1: Identity & Access           | Student profile (name, email, enrollment history) |
| FR-6  | Epic 2: Content Management          | Create/edit/delete/reorder stages                 |
| FR-7  | Epic 2: Content Management          | Create/edit/delete/reorder chapters               |
| FR-8  | Epic 2: Content Management          | Create lessons with YouTube + PDF attachments     |
| FR-10 | Epic 3: AI Quiz Generation          | AI quiz draft from content with parameters        |
| FR-11 | Epic 3: AI Quiz Generation          | Review, edit, reorder, add questions              |
| FR-12 | Epic 3: AI Quiz Generation          | Publish and assign quiz to chapter                |
| FR-13 | Epic 3: AI Quiz Generation          | Auto-grade MCQ/TF, collect essay for manual       |
| FR-14 | Epic 2: Content Management          | Teacher content tree with quick actions           |
| FR-15 | Epic 4: Enrollment & Payments       | Student list with engagement data                 |
| FR-16 | Epic 4: Enrollment & Payments       | Paymob hosted checkout payment                    |
| FR-17 | Epic 4: Enrollment & Payments       | Single-use promo code enrollment                  |
| FR-18 | Epic 4: Enrollment & Payments       | Support agent promo code generation               |
| FR-19 | Epic 5: Student Learning Experience | My Courses + All Content tabs                     |
| FR-20 | Epic 5: Student Learning Experience | Quiz access with results for completed            |
| FR-21 | Epic 5: Student Learning Experience | AI Tutor with content-grounded answers            |
| FR-22 | Epic 5: Student Learning Experience | WhatsApp support button with pre-filled info      |

## Epic List

### Epic 1: Identity & Access

Users can register, log in, reset passwords, and manage their profiles. Foundation for all platform interactions.

**FRs covered:** FR-1, FR-2, FR-3, FR-4, FR-5

**Sprint:** 1 (Stories 1-17)

### Epic 2: Content Management

Teachers can create, organize, and manage their full educational content hierarchy (stages → chapters → lessons) with YouTube videos and PDF attachments. View dashboard with content overview and student engagement.

**FRs covered:** FR-6, FR-7, FR-8, FR-14

**Sprints:** 2 (Stories 22-38, 31-32), 4 (Stories 66-67, 73-75)

### Epic 3: AI Quiz Generation

Teachers can generate AI-powered quizzes from their content using a 3-step wizard, review and edit questions, publish and assign to chapters. Students take quizzes with auto-grading for MCQ/TF.

**FRs covered:** FR-10, FR-11, FR-12, FR-13

**Sprints:** 3 (Stories 42-49, 54-58), 4 (Stories 68, 76-77)

### Epic 4: Enrollment & Payments

Students can pay for chapter access via Paymob or redeem promo codes. Support agents generate promo codes. Teachers see student enrollment and engagement data.

**FRs covered:** FR-15, FR-16, FR-17, FR-18

**Sprints:** 3 (Stories 50-53, 59-60, 62)

### Epic 5: Student Learning Experience

Students browse content (My Courses / All Content), view lesson pages, take quizzes, chat with AI Tutor for help, and contact support via WhatsApp.

**FRs covered:** FR-19, FR-20, FR-21, FR-22

**Sprints:** 2 (Stories 30, 39-41), 3 (Story 61), 4 (Stories 63-65, 69-72, 78)
