import { Page, expect } from '@playwright/test';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vaishakhpat2003@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

/**
 * Login to admin panel
 */
export async function login(page: Page, email: string = ADMIN_EMAIL, password: string = ADMIN_PASSWORD) {
  await page.goto('/admin/login');
  await expect(page).toHaveURL(/\/admin\/login/);
  
  // Wait for form to be ready
  await page.waitForSelector('input[type="email"]', { timeout: 5000 });
  
  // Fill in email
  await page.fill('input[type="email"]', email);
  
  // Fill in password
  await page.fill('input[type="password"]', password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for navigation to dashboard or error
  try {
    await page.waitForURL(/\/admin$/, { timeout: 15000 });
    await expect(page).toHaveURL(/\/admin$/);
    // Wait for dashboard to load
    await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
  } catch (error) {
    // If navigation failed, might be an error - check if still on login page
    if (page.url().includes('/admin/login')) {
      throw new Error('Login failed - still on login page');
    }
    throw error;
  }
}

/**
 * Logout from admin panel
 */
export async function logout(page: Page) {
  // Click sign out button in sidebar
  await page.click('button:has-text("Sign Out"), a:has-text("Sign Out")');
  
  // Wait for redirect to login
  await page.waitForURL(/\/admin\/login/, { timeout: 5000 });
  await expect(page).toHaveURL(/\/admin\/login/);
}

/**
 * Check if user is logged in (on admin dashboard)
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  try {
    await page.waitForURL(/\/admin/, { timeout: 2000 });
    return page.url().includes('/admin') && !page.url().includes('/admin/login');
  } catch {
    return false;
  }
}

/**
 * Ensure user is logged in, login if not
 */
export async function ensureLoggedIn(page: Page) {
  if (!(await isLoggedIn(page))) {
    await login(page);
  }
}

