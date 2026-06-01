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
import { Toast } from '@/components/Toast';
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Building,
  Camera,
  Check,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Folder,
  Hash,
  Home,
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
  View,
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
 * 'with-member'    → Tasktag Helpdesk + Carlos Smith (2 items)
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

// TODO (backend): replace with authenticated user from auth context (e.g. useAuth().currentUser)
const CURRENT_USER = {
  name: 'Maria Jose',
  avatarSrc: require('@/assets/images/mj.png') as ImageSourcePropType,
};

const OWNER_AVATAR: ChatUser = { variant: 'photo', src: CURRENT_USER.avatarSrc };
const CARLOS_AVATAR: ChatUser = { variant: 'text', initials: 'CS', color: 'darkGreen' };

type PickerItem =
  | { type: 'project'; label: string; assignees?: ChatUser[]; icon?: React.ComponentType<any>; iconBg?: string }
  | { type: 'task'; label: string; assignees: ChatUser[] };

// TODO (backend): replace with API — GET /projects/:id/tasks, include assignees per task
const PICKER_ITEMS: PickerItem[] = [
  { type: 'project', label: 'LA Avenue 34 G', icon: Building, iconBg: '#18a87d' },
  { type: 'task', label: 'Fix the sink', assignees: [OWNER_AVATAR] },
  { type: 'project', label: 'Welcome to Tasktag! 🎉', icon: Home, iconBg: '#8b5cf6' },
  { type: 'task', label: 'Create Your First Task', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Invite Contacts', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Set a Due Date', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Mark All the Tasks as Done', assignees: [OWNER_AVATAR] },
];

// TODO (backend): will be derived from API — assignees updated automatically once assignment is persisted.
const PICKER_ITEMS_AFTER_ASSIGN: PickerItem[] = PICKER_ITEMS.map(item =>
  (item.label === 'LA Avenue 34 G' || item.label === 'Fix the sink')
    ? { ...item, assignees: [OWNER_AVATAR, CARLOS_AVATAR] }
    : item
);

// TODO (backend): replace with API — GET /projects/:id/tasks, include assignees per task
const TAG_PICKER_ITEMS: PickerItem[] = [
  { type: 'project', label: 'LA Avenue 34 G', icon: Building, iconBg: '#18a87d' },
  { type: 'task', label: 'Fix the sink', assignees: [OWNER_AVATAR] },
  { type: 'project', label: 'Welcome to Tasktag! 🎉', icon: Home, iconBg: '#8b5cf6' },
  { type: 'task', label: 'Create Your First Task', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Invite Contacts', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Set a Due Date', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Mark All the Tasks as Done', assignees: [OWNER_AVATAR] },
  { type: 'task', label: 'Archive the Projects', assignees: [OWNER_AVATAR] },
];

// Reflects the state after Carlos Smith is assigned to "Fix the sink" in the same session.
// TODO (backend): this will be handled automatically once assignees come from the API.
const TAG_PICKER_ITEMS_AFTER_ASSIGN: PickerItem[] = TAG_PICKER_ITEMS.map(item =>
  item.type === 'task' && item.label === 'Fix the sink'
    ? { ...item, assignees: [OWNER_AVATAR, CARLOS_AVATAR] }
    : item
);

function AssignTaskPicker({
  onCancel,
  onSelectTask,
  exiting = false,
  onExitComplete,
  items = PICKER_ITEMS,
  initialProjectFilter,
}: {
  onCancel: () => void;
  onSelectTask: (task: string) => void;
  exiting?: boolean;
  onExitComplete?: () => void;
  items?: PickerItem[];
  initialProjectFilter?: string;
}) {
  const theme = useTheme<Theme>();
  const [query, setQuery] = useState('');
  const [projectFilter, setProjectFilter] = useState(initialProjectFilter ?? '');
  const isProjectFiltered = !!projectFilter;
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

  useEffect(() => {
    if (!exiting) return;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => onExitComplete?.());
  }, [exiting]);

  const filtered: PickerItem[] = isProjectFiltered
    ? (() => {
        const result: PickerItem[] = [];
        let inMatch = false;
        for (const item of items) {
          if (item.type === 'project') {
            inMatch = item.label === projectFilter;
            if (inMatch) result.push(item);
          } else if (inMatch) {
            result.push(item);
          }
        }
        return result;
      })()
    : query.trim()
      ? (() => {
          const result: PickerItem[] = [];
          let pendingProject: PickerItem | null = null;
          for (const item of items) {
            if (item.type === 'project') {
              pendingProject = item;
            } else if (item.label.toLowerCase().includes(query.toLowerCase())) {
              if (pendingProject) { result.push(pendingProject); pendingProject = null; }
              result.push(item);
            }
          }
          return result;
        })()
      : items;

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
            style={{ borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, gap: 6 }}
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
            {isProjectFiltered ? (
              <>
                <Text style={{ flex: 1, color: theme.colors.foreground, fontSize: 16, padding: 0 }}>
                  {projectFilter}
                </Text>
                <Pressable onPress={() => setProjectFilter('')} hitSlop={8}>
                  <X size={16} color={theme.colors.grey05} />
                </Pressable>
              </>
            ) : (
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Search Task"
                placeholderTextColor={theme.colors.grey05}
                autoFocus
                style={[
                  { flex: 1, color: theme.colors.foreground, fontSize: 16, padding: 0 },
                  Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                ]}
              />
            )}
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
                <Box key={idx} flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingVertical: 10, gap: 8 }}>
                  <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
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
                  {item.assignees && item.assignees.length > 0 && (
                    <Box flexDirection="row" alignItems="center" style={{ marginRight: 2 }}>
                      {item.assignees.map((user, i) => (
                        <Box key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}>
                          <ChatAvatar user={user} size={28} />
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ) : (
                <Pressable key={idx} onPress={() => onSelectTask(item.label)} style={{ paddingVertical: 11 }}>
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
  taskName,
  onCancel,
  onConfirm,
}: {
  contact: ChatListItem;
  taskName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const theme = useTheme<Theme>();
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [query, setQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([contact.id]);

  // TODO (backend): fetch project members from API — GET /projects/:id/members
  const MEMBERS = [
    { id: 'maria-jose', name: 'Maria Jose', email: 'mariajose@gmail.com', avatarType: 'photo' as const },
    { id: contact.id, name: contact.name, email: 'carlossmith@gmail.com', avatarType: 'contact' as const },
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
              #{taskName}
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
            style={{ borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, gap: 6 }}
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
                { flex: 1, color: theme.colors.foreground, fontSize: 14, padding: 0 },
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
                            source={require('@/assets/images/mj.png')}
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
                            backgroundColor: theme.colors.grey02,
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
                // TODO (backend): use currentUser.id — the project owner cannot be removed
                const isDisabled = m.id === 'maria-jose';
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => !isDisabled && toggle(m.id)}
                    style={({ hovered }: any) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: !isDisabled && hovered ? theme.colors.grey01 : 'transparent',
                    })}
                  >
                    {({ hovered }: any) => (
                      <>
                        {m.avatarType === 'photo' ? (
                          <Image
                            source={require('@/assets/images/mj.png')}
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
                        {isDisabled ? (
                          <Box
                            width={26}
                            height={26}
                            borderRadius="full"
                            alignItems="center"
                            justifyContent="center"
                            style={{ backgroundColor: theme.colors.grey03 }}
                          >
                            <Check size={13} color={theme.colors.grey05} strokeWidth={2.5} />
                          </Box>
                        ) : isSelected ? (
                          <Box
                            width={26}
                            height={26}
                            borderRadius="full"
                            alignItems="center"
                            justifyContent="center"
                            style={{ backgroundColor: theme.colors.secondaryGreen }}
                          >
                            <Check size={13} color={theme.colors.white} strokeWidth={2.5} />
                          </Box>
                        ) : (
                          <Box
                            width={26}
                            height={26}
                            borderRadius="full"
                            alignItems="center"
                            justifyContent="center"
                            style={{ borderWidth: 1.5, borderColor: theme.colors.grey03, backgroundColor: 'transparent' }}
                          >
                            {hovered && <Check size={13} color={theme.colors.grey05} strokeWidth={2.5} />}
                          </Box>
                        )}
                      </>
                    )}
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

function TagPicker({
  onCancel,
  onSelectTask,
  items = TAG_PICKER_ITEMS,
}: {
  onCancel: () => void;
  onSelectTask: (project: string, task: string) => void;
  items?: PickerItem[];
}) {
  const theme = useTheme<Theme>();
  const [query, setQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(60)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, []);

  type TagItem = PickerItem & { parentProject?: string };
  const buildFiltered = (source: PickerItem[]): TagItem[] => {
    let cur = '';
    return source.map(item => {
      if (item.type === 'project') { cur = item.label; return item; }
      return { ...item, parentProject: cur };
    });
  };

  const filtered: TagItem[] = buildFiltered(
    query.trim()
      ? (() => {
        const result: PickerItem[] = [];
        let pending: PickerItem | null = null;
        for (const item of items) {
          if (item.type === 'project') { pending = item; }
          else if (item.label.toLowerCase().includes(query.toLowerCase())) {
            if (pending) { result.push(pending); pending = null; }
            result.push(item);
          }
        }
        return result;
      })()
      : items
  );

  return (
    <Animated.View style={{ position: 'absolute' as any, left: 16, right: 16, bottom: 96, zIndex: 25, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 16, overflow: 'hidden', ...Platform.select({ web: { boxShadow: '0 12px 30px rgba(0,0,0,0.14)' } as any, default: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.14, shadowRadius: 20 } }) }}>
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 18, gap: 8 }}>
          <Box flex={1} flexDirection="row" alignItems="center" backgroundColor="grey02" style={{ borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8, gap: 6 }}>
            <Box width={24} height={24} borderRadius="6" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.secondaryGreen }}>
              <Hash size={16} color={theme.colors.white} />
            </Box>
            <TextInput value={query} onChangeText={setQuery} placeholder="Search Tag" placeholderTextColor={theme.colors.grey05} style={[{ flex: 1, color: theme.colors.foreground, fontSize: 16, padding: 0 }, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]} />
          </Box>
          <Pressable onPress={onCancel} style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen }}>Cancel</Text>
          </Pressable>
        </Box>
        <Box height={1} backgroundColor="border" />
        <ScrollView style={{ maxHeight: 425 }} showsVerticalScrollIndicator={false}>
          <Box style={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 14 }}>
            <Text style={{ fontSize: 14, color: theme.colors.grey05, lineHeight: 20, marginBottom: 10 }}>All Projects &amp; Tasks</Text>
            {filtered.map((item, idx) =>
              item.type === 'project' ? (
                <Box key={idx} flexDirection="row" alignItems="center" style={{ paddingVertical: 10, gap: 8 }}>
                  <Box width={24} height={24} borderRadius="6" alignItems="center" justifyContent="center" style={{ backgroundColor: item.iconBg ?? theme.colors.foreground }}>
                    {item.icon
                      ? <item.icon size={14} color="#ffffff" />
                      : <Text style={{ fontSize: 9, fontWeight: '800', color: theme.colors.white, letterSpacing: -0.5 }}>tt</Text>
                    }
                  </Box>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.foreground, lineHeight: 20 }}>{item.label}</Text>
                </Box>
              ) : (
                <Pressable key={idx} onPress={() => onSelectTask((item as TagItem).parentProject ?? '', item.label)} style={{ paddingVertical: 11 }}>
                  {({ pressed }: any) => (
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ opacity: pressed ? 0.7 : 1 }}>
                      <Box flexDirection="row" alignItems="center" style={{ gap: 12 }}>
                        <Hash size={18} color={theme.colors.secondaryGreen} />
                        <Text style={{ fontSize: 15, color: theme.colors.foreground, lineHeight: 20 }}>{item.label}</Text>
                      </Box>
                      <Box flexDirection="row" alignItems="center" style={{ marginRight: 2 }}>
                        {item.assignees.map((user, i) => (
                          <Box key={i} style={{ marginLeft: i === 0 ? 0 : -8 }}><ChatAvatar user={user} size={28} /></Box>
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

  // ── Assign-task flow ──────────────────────────────────────────────────────
  // none → picker → confirm → assigned
  const [assignTaskView, setAssignTaskView] = useState<'none' | 'picker' | 'confirm' | 'assigned'>('none');
  // Tracks whether Carlos has been assigned this session; used to show his avatar in TagPicker.
  // TODO (backend): derive from task assignees API instead of local state.
  const [wasAssigned, setWasAssigned] = useState(false);
  const [pickerExiting, setPickerExiting] = useState(false);
  const [showAssignedToast, setShowAssignedToast] = useState(false);
  const [selectedTask, setSelectedTask] = useState('');

  // ── Chat input ────────────────────────────────────────────────────────────
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [sentMessages, setSentMessages] = useState<Array<{ id: string; text: string; time: string; taggedProject?: string; taggedTask?: string }>>([]);
  const textInputRef = useRef<any>(null);
  const scrollViewRef = useRef<any>(null);

  // ── Onboarding tooltips ───────────────────────────────────────────────────
  // "Start a Conversation" tooltip — appears after assign toast, fades when user types
  const [showStartConvTooltip, setShowStartConvTooltip] = useState(false);
  const startConvFadeAnim = useRef(new Animated.Value(1)).current;
  const fadeTimerRef = useRef<any>(null);

  // "Tag this message" nudge — appears after first message is sent
  const [showTagNudge, setShowTagNudge] = useState(false);
  const nudgeEnterAnim = useRef(new Animated.Value(0)).current;
  const [showFirstMsgSuccess, setShowFirstMsgSuccess] = useState(false);
  const firstMsgFadeAnim = useRef(new Animated.Value(1)).current;

  // Tag-it onboarding flow:
  //   none     — not started
  //   tooltip1 — Step 1/3 "Tag It" balloon visible above # button
  //   picker   — Step 2/3 tag picker open, "Project vs Task" balloon visible
  //   tagged   — Step 3/3 tag applied, "Smart Tags" balloon visible until user types
  const [tagFlow, setTagFlow] = useState<'none' | 'tooltip1' | 'picker' | 'tagged'>('none');
  const [taggedProject, setTaggedProject] = useState('');
  const [taggedTask, setTaggedTask] = useState('');
  const tagFadeAnim = useRef(new Animated.Value(1)).current;

  // "Put someone on it" assign tooltip (controlled by parent via showAssignTooltip prop)
  const tooltipFadeAnim = useRef(new Animated.Value(1)).current;

  // "Smart Tags" tooltip — shown when tagFlow reaches 'tagged', fades on typing
  const [showSmartTagsTooltip, setShowSmartTagsTooltip] = useState(false);
  const smartTagsFadeAnim = useRef(new Animated.Value(0)).current;
  const smartTagsFadeTimerRef = useRef<any>(null);

  // "First tag complete!" — shown after first tagged message is sent, fades after 3s
  const [showFirstTagSuccess, setShowFirstTagSuccess] = useState(false);
  const firstTagFadeAnim = useRef(new Animated.Value(1)).current;
  const [firstTagMessageIdx, setFirstTagMessageIdx] = useState(-1);

  // "Get a site photo" nudge — appears after first message success fades
  const [showPhotoNudge, setShowPhotoNudge] = useState(false);
  const photoNudgeAnim = useRef(new Animated.Value(0)).current;

  // "Everything's connected" tooltip — appears when user taps a chip in a sent message
  const [showChipTooltip, setShowChipTooltip] = useState(false);
  const chipTooltipFadeAnim = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    const t = setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 200);
    return () => clearTimeout(t);
  }, [sentMessages.length, showTagNudge, showPhotoNudge]);

  const pulseAnim = useRef(new Animated.Value(0)).current;
  const pulseActiveRef = useRef(false);

  const runPulse = () => {
    if (!pulseActiveRef.current) return;
    pulseAnim.setValue(0);
    Animated.timing(pulseAnim, {
      toValue: 1,
      duration: 1100,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished && pulseActiveRef.current) runPulse();
    });
  };

  useEffect(() => {
    if (showTagNudge) {
      nudgeEnterAnim.setValue(0);
      Animated.timing(nudgeEnterAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      pulseActiveRef.current = true;
      runPulse();
    } else {
      pulseActiveRef.current = false;
      pulseAnim.stopAnimation();
      pulseAnim.setValue(0);
    }
  }, [showTagNudge]);

  useEffect(() => {
    if (showStartConvTooltip) {
      startConvFadeAnim.setValue(1);
      const t = setTimeout(() => textInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
  }, [showStartConvTooltip]);

  useEffect(() => {
    if (tagFlow === 'tagged') {
      setShowSmartTagsTooltip(true);
      smartTagsFadeAnim.setValue(0);
      Animated.timing(smartTagsFadeAnim, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      const t = setTimeout(() => textInputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    } else {
      if (smartTagsFadeTimerRef.current) {
        clearTimeout(smartTagsFadeTimerRef.current);
        smartTagsFadeTimerRef.current = null;
      }
    }
  }, [tagFlow]);

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

  const handleHashClick = () => {
    Animated.timing(nudgeEnterAnim, {
      toValue: 0,
      duration: 280,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      setShowTagNudge(false);
      setTagFlow('picker');
    });
  };

  // TODO (backend): fetch conversation history — GET /conversations/:id/messages
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
        ref={scrollViewRef}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 16,
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
                  {assignTaskView === 'assigned' ? `${contact.name} has been assigned a task` : `${contact.name} joined the project`}
                </Text>
                {assignTaskView === 'assigned' ? (
                  <>
                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary, lineHeight: 20, marginBottom: 16 }}>
                      Carlos is now working on{' '}
                      <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>{selectedTask}</Text>
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
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>View task</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => setAssignTaskView('picker')}
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
                      Carlos is now part of <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>LA Avenue 34 G</Text> and ready to collaborate.
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
                  style={{ borderRadius: 8, borderTopLeftRadius: 0, paddingHorizontal: 12, paddingVertical: 10, alignSelf: 'flex-start' }}
                >
                  <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 20 }}>
                    {msg.text}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}

        {/* Sent messages */}
        {sentMessages.map((msg, idx) => (
          <Box key={msg.id} style={{ marginTop: 16 }}>
            <Box flexDirection="row" alignItems="center" style={{ gap: 10, marginBottom: 6 }}>
              <Image
                source={CURRENT_USER.avatarSrc}
                style={{ width: 40, height: 40, borderRadius: 20, flexShrink: 0 }}
              />
              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{CURRENT_USER.name}</Text>
              <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>{msg.time}</Text>
            </Box>
            <Box flexDirection="row" alignItems="flex-end" style={{ paddingLeft: 50, gap: 4 }}>
              <Box style={{ borderRadius: 8, borderTopLeftRadius: 0, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#EAFBF6', alignSelf: 'flex-start', maxWidth: 320 }}>
                <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 20 }}>{msg.text}</Text>
                {msg.taggedProject && msg.taggedTask && (
                  <Box style={{ marginTop: 8, gap: 8 }}>
                    <TooltipOnboarding
                      variant="left-center"
                      tooltipStyle="success"
                      title="Everything's connected"
                      description="Tapping a chip takes you straight to the project — every task, message and photo tagged to it is there waiting."
                      ctaText="Got it"
                      onCtaPress={() => {
                        Animated.timing(chipTooltipFadeAnim, {
                          toValue: 0,
                          duration: 300,
                          easing: Easing.out(Easing.cubic),
                          useNativeDriver: true,
                        }).start(() => {
                          setShowChipTooltip(false);
                          chipTooltipFadeAnim.setValue(1);
                        });
                      }}
                      open={showChipTooltip}
                      forceShow={showChipTooltip}
                      animatedOpacity={chipTooltipFadeAnim}
                      offset={25}
                    >
                      <Pressable onPress={() => setShowChipTooltip(true)} style={{ alignSelf: 'flex-start' }}>
                        <Box flexDirection="row" alignItems="center" style={{ gap: 4, backgroundColor: theme.colors.secondaryGreen, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 }}>
                          <Folder size={14} color={theme.colors.white} />
                          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>{msg.taggedProject}</Text>
                        </Box>
                      </Pressable>
                    </TooltipOnboarding>
                    <Pressable onPress={() => setShowChipTooltip(true)} style={{ alignSelf: 'flex-start' }}>
                      <Box flexDirection="row" alignItems="center" style={{ gap: 4, backgroundColor: theme.colors.foreground, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 }}>
                        <Hash size={14} color={theme.colors.white} />
                        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>{msg.taggedTask}</Text>
                      </Box>
                    </Pressable>
                  </Box>
                )}
              </Box>
              <Check size={14} color={theme.colors.grey04} strokeWidth={2} />
            </Box>
            {idx === 0 && showFirstMsgSuccess && (
              <Animated.View style={{ opacity: firstMsgFadeAnim, paddingLeft: 50, marginTop: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>
                  {'First message sent! 🎉'}
                </Text>
              </Animated.View>
            )}
            {idx === firstTagMessageIdx && showFirstTagSuccess && (
              <Animated.View style={{ opacity: firstTagFadeAnim, paddingLeft: 50, marginTop: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>
                  {'First tag complete! 🎉'}
                </Text>
              </Animated.View>
            )}
          </Box>
        ))}

        {/* Tag this message nudge */}
        {showTagNudge && (
          <Animated.View
            style={{
              opacity: nudgeEnterAnim,
              transform: [{ translateY: nudgeEnterAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            }}
          >
            <Box
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginTop: 16,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: '#0F172A',
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <Box style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(3,91,96,0.5)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Hash size={24} color={theme.colors.secondaryGreen} strokeWidth={2} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.white, lineHeight: 22, marginBottom: 4 }}>
                  Tag this message
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 17 }}>
                  Tap # below to tag this message so {contact.name} knows exactly which site this is about
                </Text>
              </Box>
            </Box>
          </Animated.View>
        )}

        {/* "Get a site photo" nudge */}
        {showPhotoNudge && (
          <Animated.View
            style={{
              opacity: photoNudgeAnim,
              transform: [{ translateY: photoNudgeAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }],
            }}
          >
            <Box
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginTop: 16,
                marginBottom: 8,
                borderRadius: 12,
                backgroundColor: '#0F172A',
                paddingHorizontal: 16,
                paddingVertical: 16,
              }}
            >
              <Box style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(3,91,96,0.5)', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Camera size={24} color={theme.colors.secondaryGreen} />
              </Box>
              <Box style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: theme.colors.white, lineHeight: 22, marginBottom: 4 }}>
                  Get a site photo
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 17 }}>
                  Ask your crew to send one — it'll be saved to this job automatically
                </Text>
              </Box>
              <Pressable
                onPress={() => {
                  Animated.timing(photoNudgeAnim, {
                    toValue: 0,
                    duration: 220,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                  }).start(() => {
                    setShowPhotoNudge(false);
                    setChatMessage("Can you send a site photo? It'll be saved to the job automatically.");
                    setShowTagNudge(true);
                    setTimeout(() => textInputRef.current?.focus(), 50);
                  });
                }}
                style={({ hovered }: any) => ({
                  backgroundColor: hovered ? '#0d9e6e' : theme.colors.secondaryGreen,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  cursor: 'pointer' as any,
                })}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: theme.colors.white }}>Send</Text>
              </Pressable>
            </Box>
          </Animated.View>
        )}
      </ScrollView>

      {(assignTaskView === 'picker' || pickerExiting) && (
        <AssignTaskPicker
          onCancel={() => setAssignTaskView('none')}
          onSelectTask={(task) => {
            setSelectedTask(task);
            setPickerExiting(true);
            setAssignTaskView('confirm');
          }}
          exiting={pickerExiting}
          onExitComplete={() => setPickerExiting(false)}
          items={wasAssigned ? PICKER_ITEMS_AFTER_ASSIGN : PICKER_ITEMS}
          initialProjectFilter="LA Avenue 34 G"
        />
      )}

      {/* "Tasks start with #" tooltip — appears when assign picker opens */}
      {assignTaskView === 'picker' && !pickerExiting && (
        <Box style={{ position: 'absolute' as any, left: 16, bottom: 110, width: 1, height: 42, zIndex: 25 }}>
          <TooltipOnboarding
            variant="left-center"
            tooltipStyle="success"
            title="Tasks start with #"
            description="Tap a task to assign it to your crew"
            open
            forceShow
            offset={20}
          >
            <Box pointerEvents="none" style={{ width: 1, height: 42 }} />
          </TooltipOnboarding>
        </Box>
      )}

      {assignTaskView === 'confirm' && (
        <AssignTaskConfirm
          contact={contact}
          taskName={selectedTask}
          onCancel={() => setAssignTaskView('picker')}
          onConfirm={() => {
            setWasAssigned(true);
            setAssignTaskView('assigned');
            setShowAssignedToast(true);
          }}
        />
      )}

      {showAssignedToast && (
        <Toast
          visible={showAssignedToast}
          title="Member Assigned"
          caption={`${selectedTask} has been assigned`}
          variant="title-caption"
          type="success"
          onDismiss={() => { setShowAssignedToast(false); setShowStartConvTooltip(true); }}
        />
      )}

      {/* Tag picker (Step 2/3) */}
      {tagFlow === 'picker' && (
        <TagPicker
          onCancel={() => setTagFlow('none')}
          onSelectTask={(project, task) => {
            setTaggedProject(project);
            setTaggedTask(task);
            setTagFlow('tagged');
          }}
          items={wasAssigned ? TAG_PICKER_ITEMS_AFTER_ASSIGN : TAG_PICKER_ITEMS}
        />
      )}

      {/* Left-side tooltip — Project vs Task (always mounted, visibility via forceShow) */}
      <Box style={{ position: 'absolute' as any, left: 16, bottom: 438, width: 1, height: 40, zIndex: 5 }} pointerEvents="none">
        <TooltipOnboarding
          variant="left-center"
          tooltipStyle="success"
          title="Project vs Task"
          description="Projects are shown in Bold Text, while Tasks use the '#' icon."
          open={tagFlow === 'picker'}
          forceShow={tagFlow === 'picker'}
          offset={20}
        >
          <Box pointerEvents="none" style={{ width: 1, height: 40 }} />
        </TooltipOnboarding>
      </Box>

      {/* Left-side tooltip — Smart Tags (always mounted, visibility via forceShow) */}
      <Box style={{ position: 'absolute' as any, left: 16, bottom: 160, width: 1, height: 60, zIndex: 5 }} pointerEvents="none">
        <TooltipOnboarding
          variant="left-center"
          tooltipStyle="success"
          title="Smart Tags"
          description="Nice! You've linked this message to a project and task. Send it and it'll stay connected — no more hunting through chats to find it."
          open={tagFlow === 'tagged' && showSmartTagsTooltip}
          forceShow={tagFlow === 'tagged' && showSmartTagsTooltip}
          offset={20}
          animatedOpacity={smartTagsFadeAnim}
        >
          <Box pointerEvents="none" style={{ width: 1, height: 60 }} />
        </TooltipOnboarding>
      </Box>

      {/* Chat input */}
      <Box style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
        <Box
          backgroundColor="card"
          borderWidth={1}
          style={{
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingTop: 12,
            paddingBottom: 10,
            position: 'relative' as any,
            borderColor: isInputFocused ? theme.colors.foreground : theme.colors.border,
          }}
        >
          {/* Invisible trigger at left edge of TextInput — balloon appears outside-left of panel, arrow points right toward input */}
          <Box style={{ position: 'absolute' as any, left: 0, top: 12, width: 1, height: 36, zIndex: 10 }}>
            <TooltipOnboarding
              variant="left-center"
              tooltipStyle="success"
              title="Start a Conversation"
              description="You can add files, media, and tasks anytime from here."
              open={showStartConvTooltip}
              forceShow={showStartConvTooltip}
              offset={20}
              animatedOpacity={startConvFadeAnim}
            >
              <Box pointerEvents="none" style={{ width: 1, height: 36 }} />
            </TooltipOnboarding>
          </Box>
          {/* Tag pills */}
          {tagFlow === 'tagged' && taggedProject && taggedTask && (
            <Box style={{ backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 8, padding: 8, gap: 4, alignSelf: 'flex-start', marginBottom: 8 }}>
              <Box flexDirection="row" alignItems="center" style={{ gap: 4, backgroundColor: theme.colors.secondaryGreen, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }}>
                <Folder size={14} color={theme.colors.white} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>{taggedProject}</Text>
              </Box>
              <Box flexDirection="row" alignItems="center" style={{ gap: 4, backgroundColor: theme.colors.foreground, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }}>
                <Hash size={14} color={theme.colors.white} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.white }}>{taggedTask}</Text>
              </Box>
            </Box>
          )}
          <TextInput
            ref={textInputRef}
            value={chatMessage}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onChangeText={(text) => {
              setChatMessage(text);
              if (text.length > 0 && showStartConvTooltip && !fadeTimerRef.current) {
                fadeTimerRef.current = setTimeout(() => {
                  Animated.timing(startConvFadeAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                  }).start(() => {
                    setShowStartConvTooltip(false);
                    startConvFadeAnim.setValue(1);
                    fadeTimerRef.current = null;
                  });
                }, 2000);
              }
              if (text.length > 0 && tagFlow === 'tagged' && showSmartTagsTooltip && !smartTagsFadeTimerRef.current) {
                smartTagsFadeTimerRef.current = setTimeout(() => {
                  Animated.timing(smartTagsFadeAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                  }).start(() => {
                    setShowSmartTagsTooltip(false);
                    smartTagsFadeAnim.setValue(0);
                    smartTagsFadeTimerRef.current = null;
                  });
                }, 2000);
              }
            }}
            placeholder="Type message here..."
            placeholderTextColor={theme.colors.grey03}
            multiline
            style={[
              { fontSize: 14, color: theme.colors.foreground, paddingBottom: 16, minHeight: 20 },
              Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
            ]}
          />
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
              {/* Plus */}
              <Pressable style={({ hovered }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
                <Plus size={20} color={theme.colors.grey06} />
              </Pressable>

              {/* # — Tag button */}
              <Pressable
                onPress={() => {
                  if (showTagNudge) handleHashClick();
                  else if (tagFlow === 'none') setTagFlow('picker');
                }}
                style={({ hovered }: any) => ({
                  width: 32, height: 32, borderRadius: 8,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: !showTagNudge && hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                {showTagNudge ? (
                  <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                    {/* Pulse ripple ring */}
                    <Animated.View style={{
                      position: 'absolute',
                      width: 32, height: 32, borderRadius: 16,
                      backgroundColor: theme.colors.secondaryGreen,
                      opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0] }),
                      transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2] }) }],
                    }} />
                    {/* Main green circle */}
                    <Animated.View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: theme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center', opacity: nudgeEnterAnim, transform: [{ scale: nudgeEnterAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) }] }}>
                      <Hash size={20} color={theme.colors.white} />
                    </Animated.View>
                  </View>
                ) : (
                  <Hash size={20} color={theme.colors.grey06} />
                )}
              </Pressable>

              {/* FileText, ImageIcon, Smile */}
              {[FileText, ImageIcon, Smile].map((Icon, i) => (
                <Pressable key={i} style={({ hovered }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
                  <Icon size={20} color={theme.colors.grey06} />
                </Pressable>
              ))}
            </Box>
            <Pressable
              disabled={!chatMessage.trim()}
              onPress={() => {
                if (!chatMessage.trim()) return;
                if (fadeTimerRef.current) { clearTimeout(fadeTimerRef.current); fadeTimerRef.current = null; }
                startConvFadeAnim.setValue(1);
                const isFirstMsg = sentMessages.length === 0;
                const isTagged = tagFlow === 'tagged';
                const now = new Date();
                const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                setSentMessages(prev => [...prev, {
                  id: Date.now().toString(),
                  text: chatMessage.trim(),
                  time,
                  ...(isTagged ? { taggedProject, taggedTask } : {}),
                }]);
                setChatMessage('');
                setShowStartConvTooltip(false);
                if (isTagged) {
                  setFirstTagMessageIdx(sentMessages.length);
                  setTagFlow('none');
                  setTaggedProject('');
                  setTaggedTask('');
                  if (smartTagsFadeTimerRef.current) { clearTimeout(smartTagsFadeTimerRef.current); smartTagsFadeTimerRef.current = null; }
                  setShowSmartTagsTooltip(false);
                  smartTagsFadeAnim.setValue(1);
                  firstTagFadeAnim.setValue(1);
                  setShowFirstTagSuccess(true);
                  setTimeout(() => {
                    Animated.timing(firstTagFadeAnim, {
                      toValue: 0,
                      duration: 300,
                      easing: Easing.out(Easing.cubic),
                      useNativeDriver: true,
                    }).start(() => {
                      setShowFirstTagSuccess(false);
                      firstTagFadeAnim.setValue(1);
                    });
                  }, 2000);
                }
                if (isFirstMsg) {
                  firstMsgFadeAnim.setValue(1);
                  setShowFirstMsgSuccess(true);
                  setTimeout(() => {
                    Animated.timing(firstMsgFadeAnim, {
                      toValue: 0,
                      duration: 300,
                      easing: Easing.out(Easing.cubic),
                      useNativeDriver: true,
                    }).start(() => {
                      setShowFirstMsgSuccess(false);
                      firstMsgFadeAnim.setValue(1);
                      setShowPhotoNudge(true);
                      photoNudgeAnim.setValue(0);
                      Animated.timing(photoNudgeAnim, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                      }).start();
                    });
                  }, 2000);
                }
              }}
              style={({ pressed }: any) => ({
                width: 32, height: 32, borderRadius: 8,
                backgroundColor: chatMessage.trim() ? theme.colors.foreground : theme.colors.grey02,
                alignItems: 'center', justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Send size={20} color={chatMessage.trim() ? theme.colors.white : theme.colors.grey04} />
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
          showMemberJoinedCard={showMemberJoinedCard || activeContact.id === 'carlos-smith'}
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

// ─── Preset list items ────────────────────────────────────────────────────────

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

/** variant='with-member' — Carlos Smith first, Tasktag Helpdesk last */
export const LIST_ITEMS_WITH_MEMBER: ChatListItem[] = [
  {
    id: 'carlos-smith',
    user: { variant: 'text', initials: 'CS', color: 'darkGreen' },
    name: 'Carlos Smith',
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
