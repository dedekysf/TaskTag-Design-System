import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { UpgradeModal } from '@/components/UpgradeModal';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

export default function UpgradeModalScreen() {
  const [visible, setVisible] = useState(false);

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Upgrade Modal" totalItems={1} />

        <ComponentSection
          title="Team Plan Upgrade"
          githubUrls={[{ label: 'UpgradeModal', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/UpgradeModal.tsx' }]}
          usageCode={`import { UpgradeModal } from '@/components/UpgradeModal';

export default function Example() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>Upgrade to Team Plan</Button>
      <UpgradeModal
        visible={visible}
        onClose={() => setVisible(false)}
        teamName="Scott 1"
      />
    </>
  );
}`}
        >
          <Box alignItems="center">
            <Pressable
              onPress={() => setVisible(true)}
              style={{ backgroundColor: '#22c55e', borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12 }}
            >
              <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Open Upgrade Modal</Text>
            </Pressable>
            <Text variant="webSecondaryBody" color="grey05" style={{ marginTop: 8 }}>
              Click to preview the upgrade modal
            </Text>
          </Box>
          <UpgradeModal visible={visible} onClose={() => setVisible(false)} />
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
