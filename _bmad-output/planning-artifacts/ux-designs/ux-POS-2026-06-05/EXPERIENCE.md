---
title: Teacher AI Academy — Experience
status: draft
created: 2026-06-05
updated: 2026-06-05
sources:
  - prd.md
  - architecture.md
---

# Teacher AI Academy — EXPERIENCE.md

## Foundation

- **Form-factor:** Responsive web, mobile-first. Egyptian students primarily access via smartphone browsers.
- **UI system:** React with custom components. DESIGN.md defines the visual tokens.
- **Bilingual:** Arabic (RTL) and English (LTR). Toggle available in top nav. Content can be in either language.

## Key Screens

### 1. Landing Page (Student-facing, public)

**Purpose:** First touchpoint. Student arrives via teacher's link (WhatsApp/Facebook/Telegram). Must build trust and drive signup.

**Layout (mobile-first):**
- **Hero section:**
  - Teacher's profile photo (circular, prominent)
  - Teacher's name + subject (e.g., "Mr. Ahmed — Chemistry")
  - Headline: "كل حاجة محتاجها في الكيمياء في مكان واحد" (bilingual variant available)
  - Sub-headline bullet list: فيديوهات شرح · ملخصات PDF · شيتات تدريب · AI Tutor ذكي
- **CTA section:**
  - Primary button: "اشترك دلوقتي" with monthly price displayed prominently
- **Social proof:**
  - "أكتر من 500 طالب مسجلين" with student count

**States:**
- **Logged out:** Shows landing page as described
- **Logged in:** Auto-redirects to Student Dashboard (never sees landing page)

**Key behaviors:**
- The page feels like it belongs to THIS teacher — their name, photo, subject, branding
- CTA scrolls or navigates to signup/payment flow
- Language toggle respects platform default but can be switched

### 2. Login / Signup

**Purpose:** Student account creation and returning-student authentication.

**Layout (mobile-first):**
- Two tabs at top: "حساب جديد" (Sign Up) / "تسجيل الدخول" (Login)
- **Sign Up tab fields:**
  - Full Name (الاسم بالكامل)
  - Phone Number (رقم الموبايل) — Egyptian format, primary identifier
  - Email (البريد الإلكتروني)
  - Password (كلمة السر) — with confirmation field
- **Login tab fields:**
  - Phone Number (رقم الموبايل)
  - Password (كلمة السر)
  - "نسيت الباسورد؟" link → OTP sent to phone for password reset
- **Primary CTA:** "إنشاء حساب" (Sign Up) / "تسجيل الدخول" (Login)
- **Post-signup:** Redirects directly to course enrollment/payment page

**States:**
- **Default:** Sign Up tab active
- **Validation errors:** Inline field validation (phone format, password length, required fields)
- **Submitting:** Loading state on CTA button
- **Duplicate phone:** "رقم الموبايل هذا مسجل بالفعل. هل تريد تسجيل الدخول؟"
- **OTP flow (forgot password):** Phone input → Send OTP → Verify OTP → New password form

**Business rules:**
- Phone number is the unique student identifier (not email)
- No social login in v1
- Phone format validated for Egyptian numbers (+20 or 01x)

### 3. Student Dashboard — "My Courses" Tab

**Purpose:** Shows only chapters the student has purchased/unlocked. Their learning home.

**Layout (mobile-first):**
- Top: Student name + avatar (small) + language toggle
- Tab bar: **"كورساتي" (My Courses)** | **"كل المحتوى" (All Content)**
- Content: Grid/list of purchased chapters, each showing:
  - Chapter name + stage name (e.g., "Chapter 3: Acids and Bases — Second Year Secondary")
  - Progress bar (% of lessons watched)
  - Teacher name (small)
- Each chapter card → tap to enter chapter view (lessons + quizzes)

**States:**
- **Empty state (no purchases):** Friendly message + CTA to explore available content
- **Has purchases:** Grid of enrolled chapters with progress
- **Loading:** Skeleton cards

