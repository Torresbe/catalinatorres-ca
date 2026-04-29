import type { APIRoute } from 'astro';
import { validateContact } from '../../lib/validation';
import { checkAndIncrement } from '../../lib/ratelimit';
import { sendContactEmail } from '../../lib/resend';

export const prerender = false;

const CONTACT_LIMIT = 3;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json();

    const validation = validateContact({
      name: body.name ?? '',
      email: body.email ?? '',
      company: body.company ?? '',
      subject: body.subject ?? '',
      message: body.message ?? '',
      website: body.website ?? '',
      submittedAfterMs: Number(body.submittedAfterMs ?? 0),
    });

    if (!validation.ok) {
      return Response.json({ ok: false, code: validation.code, field: validation.field }, { status: validation.code! });
    }

    const ip = clientAddress || 'unknown';
    const limit = await checkAndIncrement(ip, 'contact', CONTACT_LIMIT);
    if (!limit.allowed) {
      return Response.json({ ok: false, code: 429 }, { status: 429 });
    }

    const result = await sendContactEmail({
      name: body.name,
      email: body.email,
      company: body.company,
      subject: body.subject,
      message: body.message,
    });

    if (!result.ok) {
      return Response.json({ ok: false, code: 503 }, { status: 503 });
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, code: 500 }, { status: 500 });
  }
};
