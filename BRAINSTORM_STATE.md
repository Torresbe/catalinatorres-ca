# Portfolio — Estado completo

**Última actualización:** 2026-04-23 (post-compactación 2)
**Status:** Brainstorm cerrado, Spec aprobado, Plan aprobado, **modo de ejecución escogido: INLINE**.
**Próximo paso al retomar:** NO preguntar nada, arrancar directamente con Tarea 1 del plan.

---

## 🔴 INSTRUCCIÓN AL RETOMAR

Catalina escogió ejecución INLINE. Los archivos del plan están verificados y en su lugar:
- `docs/superpowers/specs/2026-04-23-portfolio-design.md` ✓
- `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` ✓

**Al retomar con contexto nuevo:**
1. Leer este archivo (BRAINSTORM_STATE.md) — da el contexto completo
2. Leer el Plan — `docs/superpowers/plans/2026-04-23-portfolio-implementation.md`
3. **NO preguntar modo de ejecución — ya está decidido (inline)**
4. Anunciar: "Arranco con Tarea 1 — scaffolding Astro"
5. Ejecutar Tarea 1 paso por paso siguiendo el plan literalmente
6. Parar en checkpoints: fin de Día 1 (tareas 1-4), Día 2 (5-6), Día 3 (7), Día 4 (8-14), antes del deploy

**Checkpoints donde pedir review:**
- Después de Tarea 4 (scaffolding + tokens + Layout funcionando)
- Después de Tarea 6 (páginas estáticas con contenido draft)
- Después de Tarea 7 (mini-demos funcionando)
- Después de Tarea 14 (Lab + Contact end-to-end)
- Antes de Tarea 18 (deploy)

Catalina querrá opinar sobre copy y estética en cada checkpoint — los drafts llevan marca `[DRAFT]`.

---

## ⚠️ Archivos clave (referirse al retomar)

| Archivo | Qué contiene |
|---|---|
| `docs/superpowers/specs/2026-04-23-portfolio-design.md` | **Spec completo** — 15 secciones incluyendo visual system, sitemap, Voice & Tone, acceptance criteria |
| `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` | **Plan de implementación** — 19 tareas, código completo por paso, TDD para libs, tests Playwright, deploy Vercel |
| `BRAINSTORM_STATE.md` | Este archivo — resumen consolidado |

**Al retomar:** leer primero este archivo, después el Plan. El Spec es referencia de diseño.

---

## Todas las decisiones aprobadas

### Plataforma y stack
- **Framework:** Astro (confirmado después de explicación simple)
- **Host:** Vercel (cuenta nueva con `catalinatorres1000@gmail.com`)
- **Dominio:** `torresautomatizations.com` — ya es propiedad de Catalina via Namecheap
- **Sitio actual:** construido con Antigravity en Vercel con email que fue borrado; será reemplazado completo
- **Migración de dominio:** Opción 2 — DIY via DNS TXT verification en Namecheap
- **Email transaccional:** Resend (3000/mes tier gratis)
- **Rate limiting:** Vercel KV
- **AI backend:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — ~3-5x más barato que Sonnet, suficiente para ambas demos

### Visual system — I · Manuscript & Typewriter
Catalina rechazó las 3 primeras opciones (Fraunces-genérico). Escogió la dirección I después de ver 4 alternativas literarias distintivas.

- **Display headings:** Libre Bodoni (serif con contraste dramático)
- **Body / párrafos:** Courier Prime (typewriter monospace) — NO sans-serif
- **Labels técnicos:** Courier Prime

**Tokens de color:**
```
--paper: #faf6ec   (warm cream)
--ink: #2a2420     (body text)
--red: #b8000a     (ERROR codes, correction marks, accents)
--marginalia: #7a6a54
--divider: #c4b89f (dashed borders)
```

**Decoración:** marcas rojas de corrección editorial, labels tipo `MS. folio 1`, `[§3]`, em dashes, flechas `→`, divisores dashed. Cero shadows, cero gradients, cero rounded corners >4px.

### Arquitectura de páginas
- **Multi-page con menú top** (cambio desde single-page-inline inicial)
- **Menú:** Home · Services · Projects · Lab · About · Contact · [EN|ES toggle]
- **Idiomas:** bilingüe EN|ES (no un toggle escondido sino páginas paralelas con i18n nativo de Astro)
- **Rutas:** 13 EN + 13 ES (home, services, projects index + 6 project details, lab, about, contact, privacy, 404)

### Audiencia (orden de prioridad)
1. **J2 Recruiter/hiring manager** — ya tiene el CV, viene a verificar credibilidad técnica
2. **J1 Cliente potencial** — necesita entender servicios y agendar contacto
3. **J3 Referido tibio** — decide si vale la pena escribir

