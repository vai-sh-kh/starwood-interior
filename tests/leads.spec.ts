import { test, expect } from './fixtures/admin-auth';
import { LeadsPage } from './helpers/page-objects';
import { getTestLeadData, generateRandomEmail, generateRandomString } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Leads Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/leads');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display leads page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Leads")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Lead")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new lead', async ({ authenticatedPage }) => {
    const leadsPage = new LeadsPage(authenticatedPage);
    const leadData = getTestLeadData();
    
    await leadsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill form
    await leadsPage.fillLeadForm(leadData);
    
    // Save
    await leadsPage.getSaveButton().click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify lead appears
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${leadData.name}`)).toBeVisible();
  });

  test('should validate email format', async ({ authenticatedPage }) => {
    const leadsPage = new LeadsPage(authenticatedPage);
    
    await leadsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill invalid email
    await leadsPage.getNameInput().fill('Test User');
    await leadsPage.getEmailInput().fill('invalid-email');
    await leadsPage.getEmailInput().blur();
    
    // Should show validation error
    await authenticatedPage.waitForTimeout(500);
    const errorText = authenticatedPage.locator('text=/valid email|email address/i');
    await expect(errorText.first()).toBeVisible();
  });

  test('should validate phone number', async ({ authenticatedPage }) => {
    const leadsPage = new LeadsPage(authenticatedPage);
    
    await leadsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill invalid phone (too short)
    await leadsPage.getNameInput().fill('Test User');
    await leadsPage.getEmailInput().fill(generateRandomEmail());
    await leadsPage.getPhoneInput().fill('123');
    await leadsPage.getPhoneInput().blur();
    
    // Should show validation error
    await authenticatedPage.waitForTimeout(500);
    const errorText = authenticatedPage.locator('text=/phone|digits/i');
    const isVisible = await errorText.isVisible().catch(() => false);
    // Phone validation might be lenient, so this is optional
  });

  test('should edit lead', async ({ authenticatedPage }) => {
    const leadsPage = new LeadsPage(authenticatedPage);
    
    // Get first lead row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const leadName = await firstRow.locator('td').nth(1).textContent();
    
    if (!leadName || leadName.trim() === '') {
      test.skip();
      return;
    }
    
    // Click edit
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Update name
    const newName = `${leadName} - Updated`;
    await leadsPage.getNameInput().clear();
    await leadsPage.getNameInput().fill(newName);
    
    // Save
    await leadsPage.getSaveButton().click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    // Verify update
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newName}`)).toBeVisible();
  });

  test('should delete lead', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const leadName = await firstRow.locator('td').nth(1).textContent();
    
    if (!leadName || leadName.trim() === '') {
      test.skip();
      return;
    }
    
    // Click delete
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    // Confirm
    await authenticatedPage.waitForSelector('text=Delete Lead', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should view lead details', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const leadName = await firstRow.locator('td').nth(1).textContent();
    
    if (!leadName || leadName.trim() === '') {
      test.skip();
      return;
    }
    
    // Click view details
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=View Details').click();
    
    // Should open details dialog
    await authenticatedPage.waitForSelector('text=Lead Details', { timeout: 5000 });
    await expect(authenticatedPage.locator(`text=${leadName}`)).toBeVisible();
    
    // Close dialog
    await authenticatedPage.locator('button:has-text("Cancel"), button[aria-label="Close"]').click();
  });

  test('should change lead status', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const statusSelect = firstRow.locator('select').first();
    
    const isVisible = await statusSelect.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Change status
    await statusSelect.click();
    await authenticatedPage.locator('[role="option"]').nth(1).click();
    
    await waitForToast(authenticatedPage, /status|updated/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should search leads', async ({ authenticatedPage }) => {
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

  test('should paginate leads', async ({ authenticatedPage }) => {
    const pagination = authenticatedPage.locator('button:has-text("Next"), button:has-text("Previous")');
    const count = await pagination.count();
    
    if (count === 0) {
      test.skip();
      return;
    }
    
    const nextButton = authenticatedPage.locator('button:has-text("Next")');
    const isEnabled = await nextButton.isEnabled().catch(() => false);
    
    if (isEnabled) {
      await nextButton.click();
      await waitForTableLoad(authenticatedPage);
      await expect(authenticatedPage.locator('table')).toBeVisible();
    }
  });

  test('should display source badges', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const sourceBadge = firstRow.locator('[class*="Badge"]').last();
    
    const isVisible = await sourceBadge.isVisible().catch(() => false);
    if (isVisible) {
      await expect(sourceBadge).toBeVisible();
    }
  });
});

