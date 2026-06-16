# Architecture Decision Record — Teacher AI Academy

**Status:** Draft  
**Created:** 2026-06-05  
**PRD Reference:** `prd.md`  
**Decision Log:** `.decision-log.md`

---

## 1. System Overview

Single-teacher LMS platform. Single-tenant, web-only (responsive), bilingual AR/EN. Each teacher runs their own academy instance. Students enroll in individual chapters via Paymob or promo codes. AI features (RAG tutor + quiz generator) powered by Google Gemini.

---

## 2. Tech Stack

| Layer              | Technology                             | Rationale                                                                                                                                   |
| ------------------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**       | React.js                               | Chosen by user                                                                                                                              |
| **Backend**        | Node.js with Express.js + TypeScript   | Chosen by user — lightweight, flexible, TypeScript-native, middleware-based architecture ideal for single-tenant deployments |
| **Database**       | PostgreSQL                             | Chosen by user — with pgvector extension for RAG embeddings                                                                                 |
| **ORM**            | Prisma                                 | Chosen by user — type-safe, auto-generated queries, supports migrations, works seamlessly with Express.js                                   |
| **AI**             | Google Gemini API                      | Chosen by user — strong Arabic support, competitive pricing                                                                                 |
| **Payments**       | Paymob API                             | Chosen by user — standard gateway for Egyptian market                                                                                       |
| **Storage**        | AWS S3                                 | Industry standard, cheap, integrates with pre-signed URL pattern                                                                            |
| **Infrastructure** | AWS Elastic Beanstalk + RDS PostgreSQL | Simple deployment from GitHub, managed infrastructure                                                                                       |

---

## 3. Single-Tenant Architecture

### 3.1 Isolation Strategy

**Pattern:** Single-tenant deployment. Each teacher instance runs independently with its own database. No tenant isolation layer is needed — all data belongs to the single teacher and their students.

**Enforcement layers:**

1. **Authentication layer** — JWT contains `userId` and `role` (teacher/student); extracted on login
2. **Express.js middleware** — injects authenticated user context into `req.user`
3. **Prisma query level** — all queries are scoped by the authenticated user's role and ownership
4. **Route-level authorization** — middleware enforces role-based access (teacher vs. student routes)

### 3.2 Authentication Context Flow

```
Request → JWT Auth Middleware → Extract userId + role from token →
  Set on req.user via Express middleware →
  Prisma queries filter by user ownership →
  Response
```

### 3.3 Entity Ownership

All data entities reference either the teacher (owner) or student (enrollee) via standard foreign key relationships. No generic `tenantId` abstraction layer.

---

## 4. Data Model

### 4.1 Core Entities

```
Teacher
  ├── id: UUID
  ├── name: string
  ├── email: string (unique)
  ├── brandName: string
  ├── brandColors: JSON
  ├── logoUrl: string
  └── subscriptionStatus: enum

Stage
  ├── id: UUID
  ├── teacherId: UUID (FK → Teacher)
  ├── name: string (e.g., "First Year Secondary")
  ├── description: text (optional)
  └── order: integer

Chapter
  ├── id: UUID
  ├── stageId: UUID (FK → Stage)
  ├── name: string
  ├── description: text (optional)
  ├── order: integer
  └── price: decimal (in EGP)

Lesson
  ├── id: UUID
  ├── chapterId: UUID (FK → Chapter)
  ├── title: string
  ├── description: text
  ├── duration: integer (minutes)
  ├── order: integer
  └── youtubeUrl: string

LessonAttachment
  ├── id: UUID
  ├── lessonId: UUID (FK → Lesson)
  ├── fileName: string
  ├── s3Key: string
  └── fileSize: integer

Enrollment
  ├── id: UUID
  ├── studentId: UUID (FK → Student)
  ├── chapterId: UUID (FK → Chapter)
  ├── month: string (e.g., "2026-06")
  ├── method: enum (paymob | promo_code)
  └── purchasedAt: timestamp

PromoCode
  ├── id: UUID
  ├── code: string (unique, random alphanumeric)
  ├── used: boolean (default false)
  ├── usedByStudentId: UUID? (FK → Student)
  ├── redeemedChapterId: UUID? (FK → Chapter, set on use)
  ├── generatedBy: UUID (FK → support agent)
  └── createdAt: timestamp
```

### 4.2 AI/RAG Entities

```
ContentChunk
  ├── id: UUID
  ├── sourceType: enum (lesson_description | lesson_pdf)
  ├── sourceId: UUID (FK → Lesson)
  ├── content: text
  ├── embedding: vector (pgvector)
  ├── chunkOrder: integer
  └── createdAt: timestamp

AiTutorConversation
  ├── id: UUID
  ├── studentId: UUID (FK → Student)
  ├── query: text
  ├── response: text
  ├── sources: JSON (references to cited chunks)
  └── createdAt: timestamp
```

### 4.3 Content Hierarchy

```
Teacher
  └── Stage (grouping container — no enrollment)
       └── Chapter ← ENROLLMENT UNIT (student buys per chapter)
            └── Lesson (YouTube URL + PDF attachments)
```

