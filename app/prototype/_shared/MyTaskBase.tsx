import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Equal,
  ChevronsDown,
  ChevronsUp,
  Folder,
  Hash,
  HelpCircle,
  Link,
  ListFilter,
  MoreVertical,
  Plus,
  Search,
  SortDesc,
  TriangleAlert,
  User,
  UserPlus,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView } from 'react-native';
import JoinTasktagSignup from '../join-task-non-user/join-tasktag-signup';

// ─── Wireframe Task Row ───────────────────────────────────────────────────────

type WireframeTask = {
  namebar: number;
  subtasks?: number;
  priority: 'high' | 'medium' | 'low';
  avatars: number;
};

const CURRENT_TASKS: WireframeTask[] = [
  { namebar: 140, subtasks: 3, priority: 'high', avatars: 1 },
  { namebar: 180,              priority: 'low',  avatars: 2 },
  { namebar: 160,              priority: 'low',  avatars: 2 },
];

function PriorityIcon({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const theme = useTheme<Theme>();
  const Icon = { high: ChevronsUp, medium: Equal, low: ChevronsDown }[priority];
  return (
    <Box width={36} height={36} borderRadius="full" alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.grey03 }}>
      <Icon size={15} color={theme.colors.grey03} />
    </Box>
  );
}

function WireframeTaskRow({ task, isLast }: { task: WireframeTask; isLast: boolean }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" paddingHorizontal="md" borderBottomWidth={isLast ? 0 : 1} borderColor="border" style={{ minHeight: 64, paddingVertical: 10, gap: 12 }}>
      {/* Checkbox */}
      <Box width={22} height={22} borderRadius="full" style={{ borderWidth: 1.5, borderColor: theme.colors.grey03, flexShrink: 0 }} />

      {/* Name + meta */}
      <Box flex={1} style={{ gap: 4 }}>
        <Box style={{ width: task.namebar, height: 14, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
        <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
          <Box style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: theme.colors.grey03 }} />
          <Box style={{ width: 160, height: 11, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
          {task.subtasks !== undefined && (
            <Box flexDirection="row" alignItems="center" gap="4">
              <SortDesc size={12} color={theme.colors.grey03} />
              <Box style={{ width: 44, height: 11, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
            </Box>
          )}
        </Box>
      </Box>

      {/* Priority */}
      <PriorityIcon priority={task.priority} />

      {/* Date */}
      <Box flexDirection="row" alignItems="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.grey03, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
        <Calendar size={13} color={theme.colors.grey03} />
        <Box style={{ width: 44, height: 12, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
      </Box>

      {/* Assignee */}
      <Box flexDirection="row" alignItems="center" style={{ minWidth: 80 }}>
        {task.avatars > 0 ? Array.from({ length: task.avatars }).map((_, i) => (
          <Box key={i} width={30} height={30} borderRadius="full" style={{ marginLeft: i > 0 ? -10 : 0, zIndex: task.avatars - i, borderWidth: 2, borderColor: theme.colors.card, backgroundColor: theme.colors.grey03 }} />
        )) : null}
      </Box>

      {/* Link */}
      <Link size={16} color={theme.colors.grey03} />
    </Box>
  );
}

function TaskSection({ title, badge, tasks, defaultOpen = true }: { title: string; badge?: number; tasks: WireframeTask[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 12, marginHorizontal: 16, marginBottom: 12, overflow: 'hidden' as any }}>
      <Pressable onPress={() => setOpen(v => !v)}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal="md" borderBottomWidth={open ? 1 : 0} borderColor="border" style={{ height: 56 }}>
          <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: theme.colors.foreground }}>{title}</Text>
            {badge !== undefined && (
              <Box width={22} height={22} alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.grey01, borderRadius: 11, borderWidth: 1, borderColor: theme.colors.border }}>
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
            <WireframeTaskRow key={i} task={task} isLast={i === tasks.length - 1} />
          ))}
          {/* Add row */}
          <Box flexDirection="row" alignItems="center" paddingHorizontal="md" style={{ height: 52 }}>
            <Text style={{ fontSize: 14, color: theme.colors.grey03 }}>Enter task name...</Text>
          </Box>
        </>
      )}
    </Box>
  );
}

// ─── Main Layout ─────────────────────────────────────────────────────────────

