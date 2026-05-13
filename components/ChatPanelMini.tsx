/**
 * ChatPanelMini Component
 *
 * Collapsed mini sidebar (80px width)
 * Shows only user avatar circles stacked vertically.
 * Header: ChevronsLeft (expand) button.
 * Body: vertical list of 44x44 avatar slots.
 * Footer: new chat FAB (44x44).
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
    ChevronsLeft,
    MessageSquarePlus,
} from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Platform, Pressable } from 'react-native';

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
  /** Whether this slot is highlighted (active chat) */
  isActive?: boolean;
}

export interface ChatPanelMiniProps {
  users?: ChatUser[];
  onExpand?: () => void;
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

// ─── Avatar Slot with Active Highlight ────────────────────────────────────────

function AvatarSlot({ user }: { user: ChatUser }) {
  const theme = useTheme<Theme>();

  const inner = <ChatAvatar user={user} size={44} />;

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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatPanelMini({
  users = DEFAULT_USERS,
  onExpand,
  onNewMessage,
}: ChatPanelMiniProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      width={80}
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
      {users.map((user, i) => (
        <AvatarSlot key={i} user={user} />
      ))}

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

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_USERS: ChatUser[] = [
  { variant: 'text', initials: 'AZ', color: 'purple', isActive: false },
  { variant: 'text', initials: 'GB', color: 'darkMagenta', isActive: false },
  { variant: 'text', initials: 'TH', color: 'orange', isActive: false },
];
