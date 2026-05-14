/**
 * ChatPanelRoom Component
 *
 * Active chat room (550px width)
 * Header: avatar + name + Maximize / MoreVertical / X (close) icons.
 * Message area: scrollable messages with date separator & activity items.
 * Footer: chat input box with formatting tools.
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
    FileText,
    Hash,
    Image as ImageIcon,
    Maximize2,
    MoreVertical,
    Plus,
    Send,
    Smile,
    X,
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

export interface ChatRoomMessage {
  id: string;
  sender: ChatUser;
  senderName: string;
  time: string;
  /** Rendered message content — pass any JSX bubble */
  children: ReactNode;
}

export interface ChatPanelRoomProps {
  /** Contact displayed in header */
  roomContact?: ChatUser & { name: string };
  /** Messages to show */
  roomMessages?: ChatRoomMessage[];
  /** Date separator label */
  dateSeparator?: string;
  onClose?: () => void;
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function ChatPanelRoom({
  roomContact = DEFAULT_ROOM_CONTACT,
  roomMessages = [],
  dateSeparator = 'Friday, November 20',
  onClose,
}: ChatPanelRoomProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      flex={1}
      backgroundColor="grey01"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, width: 550 }}
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
}

// ─── Default data ─────────────────────────────────────────────────────────────

export const DEFAULT_ROOM_CONTACT: ChatUser & { name: string } = {
  variant: 'text',
  initials: 'AS',
  color: 'darkGreen',
  name: 'Alex Smith',
};
