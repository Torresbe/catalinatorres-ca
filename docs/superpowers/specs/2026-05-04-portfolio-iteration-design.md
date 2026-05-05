# Portfolio iteration — design spec (2026-05-04)

Continuación del spec base [`2026-04-23-portfolio-design.md`](./2026-04-23-portfolio-design.md). Este documento captura los cambios derivados del feedback de usuarios reales tras el lanzamiento en `https://catatorres.ca`.

## 1. Contexto

Tras dos semanas en producción Catalina recibió feedback que apunta a 4 problemas concretos: el menú mobile no se descubre, el contact form no comunica "respuesta rápida", el `/lab` no engancha y todavía aparece la marca Claude en páginas públicas. Este spec resuelve los 4 manteniendo la voz editorial y los tokens visuales existentes.

## 2. Alcance

**Dentro:**
- D — Header mobile sin hamburguesa, secciones siempre visibles
- G — Página `/contact` con dos canales (LinkedIn DM + email) en estilo chip del home
- E — `/lab` con un solo demo (workflow), copy reescrito, sin marca, 3 intentos
- F — Eliminación del texto de rate limit
- ERROR 429 reescrito (depende de G)

**Fuera:**
- Cambios al backend salvo el bump de rate limit 2→3
- Renombrar `/lab` o cambiar URLs
- Tocar la página `/privacy` (todas las marcas se mantienen ahí por transparencia)
- Renombrar tokens, cambiar paleta, cambiar tipografías

## 3. Decisiones

### 3.1. Header mobile (D)

Se elimina el botón hamburguesa. Las 6 secciones quedan permanentemente visibles en una franja horizontal con scroll.

**Layout (≤768px):**

```
┌─────────────────────────────────────────────┐
│ [trex] catalina torres            EN / es  │  ← row 1: brand izq · lang der
├─────────────────────────────────────────────┤
│ secciones — HOME · SERVICES · PROJECTS …  › │  ← row 2: strip scroll horizontal
└─────────────────────────────────────────────┘
```

**Detalles:**
- Row 1: brand a la izquierda en orientación horizontal — `[favicon.svg 40×20] catalina torres` con `flex-direction: row; gap: 8px`. Lang toggle a la derecha (sin cambios funcionales)
- Row 2: franja `<nav>` siempre visible
  - Prefix `secciones —` en Libre Bodoni italic, color marginalia
  - 6 items en Courier Prime 13px, uppercase, letter-spacing 1.5px
  - `overflow-x: auto; white-space: nowrap; gap: 14px`
  - Página actual: color rojo `#b8000a` con borde inferior 1px sólido rojo, padding-bottom 2px
  - Indicador `›` al final de la franja (color `#c4b89f`, font-size 18px) para señalar que hay más al deslizar
- Sticky con `position: sticky; top: 0; z-index: 100` (sin cambio respecto al actual)
- Background `#faf6ec` (paper)

**Desktop (≥769px):** sin cambios. Mantiene grid `1fr auto 1fr` con brand izq / nav centrado / lang der.

**Componentes afectados:**
- `src/components/Header.astro` — reescribe mobile-only del CSS, elimina `<button class="hamburger">` y todo el script `nav-toggle`
- Tests Playwright: actualizar `mobile-audit.spec.ts` y `smoke.spec.ts` que asumen hamburger toggle

### 3.2. Página /contact y /es/contacto (G)

Reemplaza el framing actual ("envía una carta") por dos CTAs en estilo chip.

**Layout:**

```
contacto

[ linkedin → ]  [ email ↓ ]

────────────────────────────
nombre   ____________________
email    ____________________
mensaje  ____________________
         ____________________

[ enviar → ]
```

**Detalles:**
- Título `<h1>contacto</h1>` (ES) / `<h1>contact</h1>` (EN). Sin lede, sin subtítulo.
- 2 chips en `<div class="chip-row">`. Mismos tokens que `.chips` en `src/pages/index.astro`:
  - Fondo `rgba(160,130,90,0.06)`
  - Borde `1px solid #c4b89f` (`var(--divider)`)
  - Border-radius 3px
  - Color texto `#7a6a54` (`var(--marginalia)`)
  - Font-family `var(--font-body)` (Courier Prime)
  - Letter-spacing 0.3px
- **Diferencia respecto al chip del home**: tamaño escalado para ser tap-target. Padding `10px 16px`, font-size 16px, alto resultante ~44px. Mismo lenguaje visual; solo cambia padding/font-size.
- Chip 1: `linkedin →` — link a `https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/` (`target="_blank"`, `rel="noopener noreferrer"`)
- Chip 2: `email ↓` — link `href="#contact-form"` con `scroll-behavior: smooth` ya configurado o aplicado al `<a>`
- La flecha (`→` o `↓`) en color `#2a2420` (`var(--ink)`) dentro de un `<span class="arrow">`
- Form abajo sin etiqueta "la carta" / "the letter". Mismos campos actuales. Submit button conserva la voz de manuscrito ("enviar →" / "send →").

