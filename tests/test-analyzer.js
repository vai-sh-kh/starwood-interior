#!/usr/bin/env node

/**
 * Test Analyzer - Runs tests and provides analysis of failures
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname);
const REPORT_DIR = path.join(__dirname, '..', 'playwright-report');

console.log('🔍 Playwright Test Analyzer\n');
console.log('Running comprehensive test suite...\n');

try {
    // Run all tests
    const output = execSync(
        'pnpm exec playwright test --reporter=list,json --reporter=list',
        {
            cwd: path.join(__dirname, '..'),
            encoding: 'utf-8',
            stdio: 'pipe'
        }
    );

    console.log(output);

    // Try to read JSON report if it exists
    const jsonReportPath = path.join(REPORT_DIR, 'results.json');
    if (fs.existsSync(jsonReportPath)) {
        const report = JSON.parse(fs.readFileSync(jsonReportPath, 'utf-8'));

        console.log('\n📊 Test Summary:');
        console.log(`   Total: ${report.stats.total}`);
        console.log(`   Passed: ${report.stats.expected}`);
        console.log(`   Failed: ${report.stats.unexpected}`);
        console.log(`   Skipped: ${report.stats.skipped}`);

        if (report.stats.unexpected > 0) {
            console.log('\n❌ Failed Tests:');
            report.suites.forEach(suite => {
                suite.specs.forEach(spec => {
                    spec.tests.forEach(test => {
                        if (test.results.some(r => r.status === 'failed')) {
                            console.log(`   - ${spec.title}: ${test.title}`);
                            test.results.forEach(result => {
                                if (result.status === 'failed' && result.error) {
                                    console.log(`     Error: ${result.error.message}`);
                                }
                            });
                        }
                    });
                });
            });
        }
    }

    console.log('\n✅ Analysis complete!');
    console.log('📊 View detailed report: pnpm test:e2e:report');

} catch (error) {
    console.error('❌ Error running tests:', error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
}

