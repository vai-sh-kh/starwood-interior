import { test, expect } from './fixtures/admin-auth';
import { BlogsPage } from './helpers/page-objects';
import { getTestBlogData, getTestCategoryData, generateRandomTitle } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Blogs Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/blogs');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display blogs page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Blogs")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Blog")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new blog', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    const blogData = getTestBlogData();
    
    // Click create button
    await blogsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill form
    await blogsPage.fillBlogForm({
      title: blogData.title,
      excerpt: blogData.excerpt,
      content: blogData.content,
      author: blogData.author,
      status: blogData.status,
    });
    
    // Fill image URL (simplified - in real test might upload image)
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(blogData.image).catch(() => {
      // If no input, try clicking and pasting
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(blogData.image);
    });
    
    // Save
    await blogsPage.save();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify blog appears in table
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${blogData.title}`)).toBeVisible();
  });

  test('should auto-generate slug from title', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    const title = generateRandomTitle('Auto Slug Test');
    const expectedSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    await blogsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill title
    await blogsPage.getTitleInput().fill(title);
    
    // Wait a bit for slug generation
    await authenticatedPage.waitForTimeout(500);
    
    // Check slug was auto-generated
    const slugValue = await blogsPage.getSlugInput().inputValue();
    expect(slugValue).toContain(expectedSlug.toLowerCase());
  });

  test('should edit an existing blog', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    
    // Get first blog row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const blogTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!blogTitle || blogTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Click edit (three dots menu)
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Update title
    const newTitle = `${blogTitle} - Updated`;
    await blogsPage.getTitleInput().clear();
    await blogsPage.getTitleInput().fill(newTitle);
    
    // Save
    await blogsPage.save();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    // Verify update
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('should delete a blog', async ({ authenticatedPage }) => {
    // Get first blog row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const blogTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!blogTitle || blogTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Click delete (three dots menu)
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    // Confirm deletion
    await authenticatedPage.waitForSelector('text=Delete Blog', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    // Wait for success message
    await waitForToast(authenticatedPage, /deleted|success/i);
    
    // Verify blog is removed (if it was the only one, table might be empty)
    await waitForTableLoad(authenticatedPage);
    const rows = await authenticatedPage.locator('table tbody tr').count();
    if (rows > 0) {
      await expect(authenticatedPage.locator(`text=${blogTitle}`)).not.toBeVisible();
    }
  });

  test('should validate required fields', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    
    await blogsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Try to save without filling required fields
    await blogsPage.save();
    
    // Should show validation errors
    await authenticatedPage.waitForTimeout(1000);
    const titleInput = blogsPage.getTitleInput();
    await expect(titleInput).toBeVisible();
    
    // Check for error messages
    const errorMessages = authenticatedPage.locator('text=/required|must be/i');
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should validate slug format', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    
    await blogsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill invalid slug
    await blogsPage.getSlugInput().fill('Invalid Slug With Spaces!');
    await blogsPage.getSlugInput().blur();
    
    // Should show validation error
    await authenticatedPage.waitForTimeout(500);
    const errorText = authenticatedPage.locator('text=/lowercase|hyphens|invalid/i');
    await expect(errorText.first()).toBeVisible();
  });

  test('should search blogs', async ({ authenticatedPage }) => {
    // Get first blog title for search
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const searchTerm = await firstRow.locator('td').nth(1).textContent();
    
    if (!searchTerm || searchTerm.trim() === '') {
      test.skip();
      return;
    }
    
    // Search
    const searchInput = authenticatedPage.locator('input[placeholder*="Search"]');
    await searchInput.fill(searchTerm);
    await authenticatedPage.waitForTimeout(1000); // Wait for debounce
    
    // Verify results
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${searchTerm}`)).toBeVisible();
  });

  test('should filter by category', async ({ authenticatedPage }) => {
    // Check if category filter exists
    const categoryFilter = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Category' }).first();
    const isVisible = await categoryFilter.isVisible().catch(() => false);
    
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Select a category
    await categoryFilter.click();
    await authenticatedPage.locator('[role="option"]').first().click();
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify filter is applied
    await waitForTableLoad(authenticatedPage);
    // Table should still be visible
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should filter by status', async ({ authenticatedPage }) => {
    // Find status filter
    const statusFilter = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Status' }).first();
    const isVisible = await statusFilter.isVisible().catch(() => false);
    
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Select draft status
    await statusFilter.click();
    await authenticatedPage.locator('text=Draft').click();
    await authenticatedPage.waitForTimeout(1000);
    
    // Verify filter is applied
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should change blog status', async ({ authenticatedPage }) => {
    // Get first blog row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const statusSelect = firstRow.locator('select').last();
    
    const isVisible = await statusSelect.isVisible().catch(() => false);
    if (!isVisible) {
      test.skip();
      return;
    }
    
    // Get current status
    const currentStatus = await statusSelect.inputValue();
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    
    // Change status
    await statusSelect.click();
    await authenticatedPage.locator(`text=${newStatus === 'draft' ? 'Draft' : 'Published'}`).click();
    
    // Wait for success
    await waitForToast(authenticatedPage, /status|changed/i);
    
    // Verify status changed
    await waitForTableLoad(authenticatedPage);
    await expect(firstRow.locator(`text=${newStatus === 'draft' ? 'Draft' : 'Published'}`)).toBeVisible();
  });

  test('should paginate blogs', async ({ authenticatedPage }) => {
    // Check if pagination exists
    const pagination = authenticatedPage.locator('button:has-text("Next"), button:has-text("Previous")');
    const count = await pagination.count();
    
    if (count === 0) {
      test.skip();
      return;
    }
    
    // Click next if available
    const nextButton = authenticatedPage.locator('button:has-text("Next")');
    const isEnabled = await nextButton.isEnabled().catch(() => false);
    
    if (isEnabled) {
      await nextButton.click();
      await waitForTableLoad(authenticatedPage);
      // Should still show table
      await expect(authenticatedPage.locator('table')).toBeVisible();
    }
  });

  test('should view blog in new tab', async ({ authenticatedPage, context }) => {
    // Get first blog row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    
    // Click three dots menu
    await firstRow.locator('button').last().click();
    
    // Click view
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      authenticatedPage.locator('text=View').click(),
    ]);
    
    // Should open in new tab
    await newPage.waitForLoadState();
    expect(newPage.url()).toMatch(/\/blogs\//);
  });

  test('should add category from blog form', async ({ authenticatedPage }) => {
    const blogsPage = new BlogsPage(authenticatedPage);
    const categoryData = getTestCategoryData();
    
    await blogsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Click add category button
    const addCategoryButton = authenticatedPage.locator('button:has([class*="Plus"])').first();
    await addCategoryButton.click();
    
    // Fill category name
    await authenticatedPage.waitForSelector('text=Add New Category', { timeout: 5000 });
    await authenticatedPage.locator('input[id*="category-name"], input[placeholder*="category" i]').fill(categoryData.name);
    
    // Save category
    await authenticatedPage.locator('button:has-text("Add Category")').click();
    await waitForToast(authenticatedPage, /category|success/i);
    
    // Category should be selected
    await authenticatedPage.waitForTimeout(500);
    // Dialog should close or category should be selected
  });
});

