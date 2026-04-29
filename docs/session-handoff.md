---
**Última sesión:** 2026-04-29
**Próxima sesión:** arrancar Tarea 10 (Claude API wrapper, TDD).
---

# Session handoff — Portfolio

## Estado en una línea

Tareas 8–9 **CERRADAS** (rate limiter + validation), 15/15 tests passing. Tarea 10 (Claude API wrapper) lista para arrancar.

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo.
2. `npm run dev` (puerto 4321).
3. Abrir el plan: `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` → **Tarea 10** (`classifyText` + `suggestWorkflow`).

## Lo cerrado en la sesión 2026-04-29

Cuatro commits limpios sobre `main`:

- `ce00c5f` — `feat: copy review — first-person voice, ES pages, About rename` (bloque pendiente de la sesión anterior, 36 archivos).
- `5b1f6c4` — `fix: decode URL spaces in vitest @lib alias` (bug de config: `URL.pathname` no decodifica `%20` por el espacio en "CLAUDE CODE", `@lib/*` no resolvía. Cambio a `fileURLToPath`).
- `4a5110a` — `feat: Vercel KV-backed rate limiter with IP hashing (TDD)` (Tarea 8).
- `a3d8581` — `feat: input validation for contact form and demos (TDD)` (Tarea 9).

Tarea 8 entregó:
- `src/lib/ratelimit.ts` — `checkAndIncrement(ip, bucket, limit)`, IP hasheada SHA-256 (16 chars), `kv.incr` con TTL 24h en el primer hit.
- `tests/unit/ratelimit.test.ts` — 5 casos (primer request, hasta el límite, después del límite, separación por bucket, separación por IP).

Tarea 9 entregó:
- `src/lib/validation.ts` — `validateContact` (honeypot, timing >=2s, name/email/subject/message, 10–3000 chars) + `validateDemoInput` (no vacío, max chars). Devuelve `{ ok, code, field?, message? }` con `ErrorCode` 400/403/413.
- `tests/unit/validation.test.ts` — 10 casos (happy path + cada modo de fallo).

## Pendiente para Tarea 10

Crea `src/lib/claude.ts` + `tests/unit/claude.test.ts` (TDD). Funciones:

- `classifyText(input)` — llama a Claude Haiku 4.5 (`claude-haiku-4-5-20251001`), parsea JSON `{ type, complexity, tools, timeline, tags }`. Devuelve `{ ok, fields? }` con códigos 500 (JSON malformado) y 503 (API error).
- `suggestWorkflow(input)` — devuelve texto libre (markdown con headings tipo `§`).

Mock de `@anthropic-ai/sdk` en el test (constructor + `messages.create`).

Después siguen Tareas 11–14 (Resend wrapper → APIs Lab → ContactForm → Contact page). Checkpoint de review de Catalina **después de Tarea 14**.

## Diferido (no tocar todavía)

- **Dominio:** `catalinatorres.ca` reemplaza `torresautomatizations.com`. Aplicar en fase de deploy (Tarea 18). No tocar `.env.example` ni `docs/setup.md` antes.
- **LinkedIn:** decisión sobre hacerlo público pendiente, evaluar cerca del deploy.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Si `EADDRINUSE`: `lsof -ti:4321 | xargs kill -9`.
- TDD obligatorio en `src/lib/*` — test que falla primero, después implementación.
- Restricciones críticas en `CLAUDE.md` — re-leer si hay duda de estilo/copy.
