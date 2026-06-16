import type { APIRoute } from 'astro';

export const prerender = false;

// TEMPORARY diagnostic — delete after fixing Resend domain verification.
const TOKEN = 'diag-7f3a9c2e-remove-me';

export const GET: APIRoute = async ({ url }) => {
  if (url.searchParams.get('key') !== TOKEN) {
    return new Response('not found', { status: 404 });
  }

  const key = process.env.RESEND_API_KEY ?? '';
  try {
    const list = await fetch('https://api.resend.com/domains', {
      headers: { Authorization: `Bearer ${key}` },
    }).then((r) => r.json());

    const domains = (list?.data ?? []) as Array<{ id: string; name: string; status: string }>;
    const target = domains.find((d) => d.name === 'catatorres.ca');
    if (!target) return Response.json({ found: false, domains: domains.map((d) => d.name) });

    const detail = await fetch(`https://api.resend.com/domains/${target.id}`, {
      headers: { Authorization: `Bearer ${key}` },
    }).then((r) => r.json());

    const records = (detail?.records ?? []).map((r: Record<string, unknown>) => ({
      record: r.record,
      name: r.name,
      type: r.type,
      status: r.status,
      value: r.value,
    }));

    return Response.json({ found: true, status: detail?.status, records });
  } catch (e) {
    return Response.json({ error: e instanceof Error ? e.message : String(e) });
  }
};
