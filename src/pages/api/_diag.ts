import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

// TEMPORARY diagnostic endpoint — delete after debugging the lab email.
// Guarded by a token so only we can trigger it. Never exposes secret values,
// only whether they are present and the Resend response.
const TOKEN = 'diag-7f3a9c2e-remove-me';

export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get('key') !== TOKEN) {
    return new Response('not found', { status: 404 });
  }

  const contactEmail = process.env.CONTACT_EMAIL ?? '';
  const resendKey = process.env.RESEND_API_KEY ?? '';

  const diag: Record<string, unknown> = {
    contactEmailSet: contactEmail.length > 0,
    contactEmailLen: contactEmail.length,
    contactEmailDomain: contactEmail.includes('@') ? contactEmail.split('@')[1] : null,
    resendKeySet: resendKey.length > 0,
    resendKeyPrefix: resendKey.slice(0, 3),
  };

  try {
    const client = new Resend(resendKey);
    const { data, error } = await client.emails.send({
      from: 'notify@catatorres.ca',
      to: contactEmail,
      subject: '[catatorres] diag — test send',
      text: 'Diagnostic test send from /api/_diag. If you received this, delivery works.',
    });
    diag.sendOk = !error;
    diag.sendId = data?.id ?? null;
    diag.sendError = error ? { name: error.name, message: error.message } : null;
  } catch (e) {
    diag.sendOk = false;
    diag.sendThrew = e instanceof Error ? e.message : String(e);
  }

  return Response.json(diag);
};
