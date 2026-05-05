---
**Última sesión:** 2026-05-04 (iteración post-launch)
**Próxima sesión:** Verificar 429 real en producción tras 3 envíos. Lighthouse + cross-browser todavía pendientes.
---

# Session handoff — Portfolio

## Estado en una línea

Sitio en producción en `https://catatorres.ca`. Iteración 2026-05-04 ejecutada: menú mobile sin hamburguesa, /contact con chips linkedin+email, /lab con un solo demo y copy nuevo, ERROR 429 reescrito, classifier eliminado, credenciales académicas en about. Todo verde local: 30 unit + 55 e2e.

## Iteración 2026-05-04 — qué cambió

Spec: [`docs/superpowers/specs/2026-05-04-portfolio-iteration-design.md`](./superpowers/specs/2026-05-04-portfolio-iteration-design.md)
Plan: [`docs/superpowers/plans/2026-05-04-portfolio-iteration-implementation.md`](./superpowers/plans/2026-05-04-portfolio-iteration-implementation.md)

- **Header mobile:** sin hamburguesa. Ahora muestra brand izquierda + lang derecha en row 1, y una franja con scroll horizontal de las 6 secciones en row 2. Página actual marcada en rojo
- **/contact y /es/contacto:** título solo "contact"/"contacto", 2 chips estilo home (linkedin → · email ↓), form abajo, sin la marginalia inferior
- **/lab y /es/lab:** un solo demo (workflow). Título nuevo ("let's run an experiment" / "Hagamos un experimento") con lede personal cerrado con un corazón pixel SVG ink. Cero menciones a Claude. Texto de rate limit eliminado. Chips linkedin+email al cierre
- **ERROR 429:** "i gave you everything. linkedin → or email → for more" / "te di todo lo que tenía. linkedin → o email → para más" — links activos
- **Rate limit:** workflow demo sube de 2 a 3 intentos por IP por 24h
- **/about y /es/sobre-mi:** último párrafo abre con credenciales (BA Comunicación Social + MA Digital Humanities U de Alberta)
- **Eliminado:** ClassifierDemo, /api/classify, classifyText en src/lib/claude.ts, sus tests
- **Nuevo guard:** `tests/e2e/no-brand-mentions.spec.ts` falla si reaparece "claude/anthropic/chatgpt/openai/perplexity" en páginas públicas (excepto /privacy)

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo
2. Correr `npm run test` y `npm run test:e2e` (asegurar 30 unit + 55 e2e verde antes de tocar código)
3. Atacar Lighthouse o cross-browser (lo que esté arriba en la lista pendiente)

## Verificado en QA

### Funcional (4/4)
- [x] Story demo en `/es/proyectos/interactive-story`: narrativa traducida (Cortázar)
- [x] Contact form end-to-end: mensaje real recibido en `catalinatorres1000@gmail.com`
- [x] 429 ES en `/es/lab`: mensaje "amor no encontrado" en español
- [x] Honeypot: verificado vía código ([src/lib/validation.ts:24](../src/lib/validation.ts) + [src/components/ContactForm.astro:12](../src/components/ContactForm.astro) + test). Endpoint retorna 403 si campo `website` está rellenado. Bonus: timing check 2s mín en validation.ts:25.

### Demos
- [x] Site cargando en `https://catatorres.ca` y `www.catatorres.ca` (SSL OK)
- [x] Páginas estáticas EN y ES navegando
- [x] Classifier en `/lab` (EN): input real → fields estructurados
- [x] Workflow Suggester rediseñado: copy persuasivo (hook + steps + closer) + diagrama horizontal HTML/CSS. Labels INICIO/ACCIÓN/RESULTADO en /es/lab. Filtro de marcas de IA prohibidas en validación.
- [x] Zodiac demo en `/es/proyectos/zodiac-book-recommender`: ES + títulos en español

### Mobile responsive (sesión 2026-05-04)
- [x] Viewport meta tag presente en Layout
- [x] Header mobile (<768px): barra fija con `[☰] [logo centrado] [EN/ES]`. Menú abierto: HOME · SERVICES · PROJECTS · LAB · ABOUT · CONTACT centrados, full-width, 16px font.
- [x] Header desktop: grid 3-col `1fr auto 1fr` (logo · nav centrado · lang). Font del nav 13px (subido desde 11px).
- [x] Header sticky (`position: sticky; top: 0; z-index: 100`) tanto en desktop como mobile.
- [x] Footer apila vertical en mobile (antes desbordaba 93px por el email).
- [x] Tokens font-size en mobile: body 16px, h1 ≤ 32px, h2 ≤ 24px, mín 14px en cualquier texto visible.
- [x] **Suite e2e `mobile-audit.spec.ts`**: 14 rutas × 2 viewports (375px iPhone SE + 390px iPhone 14) + hamburger toggle + desktop-no-hamburger = **30/30 pass**. Asserts: 0 horizontal scroll, 0 texto < 14px, 0 errores JS.

