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
  Check,
  Circle,
  FileText,
  Folder,
  Hash,
  Image as ImageIcon,
  Maximize2,
  MoreVertical,
  MessageSquarePlus,
  Plus,
  Search,
  Send,
  Smile,
  Users,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
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
  openContactId?: string;
  openContactSignal?: number;
  showMemberJoinedCard?: boolean;
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

function AssignTaskPicker({
  onCancel,
  onSelectTask,
}: {
  onCancel: () => void;
  onSelectTask: () => void;
}) {
  const theme = useTheme<Theme>();
  const disabledCursor = Platform.OS === 'web' ? ({ cursor: 'not-allowed' } as any) : null;

  const renderProject = (label: string) => (
    <Pressable accessibilityState={{ disabled: true }} style={[{ paddingVertical: 10 }, disabledCursor]}>
      <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
        <Box
          width={20}
          height={20}
          borderRadius="4"
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: theme.colors.black }}
        >
          <Folder size={14} color={theme.colors.brandGreen} />
        </Box>
        <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.grey05, lineHeight: 20 }}>
          {label}
        </Text>
      </Box>
    </Pressable>
  );

  const renderTask = (label: string, assignees?: ChatUser[]) => (
    <Pressable onPress={onSelectTask} style={{ paddingVertical: 11 }}>
      {({ pressed }: any) => (
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ opacity: pressed ? 0.7 : 1 }}
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 12 }}>
            <Hash size={18} color={theme.colors.secondaryGreen} />
            <Text style={{ fontSize: 15, color: theme.colors.foreground, lineHeight: 20 }}>
              {label}
            </Text>
          </Box>
          {assignees && (
            <Box flexDirection="row" alignItems="center" style={{ marginRight: 2 }}>
              {assignees.map((user, index) => (
                <Box key={index} style={{ marginLeft: index === 0 ? 0 : -10 }}>
                  <ChatAvatar user={user} size={28} />
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Pressable>
  );

  return (
    <Box
      backgroundColor="card"
      borderWidth={1}
      borderColor="border"
      style={{
        position: 'absolute' as any,
        left: 16,
        right: 16,
        bottom: 96,
        zIndex: 20,
        borderRadius: 16,
        overflow: 'hidden',
        ...Platform.select({
          web: { boxShadow: '0 12px 30px rgba(0,0,0,0.14)' } as any,
          default: {
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.14,
            shadowRadius: 20,
          },
        }),
      }}
    >
      <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 18, gap: 8 }}>
        <Box
          flex={1}
          flexDirection="row"
          alignItems="center"
          backgroundColor="grey02"
          style={{ height: 32, borderRadius: 8, paddingHorizontal: 8, gap: 6 }}
        >
          <Box
            width={24}
            height={24}
            borderRadius="6"
            alignItems="center"
            justifyContent="center"
            style={{ backgroundColor: theme.colors.secondaryGreen }}
          >
            <Hash size={16} color={theme.colors.white} />
          </Box>
          <TextInput
            placeholder="Search Tag"
            placeholderTextColor={theme.colors.grey05}
            style={[
              {
                flex: 1,
                color: theme.colors.foreground,
                fontSize: 16,
                height: 32,
                padding: 0,
              },
              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            ]}
          />
        </Box>
        <Pressable onPress={onCancel} style={{ paddingVertical: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen }}>
            Cancel
          </Text>
        </Pressable>
      </Box>

      <Box height={1} backgroundColor="border" />

      <ScrollView style={{ maxHeight: 425 }} showsVerticalScrollIndicator>
        <Box style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14 }}>
          <Text style={{ fontSize: 14, color: theme.colors.grey05, lineHeight: 20, marginBottom: 10 }}>
            All Projects & Tasks
          </Text>
          {renderProject('Project A')}
          {renderTask('Test 1', [{ variant: 'text', initials: 'AS', color: 'secondaryGreen' }])}
          {renderTask('Task abcd', [
            { variant: 'text', initials: 'AS', color: 'secondaryGreen' },
            { variant: 'text', initials: 'DY', color: 'orange' },
          ])}
          {renderProject('Welcome to Tasktag!')}
          {renderTask('Create Your First Task', [{ variant: 'text', initials: 'JS', color: 'orange' }])}
          {renderTask('Invite Contacts', [{ variant: 'text', initials: 'JS', color: 'orange' }])}
          {renderTask('Set a Due Date', [{ variant: 'text', initials: 'JS', color: 'orange' }])}
          {renderTask('Mark All the Tasks as Done', [{ variant: 'text', initials: 'JS', color: 'orange' }])}
        </Box>
      </ScrollView>
    </Box>
  );
}

