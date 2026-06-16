---
**Última sesión:** 2026-05-04 (iteración post-launch + íconos + copy review)
**Próxima sesión:** Lighthouse + cross-browser. Verificar 429 real en producción tras 4 envíos al workflow. Ver "Pendiente" para opciones extra.
---

# Session handoff — Portfolio

## Estado en una línea

Sitio en producción en `https://catatorres.ca`. Iteración 2026-05-04 ejecutada y deployada en 4 commits-bundle: (1) cambios funcionales del spec D+G+E+F+About+ERROR 429, (2) íconos dino, (3) backgrounds transparentes, (4) capitalización + em-dashes. Local verde: 30 unit + 55 e2e.

## Iteración 2026-05-04

Spec: [`docs/superpowers/specs/2026-05-04-portfolio-iteration-design.md`](./superpowers/specs/2026-05-04-portfolio-iteration-design.md)
Plan: [`docs/superpowers/plans/2026-05-04-portfolio-iteration-implementation.md`](./superpowers/plans/2026-05-04-portfolio-iteration-implementation.md)

### Cambios funcionales (spec)

- **Header mobile:** sin hamburguesa. Row 1 brand izquierda + lang derecha; row 2 franja con scroll horizontal de las 6 secciones, prefix "Sections —"/"Secciones —", página actual en rojo
- **/contact y /es/contacto:** título "Contact"/"Contacto" + 2 chips (LinkedIn → · Email ↓) + form. Sin la marginalia inferior. `:global(html) { scroll-behavior: smooth }` para el chip Email ↓
- **/lab y /es/lab:** un solo demo (workflow). Título "Let's run an experiment" / "Hagamos un experimento". Lede personal con corazón pixel SVG ink al cierre. Sin marca Claude. Sin texto de rate limit. Chips LinkedIn + Email al cierre
- **ERROR 429:** "I gave you everything. LinkedIn → or Email → for more" / "Te di todo lo que tenía. LinkedIn → o Email → para más" — inline HTML con anchors activos
- **Rate limit:** workflow demo sube de 2 a 3 intentos por IP por 24h
- **/about y /es/sobre-mi:** último párrafo abre con BA Comunicación Social + MA Digital Humanities U de Alberta
- **Eliminado:** ClassifierDemo, /api/classify, classifyText en src/lib/claude.ts y sus tests
- **Nuevo guard:** `tests/e2e/no-brand-mentions.spec.ts` — 12 rutas × 1 test, falla si reaparece "claude/anthropic/chatgpt/openai/perplexity" en páginas públicas (excepto /privacy)

### Íconos dino (post-spec)

- 5 PNG pixel-art en `public/dinos/`, fondo transparente (flood-fill desde bordes + pure-white→transparent), totalizando ~93KB
- `mail.png` → /contact · `proyectos.png` → /projects · `servicios.png` → /services · `workflows.png` → /lab · `sobre-mi.png` → /about
- Justificados a la derecha al lado del título correspondiente, height 80px desktop · 56px mobile, `image-rendering: pixelated`
- `SectionHeader` ahora acepta prop `icon: { src, alt, width, height }`. Para /contact (h1 custom, no SectionHeader) la wrapping `.title-row` está inline en el .astro
- Originales pesados están en `DINOS/` (gitignored) por si hay que re-exportar

### Copy review (cierre del día)

Per RAE (ES) + Oxford (EN) — ver [memory:feedback_copy_typography.md](/Users/catalinatorresbenjumea/.claude/projects/-Users-catalinatorresbenjumea-Desktop-CLAUDE-CODE-Portfolio/memory/feedback_copy_typography.md):

- **Capitalización:** sentence starts capitalizados (`Let's run an experiment`, `Describe...`, `No te preocupes...`, `I'm`, etc.). Brand `LinkedIn` siempre con casing oficial. `Email` capitalizado al inicio de chip-label
- **Em-dashes:** los que abrían sin cerrar (parentheticals huérfanos en /lab lede, /projects subtítulo, /about, /index, StoryMiniDemo) reemplazados por punto/coma/dos puntos
- **NO se tocaron** los em-dashes que funcionan como separador de etiqueta tipo dictionary entry: chips home (`edit — what's dirty`), value lists `<strong>Clarity</strong> — ...`, folio labels (`MS. folio 1 — workflow suggester`), error format (`ERROR 429 — message`), meta titles (`Title — Catalina Torres`). Si se decide convertirlos a `:` o paréntesis, es otra ronda de copy review

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo
2. Correr `npm run test` (30) y `npm run test:e2e` (55) — todo verde antes de tocar código
3. Atacar Lighthouse o cross-browser (próxima prioridad)

