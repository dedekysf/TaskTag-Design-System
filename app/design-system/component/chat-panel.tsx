/**
 * Chat Panel Component Demo
 *
 * Demonstrates three distinct chat panel layouts:
 * 1. Chat List (550px) - Full conversation list
 * 2. Chat Room (550px) - Active chat room with optional mini user list on right (80px)
 * 3. Collapsed Users (80px) - Mini user sidebar when chat list is collapsed
 */

import {
    ChatPanel,
    ChatRoomMessage,
    DEFAULT_COLLAPSED_USERS,
    DEFAULT_LIST_ITEMS,
    DEFAULT_ROOM_CONTACT
} from '@/components/ChatPanel';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Pressable, ScrollView } from 'react-native';

type DemoView = 'list' | 'room-only' | 'room-with-users' | 'collapsed';

const DEMO_MESSAGES: ChatRoomMessage[] = [
  {
    id: '1',
    sender: { variant: 'text', initials: 'AS', color: 'secondaryGreen' },
    senderName: 'Alex Smith',
    time: '12:25 PM',
    children: (
      <Box
        backgroundColor="lightMint"
        borderRadius="md"
        padding="md"
        style={{ maxWidth: 320 }}
      >
        <Text style={{ fontSize: 14, color: '#000' }}>
          Member Activity
        </Text>
        <Box
          backgroundColor="primary"
          borderRadius="sm"
          paddingHorizontal="md"
          paddingVertical="sm"
          style={{ marginTop: 8, alignSelf: 'flex-start' }}
        >
          <Text style={{ fontSize: 12, color: '#fff', fontWeight: '600' }}>
            LA Avenue 34 G
          </Text>
        </Box>
      </Box>
    ),
  },
];

