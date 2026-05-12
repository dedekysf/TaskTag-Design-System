/**
 * ChatSidePanel Component
 *
 * A collapsible mini chat panel displayed on the right side of the web app shell.
 * Supports two avatar variants per user slot:
 *   - 'photo'  — displays a photo image (typically for the active/owner user)
 *   - 'text'   — displays initials on a colored background (for admin / member)
 *
 * The active user slot is highlighted with a lightMint background strip.
 * A "New Chat" FAB is anchored at the bottom.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { ChevronsLeft, MessageSquarePlus } from 'lucide-react-native';
import React from 'react';
import { Image, ImageSourcePropType, Platform, Pressable } from 'react-native';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ChatSidePanelAvatarVariant = 'photo' | 'text';

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

export interface ChatSidePanelProps {
  users?: ChatSidePanelUser[];
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatSidePanel({
  users = DEFAULT_USERS,
  onNewChat,
  onCollapse,
}: ChatSidePanelProps) {
  const theme = useTheme<Theme>();

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
