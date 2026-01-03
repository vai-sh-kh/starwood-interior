# Quick Start Guide - E2E Testing

## 🚀 Run Tests in 3 Steps

### Step 1: Setup Environment
Create `.env.test` file in project root:
```env
ADMIN_EMAIL=vaishakhpat2003@gmail.com
ADMIN_PASSWORD=your-admin-password-here
PLAYWRIGHT_TEST_BASE_URL=http://localhost:3000
```

### Step 2: Start Dev Server
```bash
pnpm dev
```

### Step 3: Run Tests

**Option A: Interactive UI (Recommended for first time)**
```bash
pnpm test:e2e:ui
```
This opens Playwright's interactive UI where you can:
- Watch tests run in real-time
- See screenshots and videos
- Debug failures step-by-step
- Filter and run specific tests

**Option B: Headless (Fast)**
```bash
pnpm test:e2e
```
Runs all tests and generates HTML report.

**Option C: View Test Viewer**
```bash
pnpm test:e2e:viewer
```
Opens a helpful HTML page with all test commands and documentation.

## 📋 Common Commands

```bash
# Run all tests
pnpm test:e2e

# Run with UI (interactive)
pnpm test:e2e:ui

# Run specific test file
pnpm exec playwright test tests/auth.spec.ts

# Run tests matching pattern
pnpm exec playwright test --grep "login"

# View test report
pnpm test:e2e:report

# Debug a test
pnpm test:e2e:debug tests/auth.spec.ts
```

## 🐛 Troubleshooting

### Tests timeout
- Ensure dev server is running: `pnpm dev`
- Check `PLAYWRIGHT_TEST_BASE_URL` in `.env.test`
- Increase timeout in `playwright.config.ts`

### Authentication fails
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.test`
- Ensure admin user exists in Supabase

### Element not found
- Some tests skip if no data exists (expected)
- Check browser console for errors
- Use `test:e2e:headed` to see what's happening

## 📊 Test Coverage

- ✅ Authentication (9 tests)
- ✅ Dashboard (9 tests)
- ✅ Blogs Management (13 tests)
- ✅ Projects Management (11 tests)
- ✅ Services Management (9 tests)
- ✅ Subservices Management (6 tests)
- ✅ Categories Management (9 tests)
- ✅ Leads Management (11 tests)
- ✅ Settings (3 tests)
- ✅ Integration Tests (4 tests)

**Total: ~84 comprehensive E2E tests**

## 🎯 Next Steps

1. Run `pnpm test:e2e:ui` to see all tests in action
2. Review test failures in the HTML report
3. Fix any issues found
4. Add more tests for edge cases as needed

