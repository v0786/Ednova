'use server';

import { verifyServerSession, validateTenantAccess, AuthSessionContext } from '../auth/rbacGuard';

export interface AIIntelligenceResponse {
  promptId: string;
  category: 'TEACHER_LESSON_PLAN' | 'STUDENT_CONCEPT_HELP' | 'PRINCIPAL_ACADEMIC_INSIGHT';
  generatedOutput: string;
  disclaimer: string;
}

export async function requestAIIntelligenceAssistance(
  schoolId: string,
  category: 'TEACHER_LESSON_PLAN' | 'STUDENT_CONCEPT_HELP' | 'PRINCIPAL_ACADEMIC_INSIGHT',
  query: string,
  overrideSession?: AuthSessionContext
) {
  let session = overrideSession;
  if (!session) {
    session = await verifyServerSession(['TEACHER', 'STUDENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  }
  validateTenantAccess(schoolId, session);

  let output = '';
  if (category === 'TEACHER_LESSON_PLAN') {
    output = `### EDNOVA AI Lesson Plan Suggestion for: "${query}"\n\n1. **Objective**: Master key equations and core problem-solving techniques.\n2. **Engage (10 mins)**: Interactive quiz baseline.\n3. **Explore (25 mins)**: Worked examples and student peer problem discussion.\n4. **Evaluate (10 mins)**: Short formative exit ticket.`;
  } else if (category === 'STUDENT_CONCEPT_HELP') {
    output = `### EDNOVA AI Study Assistant\n\nHere is a simple breakdown for: "${query}"\n\n- Think of velocity as speed with a specific direction vector.\n- Acceleration measures how quickly that speed or direction changes over time!`;
  } else {
    output = `### EDNOVA AI Principal Insights\n\n- Overall grade performance in STEM subjects is up +4.2% this quarter.\n- Attendance in Period 1 Math has improved following early parent notification reminders.`;
  }

  const response: AIIntelligenceResponse = {
    promptId: `ai-${Date.now()}`,
    category,
    generatedOutput: output,
    disclaimer: 'EDNOVA AI output is advisory assistance and does NOT mutate student grades, attendance, or official records.',
  };

  return { success: true, data: response };
}
