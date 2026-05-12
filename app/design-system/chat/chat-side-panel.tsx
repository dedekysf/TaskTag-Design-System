import { ChatSidePanel } from '@/components/ChatSidePanel';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box } from '@/components/primitives';
import React from 'react';
import { ScrollView } from 'react-native';

export default function ChatSidePanelScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Side Panel" totalItems={2} />

        {/* ── Variant 1: Photo avatars (owner + member with photo) ── */}
        <ComponentSection
          title="Photo Avatars (Owner)"
          githubUrls={[{
            label: 'ChatSidePanel',
            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatSidePanel.tsx',
          }]}
          usageCode={`import { ChatSidePanel } from '@/components/ChatSidePanel';

<ChatSidePanel
  users={[
    {
      variant: 'photo',
      src: require('@/assets/images/sample-one.jpg'),
      isActive: true,   // highlighted strip — owner / active chat
    },
    {
      variant: 'photo',
      src: require('@/assets/images/sample-two.jpg'),
      isActive: false,
    },
  ]}
/>`}
        >
          <Box padding="md" flexDirection="row" gap="xl">
            {/* With active highlight on first slot */}
            <Box style={{ height: 320, width: 72, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
              <ChatSidePanel
                users={[
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-one.jpg'),
                    isActive: true,
                  },
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-two.jpg'),
                    isActive: false,
                  },
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-three.jpg'),
                    isActive: false,
                  },
                ]}
              />
            </Box>

            {/* Active on second slot */}
            <Box style={{ height: 320, width: 72, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
              <ChatSidePanel
                users={[
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-one.jpg'),
                    isActive: false,
                  },
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-two.jpg'),
                    isActive: true,
                  },
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-three.jpg'),
                    isActive: false,
                  },
                ]}
              />
            </Box>
          </Box>
        </ComponentSection>

        {/* ── Variant 2: Initials avatars (admin / member) ── */}
        <ComponentSection
          title="Initial Name Avatars (Admin / Member)"
          githubUrls={[{
            label: 'ChatSidePanel',
            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatSidePanel.tsx',
          }]}
          usageCode={`import { ChatSidePanel } from '@/components/ChatSidePanel';

<ChatSidePanel
  users={[
    {
      variant: 'text',
      initials: 'LS',
      color: 'pastelMagenta',
      isActive: true,   // highlighted strip — active chat
    },
    {
      variant: 'text',
      initials: 'OH',
      color: 'pastelOrange',
      isActive: false,
    },
    {
      variant: 'text',
      initials: 'SN',
      color: 'pastelBlue',
      isActive: false,
    },
  ]}
/>`}
        >
          <Box padding="md" flexDirection="row" gap="xl">
            {/* Initials only, first slot active */}
            <Box style={{ height: 320, width: 72, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
              <ChatSidePanel
                users={[
                  { variant: 'text', initials: 'LS', color: 'pastelMagenta', isActive: true },
                  { variant: 'text', initials: 'OH', color: 'pastelOrange', isActive: false },
                  { variant: 'text', initials: 'SN', color: 'pastelBlue', isActive: false },
                ]}
              />
            </Box>

            {/* Mixed: photo owner + initials members */}
            <Box style={{ height: 320, width: 72, overflow: 'hidden', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)' }}>
              <ChatSidePanel
                users={[
                  {
                    variant: 'photo',
                    src: require('@/assets/images/sample-one.jpg'),
                    isActive: true,
                  },
                  { variant: 'text', initials: 'OH', color: 'pastelOrange', isActive: false },
                  { variant: 'text', initials: 'AS', color: 'pastelYellow', isActive: false },
                  { variant: 'text', initials: 'SN', color: 'pastelBlue', isActive: false },
                ]}
              />
            </Box>
          </Box>
        </ComponentSection>
      </Box>
    </ScrollView>
  );
}
