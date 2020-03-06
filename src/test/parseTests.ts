import { FormattedTestResults } from '@jest/test-result/build/types';
import { Result } from '@tangro/tangro-github-toolkit';

export interface TestResult {
  testSuites: {
    failed: number;
    passed: number;
    skipped: number;
    total: number;
  };
  tests: {
    failed: number;
    passed: number;
    skipped: number;
    total: number;
  };
  snapshots: {
    failed: number;
    passed: number;
    total: number;
  };
  all: FormattedTestResults;
}

export const parseTests = (
  testResult: FormattedTestResults
): Result<TestResult> => {
  const testSuites = {
    failed: testResult.numFailedTestSuites,
    passed: testResult.numPassedTestSuites,
    skipped: testResult.numPendingTestSuites,
    total: testResult.numTotalTestSuites
  };
  const tests = {
    failed: testResult.numFailedTests,
    passed: testResult.numPassedTests,
    skipped: testResult.numPendingTests,
    total: testResult.numTotalTests
  };
  const snapshots = {
    passed: testResult.snapshot.matched,
    failed: testResult.snapshot.total - testResult.snapshot.matched,
    total: testResult.snapshot.total
  };

  const text = `|   | passed | failed | total |
  ----- | ------ | --- | ---
  Test Suites | ${testSuites.passed} | ${testSuites.failed} | ${testSuites.total}
  Tests | ${tests.passed} | ${tests.failed} | ${tests.total}
  Snapshots | ${snapshots.passed} | ${snapshots.failed} | ${snapshots.total}`;
  const shortText = `Suites: ${testSuites.passed}/${testSuites.total} Tests: ${tests.passed}/${tests.total} Snapshots: ${snapshots.passed}/${snapshots.total}`;

  return {
    metadata: {
      testSuites,
      tests,
      snapshots,
      all: testResult
    },
    isOkay: testSuites.passed + testSuites.skipped === testSuites.total,
    shortText,
    text
  };
};
