# Portfolio Iteration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the post-launch iteration changes specified in [`docs/superpowers/specs/2026-05-04-portfolio-iteration-design.md`](../specs/2026-05-04-portfolio-iteration-design.md): redesign mobile nav, restructure contact page around chip CTAs, reduce `/lab` to a single demo with personal-voice copy, eliminate Claude brand mentions from public pages, rewrite the 429 error, add academic credentials to about, remove rate-limit text.

**Architecture:** Touch only what each spec section requires; preserve existing tokens, components, i18n structure, and SSR patterns. Backend changes are constant bumps and string updates only — no schema redesigns. Tests evolve in lockstep with each change so the suite stays green throughout.

**Tech Stack:** Astro 6 (TypeScript strict), Vercel KV (rate limit), Resend (email), Vitest (unit), Playwright (e2e).

---

## File map

**Modify:**
- `src/components/Header.astro` — remove hamburger, add scrolling section strip on mobile
- `src/components/WorkflowDemo.astro` — folio label "2" → "1"
- `src/components/ContactForm.astro` — form folio label "send a letter" → "message"
- `src/lib/claude.ts` — remove `classifyText`, `ClassifyResult`, `CLASSIFY_SYSTEM`
- `src/lib/errors.ts` — 429 strings include HTML anchors
- `src/pages/lab.astro` — remove ClassifierDemo, new title + lede + pixel heart, chip row
- `src/pages/es/lab.astro` — mirror
- `src/pages/contact.astro` — title + chip row + form (remove aside)
- `src/pages/es/contacto.astro` — mirror
- `src/pages/about.astro` — last paragraph rewrite
- `src/pages/es/sobre-mi.astro` — mirror
- `src/pages/api/suggest-workflow.ts` — `DEMO_LIMIT` 2 → 3
- `tests/unit/claude.test.ts` — remove `classifyText` describe block
- `tests/e2e/mobile-audit.spec.ts` — replace hamburger tests with visibility-of-strip tests
- `tests/e2e/smoke.spec.ts` — remove classifier test

**Delete:**
- `src/components/ClassifierDemo.astro`
- `src/pages/api/classify.ts`

**Create:**
- `tests/unit/errors.test.ts` — verify 429 message structure
- `tests/e2e/no-brand-mentions.spec.ts` — regression guard for brand leakage

---

## Task 1: About page — academic credentials

Smallest, fully isolated change. No test impact. Good warm-up.

**Files:**
- Modify: `src/pages/about.astro:40-42`
- Modify: `src/pages/es/sobre-mi.astro:40-42`

- [ ] **Step 1: Rewrite last paragraph in `/es/sobre-mi.astro`**

In `src/pages/es/sobre-mi.astro` replace lines 40–42 (the closing `<p>`) with:

```astro
    <p>
      Tengo un pregrado en comunicación social con énfasis en producción editorial y maestría en humanidades digitales en la U de Alberta. Hablo inglés y español con fluidez. Vivo en Edmonton, Alberta. Estoy disponible para consultoría freelance, contratos por proyecto y posiciones a tiempo completo en automatización de operaciones o implementación de IA.
    </p>
```

- [ ] **Step 2: Rewrite last paragraph in `/about.astro`**

In `src/pages/about.astro` replace lines 40–42 with:

```astro
    <p>
      I hold a BA in Social Communication with a focus on editorial production, and an MA in Digital Humanities from the University of Alberta. I am fluent in English and Spanish. I live in Edmonton, Alberta. I am available for freelance consulting, short-term contracts, and full-time roles in operations automation or AI implementation.
    </p>
```

- [ ] **Step 3: Build to verify nothing broke**

Run: `npm run build`
Expected: clean build, no TypeScript errors, no Astro warnings new from this change.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/es/sobre-mi.astro
git commit -m "feat: add academic credentials to about page closing paragraph"
```

---

## Task 2: Rate limit bump 2 → 3

**Files:**
- Modify: `src/pages/api/suggest-workflow.ts:8`

- [ ] **Step 1: Bump constant**

In `src/pages/api/suggest-workflow.ts` change line 8:

```ts
const DEMO_LIMIT = 3;
```

(was `const DEMO_LIMIT = 2;`)

- [ ] **Step 2: Run unit tests**

Run: `npm run test`
Expected: all 22 (or current count) tests pass. No test references `DEMO_LIMIT` directly.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/pages/api/suggest-workflow.ts
git commit -m "feat: bump workflow demo rate limit from 2 to 3 per IP per 24h"
```

---

## Task 3: ERROR 429 with active LinkedIn + email links

The 429 message changes from a single text string to one with two anchor tags. Inline HTML is the simplest approach: existing `renderError` functions interpolate `${msg}` directly without escaping, so HTML in the message renders.

