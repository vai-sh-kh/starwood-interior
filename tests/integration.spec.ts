import { test, expect } from './fixtures/admin-auth';
import { getTestCategoryData, getTestBlogData, getTestServiceData, getTestProjectData } from './helpers/test-data';
import { waitForToast, waitForTableLoad, waitForSheetOpen, waitForSupabaseOperation } from './helpers/wait-helpers';

test.describe('Integration Tests', () => {
  test('should complete workflow: create category → create blog with category → edit → delete', async ({ authenticatedPage }) => {
    // Step 1: Create category
    await authenticatedPage.goto('/admin/categories');
    await waitForTableLoad(authenticatedPage);
    
    const categoryData = getTestCategoryData();
    await authenticatedPage.locator('button:has-text("New"), button:has-text("Create")').click();
    await waitForSheetOpen(authenticatedPage);
    
    await authenticatedPage.locator('input[id*="name"], input[placeholder*="name" i]').fill(categoryData.name);
    await authenticatedPage.locator('button:has-text("Create"), button:has-text("Save")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify category created
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${categoryData.name}`)).toBeVisible();
    
    // Step 2: Create blog with this category
    await authenticatedPage.goto('/admin/blogs');
    await waitForTableLoad(authenticatedPage);
    
    const blogData = getTestBlogData();
    await authenticatedPage.locator('button:has-text("New Blog")').click();
    await waitForSheetOpen(authenticatedPage);
    
    await authenticatedPage.locator('#title').fill(blogData.title);
    await authenticatedPage.locator('#excerpt').fill(blogData.excerpt);
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill(blogData.content);
    
    // Select category
    const categorySelect = authenticatedPage.locator('[id="category-select"] select, [id="category-select"] [role="combobox"]');
    await categorySelect.click();
    await authenticatedPage.locator(`[role="option"]:has-text("${categoryData.name}")`).click();
    
    // Fill image
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(blogData.image).catch(() => {
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(blogData.image);
    });
    
    await authenticatedPage.locator('button:has-text("Create Blog")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify blog created
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${blogData.title}`)).toBeVisible();
    
    // Step 3: Edit blog
    const blogRow = authenticatedPage.locator(`tr:has-text("${blogData.title}")`).first();
    await blogRow.locator('button').last().click();
    await authenticatedPage.locator('text=Edit').click();
    await waitForSheetOpen(authenticatedPage);
    
    const updatedTitle = `${blogData.title} - Edited`;
    await authenticatedPage.locator('#title').clear();
    await authenticatedPage.locator('#title').fill(updatedTitle);
    
    await authenticatedPage.locator('button:has-text("Update Blog")').click();
    await waitForSupabaseOperation(authenticatedPage, /updated|success/i);
    
    // Verify edit
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${updatedTitle}`)).toBeVisible();
    
    // Step 4: Delete blog
    const updatedRow = authenticatedPage.locator(`tr:has-text("${updatedTitle}")`).first();
    await updatedRow.locator('button').last().click();
    await authenticatedPage.locator('text=Delete').click();
    
    await authenticatedPage.waitForSelector('text=Delete Blog', { timeout: 5000 });
    await authenticatedPage.locator('button:has-text("Delete")').last().click();
    
    await waitForToast(authenticatedPage, /deleted|success/i);
    await waitForTableLoad(authenticatedPage);
  });

  test('should complete workflow: create service → create subservice → link subservice to service', async ({ authenticatedPage }) => {
    // Step 1: Create service
    await authenticatedPage.goto('/admin/services');
    await waitForTableLoad(authenticatedPage);
    
    const serviceData = getTestServiceData();
    await authenticatedPage.locator('button:has-text("New Service")').click();
    await waitForSheetOpen(authenticatedPage);
    
    await authenticatedPage.locator('#title').fill(serviceData.title);
    await authenticatedPage.locator('#description').fill(serviceData.description);
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill(serviceData.content);
    
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(serviceData.image).catch(() => {
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(serviceData.image);
    });
    
    await authenticatedPage.locator('button:has-text("Create Service")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify service created
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${serviceData.title}`)).toBeVisible();
    
    // Step 2: Create subservice linked to this service
    await authenticatedPage.goto('/admin/subservices');
    await waitForTableLoad(authenticatedPage);
    
    await authenticatedPage.locator('button:has-text("New"), button:has-text("Create")').click();
    await waitForSheetOpen(authenticatedPage);
    
    const subserviceTitle = `Subservice for ${serviceData.title}`;
    await authenticatedPage.locator('#title, input[placeholder*="title" i]').fill(subserviceTitle);
    
    // Select parent service
    const parentServiceSelect = authenticatedPage.locator('select, [role="combobox"]').filter({ hasText: /service|parent/i }).first();
    await parentServiceSelect.click();
    await authenticatedPage.locator(`[role="option"]:has-text("${serviceData.title}")`).first().click();
    
    await authenticatedPage.locator('#description, textarea[placeholder*="description" i]').fill('Test subservice description');
    
    await authenticatedPage.locator('button:has-text("Create"), button:has-text("Save")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify subservice created
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${subserviceTitle}`)).toBeVisible();
  });

  test('should navigate between admin pages', async ({ authenticatedPage }) => {
    const pages = [
      { name: 'Dashboard', path: '/admin' },
      { name: 'Projects', path: '/admin/projects' },
      { name: 'Services', path: '/admin/services' },
      { name: 'Subservices', path: '/admin/subservices' },
      { name: 'Categories', path: '/admin/categories' },
      { name: 'Blogs', path: '/admin/blogs' },
      { name: 'Leads', path: '/admin/leads' },
      { name: 'Settings', path: '/admin/settings' },
    ];
    
    for (const page of pages) {
      await authenticatedPage.goto(page.path);
      await authenticatedPage.waitForLoadState('networkidle');
      
      // Verify page loaded
      await expect(authenticatedPage.locator(`h1:has-text("${page.name}")`).or(authenticatedPage.locator(`text="${page.name}"`))).toBeVisible({ timeout: 10000 });
    }
  });

  test('should maintain data consistency across pages', async ({ authenticatedPage }) => {
    // Create a project
    await authenticatedPage.goto('/admin/projects');
    await waitForTableLoad(authenticatedPage);
    
    const projectData = getTestProjectData();
    await authenticatedPage.locator('button:has-text("New Project")').click();
    await waitForSheetOpen(authenticatedPage);
    
    await authenticatedPage.locator('#title').fill(projectData.title);
    await authenticatedPage.locator('#description').fill(projectData.description);
    
    const contentEditor = authenticatedPage.locator('[contenteditable="true"], .ProseMirror').first();
    await contentEditor.click();
    await contentEditor.fill(projectData.content);
    
    await authenticatedPage.locator('#image-dropzone input[type="text"], #image-dropzone input[type="url"]').fill(projectData.image).catch(() => {
      authenticatedPage.locator('#image-dropzone').click();
      authenticatedPage.keyboard.type(projectData.image);
    });
    
    await authenticatedPage.locator('button:has-text("Create Project")').click();
    await waitForSupabaseOperation(authenticatedPage, /created|success/i);
    
    // Verify project appears in table
    await waitForTableLoad(authenticatedPage);
    await expect(authenticatedPage.locator(`text=${projectData.title}`)).toBeVisible();
    
    // Navigate to dashboard and verify stats updated
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Stats should be visible
    await expect(authenticatedPage.locator('text=Total Projects')).toBeVisible();
    
    // Navigate back to projects
    await authenticatedPage.goto('/admin/projects');
    await waitForTableLoad(authenticatedPage);
    
    // Project should still be there
    await expect(authenticatedPage.locator(`text=${projectData.title}`)).toBeVisible();
  });
});

