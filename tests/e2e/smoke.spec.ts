import { test, expect } from '@playwright/test';

test.describe('Core navigation — EN', () => {
  test('home loads with hero h1', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('AI Solutions');
  });

  test('top-level pages return 200 and render their section heading', async ({ page }) => {
    const routes: Array<{ path: string; heading: string }> = [
      { path: '/services', heading: 'What I do' },
      { path: '/projects', heading: 'Projects' },
      { path: '/lab', heading: 'Try the tools' },
      { path: '/about', heading: 'About' },
      { path: '/contact', heading: 'Contact' },
      { path: '/privacy', heading: 'Privacy' },
    ];
    for (const r of routes) {
      const res = await page.goto(r.path);
      expect(res?.status(), `status for ${r.path}`).toBe(200);
      await expect(
        page.getByRole('heading', { level: 2, name: r.heading }).first(),
        `h2 on ${r.path}`,
      ).toBeVisible();
    }
  });

  test('404 renders custom error', async ({ page }) => {
    const res = await page.goto('/does-not-exist-123');
    expect(res?.status()).toBe(404);
    await expect(page.getByText('ERROR 404')).toBeVisible();
  });
});

test.describe('i18n', () => {
  test('language toggle from / goes to /es', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /language/i }).click();
    await expect(page).toHaveURL(/\/es\/?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Spanish home loads with hero h1', async ({ page }) => {
    await page.goto('/es');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('asymmetric path mapping: /about ↔ /es/sobre-mi', async ({ page }) => {
    await page.goto('/about');
    const toggle = page.getByRole('link', { name: /language|idioma/i });
    await toggle.click();
    await expect(page).toHaveURL(/\/es\/sobre-mi\/?$/);
    await page.getByRole('link', { name: /language|idioma/i }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
  });
});

test.describe('Projects', () => {
  test('lists six projects', async ({ page }) => {
    await page.goto('/projects');
    const items = page.locator('ul.list > li');
    await expect(items).toHaveCount(6);
  });

  test('zodiac demo renders a recommendation', async ({ page }) => {
    await page.goto('/projects/zodiac-book-recommender');
    await page.selectOption('select#sign', 'aries');
    const title = page.locator('#out-title');
    await expect(title).toBeVisible();
    await expect(title).not.toBeEmpty();
  });

  test('story demo branches and reaches an ending', async ({ page }) => {
    await page.goto('/projects/interactive-story');
    const text = page.locator('#story-text');
    const restart = page.locator('#story-restart');
    await expect(text).not.toBeEmpty();

    // start → fork → wrist|previous (ending). Click first available choice each step.
    for (let i = 0; i < 4; i++) {
      const isEnding = await restart.isVisible();
      if (isEnding) break;
      await page.locator('button.choice').first().click();
    }
    await expect(restart).toBeVisible();
  });
});

test.describe('Contact form', () => {
  test('renders all required fields', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('input[name=name]')).toBeVisible();
    await expect(page.locator('input[name=email]')).toBeVisible();
    await expect(page.locator('input[name=subject]')).toBeVisible();
    await expect(page.locator('textarea[name=message]')).toBeVisible();
    await expect(page.locator('input[name=privacyAck]')).toBeVisible();
  });

  test('HTML5 required validation blocks empty submit', async ({ page }) => {
    await page.goto('/contact');
    await page.click('button[type=submit]');
    await expect(page).toHaveURL(/\/contact\/?$/);
  });

  // Without env vars the API returns 500. We just verify the error path renders.
  test('submit without env vars renders an ERROR badge', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('input[name=name]', 'Test User');
    await page.fill('input[name=email]', 'test@example.com');
    await page.fill('input[name=subject]', 'smoke test');
    await page.fill('textarea[name=message]', 'this is a smoke test message — long enough.');
    await page.check('input[name=privacyAck]');
    await page.click('button[type=submit]');
    const output = page.locator('#contact-output');
    await expect(output).toBeVisible();
    await expect(output.locator('.err .code')).toContainText('ERROR');
  });
});

test.describe('Lab demos (error path)', () => {
  // APIs require env vars (Vercel KV + Anthropic). Locally they return 500;
  // we verify the demos render the error badge instead of crashing.
  test('classifier renders ERROR badge without env vars', async ({ page }) => {
    await page.goto('/lab');
    await page.fill('#classify-form textarea[name=input]', 'classify this sample text for the smoke test.');
    await page.click('#classify-form button[type=submit]');
    const output = page.locator('#classify-output');
    await expect(output).toBeVisible();
    await expect(output.locator('.err .code')).toContainText('ERROR');
  });

  test('workflow suggester renders ERROR badge without env vars', async ({ page }) => {
    await page.goto('/lab');
    await page.fill('#suggest-form textarea[name=input]', 'I have 500 PDFs to classify by topic.');
    await page.click('#suggest-form button[type=submit]');
    const output = page.locator('#suggest-output');
    await expect(output).toBeVisible();
    await expect(output.locator('.err .code')).toContainText('ERROR');
  });
});
