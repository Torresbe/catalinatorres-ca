---
**Última sesión:** 2026-05-01 (cont.)
**Próxima sesión:** terminar Tarea 19 (QA pendiente listado abajo). Sitio en producción y funcional.
---

# Session handoff — Portfolio

## Estado en una línea

Sitio en producción en `https://catatorres.ca` (+ `www.catatorres.ca`). Tareas 1–18 cerradas. Tarea 19 (QA) **parcialmente verificada** — quedan 4 chequeos manuales.

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo
2. Continuar el checklist de QA abajo en browser limpio (incognito o hard-refresh)
3. Cuando los 4 chequeos pendientes estén verdes, cerrar Tarea 19 y el proyecto

## Lo cerrado en la sesión 2026-05-01 (full-day deploy + QA)

8 commits sobre `main`. Highlights:

- **Tarea 17 (Playwright):** `playwright.config.ts` + 14 tests cubriendo nav, i18n, demos, contact, error path
- **Domain typo descubierto + corregido:** real `catatorres.ca`, no `catalinatorres.ca`. Sweep en commit `ea30e81`
- **LinkedIn:** JSON-LD `sameAs` y aside de `/contact` y `/es/contacto`
- **Tarea 18 (deploy):** repo GitHub `Torresbe/catalinatorres-ca`, proyecto Vercel `catalinatorres-ca` (los nombres conservan typo viejo — son labels internos), Upstash KV (`upstash-kv-fuchsia-kettle`) en Portland, env vars vivas, Resend domain `catatorres.ca` con DKIM+SPF+DMARC en Hostinger DNS, dominio apuntando a Vercel via A `76.76.21.21` + CNAME `www → catatorres.ca`
- **QA pass — bugs encontrados y arreglados (commits `47ad2cc` → `e84761c`):**
  - Classifier 500-eaba en producción porque Haiku envuelve JSON en markdown fences. Fix: extractor tolerante a fences ```` ```json ```` / ```` ``` ```` / preamble (`fix: tolerate markdown-wrapped JSON in classifier`)
  - Workflow output overflowing horizontal por user-agent default `<pre> { white-space: pre }` ganándole a la regla scoped. Fix: scoping global con `:global()` para elementos creados via innerHTML
  - 429 ES estaba en inglés ("love not found") → "amor no encontrado"
  - Zodiac demo en /es mostraba títulos en inglés → bilingüe (Hopscotch / Rayuela, Si una noche de invierno un viajero, etc.)
  - Story demo lang-aware con narrativa traducida ("INSTRUCCIONES PARA DARLE CUERDA AL RELOJ")

## Verificado en QA hoy

- [x] Site cargando en `https://catatorres.ca` y `www.catatorres.ca` (SSL OK)
- [x] Páginas estáticas EN navegando bien
- [x] Classifier en `/lab` (EN): input real → fields estructurados
- [x] Workflow Suggester: output con wrap correcto (long lines no overflow)
- [x] Zodiac demo en `/es/proyectos/zodiac-book-recommender`: ES + títulos en español

## Pendiente para cerrar Tarea 19

### Funcional (4 chequeos restantes)
- [ ] **Story demo en `/es/proyectos/interactive-story`:** abre con "INSTRUCCIONES PARA DARLE CUERDA AL RELOJ", choices "seguir leyendo" / "ponla en la hora que marca tu muñeca" / "ponla en la hora que tenía el dueño anterior", botón restart "reiniciar" al llegar a un final
- [ ] **Contact form end-to-end:** desde `/contact` enviar mensaje real → debe llegar a `catalinatorres1000@gmail.com` con subject `[catatorres] ...`. Verificar UI éxito muestra "letter received. you'll hear back within 48h."
- [ ] **429 ES en `/es/lab`:** después de 2 attempts del mismo demo, el 3er debe dar `ERROR 429 — amor no encontrado...` (en español, confirmar)
- [ ] **Honeypot:** rellenar campo `website` vía devtools en el contact form → submit debería rechazar (probable code 403)

### Page-by-page QA (todavía pendiente)
Para cada ruta (13 EN + 13 ES + ruta dinámica de proyectos): heading correcto, imágenes cargan, links internos/externos funcionan, mobile responsive (375px). Lista en plan línea 3459.

### Lighthouse audits
Targets: Performance ≥95, A11y =100, Best Practices ≥95, SEO =100. Rutas: `/`, `/projects`, `/lab`. Common fixes: alt text, color contrast, lang attr (ya cubierto).

### Cross-browser
Safari desktop, Chrome desktop, Firefox desktop, Safari iOS, Chrome Android.

### Misc
- [ ] Confirmar que `torresautomatizations.com` (dominio viejo) ya no recibe tráfico

## Decisiones / contexto crítico que NO está en el código

- **Dominio:** `catatorres.ca` (NO `catalinatorres.ca`). GitHub repo y Vercel project siguen con el nombre viejo `catalinatorres-ca` — son labels internos.
- **Resend:** dominio `catatorres.ca` con DKIM+SPF+DMARC verificados. From: `notify@catatorres.ca`. Subject prefix: `[catatorres]`.
- **DNS:** Hostinger (`hpanel.hostinger.com`). Records: A `@ → 76.76.21.21`, CNAME `www → catatorres.ca`, TXT/MX para Resend.
- **GitHub auth:** PAT cacheada en macOS keychain. `git push` funciona sin prompt.
- **Vercel CLI:** global, autenticada como `torresbe-1700`, scope `torresbes-projects`. Linkado al proyecto via `.vercel/project.json`. `vercel env ls/add/rm` y `vercel domains add` funcionan sin login. **NO** puede pullar las KV credentials de Upstash con `vercel env pull` — son inyectadas solo en runtime.
- **Email:** público `catalinatorres1000@gmail.com`. NO `fractalshoot@gmail.com` (sistema) ni `torresbe@ualberta.ca` (GitHub/Vercel auth).
- **Astro CSS scoping gotcha:** elementos creados via `innerHTML` no llevan el atributo `data-astro-cid-XXX` que Astro usa para scoping → reglas scoped no matchean. Fix establecido: `:global()` con prefix de container ID (e.g. `:global(#suggest-output .suggestion)`). Mantener este patrón al añadir nuevos componentes con output dinámico.
- **API keys:** ANTHROPIC + RESEND en Vercel env vars (Production). NO commiteadas. `hostinger-recovery-codes.txt` untracked en el repo — Catalina debe moverlo fuera del repo o añadirlo a `.gitignore`.

## Diferido / seguimiento opcional

- **`hostinger-recovery-codes.txt`:** mover fuera del repo
- **Vercel deployment alias `catalinatorres-ca.vercel.app`:** borrado por error, devuelve `DEPLOYMENT_NOT_FOUND`. No importa — `catatorres.ca` funciona. Se puede recrear si necesario.
- **Vercel Web Analytics:** activo en `astro.config.mjs`. Revisar después de que el sitio reciba tráfico.
- **Renombrar repo + Vercel project:** de `catalinatorres-ca` → `catatorres-ca`. Opcional, solo cosmético.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Demos siguen sin funcionar localmente sin env vars (Playwright tests validan el error path).
- Producción: `vercel --prod` o auto-deploy en cada `git push origin main`.
- Para limpiar rate limits durante QA: Upstash dashboard → Data Browser/CLI → comando `FLUSHDB`. (Vercel CLI no expone estas credentials.)
- Tests:
  - Vitest unit: `npm run test`
  - Playwright local: `npm run test:e2e`
- Commits atómicos por tipo: `feat:`, `fix:`, `chore:`, `docs:`, `test:`. Separar concerns.