**Files:**
- Modify: `src/lib/errors.ts:13,25`
- Create: `tests/unit/errors.test.ts`

- [ ] **Step 1: Write failing test for 429 EN**

Create `tests/unit/errors.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { errorMessages } from '@lib/errors';

describe('errorMessages 429', () => {
  it('en 429 contains opening line and two links', () => {
    const msg = errorMessages.en[429];
    expect(msg).toContain('i gave you everything');
    expect(msg).toContain('href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/"');
    expect(msg).toContain('target="_blank"');
    expect(msg).toContain('rel="noopener noreferrer"');
    expect(msg).toContain('href="/contact"');
    expect(msg).toContain('linkedin →');
    expect(msg).toContain('email →');
  });

  it('es 429 contains opening line and two links pointing to /es/contacto', () => {
    const msg = errorMessages.es[429];
    expect(msg).toContain('te di todo lo que tenía');
    expect(msg).toContain('href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/"');
    expect(msg).toContain('href="/es/contacto"');
    expect(msg).toContain('linkedin →');
    expect(msg).toContain('email →');
  });

  it('does not mention "letter" / "carta" anymore in 429', () => {
    expect(errorMessages.en[429]).not.toMatch(/letter/i);
    expect(errorMessages.es[429]).not.toMatch(/carta/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- errors`
Expected: FAIL — current 429 text is "love not found / amor no encontrado", missing the new strings.

- [ ] **Step 3: Update 429 strings in errors.ts**

In `src/lib/errors.ts` change lines 13 and 25:

```ts
// line 13 (en):
429: 'i gave you everything. <a href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/" target="_blank" rel="noopener noreferrer">linkedin →</a> or <a href="/contact">email →</a> for more',

// line 25 (es):
429: 'te di todo lo que tenía. <a href="https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/" target="_blank" rel="noopener noreferrer">linkedin →</a> o <a href="/es/contacto">email →</a> para más',
```

- [ ] **Step 4: Add a comment about the inline HTML**

Above the `errorMessages` const in `src/lib/errors.ts`, add this short comment so future readers know why one entry has HTML:

```ts
// 429 contains inline HTML anchors. Renderers interpolate the message via ${msg}
// without escaping; non-429 codes are plain strings.
export const errorMessages: Record<'en' | 'es', Messages> = {
```

- [ ] **Step 5: Run tests**

Run: `npm run test -- errors`
Expected: PASS (3 tests).

Then run the full unit suite to verify no regression: `npm run test`
Expected: all pass.

- [ ] **Step 6: Manual visual sanity check**

