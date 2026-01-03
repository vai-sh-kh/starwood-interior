#!/bin/bash

# Test Runner Script with UI Viewer
# This script runs Playwright tests and opens the test report

echo "🚀 Starting Playwright E2E Tests..."
echo ""

# Check if dev server is running
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "⚠️  Warning: Dev server might not be running on http://localhost:3000"
    echo "   Start it with: pnpm dev"
    echo ""
fi

# Run tests
echo "Running tests..."
pnpm exec playwright test "$@"

# Get exit code
EXIT_CODE=$?

# Open test report if tests completed
if [ $EXIT_CODE -eq 0 ] || [ $EXIT_CODE -eq 1 ]; then
    echo ""
    echo "📊 Opening test report..."
    pnpm exec playwright show-report
fi

exit $EXIT_CODE

