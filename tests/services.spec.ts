import { test, expect } from './fixtures/admin-auth';
import { getTestServiceData, generateRandomTitle } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Services Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/services');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display services page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Services")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Service")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new service', async ({ authenticatedPage }) => {
    const serviceData = getTestServiceData();
    
    await authenticatedPage.locator('button:has-text("New Service")').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill form
    await authenticatedPage.locator('#title').fill(serviceData.title);
    await authenticatedPage.locator('#description').fill(serviceData.description);
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill(serviceData.content);
    
    // Fill image
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(serviceData.image).catch(() => {
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(serviceData.image);
    });
    
    // Set status
    await authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Status' }).first().click();
    await authenticatedPage.locator('text=Draft').click();
    
    // Save
    await authenticatedPage.locator('button:has-text("Create Service")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify service appears
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${serviceData.title}`)).toBeVisible();
  });

  test('should add tags to service', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('button:has-text("New Service")').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields
    await authenticatedPage.locator('#title').fill(generateRandomTitle('Tag Service'));
    await authenticatedPage.locator('#description').fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Add tag
    const tagInput = authenticatedPage.locator('input[placeholder*="tag" i]');
    await tagInput.fill('service-tag');
    await authenticatedPage.locator('button:has-text("Add")').filter({ hasText: /Add/i }).first().click();
    
    await expect(authenticatedPage.locator('text=service-tag')).toBeVisible();
  });

  test('should toggle mark as new for service', async ({ authenticatedPage }) => {
    await authenticatedPage.locator('button:has-text("New Service")').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields
    await authenticatedPage.locator('#title').fill(generateRandomTitle('New Service'));
    await authenticatedPage.locator('#description').fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Toggle mark as new
    const markAsNewSwitch = authenticatedPage.locator('text=Mark as New').locator('..').locator('button[role="switch"], input[type="checkbox"]');
    await markAsNewSwitch.click();
    
    await expect(markAsNewSwitch).toBeChecked();
  });

  test('should edit service', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const serviceTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!serviceTitle || serviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    const newTitle = `${serviceTitle} - Updated`;
    await authenticatedPage.locator('#title').clear();
    await authenticatedPage.locator('#title').fill(newTitle);
    
    await authenticatedPage.locator('button:has-text("Update Service")').click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('should open SEO settings dialog', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const statusSelect = firstRow.locator('select').last();
    
    // Check if service is draft (SEO only available for drafts)
    const currentStatus = await statusSelect.inputValue().catch(() => '');
    if (currentStatus !== 'draft') {
      test.skip();
      return;
    }
    
    await firstRow.locator('button').last().click();
    
    // Check if SEO option exists
    const seoOption = authenticatedPage.locator('text=SEO Settings');
    const isVisible = await seoOption.isVisible().catch(() => false);
    
    if (isVisible) {
      await seoOption.click();
      await authenticatedPage.waitForSelector('text=SEO Settings', { timeout: 5000 });
      
      // Fill SEO fields
      await authenticatedPage.locator('#meta-title, input[placeholder*="SEO title" i]').fill('Test SEO Title');
      await authenticatedPage.locator('#meta-description, textarea[placeholder*="SEO description" i]').fill('Test SEO Description');
      
      // Save SEO
      await authenticatedPage.locator('button:has-text("Save SEO")').click();
      await waitForToast(authenticatedPage, /SEO|success/i);
    }
  });

  test('should delete service', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const serviceTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!serviceTitle || serviceTitle.trim() === '') {
      test.skip();
      return;
    }
    
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    await authenticatedPage.waitForSelector('text=Delete Service', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should search services', async ({ authenticatedPage }) => {
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

  test('should change service status', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const statusSelect = firstRow.locator('select').last();
    
    const isVisible = await statusSelect.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    const currentStatus = await statusSelect.inputValue();
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    
    await statusSelect.click();
    await authenticatedPage.locator(`text=${newStatus === 'draft' ? 'Draft' : 'Published'}`).click();
    
    await waitForToast(authenticatedPage, /status|changed/i);
    await waitForTableLoad(authenticatedPage);
  });
});

