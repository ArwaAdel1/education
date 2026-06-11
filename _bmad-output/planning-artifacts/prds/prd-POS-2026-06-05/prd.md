---
title: "Teacher AI Academy — Single-Teacher LMS for Egyptian Educators"
created: 2026-06-05
updated: 2026-06-05
status: draft
---

# PRD: Teacher AI Academy
*Working title — confirm.*

## 0. Document Purpose

This PRD defines the vision, user journeys, features, scope, and success criteria for a single-teacher Learning Management System (LMS) targeting Egyptian high school educators. It is written for the product team, engineering, design, and downstream workflow owners (UX, architecture, epics). The document is journey-led: three named personas (Youssef, Mr. Ahmed, Nadia) drive the feature definitions. Technical implementation choices and competitive analysis reside in `addendum.md`. Assumptions are tagged inline with `[ASSUMPTION]` and indexed in §9.

## 1. Vision

*A platform that enables any teacher in Egypt to build their own online academy in minutes, and manage their students using artificial intelligence without any technical complexity.*

Today, Egyptian teachers who want to take their tutoring business online face a fragmented landscape. Global platforms (Teachable, Thinkific) charge USD and don't support local payments like Paymob. Local edtech players are content marketplaces — they own the student relationship, not the teacher. The fallback is WhatsApp groups and YouTube playlists: free, chaotic, and impossible to monetize at scale.

Teacher AI Academy changes this. For a monthly subscription paid in EGP, a teacher gets a fully branded, bilingual (Arabic/English) online academy with AI-powered quiz generation, a RAG-based AI tutor for their students, integrated Paymob payments, and a dashboard that gives them full visibility into their content and students — without writing a single line of code or managing any infrastructure.

## 2. Target User

### 2.1 Jobs To Be Done

**For the teacher:**
- "Help me look professional and credible to students and parents without hiring a developer."
- "Give me one place to manage my content, my students, and my money."
- "Save me hours of manual quiz creation every week."
- "Show me which students are actually watching and which are falling behind."
- "Let me focus on teaching, not tech."

**For the student:**
- "Give me all my teacher's materials in one place I can access from my phone."
- "Help me when I'm stuck on a problem at 10 PM and no one else is awake."
- "Let me practice and test myself so I'm ready for exams."
- "Make paying easy — preferably with the method my family already uses."

**For the support agent:**
- "Let me generate enrollment codes in seconds when a student pays via Vodafone Cash."
- "Give me a quick way to verify whether a student has paid and what they can access."
- "Keep the teacher out of this loop — I handle it."

### 2.2 Non-Users (v1)

- **Multi-teacher schools or institutions** — this is a single-teacher platform. Group/campus-wide deployments are out of scope.
- **Students outside Egypt** — localization is Egyptian-first; payment methods and curriculum alignment target Egypt.
- **Parents** — no parent portal in v1. The student is the primary end-user.

### 2.3 Key User Journeys

#### UJ-1: Youssef — Student Onboarding & Daily Use

- **Persona + context:** Youssef, 16, Second Year Secondary. His teacher sent him a link on WhatsApp. He opens it on his phone.
- **Entry state:** Not authenticated. Sees the landing page.
- **Path:**
  1. Signs up / logs in → auto-redirected to **Student Dashboard**
  2. Chooses enrollment path:
     - **Path A:** Pays online via Paymob (wallet or card) → instant access
     - **Path B:** Contacts support, pays via Vodafone Cash/InstaPay → support sends single-use **promo code** → enters code → access unlocked
  3. Browses enrolled stages → watches YouTube lessons → downloads PDFs and exercise sheets
  4. Takes assigned quizzes → sees auto-graded results
- **Climax:** Value delivered the first time he gets an answer from the AI Tutor at 10 PM without waiting for his teacher.
- **Resolution:** Logs out. Next session starts at the dashboard with his content waiting.

#### UJ-2: Mr. Ahmed — Teacher Onboarding & Daily Operations

- **Persona + context:** Mr. Ahmed, a chemistry teacher who has been tutoring privately for years and wants a branded online presence.
- **Entry state:** Not authenticated. Reached via direct sales or targeted marketing.
- **Path:**
  1. Signs up → completes profile → sets up **academic structure**: stages → chapters → lessons
  2. For each lesson: uploads YouTube video link + attaches PDF study materials + sets duration and order
  3. Creates a quiz via AI prompt: *"Generate 10 MCQ + 5 True/False questions on Acids and Bases, medium difficulty"* → AI drafts → Mr. Ahmed edits/adds/removes questions → publishes
  4. Views **Teacher Dashboard**: sees student list, engagement (% video watched), quiz scores
  5. A student reports a broken video → routed to **WhatsApp support** — Mr. Ahmed never handles this directly
