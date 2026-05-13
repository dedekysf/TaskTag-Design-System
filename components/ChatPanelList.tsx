/**
 * ChatPanelList Component
 *
 * Full chat list panel (550px width)
 * Header: "Chat" + Search / MoreVertical / ChevronsRight (collapse) icons.
 * Body: scrollable list of chat preview rows.
 * Footer: floating "New Message" pill button.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
    ChevronsRight,
    MessageSquarePlus,
    MoreVertical,
    Search,
} from 'lucide-react-native';
import React, { ReactNode } from 'react';
import { Image, ImageSourcePropType, Platform, Pressable, ScrollView } from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatAvatarVariant = 'photo' | 'text';

export interface ChatUser {
  variant: ChatAvatarVariant;
  /** Required when variant === 'photo' */
  src?: ImageSourcePropType;
  /** Required when variant === 'text' */
  initials?: string;
  /** Theme color key — used when variant === 'text' */
  color?: keyof Theme['colors'];
}

export interface ChatListItem {
  id: string;
  user: ChatUser;
  name: string;
  preview: string;
  timestamp: string;
}

export interface ChatPanelListProps {
  listItems?: ChatListItem[];
  onCollapse?: () => void;
  onNewMessage?: () => void;
}

// ─── Avatar Component ─────────────────────────────────────────────────────────

export function ChatAvatar({ user, size = 44 }: { user: ChatUser; size?: number }) {
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatPanelList({
  listItems = DEFAULT_LIST_ITEMS,
  onCollapse,
  onNewMessage,
}: ChatPanelListProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, width: 550, position: 'relative' as any }}
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