Run: `npm run dev`
Open `http://localhost:4321/lab`. (Note: locally /api/suggest-workflow returns 500 because no env vars — but if you fake a 429 by editing the response in DevTools, you can confirm the markup renders the two links. Skip if not feasible; the unit test covers the structure.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/errors.ts tests/unit/errors.test.ts
git commit -m "feat: rewrite 429 error to point at linkedin and email links"
```

---

## Task 4: Delete the Classifier (atomic multi-file)

The Classifier demo is being removed. All its surfaces — component, API endpoint, library function, unit tests, e2e smoke test — must come down together so the build and tests stay green at every step. Order matters: remove **callers** first, then the **definitions**, so TypeScript doesn't fail mid-task.

**Files:**
- Modify: `src/pages/lab.astro` (remove import and usage of `<ClassifierDemo />`)
- Modify: `src/pages/es/lab.astro` (mirror)
- Delete: `src/components/ClassifierDemo.astro`
- Delete: `src/pages/api/classify.ts`
- Modify: `src/lib/claude.ts` (remove `classifyText`, `ClassifyResult`, `CLASSIFY_SYSTEM`)
- Modify: `tests/unit/claude.test.ts` (remove the entire `describe('classifyText', ...)` block)
- Modify: `tests/e2e/smoke.spec.ts` (remove the classifier error-path test)

- [ ] **Step 1: Remove classifier from `/es/lab.astro`**

In `src/pages/es/lab.astro`:

```astro
---
import Layout from '../../components/Layout.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import WorkflowDemo from '../../components/WorkflowDemo.astro';
---
<Layout title="Lab" description="Una herramienta que sugiere flujos a partir de un problema operativo.">
  <SectionHeader label="[§4] LAB" title="Prueba las herramientas" subtitle="Dos herramientas pequeñas con Claude. Escribe un texto, recibe salida estructurada. Limitado a dos peticiones por herramienta cada 24 horas — suficiente para ver cómo funcionan." />
  <WorkflowDemo />
  <p class="marginalia">
    Límite: 2 peticiones por herramienta cada 24h por IP. Si lo alcanzas, vuelve mañana o <a href="/es/contacto">envía una carta →</a>.
  </p>
</Layout>
```

(removed `ClassifierDemo` import and `<ClassifierDemo />`. The subtitle and marginalia still mention "Claude" and "2 peticiones" — Task 5 will replace them.)

- [ ] **Step 2: Remove classifier from `/lab.astro`** (mirror)

In `src/pages/lab.astro`:

```astro
---
import Layout from '../components/Layout.astro';
import SectionHeader from '../components/SectionHeader.astro';
import WorkflowDemo from '../components/WorkflowDemo.astro';
---
<Layout title="Lab" description="A tool that suggests workflows from an operational problem.">
  <SectionHeader label="[§4] LAB" title="Try the tools" subtitle="Two small Claude-backed tools. Enter text, get structured output. Rate-limited to two requests per tool per visitor per 24 hours — enough to see how they work." />
  <WorkflowDemo />
  <p class="marginalia">
    Rate limit: 2 requests per tool per 24h per IP. If you hit it, come back tomorrow or <a href="/contact">send a letter →</a>.
  </p>
</Layout>
```

- [ ] **Step 3: Remove the classifier smoke test**

In `tests/e2e/smoke.spec.ts` delete lines 124–131 (the entire `test('classifier renders ERROR badge without env vars', ...)` block including its closing `});`). Keep the surrounding `describe.test('Lab demos (error path)')` and the `workflow suggester renders ERROR badge` test intact.

- [ ] **Step 4: Delete the ClassifierDemo component**

Run:

```bash
rm "src/components/ClassifierDemo.astro"
```

- [ ] **Step 5: Delete the classify API endpoint**

Run:

```bash
rm "src/pages/api/classify.ts"
```

- [ ] **Step 6: Remove `classifyText` and friends from `src/lib/claude.ts`**

Open `src/lib/claude.ts`. Delete lines 10–51 (the `ClassifyResult` interface, `CLASSIFY_SYSTEM` constant, and `classifyText` function). Keep `extractJSON` (used by `suggestWorkflow`). After the edit the file should start with the imports + `MODEL` + `client()` + `extractJSON` and continue straight into the workflow types.

Confirm the surviving exports: `Flow`, `FlowNode`, `FlowEdge`, `FlowNodeType`, `WorkflowResult`, `suggestWorkflow`. Imports of `classifyText` no longer exist anywhere (we deleted them in steps 1, 2, 5).

- [ ] **Step 7: Remove the `classifyText` test block**

In `tests/unit/claude.test.ts` delete lines 16–67 (the `describe('classifyText', ...)` block in its entirety). Keep imports, `mockCreate` setup, and the `describe('suggestWorkflow', ...)` block.

After the edit, re-import statement at line 10 should read:

```ts
const { suggestWorkflow } = await import('@lib/claude');
```

(removes `classifyText` from the destructure.)

- [ ] **Step 8: Run unit tests**

Run: `npm run test`
Expected: PASS. Should be ~16 tests now (was ~22 — six classifyText tests removed). The `suggestWorkflow` block (~10 tests) and other libs (ratelimit, validation, resend, errors) still pass.

- [ ] **Step 9: Build**

Run: `npm run build`
Expected: clean. No "module not found" errors. If TypeScript complains about an orphan import, search for `classifyText` and remove it from anywhere it still appears.

- [ ] **Step 10: Commit**

```bash
git add src/components/ClassifierDemo.astro src/pages/api/classify.ts src/lib/claude.ts src/pages/lab.astro src/pages/es/lab.astro tests/unit/claude.test.ts tests/e2e/smoke.spec.ts
git commit -m "feat: remove classifier demo from /lab and supporting code"
```

(`git add` of deleted files records the deletion.)

---

## Task 5: /lab pages — title, lede, pixel heart, chips, no rate-limit text

The pages still mention "Claude" in subtitle and have the rate-limit marginalia. This task replaces both, adds the chip row, and inserts the lede with the pixel heart SVG.

**Files:**
- Modify: `src/pages/lab.astro`
- Modify: `src/pages/es/lab.astro`
- Modify: `src/components/WorkflowDemo.astro:6,13` (folio label renumber)

- [ ] **Step 1: Renumber WorkflowDemo folio labels**

In `src/components/WorkflowDemo.astro` change line 6 (ES branch):

```astro
      folio: 'MS. folio 1 — sugerencia de flujos',
```

And line 13 (EN branch):

```astro
      folio: 'MS. folio 1 — workflow suggester',
```

(both were "MS. folio 2 — ...".)

- [ ] **Step 2: Rewrite `src/pages/es/lab.astro`**

Full file contents:

```astro
---
import Layout from '../../components/Layout.astro';
import SectionHeader from '../../components/SectionHeader.astro';
import WorkflowDemo from '../../components/WorkflowDemo.astro';