- **Climax:** The moment he sees students enrolling and completing his quizzes without him doing any manual grading.
- **Resolution:** He logs off knowing the platform runs without him needing to be online.

#### UJ-3: Nadia — Support Agent Operations

- **Persona + context:** Nadia, a support agent handling student inquiries and payment verification.
- **Entry state:** Authenticated in the **Admin Panel**.
- **Path:**
  1. Student sends payment screenshot (Vodafone Cash/InstaPay) via WhatsApp
  2. Nadia verifies the transaction → generates a **single-use promo code** in the Admin Panel
  3. Sends code to student → student enters it → enrollment unlocked
  4. Student messages: "I paid but still can't access" → Nadia looks up profile → verifies status → manually re-issues code or resolves access
- **Climax:** Resolving a frantic student's access issue in under two minutes.
- **Resolution:** The student confirms access works. Nadia moves to the next ticket.

## 3. Glossary

- **Stage (مرحلة)** — Top-level content grouping representing an academic year (e.g., "First Year Secondary", "Second Year Secondary"). A teacher may have multiple stages.
- **Chapter (وحدة)** — Content grouping within a stage (e.g., "Chapter 3: Acids and Bases").
- **Lesson (درس)** — Individual content unit. Contains title, description, duration (minutes), order, a YouTube video link, and attached PDF files.
- **Enrollment** — A student's paid access grant to a specific **chapter** for a specific month. Enrollment is permanent (lifetime access) once paid. Students can purchase individual chapters within a stage independently.
- **My Courses** — Student dashboard tab showing only chapters the student has purchased/unlocked.
- **All Content** — Student dashboard tab showing the full content tree across all stages. Purchased chapters are accessible; unpurchased chapters are visible but locked.
- **Promo Code** — A randomly generated, single-use, time-limited code that grants free enrollment to a specific stage. Generated by support agents; used when students pay outside Paymob.
- **AI Tutor** — A RAG-powered chat assistant available to enrolled students. Answers curriculum questions using the teacher's uploaded content as its knowledge base. Provides references to specific lessons/materials.
- **AI Quiz Generator** — A teacher-facing tool that accepts natural-language parameters and produces a draft quiz (MCQ, Essay, True/False questions). Teacher reviews, edits, and publishes.
- **Teacher Dashboard** — The central admin interface where the teacher manages content, views student engagement, and accesses analytics.
- **Student Dashboard** — The student's home screen showing enrolled stages, available lessons, and assigned quizzes.
- **Lifetime Access** — A student who pays for a specific month retains permanent access to that month's content, even if they do not subscribe to future months.

## 4. Features

### 4.1 Authentication

**Description:** Simple, role-based authentication for Students and Teachers. Supports email/password signup and login. Upon login, users are routed to their respective dashboard (Teacher Dashboard or Student Dashboard) based on role. Realizes UJ-1, UJ-2.

**Functional Requirements:**

#### FR-1: Role-based registration

A user can register as either a **Teacher** or a **Student**. The role determines the dashboard they see and the features they can access.

**Consequences (testable):**
- Teacher accounts cannot access Student Dashboard features and vice versa
- Role is set at registration and is immutable without admin intervention

**Out of Scope:**
- Social login (Google/Facebook) — deferred to v2
- SSO / enterprise auth

#### FR-2: Login and session management

A registered user can log in with email + password. The system maintains a persistent session. On subsequent visits, logged-in users are routed directly to their dashboard. Realizes UJ-1, UJ-2.

**Consequences (testable):**
- Unauthenticated users see the landing page
- Authenticated users are never shown the landing page
- Session persists for at least 30 days of inactivity

#### FR-3: Password reset

A user can reset their password via email.

**Consequences (testable):**
- Reset email is sent within 30 seconds
- Reset link expires after 1 hour

---

### 4.2 Profiles

**Description:** Dedicated profile pages for Teachers and Students. Teachers: name, subject, bio, profile photo, branding (logo, colors). Students: name, email, enrolled stages, payment history.

**Functional Requirements:**

#### FR-4: Teacher profile

A teacher can edit their profile displaying their name, subject area, bio, profile photo, and brand colors/logo. The student-facing public profile shows the teacher's name, subject, and bio.

**Consequences (testable):**
- Teacher can upload a profile photo (PNG/JPG, max 5MB) and brand logo
- Profile changes reflect immediately on student-facing pages

#### FR-5: Student profile

A student can view and edit their name, email, and password. The profile displays a history of their enrolled stages with "active/inactive" status per month.

