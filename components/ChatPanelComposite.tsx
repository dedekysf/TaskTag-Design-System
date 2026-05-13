/**
 * ChatPanelComposite Component
 *
 * A single unified chat panel with clear state flow:
 *
 *   collapsed (mini 80px)
 *       ↕ expand/collapse
 *   list (550px total)
 *       ↕ select conversation / back / X
 *   room (470px) + mini strip (80px) = 550px total
 *
 * Constraints:
 *   - Total width is always 550px regardless of view
 *   - Room mode: room panel = 470px, mini strip = 80px
 *   - X in room → returns to list (not collapsed)
 *   - Collapse only via ChevronsRight in list header
 *
 * Usage:
 *   <ChatPanelComposite />
 *   <ChatPanelComposite defaultView="list" />
 */

import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Hash,
  Image as ImageIcon,
  Maximize2,
  MoreVertical,
  MessageSquarePlus,
  Plus,
  Search,
  Send,
  Smile,
  X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatView = 'collapsed' | 'list' | 'room';

export type ChatAvatarVariant = 'photo' | 'text';

export interface ChatUser {
  variant: ChatAvatarVariant;
  src?: ImageSourcePropType;
  initials?: string;
  color?: keyof Theme['colors'];
  isActive?: boolean;
}

export interface ChatListItem {
  id: string;
  user: ChatUser;
  name: string;
  preview: string;
  timestamp: string;
}

/**
 * 'without-member' → only Tasktag Helpdesk (1 item)
 * 'with-member'    → Tasktag Helpdesk + Alex Smith (2 items)
 */
export type ChatPanelVariant = 'without-member' | 'with-member';

export interface ChatPanelCompositeProps {
  /** Initial view state */
  defaultView?: ChatView;
  /**
   * Preset list variant — controls which chat items are shown.
   * Ignored when `listItems` is passed explicitly.
   */
  variant?: ChatPanelVariant;
  /** Full manual override of list items (overrides variant) */
  listItems?: ChatListItem[];
  /** Mini avatar list — if omitted, auto-derived from resolved listItems */
  miniUsers?: ChatUser[];
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ChatAvatar({ user, size = 44 }: { user: ChatUser; size?: number }) {
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
      <Text style={{ fontWeight: '700', color: theme.colors.white, fontSize: size * 0.36 }}>
        {user.initials?.toUpperCase() ?? '?'}
      </Text>
    </Box>
  );
}

// ─── Mini Strip (collapsed or right side of room) ─────────────────────────────

function MiniStrip({
  users,
  onExpand,
}: {
  users: ChatUser[];
  onExpand: () => void;
}) {
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
        <Box
          key={i}
          alignItems="center"
          justifyContent="center"
          style={{
            width: '100%',
            paddingVertical: 10,
            marginBottom: 8,
            backgroundColor: user.isActive ? theme.colors.lightMint : 'transparent',
          }}
        >
          <ChatAvatar user={user} size={44} />
        </Box>
      ))}

      {/* New chat FAB */}
      <Box flex={1} justifyContent="flex-end">
        <Pressable
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

// ─── Chat List View (550px) ───────────────────────────────────────────────────

function ListView({
  items,
  onCollapse,
  onSelectItem,
}: {
  items: ChatListItem[];
  onCollapse: () => void;
  onSelectItem: (item: ChatListItem) => void;
}) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="background"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, width: 550, position: 'relative' as any }}
    >
      {/* Header — no bottom border */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="card"
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
        <Box style={{ paddingHorizontal: 6 }}>
          {items.map((item) => (
            <Pressable key={item.id} onPress={() => onSelectItem(item)}>
              {({ pressed }: any) => (
                <Box
                  flexDirection="row"
                  alignItems="center"
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    gap: 16,
                    borderRadius: 8,
                    backgroundColor: pressed ? theme.colors.grey01 : 'transparent',
                  }}
                >
                  <ChatAvatar user={item.user} size={48} />
                  <Box flex={1} style={{ gap: 2, justifyContent: 'center' }}>
                    <Text
                      style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 20 }}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={{ fontSize: 14, color: theme.colors.grey04, lineHeight: 16, letterSpacing: 0.28 }}
                      numberOfLines={1}
                    >
                      {item.preview}
                    </Text>
                  </Box>
                  {/* Timestamp — vertically centered with the row */}
                  <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.grey04, lineHeight: 16, alignSelf: 'center' }}>
                    {item.timestamp}
                  </Text>
                </Box>
              )}
            </Pressable>
          ))}
        </Box>
      </ScrollView>

      {/* New Message FAB */}
      <Box style={{ position: 'absolute' as any, bottom: 16, right: 16 }}>
        <Pressable
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

// ─── Chat Room View (550px) ───────────────────────────────────────────────────

