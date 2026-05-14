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
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { Toast } from '@/components/Toast';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Check,
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
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
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
  showAssignTooltip?: boolean;
  onAssignTooltipDismiss?: () => void;
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

const OWNER_AVATAR: ChatUser = { variant: 'photo', src: require('@/assets/images/sample-three.jpg') };

type PickerItem =
  | { type: 'project'; label: string }
  | { type: 'task'; label: string; assignees: ChatUser[] };

const PICKER_ITEMS: PickerItem[] = [
  { type: 'project', label: 'LA Avenue 34 G' },
  { type: 'task', label: 'Fix the sink', assignees: [OWNER_AVATAR] },
  { type: 'project', label: 'Welcome to Tasktag! 🎉' },
  { type: 'task', label: 'Create Your First Task', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Invite Contacts', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Set a Due Date', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Mark All the Tasks as Done', assignees: [OWNER_AVATAR] },
];

function AssignTaskPicker({
  onCancel,
  onSelectTask,
}: {
  onCancel: () => void;
  onSelectTask: () => void;
}) {
  const theme = useTheme<Theme>();
  const [query, setQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSelectTask = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 60,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 160,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => onSelectTask());
  };

  const filtered: PickerItem[] = query.trim()
    ? (() => {
        const result: PickerItem[] = [];
        let pendingProject: PickerItem | null = null;
        for (const item of PICKER_ITEMS) {
          if (item.type === 'project') {
            pendingProject = item;
          } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
            if (pendingProject) { result.push(pendingProject); pendingProject = null; }
            result.push(item);
          }
        }
        return result;
      })()
    : PICKER_ITEMS;

  return (
    <Animated.View
      style={{
        position: 'absolute' as any,
        left: 16,
        right: 16,
        bottom: 96,
        zIndex: 20,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
    <Box
      backgroundColor="card"
      borderWidth={1}
      borderColor="border"
      style={{
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
      {/* Search row */}
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
            value={query}
            onChangeText={setQuery}
            placeholder="Search Task"
            placeholderTextColor={theme.colors.grey05}
            style={[
              { flex: 1, color: theme.colors.foreground, fontSize: 16, height: 32, padding: 0 },
              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            ]}
          />
        </Box>
        <Pressable onPress={onCancel} style={{ paddingVertical: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen }}>Cancel</Text>
        </Pressable>
      </Box>

      <Box height={1} backgroundColor="border" />

      <ScrollView style={{ maxHeight: 425 }} showsVerticalScrollIndicator={false}>
        <Box style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14 }}>
          <Text style={{ fontSize: 14, color: theme.colors.grey05, lineHeight: 20, marginBottom: 10 }}>
            All Projects &amp; Tasks
          </Text>
          {filtered.map((item, idx) =>
            item.type === 'project' ? (
              <Box key={idx} flexDirection="row" alignItems="center" style={{ paddingVertical: 10, gap: 8 }}>
                <Box
                  width={24}
                  height={24}
                  borderRadius="6"
                  alignItems="center"
                  justifyContent="center"
                  style={{ backgroundColor: theme.colors.secondaryGreen }}
                >
                  <Folder size={14} color={theme.colors.white} />
                </Box>
                <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.foreground, lineHeight: 20 }}>
                  {item.label}
                </Text>
              </Box>
            ) : (
              <Pressable key={idx} onPress={handleSelectTask} style={{ paddingVertical: 11 }}>
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
                        {item.label}
                      </Text>
                    </Box>
                    <Box flexDirection="row" alignItems="center" style={{ marginRight: 2 }}>
                      {item.assignees.map((user, i) => (
                        <Box key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                          <ChatAvatar user={user} size={28} />
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )}
              </Pressable>
            )
          )}
        </Box>
      </ScrollView>
    </Box>
    </Animated.View>
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
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([contact.id]);

  const MEMBERS = [
    { id: 'savannah', name: 'Savannah Nguyen', email: 'savannahnguyen@gmail.com', avatarType: 'photo' as const },
    { id: contact.id, name: contact.name, email: 'alexsmith@gmail.com', avatarType: 'contact' as const },
  ];

  const toggle = (id: string) =>
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const selectedMembers = MEMBERS.filter(m => selectedIds.includes(m.id));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute' as any,
        left: 16,
        right: 16,
        bottom: 96,
        zIndex: 30,
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <Box
        backgroundColor="card"
        borderWidth={1}
        borderColor="border"
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          ...Platform.select({
            web: { boxShadow: '0 12px 30px rgba(0,0,0,0.14)' } as any,
            default: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.14, shadowRadius: 20 },
          }),
        }}
      >
        {/* Header */}
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
          <Box flex={1} style={{ gap: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.foreground }}>
              Assign to Task
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.secondaryGreen }}>
              #Fix the sink
            </Text>
          </Box>
          <Pressable onPress={onCancel} hitSlop={8}>
            <X size={20} color={theme.colors.foreground} />
          </Pressable>
        </Box>

        {/* Search row — matches AssignTaskPicker */}
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingBottom: 14, gap: 8 }}>
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
              <Users size={14} color={theme.colors.white} />
            </Box>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search members"
              placeholderTextColor={theme.colors.grey05}
              style={[
                { flex: 1, color: theme.colors.foreground, fontSize: 14, height: 32, padding: 0 },
                Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
              ]}
            />
          </Box>
        </Box>

        {/* Divider below search */}
        <Box height={1} backgroundColor="border" />

        <ScrollView style={{ maxHeight: 425 }} showsVerticalScrollIndicator={false}>
          <Box style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, gap: 18 }}>

            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <Box style={{ gap: 10 }}>
                <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>
                    Selected Member
                  </Text>
                  <Box
                    width={20}
                    height={20}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    style={{ backgroundColor: theme.colors.grey02, borderWidth: 1, borderColor: theme.colors.grey03 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.foreground }}>{selectedMembers.length}</Text>
                  </Box>
                </Box>

                <Box flexDirection="row" style={{ gap: 12 }}>
                  {selectedMembers.map(m => (
                    <Box key={m.id} alignItems="center" style={{ gap: 4 }}>
                      <Box style={{ position: 'relative' as any }}>
                        {m.avatarType === 'photo' ? (
                          <Image
                            source={require('@/assets/images/sample-three.jpg')}
                            style={{ width: 44, height: 44, borderRadius: 22 }}
                          />
                        ) : (
                          <ChatAvatar user={contact.user} size={44} />
                        )}
                        <Pressable
                          onPress={() => toggle(m.id)}
                          style={{
                            position: 'absolute' as any,
                            top: -2,
                            right: -2,
                            width: 16,
                            height: 16,
                            borderRadius: 8,
                            backgroundColor: theme.colors.grey05,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <X size={9} color={theme.colors.foreground} strokeWidth={2.5} />
                        </Pressable>
                      </Box>
                      <Text style={{ fontSize: 11, color: theme.colors.foreground, maxWidth: 52 }} numberOfLines={1}>
                        {m.name.split(' ')[0]}
                      </Text>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* Chat Members */}
            <Box style={{ gap: 8 }}>
              <Box style={{ gap: 2 }}>
                <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>
                    Chat Members
                  </Text>
                  <Box
                    width={20}
                    height={20}
                    borderRadius="full"
                    alignItems="center"
                    justifyContent="center"
                    style={{ backgroundColor: theme.colors.grey02, borderWidth: 1, borderColor: theme.colors.grey03 }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.foreground }}>{MEMBERS.length}</Text>
                  </Box>
                </Box>
                <Text style={{ fontSize: 13, color: theme.colors.grey05, marginTop: 2 }}>Choose the member first</Text>
              </Box>

              {MEMBERS.map(m => {
                const isSelected = selectedIds.includes(m.id);
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => toggle(m.id)}
                    style={({ hovered }: any) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                    })}
                  >
                    {m.avatarType === 'photo' ? (
                      <Image
                        source={require('@/assets/images/sample-three.jpg')}
                        style={{ width: 36, height: 36, borderRadius: 18, flexShrink: 0 }}
                      />
                    ) : (
                      <ChatAvatar user={contact.user} size={36} />
                    )}
                    <Box flex={1}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground, lineHeight: 19 }}>
                        {m.name}
                      </Text>
                      <Text style={{ fontSize: 12, color: theme.colors.grey05 }}>
                        {m.email}
                      </Text>
                    </Box>
                    <Box
                      width={26}
                      height={26}
                      borderRadius="full"
                      alignItems="center"
                      justifyContent="center"
                      style={{ backgroundColor: isSelected ? theme.colors.secondaryGreen : theme.colors.grey02 }}
                    >
                      <Check size={13} color={isSelected ? theme.colors.white : theme.colors.grey04} strokeWidth={2.5} />
                    </Box>
                  </Pressable>
                );
              })}
            </Box>
          </Box>
        </ScrollView>

        {/* Footer */}
        <Box
          flexDirection="row"
          style={{ gap: 16, paddingHorizontal: 16, paddingVertical: 14 }}
        >
          <Pressable
            onPress={onCancel}
            style={({ hovered }: any) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: theme.colors.foreground,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={onConfirm}
            style={({ hovered }: any) => ({
              flex: 1,
              height: 44,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: hovered ? '#1E293B' : theme.colors.black,
            })}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.white }}>Confirm</Text>
          </Pressable>
        </Box>
      </Box>
    </Animated.View>
  );
}

