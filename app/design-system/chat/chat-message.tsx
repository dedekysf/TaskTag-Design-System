import { ChatMessage } from '@/components/ChatMessage';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ChatMessageScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Message" totalItems={3} />

        <ComponentSection
          title="Received"
          githubUrls={[{ label: 'ChatMessage', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatMessage.tsx' }]}
          usageCode={`import { ChatMessage } from '@/components/ChatMessage';

<ChatMessage
  sender="James Hammer"
  time="10:24 AM"
  message="Hey! Can you check the plumbing issue on Floor 2?"
/>`}
        >
          <Box style={{ maxWidth: 480 }}>
            <ChatMessage
              sender="James Hammer"
              time="10:24 AM"
              message="Hey! Can you check the plumbing issue on Floor 2?"
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="Sent"
          githubUrls={[{ label: 'ChatMessage', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatMessage.tsx' }]}
          usageCode={`import { ChatMessage } from '@/components/ChatMessage';

// sender="You" renders as outgoing (light mint background + check mark)
<ChatMessage
  sender="You"
  time="10:26 AM"
  message="Sure, I'll look into it right away."
/>`}
        >
          <Box style={{ maxWidth: 480 }}>
            <ChatMessage
              sender="You"
              time="10:26 AM"
              message="Sure, I'll look into it right away."
            />
          </Box>
        </ComponentSection>

        <ComponentSection
          title="dedek (owner)"
          githubUrls={[{ label: 'ChatMessage', url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatMessage.tsx' }]}
          usageCode={`import { ChatMessage } from '@/components/ChatMessage';

// sender containing "dedek" renders with orange avatar + white bubble + border
<ChatMessage
  sender="dedek yusuf"
  time="10:28 AM"
  message="I'll coordinate with the team on this."
/>`}
        >
          <Box style={{ maxWidth: 480 }}>
            <ChatMessage
              sender="dedek yusuf"
              time="10:28 AM"
              message="I'll coordinate with the team on this."
            />
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
