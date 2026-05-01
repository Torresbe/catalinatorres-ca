---
**Última sesión:** 2026-05-01
**Próxima sesión:** arrancar Tarea 18 (deploy a Vercel + dominio + env vars).
---

# Session handoff — Portfolio

## Estado en una línea

Tareas 8–17 + logo **CERRADAS**. 22/22 vitest + 14/14 Playwright passing, build OK. Sitio bilingüe completo, SEO listo, smoke tests cubren navegación, i18n, demos y formulario. Tarea 18 (deploy) lista para arrancar.

## Cómo retomar

1. Leer `CLAUDE.md`, este archivo, y verificar que el plan en `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` Tarea 18 sigue siendo correcto.
2. Tarea 18 toca infraestructura: cuenta Vercel, repo GitHub, Vercel KV, env vars en el dashboard, cambio de dominio (`torresautomatizations.com` → `catalinatorres.ca`) en `astro.config.mjs` y `.env.example`, DNS en Namecheap.
3. Decidir LinkedIn antes/durante el deploy — si va, añadir a `sameAs` en JSON-LD (`src/pages/index.astro` y `src/pages/es/index.astro`) y a la aside de `/contact` y `/es/contacto`.

## Lo cerrado en la sesión 2026-05-01

1 tarea cerrada (17 — Playwright smoke tests):

- `playwright.config.ts` con `baseURL: localhost:4321`, `webServer: npm run dev`, `reuseExistingServer` en local.
- `tests/e2e/smoke.spec.ts` con 14 tests cubriendo:
  - **Core nav EN:** home con h1, las 6 páginas top-level (services, projects, lab, about, contact, privacy) responden 200 y muestran su h2 (SectionHeader); 404 custom.
  - **i18n:** home ES, lang toggle de `/` → `/es`, mapeo asimétrico `/about` ↔ `/es/sobre-mi` ida y vuelta.
  - **Projects:** lista de 6 items, demos client-side (zodiac + story con branching y ending).
  - **Contact form:** render de todos los campos requeridos (name, email, subject, message, privacyAck), HTML5 `required` bloquea submit vacío, submit completo con APIs muertas localmente renderiza badge `ERROR`.
  - **Lab demos:** classifier y suggester también renderizan `ERROR` (en lugar de crashear) cuando `/api/classify` y `/api/suggest-workflow` fallan por falta de env vars.

## Pendiente para Tarea 18

Plan: línea 3372 del implementation plan.

- Crear cuenta Vercel + conectar repo GitHub.
- Vercel KV: crear instancia, las env vars `KV_REST_API_URL` y `KV_REST_API_TOKEN` se inyectan automáticamente.
- Env vars manuales en Vercel dashboard: `ANTHROPIC_API_KEY` (Claude Haiku 4.5), `RESEND_API_KEY`, `CONTACT_EMAIL=catalinatorres1000@gmail.com`.
- **Dominio:** cambiar `astro.config.mjs` `site:` de `torresautomatizations.com` a `catalinatorres.ca`. Actualizar `.env.example` y `docs/setup.md` si aplica. `robots.txt` ya apunta al nuevo (no tocar).
- DNS Namecheap → Vercel.
- Después Tarea 19: QA final, probar demos end-to-end con env vars vivas, optionally re-correr Playwright contra producción.

## Decisiones / contexto crítico que NO está en el código

- **Dominio nuevo:** `catalinatorres.ca` reemplaza `torresautomatizations.com`. `astro.config.mjs` todavía tiene el viejo (cambia en Tarea 18). `robots.txt` ya apunta al nuevo desde Tarea 16.
- **LinkedIn:** decisión sigue pendiente. NO está en JSON-LD Person ni en `/contact`/`/es/contacto`. Cuando Catalina decida (cerca del deploy), añadir a `sameAs` en JSON-LD y a la aside del contact page.
- **Email:** `catalinatorres1000@gmail.com` (no su email del sistema `fractalshoot@gmail.com`). Hardcoded en `src/pages/contact.astro` y `src/pages/es/contacto.astro`.
- **Resend SDK:** plan tenía `reply_to` (snake_case) pero Resend v6 sólo tipea `replyTo` (camelCase). El test y la implementación usan `replyTo`.
- **Vitest alias bug:** `URL.pathname` no decodifica `%20` por el espacio en "CLAUDE CODE". `vitest.config.ts` usa `fileURLToPath(new URL(...))`. No revertir.
- **Demos no funcionan localmente:** `/api/classify`, `/api/suggest-workflow`, `/api/contact` requieren `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`. Sin esas vars devuelven 500. Los Playwright tests de error path validan precisamente eso (que el front renderiza el badge `ERROR` en lugar de crashear).
- **Playwright tests del plan tenían bugs:** el plan tenía `getByRole('heading', { level: 1, level: 2 })` (clave duplicada inválida) y asumía que todas las páginas tienen h1 — sólo home tiene h1, el resto usa SectionHeader (h2). El spec corrige eso. También verifica los nombres reales de los h2 (e.g. `/services` muestra "What I do", no "Services").
- **Logo source de verdad:** `LOGO/trex1.jpg` (Canva, sin moño). `scripts/trace-logo.py` la convierte a SVG. Si Catalina cambia la fuente, re-correr el script.
- **OG image:** `scripts/generate-og.py` genera `public/og-default.png`. Re-corre si cambias copy/colors.

## Diferido (no tocar todavía)

- **Dominio:** `astro.config.mjs` → `catalinatorres.ca` (Tarea 18). Actualizar `.env.example` y `docs/setup.md` en el mismo commit.
- **LinkedIn:** decisión pendiente, evaluar cerca del deploy. Si va, añadir a JSON-LD `sameAs` + aside de contact pages.
- **Demos end-to-end:** sólo después de conectar Vercel KV en deploy.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Si `EADDRINUSE`: `lsof -ti:4321 | xargs kill -9`.
- Playwright: `npm run test:e2e` (arranca su propio dev server con `reuseExistingServer` si hay uno corriendo). Browser ya instalado en `~/Library/Caches/ms-playwright/chromium-1217` y `chromium_headless_shell-1217`.
- TDD obligatorio en `src/lib/*` — test que falla primero, después implementación.
- Commits atómicos por tipo: `feat:`, `fix:`, `test:`, `docs:`. NO mezclar concerns.
- Restricciones críticas en `CLAUDE.md` — re-leer si hay duda de estilo/copy.
