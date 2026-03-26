import React, { useState } from 'react';
import { Image, Platform, Pressable, ScrollView } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';
import {
  Activity,
  ArrowDownUp,
  ArrowUp,
  Building2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  Equal,
  FileText,
  Folder,
  HardHat,
  Hash,
  HelpCircle,
  Image as ImageIcon,
  Link,
  ListFilter,
  MapPin,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Minus,
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
  X,
} from 'lucide-react-native';

// ─── Data ────────────────────────────────────────────────────────────────────

export const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  orgName: 'TaskTag Project',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
};

export const TABS = [
  { key: 'tasks',    label: 'Tasks',        Icon: Hash,      count: undefined },
  { key: 'checklist',label: 'Checklist',    Icon: FileText,  count: undefined },
  { key: 'files',    label: 'Files & Media',Icon: ImageIcon, count: undefined },
  { key: 'activity', label: 'Activity Log', Icon: Activity,  count: undefined },
  { key: 'members',  label: 'Members',      Icon: Users,     count: 10 },
];

export const CURRENT_TASKS = [
  { name: 'Fix the sink',          subtasks: 3,         dueDate: 'Oct 18', priority: 'high'   as const, assignees: [0] },
  { name: 'Electricity board fix', subtasks: undefined, dueDate: 'Oct 18', priority: 'low'    as const, assignees: [1, 2] },
  { name: 'Install new door locks',subtasks: 5,         dueDate: 'Oct 18', priority: 'low'    as const, assignees: [0, 1, 2] },
  { name: 'Paint the living room', subtasks: undefined, dueDate: 'Oct 18', priority: 'medium' as const, assignees: [0, 1, 2] },
];

export const AVATAR_PHOTOS = [
  { src: require('@/assets/images/sample-three.jpg'), name: 'James Log...' },
  { src: require('@/assets/images/sample-two.jpg'),   name: 'User 2' },
  { src: require('@/assets/images/sample-four.jpg'),  name: 'User 3' },
];

export const NAV_ITEMS = [
  { key: 'projects', label: 'Projects',       Icon: Folder,  active: true },
  { key: 'tasks',    label: 'My Tasks',        Icon: Hash,    active: false },
  { key: 'activity', label: 'Global Activity', Icon: Activity,active: false },
  { key: 'contacts', label: 'Contacts',        Icon: Users,   active: false },
];

