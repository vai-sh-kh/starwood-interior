import { test, expect } from './fixtures/admin-auth';
import { CategoriesPage } from './helpers/page-objects';
import { getTestCategoryData, generateRandomString } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Categories Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/categories');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display categories page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Categories")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New"), button:has-text("Create")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new category', async ({ authenticatedPage }) => {
    const categoriesPage = new CategoriesPage(authenticatedPage);
    const categoryData = getTestCategoryData();
    
    await categoriesPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill form
    await categoriesPage.fillCategoryForm(categoryData);
    
    // Save
    await categoriesPage.getSaveButton().click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify category appears
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${categoryData.name}`)).toBeVisible();
  });

  test('should auto-generate slug from category name', async ({ authenticatedPage }) => {
    const categoriesPage = new CategoriesPage(authenticatedPage);
    const categoryName = `Test Category ${generateRandomString(6)}`;
    const expectedSlug = categoryName.toLowerCase().replace(/\s+/g, '-');
    
    await categoriesPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill name
    await categoriesPage.getNameInput().fill(categoryName);
    
    // Wait for slug generation
    await authenticatedPage.waitForTimeout(500);
    
    // Check slug was auto-generated
    const slugValue = await categoriesPage.getSlugInput().inputValue();
    expect(slugValue.toLowerCase()).toContain(expectedSlug.toLowerCase());
  });

  test('should edit category', async ({ authenticatedPage }) => {
    const categoriesPage = new CategoriesPage(authenticatedPage);
    
    // Get first category row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const categoryName = await firstRow.locator('td').nth(1).textContent();
    
    if (!categoryName || categoryName.trim() === '') {
      test.skip();
      return;
    }
    
    // Click edit
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Update name
    const newName = `${categoryName} - Updated`;
    await categoriesPage.getNameInput().clear();
    await categoriesPage.getNameInput().fill(newName);
    
    // Save
    await categoriesPage.getSaveButton().click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    // Verify update
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newName}`)).toBeVisible();
  });

  test('should delete category', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const categoryName = await firstRow.locator('td').nth(1).textContent();
    
    if (!categoryName || categoryName.trim() === '') {
      test.skip();
      return;
    }
    
    // Click delete
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    // Confirm
    await authenticatedPage.waitForSelector('text=Delete Category', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should validate slug format', async ({ authenticatedPage }) => {
    const categoriesPage = new CategoriesPage(authenticatedPage);
    
    await categoriesPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill invalid slug
    await categoriesPage.getSlugInput().fill('Invalid Slug With Spaces!');
    await categoriesPage.getSlugInput().blur();
    
    // Should show validation error
    await authenticatedPage.waitForTimeout(500);
    const errorText = authenticatedPage.locator('text=/lowercase|hyphens|invalid/i');
    await expect(errorText.first()).toBeVisible();
  });

  test('should search categories', async ({ authenticatedPage }) => {
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

  test('should sort categories', async ({ authenticatedPage }) => {
    // Check if sort buttons exist
    const sortButton = authenticatedPage.locator('button:has-text("Name"), th:has-text("Name")').first();
    const isVisible = await sortButton.isVisible().catch(() => false);
    
    if (isVisible) {
      await sortButton.click();
      await authenticatedPage.waitForTimeout(1000);
      
      await waitForTableLoad(authenticatedPage);
      await expect(authenticatedPage.locator('table')).toBeVisible();
    }
  });

  test('should paginate categories', async ({ authenticatedPage }) => {
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
});