### 4.4 Student Views

- **My Courses tab:** Shows only chapters where the student has an active `Enrollment` record
- **All Content tab:** Shows full stage → chapter tree; chapters without enrollment show as "locked" with a payment CTA

---

## 5. API Architecture

Express.js REST API organized by route groups with middleware-based architecture:

| Route Group           | Responsibility                                        | Key Endpoints                                                      |
| --------------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| **Auth Routes**       | Registration, login, JWT issuance                     | POST /auth/register, POST /auth/login, POST /auth/reset-password   |
| **Teacher Routes**    | Teacher onboarding, profile, branding                 | POST /teacher, PUT /teacher/profile, PUT /teacher/branding         |
| **Content Routes**    | Stages, chapters, lessons, PDF upload                 | CRUD /stages, /chapters, /lessons, POST /lessons/:id/attachments   |
| **Enrollment Routes** | Payment, promo codes, access control                  | POST /enroll/paymob, POST /enroll/promo-code, GET /enrollments     |
| **Quiz Routes**       | AI quiz gen, teacher review, publish, student answers | POST /quizzes/generate, PUT /quizzes/:id, POST /quizzes/:id/submit |
| **AiTutor Routes**    | RAG chat, query embedding, compliance logging         | POST /ai-tutor/ask, GET /ai-tutor/history                          |
| **Payment Routes**    | Paymob webhook handling, transaction records          | POST /payments/webhook, GET /payments/transactions                 |
| **Support Routes**    | Admin panel for code generation, student lookup       | POST /support/promo-codes, GET /support/students/:id               |

---

## 6. RAG Pipeline

### 6.1 Architecture

```
[Teacher uploads PDF / saves lesson]
    ↓
[ContentChunk Service]
    ↓
1. Extract text from PDF (pdf-parse or similar)
2. Split into paragraph-level chunks
3. Send each chunk to Gemini Embedding API
4. Store chunk + embedding in ContentChunk table (pgvector)
    ↓
[pgvector index]

[Student sends query to /ai-tutor/ask]
    ↓
[AiTutor Route Handler]
    ↓
1. Embed student's question (Gemini Embedding API)
2. pgvector similarity search → top 5-10 relevant chunks
3. Build prompt: chunks + question + "Cite your sources"
4. Send to Gemini generation API
5. Parse response, extract citations
6. Log conversation to AiTutorConversation
7. Return answer + references to student
```

### 6.2 Chunking Strategy

- **Method:** Paragraph-level splitting
- **Max chunk size:** ~500 tokens (configurable)
- **Overlap:** 50 tokens between chunks (to prevent context splitting at boundaries)
- **Sources indexed:** Lesson descriptions + extracted PDF text

### 6.3 Re-indexing Trigger

- On lesson create/update: re-chunk and re-embed the lesson's content
- On PDF upload: extract text, chunk, embed
- On PDF delete: remove associated chunks

### 6.4 Cost Control

- Per-student daily query limit (configurable by teacher)
- Token usage logged per query for monitoring
- Teacher can view their monthly API usage

---

## 7. AI Quiz Generator

### 7.1 Architecture

```
[Teacher provides quiz parameters via POST /quizzes/generate]
    ↓
[QuizModule]
    ↓
1. Extract parameters: question count, types (MCQ/TF/Essay), topics, difficulty
2. Query pgvector for relevant content chunks (same RAG pipeline)
3. Build prompt with chunks + parameters + output format specification
4. Send to Gemini generation API
5. Parse structured JSON response
6. Save quiz as "draft" status
7. Return draft to teacher
    ↓
[Teacher reviews/edits in UI]
    ↓
[PUT /quizzes/:id] → Teacher publishes → status = "published"
    ↓
[Students in chapter see quiz → FR-12, FR-20]
```

### 7.2 Output Format

Gemini response is structured as JSON:

```json
{
  "quizTitle": "Chapter 3: Acids and Bases",
  "questions": [
    {
      "type": "mcq",
      "question": "What is the pH of a neutral solution?",
      "options": ["5", "7", "9", "14"],
      "correctAnswer": 1,
      "explanation": "A pH of 7 is neutral at 25°C."
    },
    {
      "type": "true_false",
      "question": "Acids turn blue litmus paper red.",
      "correctAnswer": true,
      "explanation": "Acids have a pH less than 7 and turn blue litmus red."
    },
    {
      "type": "essay",
      "question": "Explain the difference between strong and weak acids.",
      "modelAnswer": "Strong acids completely dissociate in water..."
    }
  ]
}
```

---

## 8. Payment Architecture

### 8.1 Paymob Iframe Flow

```
1. Student clicks "Enroll" on a chapter
2. Backend calls Paymob API to create a payment link
   - Request body: amount (chapter price), currency (EGP),
      metadata: {teacherId, chapterId, studentId}
3. Paymob returns payment URL
4. Student redirected to Paymob iframe → pays (card/wallet/Meeza)
5. Paymob sends webhook POST to /api/payments/webhook
6. Backend verifies webhook signature (HMAC)
7. Backend creates Enrollment record for student + chapter
8. Next dashboard load → student sees chapter unlocked
```