const linkedinUrl = 'https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/';
---
<Layout title="Lab" description="Hagamos un experimento. Describe un problema operativo y la herramienta sugiere un flujo de trabajo.">
  <SectionHeader label="[§4] LAB" title="Hagamos un experimento" />
  <p class="lab-lede">
    describe ese problema para el que <em>'no tienes tiempo'</em> y la herramienta te sugiere un flujo de trabajo. no te preocupes si no entiendes, para eso estoy yo<svg class="pixel-heart" width="14" height="14" viewBox="0 0 5 5" fill="#2a2420" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="0" y="0" width="2" height="1"/><rect x="3" y="0" width="2" height="1"/><rect x="0" y="1" width="5" height="2"/><rect x="1" y="3" width="3" height="1"/><rect x="2" y="4" width="1" height="1"/></svg>
  </p>
  <WorkflowDemo />
  <div class="contact-chips">
    <a class="chip" href={linkedinUrl} target="_blank" rel="noopener noreferrer">linkedin <span class="arrow">→</span></a>
    <a class="chip" href="/es/contacto">email <span class="arrow">→</span></a>
  </div>
</Layout>
<style>
  .lab-lede {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--ink);
    max-width: 640px;
    margin: 0 0 var(--s-12);
  }
  .lab-lede em { font-family: var(--font-display); font-style: italic; }
  .pixel-heart { display: inline-block; vertical-align: -1px; margin-left: 2px; }
  .contact-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: var(--s-6);
    border-top: 1px dashed var(--divider);
    margin-top: var(--s-12);
  }
  .chip {
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: 10px 16px;
    background: rgba(160,130,90,0.06);
    border: 1px solid var(--divider);
    border-radius: 3px;
    color: var(--marginalia);
    letter-spacing: 0.3px;
    text-decoration: none;
    display: inline-block;
  }
  .chip .arrow { color: var(--ink); }
  .chip:hover { color: var(--ink); border-color: var(--ink); background: transparent; }
</style>
```

(rate-limit `<p class="marginalia">` is gone. Subtitle is gone — replaced by the new lede block.)

- [ ] **Step 3: Rewrite `src/pages/lab.astro`** (EN mirror)

```astro
---
import Layout from '../components/Layout.astro';
import SectionHeader from '../components/SectionHeader.astro';
import WorkflowDemo from '../components/WorkflowDemo.astro';

const linkedinUrl = 'https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/';
---
<Layout title="Lab" description="Let's run an experiment. Describe an operational problem and the tool suggests a workflow.">
  <SectionHeader label="[§4] LAB" title="let's run an experiment" />
  <p class="lab-lede">
    describe that problem you <em>'don't have time for'</em> and the tool suggests a workflow. don't worry if it doesn't all make sense — that's what i'm here for<svg class="pixel-heart" width="14" height="14" viewBox="0 0 5 5" fill="#2a2420" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect x="0" y="0" width="2" height="1"/><rect x="3" y="0" width="2" height="1"/><rect x="0" y="1" width="5" height="2"/><rect x="1" y="3" width="3" height="1"/><rect x="2" y="4" width="1" height="1"/></svg>
  </p>
  <WorkflowDemo />
  <div class="contact-chips">
    <a class="chip" href={linkedinUrl} target="_blank" rel="noopener noreferrer">linkedin <span class="arrow">→</span></a>
    <a class="chip" href="/contact">email <span class="arrow">→</span></a>
  </div>
</Layout>
<style>
  .lab-lede {
    font-family: var(--font-body);
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--ink);
    max-width: 640px;
    margin: 0 0 var(--s-12);
  }
  .lab-lede em { font-family: var(--font-display); font-style: italic; }
  .pixel-heart { display: inline-block; vertical-align: -1px; margin-left: 2px; }
  .contact-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: var(--s-6);
    border-top: 1px dashed var(--divider);
    margin-top: var(--s-12);
  }
  .chip {
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: 10px 16px;
    background: rgba(160,130,90,0.06);
    border: 1px solid var(--divider);
    border-radius: 3px;
    color: var(--marginalia);
    letter-spacing: 0.3px;
    text-decoration: none;
    display: inline-block;
  }
  .chip .arrow { color: var(--ink); }
  .chip:hover { color: var(--ink); border-color: var(--ink); background: transparent; }
</style>
```

- [ ] **Step 4: Verify the workflow demo error-path smoke test still works**

Run: `npm run test:e2e -- smoke`
Expected: PASS. The `workflow suggester renders ERROR badge without env vars` test exercises `/lab` → `#suggest-form` which is still on the page via `<WorkflowDemo />`.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 6: Manual visual check**

