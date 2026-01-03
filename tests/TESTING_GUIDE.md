# E2E Testing Guide

## Quick Start

1. **Set up environment variables**:
   ```bash
   # Create .env.test file with:
   ADMIN_EMAIL=vaishakhpat2003@gmail.com
   ADMIN_PASSWORD=your-admin-password
   PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
   ```

2. **Start the development server**:
   ```bash
   pnpm dev
   ```

3. **Run tests**:
   ```bash
   pnpm test:e2e
   ```

## Test Coverage

### Authentication (`auth.spec.ts`)
- ✅ Login with valid credentials
- ✅ Login with invalid email (non-admin)
- ✅ Login with invalid password
- ✅ Email validation
- ✅ Password visibility toggle
- ✅ Logout functionality
- ✅ Redirect to login for protected routes
- ✅ Session persistence

### Dashboard (`dashboard.spec.ts`)
- ✅ Dashboard page loads
- ✅ Stats cards display
- ✅ Recent blogs section
- ✅ Recent leads section
- ✅ Navigation from stats cards
- ✅ Navigation from recent items

### Blogs Management (`blogs.spec.ts`)
- ✅ Create blog with all fields
- ✅ Auto-slug generation
- ✅ Edit blog
- ✅ Delete blog
- ✅ Form validation
- ✅ Slug format validation
- ✅ Search functionality
- ✅ Filter by category and status
- ✅ Status change
- ✅ Pagination
- ✅ View blog in new tab
- ✅ Add category from blog form

### Projects Management (`projects.spec.ts`)
- ✅ Create project
- ✅ Add tags
- ✅ Add project info fields
- ✅ Add quote/testimonial
- ✅ Toggle mark as new
- ✅ Edit project
- ✅ Delete project
- ✅ Search projects
- ✅ Filter by status
- ✅ Change project status

### Services Management (`services.spec.ts`)
- ✅ Create service
- ✅ Add tags
- ✅ Toggle mark as new
- ✅ Edit service
- ✅ Delete service
- ✅ SEO settings dialog
- ✅ Search services
- ✅ Change service status

### Subservices Management (`subservices.spec.ts`)
- ✅ Create subservice
- ✅ Edit subservice
- ✅ Delete subservice
- ✅ Change parent service
- ✅ Search subservices
- ✅ Filter by status

### Categories Management (`categories.spec.ts`)
- ✅ Create category
- ✅ Auto-generate slug
- ✅ Edit category
- ✅ Delete category
- ✅ Slug validation
- ✅ Search categories
- ✅ Sort categories
- ✅ Pagination

### Leads Management (`leads.spec.ts`)
- ✅ Create lead
- ✅ Email validation
- ✅ Phone validation
- ✅ Edit lead
- ✅ Delete lead
- ✅ View lead details
- ✅ Change lead status
- ✅ Search leads
- ✅ Pagination
- ✅ Source badges

### Settings (`settings.spec.ts`)
- ✅ Toggle projects enabled
- ✅ Toggle blogs enabled
- ✅ Settings persist after reload

### Integration Tests (`integration.spec.ts`)
- ✅ Complete workflow: category → blog → edit → delete
- ✅ Complete workflow: service → subservice
- ✅ Navigation between admin pages
- ✅ Data consistency across pages

## Test Helpers

### Authentication Helpers (`helpers/auth.ts`)
- `login(page, email, password)` - Login to admin panel
- `logout(page)` - Logout from admin panel
- `isLoggedIn(page)` - Check if user is logged in
- `ensureLoggedIn(page)` - Ensure user is logged in

### Wait Helpers (`helpers/wait-helpers.ts`)
- `waitForToast(page, message?)` - Wait for toast notification
- `waitForFormSubmission(page)` - Wait for form submission
- `waitForTableLoad(page)` - Wait for table to load
- `waitForSheetOpen(page)` - Wait for sheet/modal to open
- `waitForSupabaseOperation(page, message?)` - Wait for Supabase operation

### Test Data (`helpers/test-data.ts`)
- `getTestBlogData()` - Generate test blog data
- `getTestProjectData()` - Generate test project data
- `getTestServiceData()` - Generate test service data
- `getTestCategoryData()` - Generate test category data
- `getTestLeadData()` - Generate test lead data
- `generateRandomString()`, `generateRandomEmail()`, etc.

### Page Objects (`helpers/page-objects.ts`)
- `LoginPage` - Login page interactions
- `DashboardPage` - Dashboard page interactions
- `BlogsPage` - Blogs page interactions
- `ProjectsPage` - Projects page interactions
- `CategoriesPage` - Categories page interactions
- `LeadsPage` - Leads page interactions

## Fixtures

### Admin Auth Fixture (`fixtures/admin-auth.ts`)
Provides authenticated test contexts:
- `authenticatedContext` - Browser context with authenticated session
- `authenticatedPage` - Page with authenticated session

Usage:
```typescript
import { test, expect } from './fixtures/admin-auth';

test('my test', async ({ authenticatedPage }) => {
  // authenticatedPage is already logged in
  await authenticatedPage.goto('/admin/blogs');
});
```

## Best Practices

1. **Use fixtures for authenticated tests** - Don't login in every test, use the `authenticatedPage` fixture
2. **Wait for async operations** - Use wait helpers for Supabase operations, form submissions, etc.
3. **Handle empty states** - Some tests skip if no data exists (this is expected)
4. **Use test data generators** - Generate unique test data to avoid conflicts
5. **Clean up after tests** - Tests should be independent and not rely on previous test data

## Troubleshooting

### Tests timeout
- Ensure dev server is running
- Check `PLAYWRIGHT_TEST_BASE_URL` is correct
- Increase timeout in `playwright.config.ts`

### Authentication fails
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.test`
- Ensure admin user exists in database

### Element not found
- Some tests skip if no data exists (expected behavior)
- Check if selectors match current UI
- Use `test.skip()` for optional features

### Flaky tests
- Add appropriate waits for async operations
- Use `waitForLoadState('networkidle')` after navigation
- Wait for specific elements instead of fixed timeouts

## CI/CD Integration

To run tests in CI:
```yaml
# Example GitHub Actions
- name: Install Playwright
  run: pnpm exec playwright install --with-deps

- name: Run E2E tests
  run: pnpm test:e2e
  env:
    ADMIN_EMAIL: ${{ secrets.ADMIN_EMAIL }}
    ADMIN_PASSWORD: ${{ secrets.ADMIN_PASSWORD }}
    PLAYWRIGHT_TEST_BASE_URL: ${{ secrets.TEST_BASE_URL }}
```

## Next Steps

1. Set up `.env.test` with your admin credentials
2. Run `pnpm test:e2e` to verify all tests pass
3. Add more specific tests for edge cases
4. Set up CI/CD pipeline
5. Monitor test results and fix any failures