export default function ChatPanelDemo() {
  const theme = useTheme<Theme>();
  const [activeDemo, setActiveDemo] = useState<DemoView>('list');

  const demoButtons: { label: string; view: DemoView }[] = [
    { label: '1. Chat List (550px)', view: 'list' },
    { label: '2. Room Only (550px)', view: 'room-only' },
    { label: '3. Room + Users (550px + 80px)', view: 'room-with-users' },
    { label: '4. Collapsed (80px)', view: 'collapsed' },
  ];

  return (
    <Box flex={1} backgroundColor="background">
      {/* Header */}
      <Box
        backgroundColor="card"
        borderBottomWidth={1}
        borderColor="border"
        paddingHorizontal="xl"
        paddingVertical="lg"
      >
        <Text variant="webHeading32" color="foreground">
          Chat Panel Component
        </Text>
        <Text variant="webBody" color="textSecondary" style={{ marginTop: 4 }}>
          Demonstrates three layouts: Chat List (550px), Room (550px), Room + Users (550px + 80px),
          and Collapsed (80px)
        </Text>
      </Box>

      {/* Demo Controls */}
      <Box
        backgroundColor="grey01"
        borderBottomWidth={1}
        borderColor="border"
        paddingHorizontal="xl"
        paddingVertical="md"
      >
        <Text variant="webLabelSmall" color="textSecondary" style={{ marginBottom: 12 }}>
          Select Layout:
        </Text>
        <Box flexDirection="row" style={{ gap: 8, flexWrap: 'wrap' }}>
          {demoButtons.map(({ label, view }) => (
            <Pressable
              key={view}
              onPress={() => setActiveDemo(view)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 6,
                backgroundColor:
                  activeDemo === view ? theme.colors.primary : theme.colors.card,
                borderWidth: 1,
                borderColor:
                  activeDemo === view ? theme.colors.primary : theme.colors.border,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color:
                    activeDemo === view
                      ? theme.colors.white
                      : theme.colors.foreground,
                }}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </Box>
      </Box>

      {/* Demo Content */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Box padding="xl">
          {/* Layout Info */}
          <Box
            backgroundColor="card"
            borderRadius="lg"
            padding="lg"
            marginBottom="xl"
            borderWidth={1}
            borderColor="border"
          >
            {activeDemo === 'list' && (
              <>
                <Text variant="webLabelEmphasized" color="foreground" marginBottom="md">
                  1. Chat List Layout (550px width)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Full chat conversation list with avatars, preview text, and timestamps
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Header: "Chat" title + Search / Menu / Collapse icons
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Footer: Floating "New Message" pill button
                </Text>
              </>
            )}
            {activeDemo === 'room-only' && (
              <>
                <Text variant="webLabelEmphasized" color="foreground" marginBottom="md">
                  2. Chat Room Layout (550px width only)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Active chat room with message history
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Header: Avatar + contact name + Maximize / Menu / Close icons
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Footer: Chat input box with formatting tools
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • No user list on the right
                </Text>
              </>
            )}
            {activeDemo === 'room-with-users' && (
              <>
                <Text variant="webLabelEmphasized" color="foreground" marginBottom="md">
                  3. Chat Room + Mini User List (550px + 80px)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Active chat room (left side, 550px) + mini user avatars (right side, 80px)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Room: Header + messages + chat input (same as layout 2)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • User list: Stacked 44x44 avatar slots + new chat FAB at bottom
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Total width: 550px + 80px = 630px
                </Text>
              </>
            )}
            {activeDemo === 'collapsed' && (
              <>
                <Text variant="webLabelEmphasized" color="foreground" marginBottom="md">
                  4. Collapsed Mini Sidebar (80px width)
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Icon-only mini sidebar with user avatars
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Header: ChevronsLeft (expand) button at top
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Body: Vertical stack of 44x44 avatar circles
                </Text>
                <Text variant="webBody" color="textSecondary">
                  • Footer: New chat FAB (44x44) with shadow
                </Text>
              </>
            )}
          </Box>

          {/* Chat Panel Preview Container */}
          <Box
            backgroundColor="card"
            borderRadius="lg"
            overflow="hidden"
            borderWidth={1}
            borderColor="border"
            style={{
              height: 600,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {activeDemo === 'list' && (
              <ChatPanel
                view="list"
                listItems={DEFAULT_LIST_ITEMS}
                onCollapse={() => setActiveDemo('collapsed')}
              />
            )}

            {activeDemo === 'room-only' && (
              <ChatPanel
                view="room"
                roomContact={DEFAULT_ROOM_CONTACT}
                roomMessages={DEMO_MESSAGES}
                onClose={() => setActiveDemo('list')}
              />
            )}

            {activeDemo === 'room-with-users' && (
              <ChatPanel
                view="room"
                roomContact={DEFAULT_ROOM_CONTACT}
                roomMessages={DEMO_MESSAGES}
                collapsedUsers={DEFAULT_COLLAPSED_USERS}
                onClose={() => setActiveDemo('list')}
                onExpand={() => setActiveDemo('list')}
              />
            )}

            {activeDemo === 'collapsed' && (
              <ChatPanel
                view="collapsed"
                collapsedUsers={DEFAULT_COLLAPSED_USERS}
                onExpand={() => setActiveDemo('list')}
              />
            )}
          </Box>

          {/* Specifications Box */}
          <Box
            backgroundColor="grey01"
            borderRadius="lg"
            padding="lg"
            marginTop="xl"
            borderWidth={1}
            borderColor="border"
          >
            <Text variant="webLabelEmphasized" color="foreground" marginBottom="md">
              Layout Specifications
            </Text>

            <Box marginBottom="md">
              <Text variant="webLabelSmall" color="textSecondary" marginBottom="sm">
                Chat List View:
              </Text>
              <Text variant="webBody" color="foreground">
                Width: 550px | Max Height: 100% | Border: left 1px
              </Text>
            </Box>

            <Box marginBottom="md">
              <Text variant="webLabelSmall" color="textSecondary" marginBottom="sm">
                Chat Room View (standalone):
              </Text>
              <Text variant="webBody" color="foreground">
                Width: 550px | Max Height: 100% | Border: left 1px
              </Text>
            </Box>

            <Box marginBottom="md">
              <Text variant="webLabelSmall" color="textSecondary" marginBottom="sm">
                Chat Room + Mini User List:
              </Text>
              <Text variant="webBody" color="foreground">
                Total: 630px (550px room + 80px users) | Height: 100% | Flexbox row
              </Text>
            </Box>

            <Box>
              <Text variant="webLabelSmall" color="textSecondary" marginBottom="sm">
                Collapsed Mini Sidebar:
              </Text>
              <Text variant="webBody" color="foreground">
                Width: 80px (fixed) | Height: 100% | Avatar slots: 44x44px
              </Text>
            </Box>
          </Box>
        </Box>
      </ScrollView>
    </Box>
  );
}