## Pendiente para cerrar Tarea 19

### Lighthouse audits
Targets: Performance ≥95, A11y =100, Best Practices ≥95, SEO =100. Rutas: `/`, `/projects`, `/lab`. Posibles fixes: imagenes optimizadas (íconos ya optimizados), alt text (todos los íconos tienen alt=""), color contrast, lang attr (ya cubierto).

### Cross-browser
Safari desktop, Chrome desktop, Firefox desktop, Safari iOS, Chrome Android. (mobile-audit.spec.ts ya corre en chromium; iOS Safari + Firefox desktop son los que faltan). Especial atención: la mobile-strip horizontal scrollable + `position: sticky` históricamente problemático en iOS Safari.

## ⚠️ BLOQUEANTE — Resend domain no verificado (2026-06-16)

**Síntoma:** ningún correo sale del sitio — ni el formulario de contacto ni el nuevo aviso del Lab. Ambos envían desde `notify@catatorres.ca` y Resend los rechaza.

**Causa raíz (confirmada vía API de Resend):** el dominio `catatorres.ca` está en estado `failed`. Falta el registro **DKIM** en el DNS de Hostinger (probablemente se perdió en la migración de DNS o al añadir ImprovMX). Los registros `send` MX + TXT (amazonses) SÍ están en el DNS; Resend los marca failed solo porque la verificación global falla por el DKIM ausente.

