import {
  ChatPanel,
  ChatAvatar,
  DEFAULT_LIST_ITEMS,
  DEFAULT_ROOM_CONTACT,
  DEFAULT_COLLAPSED_USERS,
} from '@/components/ChatPanel';
import { ComponentSection } from '@/components/ComponentSection';
import { PageHeader } from '@/components/PageHeader';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView } from 'react-native';

const DEMO_HEIGHT = 540;

/** Compact wrapper that clips and gives a fixed height for previews */
function PanelPreview({ children, width = 340 }: { children: React.ReactNode; width?: number }) {
  return (
    <Box
      style={{
        height: DEMO_HEIGHT,
        width,
        overflow: 'hidden',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        flexDirection: 'row',
      }}
    >
      {children}
    </Box>
  );
}

/** Sample message bubble — mirrors the "Member Activity" chat message from the prototype */
function MemberActivityBubble({ label, projectName }: { label: string; projectName: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        backgroundColor: theme.colors.card,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        padding: 8,
        alignSelf: 'flex-start',
      }}
    >
      <Box
        borderWidth={1}
        borderColor="border"
        style={{ borderRadius: 10, overflow: 'hidden' }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          style={{ gap: 8, padding: 10, backgroundColor: '#f9eefa' }}
        >
          <Users size={13} color={theme.colors.darkMagenta} />
          <Text style={{ fontSize: 12, color: theme.colors.darkMagenta, fontWeight: '500' }}>
            Member Activity
          </Text>
        </Box>
        <Box backgroundColor="card" style={{ padding: 8 }}>
          <Text
            style={{
              fontSize: 14,
              color: theme.colors.textSecondary,
              marginBottom: 8,
              lineHeight: 20,
            }}
          >
            {label}
          </Text>
          <Box
            flexDirection="row"
            alignItems="center"
            style={{
              gap: 6,
              backgroundColor: theme.colors.secondaryGreen,
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 5,
              alignSelf: 'flex-start',
            }}
          >
            <Text
              style={{ fontSize: 12, color: theme.colors.white, fontWeight: '500' }}
            >
              {projectName}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function ChatPanelScreen() {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
      <Box padding="lg">
        <PageHeader title="Chat Panel" totalItems={3} />

        {/* ── 1. List ─────────────────────────────────────────────────────── */}
        <ComponentSection
          title="List"
          githubUrls={[{
            label: 'ChatPanel',
            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatPanel.tsx',
          }]}
          usageCode={`import { ChatPanel } from '@/components/ChatPanel';

<ChatPanel view="list" listItems={[
  {
    id: '1',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    preview: "Hi there! Welcome to TaskTag!...",
    timestamp: 'Monday',
  },
]} />`}
        >
          <Box padding="md">
            <PanelPreview>
              <ChatPanel
                view="list"
                listItems={DEFAULT_LIST_ITEMS}
              />
            </PanelPreview>
          </Box>
        </ComponentSection>

        {/* ── 2. Collapsed List ───────────────────────────────────────────── */}
        <ComponentSection
          title="Collapsed List"
          githubUrls={[{
            label: 'ChatPanel',
            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatPanel.tsx',
          }]}
          usageCode={`import { ChatPanel } from '@/components/ChatPanel';

<ChatPanel view="collapsed" collapsedUsers={[
  { variant: 'text', initials: 'AZ', color: 'purple' },
  { variant: 'text', initials: 'GB', color: 'darkMagenta' },
  { variant: 'text', initials: 'TH', color: 'orange' },
]} />`}
        >
          <Box padding="md">
            <PanelPreview width={72}>
              <ChatPanel
                view="collapsed"
                collapsedUsers={DEFAULT_COLLAPSED_USERS}
              />
            </PanelPreview>
          </Box>
        </ComponentSection>

        {/* ── 3. Chat Room ────────────────────────────────────────────────── */}
        <ComponentSection
          title="Chat Room"
          githubUrls={[{
            label: 'ChatPanel',
            url: 'https://github.com/dedekysf/TaskTag-Design-System/blob/main/components/ChatPanel.tsx',
          }]}
          usageCode={`import { ChatPanel } from '@/components/ChatPanel';

<ChatPanel
  view="room"
  roomContact={{ variant: 'text', initials: 'AS', color: 'secondaryGreen', name: 'Alex Smith' }}
  dateSeparator="Friday, November 20"
  roomMessages={[
    {
      id: '1',
      sender: { variant: 'text', initials: 'AS', color: 'secondaryGreen' },
      senderName: 'Alex Smith',
      time: '12:25 PM',
      children: <MemberActivityBubble label="Added to this project" projectName="LA Avenue 34 G" />,
    },
  ]}
/>`}
        >
          <Box padding="md">
            <PanelPreview>
              <ChatPanel
                view="room"
                roomContact={DEFAULT_ROOM_CONTACT}
                dateSeparator="Friday, November 20"
                roomMessages={[
                  {
                    id: '1',
                    sender: { variant: 'text', initials: 'AS', color: 'secondaryGreen' },
                    senderName: 'Alex Smith',
                    time: '12:25 PM',
                    children: (
                      <MemberActivityBubble
                        label="Added to this project"
                        projectName="LA Avenue 34 G"
                      />
                    ),
                  },
                ]}
              />
            </PanelPreview>
          </Box>
        </ComponentSection>

      </Box>
    </ScrollView>
  );
}
