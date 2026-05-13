/**
 * ChatPanel Component
 *
 * A unified chat interface with three interrelated states:
 *
 * 1. 'list' - Full chat list view (550px)
 *    - Shows scrollable list of chats
 *    - Can collapse to 'collapsed' view
 *    - Click item to transition to 'room' view
 *
 * 2. 'room' - Active chat room view (550px total)
 *    - Shows message thread with an 80px avatar rail inside the total width
 *    - Click close to transition back to previous view
 *
 * 3. 'collapsed' - Collapsed mini view (80px)
 *    - Shows stacked avatar circles
 *    - Click avatar to open chat room
 *    - Click expand to go back to list view
 *
 * The component manages all state transitions internally.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
    ChevronsLeft,
    ChevronsRight,
    FileText,
    Hash,
    Image as ImageIcon,
    Maximize2,
    MessageSquarePlus,
    MoreVertical,
    Plus,
    Search,
    Send,
    Smile,
    X
} from 'lucide-react-native';
import React, { ReactNode, useState } from 'react';
import { Image, ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';

const CHAT_PANEL_WIDTH = 550;
const CHAT_PANEL_COLLAPSED_WIDTH = 80;
const CHAT_ROOM_CONTENT_WIDTH = CHAT_PANEL_WIDTH - CHAT_PANEL_COLLAPSED_WIDTH;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatPanelView = 'list' | 'collapsed' | 'room';

export type ChatAvatarVariant = 'photo' | 'text';

export interface ChatPanelUser {
  variant: ChatAvatarVariant;
  src?: ImageSourcePropType;
  initials?: string;
  color?: keyof Theme['colors'];
  isActive?: boolean;
}

export interface ChatListItem {
  id: string;
  user: ChatPanelUser;
  name: string;
  preview: string;
  timestamp: string;
}

export interface ChatRoomMessage {
  id: string;
  sender: ChatPanelUser;
  senderName: string;
  time: string;
  children: ReactNode;
}

export interface ChatPanelProps {
  /** Controlled view state, kept for existing design-system examples */
  view?: ChatPanelView;
  /** Initial view state */
  initialView?: ChatPanelView;
  /** Chat list items */
  listItems?: ChatListItem[];
  /** Active chat room contact */
  roomContact?: ChatPanelUser & { name: string };
  /** Messages in active room */
  roomMessages?: ChatRoomMessage[];
  /** Date separator in room */
  dateSeparator?: string;
  /** Users shown in collapsed mini sidebar when viewing room */
  collapsedUsers?: ChatPanelUser[];
  /** Callback when transitioning between views */
  onViewChange?: (view: ChatPanelView) => void;
  onCollapse?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  onNewMessage?: () => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export function ChatAvatar({ user, size = 44 }: { user: ChatPanelUser; size?: number }) {
  const theme = useTheme<Theme>();

  const resolvedBg =
    user.color && Object.keys(theme.colors).includes(user.color as string)
      ? theme.colors[user.color as keyof Theme['colors']]
      : (user.color as string | undefined) ?? theme.colors.orange;

  if (user.variant === 'photo' && user.src) {
    return (
      <Image
        source={user.src}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <Box
      width={size}
      height={size}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      style={{ backgroundColor: resolvedBg as string }}
    >
      <Text
        style={{
          fontWeight: '700',
          color: theme.colors.white,
          fontSize: size * 0.36,
        }}
      >
        {user.initials?.toUpperCase() ?? '?'}
      </Text>
    </Box>
  );
}

// ─── Chat List Row ────────────────────────────────────────────────────────────

function ChatListRow({ item }: { item: ChatListItem }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 16, width: '100%' }}
    >
      <ChatAvatar user={item.user} size={48} />
      <Box flex={1} style={{ gap: 2 }}>
        <Text
          style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 20 }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{ fontSize: 14, color: theme.colors.grey04, lineHeight: 16, letterSpacing: 0.28 }}
          numberOfLines={2}
        >
          {item.preview}
        </Text>
      </Box>
      <Text
        style={{ fontSize: 10, fontWeight: '500', color: theme.colors.grey04, lineHeight: 16 }}
      >
        {item.timestamp}
      </Text>
    </Box>
  );
}

// ─── Collapsed Column ─────────────────────────────────────────────────────────

