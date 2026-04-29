---
**Última sesión:** 2026-04-28
**Próxima sesión:** arrancar Tarea 8 (rate limiter, TDD).
---

# Session handoff — Portfolio

## Estado en una línea

Bloque de copy review **CERRADO**. Tarea 8 (Lab backend) lista para arrancar mañana.

## Cómo retomar

1. Leer `CLAUDE.md` y este archivo.
2. `npm run dev` (puerto 4321).
3. Abrir el plan: `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` → **Tarea 8** (línea 1774).

## Lo aprobado en la sesión 2026-04-28

Detalle completo en `docs/decisions.md § Copy review — bloque cerrado`. Resumen:

- **HOME** limpia (sin proyectos ni tech stack), en primera persona ("What I do" / "Lo que hago").
- **About** renombrado a "Sobre mí" (`/es/sobre-mi`), copy en primera persona singular en EN+ES.
- **Privacy ES** creada (`/es/privacidad`).
- **Header** corregido para apuntar a `/es/sobre-mi`.
- Sin "we / hacemos / nuestros" residuales en páginas.

## Cambios sin commitear

Trabajo de la sesión, **no committeado todavía**. Decidir mañana si committear antes de arrancar Tarea 8 o después del bloque del Lab:

- HOME (EN+ES), About EN, About ES (renombrado), Header, Services, Privacy ES, demás docs de la reorganización.
- Recomendación: commit ahora para tener un punto limpio antes de entrar a TDD.

## Pendiente para Tarea 8

Dependencias ya instaladas (`@vercel/kv`, `vitest`, alias `@lib/*`, `vitest.config.ts` ✓). Tarea 8 crea:

- `src/lib/ratelimit.ts` — `checkAndIncrement(ip, bucket, limit)` con Vercel KV
- `tests/unit/ratelimit.test.ts` — 5 casos: primer request, hasta el límite, después del límite, separación por bucket, separación por IP

Después siguen Tareas 9–14 (Claude wrapper → Resend wrapper → APIs Lab → ContactForm → Contact page). Checkpoint de review de Catalina **después de Tarea 14**.

## Diferido (no tocar todavía)

- **Dominio:** `catalinatorres.ca` reemplaza `torresautomatizations.com`. Aplicar en fase de deploy (Tarea 18). No tocar `.env.example` ni `docs/setup.md` antes.
- **LinkedIn:** decisión sobre hacerlo público pendiente, evaluar cerca del deploy.

## Recordatorios operacionales

- Dev server: `npm run dev` (puerto 4321). Si `EADDRINUSE`: `lsof -ti:4321 | xargs kill -9`.
- TDD obligatorio en `src/lib/*` — test que falla primero, después implementación.
- Restricciones críticas en `CLAUDE.md` — re-leer si hay duda de estilo/copy.
