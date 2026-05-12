/**
 * ChatPanel Component
 *
 * The right-side chat panel of the web app shell. Supports three views:
 *
 *   'list'     — Full chat list showing conversations with avatars, preview & timestamp.
 *                Header: "Chat" + Search / MoreVertical / ChevronsRight icons.
 *                Body: list of chat preview rows.
 *                Footer: floating "New Message" pill button.
 *
 *   'collapsed' — Collapsed icon-only sidebar showing user avatar circles +
 *                 a ChevronsLeft expand button + new-chat FAB at bottom.
 *                 (This replaces the separate ChatSidePanel when inside the chat panel area.)
 *
 *   'room'     — Active chat room with a header (avatar + name + Maximize / MoreVertical / X),
 *                scrollable message area, and a chat input footer.
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
  Users,
  X,
} from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Image, ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatPanelView = 'list' | 'collapsed' | 'room';

export type ChatAvatarVariant = 'photo' | 'text';

export interface ChatPanelUser {
  variant: ChatAvatarVariant;
  /** Required when variant === 'photo' */
  src?: ImageSourcePropType;
  /** Required when variant === 'text' */
  initials?: string;
  /** Theme color key — used when variant === 'text' */
  color?: keyof Theme['colors'];
  /** Whether this slot is highlighted (active chat) */
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
  /** Rendered message content — pass any JSX bubble */
  children: ReactNode;
}

export interface ChatPanelProps {
  view?: ChatPanelView;
  /** Used in 'list' view */
  listItems?: ChatListItem[];
  /** Used in 'room' view — contact displayed in header */
  roomContact?: ChatPanelUser & { name: string };
  /** Messages to show in 'room' view */
  roomMessages?: ChatRoomMessage[];
  /** Dates separator label in 'room' view */
  dateSeparator?: string;
  /** Context label below date separator in 'room' view (e.g. project name) */
  contextLabel?: string;
  /** Users shown in collapsed icon-column next to room */
  collapsedUsers?: ChatPanelUser[];
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
      width={72}
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

export function ChatPanel({
  view = 'list',
  listItems = DEFAULT_LIST_ITEMS,
  roomContact = DEFAULT_ROOM_CONTACT,
  roomMessages = [],
  dateSeparator = 'Friday, November 20',
  collapsedUsers = DEFAULT_COLLAPSED_USERS,
  onCollapse,
  onExpand,
  onClose,
  onNewMessage,
}: ChatPanelProps) {
  const theme = useTheme<Theme>();

  // ── Collapsed view ──────────────────────────────────────────────────────────
  if (view === 'collapsed') {
    return (
      <CollapsedColumn
        users={collapsedUsers}
        onExpand={onExpand}
        onNewMessage={onNewMessage}
      />
    );
  }

  // ── Chat List view ──────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <Box
        flex={1}
        backgroundColor="background"
        borderLeftWidth={1}
        borderColor="border"
        style={{ height: '100%' as any, maxWidth: 550, position: 'relative' as any }}
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
            <Pressable style={{ padding: 4 }} onPress={onCollapse}>
              <ChevronsRight size={24} color={theme.colors.foreground} />
            </Pressable>
          </Box>
        </Box>

        {/* List */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Box style={{ paddingHorizontal: 6, paddingVertical: 0 }}>
            {listItems.map((item) => (
              <ChatListRow key={item.id} item={item} />
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

  // ── Chat Room view ──────────────────────────────────────────────────────────
  return (
    <Box
      flex={1}
      backgroundColor="grey01"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, maxWidth: 550 }}
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
          <Pressable style={{ padding: 8 }} onPress={onClose}>
            <X size={18} color={theme.colors.textSecondary} />
          </Pressable>
        </Box>
      </Box>

      {/* Message area */}
      <Box flex={1} justifyContent="flex-end">
        {/* Date separator */}
        <Box
          flexDirection="row"
          alignItems="center"
          style={{ paddingHorizontal: 24, paddingVertical: 20 }}
        >
          <Box flex={1} height={1} backgroundColor="border" />
          <Text
            style={{ fontSize: 12, color: theme.colors.grey03, marginHorizontal: 12 }}
          >
            {dateSeparator}
          </Text>
          <Box flex={1} height={1} backgroundColor="border" />
        </Box>

        {/* Messages */}
        {roomMessages.map((msg) => (
          <Box
            key={msg.id}
            style={{ paddingHorizontal: 16, paddingBottom: 16 }}
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
      </Box>

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
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_LIST_ITEMS: ChatListItem[] = [
  {
    id: '1',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    preview:
      "Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have. Feel free to reach out anytime. We're just a message away!",
    timestamp: 'Monday',
  },
];

export const DEFAULT_ROOM_CONTACT: ChatPanelUser & { name: string } = {
  variant: 'text',
  initials: 'AS',
  color: 'secondaryGreen',
  name: 'Alex Smith',
};

export const DEFAULT_COLLAPSED_USERS: ChatPanelUser[] = [
  { variant: 'text', initials: 'AZ', color: 'purple', isActive: false },
  { variant: 'text', initials: 'GB', color: 'darkMagenta', isActive: false },
  { variant: 'text', initials: 'TH', color: 'orange', isActive: false },
];
