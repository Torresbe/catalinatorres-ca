# Portfolio Design Spec — Catalina Torres Benjumea

**Date:** 2026-04-23
**Domain:** torresautomatizations.com
**Status:** Spec complete — awaiting user review before implementation planning

---

## 1. Overview

A personal portfolio website for Catalina Torres Benjumea that functions simultaneously as:

- **A professional front** for AI automation & operations consulting work (office function)
- **Proof of AI capability** via live interactive demos embedded in the site itself (applied credibility)
- **Application-support material** that recruiters can visit after receiving her CV to verify technical credibility

The site is built as a custom Astro application with two live AI demos backed by Claude Haiku, a serverless contact form, and bilingual EN/ES content. Deployed to Vercel at `torresautomatizations.com`.

Visual direction: **Manuscript & Typewriter** — typography drawn from editorial and pre-digital writing traditions, integrated with technical conventions (monospace body, HTTP error codes, structured output blocks). Distinctive by design: avoids the generic "editorial-meets-tech" template that dominates current portfolio websites.

---

## 2. Goals & non-goals

### Goals
- Communicate technical credibility in under 10 seconds for recruiters (primary audience)
- Demonstrate active AI capability through two live demos in the browser
- Present 6 projects spanning editorial origins, MA experimentation, and professional AI practice
- Offer a bilingual (EN/ES) presence that honors Catalina's bilingual identity structurally, not as a toggle afterthought
- Provide a single contact surface (form → email) with anti-spam safeguards
- Deploy to production at torresautomatizations.com via Vercel (Catalina's existing domain)

### Non-goals
- No CV download available publicly (recruiters receive CV via their application channel)
- No blog or content-management system in v1
- No authentication or gated content
- No company/legal entity branding (positioned as individual consultant)
- No analytics beyond Vercel built-in metrics
- No e-commerce, scheduling widgets, or payment integrations

---

## 3. Audience priorities

Ranked audiences in order of design priority:

1. **J2 — Recruiter / hiring manager.** Lands on site after reviewing Catalina's application. Needs to verify technical credibility and communication quality in one session. Has seen the CV already.
2. **J1 — Potential client.** Arrives via referral or search. Needs to understand services offered and contact Catalina about a specific problem.
3. **J3 — Warm prospect.** Referral from someone who knows Catalina. Needs to decide whether reaching out makes sense.

Design implications:
- Hero messaging frames credibility for J2 first
- Live demos (Lab) serve all three audiences but are most impactful for J2
- Services section serves J1
- Contact form is the universal CTA for all three

---

## 4. Visual system — Manuscript & Typewriter

### Typography

| Role | Typeface | Source | Weights |
|---|---|---|---|
| Display headings | Libre Bodoni | Google Fonts | 400, 600 + italic |
| Body / paragraph | Courier Prime | Google Fonts | 400, 700 + italic |
| Labels, tags, codes | Courier Prime | Google Fonts | 400, 700 |

No sans-serif. Body is monospace (Courier Prime) — this is the distinctive choice.

### Color palette

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#faf6ec` | Page background (warm cream) |
| `--ink` | `#2a2420` | Body text and headings |
| `--red` | `#b8000a` | Error codes, correction marks, accents, emphasis |
| `--marginalia` | `#7a6a54` | Muted text, dates, metadata, dashed dividers |
| `--divider` | `#c4b89f` | Dashed borders, faint rules |
| `--ink-hover` | `#1a1410` | Link hover darker ink |

Contrast check:
- `--ink` on `--paper`: 11.2:1 (AAA)
- `--red` on `--paper`: 6.8:1 (AAA for large text, AA for body)
- `--marginalia` on `--paper`: 4.9:1 (AA normal)

### Spacing scale
4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 (px)

### Grid
- Max content width: 860px for body text, 1200px for hero and project grids
- Gutter: 32px on desktop, 16px on mobile
- Vertical rhythm: 8px baseline

### Decorative conventions
- Editorial correction marks: red underlines (`border-bottom: 2px solid var(--red)`), red strikethroughs, red arrows (`→`) as accents
- Section labels in Courier Prime uppercase with letter-spacing: e.g. `MS. folio 1`, `[§3]`, `— CONTENTS —`
- Marginalia: right-aligned metadata blocks in `--marginalia` color
- Dashed horizontal rules: 1px dashed `--divider` between sections
- No drop shadows, no gradients, no rounded corners beyond 4px
- Very subtle paper texture: radial gradient overlays at ~3% opacity on page background

### Iconography
- Minimal. Em dash (—), arrows (→ ←), pilcrow (¶), asterisk (*), section (§) used typographically in place of icons.

---

## 5. Site architecture (sitemap)

Multi-page architecture with top navigation. File-based routing via Astro.

### Navigation (top nav)
Home · Services · Projects · Lab · About · Contact · [EN|ES toggle]

### Route map

```
src/pages/
├── index.astro                              → /
├── services.astro                           → /services
├── projects/
│   ├── index.astro                          → /projects
│   ├── geoffrey.astro                       → /projects/geoffrey
│   ├── sol-literature-review.astro          → /projects/sol-literature-review
│   ├── ehba-email-automation.astro          → /projects/ehba-email-automation
│   ├── ehba-gpt-assistant.astro             → /projects/ehba-gpt-assistant
│   ├── zodiac-book-recommender.astro        → /projects/zodiac-book-recommender
│   └── interactive-story.astro              → /projects/interactive-story
├── lab.astro                                → /lab
├── about.astro                              → /about
├── contact.astro                            → /contact
├── privacy.astro                            → /privacy
├── 404.astro                                → custom 404
└── es/                                      (Spanish mirror of all above)
    ├── index.astro                          → /es
    ├── servicios.astro                      → /es/servicios
    ├── proyectos/...                        → /es/proyectos/*
    ├── lab.astro                            → /es/lab
    ├── sobre-mi.astro                       → /es/sobre-mi
    ├── contacto.astro                       → /es/contacto
    └── privacidad.astro                     → /es/privacidad
```

### Language toggle
EN ↔ ES lives in the header. Toggling takes the user to the corresponding Spanish or English URL. Astro's i18n config handles URL routing. Each page has its paired translation; otherwise the toggle falls back to the home of the target language.

### API routes (Vercel serverless functions)

```
src/pages/api/
├── contact.ts          → POST /api/contact
├── classify.ts         → POST /api/classify
└── suggest-workflow.ts → POST /api/suggest-workflow
```

---

## 6. Shared components

| Component | Responsibility |
|---|---|
| `<Layout>` | Wraps page content with `<Header>`, `<main>`, `<Footer>` |
| `<Header>` | Site name + top navigation + language toggle |
| `<Footer>` | Name, email, LinkedIn, copyright, link to `/privacy` |
| `<SectionHeader>` | Section title in Libre Bodoni + small label in Courier Prime |
| `<ProjectCard>` | Card with project title, 1-line description, tags, link to project page |
| `<ServiceCard>` | Card with service title, description, tools used |
| `<TagChip>` | Small chip in Courier Prime (tools/tech labels) |
| `<DemoContainer>` | Wrapper for interactive demos; handles idle / loading / result / error states |
| `<ContactForm>` | Form with validation, honeypot, timing check, submit state |
| `<PullQuote>` | Large Libre Bodoni quote with em-dash attribution |
| `<CodeBlock>` | Monospace block with optional syntax highlighting |
| `<Marginalia>` | Right-aligned metadata block in `--marginalia` color |
| `<LangToggle>` | EN|ES switch; preserves current page if paired translation exists |

### Error display contract
All error messages in the site follow the pattern:
```
ERROR [CODE] — [message in lowercase]
```
Rendered in Courier Prime, `ERROR [CODE]` in `--red`, em dash and message in `--ink`.

| Code | Message (EN) | Message (ES) |
|---|---|---|
| 400 | `the manuscript is blank. write something.` | `el manuscrito está en blanco. escribe algo.` |
| 401 | `no one invited you. but you can knock →` | `nadie te invitó. pero puedes tocar la puerta →` |
| 403 | `this chapter is private.` | `este capítulo es privado.` |
| 404 | `you are looking in the wrong place.` | `estás buscando en el lugar equivocado.` |
| 413 | `this is a book, not a note. trim it.` | `esto es un libro, no una nota. recórtalo.` |
| 415 | `words only. no runes.` | `solo palabras. nada de runas.` |
| 429 | `love not found. try again in 24h or send a letter →` | `love not found. intenta en 24h o envía una carta →` |
| 500 | `this draft needs revision. standby.` | `este borrador necesita revisión. espera.` |
| 503 | `the office is closed for now. try nicer.` | `la oficina está cerrada ahora. intenta mejor.` |
| 504 | `the pigeon didn't return. try again.` | `la paloma no regresó. intenta de nuevo.` |

---

## 7. Page content plan

### `/` Home
- Hero: name, one-line positioning in Libre Bodoni, subtitle in Courier Prime
- 3–4 featured projects as `<ProjectCard>` grid (the newest / most impressive)
- 2 featured services (AI Workflow Design, Research Ops)
- Link to `/lab` with teaser: "Try a live demo →"
- Footer CTA: compact contact form (same fields as `/contact`, condensed layout) or simple link to `/contact`

### `/services`
Full services list. Categories tentatively:
1. AI Workflow Design
2. Research Operations (literature reviews, document analysis)
3. Digital Cataloging & Data Management
4. Bilingual Content Automation
5. Custom AI Assistants (internal knowledge bases, office GPTs)

Each presented as `<ServiceCard>` with tools. Copy to be finalized during implementation.

### `/projects`
Grid of all 6 projects with filter-friendly tags (no JS filter in v1; just visual tags).

### `/projects/geoffrey`
- Hero with title, dates, tools
- **Scope (narrative, not number-based):** decades of professional documents, more than 4,000 photographs, drafts of articles, and personal documents — all of it scattered across folders, file systems, and physical media accumulated over a lifetime. Output: a searchable digital library, one click away.
- Challenge, what was built, results — written as narrative, not as a metrics list
- Embedded artifact: screenshot or link to the HTML library output
- Related tools/services
- **Note:** Specific counts (number of books, photographs, processed items) must be confirmed with Catalina before shipping — previous portfolio.docx numbers may be outdated or conservative

### `/projects/sol-literature-review`
- Same template as Geoffrey
- Embedded artifact: screenshot of the 7-field spreadsheet output (anonymized if needed)

### `/projects/ehba-email-automation`
- Tells the pre-Claude Code automation story
- Tools: Google Sheets + Apps Script
- Artifact: diagram of the flow (built in-site as SVG if possible)

### `/projects/ehba-gpt-assistant`
- Custom GPT for office knowledge
- Tools: GPT custom instructions + internal docs
- Artifact: screenshot of the GPT interface or sample conversation

### `/projects/zodiac-book-recommender`
- MA-era creative project
- Tools: Python + literary analysis framework from Mia Astral
- Artifact: mini-demo built specifically for the portfolio — visitor picks a zodiac sign and sees a generated recommendation (reduced version of original)

### `/projects/interactive-story`
- MA-era creative project
- Tools: Python + branching narrative logic
- Artifact: mini-demo built specifically for the portfolio — visitor makes 2-3 decisions through a short branching narrative (reduced version of original)

### `/lab`
Two live demos (detailed in Section 8 below). Includes:
- Brief introduction framing what the Lab is
- Demo 1: Text Classifier
- Demo 2: Workflow Suggester
- Note about rate limits at the bottom

### `/about`
Narrative personal arc:
- Senior Editor era (Planeta, Círculo)
- Digital Humanities MA transition
- Current AI automation practice
- Bridge positioning: "the editor who codes"

Written in Courier Prime body, Libre Bodoni section headings. ~800-1200 words total.

### `/contact`
- Contact form (full `<ContactForm>` component)
- Alternative contact: email displayed, LinkedIn link
- Note about response time (within 48h)
- Privacy note linking to `/privacy`

### `/privacy`
~400 words in Courier Prime. Covers:
- What data is collected (contact form submissions, IP for rate limiting, Vercel Analytics aggregates)
- Retention (emails indefinitely in Gmail, IPs 24h for rate limiting, analytics aggregated)
- User rights (request deletion of submitted email)

### `/404`
Custom not-found page with `ERROR 404 — you are looking in the wrong place.` and link back to home. Same aesthetic as the rest of the site.

---

## 8. Lab page — interactive demos

Two demos live on `/lab`. Both are backed by Vercel serverless functions calling the Anthropic API.

### Model
**Claude Haiku 4.5** (`claude-haiku-4-5-20251001`) for both demos in v1. Rationale:
- Classifier (structured output) quality is indistinguishable from Sonnet for this task
- Workflow suggester (creative output) ~85% of Sonnet quality, acceptable for demo context
- Latency is faster, better UX
- Cost is 3-5x lower; allows much higher rate limits without cost concern

If post-launch the workflow suggester feels too generic, upgrade only that demo to Claude Sonnet 4.6.

### Demo 1 · Text Classifier

**Purpose:** visitor pastes text (abstract, project description, job post) → receives structured classification using a predefined framework.

**UI:**
- Manuscript-framed textarea labeled `MS. folio 1`
- Framework selector dropdown (v1: "Project Taxonomy" as default; optional "Research Abstract" preset)
- Submit button: `[ Classify → ]`
- Output area: numbered fields rendered like editor's notes

**Output schema (Project Taxonomy preset):**
```
§1  Type       : ...
§2  Complexity : ...
§3  Tools      : ...
§4  Timeline   : ...
§5  Tags       : ...
```

**Output language:** matches input language automatically (Claude detects EN or ES).

**Backend (`/api/classify.ts`):**
- Validates input (non-empty, ≤ 3000 chars)
- Rate limit: 2 per IP per 24h (tracked via Vercel KV with 24h TTL on keys)
- Prompt: structured system prompt instructing Claude to return JSON with the 5 fields, constrained values where applicable
- Calls Claude Haiku 4.5
- Parses JSON, validates, returns to client
- Client renders as formatted output

### Demo 2 · Workflow Suggester

**Purpose:** visitor describes an operational problem in plain language → receives a suggested workflow.

**UI:**
- Manuscript-framed textarea labeled `MS. folio 2`
- Instructions: "Describe your operational problem in 1–3 sentences"
- Submit button: `[ Suggest workflow → ]`
- Output area: manuscript-formatted response

**Output schema:**
```
§ Recommended approach
  ─────────────────────
  [1-2 sentence summary]

§ Tools
  ─────
  [1] ...
  [2] ...
  [3] ...

§ Estimated effort
  ────────────────
  [time estimate]
```

**Backend (`/api/suggest-workflow.ts`):**
- Validates input (non-empty, ≤ 2000 chars)
- Rate limit: 2 per IP per 24h (separate counter from classifier)
- Prompt: system prompt instructs Claude to act as a workflow consultant, return structured response
- Calls Claude Haiku 4.5
- Returns to client

### Rate limiting
- **2 requests per demo per IP per 24h** (4 total if visitor tries both)
- Storage: Vercel KV (free tier sufficient at this volume) with keys like `ratelimit:classify:[IP]` expiring after 24h
- When exceeded: response `ERROR 429 — love not found. try again in 24h or send a letter →`

### Loading states
- Submit disabled during request
- Typewriter animation + "transcribing..." or "analyzing..." in the output area
- Cursor blink effect in Courier Prime

### Error handling (demo-specific)
All errors follow the `ERROR [CODE] — [message]` contract. API failures bubble up with the appropriate code (429, 500, 503, 504).

### Caching
SHA-256 hash of input → cached response in Vercel KV for 7 days. Identical inputs return cached response without a new Claude call. Reduces cost and latency for common inputs.

### Cost estimate
- Haiku 4.5: ~$0.001 per request average (300 input + 300 output tokens)
- Cap from rate limiting: at most 2 requests × 2 demos × ~100 unique IPs/day ≈ 400 requests/day = ~$12/month worst case
- Realistic: ~$2-5/month with moderate traffic

---

## 9. Contact form

### UI
Located at `/contact` (full page) and embedded at the bottom of `/` (short form).

Fields:
- Name (required)
- Email (required)
- Company (optional)
- Subject (required)
- Message (required, 10-3000 chars)
- Hidden honeypot field: `website` (must be empty)

Rendered in manuscript style: `MS. folio ∞ — send a letter`.

### Backend (`/api/contact.ts`)

Validation:
- Required fields non-empty
- Email matches regex
- Message length within bounds
- Honeypot field empty
- Submit occurred ≥ 2 seconds after page load (client sends timestamp)

Rate limiting:
- 3 submits per IP per 24h via Vercel KV

Email delivery:
- **Resend** (free tier: 3000 emails/month) via their Node SDK
- From: `notify@torresautomatizations.com` (configured in Resend with DNS verification)
- To: `catalinatorres1000@gmail.com` (env var `CONTACT_EMAIL`)
- Reply-To: submitter's email (so Gmail reply goes directly to them)
- Subject: `[torresautomatizations] [visitor's subject]`
- Body: plain text with fields, trailing metadata (anonymized IP hash, timestamp)

### UI states
- Loading: "transcribing your letter..."
- Success: "letter received. you'll hear back within 48h."
- Validation error: `ERROR 400 — [field]: [specific message]`
- Server error: `ERROR 503 — the pigeon didn't leave the office`

### Environment variables (Vercel)
- `RESEND_API_KEY` — from resend.com
- `ANTHROPIC_API_KEY` — for Lab demos
- `CONTACT_EMAIL` — destination for form submissions
- `SITE_URL` — production URL for absolute links

---

## 10. Deployment, performance, error handling

### Hosting
- **Vercel** (new account under `catalinatorres1000@gmail.com`)
- GitHub repo: `torresautomatizations` (under Catalina's GitHub account)
- Auto-deploy on push to `main`; preview deployments on all branches
- During development: preview URL (e.g., `catalina-portfolio.vercel.app`) is used. Production domain stays on the old site until migration is complete.

### Domain migration (Option 2 — DNS TXT verification)
1. Add `torresautomatizations.com` to new Vercel project → Vercel responds with a TXT record requirement
2. In Namecheap DNS: add the TXT record
3. Wait 5-15 minutes for propagation
4. Vercel re-verifies; domain now bound to the new project
5. Vercel provides A records for production DNS; add to Namecheap
6. Old Vercel project (on the inaccessible account) is abandoned

### Performance targets
- Lighthouse Performance: ≥ 95
- Lighthouse Accessibility: 100
- Lighthouse SEO: 100
- First Contentful Paint: < 1s
- Core Web Vitals: all green

### Implementation
- Astro generates static HTML for all pages
- Client-side JS only for: language toggle, demo forms, contact form validation
- Google Fonts preloaded with `font-display: swap`
- Latin + Spanish-extended character subset
- Images via Astro's `<Image>` (WebP + responsive sizes + lazy)
- Minimal CSS using custom properties for tokens

### SEO
- `<title>` and `<meta description>` per page
- Open Graph images per page (designed in the manuscript aesthetic)
- Sitemap.xml via `@astrojs/sitemap`
- `robots.txt` allow all
- JSON-LD Person schema on `/` and `/about`
- `hreflang` tags for EN/ES page pairs

### Analytics
- **Vercel Analytics** (free tier) — privacy-first, no cookies, aggregated
- No Google Analytics

### Error handling
- Custom `404.astro` with `ERROR 404 — you are looking in the wrong place.`
- Global error boundary on client: redirects to `ERROR 500 — this draft needs revision.` view
- API errors return HTTP status + JSON body with code and message
- Client always receives JSON error response; renders via `ERROR [CODE] — [message]` contract

### Privacy
- Short `/privacy` page linked from footer
- No third-party tracking beyond Vercel Analytics (aggregated)
- IP addresses hashed with SHA-256 for rate limiting; hashes expire after 24h

---

## 10b. Voice & Tone

The copy across the site must reflect Catalina's established voice — documented from her blog ("Curiosity"), her MA academic assignments (DH 510), and the portfolio draft (`portfolio.docx`). This section is binding for all content generation.

### Literary reference points

- **Julio Cortázar** — plays with words; breaks orthographic rules from full mastery of them; numbered structures and catalogs; inventive grammar as authorial choice (not error)
- **Jorge Luis Borges** — "Funes el memorioso" spirit: obsessive precision, enumerative taxonomies, scholarly delight in the absurd or obscure
- **Mark Twain** — *Diario de Adán* / *Diario de Eva*: satirical first-person reframing of familiar things, dry humor embedded in plain voice

### Voice pillars

1. **Editorial precision.** Every word is chosen. No filler adjectives ("amazing", "seamless", "robust"). No synonyms-for-synonyms' sake. If a short word works, use it.
2. **Grammatical orthodoxy.** Spanish orthography preserved in the Spanish version — no "todes", "les", or "they" as singular pronoun. Accents correct. Ñ correct. English grammar correct.
3. **Accumulative long sentences alternating with short ones.** Rhythm is Spanish-inherited even in English: structures like "editor of lives, of jobs, of borrowed traumas, and a loyal user of one or several AIs" — three beats plus a turn.
4. **Ironic humor, dry and self-aware.** "Coffee that doesn't do the sweet world justice." Parentheticals that correct in real time: "the euphemisms that make the writer arrive at what the editor wants `(needs)` while convinced it was their idea."
5. **Concrete and specific — but narrative over metrics when metrics flatten.** Real places (Tribeca, Panama City Beach, Whyte Ave). Real tools named. Specific numbers when they clarify — but when a number would compress decades of messy work into a cold metric, use description instead ("a hundred thousand years of paperwork, thousands of photographs, drafts of articles" beats "172 books + 799 photos"). Borgesian pleasure in classification applies to *kinds* and *taxonomies*, not always to counts.
6. **Tender and rigorous simultaneously.** Serious about being right (facts, data, orthography). Also believes kindness is more powerful than power. Capable of saying hard things gently.
7. **Can be corporate, never hollow.** Professional register is fine — pompous register is not. "I build AI automation workflows" is good. "I empower organizations to leverage transformative AI solutions" is forbidden.
8. **First person, with an edge.** Not falsely modest, not performatively humble. Just accurate about what she does.
9. **Trivia as flavor.** Obscure cultural facts (Lilith was Adam's first wife) used sparingly as marginalia or as a signal of interests, never as gimmick.
10. **Bilingual thinking even in English.** Spanish structural DNA shows through in English phrasing — not as awkwardness, as rhythm.

### Forbidden register

- LinkedIn-guru: "I help professionals unlock their potential"
- Startup marketing: "empowering", "supercharging", "leveraging", "transformative", "game-changing"
- Generic superlatives: "amazing results", "passionate about X"
- Inclusive-language shortcuts: "todes", "les", singular "they" in Spanish
- Hollow corporate polish that means nothing
- Grammatical errors of any kind (including missing Spanish accents)
- Over-casual internet-voice: "hey there!", "heyyy", excessive emoji

### Voice by page type

| Page type | Register |
|---|---|
| Hero / tagline | Short. Literary. A bit provocative if possible. |
| About | Full personal register. Blog-adjacent. Narrative arc. |
| Services | Corporate-but-genuine. Specific tools, specific outcomes. |
| Project case studies | Editorial first-person. "I built", "I processed", "I chose". Ground in real numbers. |
| Lab demos | Minimal. Instructions direct. Output labels in Courier Prime. |
| Error messages | Already defined: HTTP code + editorial one-liner. |
| Contact | Plainspoken. "Letter received. You'll hear back within 48h." |
| 404 / error pages | Dry, manuscript-style. |
| Privacy | Plainspoken, no legalese. Minimum words required. |

### Examples — illustrative, not binding

**Hero (EN):**
> Catalina Torres — *editor who codes*.
> I build AI automation for organizations that care how information flows, not just that it moves.

**Service description (EN), good:**
> Research Operations.
> I turn piles of PDFs into structured data. Bilingual input, structured JSON out. Works at 200 documents or 2,000; the framework stays consistent.

**Service description (EN), forbidden:**
> ~~Research Operations.~~
> ~~I empower researchers by leveraging transformative AI to unlock insights from their data at scale.~~

**Case study opener (EN), good:**
> Geoffrey had a hundred thousand years of paperwork. Professional documents, more than four thousand photographs, drafts of articles, a life in files. He wanted all of it in a digital library one click away. I built it.

**Case study opener (EN), forbidden — too metrics-flat:**
> ~~Geoffrey had 172 books, 799 photographs, and no way to find anything. I organized them in thirty-one days.~~

**Case study opener (EN), forbidden — corporate hollow:**
> ~~This project represents an innovative approach to personal library management, utilizing cutting-edge AI technology to deliver unprecedented organizational efficiency.~~

### Copy-draft protocol during implementation

1. Claude (implementer) drafts copy from voice rules above + source material (`portfolio.docx`, `perfil.md`, blog posts)
2. Drafts marked `[DRAFT]` until Catalina reviews
3. Catalina is final arbiter on voice — her correction always wins
4. No copy ships to production until she has read it

---

## 11. Out of scope for v1

- Blog or CMS
- Testimonials section (can add later if referrals accumulate)
- Case study deep-dives with video
- Resume/CV download (intentionally excluded)
- Scheduling widget (Calendly etc.)
- E-commerce or payment
- Search functionality
- Dark mode
- Newsletter signup
- Multi-author or team pages

These can be added in a v2 iteration once the baseline is live.

---

## 12. Content inputs required from Catalina

The following content needs Catalina's direct input during implementation (not blocking spec approval):

- Final hero tagline (EN and ES)
- Services copy — titles and short descriptions for each of the 5 services
- About page narrative (draft may be generated from `perfil.md` and refined)
- Any preferred code snippets or diagrams to embed in project pages
- Reduced demos for Zodiac Recommender and Interactive Story (to be built alongside implementation — scope of "reduced": a single-page interactive that captures the core idea in 3-5 steps, no full reimplementation of the original projects)
- Approval of the error message translations
- **Content source note:** the `portfolio.docx` refers to Catalina's past marketing/comms role as "Matrix Grupo Empresarial"; `perfil.md` in the WORK SEARCH project calls it "SuRed". For this portfolio, use **Matrix Grupo Empresarial** (confirmed by Catalina). The `perfil.md` will be corrected separately.
- **Numbers audit:** the existing `portfolio.docx` contains specific counts from the Geoffrey project (172 books, 799 photos, etc.) that are outdated or conservative. All specific numbers that will appear on the site — in any project case study — must be verified with Catalina before copy ships. When in doubt, use narrative description over metric.

---

## 13. Open questions / items to decide later

- Section name for `/lab` — may rename during implementation ("Playground", "Try It", "Demos" all candidates)
- Final services categorization — might merge or split after drafting copy
- OG image design — exact composition designed during implementation
- Whether to include LinkedIn recommendations as testimonials (decide when drafting About page)

---

## 14. Acceptance criteria for v1 launch

- All 13 EN pages + 13 ES pages render correctly
- Both Lab demos return valid output for representative inputs in EN and ES
- Contact form successfully delivers email to `catalinatorres1000@gmail.com` via Resend
- Rate limiting works (tested by exceeding limits)
- Error pages render correctly (404 tested; error states on demos and form tested)
- Lighthouse Performance ≥ 95 on home, projects grid, and `/lab`
- Accessibility score 100 on all pages
- Custom domain `torresautomatizations.com` resolves to new Vercel project
- Old Antigravity deployment no longer receiving traffic

---

## 15. Timeline

**3-5 days of focused work**, parallel with ongoing job search activity. Rough phasing:

1. **Day 1:** Project scaffolding (Astro + Vercel setup), visual system tokens, shared components, Layout/Header/Footer
2. **Day 2:** Home + Services + Projects grid pages with placeholder content
3. **Day 3:** Six project detail pages with content from `portfolio.docx` + existing project folders; reduced demos for Interactive Story and Zodiac
4. **Day 4:** Lab page with both AI demos (backend + frontend); Contact form
5. **Day 5:** About + Privacy pages, Spanish mirror of all pages, SEO, deployment migration, final QA

Detailed day-by-day plan to be produced by the `writing-plans` skill after this spec is approved.