function AssignTaskConfirm({
  contact,
  onCancel,
  onConfirm,
}: {
  contact: ChatListItem;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="card"
      borderWidth={1}
      borderColor="border"
      style={{
        position: 'absolute' as any,
        left: 20,
        right: 12,
        bottom: 74,
        zIndex: 20,
        borderRadius: 16,
        padding: 16,
        ...Platform.select({
          web: { boxShadow: '0 12px 30px rgba(0,0,0,0.14)' } as any,
          default: {
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.14,
            shadowRadius: 20,
          },
        }),
      }}
    >
      <Text style={{ fontSize: 16, color: theme.colors.foreground, lineHeight: 20, marginBottom: 8 }}>
        Assign to Task
      </Text>

      <Box
        alignSelf="flex-start"
        flexDirection="row"
        alignItems="center"
        style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4, gap: 4, marginBottom: 8 }}
      >
        <Folder size={14} color={theme.colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.white, lineHeight: 16 }}>
          Project A
        </Text>
      </Box>

      <Box
        alignSelf="flex-start"
        flexDirection="row"
        alignItems="center"
        style={{ backgroundColor: theme.colors.black, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 4, gap: 4, marginBottom: 20 }}
      >
        <Hash size={14} color={theme.colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.white, lineHeight: 16 }}>
          Test 1
        </Text>
      </Box>

      <Box style={{ marginBottom: 12 }}>
        <ChatAvatar user={contact.user} size={52} />
        <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 20, marginTop: 8 }}>
          {contact.name}
        </Text>
      </Box>

      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="grey02"
        style={{ height: 40, borderRadius: 8, paddingHorizontal: 12, gap: 8, marginBottom: 24 }}
      >
        <Users size={20} color={theme.colors.secondaryGreen} />
        <Text style={{ fontSize: 16, color: theme.colors.grey05 }}>
          Search Chat Members
        </Text>
      </Box>

      <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground, lineHeight: 20, marginBottom: 12 }}>
        Chat Members (2)
      </Text>

      <Box style={{ gap: 16, marginBottom: 44 }}>
        <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
          <Box
            width={20}
            height={20}
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
            style={{ backgroundColor: theme.colors.secondaryGreen, opacity: 0.55 }}
          >
            <Check size={14} color={theme.colors.white} />
          </Box>
          <ChatAvatar user={contact.user} size={24} />
          <Box flex={1}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground, lineHeight: 20 }}>
              {contact.name}
            </Text>
            <Text style={{ fontSize: 15, color: theme.colors.grey05, lineHeight: 20 }}>
              alexsmith@gmail.com
            </Text>
          </Box>
        </Box>

        <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
          <Circle size={20} color={theme.colors.grey04} />
          <ChatAvatar user={{ variant: 'text', initials: 'JS', color: 'orange' }} size={24} />
          <Box flex={1}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground, lineHeight: 20 }}>
              Johan Smith
            </Text>
            <Text style={{ fontSize: 15, color: theme.colors.grey05, lineHeight: 20 }}>
              juriteta@denipl.com
            </Text>
          </Box>
        </Box>
      </Box>

      <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            height: 32,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: theme.colors.black,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>
            cancel
          </Text>
        </Pressable>
        <Pressable
          onPress={onConfirm}
          style={{
            flex: 1,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.colors.black,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.white }}>
            Confirm
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}

function RoomView({
  contact,
  onBack,
  onClose,
  showMemberJoinedCard = false,
}: {
  contact: ChatListItem;
  onBack: () => void;
  onClose: () => void;
  showMemberJoinedCard?: boolean;
}) {
  const theme = useTheme<Theme>();
  const [assignTaskView, setAssignTaskView] = useState<'none' | 'picker' | 'confirm'>('none');

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

        {showMemberJoinedCard ? (
          <Box style={{ marginBottom: 16 }}>
            <Box flexDirection="row" gap="12" alignItems="flex-start">
              <ChatAvatar user={contact.user} size={56} />
              <Box flex={1}>
                <Box
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: theme.colors.grey02,
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.foreground, lineHeight: 16 }}>
                    MEMBER JOINED
                  </Text>
                </Box>
                <Text style={{ fontSize: 20, fontWeight: '700', color: theme.colors.foreground, lineHeight: 28, marginBottom: 8 }}>
                  {contact.name} joined the project
                </Text>
                <Text style={{ fontSize: 16, color: theme.colors.textSecondary, lineHeight: 24, marginBottom: 24 }}>
                  {contact.name} is now part of Riverside Painting and ready to collaborate.
                </Text>
                <Pressable
                  onPress={() => setAssignTaskView('picker')}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: theme.colors.black,
                    borderRadius: 8,
                    paddingHorizontal: 24,
                    paddingVertical: 14,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.white, lineHeight: 20 }}>
                    Assign task
                  </Text>
                </Pressable>
              </Box>
            </Box>
          </Box>
        ) : messages.map((msg) => (
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

      {assignTaskView === 'picker' && (
        <AssignTaskPicker
          onCancel={() => setAssignTaskView('none')}
          onSelectTask={() => setAssignTaskView('confirm')}
        />
      )}

      {assignTaskView === 'confirm' && (
        <AssignTaskConfirm
          contact={contact}
          onCancel={() => setAssignTaskView('picker')}
          onConfirm={() => setAssignTaskView('none')}
        />
      )}

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
  openContactId,
  openContactSignal = 0,
  showMemberJoinedCard = false,
}: ChatPanelCompositeProps) {
  // Resolve list items: explicit prop > variant preset
  const resolvedItems = listItems ?? (
    variant === 'with-member' ? LIST_ITEMS_WITH_MEMBER : LIST_ITEMS_WITHOUT_MEMBER
  );
  const [view, setView] = useState<ChatView>(defaultView);
  const [activeContact, setActiveContact] = useState<ChatListItem | null>(null);

  useEffect(() => {
    if (!openContactId || openContactSignal === 0) return;
    const contact = resolvedItems.find((item) => item.id === openContactId);
    if (!contact) return;
    setActiveContact(contact);
    setView('room');
  }, [openContactId, openContactSignal, resolvedItems]);

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
          showMemberJoinedCard={showMemberJoinedCard && activeContact.id === 'alex-smith'}
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
    id: 'alex-smith',
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
