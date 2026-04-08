import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import { StatusBadge } from '@/components/StatusBadge';
import React from 'react';
import { ScrollView } from 'react-native';

export default function StatusBadgeScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Status Badge" totalItems={1} />

                <ComponentSection
                    title="Mapped Variants"
                    githubUrls={[
                        {
                            label: 'StatusBadge',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/StatusBadge.tsx'
                        }
                    ]}
                    usageCode={`import { StatusBadge } from '@/components/StatusBadge';

export default function Example() {
  return (
    <Box flexDirection="row" gap="md">
      <StatusBadge status="Active" />
      <StatusBadge status="Pending" />
      <StatusBadge status="Disabled" />
    </Box>
  );
}`}
                >
                    <Box flexDirection="row" gap="md" padding="md">
                        <StatusBadge status="Active" />
                        <StatusBadge status="Pending" />
                        <StatusBadge status="Disabled" />
                        <StatusBadge status="Unknown" />
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