## Pendiente para cerrar Tarea 19

### Lighthouse audits
Targets: Performance ≥95, A11y =100, Best Practices ≥95, SEO =100. Rutas: `/`, `/projects`, `/lab`. Common fixes: alt text, color contrast, lang attr (ya cubierto).

### Cross-browser
Safari desktop, Chrome desktop, Firefox desktop, Safari iOS, Chrome Android. (mobile-audit.spec.ts ya corre en chromium; iOS Safari + Firefox desktop son los que faltan).

### Misc
- [ ] Confirmar que `torresautomatizations.com` (dominio viejo) ya no recibe tráfico
- [ ] `hostinger-recovery-codes.txt`: ya en `.gitignore` (commit 2026-05-04). Catalina debería moverlo fuera del repo a un password manager o `~/Documents/credentials/`.

## Decisiones / contexto crítico que NO está en el código

- **Dominio:** `catatorres.ca` (NO `catalinatorres.ca`). GitHub repo y Vercel project siguen con el nombre viejo `catalinatorres-ca` — son labels internos.
- **Resend:** dominio `catatorres.ca` con DKIM+SPF+DMARC verificados. From: `notify@catatorres.ca`. Subject prefix: `[catatorres]`.
- **DNS:** Hostinger (`hpanel.hostinger.com`). Records: A `@ → 76.76.21.21`, CNAME `www → catatorres.ca`, TXT/MX para Resend.
- **GitHub auth:** PAT cacheada en macOS keychain. `git push` funciona sin prompt.
- **Vercel CLI:** global, autenticada como `torresbe-1700`, scope `torresbes-projects`. Linkado al proyecto via `.vercel/project.json`. `vercel env ls/add/rm` y `vercel domains add` funcionan sin login. **NO** puede pullar las KV credentials de Upstash con `vercel env pull` — son inyectadas solo en runtime.
- **Email:** público `catalinatorres1000@gmail.com`. NO `fractalshoot@gmail.com` (sistema) ni `torresbe@ualberta.ca` (GitHub/Vercel auth).
- **Astro CSS scoping gotcha:** elementos creados via `innerHTML` no llevan el atributo `data-astro-cid-XXX` que Astro usa para scoping → reglas scoped no matchean. Fix establecido: `:global()` con prefix de container ID (e.g. `:global(#suggest-output .flow-card)`). Mantener este patrón al añadir nuevos componentes con output dinámico.
- **Sticky + overflow gotcha:** `overflow-x: hidden` en html/body rompe `position: sticky` en algunos browsers. La suite e2e `mobile-audit` ya garantiza que no haya scroll horizontal, así que el guard es innecesario. Si se necesita reintroducir un guard, aplicarlo a un wrapper específico, no al body.
- **Workflow Suggester schema:** `Flow = { hook, steps[], closer, nodes[], edges[] }`. Tipos de nodo: `trigger | action | result`. Validación rechaza marcas de IA (Claude, ChatGPT, GPT, Perplexity, OpenAI, Anthropic, Gemini, Bard, Copilot, LLM, Llama, Mistral, Cohere). Ver [src/lib/claude.ts:62](../src/lib/claude.ts).
- **API keys:** ANTHROPIC + RESEND en Vercel env vars (Production). NO commiteadas.

## Diferido / seguimiento opcional

- **`hostinger-recovery-codes.txt`:** mover fuera del repo a password manager o `~/Documents/credentials/`. Ya en `.gitignore`.
- **Vercel deployment alias `catalinatorres-ca.vercel.app`:** borrado por error, devuelve `DEPLOYMENT_NOT_FOUND`. No importa — `catatorres.ca` funciona. Se puede recrear si necesario.
- **Vercel Web Analytics:** activo en `astro.config.mjs`. Revisar después de que el sitio reciba tráfico.
- **Renombrar repo + Vercel project:** de `catalinatorres-ca` → `catatorres-ca`. Opcional, solo cosmético.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Demos siguen sin funcionar localmente sin env vars (Playwright tests validan el error path).
- Producción: `vercel --prod` o auto-deploy en cada `git push origin main`.
- Para limpiar rate limits durante QA: Upstash dashboard → Data Browser/CLI → comando `FLUSHDB`. (Vercel CLI no expone estas credentials.)
- Tests:
  - Vitest unit: `npm run test` (33 tests)
  - Playwright local: `npm run test:e2e` (smoke + mobile-audit, ~44 tests total)
- Commits atómicos por tipo: `feat:`, `fix:`, `chore:`, `docs:`, `test:`. Separar concerns.
