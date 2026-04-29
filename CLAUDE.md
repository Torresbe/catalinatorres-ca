# Portfolio — Agent instructions

Sitio personal de Catalina Torres. Astro + Vercel, bilingüe EN/ES.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Test unit: `npm run test`
- Test e2e: `npm run test:e2e`
- Deploy: `vercel --prod`

## Stack

- Astro 6 + TypeScript (strict)
- Vercel (serverless + KV)
- Claude Haiku 4.5 (`claude-haiku-4-5-20251001`)
- Resend (email transaccional)
- Vitest + Playwright

## Restricciones críticas

- **NO** inclusive-language shortcuts en español ("todes/les/they-singular")
- **NO** sombras, gradients, ni rounded corners >4px
- **NO** cifras específicas al site sin verificación con Catalina
- **NO** modificar archivos originales sin confirmación
- **NO** sans-serif para body (usar Courier Prime)
- Responder en español salvo indicación contraria

## Convenciones

- TypeScript strict; TDD obligatorio en `src/lib/*`
- Commits: `feat:`, `fix:`, `docs:` (imperativo, lowercase)
- Copy binding a Voice & Tone — ver docs/voice-and-tone.md
- Error format: `ERROR [CODE] — [mensaje lowercase]` en Courier Prime rojo `#b8000a`
- i18n: páginas paralelas EN|ES (no toggle que oculta contenido)

## Rutas clave

- Spec: `docs/superpowers/specs/2026-04-23-portfolio-design.md`
- Plan: `docs/superpowers/plans/2026-04-23-portfolio-implementation.md`
- Estado: `docs/implementation-status.md`
- Errores: `src/lib/errors.ts`
- Content: `src/content/projects/`
- i18n: `src/i18n/`
- Env template: `.env.example`

## Documentación

- Ver docs/project-context.md para contexto de negocio, audiencia y proyectos
- Ver docs/setup.md para instalación, env vars y rate limits
- Ver docs/decisions.md para decisiones técnicas aprobadas
- Ver docs/voice-and-tone.md para voz editorial y 10 pillars
- Ver docs/visual-system.md para tipografía, color y decoración
- Ver docs/implementation-status.md para progreso del plan
- Ver docs/session-handoff.md para retomar sesión
- Ver BRAINSTORM_STATE.md para contexto histórico completo
