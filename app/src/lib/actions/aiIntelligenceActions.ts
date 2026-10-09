'use server';

import { verifyServerSession } from '../auth/rbacGuard';
import { generateAIIntelligenceAssistance } from '../ai/intelligence';

export interface AIIntelligenceResponse {
  promptId: string;
  category: 'TEACHER_LESSON_PLAN' | 'STUDENT_CONCEPT_HELP' | 'PRINCIPAL_ACADEMIC_INSIGHT';
  generatedOutput: string;
  disclaimer: string;
}

export async function requestAIIntelligenceAssistance(
  schoolId: string,
  category: 'TEACHER_LESSON_PLAN' | 'STUDENT_CONCEPT_HELP' | 'PRINCIPAL_ACADEMIC_INSIGHT',
  query: string
) {
  const session = await verifyServerSession(['TEACHER', 'STUDENT', 'SCHOOL_ADMIN', 'SUPER_ADMIN', 'PRINCIPAL']);
  return generateAIIntelligenceAssistance(schoolId, category, query, session);
}
