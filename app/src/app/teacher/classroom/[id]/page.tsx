import React from 'react';
import ClassroomHubClient from './ClassroomHubClient';

interface ClassroomParams {
  id: string;
}

export function generateStaticParams() {
  return [
    { id: 'cls-8a' },
    { id: 'cls-8b' },
    { id: 'cls-9a' },
    { id: 'cls-10a' },
  ];
}

export default async function TeacherClassroomHubPage({ params }: { params: Promise<ClassroomParams> }) {
  return <ClassroomHubClient params={params} />;
}
