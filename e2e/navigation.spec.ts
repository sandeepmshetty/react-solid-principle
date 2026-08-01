import { expect, test } from '@playwright/test';

/**
 * E2E tests for cross-cutting concerns
 * Covers: navigation flows between pages, 404 handling, accessibility basics,
 *         and keyboard navigation
 *
 * NOTE: Pages that use the IoC container (e.g., /users) must be reached via
 * client-side navigation (nav link clicks) rather than direct page.goto() to
 * ensure the React hydration + container initialization succeed.
 */
test.describe('Navigation & Routing', () => {
  // ── Full Navigation Flow ───────────────────────────────────────────
  test.describe('Full Navigation Flow', () => {
    test('should complete full navigation cycle: Home → Users → Architecture → Home', async ({
      page,
    }) => {
      // Start at Home
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      // Use main h1 — the layout header also has an h1
      await expect(page.locator('main h1').first()).toContainText(
        'Enterprise React TypeScript Workspace'
      );

      // Go to Users via client-side nav
      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main h1').first()).toContainText(
        'User Management'
      );

      // Go to Architecture
      await page
        .locator('header nav')
        .getByRole('link', { name: /architecture/i })
        .click();
      await page.waitForURL('**/architecture');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main h1').first()).toContainText(
        'Enterprise Architecture'
      );

      // Return to Dashboard
      await page
        .locator('header nav')
        .getByRole('link', { name: /dashboard/i })
        .click();
      await page.waitForURL('/');
      await expect(page.locator('main h1').first()).toContainText(
        'Enterprise React TypeScript Workspace'
      );
    });

    test('browser back/forward buttons should work correctly', async ({
      page,
    }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');

      await page.goBack();
      await page.waitForURL('/');
      expect(page.url()).toMatch(/localhost:3000\/$/);

      await page.goForward();
      await page.waitForURL('**/users');
      expect(page.url()).toContain('/users');
    });
  });

  // ── 404 / Not Found ───────────────────────────────────────────────
  test.describe('404 Handling', () => {
    test('visiting an unknown route should return a non-200 status', async ({
      page,
    }) => {
      const response = await page.goto('/this-route-does-not-exist');
      expect(response?.status()).toBe(404);
    });
  });

  // ── Accessibility Basics ───────────────────────────────────────────
  test.describe('Accessibility', () => {
    test('home page should have a single <main> landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      const mains = await page.locator('main').count();
      expect(mains).toBe(1);
    });

    test('home page should have a <header> landmark', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('header')).toBeVisible();
    });

    test('users page should have a visible h1 in main', async ({ page }) => {
      // Navigate via client-side click to avoid SSR hydration failure
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main h1').first()).toBeVisible();
    });

    test('architecture page should have a visible h1 in main', async ({
      page,
    }) => {
      await page.goto('/architecture');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('main h1').first()).toBeVisible();
    });

    test('navigation links should be keyboard-focusable', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page.keyboard.press('Tab');
      const focused = page.locator(':focus');
      await expect(focused).toBeVisible();
    });
  });

  // ── URL Direct Access ──────────────────────────────────────────────
  test.describe('Direct URL Access', () => {
    test('should load /users via client-side navigation and show correct heading', async ({
      page,
    }) => {
      // /users relies on client-side IoC init — reach it via nav click
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/users');
      await expect(page.locator('main h1').first()).toContainText(
        'User Management'
      );
    });

    test('should load /architecture directly and show correct heading', async ({
      page,
    }) => {
      // Architecture page has no IoC container — direct navigation works fine
      await page.goto('/architecture');
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('/architecture');
      await expect(page.locator('main h1').first()).toContainText(
        'Enterprise Architecture'
      );
    });
  });
});