Run: `npm run dev`. Open `/lab` and `/es/lab`. Confirm:
- Title is the new copy
- Lede paragraph appears with the pixel heart at the end (small black heart)
- Workflow demo block renders (textarea + button)
- Two chips appear at the bottom
- No "Claude" anywhere on the page (search the rendered HTML if unsure)
- No "Rate limit: 2 requests" text

- [ ] **Step 7: Commit**

```bash
git add src/pages/lab.astro src/pages/es/lab.astro src/components/WorkflowDemo.astro
git commit -m "feat: redesign /lab with personal voice copy, pixel heart, chip CTAs"
```

---

## Task 6: /contact pages — title only, chip row, drop letter framing

**Files:**
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/es/contacto.astro`
- Modify: `src/components/ContactForm.astro:10` (folio label "send a letter" → "message")

- [ ] **Step 1: Update ContactForm folio label**

In `src/components/ContactForm.astro`, change line 10:

```astro
  <p class="label">{lang === 'es' ? 'MS. folio ∞ — mensaje' : 'MS. folio ∞ — message'}</p>
```

But wait — looking at the file, `lang` isn't currently destructured in the frontmatter. Add it:

Replace lines 1–8 (the frontmatter) with:

```astro
---
import { getLangFromUrl } from '../i18n/util';
const lang = getLangFromUrl(Astro.url);
const privacyHref = lang === 'es' ? '/es/privacidad' : '/privacy';
const labels = lang === 'es'
  ? { name: 'nombre', email: 'email', company: 'empresa', companyOpt: '(opcional)', subject: 'asunto', message: 'mensaje', send: '[ enviar → ]', privacyAck: 'acepto los', privacyTerms: 'términos de privacidad', folio: 'MS. folio ∞ — mensaje' }
  : { name: 'name', email: 'email', company: 'company', companyOpt: '(optional)', subject: 'subject', message: 'message', send: '[ send → ]', privacyAck: 'I accept the', privacyTerms: 'privacy terms', folio: 'MS. folio ∞ — message' };
---
```

Then change line 10 to use the label:

```astro
  <p class="label">{labels.folio}</p>
```

- [ ] **Step 2: Rewrite `src/pages/es/contacto.astro`**

```astro
---
import Layout from '../../components/Layout.astro';
import ContactForm from '../../components/ContactForm.astro';

const linkedinUrl = 'https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/';
---
<Layout title="Contacto" description="Dos canales de contacto: LinkedIn y email.">
  <h1 class="contact-title">contacto</h1>
  <div class="contact-chips">
    <a class="chip" href={linkedinUrl} target="_blank" rel="noopener noreferrer">linkedin <span class="arrow">→</span></a>
    <a class="chip" href="#contact-form">email <span class="arrow">↓</span></a>
  </div>
  <ContactForm />
</Layout>
<style>
  .contact-title {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-4xl);
    line-height: 1.1;
    margin: var(--s-8) 0 var(--s-6);
  }
  .contact-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 var(--s-12);
  }
  .chip {
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: 10px 16px;
    background: rgba(160,130,90,0.06);
    border: 1px solid var(--divider);
    border-radius: 3px;
    color: var(--marginalia);
    letter-spacing: 0.3px;
    text-decoration: none;
    display: inline-block;
  }
  .chip .arrow { color: var(--ink); }
  .chip:hover { color: var(--ink); border-color: var(--ink); background: transparent; }
  html { scroll-behavior: smooth; }
</style>
```

(`SectionHeader` and the marginalia `aside` are gone. The `<form id="contact-form">` already exists inside `<ContactForm />`, so `href="#contact-form"` lands on it.)

- [ ] **Step 3: Rewrite `src/pages/contact.astro`** (EN mirror)

```astro
---
import Layout from '../components/Layout.astro';
import ContactForm from '../components/ContactForm.astro';

const linkedinUrl = 'https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/';
---
<Layout title="Contact" description="Two contact channels: LinkedIn and email.">
  <h1 class="contact-title">contact</h1>
  <div class="contact-chips">
    <a class="chip" href={linkedinUrl} target="_blank" rel="noopener noreferrer">linkedin <span class="arrow">→</span></a>
    <a class="chip" href="#contact-form">email <span class="arrow">↓</span></a>
  </div>
  <ContactForm />
</Layout>
<style>
  .contact-title {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-4xl);
    line-height: 1.1;
    margin: var(--s-8) 0 var(--s-6);
  }
  .contact-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 var(--s-12);
  }
  .chip {
    font-family: var(--font-body);
    font-size: var(--text-base);
    padding: 10px 16px;
    background: rgba(160,130,90,0.06);
    border: 1px solid var(--divider);
    border-radius: 3px;
    color: var(--marginalia);
    letter-spacing: 0.3px;
    text-decoration: none;
    display: inline-block;
  }
  .chip .arrow { color: var(--ink); }
  .chip:hover { color: var(--ink); border-color: var(--ink); background: transparent; }
  html { scroll-behavior: smooth; }