**Hover:**
- Chip: borde y color → `#2a2420`, fondo → transparent (matching el hover del home: `border-color: var(--ink)` con `background: transparent`)

**Páginas afectadas:**
- `src/pages/contact.astro`
- `src/pages/es/contacto.astro`
- La marginalia inferior con LinkedIn que existe hoy se elimina — el chip ya cumple esa función. La marginalia con email se elimina también; queda subsumida en el chip y el form.

### 3.3. /lab y /es/lab (E + F)

Se elimina el ClassifierDemo. El WorkflowDemo pasa a ser único, renumerado a folio 1. Copy reescrito con voz personal.

**Cambios estructurales:**
- `src/components/ClassifierDemo.astro` — **borrar archivo**
- `src/pages/api/classify.ts` — **borrar endpoint** (no se referencia desde nada)
- Tests asociados a classify — borrar
- `src/lib/claude.ts` — `classifyText` y schema relacionado se eliminan
- `src/components/WorkflowDemo.astro` — actualizar `folio` label de "MS. folio 2" a "MS. folio 1" en ambos idiomas

**Copy /es/lab:**

```
[§4] LAB

Hagamos un experimento

describe ese problema para el que 'no tienes tiempo' y la herramienta
te sugiere un flujo de trabajo. no te preocupes si no entiendes,
para eso estoy yo[♥]

────────────────────────────────────────
MS. folio 1 — sugerencia de flujos

Describe un problema. Recibe un flujo sugerido.
Describe tu problema operativo en 1–3 frases. Inglés o español.

[ textarea con placeholder existente ]
[ Sugerir flujo → ]
────────────────────────────────────────

[ linkedin → ]  [ email → ]
```

**Copy /lab (EN):**

Espejo del ES. Title sentence-case, lede lowercase intencional.

```
let's run an experiment

describe that problem you 'don't have time for' and the tool
suggests a workflow. don't worry if it doesn't all make sense —
that's what i'm here for[♥]
```

**Sin tocar:**
- Folio 1 heading "Describe un problema. Recibe un flujo sugerido." / "Describe a problem. Get a suggested workflow."
- Marginalia "Describe tu problema operativo en 1–3 frases. Inglés o español."
- Placeholder con el ejemplo de PDFs académicos
- Botón `[ Sugerir flujo → ]` / `[ Suggest workflow → ]`

**Pixel heart `[♥]`:**

SVG inline 5×5, color ink `#2a2420`. `shape-rendering="crispEdges"` para mantener pixels nítidos. Tamaño en línea 14×14px, `vertical-align: -1px`, `margin-left: 2px`.

```svg
<svg width="14" height="14" viewBox="0 0 5 5" fill="#2a2420"
     shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg"
     aria-hidden="true">
  <rect x="0" y="0" width="2" height="1"/>
  <rect x="3" y="0" width="2" height="1"/>
  <rect x="0" y="1" width="5" height="2"/>
  <rect x="1" y="3" width="3" height="1"/>
  <rect x="2" y="4" width="1" height="1"/>
</svg>
```

Aparece al cierre del lede en `/lab` y `/es/lab`. Mismo approach que el favicon (que es SVG pixelado del trex).

**Eliminación rate limit text (F):**

Borrar el `<p class="marginalia">` actual al final de `lab.astro` y `es/lab.astro`. No se reemplaza.

**Contact chips al cierre:**

Bajo el WorkflowDemo, mismo patrón que `/contact`:
- `linkedin →` link externo
- `email →` link a `/contact` (no a un form local; en `/lab` no hay form)

**Rate limit backend:**
- `src/lib/ratelimit.ts` — bump de `2` a `3` requests por IP por 24h para los endpoints del lab
- El endpoint `/api/classify` se elimina, así que solo aplica a `/api/suggest-workflow`. El form de contacto tiene su propio límite (3/IP/24h en el spec original) — sin cambio

### 3.4. ERROR 429 (depende de G)

Mensaje actualizado en `src/lib/errors.ts`:

| | actual | nuevo |
|---|---|---|
| EN 429 | `love not found. try again in 24h or send a letter →` | `i gave you everything. linkedin → or email → for more` |
| ES 429 | `amor no encontrado. intenta en 24h o envía una carta →` | `te di todo lo que tenía. linkedin → o email → para más` |

**Requisito:**
- Las palabras `linkedin` y `email` en el mensaje deben ser links activos:
  - `linkedin` → `https://www.linkedin.com/in/catalina-torres-benjumea-3a64a523/` (target `_blank`, `rel="noopener noreferrer"`)
  - `email` → `/contact` o `/es/contacto` según idioma
- El shape exacto de `errorMessages` (template con placeholders, HTML embebido, o tupla `{ text, links[] }`) lo decide writing-plans. Hoy el shape es `Record<lang, Record<code, string>>`; tras este cambio el 429 necesita estructura para 2 links, mientras los otros codes pueden seguir como strings simples.

