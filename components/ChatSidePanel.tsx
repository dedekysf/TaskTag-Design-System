/**
 * ChatSidePanel Component
 *
 * A collapsible side chat panel displayed on the right side of the web app shell.
 * Supports two modes:
 *   - 'avatars'  — Shows stacked avatar circles (mini mode)
 *   - 'list'     — Shows chat list items with preview text and icons
 *
 * The active user slot is highlighted with a lightMint background strip.
 * A "New Chat" FAB is anchored at the bottom.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronsLeft, MessageSquarePlus } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChatSidePanelAvatarVariant = 'photo' | 'text';
export type ChatSidePanelMode = 'avatars' | 'list';

export interface ChatSidePanelUser {
  /** Display variant: 'photo' for image avatar (owner), 'text' for initials (admin/member) */
  variant: ChatSidePanelAvatarVariant;
  /** Required when variant === 'photo' */
  src?: ImageSourcePropType;
  /** Required when variant === 'text' */
  initials?: string;
  /** Background color key from Theme['colors'] — used when variant === 'text' */
  color?: keyof Theme['colors'];
  /** Whether this slot is highlighted as the active chat */
  isActive?: boolean;
}

export interface ChatListItem {
  id: string;
  user: ChatSidePanelUser;
  name: string;
  subtitle: string;
  preview?: string;
  timestamp?: string;
}

export interface ChatSidePanelProps {
  mode?: ChatSidePanelMode;
  /** Used in 'avatars' mode */
  users?: ChatSidePanelUser[];
  /** Used in 'list' mode */
  listItems?: ChatListItem[];
  onNewChat?: () => void;
  onCollapse?: () => void;
}

// ─── Avatar Slot ─────────────────────────────────────────────────────────────

function AvatarSlot({ user }: { user: ChatSidePanelUser }) {
  const theme = useTheme<Theme>();

  const resolvedBg =
    user.color && Object.keys(theme.colors).includes(user.color as string)
      ? theme.colors[user.color as keyof Theme['colors']]
      : (user.color as string | undefined) ?? theme.colors.grey03;

  const inner =
    user.variant === 'photo' && user.src ? (
      <Image source={user.src} style={{ width: 44, height: 44, borderRadius: 22 }} />
    ) : (
      <Box
        width={44}
        height={44}
        borderRadius="full"
        alignItems="center"
        justifyContent="center"
        style={{ backgroundColor: resolvedBg as string }}
      >
        <Text style={{ fontWeight: '700', color: theme.colors.white, fontSize: 14 }}>
          {user.initials?.toUpperCase() ?? '?'}
        </Text>
      </Box>
    );

  if (user.isActive) {
    return (
      <Box
        alignItems="center"
        justifyContent="center"
        style={{
          width: '100%',
          paddingVertical: 10,
          backgroundColor: theme.colors.lightMint,
          marginBottom: 8,
        }}
      >
        {inner}
      </Box>
    );
  }

  return <Box style={{ marginBottom: 8 }}>{inner}</Box>;
}

// ─── Chat List Row ────────────────────────────────────────────────────────────

function ChatListRow({ item }: { item: ChatListItem }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      alignItems="flex-start"
      style={{ paddingHorizontal: 12, paddingVertical: 10, gap: 12, width: '100%' }}
    >
      <ChatAvatar user={item.user} size={40} />
      <Box flex={1} style={{ gap: 2 }}>
        <Text
          style={{ fontSize: 13, fontWeight: '500', color: theme.colors.foreground, lineHeight: 18 }}
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text
          style={{ fontSize: 11, color: theme.colors.grey04, lineHeight: 14 }}
          numberOfLines={1}
        >
          {item.subtitle}
        </Text>
        {item.preview && (
          <Text
            style={{ fontSize: 11, color: theme.colors.grey03, lineHeight: 14 }}
            numberOfLines={1}
          >
            {item.preview}
          </Text>
        )}
      </Box>
    </Box>
  );
}

// ─── Chat Avatar Component ────────────────────────────────────────────────────

function ChatAvatar({ user, size = 44 }: { user: ChatSidePanelUser; size?: number }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatSidePanel({
  mode = 'avatars',
  users = DEFAULT_USERS,
  listItems = DEFAULT_LIST_ITEMS,
  onNewChat,
  onCollapse,
}: ChatSidePanelProps) {
  const theme = useTheme<Theme>();

  // ── Avatar mode (mini/collapsed) ──────────────────────────────────────────
  if (mode === 'avatars') {
    return (
      <Box
        width={72}
        backgroundColor="card"
        borderLeftWidth={1}
        borderColor="border"
        alignItems="center"
        style={{
          height: '100%' as any,
          paddingTop: 16,
          paddingBottom: 20,
        }}
      >
        {/* Collapse button */}
        <Pressable style={{ padding: 8, marginBottom: 12 }} onPress={onCollapse} hitSlop={8}>
          <ChevronsLeft size={20} color={theme.colors.grey04} />
        </Pressable>

        {/* User avatar slots */}
        {users.map((user, i) => (
          <AvatarSlot key={i} user={user} />
        ))}

        {/* New Chat FAB */}
        <Box flex={1} justifyContent="flex-end">
          <Pressable
            onPress={onNewChat}
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

  // ── List mode ─────────────────────────────────────────────────────────────
  return (
    <Box
      width={280}
      backgroundColor="card"
      borderLeftWidth={1}
      borderColor="border"
      style={{
        height: '100%' as any,
        paddingTop: 12,
        paddingBottom: 16,
      }}
    >
      {/* Collapse button */}
      <Pressable style={{ padding: 8, marginLeft: 8, marginBottom: 8 }} onPress={onCollapse} hitSlop={8}>
        <ChevronsLeft size={20} color={theme.colors.grey04} />
      </Pressable>

      {/* Chat list */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Box>
          {listItems.map((item) => (
            <ChatListRow key={item.id} item={item} />
          ))}
        </Box>
      </ScrollView>

      {/* New Chat FAB */}
      <Box style={{ paddingHorizontal: 12, paddingTop: 12 }}>
        <Pressable
          onPress={onNewChat}
          style={{
            width: '100%',
            height: 44,
            borderRadius: 10,
            backgroundColor: theme.colors.foreground,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 8,
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
          <MessageSquarePlus size={18} color={theme.colors.white} />
          <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.white }}>New Chat</Text>
        </Pressable>
      </Box>
    </Box>
  );
}

// ─── Default props (mirrors ProjectDashboardBase) ────────────────────────────

export const DEFAULT_USERS: ChatSidePanelUser[] = [
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
    variant: 'text',
    initials: 'TH',
    color: 'orange',
    isActive: false,
  },
];

export const DEFAULT_LIST_ITEMS: ChatListItem[] = [
  {
    id: '1',
    user: { variant: 'photo', src: require('@/assets/images/sample-one.jpg') },
    name: 'Dedek Yusuf',
    subtitle: 'Dedek, Media',
    timestamp: 'Yesterday',
  },
  {
    id: '2',
    user: { variant: 'text', initials: 'DY', color: 'orange' },
    name: 'dedek yusuf15',
    subtitle: 'Member Activity',
    preview: 'dedek yusuf15 has been invited to this project.',
    timestamp: '05/10/2025',
  },
  {
    id: '3',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    subtitle: 'Support',
    preview: 'Tasktag, just responding to the last message',
    timestamp: '05/08/2025',
  },
];
