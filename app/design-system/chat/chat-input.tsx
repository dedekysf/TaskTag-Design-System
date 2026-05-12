import { ChatInput } from '@/components/ChatInput';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ChatInputScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Input" totalItems={1} />

        <ComponentSection
          title="Default"
          githubUrls={[{ label: 'ChatInput', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatInput.tsx' }]}
          usageCode={`import { ChatInput } from '@/components/ChatInput';

<ChatInput />`}
        >
          <Box style={{ borderRadius: 8, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8' }}>
            <ChatInput />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
