import { runMvpAcceptanceTestSuite } from '../src/lib/actions/__tests__/mvpAcceptanceTest.test';
import { runSecurityChecks } from '../src/lib/actions/__tests__/authSecurityCheck';

async function main() {
  console.log('====================================================');
  console.log('EDNOVA BASIC MVP ACCEPTANCE & SECURITY TEST SUITE');
  console.log('====================================================\n');

  console.log('1. Executing Auth Security & Tenant Isolation Guard Checks...');
  try {
    runSecurityChecks();
    console.log('  ✓ [VERIFIED] validateTenantAccess() blocks cross-tenant access\n');
  } catch (err: any) {
    console.error('  ✕ [FAILED] Security check failed:', err.message);
  }

  console.log('2. Executing End-to-End Acceptance Test Scenarios...');
  const results = await runMvpAcceptanceTestSuite();
  
  let allPassed = true;
  for (const r of results) {
    const statusSymbol = r.passed ? '✓' : '✕';
    const statusText = r.passed ? '[VERIFIED]' : '[FAILED]';
    console.log(`  ${statusSymbol} ${statusText} ${r.testName}: ${r.message}`);
    if (!r.passed) allPassed = false;
  }

  console.log('\n====================================================');
  if (allPassed) {
    console.log('FINAL TEST RESULT: ALL MVP ACCEPTANCE TESTS PASSED (100%)');
  } else {
    console.log('FINAL TEST RESULT: SOME TESTS FAILED');
    process.exit(1);
  }
  console.log('====================================================');
}

main();
