# E2E Tests for Admin Panel

This directory contains comprehensive end-to-end tests for the admin panel using Playwright.

## Setup

1. **Install dependencies** (already done):
   ```bash
   pnpm install
   ```

2. **Install Playwright browsers**:
   ```bash
   pnpm exec playwright install
   ```

3. **Configure environment variables**:
   Create a `.env.test` file in the root directory with:
   ```env
   ADMIN_EMAIL=vaishakhpat2003@gmail.com
   ADMIN_PASSWORD=your-admin-password-here
   PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
   ```

## Running Tests

### Run all tests
```bash
pnpm test:e2e
```

### Run tests with UI mode (interactive)
```bash
pnpm test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
pnpm test:e2e:headed
```

### Run tests in debug mode
```bash
pnpm test:e2e:debug
```

### View test report
```bash
pnpm test:e2e:report
```

### Run specific test file
```bash
pnpm exec playwright test tests/auth.spec.ts
```

### Run tests matching a pattern
```bash
pnpm exec playwright test --grep "login"
```

## Test Structure

- `auth.spec.ts` - Authentication tests (login, logout, validation)
- `dashboard.spec.ts` - Dashboard page tests
- `blogs.spec.ts` - Blog management tests (CRUD, search, filter, sort, pagination)
- `projects.spec.ts` - Project management tests (CRUD, gallery, project info, tags)
- `services.spec.ts` - Service management tests (CRUD, gallery, tags, SEO)
- `subservices.spec.ts` - Subservice management tests (CRUD, parent service, FAQ)
- `categories.spec.ts` - Category management tests (CRUD, search, sort, pagination)
- `leads.spec.ts` - Lead management tests (CRUD, search, status change, details view)
- `settings.spec.ts` - Settings tests (toggle projects/blogs enabled)
- `integration.spec.ts` - Integration tests for complete workflows

## Helpers

- `helpers/auth.ts` - Authentication helper functions
- `helpers/page-objects.ts` - Page object models for admin pages
- `helpers/test-data.ts` - Test data generators
- `helpers/wait-helpers.ts` - Custom wait utilities

## Fixtures

- `fixtures/admin-auth.ts` - Authenticated admin session fixture

## Configuration

Test configuration is in `playwright.config.ts` at the root of the project.

## Notes

- Tests use an authenticated context fixture for all admin tests
- Tests wait for async operations (Supabase calls, form submissions)
- Tests handle form interactions including rich text editor, image dropzones, and select dropdowns
- Some tests may skip if required data doesn't exist (e.g., no blogs to edit)
- Tests use test-specific data generators to avoid conflicts

## Troubleshooting

### Tests fail with "timeout" errors
- Ensure the dev server is running (`pnpm dev`)
- Check that `PLAYWRIGHT_TEST_BASE_URL` is correct
- Increase timeout in `playwright.config.ts` if needed

### Authentication fails
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.test` are correct
- Ensure the admin user exists in the database

### Tests fail with "element not found"
- Some tests may skip if there's no data (e.g., no blogs to edit)
- This is expected behavior - tests handle empty states gracefully