**Other error codes:** sin cambios. `400`, `401`, `404`, `503`, `504`, etc., siguen idénticos.

## 4. i18n

Cada cambio aplica espejo EN/ES. Strings nuevos a agregar en `src/i18n/` (la estructura exacta de keys la define el plan; lo que sigue son los valores):

- Nav prefix: `"secciones —"` / `"sections —"`
- Contact title: `"contacto"` / `"contact"`
- CTA chip linkedin: `"linkedin →"` (mismo en ambos idiomas)
- CTA chip email en `/contact`: `"email ↓"` (scroll al form local)
- CTA chip email en `/lab`: `"email →"` (link a `/contact`)
- Lab title: `"Hagamos un experimento"` / `"let's run an experiment"`
- Lab lede: el cuerpo completo del párrafo (EN espejo del ES, lowercase intencional, terminado con el SVG del corazón)
- Workflow folio label: `"MS. folio 1 — sugerencia de flujos"` / `"MS. folio 1 — workflow suggester"` (renumber de "folio 2")
- Error 429: ver §3.4

## 5. Out of scope / deferidos

- WhatsApp como canal de contacto — descartado (Catalina solo tiene número personal y no quiere quemarlo)
- Cal.com / Calendly — considerado pero no integrado en este spec; queda como futura iteración si LinkedIn DM no escala
- Renombrar repo / Vercel project de `catalinatorres-ca` a `catatorres-ca` — cosmético, sin urgencia
- Renombrar `/lab` URL — fuera de alcance

## 6. Impacto en tests

- **Borrar:** tests Playwright relacionados a Classifier (cualquier spec que valide `/api/classify` o `ClassifierDemo`). Verificar `tests/` directory en plan.
- **Borrar:** tests Vitest en `src/lib/claude.test.ts` que cubren `classifyText`.
- **Actualizar:** `mobile-audit.spec.ts` — el toggle hamburger ya no existe; los tests deben validar que las 6 secciones son visibles en mobile sin necesidad de tap.
- **Actualizar:** `smoke.spec.ts` — cualquier referencia al hamburger button.
- **Actualizar:** test del 429 (si existe) para validar el nuevo mensaje.
- **Agregar:** test que verifique que ninguna página excepto `/privacy` y `/es/privacidad` contiene la palabra "Claude" o "Anthropic" (regression guard).

## 7. Gotchas conocidas

- **Astro CSS scoping:** los chips se renderizan vía SSR, no via `innerHTML`, así que no necesitan `:global()`. Pero los mensajes de error sí (renderizados por JS post-fetch) — al cambiar el shape para soportar links, mantener el patrón `:global(#suggest-output ...)` ya establecido.
- **Sticky + horizontal scroll:** la franja de secciones tiene `overflow-x: auto` dentro de un header con `position: sticky`. Verificar que no se rompe en iOS Safari (combinación históricamente problemática). El test `mobile-audit.spec.ts` ya garantiza no horizontal scroll en `<body>`, lo cual es independiente del scroll horizontal interno del nav.
- **Tap target del strip de nav:** los items del strip son texto pequeño. En mobile cada item debe tener `padding: 8px 0` mínimo para alcanzar 32-40px de área tappeable, aunque visualmente se vea compacto.

## 8. Criterios de aceptación

- [ ] En mobile (≤768px), las 6 secciones del nav son visibles sin necesidad de tocar nada
- [ ] El botón hamburguesa no existe en ningún viewport
- [ ] `/contact` y `/es/contacto` muestran solo el título "contacto" + 2 chips + form. Sin lede, sin "carta" como copy principal
- [ ] Los chips visualmente comparten tokens con `.chips` del home (mismo borde, mismo fondo, mismo color, misma tipografía)
- [ ] `/lab` y `/es/lab` muestran un solo demo (Workflow Suggester)
- [ ] Ninguna página excepto `/privacy` y `/es/privacidad` menciona "Claude" o "Anthropic"
- [ ] El rate limit en backend para `/api/suggest-workflow` es 3 requests/IP/24h
- [ ] El texto "Rate limit: 2 requests…" / "Límite: 2 peticiones…" está borrado del UI
- [ ] El ERROR 429 dice "i gave you everything…" / "te di todo lo que tenía…" con LinkedIn y email como links activos
- [ ] El pixel heart aparece al final del lede de `/lab` y `/es/lab`, color ink, tamaño 14×14px
- [ ] La traducción al EN del lede mantiene el lowercase y el mismo registro emocional del ES
- [ ] Tests Playwright (mobile-audit + smoke + cualquier nuevo) pasan en chromium
- [ ] Build (`npm run build`) sin errores ni warnings nuevos
- [ ] Lighthouse en `/`, `/lab`, `/contact` mantiene Performance ≥95, A11y =100, SEO =100 (Tarea 19 pendiente del spec original)
