import { expect, test } from '@playwright/test';

/**
 * E2E tests for the Home (Dashboard) page
 * Covers: layout, navigation header, hero section, feature grid, getting started section
 */
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load successfully and return 200', async ({ page }) => {
    const response = await page.request.get('/');
    expect(response.status()).toBe(200);
    expect(page.url()).toContain('/');
  });

  test('should have correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Enterprise React TypeScript/i);
  });

  // ── Header / Navigation ────────────────────────────────────────────
  test.describe('Navigation Header', () => {
    test('should display the app brand name', async ({ page }) => {
      const brand = page.locator('header h1');
      await expect(brand).toBeVisible();
      await expect(brand).toContainText('Enterprise React TypeScript');
    });

    test('should display all three navigation links', async ({ page }) => {
      const nav = page.locator('header nav');
      await expect(nav.getByRole('link', { name: /dashboard/i })).toBeVisible();
      await expect(nav.getByRole('link', { name: /users/i })).toBeVisible();
      await expect(
        nav.getByRole('link', { name: /architecture/i })
      ).toBeVisible();
    });

    test('should navigate to Users page via nav link', async ({ page }) => {
      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');
      expect(page.url()).toContain('/users');
    });

    test('should navigate to Architecture page via nav link', async ({
      page,
    }) => {
      await page
        .locator('header nav')
        .getByRole('link', { name: /architecture/i })
        .click();
      await page.waitForURL('**/architecture');
      expect(page.url()).toContain('/architecture');
    });

    test('Dashboard link should navigate back to home from Users', async ({
      page,
    }) => {
      // Navigate to Users via client-side navigation (avoids SSR hydration issues)
      await page
        .locator('header nav')
        .getByRole('link', { name: /users/i })
        .click();
      await page.waitForURL('**/users');
      // Now navigate back
      await page
        .locator('header nav')
        .getByRole('link', { name: /dashboard/i })
        .click();
      await page.waitForURL('/');
      expect(page.url()).toMatch(/localhost:3000\/$/);
    });
  });

  // ── Hero Section ───────────────────────────────────────────────────
  test.describe('Hero Section', () => {
    test('should display the hero heading', async ({ page }) => {
      // Use main h1 to avoid picking up the layout header's h1
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText(
        'Enterprise React TypeScript Workspace'
      );
    });

    test('should display the hero description paragraph', async ({ page }) => {
      const description = page.getByText(
        /comprehensive demonstration of SOLID principles/i
      );
      await expect(description).toBeVisible();
    });
  });

  // ── Feature Grid ───────────────────────────────────────────────────
  test.describe('Feature Grid', () => {
    test('should display all six feature cards', async ({ page }) => {
      const featureTitles = [
        'SOLID Principles',
        'Code Quality',
        'Testing Framework',
        'Monitoring',
        'Architecture Patterns',
        'Development Tools',
      ];
      for (const title of featureTitles) {
        await expect(page.getByText(title).first()).toBeVisible();
      }
    });

    test('should list SOLID principle items inside the card', async ({
      page,
    }) => {
      const solidPrinciples = [
        'Single Responsibility Principle',
        'Open/Closed Principle',
        'Liskov Substitution Principle',
        'Interface Segregation Principle',
        'Dependency Inversion Principle',
      ];
      for (const principle of solidPrinciples) {
        await expect(page.getByText(principle)).toBeVisible();
      }
    });
  });

  // ── Getting Started Section ────────────────────────────────────────
  test.describe('Getting Started Section', () => {
    test('should display Getting Started content', async ({ page }) => {
      await expect(page.getByText(/getting started/i).first()).toBeVisible();
    });
  });

  // ── Responsive layout ──────────────────────────────────────────────
  test.describe('Responsive Layout', () => {
    test('should render correctly on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('main')).toBeVisible();
    });

    test('should render correctly on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      await expect(page.locator('header')).toBeVisible();
    });
  });
});
