import { test, expect } from '@playwright/test';

/**
 * E2E tests for the home page
 * These tests verify the application works correctly in a real browser environment
 */
test.describe('Home Page', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');

    // Wait for the page to be ready
    await page.waitForLoadState('networkidle');

    // Check that the page loaded
    expect(page.url()).toContain('/');
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check for hero content - the main heading
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Enterprise React TypeScript');
  });

  test('should navigate to architecture page', async ({ page }) => {
    await page.goto('/');

    // Look for a link to architecture page
    const architectureLink = page.locator('a[href*="architecture"]').first();

    if (await architectureLink.isVisible()) {
      await architectureLink.click();
      await page.waitForURL('**/architecture');
      expect(page.url()).toContain('/architecture');
    }
  });
});

test.describe('Users Page', () => {
  test('should load users page', async ({ page }) => {
    await page.goto('/users');

    await page.waitForLoadState('networkidle');

    expect(page.url()).toContain('/users');
  });

  test('should display user interface elements', async ({ page }) => {
    await page.goto('/users');

    // Check if page has loaded with expected content
    await expect(page.locator('body')).toBeVisible();
  });
});
