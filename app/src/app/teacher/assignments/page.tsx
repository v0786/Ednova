'use client';

import React from 'react';
import AppShell from '@/components/AppShell';
import FeaturePlaceholder from '@/components/ui/FeaturePlaceholder';
import { FileText } from 'lucide-react';

export default function TeacherAssignmentsPage() {
  return (
    <AppShell userRole="TEACHER" userName="Prof. Sarah Jenkins">
      <FeaturePlaceholder
        title="Classroom Assignments & Grading"
        description="The EDNOVA assignments engine will allow teachers to assign homework, set deadline rules, and grade student submissions."
        category="Phase 7 Workstream"
        icon={<FileText className="w-8 h-8" />}
      />
    </AppShell>
  );
}
