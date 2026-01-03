import { Page, expect } from '@playwright/test';

/**
 * Wait for toast notification to appear
 * Sonner uses [data-sonner-toast] for individual toasts
 */
export async function waitForToast(page: Page, message?: string, timeout: number = 5000) {
  // Sonner toast selectors - try multiple approaches
  const toastSelectors = [
    '[data-sonner-toast]',
    '[data-sonner-toaster] [data-sonner-toast]',
  ];
  
  // If message is provided, try to find toast with that message
  if (message) {
    // First try to find by text content (more reliable)
    const messageRegex = typeof message === 'string' ? new RegExp(message, 'i') : message;
    try {
      await expect(page.locator('text=/.*/').filter({ hasText: messageRegex })).toBeVisible({ timeout });
      return;
    } catch {
      // Continue to try selectors
    }
    
    // Try to find toast element with the message
    for (const selector of toastSelectors) {
      try {
        const toast = page.locator(selector).filter({ hasText: messageRegex });
        await toast.first().waitFor({ timeout: 2000, state: 'visible' });
        return;
      } catch {
        continue;
      }
    }
  } else {
    // Just wait for any toast to appear
    for (const selector of toastSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 2000, state: 'visible' });
        return;
      } catch {
        continue;
      }
    }
  }
  
  // If we get here and message was provided, throw error
  if (message) {
    throw new Error(`Toast with message "${message}" not found within ${timeout}ms`);
  }
}

/**
 * Wait for toast to disappear
 */
export async function waitForToastToDisappear(page: Page, timeout: number = 5000) {
  const toastSelector = '[role="status"], [data-sonner-toast]';
  await page.waitForSelector(toastSelector, { state: 'hidden', timeout });
}

/**
 * Wait for form submission to complete
 */
export async function waitForFormSubmission(page: Page) {
  // Wait for loading spinner to disappear
  await page.waitForSelector('button:has([class*="animate-spin"])', { state: 'hidden', timeout: 10000 });
  
  // Wait a bit for any async operations
  await page.waitForTimeout(500);
}

/**
 * Wait for table to load
 */
export async function waitForTableLoad(page: Page) {
  // Wait for skeleton loaders to disappear
  await page.waitForSelector('[class*="skeleton"]', { state: 'hidden', timeout: 10000 });
  
  // Wait for table to be visible
  await page.waitForSelector('table', { timeout: 5000 });
}

/**
 * Wait for sheet/modal to open
 */
export async function waitForSheetOpen(page: Page) {
  await page.waitForSelector('[role="dialog"], [data-state="open"]', { timeout: 5000 });
}

/**
 * Wait for sheet/modal to close
 */
export async function waitForSheetClose(page: Page) {
  await page.waitForSelector('[role="dialog"], [data-state="open"]', { state: 'hidden', timeout: 5000 });
}

/**
 * Wait for Supabase operation to complete (check for toast)
 */
export async function waitForSupabaseOperation(page: Page, successMessage?: string) {
  await waitForToast(page, successMessage);
  await waitForFormSubmission(page);
}