### Las dos demos en `/lab`
**L1 · Classifier (inspirado en Sol):** pegar texto → output estructurado de 5 campos (§1 type, §2 complexity, §3 tools, §4 timeline, §5 tags). Bilingüe — detecta idioma input.

**L2 · Workflow suggester:** describir problema operacional → Claude sugiere workflow en formato "§ Recommended approach / § Tools / § Estimated effort".

**Rate limit:** 2 requests por demo por IP por 24h. Storage: Vercel KV con SHA-256 hash de IP.

### Mini-demos en project pages
- `/projects/zodiac-book-recommender` — selector de signo zodiacal, recomienda libro (client-side, sin API)
- `/projects/interactive-story` — narrativa con 3 nodos + 2-3 endings (client-side, sin API)

### Contacto
- **M3** — form con Vercel serverless function + Resend
- Campos: name, email, company (opcional), subject, message
- Anti-spam: honeypot + timing check (<2s = bot) + rate limit 3/IP/24h
- **Sin CV downloadable** (recruiters ya lo tienen de la aplicación)

### Sin empresa formal
Catalina todavía no tiene entidad legal. El site se posiciona como **ella como persona** (individual consultant), no como empresa.

### Proyectos a presentar (6)

| # | Proyecto | Época | Tech |
|---|---|---|---|
| 1 | Interactive Python story (branching narrative) | MA 2022-24 | Python |
| 2 | Zodiac book recommender | MA 2022-24 | Python + Mia Astral framework |
| 3 | EHBA mass personalized email | 2024 | Google Sheets + Apps Script |
| 4 | EHBA custom GPT assistant | 2024 | Custom GPT |
| 5 | Sol literature review classifier | 2025 | Claude Code + Python |
| 6 | Geoffrey personal library | 2025 | Python + APIs + Claude Code |

**Narrativa:** experimentación creativa en MA → automatización ops con herramientas disponibles → práctica profesional AI moderna.

### Voice & Tone (binding para todo el copy)
**Influencias:** Julio Cortázar, Borges (Funes el memorioso), Mark Twain (Diario de Adán/Diario de Eva).

**10 pillars:**
1. Editorial precision — cada palabra escogida, zero filler adjectives
2. Grammatical orthodoxy — **NO** "todes/les/they singular" en español
3. Ritmo acumulativo — sentences largas con commas, alternando con cortas
4. Humor seco, irónico — parentheticals que corrigen `(needs)`
5. Narrativa sobre métricas — "a hundred thousand years of paperwork" > "172 books"
6. Tierna y rigurosa simultáneamente
7. Puede ser corporate, nunca hollow
8. Primera persona con edge
9. Trivia como flavor (Lilith, Funes)
10. Spanish structural DNA en inglés

**Forbidden:** LinkedIn-guru, startup-marketing ("empowering/leveraging"), generic superlatives, inclusive-language shortcuts, hollow corporate polish.

### Error messages — formato estándar
`ERROR [CODE] — [mensaje lowercase]` en Courier Prime, código en rojo `#b8000a`.

10 códigos HTTP con traducciones EN/ES completas ya definidas en `src/lib/errors.ts` en el plan.

Ejemplos:
- `ERROR 404 — you are looking in the wrong place`
- `ERROR 429 — love not found. try again in 24h or send a letter →`
- `ERROR 503 — the office is closed for now. try nicer.`

---

## Correcciones aplicadas durante el brainstorm

1. **SuRed → Matrix Grupo Empresarial** — el nombre correcto de la empresa de comms donde Catalina trabajó. `perfil.md` en WORK SEARCH todavía tiene "SuRed" y debe corregirse (task externa, no afecta al portfolio).

2. **Geoffrey numbers** — portfolio.docx decía "172 books, 799 photos" pero la realidad es mayor: decades of professional documents, más de 4,000 fotos, drafts de artículos, documentos personales. El spec y plan usan narrativa ("a hundred thousand years of paperwork... a digital library one click away") en vez de cifras que aplanan.

3. **Numbers audit obligatorio** — ninguna cifra específica sale al site sin verificación con Catalina. Spec § 12.

4. **SpokenWeb RA responsibilities split** — Catalina corrigió que SpokenWeb era web content master (NO content author). El trabajo de authoring + base de datos de literatura eran otros dos RAs: Bridging Divides (Oct 2023 – May 2024) + Police Violence YEG (Jan–Apr 2024). `perfil.md` de WORK SEARCH ya fue actualizado con esta separación.

---

## Estado de implementación

