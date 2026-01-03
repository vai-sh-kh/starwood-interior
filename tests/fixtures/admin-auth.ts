import { test as base, BrowserContext } from '@playwright/test';
import { login } from '../helpers/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'vaishakhpat2003@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

type AdminAuthFixtures = {
  authenticatedContext: BrowserContext;
  authenticatedPage: Awaited<ReturnType<BrowserContext['newPage']>>;
};

export const test = base.extend<AdminAuthFixtures>({
  authenticatedContext: async ({ browser }, use) => {
    // Create a new browser context for authenticated state
    const context = await browser.newContext();
    
    // Create a page and login
    const page = await context.newPage();
    await login(page, ADMIN_EMAIL, ADMIN_PASSWORD);
    
    // Use the authenticated context
    await use(context);
    
    // Cleanup
    await context.close();
  },

  authenticatedPage: async ({ authenticatedContext }, use) => {
    // Create a new page in the authenticated context
    const page = await authenticatedContext.newPage();
    
    // Navigate to admin dashboard to ensure we're logged in
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    await use(page);
  },
});

export { expect } from '@playwright/test';