</style>
```

- [ ] **Step 4: Run smoke tests**

Run: `npm run test:e2e -- smoke`
Expected: PASS. The contact form smoke tests target `#contact-form` and its inputs — those are unchanged.

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 6: Manual check**

Open `/contact` and `/es/contacto`. Confirm:
- Title is just "contact" / "contacto", italic display font
- Two chips below: linkedin → and email ↓
- Click email chip → smooth-scrolls to form
- Click linkedin chip → opens new tab
- Form below has folio "MS. folio ∞ — message" / "mensaje" (no more "send a letter")
- Old marginalia aside ("or write directly to…", "or find me on…", privacy ack) is gone

- [ ] **Step 7: Commit**

```bash
git add src/pages/contact.astro src/pages/es/contacto.astro src/components/ContactForm.astro
git commit -m "feat: restructure /contact around chip CTAs (linkedin + email)"
```

---

## Task 7: Mobile header — remove hamburger, add visible section strip

This is the largest single change. Desktop layout is untouched. Mobile becomes a 2-row header where row 2 is a horizontal-scrolling list of all 6 sections.

**Files:**
- Modify: `src/components/Header.astro` (full rewrite of mobile CSS, remove hamburger button + script)
- Modify: `tests/e2e/mobile-audit.spec.ts:54-79` (replace hamburger tests)

- [ ] **Step 1: Rewrite Header.astro**

Replace the entire contents of `src/components/Header.astro` with:

```astro
---
import { getLangFromUrl, t } from '../i18n/util';
import LangToggle from './LangToggle.astro';

const lang = getLangFromUrl(Astro.url);
const strings = t(lang);
const base = lang === 'es' ? '/es' : '';
const homeHref = base || '/';
const sectionsLabel = lang === 'es' ? 'secciones' : 'sections';

const navItems = [
  { href: `${base}/`, label: strings.nav.home },
  { href: `${base}${lang === 'es' ? '/servicios' : '/services'}`, label: strings.nav.services },
  { href: `${base}${lang === 'es' ? '/proyectos' : '/projects'}`, label: strings.nav.projects },
  { href: `${base}/lab`, label: strings.nav.lab },
  { href: `${base}${lang === 'es' ? '/sobre-mi' : '/about'}`, label: strings.nav.about },
  { href: `${base}${lang === 'es' ? '/contacto' : '/contact'}`, label: strings.nav.contact },
];

const currentPath = Astro.url.pathname.replace(/\/$/, '') || '/';
function isCurrent(href: string): boolean {
  const clean = href.replace(/\/$/, '') || '/';
  return clean === currentPath;
}
---
<header id="site-header">
  <div class="wrap">
    <a href={homeHref} class="brand brand-bar" aria-label="catalina torres — home">
      <img src="/favicon.svg" alt="" class="brand-mark" width="72" height="36" />
      <span class="brand-text">catalina torres</span>
    </a>
    <nav id="main-nav" aria-label="primary">
      {navItems.map(({ href, label }) => (
        <a href={href} class={`navlink${isCurrent(href) ? ' current' : ''}`}>{label}</a>
      ))}
    </nav>
    <div class="lang-slot"><LangToggle /></div>
    <nav class="mobile-strip" aria-label="primary mobile">
      <span class="strip-prefix">{sectionsLabel} —</span>
      {navItems.map(({ href, label }) => (
        <a href={href} class={`strip-item${isCurrent(href) ? ' current' : ''}`}>{label}</a>
      ))}
      <span class="strip-end" aria-hidden="true">›</span>
    </nav>
  </div>
</header>
<style>
  header {
    border-bottom: 1px dashed var(--divider);
    padding: var(--s-4) 0 0;
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--paper);
  }
  .wrap {
    max-width: var(--hero-max);
    margin: 0 auto;
    padding: 0 var(--gutter);
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: var(--s-6);
    padding-bottom: var(--s-4);
  }
  .brand-bar { justify-self: start; }
  #main-nav { justify-self: center; }
  .lang-slot { justify-self: end; }

  .brand {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    text-decoration: none;
    color: var(--ink);
    line-height: 1;
  }
  .brand-mark { display: block; margin-bottom: -2px; }
  .brand-text {
    font-family: var(--font-display);
    font-style: italic;
    font-size: var(--text-lg);
  }

  #main-nav { display: flex; align-items: center; gap: var(--s-6); flex-wrap: wrap; }
  .navlink {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--ink);
  }
  .navlink:hover { color: var(--red); }
  .navlink.current { color: var(--red); border-bottom: 1px solid var(--red); padding-bottom: 2px; }

  .mobile-strip { display: none; }

  @media (max-width: 768px) {
    header { padding-bottom: 0; }
    .wrap {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: var(--s-3);
      padding-bottom: var(--s-3);
      align-items: center;
    }
    .brand-bar {
      flex-direction: row;
      gap: var(--s-2);
      justify-self: start;
    }
    .brand { flex-direction: row; gap: var(--s-2); align-items: center; }
    .brand-mark { width: 40px; height: 20px; margin-bottom: 0; }
    .brand-text { font-size: var(--text-base); }
    #main-nav { display: none; }
    .lang-slot { justify-self: end; }

    .mobile-strip {
      display: flex;
      grid-column: 1 / -1;
      align-items: center;
      gap: 14px;
      overflow-x: auto;
      white-space: nowrap;
      padding: var(--s-2) var(--gutter);
      margin: 0 calc(-1 * var(--gutter));
      border-top: 1px dashed var(--divider);
      scrollbar-width: none;
    }
    .mobile-strip::-webkit-scrollbar { display: none; }
    .strip-prefix {
      font-family: var(--font-display);
      font-style: italic;
      color: var(--marginalia);
      font-size: var(--text-xs);
      flex-shrink: 0;
    }
    .strip-item {
      font-family: var(--font-body);
      font-size: var(--text-sm);
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: var(--ink);
      text-decoration: none;
      flex-shrink: 0;
      padding: 8px 0;
    }
    .strip-item.current { color: var(--red); border-bottom: 1px solid var(--red); padding-bottom: 6px; }
    .strip-end {
      color: var(--divider);
      font-size: 18px;
      flex-shrink: 0;
      padding-right: var(--gutter);
    }
  }
</style>
```

