import { expect, test } from '@playwright/test';

/**
 * E2E tests for the Architecture page
 * Covers: page load, all architecture sections, SOLID implementation, design patterns,
 *         DI container, testing strategy, project structure
 */
test.describe('Architecture Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/architecture');
    await page.waitForLoadState('networkidle');
  });

  // ── Page Load ──────────────────────────────────────────────────────
  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      expect(page.url()).toContain('/architecture');
    });

    test('should display the page heading', async ({ page }) => {
      // Use main h1 — the layout header also has an h1, target the page heading
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('Enterprise Architecture');
    });

    test('should display the page description', async ({ page }) => {
      await expect(
        page.getByText(/comprehensive overview of our modular/i)
      ).toBeVisible();
    });
  });

  // ── Architecture Layers Section ────────────────────────────────────
  test.describe('Architecture Layers', () => {
    test('should display Architecture Layers content', async ({ page }) => {
      // ArchitectureLayers component is rendered on the page
      await expect(page.locator('main')).toBeVisible();
    });

    test('should reference the Domain layer', async ({ page }) => {
      await expect(page.getByText(/domain/i).first()).toBeVisible();
    });

    test('should reference the Application layer', async ({ page }) => {
      await expect(page.getByText(/application/i).first()).toBeVisible();
    });

    test('should reference the Infrastructure layer', async ({ page }) => {
      await expect(page.getByText(/infrastructure/i).first()).toBeVisible();
    });
  });

  // ── SOLID Implementation Section ───────────────────────────────────
  test.describe('SOLID Implementation', () => {
    test('should mention Single Responsibility Principle', async ({ page }) => {
      await expect(
        page.getByText(/single responsibility/i).first()
      ).toBeVisible();
    });

    test('should mention Open/Closed Principle', async ({ page }) => {
      await expect(page.getByText(/open.closed/i).first()).toBeVisible();
    });

    test('should mention Liskov Substitution Principle', async ({ page }) => {
      await expect(
        page.getByText(/liskov substitution/i).first()
      ).toBeVisible();
    });

    test('should mention Interface Segregation Principle', async ({ page }) => {
      await expect(
        page.getByText(/interface segregation/i).first()
      ).toBeVisible();
    });

    test('should mention Dependency Inversion Principle', async ({ page }) => {
      await expect(
        page.getByText(/dependency inversion/i).first()
      ).toBeVisible();
    });
  });

  // ── Design Patterns Section ────────────────────────────────────────
  test.describe('Design Patterns', () => {
    test('should display design patterns content', async ({ page }) => {
      await expect(page.getByText(/pattern/i).first()).toBeVisible();
    });

    test('should mention CQRS pattern', async ({ page }) => {
      await expect(page.getByText(/cqrs/i).first()).toBeVisible();
    });

    test('should mention Repository pattern', async ({ page }) => {
      await expect(page.getByText(/repository/i).first()).toBeVisible();
    });
  });

  // ── Dependency Injection Section ───────────────────────────────────
  test.describe('Dependency Injection Container', () => {
    test('should display dependency injection content', async ({ page }) => {
      await expect(
        page.getByText(/dependency injection/i).first()
      ).toBeVisible();
    });
  });

  // ── Testing Strategy Section ───────────────────────────────────────
  test.describe('Testing Strategy', () => {
    test('should display testing strategy content', async ({ page }) => {
      await expect(page.getByText(/testing/i).first()).toBeVisible();
    });

    test('should mention unit testing', async ({ page }) => {
      await expect(page.getByText(/unit test/i).first()).toBeVisible();
    });
  });

  // ── Project Structure Section ──────────────────────────────────────
  test.describe('Project Structure', () => {
    test('should display project structure content', async ({ page }) => {
      await expect(page.getByText(/structure/i).first()).toBeVisible();
    });
  });
});
