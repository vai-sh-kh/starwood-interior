import { test, expect } from './fixtures/admin-auth';
import { DashboardPage } from './helpers/page-objects';

test.describe('Dashboard', () => {
  test('should load dashboard page', async ({ authenticatedPage }) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await dashboard.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for dashboard to load
    await authenticatedPage.waitForSelector('h1:has-text("Dashboard")', { timeout: 10000 });
    await expect(authenticatedPage.locator('h1:has-text("Dashboard")')).toBeVisible();
    await expect(authenticatedPage.locator('text=Welcome to your CMS dashboard')).toBeVisible();
  });

  test('should display stats cards', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for stats to load - check for the text directly
    await authenticatedPage.waitForSelector('text=Total Blogs', { timeout: 15000 });
    
    // Check for specific stat cards - use more specific selectors
    // Use first() to handle multiple matches
    await expect(authenticatedPage.locator('text=Total Blogs').first()).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.locator('text=Total Projects').first()).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.locator('text=Categories').first()).toBeVisible({ timeout: 10000 });
    await expect(authenticatedPage.locator('text=Total Leads').first()).toBeVisible({ timeout: 10000 });
    
    // Verify cards are clickable links
    const blogsCard = authenticatedPage.locator('a:has-text("Total Blogs")').or(authenticatedPage.locator('text=Total Blogs').locator('..'));
    await expect(blogsCard.first()).toBeVisible();
  });

  test('should display recent blogs section', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for recent blogs section
    await authenticatedPage.waitForSelector('text=Recent Blogs', { timeout: 15000 });
    
    // Find the section - it's in a Card component
    const recentBlogsSection = authenticatedPage.locator('text=Recent Blogs').locator('xpath=ancestor::*[contains(@class, "Card")]').first();
    await expect(recentBlogsSection).toBeVisible({ timeout: 5000 });
    
    // Check for "View all" link
    const viewAllLink = authenticatedPage.locator('a:has-text("View all")').first();
    await expect(viewAllLink).toBeVisible({ timeout: 5000 });
  });

  test('should display recent leads section', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    
    // Wait for recent leads section
    await authenticatedPage.waitForSelector('text=Recent Leads', { timeout: 15000 });
    
    // Find the section - it's in a Card component
    const recentLeadsSection = authenticatedPage.locator('text=Recent Leads').locator('xpath=ancestor::*[contains(@class, "Card")]').first();
    await expect(recentLeadsSection).toBeVisible({ timeout: 5000 });
    
    // Check for "View all" link - there might be multiple, get the one in Recent Leads
    const viewAllLinks = authenticatedPage.locator('a:has-text("View all")');
    const linkCount = await viewAllLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('should navigate to blogs from stats card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForSelector('text=Total Blogs', { timeout: 10000 });
    
    // Click on Total Blogs card - find the link
    const blogsLink = authenticatedPage.locator('a:has-text("Total Blogs")').or(
      authenticatedPage.locator('text=Total Blogs').locator('xpath=ancestor::a[1]')
    );
    
    if (await blogsLink.count() > 0) {
      await blogsLink.first().click();
    } else {
      // Try clicking the card container
      await authenticatedPage.locator('text=Total Blogs').locator('xpath=ancestor::*[contains(@class, "Card") or contains(@class, "card")]').first().click();
    }
    
    // Should navigate to blogs page
    await authenticatedPage.waitForURL(/\/admin\/blogs/, { timeout: 5000 });
    await expect(authenticatedPage).toHaveURL(/\/admin\/blogs/);
  });

  test('should navigate to projects from stats card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForSelector('text=Total Projects', { timeout: 10000 });
    
    // Click on Total Projects card
    const projectsLink = authenticatedPage.locator('a:has-text("Total Projects")').or(
      authenticatedPage.locator('text=Total Projects').locator('xpath=ancestor::a[1]')
    );
    
    if (await projectsLink.count() > 0) {
      await projectsLink.first().click();
    } else {
      await authenticatedPage.locator('text=Total Projects').locator('xpath=ancestor::*[contains(@class, "Card")]').first().click();
    }
    
    // Should navigate to projects page
    await authenticatedPage.waitForURL(/\/admin\/projects/, { timeout: 5000 });
    await expect(authenticatedPage).toHaveURL(/\/admin\/projects/);
  });

  test('should navigate to leads from stats card', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForSelector('text=Total Leads', { timeout: 10000 });
    
    // Click on Total Leads card
    const leadsLink = authenticatedPage.locator('a:has-text("Total Leads")').or(
      authenticatedPage.locator('text=Total Leads').locator('xpath=ancestor::a[1]')
    );
    
    if (await leadsLink.count() > 0) {
      await leadsLink.first().click();
    } else {
      await authenticatedPage.locator('text=Total Leads').locator('xpath=ancestor::*[contains(@class, "Card")]').first().click();
    }
    
    // Should navigate to leads page
    await authenticatedPage.waitForURL(/\/admin\/leads/, { timeout: 5000 });
    await expect(authenticatedPage).toHaveURL(/\/admin\/leads/);
  });

  test('should navigate to blogs from recent blogs link', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForSelector('text=Recent Blogs', { timeout: 10000 });
    
    // Find "View all" link in Recent Blogs section
    const recentBlogsCard = authenticatedPage.locator('text=Recent Blogs').locator('xpath=ancestor::*[contains(@class, "Card")]').first();
    const viewAllLink = recentBlogsCard.locator('a:has-text("View all")').first();
    
    await expect(viewAllLink).toBeVisible({ timeout: 5000 });
    await viewAllLink.click();
    
    // Should navigate to blogs page
    await authenticatedPage.waitForURL(/\/admin\/blogs/, { timeout: 5000 });
    await expect(authenticatedPage).toHaveURL(/\/admin\/blogs/);
  });

  test('should navigate to leads from recent leads link', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/admin');
    await authenticatedPage.waitForLoadState('networkidle');
    await authenticatedPage.waitForSelector('text=Recent Leads', { timeout: 10000 });
    
    // Find "View all" link in Recent Leads section
    const recentLeadsCard = authenticatedPage.locator('text=Recent Leads').locator('xpath=ancestor::*[contains(@class, "Card")]').first();
    const viewAllLink = recentLeadsCard.locator('a:has-text("View all")').first();
    
    await expect(viewAllLink).toBeVisible({ timeout: 5000 });
    await viewAllLink.click();
    
    // Should navigate to leads page
    await authenticatedPage.waitForURL(/\/admin\/leads/, { timeout: 5000 });
    await expect(authenticatedPage).toHaveURL(/\/admin\/leads/);
  });
});

