import { ComponentSection } from '@/components/ComponentSection';
import { HighlightText } from '@/components/HighlightText';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function HighlightTextScreen() {
    return (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
            <Box padding="lg">
                <PageHeader title="Highlight Text" totalItems={1} />

                <ComponentSection
                    title="Usage"
                    githubUrls={[
                        {
                            label: 'HighlightText',
                            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/HighlightText.tsx'
                        }
                    ]}
                    usageCode={`import { HighlightText } from '@/components/HighlightText';

export default function Example() {
  const searchQuery = "tag";
  return (
    <HighlightText 
      text="Welcome to the TaskTag Component Library" 
      query={searchQuery} 
      baseStyle={{ fontSize: 16 }} 
    />
  );
}`}
                >
                    <Box padding="md">
                        <HighlightText 
                            text="Welcome to the TaskTag Component Library" 
                            query="tag" 
                            baseStyle={{ fontSize: 16, color: '#333' }} 
                        />
                    </Box>
                </ComponentSection>

            </Box>
        </ScrollView>
    );
}
