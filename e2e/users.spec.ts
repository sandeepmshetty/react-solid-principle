import { expect, test } from '@playwright/test';

/**
 * E2E tests for the Users page
 * Covers: page load, user form, user list, CRUD operations, validation, SOLID demo
 *
 * NOTE: The /users page uses client-side IoC container setup (createDevelopmentContainer).
 * Direct page.goto('/users') triggers SSR which cannot resolve the container, causing a
 * blank render. All tests navigate via the header nav link (client-side navigation) to
 * ensure the React component tree is fully hydrated before assertions.
 */
test.describe('Users Page', () => {
  /**
   * Navigate to /users via the client-side nav link so React hydrates properly.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page
      .locator('header nav')
      .getByRole('link', { name: /users/i })
      .click();
    await page.waitForURL('**/users');
    await page.waitForLoadState('networkidle');
  });

  // ── Page Load ──────────────────────────────────────────────────────
  test.describe('Page Load', () => {
    test('should load successfully', async ({ page }) => {
      expect(page.url()).toContain('/users');
    });

    test('should display the page heading', async ({ page }) => {
      // Use main h1 — the layout header also has an h1, so we target inside <main>
      const heading = page.locator('main h1').first();
      await expect(heading).toBeVisible();
      await expect(heading).toContainText('User Management');
    });

    test('should display the page description', async ({ page }) => {
      await expect(
        page.getByText(/demonstrating our modular architecture/i)
      ).toBeVisible();
    });
  });

  // ── Architecture Info Panel ────────────────────────────────────────
  test.describe('Architecture Info', () => {
    test('should display the main content area', async ({ page }) => {
      await expect(page.locator('main')).toBeVisible();
    });
  });

  // ── Create User Form ───────────────────────────────────────────────
  test.describe('Create User Form', () => {
    test('should display "Create New User" card title', async ({ page }) => {
      await expect(page.getByText('Create New User')).toBeVisible();
    });

    test('should render Email label and input', async ({ page }) => {
      await expect(
        page.getByText('Email', { exact: true }).first()
      ).toBeVisible();
      await expect(page.locator('input[type="email"]')).toBeVisible();
    });

    test('should render Name label and input', async ({ page }) => {
      await expect(
        page.getByText('Name', { exact: true }).first()
      ).toBeVisible();
      await expect(page.locator('input[type="text"]')).toBeVisible();
    });

    test('should render Role label and select', async ({ page }) => {
      await expect(page.getByText('Role', { exact: true })).toBeVisible();
      await expect(page.locator('select')).toBeVisible();
    });

    test('should render the Create User submit button', async ({ page }) => {
      const btn = page.getByRole('button', { name: /create user/i });
      await expect(btn).toBeVisible();
    });

    test('submit button should be disabled when fields are empty', async ({
      page,
    }) => {
      const btn = page.getByRole('button', { name: /create user/i });
      await expect(btn).toBeDisabled();
    });

    test('submit button should become enabled when email and name are filled', async ({
      page,
    }) => {
      await page.locator('input[type="email"]').fill('test@example.com');
      await page.locator('input[type="text"]').fill('Test User');
      const btn = page.getByRole('button', { name: /create user/i });
      await expect(btn).toBeEnabled();
    });

    test('role dropdown should have user, admin, moderator options', async ({
      page,
    }) => {
      const select = page.locator('select');
      await expect(select.locator('option[value="user"]')).toHaveCount(1);
      await expect(select.locator('option[value="admin"]')).toHaveCount(1);
      await expect(select.locator('option[value="moderator"]')).toHaveCount(1);
    });

    test('should default role to "user"', async ({ page }) => {
      await expect(page.locator('select')).toHaveValue('user');
    });

    test('should create a new user and add them to the list', async ({
      page,
    }) => {
      await page.locator('input[type="email"]').fill('john.doe@example.com');
      await page.locator('input[type="text"]').fill('John Doe');
      await page.locator('select').selectOption('admin');

      await page.getByRole('button', { name: /create user/i }).click();

      // After creation the form should reset
      await expect(page.locator('input[type="email"]')).toHaveValue('');
      await expect(page.locator('input[type="text"]')).toHaveValue('');

      // User should appear in the list
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('john.doe@example.com')).toBeVisible();
    });

    test('should create multiple users of different roles', async ({
      page,
    }) => {
      const users = [
        { name: 'Alice Admin', email: 'alice@example.com', role: 'admin' },
        { name: 'Bob Mod', email: 'bob@example.com', role: 'moderator' },
        { name: 'Carol User', email: 'carol@example.com', role: 'user' },
      ];

      for (const user of users) {
        await page.locator('input[type="email"]').fill(user.email);
        await page.locator('input[type="text"]').fill(user.name);
        await page.locator('select').selectOption(user.role);
        await page.getByRole('button', { name: /create user/i }).click();
        // Wait for form to reset before next entry
        await expect(page.locator('input[type="email"]')).toHaveValue('');
      }

      for (const user of users) {
        await expect(page.getByText(user.name)).toBeVisible();
      }
    });
  });

  // ── User List ──────────────────────────────────────────────────────
  test.describe('User List', () => {
    test('should display the Users section header', async ({ page }) => {
      // The CardTitle renders "Users (N)" — match by text starting with Users
      await expect(page.getByText(/^Users/).first()).toBeVisible();
    });

    test('should show empty state message or user table', async ({ page }) => {
      // loadUsers() is async/in-memory — wait for the loading spinner to disappear
      // before asserting on the final list state
      await page
        .waitForSelector('text=Loading users...', {
          state: 'hidden',
          timeout: 10000,
        })
        .catch(() => {
          /* already gone */
        });

      // After loading, either the empty-state message or the table must be present
      await Promise.race([
        page.waitForSelector('text=No users found', { timeout: 5000 }),
        page.waitForSelector('table', { timeout: 5000 }),
      ]);
    });

    test('should display table columns after creating a user', async ({
      page,
    }) => {
      await page.locator('input[type="email"]').fill('tabletest@example.com');
      await page.locator('input[type="text"]').fill('Table Test');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      const table = page.locator('table');
      await expect(table).toBeVisible();
      await expect(table.getByText('Name')).toBeVisible();
      await expect(table.getByText('Email')).toBeVisible();
      await expect(table.getByText('Role')).toBeVisible();
      await expect(table.getByText('Status')).toBeVisible();
      await expect(table.getByText('Actions')).toBeVisible();
    });

    test('newly created user should show Active status', async ({ page }) => {
      await page.locator('input[type="email"]').fill('active@example.com');
      await page.locator('input[type="text"]').fill('Active User');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      await expect(page.getByText('Active').first()).toBeVisible();
    });

    test('should display a Deactivate button for active users', async ({
      page,
    }) => {
      await page.locator('input[type="email"]').fill('deact@example.com');
      await page.locator('input[type="text"]').fill('Deact User');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      const deactivateBtn = page
        .getByRole('button', { name: /deactivate/i })
        .first();
      await expect(deactivateBtn).toBeVisible();
    });

    test('should deactivate a user when Deactivate is clicked', async ({
      page,
    }) => {
      await page
        .locator('input[type="email"]')
        .fill('deactivation@example.com');
      await page.locator('input[type="text"]').fill('Will Deactivate');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      await page
        .getByRole('button', { name: /deactivate/i })
        .first()
        .click();

      // getUsers is called with { isActive: true } — deactivated users are removed
      // from the list entirely rather than showing an 'Inactive' badge
      await expect(page.getByText('Will Deactivate')).not.toBeVisible();
    });

    test('deactivated user should not show a Deactivate button', async ({
      page,
    }) => {
      await page.locator('input[type="email"]').fill('nodeavtbtn@example.com');
      await page.locator('input[type="text"]').fill('No Btn User');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      const beforeCount = await page
        .getByRole('button', { name: /deactivate/i })
        .count();

      await page
        .getByRole('button', { name: /deactivate/i })
        .first()
        .click();

      // After deactivation the user is removed from the active-only list,
      // so the total number of Deactivate buttons decreases by one
      await expect(
        page.getByRole('button', { name: /deactivate/i })
      ).toHaveCount(beforeCount - 1);
    });

    test('admin role badge should use red colour styling', async ({ page }) => {
      await page.locator('input[type="email"]').fill('adminbadge@example.com');
      await page.locator('input[type="text"]').fill('Admin Badge');
      await page.locator('select').selectOption('admin');
      await page.getByRole('button', { name: /create user/i }).click();
      await expect(page.locator('input[type="email"]')).toHaveValue('');

      // Admin badge uses red colour classes (bg-red-100 text-red-800)
      const badge = page
        .locator('span')
        .filter({ hasText: /^admin$/i })
        .first();
      await expect(badge).toBeVisible();
      await expect(badge).toHaveClass(/red/);
    });
  });

  // ── SOLID Principles Demo ──────────────────────────────────────────
  test.describe('SOLID Principles Demo Section', () => {
    test('should display the SOLID principles card title', async ({ page }) => {
      // SOLIDPrinciplesDemo renders: "🎯 SOLID Principles in This Page"
      await expect(
        page.getByText(/SOLID Principles in This Page/i)
      ).toBeVisible();
    });

    test('should list all four demonstrated principles', async ({ page }) => {
      const principles = [
        'Single Responsibility Principle',
        'Dependency Inversion Principle',
        'Open/Closed Principle',
        'Interface Segregation Principle',
      ];
      for (const p of principles) {
        await expect(page.getByText(p).first()).toBeVisible();
      }
    });
  });
});
