import { ChatHeader } from '@/components/ChatHeader';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ChatHeaderScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Header" totalItems={1} />

        <ComponentSection
          title="Default"
          githubUrls={[{ label: 'ChatHeader', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatHeader.tsx' }]}
          usageCode={`import { ChatHeader } from '@/components/ChatHeader';

<ChatHeader />`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <ChatHeader />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