**Consequences (testable):**
- Student can see which months they have unlocked (lifetime)

---

### 4.3 Content Management

**Description:** Teachers organize their curriculum into a three-level hierarchy: **Stage → Chapter → Lesson**. Each lesson contains a title, description, duration (in minutes), ordering, a YouTube video link, and attached PDF materials. Content is available to students as soon as it is published. Realizes UJ-2.

**Functional Requirements:**

#### FR-6: Create and manage stages

A teacher can create, edit, delete, and reorder educational stages (e.g., "First Year Secondary"). Each stage has a name and optional description.

**Consequences (testable):**
- Deleting a stage removes all nested chapters and lessons (with confirmation)
- Stages display in the order set by the teacher

#### FR-7: Create and manage chapters

Within a stage, a teacher can create, edit, delete, and reorder chapters.

#### FR-8: Create and manage lessons

Within a chapter, a teacher can add lessons with: title, description, duration (integer, minutes), order number, a YouTube video URL, and file attachments (PDF). Realizes UJ-2.

**Consequences (testable):**
- YouTube URL is validated as a valid YouTube link
- Multiple PDF files can be attached per lesson (max 10 files, 50MB total)
- Duration is displayed to students as "X minutes"

### 4.4 AI Quiz Generation

**Description:** A teacher-facing tool that generates quiz drafts from natural-language parameters. The teacher specifies: number of questions, question types (MCQ, Essay, True/False), topics, and difficulty level. AI uses the teacher's stored content as context. Teacher reviews, edits, and publishes the quiz.

**Functional Requirements:**

#### FR-10: AI quiz draft generation

A teacher can prompt the system with parameters: question count, types (MCQ / Essay / True/False), target topics, and difficulty. The system generates a draft quiz. Realizes UJ-2.

**Consequences (testable):**
- Generated quiz contains exactly the requested question count
- Each question type is correctly formatted (MCQ has 4 options, T/F has 2, Essay has free-text)
- Generation completes within 20 seconds

**Feature-specific NFRs:**
- Quiz generation must use the teacher's own content as context (RAG on uploaded materials)

#### FR-11: Quiz review and editing

The teacher can edit any generated question, add custom questions, delete questions, and reorder them before publishing.

**Consequences (testable):**
- Teacher can modify question text, options (MCQ), correct answer
- Teacher can manually add new questions of any supported type
- Teacher can delete any question from the quiz

#### FR-12: Quiz publishing and assignment

The teacher publishes the quiz and assigns it to a specific stage. Students enrolled in that stage see it in their dashboard.

**Consequences (testable):**
- Published quiz is immediately visible to assigned students
- Each student can take the quiz once (configurable per quiz)

**Out of Scope:**
- Timed quizzes (countdown during test) — deferred to v2
- Randomized question order per student — deferred to v2

#### FR-13: Auto-grading

MCQ and True/False questions are auto-graded immediately upon submission. Essay questions are collected for manual teacher grading. Realizes UJ-1.

**Consequences (testable):**
- MCQ/T/F scores shown immediately after submission
- Teacher receives a notification when essay answers need grading
- Score is recorded in the student's history

---

### 4.5 Teacher Dashboard

**Description:** A central view for the teacher to manage all uploaded content and track enrolled students. Provides quick-access widgets: content tree, student list, engagement metrics (% video watched per lesson). Realizes UJ-2.

**Functional Requirements:**

#### FR-14: Content overview

Teacher sees their full content tree (stages → chapters → lessons) in a single view with quick-action buttons (add, edit, delete).

#### FR-15: Student list and engagement

Teacher sees a list of enrolled students with status (active/inactive for current month), historical unlocked months, and per-lesson video engagement (% watched). Realizes UJ-2.

**Consequences (testable):**
- Teacher can sort students by name, enrollment date, engagement %
- Student profile shows which specific months/years they have lifetime access to

---

### 4.6 Student Enrollment & Payment

**Description:** Students can enroll in stages via two parallel paths: (A) self-serve online payment through Paymob (wallet, card, Meeza), or (B) assisted enrollment via a single-use Promo Code generated by support after external payment (Vodafone Cash, InstaPay). Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-16: Paymob payment flow

A student can select a stage and complete payment via Paymob's hosted checkout. Upon successful payment, enrollment is immediately activated. Realizes UJ-1.

**Consequences (testable):**
- Payment confirmation is returned within 10 seconds
- Enrollment is activated within 30 seconds of successful payment
- Failed/cancelled payments leave the student unenrolled with a clear error message

**Feature-specific NFRs:**
- Payment error messages must be in Arabic/English based on user locale
- Transaction records are stored and accessible to support agents

