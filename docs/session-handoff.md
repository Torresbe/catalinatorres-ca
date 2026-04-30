---
**Última sesión:** 2026-04-30
**Próxima sesión:** arrancar Tarea 17 (Playwright smoke tests).
---

# Session handoff — Portfolio

## Estado en una línea

Tareas 8–16 + logo **CERRADAS**. 22/22 vitest passing, build OK. Sitio bilingüe completo, SEO listo, dino-logo en favicon + header + OG image. Tarea 17 (Playwright) lista para arrancar.

## Cómo retomar

1. Leer `CLAUDE.md`, este archivo, y verificar que el plan en `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` Tarea 17 sigue siendo correcto.
2. `npm run dev` (puerto 4321).
3. Tarea 17 crea `playwright.config.ts` y `tests/e2e/smoke.spec.ts` — empieza por instalar Playwright si no está.

## Lo cerrado en la sesión 2026-04-29 / 2026-04-30

13 commits sobre `main` desde el último handoff. Highlights:

- **8–14 (TDD libs + APIs + UI):** rate limiter (Vercel KV, IP hasheada), validation (honeypot + timing + campos), Claude wrapper (Haiku 4.5, classifyText/suggestWorkflow), APIs `/api/classify` y `/api/suggest-workflow`, Lab page con dos demos client-side, Resend wrapper, `/api/contact`, ContactForm + página `/contact`.
- **Logo:** T-rex pixel-art trazado de `LOGO/trex1.jpg` (Canva) via `scripts/trace-logo.py`. Vive en `public/favicon.svg` (128×64) y se reusa como brand mark en el header (centrado arriba del wordmark) y en la OG image abajo a la derecha.
- **15 (mirror ES):** `/es/lab.astro` y `/es/contacto.astro` añadidas. `ClassifierDemo`, `WorkflowDemo`, y `ContactForm` ahora son lang-aware (igual que ContactForm desde Tarea 14).
- **Fix:** nav ES decía "Acerca de", ahora "Sobre mí" (la página se renombró antes pero el dictionary se quedó atrás).
- **16 (SEO):** sitemap auto, robots.txt apuntando a `catalinatorres.ca/sitemap-index.xml`, hreflang alternates con manejo correcto de paths asimétricos (`/about` ↔ `/es/sobre-mi`, `/projects/foo` ↔ `/es/proyectos/foo`), JSON-LD Person en home EN+ES (sin LinkedIn — diferido), OG image 1200×630 generada con `scripts/generate-og.py` (parsea favicon.svg para incluir el dino).

## Pendiente para Tarea 17

Playwright smoke tests:
- `playwright.config.ts` — configurar `baseURL: http://localhost:4321`, browser chromium, retries.
- `tests/e2e/smoke.spec.ts` — casos: cargar home EN/ES, navegar entre páginas, enviar contact form (debería 500 sin env vars, valida path de error), submit en demos (idem), lang toggle funciona.
- Cuidado: las APIs no funcionan localmente sin env vars (ver "Diferido" abajo). Los tests de demos/contact deberían validar el path de error 500, no el happy path.

Después siguen Tareas 18 (deploy a Vercel + dominio) y 19 (QA final).

## Decisiones / contexto crítico que NO está en el código

- **Dominio nuevo:** `catalinatorres.ca` reemplaza `torresautomatizations.com`. `astro.config.mjs` todavía tiene el viejo (cambia en Tarea 18 junto con env vars). `robots.txt` ya apunta al nuevo (decisión consciente — robots es estático, mejor tener el correcto desde ya).
- **LinkedIn:** decisión sobre publicar el perfil sigue pendiente. Por eso NO aparece en JSON-LD Person ni en `/contact`/`/es/contacto`. Cuando Catalina decida (cerca del deploy), añadir a `sameAs` en JSON-LD y a la aside del contact page.
- **Email:** `catalinatorres1000@gmail.com` (no su email del sistema `fractalshoot@gmail.com`). Hardcoded en `src/pages/contact.astro` y `src/pages/es/contacto.astro`.
- **Resend SDK:** plan tenía `reply_to` (snake_case) pero Resend v6 sólo tipea `replyTo` (camelCase). El test y la implementación usan `replyTo`. Si copias del plan, ajustar.
- **Vitest alias bug:** `URL.pathname` no decodifica `%20` por el espacio en "CLAUDE CODE". `vitest.config.ts` usa `fileURLToPath(new URL(...))` ahora. No revertir.
- **Demos no funcionan localmente:** `/api/classify`, `/api/suggest-workflow`, `/api/contact` requieren `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `ANTHROPIC_API_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`. Sin esas vars devuelven 500. Se conectan en Tarea 18 (Vercel KV auto-set, las otras manuales en el dashboard).
- **Logo source de verdad:** `LOGO/trex1.jpg` (Canva, sin moño). `scripts/trace-logo.py` la convierte a SVG aplicando threshold + morfología + nearest-neighbor downscaling a 128×64. Si Catalina cambia la fuente, re-correr el script.
- **OG image:** `scripts/generate-og.py` genera `public/og-default.png`. Re-corre si cambias copy/colors. Renderiza el dino parsing los `<rect>` de favicon.svg directamente — no necesita cairosvg.

## Diferido (no tocar todavía)

- **Dominio:** `astro.config.mjs` → `catalinatorres.ca` (Tarea 18). No tocar `.env.example` ni `docs/setup.md` antes.
- **LinkedIn:** decisión pendiente, evaluar cerca del deploy. Si va, añadir a JSON-LD `sameAs` + aside de contact pages.
- **Demos end-to-end:** sólo después de conectar Vercel KV en deploy.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Si `EADDRINUSE`: `lsof -ti:4321 | xargs kill -9`.
- TDD obligatorio en `src/lib/*` — test que falla primero, después implementación.
- Commits atómicos por tipo: `feat:` para features, `fix:` para fixes de bugs/config, `docs:` para docs. NO mezclar concerns.
- Restricciones críticas en `CLAUDE.md` — re-leer si hay duda de estilo/copy.
- Logo workflow: si el dino necesita ajustes, edita `scripts/trace-logo.py` (TARGET_W/TARGET_H, threshold) y re-corre. La OG image se actualiza con `python3 scripts/generate-og.py`.
