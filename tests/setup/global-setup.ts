import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Optional: Setup test data, seed database, etc.
  // This runs once before all tests
  console.log('Running global setup...');
  
  // Example: You could seed test data here
  // await seedTestData();
}

export default globalSetup;

