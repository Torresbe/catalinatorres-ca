import type { APIRoute } from 'astro';
import { validateDemoInput } from '../../lib/validation';
import { checkAndIncrement } from '../../lib/ratelimit';
import { suggestWorkflow } from '../../lib/claude';

export const prerender = false;

const DEMO_LIMIT = 2;
const MAX_INPUT_CHARS = 2000;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    const body = await request.json();
    const input = (body.input ?? '').toString();

    const validation = validateDemoInput(input, MAX_INPUT_CHARS);
    if (!validation.ok) {
      return Response.json({ ok: false, code: validation.code }, { status: validation.code! });
    }

    const ip = clientAddress || 'unknown';
    const limit = await checkAndIncrement(ip, 'suggest-workflow', DEMO_LIMIT);
    if (!limit.allowed) {
      return Response.json({ ok: false, code: 429 }, { status: 429 });
    }

    const result = await suggestWorkflow(input);
    if (!result.ok) {
      return Response.json({ ok: false, code: result.code }, { status: result.code! });
    }

    return Response.json({ ok: true, text: result.text });
  } catch {
    return Response.json({ ok: false, code: 500 }, { status: 500 });
  }
};