(no `<script>` block — the toggle is gone.)

- [ ] **Step 2: Replace hamburger tests in mobile-audit.spec.ts**

In `tests/e2e/mobile-audit.spec.ts` replace lines 54–79 (both `test('hamburger menu toggles…')` and `test('header on desktop shows nav inline, no hamburger')` blocks) with:

```ts
test('mobile shows section strip with all 6 items, no hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4321/');

  // Hamburger and toggle script no longer exist
  await expect(page.locator('#nav-toggle')).toHaveCount(0);

  // Mobile strip is visible and contains all 6 items
  const strip = page.locator('.mobile-strip');
  await expect(strip).toBeVisible();
  const items = strip.locator('.strip-item');
  await expect(items).toHaveCount(6);

  // Current page (home) is highlighted
  const current = strip.locator('.strip-item.current');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(/home/i);
});

test('desktop shows inline nav, mobile strip is hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/');

  await expect(page.locator('#main-nav')).toBeVisible();
  await expect(page.locator('.mobile-strip')).toBeHidden();
  await expect(page.locator('#nav-toggle')).toHaveCount(0);
});
```

- [ ] **Step 3: Run mobile-audit suite**

Run: `npm run test:e2e -- mobile-audit`
Expected: 30 tests pass (the 14 routes × 2 viewports baseline plus the two new header tests). If route tests fail because they assumed something specific about the header at the top, fix only what's necessary — the strip should not introduce horizontal scroll on `<body>` (only inside `.mobile-strip`).

- [ ] **Step 4: Run smoke suite**

Run: `npm run test:e2e -- smoke`
Expected: PASS. Smoke tests don't reference the hamburger (verified in step 1 of investigation).

- [ ] **Step 5: Build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 6: Manual visual check**

Open `npm run dev` in a browser. Resize to 375px width. Confirm:
- No hamburger button anywhere
- Two-row header: brand left + lang right on row 1; "secciones — HOME · SERVICES · …" on row 2
- The strip can be scrolled horizontally with mouse wheel / touch
- The current page (the one you're on) is in red with a red underline
- Resize back to desktop (1280px). Confirm: inline nav reappears, strip is hidden.

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.astro tests/e2e/mobile-audit.spec.ts
git commit -m "feat: replace mobile hamburger with visible scrolling section strip"
```

---

## Task 8: Brand-leakage regression test

A new e2e test that fails if "Claude" or "Anthropic" appears on any public page outside `/privacy`. Cheap insurance.

**Files:**
- Create: `tests/e2e/no-brand-mentions.spec.ts`

- [ ] **Step 1: Write the test**

Create `tests/e2e/no-brand-mentions.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/projects',
  '/lab',
  '/about',
  '/contact',
  '/es',
  '/es/servicios',
  '/es/proyectos',
  '/es/lab',
  '/es/sobre-mi',
  '/es/contacto',
];