#### FR-17: Promo code enrollment

A student can enter a single-use promo code to unlock enrollment without payment. The code is generated by a support agent via the Admin Panel. Codes are universal — the student can apply them to any chapter of their choice. Realizes UJ-1, UJ-3.

**Consequences (testable):**
- Each promo code is single-use and expires after first redemption
- Codes are universal (not tied to a specific chapter)
- Expired or already-used codes show a clear error

#### FR-18: Promo code generation (Admin Panel)

A support agent can generate a single-use universal promo code. The system auto-generates a random, secure alphanumeric code. The code is not tied to any specific chapter — the student chooses which chapter to unlock when redeeming it. Realizes UJ-3.

**Consequences (testable):**
- Codes are minimum 8 characters, alphanumeric, non-guessable
- Codes are universal (not tied to a specific chapter or stage)
- Generated codes are logged with timestamp and agent ID

**Out of Scope:**
- Bulk code generation — deferred to v2
- Code expiration by date — deferred to v2 (codes expire on use only)

---

### 4.7 Student Dashboard

**Description:** The student's home screen with two views: **My Courses** (purchased chapters only) and **All Content** (full content tree across all stages with locked/unlocked distinction). Realizes UJ-1.

**Functional Requirements:**

#### FR-19: Student content views

Student sees two tabs/views: **My Courses** shows only chapters they have purchased/unlocked. **All Content** shows the full content tree across all stages, with purchased chapters accessible and unpurchased chapters visible but locked. Lessons display: title, duration, a thumbnail/preview, and completion status.

**Consequences (testable):**
- Unwatched lessons show as "new"
- Video progress (% watched) is tracked and saved on exit
- Unpurchased chapters show a "locked" state with an enrollment/payment CTA
- Purchased chapters clearly show "unlocked" or "owned"

#### FR-20: Quiz access

Student sees assigned quizzes. Completed quizzes show the score (for auto-graded questions).

---

### 4.8 AI Student Chat

**Description:** An interactive AI assistant available to enrolled students. Students ask curriculum questions in natural language. The AI responds using the teacher's uploaded content as its knowledge base (RAG), providing answers and citing specific lessons/materials as references. Realizes UJ-1.

**Functional Requirements:**

#### FR-21: AI Tutor query

An enrolled student can send a text question to the AI Tutor and receive a response grounded in the teacher's content. Responses include references to specific lessons, chapters, or PDFs.

**Consequences (testable):**
- Response time under 5 seconds for typical questions
- Every response must cite at least one source from the teacher's content
- Teachers can view AI Tutor logs (questions asked, per student)
- AI Tutor is only available to enrolled students of that specific teacher

**Feature-specific NFRs:**
- Arabic language support must be production-quality (Gemini API)
- Embedding pipeline runs on teacher content changes (new lesson → re-index)
- Conversations are session-scoped; no long-term memory across sessions in v1

**Out of Scope:**
- Voice input — deferred to v2
- Image/math rendering in chat — deferred to v2

---

### 4.9 Support Flow

**Description:** A dedicated complaint/support section linked directly to WhatsApp customer service. Students can report issues (broken videos, access problems, payment issues) without involving the teacher. Realizes UJ-1, UJ-3.

**Functional Requirements:**

#### FR-22: Support button

A persistent support button/link in the platform navigation that opens a WhatsApp chat with customer support.

**Consequences (testable):**
- The WhatsApp link is pre-populated with the student's name and email for context
- Available on all pages for enrolled students

---

## 5. Non-Goals (Explicit)

- **The platform is NOT a marketplace** — it is a single-tenant system dedicated to one teacher per instance. We do not cross-sell students between teachers.
- **The platform is NOT a content creation studio** — we embed YouTube, not host or edit videos.
- **The platform is NOT a live tutoring tool** — no real-time video sessions in v1.
- **The platform is NOT a parent/guardian portal** — parents interact through their children's accounts.
- **The platform does NOT handle teacher-to-teacher social features** — no forums, no communities.

## 6. MVP Scope

### 6.1 In Scope

All nine features defined in §4.0−§4.9:
- Authentication (email/password, role-based)
- Profiles (teacher + student)
- Content Management (stages, chapters, lessons, PDFs)
- AI Quiz Generation (draft, edit, publish, auto-grade MCQ/TF)
- Teacher Dashboard (content tree, student list, engagement metrics)
- Student Enrollment & Payment (Paymob + promo codes)
- Student Dashboard (content view, quiz access, progress tracking)
- AI Student Chat (RAG-powered, content-referenced answers)
- Support Flow (WhatsApp integration)

