/**
 * Generate random test data
 */

export function generateRandomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateRandomEmail(): string {
  return `test-${generateRandomString(8)}@example.com`;
}

export function generateRandomSlug(prefix: string = 'test'): string {
  return `${prefix}-${generateRandomString(8)}`;
}

export function generateRandomTitle(prefix: string = 'Test'): string {
  return `${prefix} ${generateRandomString(6)}`;
}

export function generateRandomPhone(): string {
  const digits = Math.floor(1000000000 + Math.random() * 9000000000);
  return `+1${digits}`;
}

/**
 * Test image URL (placeholder image service)
 */
export const TEST_IMAGE_URL = 'https://via.placeholder.com/800x600';

/**
 * Sample blog data
 */
export function getTestBlogData() {
  const slug = generateRandomSlug('blog');
  return {
    title: generateRandomTitle('Blog Post'),
    slug,
    excerpt: 'This is a test blog post excerpt for E2E testing.',
    content: '<p>This is test content for the blog post.</p>',
    image: TEST_IMAGE_URL,
    author: 'Test Author',
    status: 'draft' as const,
  };
}

/**
 * Sample project data
 */
export function getTestProjectData() {
  const slug = generateRandomSlug('project');
  return {
    title: generateRandomTitle('Project'),
    slug,
    description: 'This is a test project description for E2E testing.',
    content: '<p>This is test content for the project.</p>',
    image: TEST_IMAGE_URL,
    status: 'draft' as const,
    tags: ['test', 'e2e'],
    projectClient: 'Test Client',
    projectLocation: 'Test Location',
    projectSize: '1000 sqft',
    projectCompletion: '2024',
  };
}

/**
 * Sample service data
 */
export function getTestServiceData() {
  const slug = generateRandomSlug('service');
  return {
    title: generateRandomTitle('Service'),
    slug,
    description: 'This is a test service description for E2E testing.',
    content: '<p>This is test content for the service.</p>',
    image: TEST_IMAGE_URL,
    status: 'draft' as const,
    tags: ['test', 'e2e'],
  };
}

/**
 * Sample category data
 */
export function getTestCategoryData() {
  const name = generateRandomTitle('Category');
  return {
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  };
}

/**
 * Sample lead data
 */
export function getTestLeadData() {
  return {
    name: `Test User ${generateRandomString(6)}`,
    email: generateRandomEmail(),
    phone: generateRandomPhone(),
    message: 'This is a test message from E2E testing.',
    status: 'new',
    source: 'manual',
  };
}

