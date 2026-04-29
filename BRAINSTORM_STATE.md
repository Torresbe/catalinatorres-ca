# Portfolio — Estado (resumen)

**Última actualización:** 2026-04-24
**Status:** Brainstorm cerrado · Spec aprobado · Plan aprobado · Modo de ejecución: **INLINE**
**Próximo paso al retomar:** arrancar directamente con la primera tarea no completada del plan, sin repreguntar decisiones.

---

## Dónde vive ahora la información

El contenido completo de este archivo se reorganizó en `docs/` por tema. Puntos de entrada:

- `CLAUDE.md` — comandos, stack, restricciones, convenciones, rutas clave
- `docs/project-context.md` — Catalina, audiencia, 6 proyectos, estructura del sitio
- `docs/setup.md` — instalación, env vars, dominio, rate limits, deploy
- `docs/decisions.md` — stack rationale, arquitectura, demos, correcciones aplicadas
- `docs/voice-and-tone.md` — 10 pillars, forbidden, formato de errores, referencias
- `docs/visual-system.md` — tipografía, tokens, decoración, reglas duras
- `docs/implementation-status.md` — avance por día, checkpoints, próxima tarea
- `docs/superpowers/specs/2026-04-23-portfolio-design.md` — **Spec completo** (15 secciones, visual system, sitemap, acceptance criteria)
- `docs/superpowers/plans/2026-04-23-portfolio-implementation.md` — **Plan de 19 tareas** con código completo por paso

---

## Qué NO hacer al retomar

- No preguntar modo de ejecución (ya es inline)
- No repreguntar decisiones cerradas (visual system I, sitemap multi-page, voice, stack, rate limits)
- No releer el spec completo salvo que una tarea específica lo requiera
- No inventar cifras específicas para el copy — siempre verificar con Catalina

## Qué SÍ hacer al retomar

1. Leer `CLAUDE.md` + `docs/implementation-status.md`
2. Abrir el plan y saltar a la primera tarea no completada
3. Anunciar la tarea en una línea y ejecutar paso por paso
4. Parar en el checkpoint correspondiente para review de Catalina

---

## Histórico de compactaciones

- **Compactación 1** (2026-04-23) — después de spec + plan, antes de escoger modo de ejecución.
- **Compactación 2** (2026-04-23) — después de escoger modo INLINE. Arrancar Tarea 1 directamente.
- **Reorganización** (2026-04-24) — contenido distribuido a `CLAUDE.md` + `docs/`. Este archivo queda como índice histórico.

## Estado paralelo — WORK SEARCH (referencia rápida)

Proyecto separado en `/Users/catalinatorresbenjumea/Desktop/CLAUDE CODE/WORK SEARCH/`. Cambios a `perfil.md` y decisiones de aplicaciones no afectan al Portfolio salvo correcciones de hechos que sí deben reflejarse aquí (ver `docs/decisions.md § Correcciones aplicadas`).
