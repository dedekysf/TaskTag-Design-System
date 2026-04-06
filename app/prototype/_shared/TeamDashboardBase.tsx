import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  CreditCard,
  Equal,
  FileText,
  Folder,
  Hash,
  HelpCircle,
  Image as ImageIcon,
  Link,
  ListFilter,
  MapPin,
  Maximize2,
  MessageSquare,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Search,
  Send,
  Smile,
  SortDesc,
  TriangleAlert,
  UserCheck,
  UserPlus,
  Users,
  X
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView } from 'react-native';

// ─── Data ────────────────────────────────────────────────────────────────────

export const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  orgName: 'TaskTag Project',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
};

export const TABS = [
  { key: 'tasks', label: 'Tasks', Icon: Hash, count: undefined },
  { key: 'checklist', label: 'Checklist', Icon: FileText, count: undefined },
  { key: 'files', label: 'Files & Media', Icon: ImageIcon, count: undefined },
  { key: 'activity', label: 'Activity Log', Icon: Activity, count: undefined },
  { key: 'members', label: 'Members', Icon: Users, count: 10 },
];

export const CURRENT_TASKS = [
  { name: 'Fix the sink', subtasks: 3, dueDate: 'Oct 18', priority: 'high' as const, assignees: [0] },
  { name: 'Electricity board fix', subtasks: undefined, dueDate: 'Oct 18', priority: 'low' as const, assignees: [1, 2] },
  { name: 'Install new door locks', subtasks: 5, dueDate: 'Oct 18', priority: 'low' as const, assignees: [0, 1, 2] },
  { name: 'Paint the living room', subtasks: undefined, dueDate: 'Oct 18', priority: 'medium' as const, assignees: [0, 1, 2] },
];

export const AVATAR_PHOTOS = [
  { src: require('@/assets/images/sample-three.jpg'), name: 'James Log...' },
  { src: require('@/assets/images/sample-two.jpg'), name: 'User 2' },
  { src: require('@/assets/images/sample-four.jpg'), name: 'User 3' },
];

export const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: false },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

export const WHAT_YOU_CAN_DO = [
  { Icon: Hash, title: 'Create, assign and track tasks', desc: 'Manage project tasks efficiently' },
  { Icon: ImageIcon, title: 'Share media and docs', desc: 'Upload files, photos and documents' },
  { Icon: MessageSquare, title: 'Chat with your team', desc: 'Stay connected with team members' },
  { Icon: Activity, title: 'Follow updates', desc: 'Get notified on project changes' },
];

type TeamMemberAvatar =
  | { type: 'photo'; src: any }
  | { type: 'initials'; initials: string; color: string };

export const TEAM_MEMBERS: { name: string; skills: string[]; email: string; phone: string; role: string; avatar: TeamMemberAvatar }[] = [
  { name: 'Linda Smith', skills: [], email: 'lindasmith@gmail.com', phone: '232-946-1254', role: 'Owner', avatar: { type: 'initials', initials: 'LS', color: 'pastelMagenta' } },
  { name: 'Abby Smith', skills: ['Carpenter'], email: 'abbysmith@gmail.com', phone: '230-124-9988', role: 'Admin', avatar: { type: 'initials', initials: 'AS', color: 'pastelYellow' } },
  { name: 'Oscar H.', skills: [], email: 'oscaar@email.com', phone: '', role: 'Admin', avatar: { type: 'initials', initials: 'OH', color: 'pastelOrange' } },
  { name: 'Savannah Nguyen', skills: [], email: 'savannahnguyen@gmail.com', phone: '222-548-5896', role: 'Member', avatar: { type: 'initials', initials: 'SN', color: 'pastelBlue' } },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

export function MiniAvatar({ colorIndex, size = 30 }: { colorIndex: number; size?: number }) {
  const theme = useTheme<Theme>();
  const p = AVATAR_PHOTOS[colorIndex % AVATAR_PHOTOS.length];
  return (
    <Image
      source={p.src}
      style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: theme.colors.white }}
    />
  );
}