**Key behaviors:**
- Swipe or tap tab to switch between My Courses and All Content
- Chapter cards show latest activity (last watched lesson)

### 4. Student Dashboard — "All Content" Tab

**Purpose:** Full content tree across all stages. Locked vs. unlocked distinction.

**Layout (mobile-first):**
- Same top bar + tab bar
- Content: Full stage → chapter tree:
  - **Stage headers** (collapsible): e.g., "First Year Secondary", "Second Year Secondary"
  - Under each stage: chapter list
  - Each chapter shows: name, price (EGP), lock/unlock icon
  - **Purchased chapters:** Green checkmark or "مفعل" badge; tap to enter
  - **Unpurchased chapters:** Lock icon; tap opens enrollment/payment prompt

**States:**
- **Stage collapsed:** Shows stage name + chapter count
- **Stage expanded:** Full chapter list with lock states
- **Mixed state:** Some chapters unlocked, some locked within same stage

**Business rules:**
- A student can purchase individual chapters a la carte
- Purchased chapters are clearly visually distinct from locked ones
- Tapping a locked chapter shows price + "اشترك الآن" CTA

### 5. Lesson View (Video + Materials)

**Purpose:** Watch lesson video and access attached PDFs.

**Layout (mobile-first):**
- **Video player:** Embedded YouTube player (responsive, full-width)
- **Lesson info below player:**
  - Lesson title
  - Description (collapsible)
  - Duration badge
- **Materials section:**
  - PDF download buttons (one per attachment)
  - Pre-signed URL → triggers download
- **Navigation:** "Next Lesson" / "Previous Lesson" buttons at bottom
- **Chapter progress:** Top bar showing lesson position (e.g., "Lesson 3 of 8")

**States:**
- **Video loading:** YouTube placeholder/spinner
- **Video error:** "عذراً، حدث خطأ في تحميل الفيديو. تواصل مع الدعم الفني"
- **PDF downloading:** Progress indicator
- **Lesson complete:** Auto-marked as watched after 80% of video duration

### 6. Quiz Taking

**Purpose:** Student takes assigned quiz and sees results.

**Layout (mobile-first):**
- **Quiz header:** Quiz name, question count, time (if applicable — deferred to v2)
- **Questions rendered one at a time or scrollable list:**
  - **MCQ:** Question text + radio buttons for options
  - **True/False:** Question text + True / False toggle buttons
  - **Essay:** Question text + text area
- **Submit button:** "تقديم الإجابات" (Submit Answers)
- **Confirmation dialog:** "متأكد من تقديم الإجابات؟"

**States:**
- **Not started:** Start button
- **In progress:** Questions with answers being filled
- **Submitting:** Loading spinner
- **Completed:** Results screen

### 7. Quiz Results

**Purpose:** Show student their score and correct answers.

**Layout (mobile-first):**
- **Score card:** Big percentage/number (e.g., "8/10 — 80%")
- **Pass/fail status:** Visual indicator (e.g., "ناجح ✅" or needs improvement)
- **Question review:** Scrollable list of all questions
  - Correct answers shown in green
  - Wrong answers shown in red with correct answer highlighted
  - Essay questions: "بانتظار تصحيح المدرس" (awaiting teacher grading)
- **CTA:** "العودة إلى الكورس" (Back to course)

### 8. AI Tutor Chat

**Purpose:** Student asks curriculum questions; AI answers with references.

**Layout (mobile-first):**
- **Chat header:** "المساعد الذكي" (AI Tutor) with icon
- **Message thread:**
  - Student messages: right-aligned, bubble style
  - AI responses: left-aligned, with citation chips below each response
  - Citation chips: tap to jump to the specific lesson/material referenced
- **Input area:** Text field + send button
- **Daily query counter:** Small text showing remaining queries (e.g., "20 سؤال متبقي اليوم")