function CollapsedColumn({
  users,
  onExpand,
  onNewMessage,
}: {
  users: ChatPanelUser[];
  onExpand?: () => void;
  onNewMessage?: () => void;
}) {
  const theme = useTheme<Theme>();

  return (
    <Box
      width={CHAT_PANEL_COLLAPSED_WIDTH}
      backgroundColor="card"
      borderLeftWidth={1}
      borderColor="border"
      alignItems="center"
      style={{ height: '100%' as any, paddingTop: 16, paddingBottom: 20 }}
    >
      {/* Expand button */}
      <Pressable style={{ padding: 8, marginBottom: 12 }} onPress={onExpand} hitSlop={8}>
        <ChevronsLeft size={20} color={theme.colors.grey04} />
      </Pressable>

      {/* Avatar slots */}
      {users.map((user, i) =>
        user.isActive ? (
          <Box
            key={i}
            alignItems="center"
            justifyContent="center"
            style={{
              width: '100%',
              paddingVertical: 10,
              backgroundColor: theme.colors.lightMint,
              marginBottom: 8,
            }}
          >
            <ChatAvatar user={user} size={44} />
          </Box>
        ) : (
          <Box key={i} style={{ marginBottom: 8 }}>
            <ChatAvatar user={user} size={44} />
          </Box>
        )
      )}

      {/* New chat FAB */}
      <Box flex={1} justifyContent="flex-end">
        <Pressable
          onPress={onNewMessage}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.foreground,
            alignItems: 'center',
            justifyContent: 'center',
            ...Platform.select({
              web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any,
              default: {
                elevation: 6,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
              },
            }),
          }}
        >
          <MessageSquarePlus size={20} color={theme.colors.white} />
        </Pressable>
      </Box>
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatPanel({
  view,
  initialView = 'list',
  listItems = DEFAULT_LIST_ITEMS,
  roomContact = DEFAULT_ROOM_CONTACT,
  roomMessages = [],
  dateSeparator = 'Friday, November 20',
  collapsedUsers = DEFAULT_COLLAPSED_USERS,
  onViewChange,
  onCollapse,
  onExpand,
  onClose,
  onNewMessage,
}: ChatPanelProps) {
  const theme = useTheme<Theme>();
  const [internalView, setInternalView] = useState<ChatPanelView>(view ?? initialView);
  const currentView = view ?? internalView;

  const handleViewChange = (newView: ChatPanelView) => {
    if (view === undefined) {
      setInternalView(newView);
    }

    onViewChange?.(newView);

    if (newView === 'collapsed') {
      onCollapse?.();
    }
    if (currentView === 'collapsed' && newView === 'list') {
      onExpand?.();
    }
    if (currentView === 'room' && newView === 'list') {
      onClose?.();
    }
  };

  // ── Collapsed view ──────────────────────────────────────────────────────────
  if (currentView === 'collapsed') {
    return (
      <Box
        width={CHAT_PANEL_COLLAPSED_WIDTH}
        backgroundColor="card"
        borderLeftWidth={1}
        borderColor="border"
        alignItems="center"
        style={{ height: '100%' as any, paddingTop: 16, paddingBottom: 20 }}
      >
        {/* Expand button */}
        <Pressable
          style={{ padding: 8, marginBottom: 12 }}
          onPress={() => handleViewChange('list')}
          hitSlop={8}
        >
          <ChevronsLeft size={20} color={theme.colors.grey04} />
        </Pressable>

        {/* Avatar slots */}
        {collapsedUsers.map((user, i) =>
          user.isActive ? (
            <Box
              key={i}
              alignItems="center"
              justifyContent="center"
              style={{
                width: '100%',
                paddingVertical: 10,
                backgroundColor: theme.colors.lightMint,
                marginBottom: 8,
              }}
            >
              <ChatAvatar user={user} size={44} />
            </Box>
          ) : (
            <Pressable
              key={i}
              onPress={() => handleViewChange('room')}
            >
              <Box style={{ marginBottom: 8 }}>
                <ChatAvatar user={user} size={44} />
              </Box>
            </Pressable>
          )
        )}

        {/* New chat FAB */}
        <Box flex={1} justifyContent="flex-end">
          <Pressable
            onPress={() => {
              onNewMessage?.();
              handleViewChange('list');
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: theme.colors.foreground,
              alignItems: 'center',
              justifyContent: 'center',
              ...Platform.select({
                web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any,
                default: {
                  elevation: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                },
              }),
            }}
          >
            <MessageSquarePlus size={20} color={theme.colors.white} />
          </Pressable>
        </Box>
      </Box>
    );
  }

  // ── Chat List view ──────────────────────────────────────────────────────────
  if (currentView === 'list') {
    return (
      <Box
        backgroundColor="background"
        borderLeftWidth={1}
        borderColor="border"
        style={{ height: '100%' as any, width: CHAT_PANEL_WIDTH, position: 'relative' as any }}
      >
        {/* Header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="card"
          borderBottomWidth={1}
          borderColor="border"
          style={{ height: 74, paddingHorizontal: 24 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground }}>
            Chat
          </Text>
          <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
            <Pressable style={{ padding: 4 }}>
              <Search size={24} color={theme.colors.foreground} />
            </Pressable>
            <Pressable style={{ padding: 4 }}>
              <MoreVertical size={24} color={theme.colors.foreground} />
            </Pressable>
            <Pressable style={{ padding: 4 }} onPress={() => handleViewChange('collapsed')}>
              <ChevronsRight size={24} color={theme.colors.foreground} />
            </Pressable>
          </Box>
        </Box>

        {/* List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Box style={{ paddingHorizontal: 6, paddingVertical: 0 }}>
            {listItems.map((item) => (
              <Pressable
                key={item.id}
                onPress={() => handleViewChange('room')}
              >
                <ChatListRow item={item} />
              </Pressable>
            ))}
          </Box>
        </ScrollView>

        {/* New Message FAB */}
        <Box
          style={{
            position: 'absolute' as any,
            bottom: 16,
            right: 16,
          }}
        >
          <Pressable
            onPress={onNewMessage}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: theme.colors.foreground,
              borderRadius: 156,
              paddingHorizontal: 16,
              paddingVertical: 12,
              ...Platform.select({
                web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any,
                default: {
                  elevation: 6,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 8,
                },
              }),
            }}
          >
            <MessageSquarePlus size={20} color={theme.colors.white} />
            <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>
              New Message
            </Text>
          </Pressable>
        </Box>
      </Box>
    );
  }

  // ── Chat Room view ─────────────────────────────────────────────────────────
  if (currentView === 'room') {
    const roomContent = (
      <Box
        backgroundColor="grey01"
        borderLeftWidth={1}
        borderColor="border"
        style={{ height: '100%' as any, width: CHAT_ROOM_CONTENT_WIDTH }}
      >
        {/* Room header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="card"
          borderBottomWidth={1}
          borderColor="border"
          style={{ height: 72, paddingHorizontal: 20 }}
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 12 }}>
            <ChatAvatar user={roomContact} size={44} />
            <Text variant="webLabelEmphasized" color="foreground">
              {roomContact.name}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <Pressable style={{ padding: 8 }}>
              <Maximize2 size={18} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={{ padding: 8 }}>
              <MoreVertical size={18} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={{ padding: 8 }} onPress={() => handleViewChange('list')}>
              <X size={18} color={theme.colors.textSecondary} />
            </Pressable>
          </Box>
        </Box>

        {/* Message area */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: 24,
            paddingVertical: 20,
          }}
        >
          {roomMessages.length > 0 && (
            <>
              <Box
                flexDirection="row"
                alignItems="center"
                style={{ marginBottom: 20 }}
              >
                <Box flex={1} height={1} backgroundColor="border" />
                <Text
                  style={{ fontSize: 12, color: theme.colors.grey03, marginHorizontal: 12 }}
                >
                  {dateSeparator}
                </Text>
                <Box flex={1} height={1} backgroundColor="border" />
              </Box>

              {roomMessages.map((msg) => (
                <Box
                  key={msg.id}
                  style={{ marginBottom: 16 }}
                >
                  <Box flexDirection="row" gap="12" alignItems="flex-start">
                    <ChatAvatar user={msg.sender} size={40} />
                    <Box flex={1}>
                      <Box
                        flexDirection="row"
                        alignItems="center"
                        style={{ gap: 8, marginBottom: 8 }}
                      >
                        <Text
                          style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}
                        >
                          {msg.senderName}
                        </Text>
                        <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>
                          {msg.time}
                        </Text>
                      </Box>
                      {msg.children}
                    </Box>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </ScrollView>

        {/* Chat input footer */}
        <Box style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Box
            backgroundColor="card"
            borderWidth={1}
            borderColor="border"
            style={{ borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}
          >
            <Text
              style={{ fontSize: 14, color: theme.colors.grey03, paddingBottom: 20 }}
            >
              Type message here...
            </Text>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box flexDirection="row" alignItems="center">
                {[Plus, Hash, FileText, ImageIcon, Smile].map((Icon, i) => (
                  <Pressable key={i} style={{ padding: 8 }}>
                    <Icon size={20} color={theme.colors.grey04} />
                  </Pressable>
                ))}
              </Box>
              <Pressable
                disabled
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: theme.colors.grey02,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Send size={18} color={theme.colors.grey04} />
              </Pressable>
            </Box>
          </Box>
        </Box>
      </Box>
    );

    return (
      <Box
        flexDirection="row"
        style={{ height: '100%' as any, width: CHAT_PANEL_WIDTH }}
      >
        {roomContent}
        <CollapsedColumn
          users={collapsedUsers}
          onExpand={() => handleViewChange('list')}
          onNewMessage={() => {
            onNewMessage?.();
            handleViewChange('list');
          }}
        />
      </Box>
    );
  }
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_LIST_ITEMS: ChatListItem[] = [
  {
    id: '1',
    user: { variant: 'photo', src: require('@/assets/images/sample-one.jpg') },
    name: 'Dedek Yusuf',
    preview: 'Dedek: Media',
    timestamp: 'Yesterday',
  },
  {
    id: '2',
    user: { variant: 'text', initials: 'DY', color: 'orange' },
    name: 'dedek yusuf15',
    preview: 'Member Activity',
    timestamp: '05/12/2026',
  },
  {
    id: '3',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    preview: 'Tasktag: just responding to the test message',
    timestamp: '05/05/2026',
  },
];

export const DEFAULT_ROOM_CONTACT: ChatPanelUser & { name: string } = {
  variant: 'text',
  initials: 'DY',
  color: 'orange',
  name: 'dedek yusuf15',
};

export const DEFAULT_COLLAPSED_USERS: ChatPanelUser[] = [
  { variant: 'photo', src: require('@/assets/images/sample-one.jpg'), isActive: false },
  { variant: 'text', initials: 'DY', color: 'orange', isActive: true },
  { variant: 'text', initials: 'TH', color: 'orange', isActive: false },
];