function RoomView({
  contact,
  onBack,
  onClose,
}: {
  contact: ChatListItem;
  onBack: () => void;
  onClose: () => void;
}) {
  const theme = useTheme<Theme>();

  const messages = [
    {
      id: '1',
      sender: contact.user,
      senderName: contact.name,
      time: '10:30 AM',
      text: contact.preview,
    },
  ];

  return (
    <Box
      backgroundColor="grey01"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, width: 470, position: 'relative' as any }}
    >
      {/* Header */}
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
          <Pressable onPress={onBack} hitSlop={8}>
            <ChevronLeft size={20} color={theme.colors.textSecondary} />
          </Pressable>
          <ChatAvatar user={contact.user} size={40} />
          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
            {contact.name}
          </Text>
        </Box>
        <Box flexDirection="row" alignItems="center">
          <Pressable style={{ padding: 8 }}>
            <Maximize2 size={18} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={{ padding: 8 }}>
            <MoreVertical size={18} color={theme.colors.textSecondary} />
          </Pressable>
          {/* X → back to list, not collapsed */}
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
        {/* Date separator */}
        <Box flexDirection="row" alignItems="center" style={{ marginBottom: 20 }}>
          <Box flex={1} height={1} backgroundColor="border" />
          <Text style={{ fontSize: 12, color: theme.colors.grey03, marginHorizontal: 12 }}>
            Today
          </Text>
          <Box flex={1} height={1} backgroundColor="border" />
        </Box>

        {messages.map((msg) => (
          <Box key={msg.id} style={{ marginBottom: 16 }}>
            <Box flexDirection="row" gap="12" alignItems="flex-start">
              <ChatAvatar user={msg.sender} size={40} />
              <Box flex={1}>
                <Box flexDirection="row" alignItems="center" style={{ gap: 8, marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                    {msg.senderName}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>
                    {msg.time}
                  </Text>
                </Box>
                <Box
                  backgroundColor="card"
                  style={{ borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 20 }}>
                    {msg.text}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </ScrollView>

      {/* Chat input */}
      <Box style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <Box
          backgroundColor="card"
          borderWidth={1}
          borderColor="border"
          style={{ borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}
        >
          <Text style={{ fontSize: 14, color: theme.colors.grey03, paddingBottom: 20 }}>
            Type message here...
          </Text>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
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
                width: 40, height: 40, borderRadius: 10,
                backgroundColor: theme.colors.grey02,
                alignItems: 'center', justifyContent: 'center',
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

// ─── Main Composite Component ─────────────────────────────────────────────────

export function ChatPanelComposite({
  defaultView = 'list',
  variant = 'without-member',
  listItems,
  miniUsers,
}: ChatPanelCompositeProps) {
  // Resolve list items: explicit prop > variant preset
  const resolvedItems = listItems ?? (
    variant === 'with-member' ? LIST_ITEMS_WITH_MEMBER : LIST_ITEMS_WITHOUT_MEMBER
  );
  const [view, setView] = useState<ChatView>(defaultView);
  const [activeContact, setActiveContact] = useState<ChatListItem | null>(null);

  // Derive mini avatars from resolvedItems so they always stay in sync
  const resolvedMiniUsers: ChatUser[] = miniUsers ?? resolvedItems.map((item) => ({
    ...item.user,
    isActive: activeContact?.id === item.id,
  }));

  // collapsed → mini strip only (80px)
  if (view === 'collapsed') {
    return (
      <MiniStrip
        users={resolvedMiniUsers}
        onExpand={() => setView('list')}
      />
    );
  }

  // room → chat room (470px) + mini strip (80px) = 550px total
  if (view === 'room' && activeContact) {
    return (
      <>
        <RoomView
          contact={activeContact}
          onBack={() => setView('list')}
          onClose={() => setView('list')}  // X → back to list, not collapse
        />
        <MiniStrip
          users={resolvedMiniUsers}
          onExpand={() => setView('list')}
        />
      </>
    );
  }

  // list → chat list (550px)
  return (
    <ListView
      items={resolvedItems}
      onCollapse={() => setView('collapsed')}
      onSelectItem={(item) => {
        setActiveContact(item);
        setView('room');
      }}
    />
  );
}

// ─── Default data ─────────────────────────────────────────────────────────────

// ─── Preset list items ───────────────────────────────────────────────────────

/** variant='without-member' — only Tasktag Helpdesk */
export const LIST_ITEMS_WITHOUT_MEMBER: ChatListItem[] = [
  {
    id: '1',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    preview: "Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.",
    timestamp: 'Monday',
  },
];

/** variant='with-member' — Alex Smith first, Tasktag Helpdesk last */
export const LIST_ITEMS_WITH_MEMBER: ChatListItem[] = [
  {
    id: '2',
    user: { variant: 'text', initials: 'AS', color: 'secondaryGreen' },
    name: 'Alex Smith',
    preview: 'Hey! Can you check the task list for the renovation project?',
    timestamp: 'Yesterday',
  },
  {
    id: '1',
    user: { variant: 'text', initials: 'TH', color: 'orange' },
    name: 'Tasktag Helpdesk',
    preview: "Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.",
    timestamp: 'Monday',
  },
];

/** @deprecated Use LIST_ITEMS_WITHOUT_MEMBER or LIST_ITEMS_WITH_MEMBER instead */
export const DEFAULT_LIST_ITEMS = LIST_ITEMS_WITHOUT_MEMBER;