export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const theme = useTheme<Theme>();
  const config = {
    high: { color: theme.colors.orange, Icon: ChevronsUp },
    medium: { color: '#f59e0b', Icon: Equal },
    low: { color: theme.colors.secondaryGreen, Icon: ChevronsDown },
  }[priority];
  return (
    <Box
      width={36} height={36}
      borderRadius="full"
      alignItems="center"
      justifyContent="center"
      style={{ borderWidth: 1, borderColor: theme.colors.border }}
    >
      <config.Icon size={15} color={config.color} />
    </Box>
  );
}

export function DateBadge({ date }: { date: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      style={{
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 40,
        paddingHorizontal: 14,
        paddingVertical: 8,
        minWidth: 108,
      }}
    >
      <Calendar size={13} color={theme.colors.grey04} />
      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{date}</Text>
    </Box>
  );
}

export function TaskRow({ task, isLast }: { task: (typeof CURRENT_TASKS)[0]; isLast: boolean }) {
  const theme = useTheme<Theme>();
  const isSingle = task.assignees.length === 1;
  return (
    <Box
      flexDirection="row"
      alignItems="center"
      paddingHorizontal="md"
      borderBottomWidth={isLast ? 0 : 1}
      borderColor="border"
      style={{ minHeight: 60, paddingVertical: 10 }}
    >
      <Box width={22} height={22} borderRadius="full" style={{ borderWidth: 1.5, borderColor: theme.colors.grey03, marginRight: 14 }} />

      <Box flex={1} style={{ marginRight: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>{task.name}</Text>
        {task.subtasks !== undefined && (
          <Box flexDirection="row" alignItems="center" gap="4" style={{ marginTop: 3 }}>
            <SortDesc size={12} color={theme.colors.grey04} />
            <Text style={{ fontSize: 12, color: theme.colors.grey04, textDecorationLine: 'underline' }}>
              {task.subtasks} items
            </Text>
          </Box>
        )}
      </Box>

      <Box style={{ marginRight: 16 }}><PriorityBadge priority={task.priority} /></Box>
      <Box style={{ marginRight: 16 }}><DateBadge date={task.dueDate} /></Box>

      <Box flexDirection="row" alignItems="center" style={{ marginRight: 16, minWidth: 120 }}>
        {task.assignees.map((idx, i) => (
          <Box key={i} style={{ marginLeft: i > 0 ? -10 : 0, zIndex: task.assignees.length - i }}>
            <MiniAvatar colorIndex={idx} size={30} />
          </Box>
        ))}
        {isSingle && (
          <Text style={{ fontSize: 13, color: theme.colors.textSecondary, marginLeft: 8 }} numberOfLines={1}>
            {AVATAR_PHOTOS[task.assignees[0] % AVATAR_PHOTOS.length].name}
          </Text>
        )}
      </Box>

      <Link size={16} color={theme.colors.grey03} />
    </Box>
  );
}

export function TableSection({
  title, badge, tasks, showAddRow = false, defaultOpen = true,
}: {
  title: string; badge?: number; tasks: typeof CURRENT_TASKS; showAddRow?: boolean; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useTheme<Theme>();
  return (
    <Box
      backgroundColor="card"
      borderWidth={1}
      borderColor="border"
      style={{ borderRadius: 12, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' as any }}
    >
      <Pressable onPress={() => setOpen(v => !v)}>
        <Box
          flexDirection="row" alignItems="center" justifyContent="space-between"
          paddingHorizontal="md"
          borderBottomWidth={open ? 1 : 0}
          borderColor="border"
          style={{ height: 56 }}
        >
          <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.foreground }}>{title}</Text>
            {badge !== undefined && (
              <Box style={{ backgroundColor: theme.colors.grey01, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 2, borderWidth: 1, borderColor: theme.colors.border }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.textSecondary }}>{badge}</Text>
              </Box>
            )}
          </Box>
          {open ? <ChevronUp size={18} color={theme.colors.grey04} /> : <ChevronDown size={18} color={theme.colors.grey04} />}
        </Box>
      </Pressable>
      {open && (
        <>
          {tasks.map((task, i) => (
            <TaskRow key={i} task={task} isLast={i === tasks.length - 1 && !showAddRow} />
          ))}
          {showAddRow && (
            <Box flexDirection="row" alignItems="center" paddingHorizontal="md" gap="12" style={{ height: 52 }}>
              <Box width={22} height={22} borderRadius="full" style={{ borderWidth: 1.5, borderColor: theme.colors.grey03 }} />
              <Text style={{ fontSize: 14, color: theme.colors.grey03 }}>Enter task name...</Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

export default function TeamDashboardBase({
  modalVariant = 'non-user',
  viewVariant = 'default',
}: {
  modalVariant?: 'non-user' | 'tt-user';
  viewVariant?: 'default' | 'pending' | 'ask-to-join';
}) {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('members');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <Box
      flex={1}
      flexDirection="row"
      backgroundColor="background"
      style={{ height: '100%' as any, position: 'relative' as any }}
    >

      {/* ── Sidebar ── */}
      <Box
        backgroundColor="grey01"
        borderRightWidth={1}
        borderColor="border"
        style={{
          width: sidebarCollapsed ? 72 : 256,
          maxWidth: 256,
          height: '100%' as any,
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 30,
        }}
      >
        {sidebarCollapsed ? (
          <Box alignItems="center" gap="8">
            <Image source={require('@/assets/images/tt-favicon.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
            <Pressable onPress={() => setSidebarCollapsed(false)} hitSlop={8}>
              <ChevronsRight size={20} color={theme.colors.grey04} />
            </Pressable>
          </Box>
        ) : (
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Image source={require('@/assets/images/tasktag-logo.png')} style={{ width: 96, height: 24 }} resizeMode="contain" />
            <Pressable onPress={() => setSidebarCollapsed(true)} hitSlop={8}>
              <ChevronsLeft size={24} color={theme.colors.grey04} />
            </Pressable>
          </Box>
        )}

        <Box flex={1} style={{ paddingTop: 16 }}>
          <Box flex={1} justifyContent="space-between">

            <Box gap="8">
              {NAV_ITEMS.map(({ key, label, Icon, active }) => (
                sidebarCollapsed ? (
                  <Box key={key} alignItems="center" justifyContent="center" style={{ height: 54 }}>
                    <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: active ? theme.colors.lightMint : theme.colors.card }}>
                      <Icon size={22} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                    </Box>
                  </Box>
                ) : (
                  <Box key={key} flexDirection="row" alignItems="center" gap="16" style={{ height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15, backgroundColor: active ? theme.colors.lightMint : 'transparent' }}>
                    <Icon size={24} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                    <Text variant="labelMedium" style={{ color: active ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>{label}</Text>
                  </Box>
                )
              ))}
            </Box>

            <Box gap="8">
              {!sidebarCollapsed && (
                <Box style={{ paddingBottom: 40 }}>
                  <Box backgroundColor="card" style={{ borderRadius: 8, padding: 16, overflow: 'hidden' as any, position: 'relative' as any }}>
                    <Box style={{ position: 'absolute' as any, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,217,165,0.25)', top: -36, left: -36, ...Platform.select({ web: { filter: 'blur(18px)' } as any }) }} />
                    <Box style={{ position: 'absolute' as any, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(0,217,165,0.2)', bottom: -60, right: -30, ...Platform.select({ web: { filter: 'blur(22px)' } as any }) }} />
                    <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.textSecondary, lineHeight: 24, marginBottom: 16 }}>Find All Product Guides Here</Text>
                    <Box flexDirection="row" alignItems="center" gap="4">
                      <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen, lineHeight: 24 }}>Explore</Text>
                      <ChevronRight size={18} color={theme.colors.secondaryGreen} />
                    </Box>
                  </Box>
                </Box>
              )}

              <Box height={1} backgroundColor="border" />

              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                  <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.card }}>
                    <HelpCircle size={22} color={theme.colors.textSecondary} />
                  </Box>
                </Box>
              ) : (
                <Box flexDirection="row" alignItems="center" gap="16" style={{ height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                  <HelpCircle size={24} color={theme.colors.textSecondary} />
                  <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>Help</Text>
                </Box>
              )}

              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                  <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelBlue' : 'pastelOrange'}>
                    <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>{viewVariant === 'ask-to-join' ? 'SN' : 'OH'}</Text>
                  </Box>
                </Box>
              ) : (
                <Box flexDirection="row" alignItems="center" gap="8" style={{ height: 54, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 15, backgroundColor: theme.colors.lightMint }}>
                  <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelBlue' : 'pastelOrange'}>
                    <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>{viewVariant === 'ask-to-join' ? 'SN' : 'OH'}</Text>
                  </Box>
                  <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>My Account</Text>
                </Box>
              )}
            </Box>

          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any }}>

        {/* Header */}
        <Box paddingHorizontal="md" backgroundColor="card" borderBottomWidth={1} borderColor="border" style={{ paddingTop: 16, paddingBottom: 12 }}>
          <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between">
            <Box flexDirection="row" alignItems="flex-start" gap="8" flex={1} flexShrink={1}>
              <Pressable hitSlop={8} style={{ paddingTop: 6 }}><ChevronLeft size={20} color={theme.colors.grey04} /></Pressable>
              <Box flex={1} flexShrink={1}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1, fontWeight: '700' }}>Painting Team</Text>
                  <Pressable hitSlop={8}><MoreVertical size={20} color={theme.colors.black} /></Pressable>
                </Box>
                <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>11 N Raintree Hollow Court</Text>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="12">
              <Pressable hitSlop={8}><Search size={22} color={theme.colors.grey05} /></Pressable>
              <Button
                variant="fill"
                size="sm"
                style={{ width: 110, borderRadius: 40, backgroundColor: theme.colors.black }}
              >
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Plus size={15} color={theme.colors.white} />
                  <Text variant="labelMedium" style={{ color: theme.colors.white }}>New Task</Text>
                </Box>
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="border" backgroundColor="card" style={{ height: 56 }} paddingHorizontal="md">
          <Box flexDirection="row" alignItems="stretch">
            {[
              { key: 'details', label: 'Details', Icon: CreditCard, count: undefined as number | undefined },
              { key: 'members', label: 'Members', Icon: Users, count: 3 as number | undefined },
              { key: 'invoice', label: 'Invoice', Icon: FileText, count: 1 as number | undefined },
            ].map(({ key, label, Icon, count }) => {
              const isActive = activeTab === key;
              return (
                <Pressable key={key} onPress={() => setActiveTab(key)} style={{ height: 56, width: 124 }}>
                  <Box flexDirection="column" alignItems="center" justifyContent="flex-end" height={56} style={{ paddingTop: 8, marginBottom: -1 }}>
                    <Box flexDirection="row" alignItems="center" style={{ height: 32, paddingHorizontal: 8, gap: 8 }} justifyContent="center">
                      <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary} style={{ transition: 'color 0.2s ease' } as any} />
                      <Text variant="labelMedium" style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                      {count !== undefined && (
                        <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'background-color 0.2s ease' } as any}>
                          <Text variant="webMetadataSecondary" color="white">{count}</Text>
                        </Box>
                      )}
                    </Box>
                    <Box style={{ height: 2, width: '100%', backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', marginTop: 'auto', transition: 'background-color 0.2s ease' as any } as any} />
                  </Box>
                </Pressable>
              );
            })}
          </Box>
          <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
            <Pressable hitSlop={8}><Link size={20} color={theme.colors.textSecondary} /></Pressable>
            <Button
              variant="outline"
              color="secondary"
              size="sm"
              style={{
                width: 110,
                borderRadius: 40,
                borderColor: theme.colors.border,
                backgroundColor: 'transparent',
              }}
            >
              <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                <UserPlus size={16} color={theme.colors.textSecondary} />
                <Text variant="labelMedium" color="textSecondary">Invite</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        {viewVariant === 'ask-to-join' ? (
          <Box flex={1} alignItems="center" justifyContent="center">
            <Box alignItems="center" style={{ gap: 16 }}>
              <TriangleAlert size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
              <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                You’re not a member of this team
              </Text>
            </Box>
            <Button
              variant="outline"
              size="lg"
              disabled
              style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.grey01, borderColor: theme.colors.border, marginTop: 16, height: 54 }}
            >
              <Box flexDirection="row" alignItems="center" gap="8">
                <UserCheck size={16} color={theme.colors.grey04} />
                <Text color="grey04" variant="labelMedium">Pending Request</Text>
              </Box>
            </Button>
          </Box>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {/* Filter bar */}
            <Box flexDirection="row" alignItems="center" gap="8" paddingHorizontal="md" backgroundColor="card" style={{ height: 56 }}>
              <Button variant="ghost" color="secondary" size="sm" style={{ borderRadius: 8 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <ListFilter size={15} color={theme.colors.black} />
                  <Text variant="webBody" color="black">Filter</Text>
                </Box>
              </Button>
              <Button variant="ghost" color="secondary" size="sm" style={{ borderRadius: 8 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <MessageSquare size={15} color={theme.colors.black} />
                  <Text variant="webBody" color="black">Start Chat</Text>
                </Box>
              </Button>
            </Box>

            <Box style={{ padding: 16 }}>
              <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, overflow: 'hidden' as any }}>
                <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 64, paddingHorizontal: 16 }}>
                  <Box flexDirection="row" alignItems="center" gap="8">
                    <Text variant="webLabelEmphasized" color="foreground">Active</Text>
                    <Box width={20} height={20} alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10 }}>
                      <Text style={{ fontSize: 11, color: theme.colors.grey05, fontWeight: '500' }}>3</Text>
                    </Box>
                  </Box>
                  <ChevronUp size={20} color={theme.colors.grey04} />
                </Box>

                <Box>
                  {/* Header row */}
                  <Box flexDirection="row" backgroundColor="grey01">
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                      <Box flexDirection="row" alignItems="center" gap="4">
                        <Text variant="webMetadataPrimary" color="grey04">Name</Text>
                        <ArrowDownUp size={12} color={theme.colors.grey04} />
                      </Box>
                    </Box>
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                      <Text variant="webMetadataPrimary" color="grey04">Skills</Text>
                    </Box>
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                      <Text variant="webMetadataPrimary" color="grey04">Email</Text>
                    </Box>
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                      <Text variant="webMetadataPrimary" color="grey04">Phone</Text>
                    </Box>
                    <Box style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 10 }}>
                      <Text variant="webMetadataPrimary" color="grey04">Role</Text>
                    </Box>
                    <Box style={{ width: 48, paddingHorizontal: 16, paddingVertical: 10 }} />
                  </Box>

                  {/* Data rows */}
                  {TEAM_MEMBERS.map((member, index) => (
                    <Box key={index} flexDirection="row" alignItems="center" borderTopWidth={1} borderColor="border" style={{ height: 48 }}>
                      <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Box flexDirection="row" alignItems="center" gap="8">
                          {member.avatar.type === 'photo' ? (
                            <Image source={member.avatar.src} style={{ width: 32, height: 32, borderRadius: 16 }} />
                          ) : (
                            <Box width={32} height={32} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={member.avatar.color as any}>
                              <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>{member.avatar.initials}</Text>
                            </Box>
                          )}
                          <Text variant="webSecondaryBody" color="foreground" numberOfLines={1} style={{ flex: 1 }}>{member.name}</Text>
                        </Box>
                      </Box>
                      <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                        {member.skills.length > 0 ? (
                          <Box flexDirection="row" alignItems="center" gap="4">
                            {member.skills.slice(0, 2).map((skill, i) => (
                              <Box key={i} style={{ backgroundColor: theme.colors.grey02, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 }}>
                                <Text variant="labelMedium" color="foreground">{skill}</Text>
                              </Box>
                            ))}
                            {member.skills.length > 2 && (
                              <Text variant="webSecondaryBody" color="grey04">...</Text>
                            )}
                          </Box>
                        ) : null}
                      </Box>
                      <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text variant="webSecondaryBody" color="foreground" numberOfLines={1}>{member.email}</Text>
                      </Box>
                      <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text variant="webSecondaryBody" color="foreground">{member.phone}</Text>
                      </Box>
                      <Box style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
                        <Text variant="labelMedium" color="foreground">{member.role}</Text>
                      </Box>
                      <Box style={{ width: 48, paddingHorizontal: 8, paddingVertical: 8 }} alignItems="center" justifyContent="center">
                        <Pressable hitSlop={8}>
                          <MessageSquare size={16} color={theme.colors.grey06} />
                        </Pressable>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </ScrollView>
        )}
      </Box>

      {/* ── Chat Panel ── */}
      <Box flex={1} backgroundColor="grey01" borderLeftWidth={1} borderColor="border" style={{ height: '100%' as any, maxWidth: 550 }}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="card" borderBottomWidth={1} borderColor="border" style={{ height: 72, paddingHorizontal: 20 }}>
          <Box flexDirection="row" alignItems="center" gap="12">
            <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelBlue' : 'pastelMagenta'}>
              <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>
                {viewVariant === 'ask-to-join' ? 'SN' : 'LS'}
              </Text>
            </Box>
            <Text variant="webLabelEmphasized" color="foreground">
              {viewVariant === 'ask-to-join' ? 'Savannah Nguyen' : 'Linda Smith'}
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center">
            <Pressable style={{ padding: 8 }}><Maximize2 size={18} color={theme.colors.textSecondary} /></Pressable>
            <Pressable style={{ padding: 8 }}><MoreVertical size={18} color={theme.colors.textSecondary} /></Pressable>
            <Pressable style={{ padding: 8 }}><X size={18} color={theme.colors.textSecondary} /></Pressable>
          </Box>
        </Box>

        <Box flex={1} justifyContent="flex-end">
          <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 24, paddingVertical: 20 }}>
            <Box flex={1} height={1} backgroundColor="border" />
            <Text style={{ fontSize: 12, color: theme.colors.grey03, marginHorizontal: 12 }}>Friday, November 20</Text>
            <Box flex={1} height={1} backgroundColor="border" />
          </Box>
          <Box style={{ paddingHorizontal: 16, paddingBottom: 16 }}>
            <Box flexDirection="row" gap="12" alignItems="flex-start">
              {(viewVariant === 'pending' || viewVariant === 'ask-to-join') ? (
                <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelBlue' : 'pastelPurple'} style={{ marginTop: 2 }}>
                  <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>
                    {viewVariant === 'ask-to-join' ? 'SN' : 'JH'}
                  </Text>
                </Box>
              ) : (
                <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta" style={{ marginTop: 2 }}>
                  <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>LS</Text>
                </Box>
              )}
              <Box flex={1}>
                <Box flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>
                    {viewVariant === 'pending' ? 'James Harrington' : viewVariant === 'ask-to-join' ? 'Savannah Nguyen' : 'Linda Smith'}
                  </Text>
                  <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>12:25 PM</Text>
                </Box>
                {viewVariant === 'pending' ? (
                  <Box flexDirection="row" alignItems="flex-end" gap="8">
                    <Box flex={1} style={{ backgroundColor: theme.colors.lightMint, borderRadius: 12, borderTopLeftRadius: 0, padding: 8 }}>
                      <Box borderWidth={1} borderColor="border" style={{ borderRadius: 10, overflow: 'hidden' as any }}>
                        <Box flexDirection="row" alignItems="center" gap="8" style={{ padding: 10, backgroundColor: '#f9eefa' }}>
                          <Users size={13} color={theme.colors.darkMagenta} />
                          <Text style={{ fontSize: 12, color: theme.colors.darkMagenta, fontWeight: '500' }}>Member Activity</Text>
                        </Box>
                        <Box backgroundColor="card" style={{ padding: 12 }}>
                          <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 10, lineHeight: 20 }}>Ask to join this project</Text>
                          <Box flexDirection="row" alignItems="center" gap="8" style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start' as any }}>
                            <Folder size={12} color={theme.colors.white} />
                            <Text style={{ fontSize: 12, color: theme.colors.white, fontWeight: '500' }}>Raintree Hollow Court Ren...</Text>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                    <Check size={14} color={theme.colors.secondaryGreen} style={{ marginBottom: 2 }} />
                  </Box>
                ) : viewVariant === 'ask-to-join' ? (
                  <Box flexDirection="row" alignItems="flex-end" gap="8">
                    <Box flex={1} style={{ backgroundColor: '#E0F2F1', borderRadius: 16, borderTopLeftRadius: 0, padding: 8 }}>
                      <Box borderWidth={1} borderColor="border" style={{ borderRadius: 12, overflow: 'hidden' as any }}>
                        <Box flexDirection="row" alignItems="center" gap="8" style={{ paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FDF2F9' }}>
                          <UserPlus size={16} color="#B526A1" strokeWidth={2.5} />
                          <Text style={{ fontSize: 14, color: '#B526A1', fontWeight: '500' }}>Member Activity</Text>
                        </Box>
                        <Box backgroundColor="card" style={{ padding: 16 }}>
                          <Text style={{ fontSize: 18, color: theme.colors.foreground, lineHeight: 24 }}>
                            {'Ask to join '}
                            <Text style={{ fontWeight: '700' }}>Painting Team</Text>
                            {' team'}
                          </Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box style={{ marginBottom: 4 }}>
                      <Box flexDirection="row" style={{ marginLeft: -4 }}>
                        <Check size={14} color={theme.colors.secondaryGreen} />
                        <Check size={14} color={theme.colors.secondaryGreen} style={{ marginLeft: -8 }} />
                      </Box>
                    </Box>
                  </Box>
                ) : (
                  <Box flex={1} style={{ backgroundColor: theme.colors.card, borderRadius: 12, borderTopLeftRadius: 0, padding: 8 }}>
                    <Box borderWidth={1} borderColor="border" style={{ borderRadius: 10, overflow: 'hidden' as any }}>
                      <Box flexDirection="row" alignItems="center" gap="8" style={{ padding: 10, backgroundColor: '#f9eefa' }}>
                        <Users size={13} color={theme.colors.darkMagenta} />
                        <Text style={{ fontSize: 12, color: theme.colors.darkMagenta, fontWeight: '500' }}>Member Activity</Text>
                      </Box>
                      <Box backgroundColor="card" style={{ padding: 12 }}>
                        <Text style={{ fontSize: 14, color: theme.colors.foreground, marginBottom: 12, lineHeight: 22 }}>
                          {"You've been added to "}
                          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground }}>Painting Team</Text>
                           {' team'}
                        </Text>
                        <Button variant="outline" color="secondary" size="xs" style={{ alignSelf: 'flex-start' as any, borderColor: theme.colors.foreground }}>
                          <Text variant="labelMedium" color="foreground">View Team</Text>
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>

        <Box style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
          <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 16, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
            <Text style={{ fontSize: 14, color: theme.colors.grey03, paddingBottom: 20 }}>Type message here...</Text>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box flexDirection="row" alignItems="center">
                {[Plus, Hash, FileText, ImageIcon, Smile].map((Icon, i) => (
                  <Pressable key={i} style={{ padding: 8 }}><Icon size={20} color={theme.colors.grey04} /></Pressable>
                ))}
              </Box>
              <Pressable disabled style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: theme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} color={theme.colors.grey04} />
              </Pressable>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Mini Chat Sidebar ── */}
      <Box width={72} backgroundColor="card" borderLeftWidth={1} borderColor="border" alignItems="center" style={{ height: '100%' as any, paddingTop: 16, paddingBottom: 20 }}>
        <Pressable style={{ padding: 8, marginBottom: 12 }}>
          <ChevronsLeft size={20} color={theme.colors.grey04} />
        </Pressable>
        <Box alignItems="center" justifyContent="center" style={{ width: '100%', paddingVertical: 10, backgroundColor: theme.colors.lightMint, marginBottom: 8 }}>
          <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelBlue' : 'pastelMagenta'}>
            <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>
              {viewVariant === 'ask-to-join' ? 'SN' : 'LS'}
            </Text>
          </Box>
        </Box>
        <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={viewVariant === 'ask-to-join' ? 'pastelMagenta' : 'pastelBlue'} style={{ marginBottom: 8 }}>
          <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>
            {viewVariant === 'ask-to-join' ? 'LS' : 'SN'}
          </Text>
        </Box>
        <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelOrange">
          <Text style={{ fontWeight: '700', color: '#FFFFFF', fontSize: 14 }}>TH</Text>
        </Box>
        <Box flex={1} justifyContent="flex-end">
          <Pressable
            style={{
              width: 44, height: 44, borderRadius: 22,
              backgroundColor: theme.colors.foreground,
              alignItems: 'center', justifyContent: 'center',
              ...Platform.select({
                web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any,
                default: { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
              }),
            }}
          >
            <MessageSquarePlus size={20} color={theme.colors.white} />
          </Pressable>
        </Box>
      </Box>

    </Box>
  );
}
