import { test, expect } from './fixtures/admin-auth';
import { ProjectsPage } from './helpers/page-objects';
import { getTestProjectData, generateRandomTitle } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Projects Management', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin/projects');
    await waitForTableLoad(authenticatedPage);
  });

  test('should display projects page', async ({ authenticatedPage }) => {
    await expect(authenticatedPage.locator('h1:has-text("Projects")')).toBeVisible();
    await expect(authenticatedPage.locator('button:has-text("New Project")')).toBeVisible();
    await expect(authenticatedPage.locator('table')).toBeVisible();
  });

  test('should create a new project', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    const projectData = getTestProjectData();
    
    await projectsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill basic fields
    await projectsPage.getTitleInput().fill(projectData.title);
    await projectsPage.getDescriptionInput().fill(projectData.description);
    
    // Fill content editor
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill(projectData.content);
    
    // Fill image
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(projectData.image).catch(() => {
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(projectData.image);
    });
    
    // Set status
    await authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: 'Status' }).first().click();
    await authenticatedPage.locator('text=Draft').click();
    
    // Save
    await projectsPage.save();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify project appears
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${projectData.title}`)).toBeVisible();
  });

  test('should add tags to project', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    
    await projectsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields first
    await projectsPage.getTitleInput().fill(generateRandomTitle('Tag Test'));
    await projectsPage.getDescriptionInput().fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Find tag input
    const tagInput = authenticatedPage.locator('input[placeholder*="tag" i]');
    await tagInput.fill('test-tag');
    
    // Click add tag button
    await authenticatedPage.locator('button:has-text("Add")').filter({ hasText: /Add/i }).first().click();
    
    // Verify tag appears
    await expect(authenticatedPage.locator('text=test-tag')).toBeVisible();
  });

  test('should add project info fields', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    
    await projectsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields
    await projectsPage.getTitleInput().fill(generateRandomTitle('Project Info'));
    await projectsPage.getDescriptionInput().fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Scroll to project info section
    await authenticatedPage.locator('text=Project Information').scrollIntoViewIfNeeded();
    
    // Fill project info
    await authenticatedPage.locator('#projectClient, input[placeholder*="client" i]').fill('Test Client');
    await authenticatedPage.locator('#projectLocation, input[placeholder*="location" i]').fill('Test Location');
    await authenticatedPage.locator('#projectSize, input[placeholder*="size" i]').fill('1000 sqft');
    await authenticatedPage.locator('#projectCompletion, input[placeholder*="completion" i]').fill('2024');
    
    // Verify fields are filled
    await expect(authenticatedPage.locator('#projectClient, input[placeholder*="client" i]')).toHaveValue('Test Client');
  });

  test('should add quote to project', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    
    await projectsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields
    await projectsPage.getTitleInput().fill(generateRandomTitle('Quote Test'));
    await projectsPage.getDescriptionInput().fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Scroll to quote section
    await authenticatedPage.locator('text=Testimonial Quote').scrollIntoViewIfNeeded();
    
    // Fill quote
    await authenticatedPage.locator('#quote, textarea[placeholder*="quote" i]').fill('This is a test quote');
    await authenticatedPage.locator('#quoteAuthor, input[placeholder*="author" i]').fill('Test Author');
    
    // Verify fields are filled
    await expect(authenticatedPage.locator('#quote, textarea[placeholder*="quote" i]')).toHaveValue('This is a test quote');
  });

  test('should toggle mark as new', async ({ authenticatedPage }) => {
    const projectsPage = new ProjectsPage(authenticatedPage);
    
    await projectsPage.clickCreate();
    await waitForSheetOpen(authenticatedPage);
    
    // Fill required fields
    await projectsPage.getTitleInput().fill(generateRandomTitle('New Badge'));
    await projectsPage.getDescriptionInput().fill('Test description');
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill('<p>Test content</p>');
    
    // Find and toggle "Mark as New" switch
    const markAsNewSwitch = authenticatedPage.locator('text=Mark as New').locator('..').locator('button[role="switch"], input[type="checkbox"]');
    await markAsNewSwitch.click();
    
    // Verify switch is checked
    await expect(markAsNewSwitch).toBeChecked();
  });

  test('should edit project', async ({ authenticatedPage }) => {
    // Get first project row
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const projectTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!projectTitle || projectTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Click edit
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    // Update title
    const newTitle = `${projectTitle} - Updated`;
    await authenticatedPage.locator('#title').clear();
    await authenticatedPage.locator('#title').fill(newTitle);
    
    // Save
    await authenticatedPage.locator('button:has-text("Update")').click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    // Verify update
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${newTitle}`)).toBeVisible();
  });

  test('should delete project', async ({ authenticatedPage }) => {
    const firstRow = authenticatedPage.locator('table tbody tr').first();
    const projectTitle = await firstRow.locator('td').nth(1).textContent();
    
    if (!projectTitle || projectTitle.trim() === '') {
      test.skip();
      return;
    }
    
    // Click delete
    await firstRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    // Confirm
    await authenticatedPage.waitForSelector('text=Delete Project', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should search projects', async ({ authenticatedPage }) => {
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

  test('should filter projects by status', async ({ authenticatedPage }) => {
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

  test('should change project status', async ({ authenticatedPage }) => {
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