export const WHAT_YOU_CAN_DO = [
  { Icon: Hash,         title: 'Create, assign and track tasks', desc: 'Manage project tasks efficiently' },
  { Icon: ImageIcon,    title: 'Share media and docs',           desc: 'Upload files, photos and documents' },
  { Icon: MessageSquare,title: 'Chat with your team',            desc: 'Stay connected with team members' },
  { Icon: Activity,     title: 'Follow updates',                 desc: 'Get notified on project changes' },
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
    high:   { color: theme.colors.orange, Icon: ChevronsUp },
    medium: { color: '#f59e0b', Icon: Equal },
    low:    { color: theme.colors.secondaryGreen, Icon: ChevronsDown },
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

export default function ProjectDashboardBase({
  modalVariant = 'non-user',
  viewVariant = 'default',
}: {
  modalVariant?: 'non-user' | 'tt-user';
  viewVariant?: 'default' | 'pending';
}) {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('tasks');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);

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
                  <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.lightMint }}>
                    <Text style={{ fontWeight: '700', color: theme.colors.secondaryGreen, fontSize: 14 }}>JH</Text>
                  </Box>
                </Box>
              ) : (
                <Box flexDirection="row" alignItems="center" gap="8" style={{ height: 54, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 15 }}>
                  <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.lightMint }}>
                    <Text style={{ fontWeight: '700', color: theme.colors.secondaryGreen, fontSize: 14 }}>JH</Text>
                  </Box>
                  <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>My Profile</Text>
                </Box>
              )}
            </Box>

          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any, maxWidth: 1114 }}>

        <Box paddingHorizontal="md" backgroundColor="card" borderBottomWidth={1} borderColor="border" style={{ paddingTop: 16, paddingBottom: 12 }}>
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Box flexDirection="row" alignItems="center" gap="8" flex={1} flexShrink={1}>
              <Pressable hitSlop={8}><ChevronLeft size={20} color={theme.colors.grey04} /></Pressable>
              <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1, fontWeight: '700' }}>{PROJECT.name}</Text>
              <Pressable hitSlop={8}><MoreVertical size={20} color={theme.colors.black} /></Pressable>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="16">
              <Pressable hitSlop={8}><Search size={22} color={theme.colors.grey05} /></Pressable>
              <Pressable
                disabled={viewVariant === 'pending'}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  backgroundColor: viewVariant === 'pending' ? theme.colors.grey02 : theme.colors.black,
                  borderRadius: 40,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  minWidth: 120,
                  justifyContent: 'center',
                }}
              >
                <Plus size={18} color={viewVariant === 'pending' ? theme.colors.grey05 : theme.colors.white} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: viewVariant === 'pending' ? theme.colors.grey05 : theme.colors.white }}>New Task</Text>
              </Pressable>
            </Box>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="12" style={{ marginTop: 0, paddingLeft: 28 }}>
            <Box flexDirection="row" alignItems="center" gap="4">
              <Building2 size={12} color={theme.colors.secondaryGreen} />
              <Text style={{ fontSize: 11, color: theme.colors.textSecondary, fontWeight: '500' }}>{PROJECT.orgName}</Text>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="4">
              <MapPin size={12} color={theme.colors.textSecondary} />
              <Text style={{ fontSize: 11, color: theme.colors.textSecondary }}>{PROJECT.address}</Text>
            </Box>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

          <Box backgroundColor="grey01" style={{ margin: 16, borderRadius: 8, padding: 16 }}>
            <Text variant="webLabelEmphasized" color="foreground" style={{ marginBottom: 8 }}>Description</Text>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>{PROJECT.description}</Text>
          </Box>

          {/* Tabs */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="border" backgroundColor="card" style={{ height: 56 }} paddingHorizontal="md">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexShrink: 1 }} contentContainerStyle={{ alignItems: 'stretch' }}>
              {TABS.map(({ key, label, Icon, count }) => {
                const isActive = activeTab === key;
                return (
                  <Pressable key={key} onPress={() => setActiveTab(key)} style={{ height: '100%' }}>
                    <Box flexDirection="column" alignItems="center" justifyContent="flex-end" height={56} minWidth={96} style={{ paddingTop: 8, marginBottom: -1 }}>
                      <Box flexDirection="row" alignItems="center" style={{ height: 32, paddingHorizontal: 8, gap: 8 }} justifyContent="center">
                        <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary} style={{ transition: 'color 0.2s ease' } as any} />
                        <Text variant="labelMedium" style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                        {count !== undefined && (
                          <Box backgroundColor={isActive ? 'black' : 'textSecondary'} borderRadius="full" width={20} height={20} alignItems="center" justifyContent="center" style={{ transition: 'background-color 0.2s ease' } as any}>
                            <Text style={{ fontSize: 10, color: theme.colors.white, fontWeight: '600' }}>{count}</Text>
                          </Box>
                        )}
                      </Box>
                      <Box style={{ height: 2, width: '100%', backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', marginTop: 'auto', transition: 'background-color 0.2s ease' as any } as any} />
                    </Box>
                  </Pressable>
                );
              })}
            </ScrollView>
            <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
              <Pressable hitSlop={8}><Link size={20} color={theme.colors.textSecondary} /></Pressable>
              <Button
                variant="outline"
                color="secondary"
                size="sm"
                disabled={viewVariant === 'pending'}
                style={{
                  borderRadius: 40,
                  minWidth: 120,
                  borderColor: viewVariant === 'pending' ? theme.colors.border : theme.colors.secondary,
                  backgroundColor: 'transparent'
                }}
              >
                <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                  <UserPlus size={16} color={viewVariant === 'pending' ? theme.colors.grey04 : theme.colors.textSecondary} />
                  <Text variant="labelMedium" color={viewVariant === 'pending' ? "grey04" : "textSecondary"}>Invite</Text>
                </Box>
              </Button>
            </Box>
          </Box>

          {/* Toolbar */}
          <Box flexDirection="row" alignItems="center" gap="8" paddingHorizontal="md" borderBottomWidth={1} borderColor="border" backgroundColor="card" style={{ height: 56 }}>
            {[{ Icon: ListFilter, label: 'Filter' }, { Icon: ArrowDownUp, label: 'Sort' }, { Icon: Calendar, label: 'Add to calendar' }].map(({ Icon, label }) => (
              <Button key={label} variant="ghost" size="sm" style={{ borderRadius: 8 }}>
                <Box flexDirection="row" alignItems="center" gap="4">
                  <Icon size={15} color={theme.colors.textSecondary} />
                  <Text variant="webBody" color="textSecondary">{label}</Text>
                </Box>
              </Button>
            ))}
          </Box>

          <Box style={{ paddingTop: 12 }}>
            {viewVariant === 'pending' ? (
              <Box
                flex={1}
                alignItems="center"
                justifyContent="center"
                minHeight={520}
                gap="16"
              >
                <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Box minHeight={64} justifyContent="center" width="100%">
                  <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                    You’re not a member of this project
                  </Text>
                </Box>
                <Button
                  variant="fill"
                  disabled
                  style={{
                    backgroundColor: theme.colors.grey02,
                    borderRadius: 40,
                    minWidth: 220,
                    height: 54, // Looks a bit taller/larger in screenshot
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <UserCheck size={20} color={theme.colors.grey05} />
                  <Text style={{ color: theme.colors.grey05, fontSize: 18, fontWeight: '500' }}>Pending Request</Text>
                </Button>
              </Box>
            ) : (
              <>
                <TableSection title="Current" badge={CURRENT_TASKS.length} tasks={CURRENT_TASKS} showAddRow defaultOpen />
                <TableSection title="Overdue" tasks={[]} defaultOpen={false} />
                <TableSection title="Completed" tasks={[]} defaultOpen={false} />
              </>
            )}
          </Box>

        </ScrollView>
      </Box>

      {/* ── Chat Panel ── */}
      <Box flex={1} backgroundColor="grey01" borderLeftWidth={1} borderColor="border" style={{ height: '100%' as any, maxWidth: 550 }}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="card" borderBottomWidth={1} borderColor="border" style={{ height: 72, paddingHorizontal: 20 }}>
          <Box flexDirection="row" alignItems="center" gap="12">
            <Image source={require('@/assets/images/sample-one.jpg')} style={{ width: 44, height: 44, borderRadius: 22 }} />
            <Text variant="webLabelEmphasized" color="foreground">Linda Smith</Text>
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
              <Image source={require('@/assets/images/sample-one.jpg')} style={{ width: 40, height: 40, borderRadius: 20, marginTop: 2 }} />
              <Box flex={1}>
                <Box flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>Linda Smith</Text>
                  <Text style={{ fontSize: 11, color: theme.colors.grey04 }}>12:25 PM</Text>
                </Box>
                <Box borderWidth={1} borderColor="border" style={{ borderRadius: 10, overflow: 'hidden' as any }}>
                  <Box flexDirection="row" alignItems="center" gap="8" style={{ padding: 10, backgroundColor: '#f9eefa' }}>
                    <UserCheck size={13} color={theme.colors.darkMagenta} />
                    <Text style={{ fontSize: 12, color: theme.colors.darkMagenta, fontWeight: '500' }}>Member Activity</Text>
                  </Box>
                  <Box backgroundColor="card" style={{ padding: 12 }}>
                    <Text style={{ fontSize: 14, color: theme.colors.textSecondary, marginBottom: 10, lineHeight: 20 }}>You've been added to this project</Text>
                    <Box flexDirection="row" alignItems="center" gap="8" style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, alignSelf: 'flex-start' as any }}>
                      <Folder size={12} color={theme.colors.white} />
                      <Text style={{ fontSize: 12, color: theme.colors.white, fontWeight: '500' }}>Raintree Hollow Court Ren...</Text>
                    </Box>
                  </Box>
                </Box>
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
              <Pressable style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.foreground, alignItems: 'center', justifyContent: 'center' }}>
                <Send size={18} color={theme.colors.white} />
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
        <Box alignItems="center" justifyContent="center" style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: theme.colors.lightMint, marginBottom: 8 }}>
          <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.purple }}>
            <Text style={{ fontWeight: '700', color: theme.colors.white, fontSize: 15 }}>AZ</Text>
          </Box>
        </Box>
        <Image source={require('@/assets/images/sample-two.jpg')} style={{ width: 44, height: 44, borderRadius: 22, marginBottom: 8 }} />
        <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.orange }}>
          <Text style={{ fontWeight: '700', color: theme.colors.white, fontSize: 14 }}>TH</Text>
        </Box>
      </Box>

      {/* ── FAB: Chat ── */}
      <Pressable
        style={{
          position: 'absolute' as any,
          bottom: 24, right: 24, zIndex: 40,
          width: 52, height: 52, borderRadius: 26,
          backgroundColor: theme.colors.foreground,
          alignItems: 'center', justifyContent: 'center',
          ...Platform.select({
            web: { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } as any,
            default: { elevation: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
          }),
        }}
      >
        <MessageCircle size={22} color={theme.colors.white} />
      </Pressable>

      {/* ── Modal: Project Onboarding 5 ── */}
      {modalVisible && viewVariant !== 'pending' && (
        <Box style={{ position: 'absolute' as any, right: 550 + 72 + 16, bottom: 16, zIndex: 50 }}>
          <Box backgroundColor="card" width={440} style={{ borderRadius: 16, padding: 24, ...Platform.select({ web: { boxShadow: '0px 5px 12px rgba(0,0,0,0.1)' } as any, default: { elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 12 } }) }}>
            <Box flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: 24 }}>
              <Box width={40} height={40} alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.purple, borderRadius: 8 }}>
                <HardHat size={20} color={theme.colors.white} />
              </Box>
              <Box flex={1}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.foreground, lineHeight: 21, marginBottom: 2 }}>Raintree Hollow Court Renovation</Text>
                <Text style={{ fontSize: 12, color: theme.colors.grey04, lineHeight: 16 }}>You've been added to this project</Text>
              </Box>
            </Box>
            <Box gap="16">
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>What you can do</Text>
              {WHAT_YOU_CAN_DO.map(({ Icon, title, desc }, i) => (
                <Box key={i} flexDirection="row" alignItems="center" gap="12">
                  <Box width={40} height={40} alignItems="center" justifyContent="center" backgroundColor="grey02" style={{ borderRadius: 8 }}>
                    <Icon size={16} color={theme.colors.grey05} />
                  </Box>
                  <Box flex={1}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground, lineHeight: 16 }}>{title}</Text>
                    <Text style={{ fontSize: 12, color: theme.colors.grey04, lineHeight: 16 }}>{desc}</Text>
                  </Box>
                </Box>
              ))}
            </Box>
            <Pressable onPress={() => setModalVisible(false)} style={{ marginTop: 24, height: 48, backgroundColor: theme.colors.black, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>Go to Project</Text>
            </Pressable>
          </Box>
        </Box>
      )}
    </Box>
  );
}
