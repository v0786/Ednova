import {
  registerNormalUser,
  requestPrincipalMobileOtp,
  verifyPrincipalMobileOtp,
  createInstitutionByPrincipal,
  updateInstitutionSetupProgress,
  finalizeInstitutionSetup,
  searchUnassignedUsers,
  assignUserToInstitution,
  createInstitutionInvitation,
  submitJoinRequestWithCode,
  reviewMembershipRequest,
  getUserAccountState,
  getInstitutionSetupState,
} from '../onboardingActions';

export interface TestResult {
  scenarioNumber: number;
  category: string;
  testName: string;
  passed: boolean;
  message: string;
}

export async function runOnboardingAcceptanceTestSuite(): Promise<TestResult[]> {
  const results: TestResult[] = [];

  // ==========================================
  // SECTION 1: NORMAL USER REGISTRATION
  // ==========================================
  try {
    const res = await registerNormalUser({
      googleId: 'goog-std-test-1',
      email: 'alex.morgan@gmail.com',
      username: 'alex_morgan',
      passwordHash: 'secretHash123',
      fullName: 'Alex Morgan',
    });

    results.push({
      scenarioNumber: 1,
      category: 'Normal User Registration',
      testName: 'Google identity authenticated & account created',
      passed: res.success && Boolean(res.data?.id),
      message: 'PASSED: Normal user account registered with Google identity',
    });

    results.push({
      scenarioNumber: 2,
      category: 'Normal User Registration',
      testName: 'User has no school after registration (schoolId is null)',
      passed: res.data?.schoolId === null,
      message: 'PASSED: Account created with strictly NULL schoolId',
    });

    results.push({
      scenarioNumber: 3,
      category: 'Normal User Registration',
      testName: 'User has no role after registration (role is null)',
      passed: res.data?.role === null,
      message: 'PASSED: Account created with strictly NULL role',
    });

    results.push({
      scenarioNumber: 4,
      category: 'Normal User Registration',
      testName: 'Account status is ACCOUNT_CREATED',
      passed: res.data?.status === 'ACCOUNT_CREATED',
      message: 'PASSED: Initial state set to ACCOUNT_CREATED',
    });
  } catch (err: any) {
    results.push({
      scenarioNumber: 1,
      category: 'Normal User Registration',
      testName: 'Normal User Registration Core Setup',
      passed: false,
      message: err.message,
    });
  }

  // ==========================================
  // SECTION 2: PRINCIPAL OTP & INSTITUTION CREATION
  // ==========================================
  try {
    const mobile = '+919988776655';
    const otpRes = await requestPrincipalMobileOtp(mobile);

    results.push({
      scenarioNumber: 5,
      category: 'Principal OTP',
      testName: 'Principal mobile OTP request',
      passed: otpRes.success,
      message: 'PASSED: Mobile OTP requested successfully for Principal candidate',
    });

    // Invalid OTP Test
    const invalidVerify = await verifyPrincipalMobileOtp({
      mobileNumber: mobile,
      otp: '000000',
      googleId: 'goog-p-test',
      email: 'dr.vance@school.edu',
      fullName: 'Dr. Vance',
    });

    results.push({
      scenarioNumber: 6,
      category: 'Principal OTP',
      testName: 'Invalid OTP code rejection',
      passed: Boolean(!invalidVerify.success && invalidVerify.error?.includes('INVALID_OTP')),
      message: 'PASSED: Invalid OTP rejected by server validator',
    });


    // Valid OTP Verification
    const validVerify = await verifyPrincipalMobileOtp({
      mobileNumber: mobile,
      otp: '123456',
      googleId: 'goog-p-test',
      email: 'dr.vance@school.edu',
      fullName: 'Dr. Vance',
    });

    results.push({
      scenarioNumber: 7,
      category: 'Principal OTP',
      testName: 'Valid OTP verifies Principal and sets PRINCIPAL_VERIFIED status',
      passed: validVerify.success && validVerify.user?.status === 'PRINCIPAL_VERIFIED',
      message: 'PASSED: Principal mobile OTP verified & account upgraded to PRINCIPAL_VERIFIED',
    });

    // Create Institution by Principal
    const instRes = await createInstitutionByPrincipal({
      principalUserId: validVerify.user!.id,
      name: 'St. Jude Higher Academy',
      type: 'SCHOOL',
      address: '77 Campus Road, Mumbai',
      contactEmail: 'admin@stjude.edu',
      contactPhone: mobile,
      academicYearName: '2026–2027',
      startDate: '2026-06-01',
      endDate: '2027-04-30',
    });

    results.push({
      scenarioNumber: 8,
      category: 'Institution Creation',
      testName: 'Verified Principal creates institution with human-readable code',
      passed: instRes.success && Boolean(instRes.institution?.humanReadableCode.startsWith('EDN-')),
      message: `PASSED: Institution created with code ${instRes.institution?.humanReadableCode}`,
    });

    results.push({
      scenarioNumber: 9,
      category: 'Institution Creation',
      testName: 'Institution initial setup status is SETUP with 25% progress',
      passed: instRes.institution?.status === 'SETUP' && instRes.institution?.progressPct === 25,
      message: 'PASSED: Institution state initialized to SETUP with 25% initial progress',
    });
  } catch (err: any) {
    results.push({
      scenarioNumber: 5,
      category: 'Principal OTP',
      testName: 'Principal OTP Execution',
      passed: false,
      message: err.message,
    });
  }

  // ==========================================
  // SECTION 3: RESUMABLE SETUP WIZARD
  // ==========================================
  try {
    const instId = 'sch-demo-a';
    const stepRes = await updateInstitutionSetupProgress(instId, 'CLASSES_SECTIONS', {
      classes: [
        { id: 'cls-10', name: 'Grade 10', sections: ['A', 'B', 'C'] },
        { id: 'cls-9', name: 'Grade 9', sections: ['A', 'B'] },
      ],
      subjects: [
        { id: 'sub-math', name: 'Mathematics', classId: 'cls-10' },
        { id: 'sub-sci', name: 'Science', classId: 'cls-10' },
      ],
    });

    results.push({
      scenarioNumber: 10,
      category: 'Setup Wizard',
      testName: 'Resumable wizard saves classes, sections, & subjects with progress update',
      passed: stepRes.success && (stepRes.institution?.progressPct || 0) > 50,
      message: `PASSED: Setup progress persisted cleanly (${stepRes.institution?.progressPct}% progress)`,
    });

    const finalRes = await finalizeInstitutionSetup(instId);

    results.push({
      scenarioNumber: 11,
      category: 'Setup Wizard',
      testName: 'Finalize setup updates institution state to ACTIVE',
      passed: finalRes.success && finalRes.institution?.status === 'ACTIVE' && finalRes.institution?.progressPct === 100,
      message: 'PASSED: Institution finalized to ACTIVE status at 100% progress',
    });
  } catch (err: any) {
    results.push({
      scenarioNumber: 10,
      category: 'Setup Wizard',
      testName: 'Resumable Setup Wizard Execution',
      passed: false,
      message: err.message,
    });
  }

  // ==========================================
  // SECTION 4: PRINCIPAL USER ASSIGNMENT ENGINE
  // ==========================================
  try {
    const searchRes = await searchUnassignedUsers('alex');

    results.push({
      scenarioNumber: 12,
      category: 'User Assignment',
      testName: 'Principal searches unassigned EDNOVA accounts',
      passed: searchRes.success && searchRes.users.length > 0,
      message: 'PASSED: Search query returned unassigned EDNOVA accounts',
    });

    const targetUser = searchRes.users[0];
    const assignRes = await assignUserToInstitution({
      principalUserId: 'usr-principal-001',
      targetUserId: targetUser.id,
      institutionId: 'sch-demo-a',
      assignedRole: 'STUDENT',
      classId: 'cls-10',
      section: 'A',
    });

    results.push({
      scenarioNumber: 13,
      category: 'User Assignment',
      testName: 'Principal assigns student to institution, class, and section',
      passed: assignRes.success && assignRes.updatedUser?.schoolId === 'sch-demo-a' && assignRes.updatedUser?.role === 'STUDENT',
      message: 'PASSED: Student assigned to institution and activated with STUDENT role',
    });

    // Cross-tenant assignment attempt by unauthorized user
    const illegalAssign = await assignUserToInstitution({
      principalUserId: 'usr-student-001', // Unauthorized user
      targetUserId: targetUser.id,
      institutionId: 'sch-demo-a',
      assignedRole: 'TEACHER',
    });

    results.push({
      scenarioNumber: 14,
      category: 'User Assignment',
      testName: 'Unauthorized user cross-tenant assignment attempt blocked',
      passed: Boolean(!illegalAssign.success && illegalAssign.error?.includes('FORBIDDEN')),
      message: 'PASSED: Server blocked unauthorized assignment attempt',
    });

  } catch (err: any) {
    results.push({
      scenarioNumber: 12,
      category: 'User Assignment',
      testName: 'User Assignment Engine Execution',
      passed: false,
      message: err.message,
    });
  }

  // ==========================================
  // SECTION 5: INVITATION CODE & MEMBERSHIP REQUEST FLOW
  // ==========================================
  try {
    const invRes = await createInstitutionInvitation('usr-principal-001', 'sch-demo-a', 'TEACHER');

    results.push({
      scenarioNumber: 15,
      category: 'Invitation & Request',
      testName: 'Principal generates institution teacher invitation code',
      passed: invRes.success && Boolean(invRes.invitation?.code.startsWith('EDNOVA-')),
      message: `PASSED: Invitation code ${invRes.invitation?.code} generated`,
    });

    const code = invRes.invitation!.code;
    const reqRes = await submitJoinRequestWithCode('usr-teacher-001', code);

    results.push({
      scenarioNumber: 16,
      category: 'Invitation & Request',
      testName: 'User submits join code creating PENDING membership request without auto-granting access',
      passed: reqRes.success && reqRes.request?.status === 'PENDING',
      message: 'PASSED: Join request submitted with PENDING status (no auto role elevation)',
    });

    const reviewRes = await reviewMembershipRequest(
      'usr-principal-001',
      reqRes.request!.id,
      true,
      'cls-10',
      'A',
      ['sub-math']
    );

    results.push({
      scenarioNumber: 17,
      category: 'Invitation & Request',
      testName: 'Principal reviews & approves membership request, assigning role & subjects',
      passed: reviewRes.success,
      message: 'PASSED: Principal approved membership request and assigned teacher role',
    });
  } catch (err: any) {
    results.push({
      scenarioNumber: 15,
      category: 'Invitation & Request',
      testName: 'Invitation & Request Execution',
      passed: false,
      message: err.message,
    });
  }

  return results;
}

if (typeof require !== 'undefined' && require.main === module) {
  runOnboardingAcceptanceTestSuite().then((results) => {
    console.log('\n============================================================');
    console.log('    EDNOVA ONBOARDING & INSTITUTION ARCHITECTURE TEST SUITE  ');
    console.log('============================================================');
    let passCount = 0;
    results.forEach((r) => {
      const statusSymbol = r.passed ? '✓ PASS' : '✗ FAIL';
      if (r.passed) passCount++;
      console.log(`[${r.scenarioNumber.toString().padStart(2, '0')}] ${statusSymbol} | [${r.category}] ${r.testName}`);
      console.log(`     └─ ${r.message}`);
    });
    console.log('------------------------------------------------------------');
    console.log(`TOTAL SCENARIOS: ${results.length} | PASSED: ${passCount} | FAILED: ${results.length - passCount}`);
    console.log(`SUCCESS RATE: ${((passCount / results.length) * 100).toFixed(1)}%`);
    console.log('============================================================\n');
    if (passCount !== results.length) process.exit(1);
  });
}
