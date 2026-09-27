'use client';

import React from 'react';
import AppShell from '@/components/AppShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell userRole="SCHOOL_ADMIN" userName="School Administrator" institutionName="Springfield Educational Academy">
      {children}
    </AppShell>
  );
}
