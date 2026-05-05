import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = [
  '/',
  '/services',
  '/projects',
  '/lab',
  '/about',
  '/contact',
  '/es',
  '/es/servicios',
  '/es/proyectos',
  '/es/lab',
  '/es/sobre-mi',
  '/es/contacto',
];

// Conservative list. Skips "llama" / "cohere" / "bard" / "gemini" / "copilot" because they
// have legitimate non-brand uses (verbs, astrological sign). Catches the brands most
// likely to leak from demo prose or marketing copy.
const FORBIDDEN = /\b(claude|anthropic|chatgpt|openai|perplexity)\b/i;

for (const route of PUBLIC_ROUTES) {
  test(`no AI brand names on ${route}`, async ({ page }) => {
    await page.goto(`http://localhost:4321${route}`);
    const html = await page.content();
    // Strip script and style content; we don't care about internal imports/identifiers in inlined JS,
    // only what is rendered as text or attributes the user sees.
    const visible = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '');
    const matches = visible.match(FORBIDDEN);
    expect(matches, matches ? `found brand in ${route}: ${matches[0]}` : 'should not find').toBeNull();
  });
}
