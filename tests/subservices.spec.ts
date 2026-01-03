import { test, expect } from './fixtures/admin-auth';
import { generateRandomTitle } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Subservices Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/subservices');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display subservices page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Subservices")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New"), button:has-text("Create")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new subservice', async ({ authenticatedPage }) => {
    // First, we need a parent service - check if any services exist
    await authenticatedPage.goto('/admin/services');
    await waitForTableLoad(authenticatedPage);
    
    const firstServiceRow = authenticatedPage.locator('table tbody tr').first();
    const serviceTitle = await firstServiceRow.locator('td').nth(1).textContent();
    
    if (!serviceTitle || serviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Go back to subservices
    await authenticatedPage.goto('/admin/subservices');
    await waitForTableLoad(authenticatedPage);
    
    // Click create
    await authenticatedPage.locator('button:has-text("New"), button:has-text("Create")').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill form
    const subserviceTitle = generateRandomTitle('Subservice');
    await authenticatedPage.locator('#title, input[placeholder*="title" i]').fill(subserviceTitle);
    
    // Select parent service
    const parentServiceSelect = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: /service|parent/i }).first();
    await parentServiceSelect.click();
    await authenticatedPage.locator(`[role="option"]:has-text("${serviceTitle}")`).first().click();
    
    // Fill description
    await authenticatedPage.locator('#description, textarea[placeholder*="description" i]').fill('Test subservice description');
    
    // Set status
    await authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Status' }).first().click();
    await authenticatedPage.locator('text=Draft').click();
    
    // Save
    await authenticatedPage.locator('button:has-text("Create"), button:has-text("Save")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify subservice appears
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${subserviceTitle}`)).toBeVisible();
  });

  test('should edit subservice', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const subserviceTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!subserviceTitle || subserviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    const newTitle = `${subserviceTitle} - Updated`;
    await authenticatedPage.locator('#title, input[placeholder*="title" i]').clear();
    await authenticatedPage.locator('#title, input[placeholder*="title" i]').fill(newTitle);
    
    await authenticatedPage.locator('button:has-text("Update"), button:has-text("Save")').click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('should delete subservice', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const subserviceTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!subserviceTitle || subserviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    await authenticatedPage.waitForSelector('text=Delete', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should change parent service', async ({ authenticatedPage }) => {
    // Get first subservice
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const subserviceTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!subserviceTitle || subserviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Get available services
    await authenticatedPage.goto('/admin/services');
    await waitForTableLoad(authenticatedPage);
    const services = await authenticatedPage.locator('table tbody tr').count();
    
    if (services < 2) {
      test.skip();
      return;
    }
    
    // Go back to subservices
    await authenticatedPage.goto('/admin/subservices');
    await waitForTableLoad(authenticatedPage);
    
    // Edit subservice
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Change parent service
    const parentServiceSelect = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: /service|parent/i }).first();
    await parentServiceSelect.click();
    
    // Select different service
    const options = authenticatedPage.locator('[role="option"]');
    const optionCount = await options.count();
    if (optionCount > 1) {
      await options.nth(1).click();
      
      // Save
      await authenticatedPage.locator('button:has-text("Update"), button:has-text("Save")').click();
      await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    }
  });

  test('should search subservices', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const searchTerm = await firstRow.locator('td').nth(1).textContent();
    
    if (!searchTerm || searchTerm.trim() === '') {
      test.skip();
      return;
    }
    
    const searchInput = authenticatedPage.locator('input[placeholder*="Search"]');
    await searchInput.fill(searchTerm);
    await authenticatedPage.waitForTimeout(1000);
    
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${searchTerm}`)).toBeVisible();
  });

  test('should filter by status', async ({ authenticatedPage }) => {
    const statusFilter = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Status' }).first();
    const isVisible = await statusFilter.isVisible().catch(() => false);
    
    if (!isVisible) {
      test.skip();
      return;
    }
    
    await statusFilter.click();
    await authenticatedPage.locator('text=Draft').click();
    await authenticatedPage.waitForTimeout(1000);
    
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });
});