**Plan:** 19 tareas organizadas en 5 días de trabajo
- Día 1: Tareas 1–4 (scaffolding, tokens, Layout, componentes atómicos)
- Día 2: Tareas 5–6 (páginas estáticas + content collection de proyectos)
- Día 3: Tarea 7 (mini-demos de Zodiac y Story)
- Día 4: Tareas 8–14 (rate limiter, Claude wrapper, APIs, Lab, ContactForm, Contact page — con TDD en libs)
- Día 5: Tareas 15–19 (mirror español, SEO, Playwright, deploy, QA)

**Tests planeados:**
- Vitest unit tests: ratelimit, validation, claude wrapper, resend wrapper
- Playwright smoke tests: navegación, contact form, demos interactivos

**Nada de código escrito aún.** El Plan tiene todos los snippets listos para ejecutar.

---

## Decisión pendiente al retomar

**Modo de ejecución:**
- **Subagent-driven** — agente fresco por tarea, review entre cada una
- **Inline** — Claude ejecuta en la misma sesión, checkpoints para review

**Recomendación mía:** **inline** para este proyecto — Catalina va a querer opinar sobre copy/estética por sección a medida que sale.

**Cuando retomes:** preguntarle cuál prefiere, y arrancar con Tarea 1 del plan.

---

## Contexto general que no hay que perder

### Sobre Catalina (ampliado durante brainstorm)
- Editora senior con 10+ años en Editorial Planeta y Círculo de Lectores en Colombia
- MA en Digital Humanities de University of Alberta (2022–2024)
- Bilingüe EN/ES — nativa Spanish, fluent English
- Vive en Edmonton, AB, Canadá
- Tiene PGWP (Post-Graduation Work Permit) — NO Express Entry aún (lo que es motivación de la búsqueda de trabajo)
- Voz de escritora: Cortázar, Borges, Mark Twain. Le encanta la trivia. Anti-pomposa. Anti-inclusive-language-shortcuts. Ama los datos pero prefiere narrativa cuando las métricas aplanan.

### Blog de Catalina (voice reference)
https://curiosityxyz-32.blogspot.com/

Posts leídos para calibrar voz:
- "Diario de una princesa rota (2016)" — jan 2026
- "Nero: Timeless Luxury" — dec 2025
- "Buenas, buenas" — jul 2025 ("editor of lives, of jobs, of borrowed traumas, and a loyal user of one or several AIs")

### Trabajos académicos UofA (voice reference)
- `/Users/catalinatorresbenjumea/Documents/PERSONAL/Documentos - MacBook Air de Catalina/UofA 2022-2024/FALL 2022/DH510/ASSIGNMENT #5.docx` — empatía entre pacientes y doctores, AA recovery como paralelo
- `/Users/catalinatorresbenjumea/Documents/PERSONAL/Documentos - MacBook Air de Catalina/UofA 2022-2024/FALL 2023/DH 510 CONNECTIONS, MAPPING &SPACES/Catalina Assignment 1.docx` — espacios (Block 1912 on Whyte Ave, airport terminals, House of Terror). 9.5/10 grade.

### Estado paralelo — WORK SEARCH
Hoy (23 abril) se aplicó a 4 roles:
- Manager Immigration Info Services (JR 82435) — portal GoA
- AAO Communications & Engagement Manager — email a Sabrina Licata
- NAIT Strategic Initiatives Officer (JR100049) — Workday NAIT
- NAIT Event and Engagement Assistant (JR100121) — Workday NAIT

Pendientes en WORK SEARCH:
- Priority Issues Coordinator (JR 82025) — portal bloqueado, resolver con Jane McEwen
- Finning Senior Executive Assistant — listo para aplicar vía Indeed
- NAIT Campaign Coordinator — Catalina saltó (fundraising gap)

---

## Histórico de compactaciones

**Compactación 1** (2026-04-23): después de spec + plan, antes de escoger modo de ejecución.

**Compactación 2** (2026-04-23): después de escoger modo INLINE. Archivos verificados. Próximo paso: arrancar Tarea 1 directamente sin preguntas.

## Al retomar después de compactación 2

**NO HAGAS ESTAS COSAS:**
- No preguntes qué modo de ejecución
- No repreguntes decisiones ya cerradas (visual system, sitemap, voice, etc.)
- No vuelvas a leer el spec completo a menos que una tarea específica lo necesite

**SÍ HAZ ESTO:**
1. Lee `BRAINSTORM_STATE.md` (contexto)
2. Abre el Plan en `docs/superpowers/plans/2026-04-23-portfolio-implementation.md`
3. Salta directo a "Task 1: Initialize Astro project with TypeScript, Vercel adapter, and dependencies"
4. Di: "Retomo con Tarea 1 del plan — scaffolding Astro"
5. Ejecuta cada step del plan literalmente con las herramientas Bash / Write / Edit
6. Al terminar Tarea 4 (Día 1), para para que Catalina revise antes de seguir con Día 2
