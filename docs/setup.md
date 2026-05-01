# Setup — Portfolio

## Requisitos

- Node.js ≥ 22.12.0
- Cuenta Vercel (email: `catalinatorres1000@gmail.com`)
- Dominio: `catalinatorres.ca` (ya propiedad vía Hostinger)

## Instalación

```sh
npm install
cp .env.example .env
# rellenar las variables descritas abajo
npm run dev
```

Dev server arranca en `http://localhost:4321`.

## Variables de entorno

| Variable | Uso |
|---|---|
| `ANTHROPIC_API_KEY` | Claude Haiku 4.5 para demos del Lab |
| `RESEND_API_KEY` | Email transaccional (tier gratis 3000/mes) |
| `CONTACT_EMAIL` | Destino de mensajes del form |
| `SITE_URL` | `https://catalinatorres.ca` |
| `KV_REST_API_URL` | Vercel KV (rate limiting) |
| `KV_REST_API_TOKEN` | Vercel KV token |

## Migración de dominio

`catalinatorres.ca` está registrado en **Hostinger**. DNS records (A para apex, CNAME para www) se añaden en el panel de Hostinger durante el deploy. El dominio viejo `torresautomatizations.com` (Namecheap) se abandona — no se migra.

## Rate limits configurados

- **Lab demos:** 2 requests por demo por IP por 24h
- **Contact form:** 3 requests por IP por 24h
- **Storage:** Vercel KV con SHA-256 hash de IP (no IP plana)

## Anti-spam del contact form

- Honeypot field
- Timing check: submit en <2s = bot
- Rate limit (ver arriba)

## Deploy

```sh
vercel --prod
```

El adapter `@astrojs/vercel` está configurado en `astro.config.mjs`.
