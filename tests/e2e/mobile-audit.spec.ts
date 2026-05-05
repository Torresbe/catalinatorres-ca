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

test('mobile shows section strip with all 6 items, no hamburger', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('http://localhost:4321/');

  // Hamburger and toggle script no longer exist
  await expect(page.locator('#nav-toggle')).toHaveCount(0);

  // Mobile strip is visible and contains all 6 items
  const strip = page.locator('.mobile-strip');
  await expect(strip).toBeVisible();
  const items = strip.locator('.strip-item');
  await expect(items).toHaveCount(6);

  // Current page (home) is highlighted
  const current = strip.locator('.strip-item.current');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(/home/i);
});

test('desktop shows inline nav, mobile strip is hidden', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:4321/');

  await expect(page.locator('#main-nav')).toBeVisible();
  await expect(page.locator('.mobile-strip')).toBeHidden();
  await expect(page.locator('#nav-toggle')).toHaveCount(0);
});
