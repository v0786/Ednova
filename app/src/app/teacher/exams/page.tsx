'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import FeaturePlaceholder from '@/components/ui/FeaturePlaceholder';
import { Award } from 'lucide-react';

export default function TeacherExamsPage() {
  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <FeaturePlaceholder
        title="Exams & Online Assessment"
        description="Create formal examinations, configure automated grading keys, and generate term evaluation reports."
        category="Phase 8 Workstream"
        icon={<Award className="w-8 h-8" />}
      />
    </AppShell>
  );
}