### 8.2 Promo Code Flow

```
1. Support agent generates code via Admin Panel
   - System generates random 8-char code (no chapter association)
   - Code stored in PromoCode table (universal, single-use)
2. Student selects a chapter → clicks "Enter Promo Code"
3. Student enters code
4. Backend validates:
   - Code exists and not used
5. Creates Enrollment record for selected chapter
6. Marks code as used (used=true, usedByStudentId, redeemedChapterId)
```

---

## 9. File Storage

### 9.1 PDF Upload

- **Upload path:** Teacher uploads PDF via Express.js → streams directly to S3
- **S3 key pattern:** `teachers/{teacherId}/lessons/{lessonId}/{uuid}-{originalFilename}.pdf`
- **Metadata stored in DB:** `LessonAttachment` table (fileName, s3Key, fileSize)

### 9.2 PDF Download (Pre-signed URLs)

```
1. Student clicks "Download PDF"
2. GET /lessons/:lessonId/attachments/:attachmentId/download
3. Express.js auth middleware verifies student is enrolled in the chapter
4. Express.js route handler generates S3 pre-signed URL (expires in 60 minutes)
5. Returns URL to client → student downloads directly from S3
```

---

## 10. Deployment Architecture

### 10.1 Infrastructure (MVP)

```
[Cloudflare DNS]
    ↓
[AWS Elastic Beanstalk]
  ├── Load Balancer
  ├── Express.js application (auto-scaling, min 1, max 3 instances)
  └── Environment variables: DB_URL, GEMINI_API_KEY, PAYMOB_*, S3_BUCKET, JWT_SECRET
    ↓
[AWS RDS PostgreSQL]
  ├── db.r6g.large (or db.t3.medium for MVP)
  ├── Multi-AZ: optional for MVP
  ├── pgvector extension enabled
  └── Automated backups enabled
    ↓
[AWS S3]
  ├── Bucket: teacher-ai-academy-pdfs
  ├── Public access blocked
  └── CORS: allow Elastic Beanstalk domain only
```

### 10.2 CI/CD

- **Source:** GitHub
- **Deploy:** Elastic Beanstalk integrated via GitHub Actions or EB CLI
- **Pipeline:** Push to `main` → build → `eb deploy`
- **Database migrations:** Run as part of deploy script (`prisma migrate deploy`)

### 10.3 Secrets Management

- AWS Systems Manager Parameter Store (or Elastic Beanstalk environment properties)
- Never commit secrets to repository
- Secrets: `GEMINI_API_KEY`, `PAYMOB_API_KEY`, `PAYMOB_HMAC_SECRET`, `JWT_SECRET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`

---

## 11. Domain and Hosting

- **Domain:** Teacher-facing subdomains (e.g., `chemistry.teacherplatform.com`)
- **SSL:** Elastic Beanstalk + Certificate Manager (free)
- **CDN:** CloudFront in front of S3 for PDF delivery (future optimization)

---

## 12. Key Architectural Decisions (Summary)

| ID    | Decision                                          | Rationale                                                                |
| ----- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| AD-1  | TypeScript full-stack (Express.js + React)        | Single language, type safety, developer velocity                         |
| AD-2  | Single-tenant shared database                     | All data belongs to one teacher; simple ownership model, no isolation overhead |
| AD-3  | pgvector for embeddings                           | No separate vector DB needed; saves cost and ops complexity              |
| AD-4  | Paragraph-level chunking for RAG                  | Simple, effective for study material PDFs                                |
| AD-5  | Shared RAG pipeline for AI Tutor + Quiz Generator | One embedding pipeline, two consumers; consistent content access         |
| AD-6  | Paymob iframe hosted checkout                     | PCI-compliant out of the box; simplest integration                       |
| AD-7  | Pre-signed S3 URLs for PDF access                 | Scalable, secure, no server bottleneck for downloads                     |
| AD-8  | Elastic Beanstalk for MVP                         | Managed platform, easy deploy from GitHub, sufficient for initial scale  |
| AD-9  | Per-student daily query cap on AI Tutor           | Cost control without breaking the feature's usefulness                   |
| AD-10 | Chapter-level enrollment unit                     | Students buy individual chapters a la carte; lifetime access per chapter |

---

## 13. Resolved Architecture Questions

| # | Question | Decision | Rationale |
|---|---|---|---|
| 1 | Background jobs / queue | **Synchronous for MVP** | PDFs at MVP scale are small (5-10 pages). Add Bull + Redis only if processing becomes a bottleneck |
| 2 | Monitoring / observability | **CloudWatch (included with EB) + Sentry free tier** | CloudWatch for infrastructure logs; Sentry for error tracking |
| 3 | Rate limiting | **Global 100 req/min per IP** via `express-rate-limit` | Prevents abuse with minimal overhead |
| 4 | PDF text extraction | **pdf-parse** (Node.js) | Free, sufficient for born-digital PDFs. Upgrade to AWS Textract in v2 if scanned docs become common |