**States:**
- **Empty chat:** Welcome message with example questions to try
- **AI typing:** Typing indicator dots
- **Response delivered:** Response with citation chips
- **Daily limit reached:** "لقد استنفدت الحد اليومي للأسئلة. عد غداً!"
- **Error:** "عذراً، حدث خطأ. حاول مرة أخرى"

### 9. Payment / Promo Code Screen

**Purpose:** Enrollment payment via Paymob or promo code entry.

**Layout (mobile-first):**
- **Chapter summary:** Name, price, teacher name
- **Two enrollment paths presented as cards:**
  - **Card 1: "الدفع أونلاين"** — Paymob button → opens iframe
  - **Card 2: "كود خصم"** — Text input for promo code + "تأكيد" button
- **Payment confirmation:** Success/failure feedback

**States:**
- **Default:** Both options visible
- **Processing (Paymob):** Redirect to Paymob iframe
- **Processing (Promo):** Validating code
- **Success:** Confetti/checkmark + "تم التسجيل بنجاح!" → redirect to My Courses
- **Error:** Invalid code / payment failed message

### 10. Teacher Dashboard

**Purpose:** Central view for Mr. Ahmed to manage content and track students.

**Layout (desktop-first — teacher uses desktop/laptop):**
- **Sidebar navigation:**
  - Dashboard home
  - Content Manager
  - Quiz Generator
  - Students
  - Settings / Profile
- **Main area (Dashboard home):**
  - Stats cards: Total students, active this month, chapters published, quizzes created
  - Recent activity feed
  - Quick-action buttons: "إضافة درس جديد", "إنشاء اختبار"

**States:**
- **Empty (first login):** Onboarding wizard / "أضف مرحلتك الأولى" CTA
- **Active:** Full dashboard with stats

### 11. Content Manager

**Purpose:** Mr. Ahmed builds his curriculum tree.

**Layout (desktop-first):**
- **Left panel:** Hierarchical tree: Stage → Chapter → Lesson
  - Drag to reorder (or up/down arrows)
  - Add button per level
  - Edit/delete per item
- **Right panel:** Selected item's editor
  - Stage: name, description
  - Chapter: name, description, price
  - Lesson: title, description, duration, YouTube URL, PDF upload

**Key behaviors:**
- Add stage → add chapter → add lesson (top-down creation)
- PDF upload: file picker → uploads to S3 → attaches to lesson
- Auto-save on field blur

### 12. AI Quiz Generator

**Purpose:** Teacher prompts AI → reviews → publishes quiz.

**Layout (desktop-first):**
- **Step 1 — Prompt:**
  - Chapter selector (which chapter's content to use)
  - Parameters: question count, types (MCQ/TF/Essay checkboxes), difficulty (Easy/Medium/Hard)
  - Optional: custom instructions text field
  - "توليد" (Generate) button
- **Step 2 — Review:**
  - Quiz preview with all generated questions
  - Each question: edit icon, delete icon, reorder handle
  - "إضافة سؤال يدوي" (Add manual question) button
- **Step 3 — Publish:**
  - "نشر الاختبار" (Publish) button
  - Quiz assigned to selected chapter

**States:**
- **Generating:** Loading animation + "جاري التوليد..."
- **Draft:** Questions ready for review/editing
- **Published:** Success + quiz appears in student dashboards

### 13. Student Engagement View

**Purpose:** Teacher sees student progress per chapter.

**Layout (desktop-first):**
- **Chapter selector dropdown**
- **Table:** Student name | Status (Active/Inactive) | % Video Watched | Quiz Score | Last Activity
- Each row expandable: shows per-lesson breakdown
- **Search bar:** Search by student name

### 14. Promo Code Generator (Support Agent)

**Purpose:** Nadia generates universal promo codes.

**Layout (desktop-first — simple form):**
- **Generate section:**
  - "توليد كود جديد" button
  - Result: displayed code + copy button
  - Usage log below: code | generated by | used by | used at | redeemed chapter
- **No chapter selector** — codes are universal (student chooses)