export default function MyTaskBase() {
  const theme = useTheme<Theme>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box flex={1} flexDirection="row" backgroundColor="background" style={{ height: '100%' as any, position: 'relative' as any }}>

      {/* ── Left area: Sidebar + Main Content + Overlay ── */}
      <Box flex={1} flexDirection="row" style={{ position: 'relative' as any, height: '100%' as any }}>

      {/* ── Sidebar ── */}
      <Box
        backgroundColor="grey01"
        borderRightWidth={1}
        borderColor="border"
        style={{ width: sidebarCollapsed ? 72 : 256, maxWidth: 256, height: '100%' as any, paddingHorizontal: 16, paddingVertical: 24, gap: 30 }}
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

              {/* Projects — wireframe */}
              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                  <Folder size={22} color={theme.colors.grey03} />
                </Box>
              ) : (
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                  <Folder size={24} color={theme.colors.grey03} />
                  <Box style={{ width: 72, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                </Box>
              )}

              {/* My Tasks — active */}
              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.lightMint, alignSelf: 'center' }}>
                  <Hash size={22} color={theme.colors.secondaryGreen} />
                </Box>
              ) : (
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15, backgroundColor: theme.colors.lightMint }}>
                  <Hash size={24} color={theme.colors.secondaryGreen} />
                  <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>My Tasks</Text>
                </Box>
              )}

              {/* Global Activity + Contacts — wireframe */}
              {sidebarCollapsed ? (
                <Box gap="8">
                  {[Activity, Users].map((Icon, i) => (
                    <Box key={i} alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                      <Icon size={22} color={theme.colors.grey03} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box gap="8">
                  {[{ Icon: Activity, w: 130 }, { Icon: Users, w: 90 }].map(({ Icon, w }, i) => (
                    <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon size={24} color={theme.colors.grey03} />
                      <Box style={{ width: w, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box gap="8">
              <Box height={1} backgroundColor="border" />
              {/* Help + Profile — wireframe */}
              {sidebarCollapsed ? (
                <Box gap="8">
                  {[HelpCircle, User].map((Icon, i) => (
                    <Box key={i} alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                      <Icon size={22} color={theme.colors.grey03} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box gap="8">
                  {[{ Icon: HelpCircle, w: 80 }, { Icon: User, w: 100 }].map(({ Icon, w }, i) => (
                    <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon size={24} color={theme.colors.grey03} />
                      <Box style={{ width: w, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any }}>

        {/* Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" paddingHorizontal="md" borderBottomWidth={1} borderColor="border" backgroundColor="card" style={{ height: 64 }}>
          <Text variant="webHeading22" style={{ fontWeight: '700' }}>My Tasks</Text>
          <Box flexDirection="row" alignItems="center" gap="16">
            <Pressable hitSlop={8}><Search size={22} color={theme.colors.grey05} /></Pressable>
            <Button
              variant="fill"
              color="secondary"
              size="sm"
              disabled
              style={{ borderRadius: 40, minWidth: 122 }}
            >
              <Box flexDirection="row" alignItems="center" gap="8">
                <Plus size={16} color={theme.colors.grey05} />
                <Text variant="labelMedium" color="grey05">New Task</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

          {/* Toolbar */}
          <Box flexDirection="row" alignItems="center" gap="8" paddingHorizontal="md" style={{ height: 56 }}>
            {[{ Icon: ListFilter, label: 'Filter' }, { Icon: ArrowDownUp, label: 'Sort' }, { Icon: Calendar, label: 'Add to calendar' }].map(({ Icon, label }) => (
              <Pressable
                key={label}
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row', alignItems: 'center', gap: 6,
                  borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6,
                  backgroundColor: hovered || pressed ? theme.colors.grey02 : 'transparent',
                })}
              >
                <Icon size={15} color={theme.colors.textSecondary} />
                <Text variant="webBody" color="textSecondary">{label}</Text>
              </Pressable>
            ))}
          </Box>

          {/* Task sections */}
          <Box style={{ paddingTop: 4 }}>
            <TaskSection title="Current" badge={CURRENT_TASKS.length} tasks={CURRENT_TASKS} defaultOpen />
            <TaskSection title="Overdue" badge={3} tasks={[]} defaultOpen={false} />
            <TaskSection title="Completed" tasks={[]} defaultOpen={false} />
          </Box>

        </ScrollView>
      </Box>

      </Box>{/* end left area */}

      {/* ── Overlay: covers sidebar + main + behind task detail ── */}
      <Box
        style={{
          position: 'absolute' as any, top: 0, left: 0, right: 550, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 20,
        }}
        pointerEvents="none"
      />

      {/* ── Task Detail Panel ── */}
      <Box
        backgroundColor="card"
        borderLeftWidth={1}
        borderColor="border"
        style={{ position: 'absolute' as any, top: 0, bottom: 0, right: 550, width: 580, zIndex: 30 }}
      >
        {/* Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, height: 56, borderBottomWidth: 1, borderColor: theme.colors.border }}>
          <Box flexDirection="row" alignItems="center" gap="8" flex={1} flexShrink={1}>
            <Building2 size={14} color={theme.colors.purple} />
            <Text variant="webMetadataPrimary" color="textSecondary" numberOfLines={1} style={{ textDecorationLine: 'underline', flexShrink: 1 }}>
              Electrical Board Service...
            </Text>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="4">
            <Pressable disabled hitSlop={8} style={{ padding: 6, opacity: 0.4 }}>
              <Link size={18} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable disabled hitSlop={8} style={{ padding: 6, opacity: 0.4 }}>
              <MoreVertical size={18} color={theme.colors.textSecondary} />
            </Pressable>
          </Box>
        </Box>

        {/* Task name + Description */}
        <Box style={{ padding: 16 }}>
          <Text variant="webLargeLabel" color="textSecondary" style={{ marginBottom: 12 }}>
            Comprehensive Electrical Board Inspection and Reconfiguration
          </Text>

          {/* Priority + Date */}
          <Box flexDirection="row" alignItems="center" style={{ gap: 8, marginBottom: 16 }}>
            <Box width={36} height={36} borderRadius="full" alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border }}>
              <ChevronsUp size={16} color={theme.colors.orange} />
            </Box>
            <Box flexDirection="row" alignItems="center" style={{ gap: 8, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Calendar size={15} color={theme.colors.textSecondary} />
              <Text variant="webMetadataPrimary" color="textSecondary">Oct 15 - 18</Text>
            </Box>
          </Box>

          <Box backgroundColor="grey01" style={{ borderRadius: 8, padding: 16 }}>
            <Text variant="webLabelEmphasized" color="foreground" style={{ marginBottom: 8 }}>Description</Text>
            <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 20 }}>
              Ensure all components within the electrical board are thoroughly inspected and reconfigured as needed to meet safety and operational standards.
            </Text>
          </Box>
        </Box>

        {/* Empty state */}
        <Box flex={1} alignItems="center" justifyContent="center" minHeight={520}>
          <Box alignItems="center" style={{ gap: 16 }}>
            <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
            <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
              {"You're assigned a task by "}
              <Text variant="webHeading22" fontWeight="700">James Hammer</Text>
            </Text>
          </Box>
          <Button
            variant="fill"
            size="lg"
            style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.foreground, marginTop: 16 }}
            onPress={() => setShowSignupModal(true)}
          >
            <Text color="white" variant="labelMedium">Join This Task</Text>
          </Button>
        </Box>
      </Box>

      {/* ── Chat Panel ── */}
      <Box backgroundColor="card" borderLeftWidth={1} borderColor="border" style={{ width: 550, maxWidth: 550, height: '100%' as any }}>
        <Box flexDirection="row" alignItems="center" style={{ height: 64, paddingHorizontal: 24 }}>
          <Text variant="webHeading22" color="foreground" style={{ fontWeight: '600' }}>Chat</Text>
        </Box>
        <Box style={{ paddingHorizontal: 6 }}>
          <Box flexDirection="row" alignItems="flex-start" style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 16 }}>
            <Box width={48} height={48} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.orange, flexShrink: 0 }}>
              <User size={24} color={theme.colors.white} />
            </Box>
            <Box flex={1} flexDirection="row" alignItems="center" alignSelf="stretch" style={{ minWidth: 0 }}>
              <Box flex={1} style={{ gap: 8 }}>
                <Box style={{ width: 120, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                <Box style={{ width: '85%', height: 12, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
              </Box>
            </Box>
            <Box flexDirection="column" alignSelf="stretch" justifyContent="center" alignItems="flex-end" style={{ gap: 8, flexShrink: 0 }}>
              <Box width={16} height={16} />
              <Box style={{ width: 40, height: 10, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Signup Modal Overlay ── */}
      <Modal visible={showSignupModal} transparent animationType="fade" onRequestClose={() => setShowSignupModal(false)}>
        <Box style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={() => setShowSignupModal(false)} style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }} />
          <Box style={{ width: '100%', maxWidth: 640, maxHeight: '99%', borderRadius: 16, overflow: 'hidden' as any }}>
            <JoinTasktagSignup
              onClose={() => setShowSignupModal(false)}
              onSuccess={() => setShowSignupModal(false)}
            />
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
