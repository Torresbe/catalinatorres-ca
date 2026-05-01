---
**Última sesión:** 2026-05-01
**Próxima sesión:** Tarea 19 (QA final). Sitio en producción y funcional, falta validación.
---

# Session handoff — Portfolio

## Estado en una línea

Sitio en producción en `https://catatorres.ca` (+ `www.catatorres.ca`). Tareas 1–18 cerradas. Solo queda **Tarea 19** (QA final).

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo
2. Abrir `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` → Tarea 19 (línea 3446)
3. Empezar con un browser limpio en `https://catatorres.ca` y trabajar el checklist de QA

## Lo cerrado en la sesión 2026-05-01

3 commits sobre `main` desde el handoff anterior. Highlights:

- **Tarea 17 (Playwright):** `playwright.config.ts` + `tests/e2e/smoke.spec.ts` con 14 tests cubriendo nav, i18n, demos client-side, contact form, Lab error path
- **Domain decisions:** dominio comprado en Hostinger (no Namecheap como decía el plan). Inicialmente con typo `catalinatorres.ca` → corregido a `catatorres.ca` en commit `ea30e81`
- **LinkedIn:** ahora visible en JSON-LD `sameAs` y aside de `/contact` y `/es/contacto`
- **Tarea 18 (deploy):** repo en GitHub `Torresbe/catalinatorres-ca`, proyecto Vercel `catalinatorres-ca` (los nombres conservan el typo viejo — son labels internos, no afectan funcionalidad), Upstash Redis (`upstash-kv-fuchsia-kettle`) en Portland conectado, env vars cargadas (Anthropic, Resend, KV pack, CONTACT_EMAIL, SITE_URL), Resend domain verificado para `catatorres.ca` con DKIM+SPF+DMARC en Hostinger DNS, custom domain `catatorres.ca` apuntando a Vercel via A record `76.76.21.21` y www CNAME a apex

## Pendiente para Tarea 19 (QA final)

Plan en `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` línea 3446. Resumen:

### Page-by-page QA
Para cada ruta (las 13 EN + 13 ES + ruta dinámica de proyectos): heading correcto, imágenes cargan, links internos/externos funcionan, mobile responsive (375px). Lista completa de rutas en el plan línea 3459.

### Funcional
- [ ] Contact form: enviar mensaje real → llega a `catalinatorres1000@gmail.com` con subject `[catatorres] ...`
- [ ] Contact form: éxito UI muestra "letter received. you'll hear back within 48h."
- [ ] Contact form: 3 envíos seguidos desde misma IP → 4to devuelve 429 (usar incognito tabs)
- [ ] Honeypot: rellenar `website` field vía devtools → debería rechazar
- [ ] Classifier (lab): input EN devuelve type/complexity/tools/timeline/tags estructurado
- [ ] Classifier: input ES idem (output en español)
- [ ] Classifier: 3a request desde misma IP → 429
- [ ] Workflow suggester: input válido devuelve workflow estructurado
- [ ] Workflow suggester: 3a request → 429
- [ ] Zodiac demo (project page): seleccionar signo → recommendation aparece
- [ ] Story demo: choices ramifican, restart funciona
- [ ] Lang toggle: bidireccional desde cada página
- [ ] 404 custom: `/nonexistent` muestra "ERROR 404 — ..."

### Lighthouse audits
Targets: Performance ≥95, A11y =100, Best Practices ≥95, SEO =100. Routes: `/`, `/projects`, `/lab`. Common fixes: alt text, color contrast (improbable dado tokens), lang attr (ya).

### Cross-browser
Safari desktop, Chrome desktop, Firefox desktop, Safari iOS, Chrome Android.

### Misc
- [ ] Verificar que `torresautomatizations.com` (dominio viejo, Namecheap) ya no recibe tráfico (DNS apunta a Vercel viejo o se puede dejar morir)

## Decisiones / contexto crítico que NO está en el código

- **Dominio:** `catatorres.ca` (NO `catalinatorres.ca`). El typo se descubrió a mitad del deploy. GitHub repo y Vercel project siguen con el nombre viejo `catalinatorres-ca` porque renombrarlos no aporta valor — son labels internos. El sitio en producción usa el dominio correcto.
- **Resend:** dominio `catatorres.ca` registrado, DKIM+SPF+DMARC verificados. From address: `notify@catatorres.ca`. Subject prefix: `[catatorres]`.
- **DNS host:** Hostinger (no Namecheap). El panel está en `hpanel.hostinger.com`. Records actuales: A `@ → 76.76.21.21`, CNAME `www → catatorres.ca`, TXT/MX para Resend (DKIM, SPF, DMARC).
- **GitHub auth:** PAT cacheada en macOS keychain (osxkeychain helper). `git push` funciona sin prompt.
- **Vercel CLI:** instalada globalmente (`/Users/catalinatorresbenjumea/.nvm/versions/node/v22.22.2/bin/vercel`), autenticada como `torresbe-1700`, scope `torresbes-projects`. `vercel env ls/add/rm` y `vercel domains add` funcionan sin login.
- **Email:** `catalinatorres1000@gmail.com` para contact (NO `fractalshoot@gmail.com` ni `torresbe@ualberta.ca`).
- **Playwright tests del plan tenían bugs:** `getByRole('heading', { level: 1, level: 2 })` (clave duplicada inválida) y asumía h1 en todas las páginas. El spec corregido verifica los nombres reales de los h2.
- **API keys:** ANTHROPIC + RESEND viven en Vercel env vars (Production env). NO están commiteadas. `hostinger-recovery-codes.txt` quedó untracked en el repo — Catalina debe moverlo fuera del repo o añadirlo a `.gitignore`.

## Diferido / seguimiento opcional

- **`hostinger-recovery-codes.txt`:** mover fuera del repo (riesgo bajo pero buena higiene)
- **Vercel deployment alias `catalinatorres-ca.vercel.app`:** Catalina lo borró por error en algún momento. Devuelve `DEPLOYMENT_NOT_FOUND`. No importa porque el dominio real `catatorres.ca` funciona. Se puede recrear si se necesita.
- **Análisis de tráfico:** Vercel Web Analytics está activado en `astro.config.mjs`. Empezar a revisarlo después de que el sitio reciba tráfico real.
- **Renombrar repo + proyecto Vercel** de `catalinatorres-ca` a `catatorres-ca` — opcional, solo cosmético.

## Recordatorios operacionales

- Dev server local: `npm run dev` (puerto 4321). Demos siguen sin funcionar localmente sin env vars (es lo esperado, los Playwright tests validan el path de error).
- Producción: `vercel --prod` desde el project root. Auto-deploy también ocurre en cada `git push origin main`.
- Tests:
  - Vitest unit: `npm run test`
  - Playwright local: `npm run test:e2e` (corre contra dev server local)
  - Playwright contra producción: cambiar `baseURL` en `playwright.config.ts` a `https://catatorres.ca` temporalmente (no commitear ese cambio)
- Commits atómicos por tipo: `feat:`, `fix:`, `chore:`, `docs:`, `test:`. NO mezclar concerns.
