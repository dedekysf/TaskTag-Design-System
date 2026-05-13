import { ProjectChecklist } from '@/components/ProjectChecklist';
import React from 'react';
import ProjectDashboardBase from '../_shared/ProjectDashboardBase';

export default function OnboardingScreen() {
  return (
    <ProjectDashboardBase hideDefaultModal profileVariant="photo">
      <ProjectChecklist />
    </ProjectDashboardBase>
  );
}
