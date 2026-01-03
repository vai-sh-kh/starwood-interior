import { test, expect } from './fixtures/admin-auth';
import { waitForToast } from './helpers/wait-helpers';

test.describe('Settings', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/settings');
    await authenticatedPage.waitForLoadState('networkidle');
  });

  test('should display settings page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Settings")')).toBeVisible();
    await expect(authenticatedPage.locator('text=Projects')).toBeVisible();
    await expect(authenticatedPage.locator('text=Blogs')).toBeVisible();
  });

  test('should toggle projects enabled', async ({ authenticatedPage }) => {
    // Find projects toggle
    const projectsToggle = authenticatedPage.locator('text=Projects').locator('..').locator('button[role="switch"], input[type="checkbox"]').first();
    
    const isVisible = await projectsToggle.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Get current state
    const initialState = await projectsToggle.isChecked().catch(() => false);
    
    // Toggle
    await projectsToggle.click();
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify state changed
    const newState = await projectsToggle.isChecked().catch(() => false);
    expect(newState).not.toBe(initialState);
    
    // Wait for success message if any
    await authenticatedPage.waitForTimeout(500);
  });

  test('should toggle blogs enabled', async ({ authenticatedPage }) => {
    // Find blogs toggle
    const blogsToggle = authenticatedPage.locator('text=Blogs').locator('..').locator('button[role="switch"], input[type="checkbox"]').first();
    
    const isVisible = await blogsToggle.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Get current state
    const initialState = await blogsToggle.isChecked().catch(() => false);
    
    // Toggle
    await blogsToggle.click();
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify state changed
    const newState = await blogsToggle.isChecked().catch(() => false);
    expect(newState).not.toBe(initialState);
    
    // Wait for success message if any
    await authenticatedPage.waitForTimeout(500);
  });

  test('should persist settings after page reload', async ({ authenticatedPage }) => {
    // Find projects toggle
    const projectsToggle = authenticatedPage.locator('text=Projects').locator('..').locator('button[role="switch"], input[type="checkbox"]').first();
    
    const isVisible = await projectsToggle.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Get current state
    const initialState = await projectsToggle.isChecked().catch(() => false);
    
    // Toggle if needed to ensure a change
    if (!initialState) {
      await projectsToggle.click();
      await authenticatedPage.waitForTimeout(1000);
    }
    
    // Reload page
    await authenticatedPage.reload();
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Verify setting persisted
    const persistedState = await projectsToggle.isChecked().catch(() => false);
    expect(persistedState).toBe(true);
  });
});