**Fix (Catalina, en Hostinger hPanel → DNS de catatorres.ca):** añadir UN registro TXT:
- Tipo: `TXT`
- Name/Host: `resend._domainkey`
- Value: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCqt9QqtAXJ8HUdxrj+E2WgGSLOHN63H8z1hD84B6tFaUOrI/ukSkQ1NDbcphSp76yNjyuJQx+W7PVvRxnEbjaxwrL22Re4RRE5rMTIjOlIxnKluhTnZFor1GiPc29taBS4KoMWhEaAaB6XKXQwtg5+pUsEDizjLmmEdCOj4kI/bQIDAQAB`

Luego en resend.com/domains → catatorres.ca → "Verify". Cuando el dominio quede `verified`, ambos correos funcionan. Verificar end-to-end con un envío real del form y del Lab.

**Nota de diagnóstico:** se usó un endpoint temporal `/api/diag` (token-guarded) para leer la respuesta real de Resend sin exponer secretos; ya fue eliminado. El valor DKIM de arriba salió de la API de dominios de Resend.

**Gotcha de deploy descubierto:** pushes de git muy seguidos pueden colapsar en el auto-deploy y dejar `catatorres.ca` apuntando a un commit intermedio. Si el dominio no refleja el último push, forzar con `vercel deploy --prod` + `vercel alias set <url> catatorres.ca` (y `www.catatorres.ca`). Además: archivos en `src/pages/` con prefijo `_` NO se buildean como rutas (convención de Astro).

## Pendientes opcionales / diferidos

- [ ] **Em-dashes Categoría D/E** (separadores tipo `Etiqueta — descripción`): si Catalina quiere convertirlos a `:` por consistencia editorial, son ~15 ocurrencias en home chips, value lists de about/sobre-mi, folio labels, error format, y meta titles
- [ ] **Brand wordmark "catalina torres"** en el header — actualmente lowercase. Per RAE debería ser "Catalina Torres" pero es decisión de marca (similar a spotify, ebay). No tocado sin permiso
- [ ] Confirmar que `torresautomatizations.com` (dominio viejo) ya no recibe tráfico
- [ ] `hostinger-recovery-codes.txt` ya en `.gitignore` — moverlo fuera del repo a un password manager o `~/Documents/credentials/`
- [ ] Vercel deployment alias `catalinatorres-ca.vercel.app`: borrado por error, devuelve `DEPLOYMENT_NOT_FOUND`. No importa — `catatorres.ca` funciona. Recrear si necesario
- [ ] Vercel Web Analytics: activo en `astro.config.mjs`. Revisar después de tráfico real
- [ ] Renombrar repo + Vercel project de `catalinatorres-ca` → `catatorres-ca`. Cosmético

## Decisiones / contexto crítico que NO está en el código

- **Dominio:** `catatorres.ca` (NO `catalinatorres.ca`). GitHub repo y Vercel project siguen con el nombre viejo `catalinatorres-ca` — son labels internos
- **Resend:** dominio `catatorres.ca` con DKIM+SPF+DMARC verificados. From: `notify@catatorres.ca`. Subject prefix: `[catatorres]`
- **DNS:** Hostinger (`hpanel.hostinger.com`). Records: A `@ → 76.76.21.21`, CNAME `www → catatorres.ca`, TXT/MX para Resend
- **GitHub auth:** fine-grained PAT (solo repo `catalinatorres-ca`, Contents read/write) cacheada en macOS keychain vía `credential.helper osxkeychain` desde 2026-06-12. `git push` funciona sin prompt. El PAT anterior expiró en junio 2026; si push devuelve 403 "denied", revisar permisos/vigencia del token en github.com/settings/personal-access-tokens
- **Vercel CLI:** global, autenticada como `torresbe-1700`, scope `torresbes-projects`. Linkado vía `.vercel/project.json`. `vercel env ls/add/rm` y `vercel domains add` funcionan sin login. **NO** puede pullar las KV credentials de Upstash con `vercel env pull` — son inyectadas solo en runtime
- **Email:** público `hello@catatorres.ca` (reemplazó a `catalinatorres1000@gmail.com` en 2026-06). NO `fractalshoot@gmail.com` (sistema) ni `torresbe@ualberta.ca` (GitHub/Vercel auth). Verificar que `CONTACT_EMAIL` en Vercel apunte al mismo destino
- **Astro CSS scoping gotcha:** elementos creados via `innerHTML` no llevan el atributo `data-astro-cid-XXX` → reglas scoped no matchean. Fix: `:global()` con prefix de container ID (e.g. `:global(#suggest-output .flow-card)`). Selectores como `html` también necesitan `:global(html)` cuando se aplican desde `<style>` scoped
- **Sticky + overflow gotcha:** `overflow-x: hidden` en html/body rompe `position: sticky` en algunos browsers. La suite `mobile-audit` ya garantiza no scroll horizontal, así que el guard es innecesario. Si se necesita, aplicarlo a un wrapper específico
- **Workflow Suggester schema:** `Flow = { hook, steps[], closer, nodes[], edges[], review? }`. Tipos de nodo: `trigger | action | result`. `review` (nota del editor) = `{ confidence: high|medium|low, assumptions[], risks[], humanCheck }` — opcional al validar (si falta, el flujo se muestra sin nota; si viene malformado, 500). Validación rechaza marcas de IA (Claude, ChatGPT, GPT, Perplexity, OpenAI, Anthropic, Gemini, Bard, Copilot, LLM, Llama, Mistral, Cohere) en todos los campos, incluido review. Ver `src/lib/claude.ts`
- **ERROR 429 con HTML:** el mensaje 429 en `src/lib/errors.ts` contiene anchors HTML inline. Los `renderError()` de WorkflowDemo y ContactForm interpolan el `${msg}` sin escapar, lo cual hace que el HTML se renderice. Cualquier código nuevo de error 429 debe respetar este patrón
- **API keys:** ANTHROPIC + RESEND en Vercel env vars (Production). NO commiteadas

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Demos siguen sin funcionar localmente sin env vars (Playwright tests validan el error path)
- Producción: `vercel --prod` o auto-deploy en cada `git push origin main`
- Para limpiar rate limits durante QA: Upstash dashboard → Data Browser/CLI → comando `FLUSHDB`. (Vercel CLI no expone estas credentials)
- Tests:
  - Vitest unit: `npm run test` → **36 tests**
  - Playwright e2e: `npm run test:e2e` → **55 tests** (smoke 13, mobile-audit 30, no-brand-mentions 12)
- Commits atómicos por tipo: `feat:`, `fix:`, `chore:`, `docs:`, `test:`. Separar concerns
