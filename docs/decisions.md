# Decisiones técnicas aprobadas

## Stack

- **Framework:** Astro — SSG + SSR híbrido, i18n nativo, DX simple
- **Host:** Vercel — serverless functions + KV
- **AI backend:** Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) — ~3-5× más barato que Sonnet, suficiente para ambas demos
- **Email:** Resend — tier gratis 3000/mes
- **Rate limiting:** Vercel KV

## Arquitectura de páginas

**Multi-page con menú top** (descartado single-page-inline inicial). Permite SEO por ruta y navegación más clara para recruiters.

## Idiomas

Bilingüe EN|ES con **páginas paralelas** (no un toggle que oculta contenido). 13 rutas por idioma.

## Las dos demos en `/lab`

- **L1 · Classifier** (inspirado en Sol): pegar texto → output estructurado de 5 campos (§1 type, §2 complexity, §3 tools, §4 timeline, §5 tags). Bilingüe — detecta idioma del input.
- **L2 · Workflow suggester:** describir problema operacional → Claude sugiere workflow en formato "§ Recommended approach / § Tools / § Estimated effort".

## Mini-demos en project pages

- `/projects/zodiac-book-recommender` — selector zodiacal, recomienda libro. Client-side, sin API.
- `/projects/interactive-story` — narrativa con 3 nodos + 2-3 endings. Client-side, sin API.

## Contacto

- **M3** — form con Vercel serverless function + Resend
- Campos: name, email, company (opcional), subject, message
- Anti-spam: honeypot + timing check (<2s = bot) + rate limit 3/IP/24h
- **Sin CV downloadable** — recruiters ya lo tienen de la aplicación

## Posicionamiento

Catalina todavía no tiene entidad legal. El site se posiciona como **ella como persona**, no como empresa.

## Correcciones aplicadas durante brainstorm

1. **SuRed → Matrix Grupo Empresarial** — nombre correcto de la empresa de comms donde trabajó. `perfil.md` en WORK SEARCH debe corregirse (task externa, no afecta al portfolio).
2. **Geoffrey numbers** — portfolio.docx decía "172 books, 799 photos" pero la realidad es mayor. Spec y plan usan narrativa ("a hundred thousand years of paperwork… a digital library one click away") en vez de cifras que aplanan.
3. **Numbers audit obligatorio** — ninguna cifra específica sale al site sin verificación con Catalina (Spec § 12).
4. **SpokenWeb** era web content master (NO content author). Authoring + base de datos de literatura eran otros dos RAs: Bridging Divides (Oct 2023 – May 2024) + Police Violence YEG (Jan–Apr 2024).

## Dominio

- **Definitivo:** `catalinatorres.ca` (Hostinger).
- **Antiguo (abandonado, no migrado):** `torresautomatizations.com` (Namecheap). El swap se aplicó 2026-05-01 en `astro.config.mjs`, `.env.example`, `docs/setup.md`, `src/lib/resend.ts` (`from`, subject prefix, footer) y descripción de `/privacy`.

## Copy review — bloque cerrado (2026-04-28)

- **HOME** — formato limpio aprobado: hero + capabilities chips (editar, automatizar, digitalizar, ordenar, traducir, rescatar) + sección "Lo que hago" con 6 capacidades concretas + CTA al lab. **Sin** sección de proyectos en HOME (viven en `/proyectos`). **Sin** sección de tech stack (se leía como "esto se hace solo, sin trabajo").
- **About** — renombrado a "Sobre mí" (`/es/sobre-mi`, archivo `sobre-mi.astro`). El path `/es/acerca-de` queda muerto.
- **Voz** — todo el copy de páginas pasa a **primera persona singular**. Razón: es solo Catalina, sin entidad colectiva. Cambios aplicados en HOME ("What I do" / "Lo que hago"), About (mission, value prop, traducción) y mantiene primera persona en services/privacy donde ya estaba.
- **Privacy ES** — creado `src/pages/es/privacidad.astro` como mirror del EN.
- **Header** — link de About en ES corregido a `/es/sobre-mi`.

## Histórico de modo de ejecución

Escogido **inline** (Claude ejecuta en la misma sesión, checkpoints para review) sobre subagent-driven. Razón: Catalina quiere opinar sobre copy/estética por sección a medida que sale.
