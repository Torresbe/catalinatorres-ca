import { test, expect } from '@playwright/test';

const ROUTES = [
  '/', '/services', '/projects', '/lab', '/about', '/contact',
  '/es/', '/es/servicios', '/es/proyectos', '/es/lab', '/es/sobre-mi', '/es/contacto',
  '/projects/geoffrey', '/es/proyectos/geoffrey',
];

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
];

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`${vp.name} (${vp.width}px) — ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
      await page.goto(`http://localhost:4321${route}`, { waitUntil: 'domcontentloaded' });

      // 1. No horizontal scroll
      const scroll = await page.evaluate(() => ({
        docW: document.documentElement.scrollWidth,
        winW: window.innerWidth,
        bodyW: document.body.scrollWidth,
      }));
      expect(scroll.docW, `horizontal overflow: doc=${scroll.docW} win=${scroll.winW}`).toBeLessThanOrEqual(scroll.winW + 1);

      // 2. No text below 14px (excluding visually-hidden / screen-reader-only elements)
      const tinyText = await page.evaluate(() => {
        const issues: { tag: string; size: number; text: string }[] = [];
        const all = document.querySelectorAll('body *');
        for (const el of all) {
          const cs = getComputedStyle(el);
          const size = parseFloat(cs.fontSize);
          if (size < 14 && el.textContent?.trim() && cs.visibility !== 'hidden' && cs.display !== 'none') {
            const rect = (el as HTMLElement).getBoundingClientRect();
            if (rect.width > 1 && rect.height > 1) {
              issues.push({ tag: el.tagName, size, text: el.textContent.trim().slice(0, 40) });
            }
          }
        }
        return issues.slice(0, 10);
      });
      expect(tinyText, `text below 14px: ${JSON.stringify(tinyText, null, 2)}`).toEqual([]);

      // 3. No JS errors on page load
      expect(errors, errors.join('\n')).toEqual([]);
    });
  }
}

test('hamburger menu toggles nav on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4321/');

  const nav = page.locator('#main-nav');
  const btn = page.locator('#nav-toggle');

  await expect(nav).toBeHidden();
  await expect(btn).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');

  await btn.click();
  await expect(nav).toBeVisible();
  await expect(btn).toHaveAttribute('aria-expanded', 'true');

  await btn.click();
  await expect(nav).toBeHidden();
});

test('header on desktop shows nav inline, no hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/');

  await expect(page.locator('#main-nav')).toBeVisible();
  await expect(page.locator('#nav-toggle')).toBeHidden();
});