// Conservative list. Skips "llama" / "cohere" / "bard" / "gemini" / "copilot" because they
// have legitimate non-brand uses (verbs, astrological sign). Catches the brands most
// likely to leak from demo prose or marketing copy.
const FORBIDDEN = /\b(claude|anthropic|chatgpt|openai|perplexity)\b/i;

for (const route of PUBLIC_ROUTES) {
  test(`no AI brand names on ${route}`, async ({ page }) => {
    await page.goto(`http://localhost:4321${route}`);
    const html = await page.content();
    // Strip script and style content; we don't care about internal imports/identifiers in inlined JS,
    // only what is rendered as text or attributes the user sees.
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
    const matches = visible.match(FORBIDDEN);
    expect(matches, matches ? `found brand in ${route}: ${matches[0]}` : 'should not find').toBeNull();
  });
}
```

The script-stripping is deliberate: Astro inlines client scripts that may contain `import` paths like `'../lib/claude'`. Those are not user-visible.

- [ ] **Step 2: Run the test**

Run: `npm run test:e2e -- no-brand-mentions`
Expected: PASS for all 12 routes. If anything fails, the spec was missed somewhere — find and fix.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/no-brand-mentions.spec.ts
git commit -m "test: regression guard against AI brand leakage on public pages"
```

---

## Task 9: Final QA + production deploy

Sanity check the whole iteration end-to-end before pushing to production.

- [ ] **Step 1: Full unit test suite**

Run: `npm run test`
Expected: all tests green. Document the count for the handoff doc later.

- [ ] **Step 2: Full Playwright suite**

Run: `npm run test:e2e`
Expected: all green.

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: clean. Note any new warnings for follow-up.

- [ ] **Step 4: Manual mobile smoke (375px)**

Open `npm run dev` at 375px. Visit each route:
- `/` — section strip visible, scrollable, "home" highlighted in red
- `/services` — "services" highlighted
- `/projects` — "projects" highlighted
- `/lab` — new title "let's run an experiment", lede with pixel heart, workflow demo, chips at bottom
- `/about` — closing paragraph mentions BA + MA from University of Alberta
- `/contact` — title only, two chips, form below; clicking "email ↓" smooth-scrolls
- ES mirrors of all the above

- [ ] **Step 5: Manual production sanity check (after deploy)**

After Vercel auto-deploy on `git push`:
- Hit `https://catatorres.ca/lab` and submit a query — expect a real workflow result (3 attempts now)
- After 3 successful submissions, the 4th should produce ERROR 429 with active linkedin and email links
- Verify the linkedin link opens in a new tab and the email link goes to `/contact`

- [ ] **Step 6: Update session handoff doc**

Edit `docs/session-handoff.md`:
- Mark Tarea 19 sub-items related to the iteration as done
- Add a brief note describing the iteration shipped on 2026-05-04

- [ ] **Step 7: Commit handoff updates**

```bash
git add docs/session-handoff.md
git commit -m "docs: update session handoff after 2026-05-04 iteration"
```

- [ ] **Step 8: Push to production**

```bash
git push origin main
```

(Vercel auto-deploys on push to main.)

---

## Self-review notes

**Spec coverage check:**
- §3.1 mobile header — Task 7 ✓
- §3.2 contact page — Task 6 ✓
- §3.3 lab pages + classifier removal + folio renumber + pixel heart + chips — Tasks 4 + 5 ✓
- §3.3 rate limit text removal (F) — Task 5 (removed in lab page rewrite) ✓
- §3.3 rate limit backend bump — Task 2 ✓
- §3.4 about credentials — Task 1 ✓
- §3.5 ERROR 429 — Task 3 ✓
- §6 test impact — Tasks 4 (claude.test, smoke), 7 (mobile-audit), 8 (regression) ✓

**Risks called out by the spec:**
- iOS Safari sticky + overflow-x — task 7 step 6 includes a manual verification at 375px. Production manual smoke (task 9 step 5) is the real check.
- Inline HTML in 429 message — task 3 step 4 adds a guarding comment; tests pin the structure.

**Commit log this plan produces (in order):**

1. `feat: add academic credentials to about page closing paragraph`
2. `feat: bump workflow demo rate limit from 2 to 3 per IP per 24h`
3. `feat: rewrite 429 error to point at linkedin and email links`
4. `feat: remove classifier demo from /lab and supporting code`
5. `feat: redesign /lab with personal voice copy, pixel heart, chip CTAs`
6. `feat: restructure /contact around chip CTAs (linkedin + email)`
7. `feat: replace mobile hamburger with visible scrolling section strip`
8. `test: regression guard against AI brand leakage on public pages`
9. `docs: update session handoff after 2026-05-04 iteration`

Atomic, one concern per commit, in the order Catalina prefers.