### 6.2 Out of Scope for MVP

| Feature | Deferred To | Reason |
|---|---|---|
| Social login (Google/Facebook) | v2 | Adds integration complexity; email/password covers v1 |
| Timed quizzes | v2 | Not critical for initial launch |
| Randomized question order | v2 | Nice-to-have for academic integrity |
| Bulk promo code generation | v2 | Manual generation sufficient at launch scale |
| Code expiration by date | v2 | Codes expire on first use — sufficient for v1 |
| Voice input for AI Tutor | v2 | Text-only chat covers the core use case |
| Student performance analytics | v2 | Basic scores tracking is sufficient for v1 |
| Notification system (email/SMS) | v2 | Students return to platform organically in v1 |
| Mobile apps (Android/iOS) | v3 | Responsive web covers the target device base |
| Parent portal | v3 | Low priority for initial teacher adoption |
| Live sessions / video conferencing | v3 | Not in scope — this is an async learning platform |

## 7. Success Metrics

### Primary

- **SM-1: Teacher Retention Rate** — Month-over-month subscription renewals. Measures whether teachers find ongoing value. Target: >80% monthly retention by month 6.
- **SM-2: Active Subscriber Growth** — Total active paid subscriptions (teachers + students) trending upward month over month. Target: 20% MoM growth for first 6 months.
- **SM-3: Word-of-Mouth Sign-ups** — % of new teacher registrations attributed to organic referral. Target: >30% by month 6.

### Secondary

- **SM-4: AI Quiz Generation Adoption** — % of active teachers who have generated at least one AI quiz. Target: >60% by month 3.
- **SM-5: AI Tutor Usage** — % of enrolled students who send at least one query per week. Target: >30% by month 6.
- **SM-6: Payment Success Rate** — % of Paymob transactions that complete successfully. Target: >95%.

### Counter-metrics

- **SM-C1: Support Ticket Volume per Student** — If ticket volume grows faster than student count, the platform is confusing. Target: tickets/student ≤ baseline each month.
- **SM-C2: Teacher Time on Admin** — If teachers spend more than 30 min/day on admin, the platform is not saving them time. Target: <30 min/day average by month 3.
- **SM-C3: AI Tutor Query Volume per Teacher** — If query volume is zero, the feature isn't delivering value; if it's >100/student/month, students may be over-relying or the AI is giving poor answers requiring repeated attempts.

## 8. Open Questions

1. **Product name** — What is the official product name? "Teacher AI Academy" is a working title. Needs confirmation.
2. **Teacher pricing tiers** — What are the exact price points for monthly, quarterly, and annual subscriptions? What do seasonal high school bundles look like?
3. **Student payment** — Does the student pay per month or per stage? The model says "monthly subscription with lifetime access" — is it a recurring monthly payment from the student, or one-time payment per month of content?
4. **Paymob integration depth** — Does Paymob support recurring/subscription-style payments, or only one-time checkout? This affects the student payment architecture.
5. **AI Quiz parameters** — Can the AI generate quizzes from specific PDFs/chapters, or only from the entire content corpus? [ASSUMPTION: teacher can specify which chapters/topics].
6. **Support agent access** — Is Nadia's Admin Panel part of the same platform, or a separate internal tool?
7. **Content migration** — Do we need tooling to help teachers import existing content (YouTube playlists, PDF collections) in bulk for v1?

## 9. Assumptions Index

| ID | Assumption | Source | Status |
|---|---|---|---|
| A-1 | Teachers will pay a monthly subscription in EGP for a branded LMS | Discovery | To validate |
| A-2 | Students primarily access the platform via mobile browser (no native app needed) | User input | Confirmed |
| A-3 | YouTube embedding is acceptable for video content delivery | User input | Confirmed |
| A-4 | Paymob covers the required payment flows (one-time checkout, wallet, card, Meeza) | Discovery | To validate |
| A-5 | Arabic-language RAG with Gemini produces acceptable accuracy for high school subjects | Discovery | To validate |
| A-6 | Students will use an AI tutor chat rather than contacting the teacher directly | Discovery | To validate |
| A-7 | A single teacher generates 50-200 students within 12 months | User input | Confirmed |
| A-8 | Teachers have existing digital content (PDFs, YouTube playlists) to populate their academy | Discovery | To validate |
| A-9 | Promo codes are universal (not tied to a specific chapter), single-use, and alphanumeric | User revision | Confirmed |
| A-10 | The "lifetime access" model does not create unsustainable storage/bandwidth liability | Discovery | To validate |
| A-11 | Single-tenant architecture (dedicated instance per teacher) simplifies data ownership and access control | User input | Confirmed |
