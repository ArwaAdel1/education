# Addendum — Teacher AI Academy PRD

*Overflow content, competitive analysis, technical context, and details that support the PRD without bloating its main narrative.*

---

## A. Competitive Landscape

| Competitor | Model | Position | Threat Level |
|---|---|---|---|
| **Nagwa** | B2C content + live classes + AI study tools (Nagwa Stax) | Largest Egyptian edtech; own curriculum, not a teacher platform | 🟡 Medium — indirect competitor for student attention |
| **Nafham** (acquired by Tyro) | Free Arabic video lessons | Large library, but not a platform teachers can brand or monetize | 🟢 Low |
| **Noon Academy** (Saudi) | Marketplace connecting tutors to students | $41M funded; strong in KSA, weaker in Egypt; marketplace model doesn't let teacher own their brand | 🟡 Medium |
| **Orcas** (Egypt) | Tutoring marketplace (online + offline) | Local presence but marketplace, not branded LMS | 🟢 Low |
| **Mentevo** (Egypt) | Arabic LMS with local payments | Closest direct competitor — Arabic UI, local gateways, built for MENA | 🟡 Medium-High |
| **Teachable / Thinkific / Kajabi** | International course platforms | Polished but USD pricing ($36-143/mo ≈ 1100-4400 EGP), no Paymob, English-first UI | 🟡 Medium (indirect) |
| **EzyCourse** | White-label LMS | Feature-rich but USD pricing, not Egypt-specialized | 🟢 Low |
| **WhatsApp / Facebook / YouTube** | Free ad-hoc tools | Zero cost but no payments, no structure, no AI, no analytics | 🟢 Low (status quo) |

**Key insight:** Mentevo is the closest direct competitor. To differentiate, Teacher AI Academy must lead on **AI features** (RAG tutor + quiz generator) that Mentevo doesn't appear to offer, and compete on **pricing** and **teacher-branding autonomy**.

---

## B. Technical Architecture Context

### B.1 Single-Tenant Architecture

- Shared codebase, single deployment per teacher instance
- No tenant isolation layer — all data belongs to the single teacher and their students
- Data ownership is enforced through standard foreign key relationships (teacherId, studentId) at the Prisma query level
- User context (role: teacher/student) is established at authentication and passed via Express.js middleware

### B.2 RAG Pipeline (AI Tutor)

- **Embedding model:** Choose Arabic-capable embedding model (e.g., `intfloat/multilingual-e5-large` or Gemini embedding API)
- **Vector store:** Lightweight option — pgvector (PostgreSQL extension) to keep infra simple; upgrade to Pinecone/Weaviate if scale demands
- **LLM:** Gemini API for generation
- **Chunking strategy:** PDFs and lesson descriptions chunked by section/paragraph; YouTube transcripts (if available) as additional context
- **Re-indexing trigger:** When teacher adds/edits content, only the affected chunks are re-processed
- **Rate limiting / cost controls:** Per-student daily query cap, per-teacher monthly budget cap

### B.3 AI Quiz Generator Pipeline

- Quiz parameters passed as structured prompt to Gemini
- Teacher's content (relevant chapters/topics) injected as context
- Output formatted as structured JSON (questions, options, correct answers, type)
- Teacher reviews in a WYSIWYG editor before saving

### B.4 Paymob Integration Notes

- Paymob offers: hosted iframe checkout, mobile wallets (Vodafone Cash, Orange Money, Etisalat Flous), card payments, Meeza
- Integration path: Paymob's iframe/hosted checkout — simplest, PCI-compliant out of the box
- Webhook endpoint to receive transaction callbacks and activate enrollment
- Test environment available before going live

---

## C. Pricing Model Deep Dive

### C.1 Student Pricing (Set by Teacher)

- Model: Student pays **per chapter per month** → gets **lifetime access** to that specific chapter-month
- Teacher sets price per chapter (e.g., 50 EGP for Chapter 3 of Second Year Secondary)
- Student can buy individual chapters a la carte within a stage
- Each purchased chapter-month is individually recorded in the student's profile
- Student Dashboard has two views: **My Courses** (purchased chapters) and **All Content** (full tree, chapters locked/unlocked)

### C.2 Teacher Pricing (Paid to Platform)

- Subscription tiers: Monthly / Quarterly / Annual
- Seasonal bundles for high school exam seasons (e.g., "Second Term Bundle" — 4 months for price of 3)
- Empty — needs pricing confirmed

---

## D. Risk Register

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Arabic RAG accuracy below acceptable threshold | Medium | High | Benchmark Gemini + Arabic embedding models early; have fallback for "I couldn't find an answer" |
| Paymob integration delays | Medium | High | Start Paymob integration as earliest technical dependency |
| Teacher churn after month 1 | Medium | High | Onboarding wizard, content migration assistant, WhatsApp support group for teachers |
| Lifetime access cost liability | Medium | Medium | Model storage/bandwidth costs vs. one-time payment; cap at 3 years unless renewed |
| Students prefer WhatsApp groups over platform | Medium | Medium | Ensure mobile-web experience is faster than WhatsApp for finding materials |
| Low AI quiz adoption due to quality concerns | Medium | Medium | Teacher-in-the-loop editing; surface "most used" prompt templates |

---

## E. Design Guidelines (Aesthetic & Tone)

- **Visual:** Clean, modern, mobile-first. Arabic typography priority (support Arabic web fonts).
- **Color scheme:** Teacher-customizable (brand colors for their academy). Default: calm palette (blues/teals), not "cartoonish edtech."
- **Tone:** Warm, supportive, professional. Arabic copy should feel native, not translated.
- **Language toggle:** Prominent AR/EN switcher in top nav.

---

## F. Platform Requirements

- **Web:** Responsive web application (mobile-first). PWA capabilities (offline access to materials — deferred to v2).
- **Browser support:** Chrome, Safari, Firefox — latest 2 major versions. These cover >98% of Egyptian mobile browser usage.
- **Performance:** Lighthouse mobile score >70; dashboard loads <2s on 3G.