function RoomView({
  contact,
  onBack,
  onClose,
  showMemberJoinedCard = false,
  showAssignTooltip = false,
  onAssignTooltipDismiss,
}: {
  contact: ChatListItem;
  onBack: () => void;
  onClose: () => void;
  showMemberJoinedCard?: boolean;
  showAssignTooltip?: boolean;
  onAssignTooltipDismiss?: () => void;
}) {
  const theme = useTheme<Theme>();
  const [assignTaskView, setAssignTaskView] = useState<'none' | 'picker' | 'confirm' | 'assigned'>('none');
  const [showAssignedToast, setShowAssignedToast] = useState(false);
  const tooltipFadeAnim = useRef(new Animated.Value(1)).current;

  const handleAssignPress = () => {
    Animated.timing(tooltipFadeAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      onAssignTooltipDismiss?.();
      tooltipFadeAnim.setValue(1);
      setAssignTaskView('picker');
    });
  };

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
          paddingTop: 20,
          paddingBottom: 0,
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
          <Box style={{ marginBottom: 0 }}>
            {/* Header row vertically centering Avatar and Sender Name + Time */}
            <Box flexDirection="row" alignItems="center" style={{ gap: 12, marginBottom: 2 }}>
              <ChatAvatar user={contact.user} size={40} />
              <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                  {contact.name}
                </Text>
                <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>
                  12:25 PM
                </Text>
              </Box>
            </Box>

            {/* Outer white background wrapping the card contents */}
            <Box
              backgroundColor="card"
              style={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 16,
                borderBottomRightRadius: 16,
                borderBottomLeftRadius: 16,
                padding: 12,
                marginLeft: 52, // Align with text column (avatar width 40 + gap 12)
                alignSelf: 'stretch',
              }}
            >
              {/* Inner bordered card */}
              <Box
                borderWidth={1}
                borderColor="border"
                style={{
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 16,
                  backgroundColor: theme.colors.white,
                }}
              >
                <Box
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: theme.colors.lightMint,
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    marginBottom: 16,
                  }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: theme.colors.textPrimary, lineHeight: 16 }}>
                    MEMBER JOINED
                  </Text>
                </Box>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground, lineHeight: 24, marginBottom: 4 }}>
                  {contact.name} joined the project
                </Text>
                {assignTaskView === 'assigned' ? (
                  <>
                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 16 }}>
                      Alex is now working on{' '}
                      <Text style={{ fontWeight: '500', color: theme.colors.foreground }}>Fix the sink</Text>
                    </Text>
                    <Box flexDirection="row" style={{ gap: 10 }}>
                      <Pressable
                        style={({ hovered }: any) => ({
                          flex: 1,
                          backgroundColor: hovered ? '#1E293B' : theme.colors.black,
                          borderRadius: 8,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          alignItems: 'center',
                        })}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>View Alex's task</Text>
                      </Pressable>
                      <Pressable
                        style={({ hovered }: any) => ({
                          flex: 1,
                          borderRadius: 8,
                          borderWidth: 1.5,
                          borderColor: theme.colors.foreground,
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          alignItems: 'center',
                          backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                        })}
                      >
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>Assign more</Text>
                      </Pressable>
                    </Box>
                  </>
                ) : (
                  <>
                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 16 }}>
                      Alex is now part of <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>LA Avenue 34 G</Text> and ready to collaborate.
                    </Text>
                    <TooltipOnboarding
                      variant="left-center"
                      tooltipStyle="success"
                      title="Put someone on it"
                      description="Click the assign button to assign tasks to your project members."
                      open={showAssignTooltip}
                      forceShow={showAssignTooltip}
                      offset={20}
                      animatedOpacity={tooltipFadeAnim}
                    >
                      <Pressable
                        onPress={handleAssignPress}
                        style={{
                          alignSelf: 'flex-start',
                          backgroundColor: theme.colors.black,
                          borderRadius: 8,
                          paddingHorizontal: 24,
                          paddingVertical: 16,
                        }}
                      >
                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.white, lineHeight: 20 }}>
                          Assign a task
                        </Text>
                      </Pressable>
                    </TooltipOnboarding>
                  </>
                )}
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
          onConfirm={() => {
            setAssignTaskView('assigned');
            setShowAssignedToast(true);
          }}
        />
      )}

      {showAssignedToast && (
        <Toast
          visible={showAssignedToast}
          title="Member Assigned"
          caption="Alex Smith has been assigned to Fix the sink."
          variant="title-caption"
          type="success"
          onDismiss={() => setShowAssignedToast(false)}
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
  showAssignTooltip = false,
  onAssignTooltipDismiss,
}: ChatPanelCompositeProps) {
  // Resolve list items: explicit prop > variant preset
  const resolvedItems = listItems ?? (
    variant === 'with-member' ? LIST_ITEMS_WITH_MEMBER : LIST_ITEMS_WITHOUT_MEMBER
  );
  const [view, setView] = useState<ChatView>(defaultView);
  const [activeContact, setActiveContact] = useState<ChatListItem | null>(null);

  useLayoutEffect(() => {
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
          onClose={() => setView('list')}
          showMemberJoinedCard={showMemberJoinedCard || activeContact.id === 'alex-smith'}
          showAssignTooltip={showAssignTooltip}
          onAssignTooltipDismiss={onAssignTooltipDismiss}
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
    user: { variant: 'text', initials: 'AS', color: 'darkGreen' },
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
