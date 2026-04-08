import { DateBadge, PriorityBadge } from '@/components/Badge';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function BadgeScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Badge" totalItems={2} />

                {/* Priority Badge */}
                <ComponentSection
                    title="Priority Badge"
                    githubUrls={[
                        {
                            label: 'Badge',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Badge.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Box flexDirection="row" gap="md">
        <PriorityBadge priority="high" />
        <PriorityBadge priority="medium" />
        <PriorityBadge priority="low" />
    </Box>
  );
}`}
                >
                    <Box flexDirection="row" gap="md">
                        <PriorityBadge priority="high" />
                        <PriorityBadge priority="medium" />
                        <PriorityBadge priority="low" />
                    </Box>
                </ComponentSection>

                {/* Date Badge */}
                <ComponentSection
                    title="Date Badge"
                    githubUrls={[
                        {
                            label: 'Badge',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/Badge.tsx'
                        }
                    ]}
                    usageCode={`export default function Example() {
  return (
    <Box flexDirection="row" gap="md">
        <DateBadge date="Nov 7, 2025" />
        <DateBadge date="Oct 20, 2025" />
    </Box>
  );
}`}
                >
                    <Box flexDirection="row" gap="md">
                        <DateBadge date="Nov 7, 2025" />
                        <DateBadge date="Oct 20, 2025" />
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
