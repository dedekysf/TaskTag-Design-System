import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { WelcomeModalScreen } from '@/components/WelcomeModalScreen';
import React from 'react';
import { ScrollView } from 'react-native';

export default function WelcomeModalScreenDemo() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader
          title="Welcome Modal Screen"
          totalItems={1}
          description="Onboarding welcome screen used after a user enters a workspace."
        />

        <ComponentSection
          title="Default"
          githubUrls={[
            {
              label: 'WelcomeModalScreen',
              url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/WelcomeModalScreen.tsx',
            },
          ]}
          usageCode={`import { WelcomeModalScreen } from '@/components/WelcomeModalScreen';

<WelcomeModalScreen
  name="Oscar"
  onGetStarted={() => {
    // Continue onboarding
  }}
/>`}
        >
          <Box alignItems="center" style={{ paddingVertical: 24 }}>
            <WelcomeModalScreen name="Oscar" />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}

