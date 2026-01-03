import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  // Optional: Cleanup test data, reset database, etc.
  // This runs once after all tests
  console.log('Running global teardown...');
  
  // Example: You could clean up test data here
  // await cleanupTestData();
}

export default globalTeardown;

