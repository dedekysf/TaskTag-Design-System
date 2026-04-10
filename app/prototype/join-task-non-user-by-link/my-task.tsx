import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronRight,
  Equal,
  Folder,
  Hash,
  HelpCircle,
  Link,
  ListChecks,
  ListFilter,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Search,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import ReactDOM from 'react-dom';

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: true },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

// ── Project config (icon + color per project) ─────────────────────────────────
const PROJECT_CONFIG: Record<string, { Icon: any; color: string }> = {
  'Electrical Board Service':   { Icon: Zap,       color: '#ff4444' },
  '11 N Raintree Hollow Court': { Icon: Building2, color: '#1572a1' },
  'LA Avenue 37 D':             { Icon: Building2, color: '#1572a1' },
  'LA Avenue 34 G':             { Icon: Zap,       color: '#ff4444' },
};

// ── People (initial avatars) ──────────────────────────────────────────────────
const PEOPLE = [
  { initials: 'JL', color: '#a85796' },
  { initials: 'AS', color: '#e6b566' },
  { initials: 'OH', color: '#cc7351' },
];

// ── Task type ─────────────────────────────────────────────────────────────────
type Task = {
  id: number;
  name: string;
  project: string;
  items: number | null;
  priority: string;
  date: string;
  people: number[];
  extra?: number;
  assigneeLabel: string | null;
};

// ── Task data ─────────────────────────────────────────────────────────────────
const INITIAL_CURRENT_TASKS: Task[] = [
  { id: 1, name: 'Ensure all components within the electric...', project: 'Electrical Board Service', items: null, priority: 'high', date: 'Oct 18', people: [], assigneeLabel: 'Assignee' },
  { id: 2, name: 'Fix the sink', project: '11 N Raintree Hollow Court', items: 3, priority: 'high', date: 'Oct 18', people: [0], assigneeLabel: null },
  { id: 3, name: 'Install new door locks', project: '11 N Raintree Hollow Court', items: 5, priority: 'low', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
  { id: 4, name: 'Paint the living room', project: 'LA Avenue 37 D', items: 5, priority: 'medium', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
  { id: 5, name: 'Repair the leaky roof', project: 'LA Avenue 34 G', items: 4, priority: 'high', date: 'Oct 18', people: [0, 1], assigneeLabel: null },
  { id: 6, name: 'Replace light bulbs', project: 'LA Avenue 34 G', items: 3, priority: 'high', date: 'Oct 18', people: [0, 1, 2], extra: 2, assigneeLabel: null },
  { id: 7, name: 'Service the air conditioner', project: 'LA Avenue 34 G', items: null, priority: 'high', date: 'Oct 18', people: [0, 1], assigneeLabel: null },
  { id: 8, name: 'Unclog the bathroom drain', project: '11 N Raintree Hollow Court', items: 3, priority: 'medium', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
];

const OVERDUE_TASKS: Task[] = [
  { id: 101, name: 'Check electrical panel connections', project: 'Electrical Board Service', items: 2, priority: 'high', date: 'Oct 10', people: [0, 1], assigneeLabel: null },
  { id: 102, name: 'Patch ceiling damage', project: '11 N Raintree Hollow Court', items: 3, priority: 'medium', date: 'Oct 12', people: [0], assigneeLabel: null },
  { id: 103, name: 'Replace broken window seal', project: 'LA Avenue 37 D', items: null, priority: 'low', date: 'Oct 14', people: [0, 1, 2], assigneeLabel: null },
];

const INITIAL_COMPLETED_TASKS: Task[] = [
  { id: 201, name: 'Update door hinges', project: 'LA Avenue 34 G', items: null, priority: 'low', date: 'Oct 5', people: [0], assigneeLabel: null },
  { id: 202, name: 'Clean gutters', project: '11 N Raintree Hollow Court', items: 2, priority: 'medium', date: 'Oct 8', people: [0, 1], assigneeLabel: null },
];

// ── Local Tooltip (matches team-detail style) ─────────────────────────────────
function Tooltip({
  label,
  children,
  variant = 'default',
  forceOpen = false,
  align = 'right',
}: {
  label: string;
  children: React.ReactNode;
  variant?: 'default' | 'success';
  forceOpen?: boolean;
  align?: 'left' | 'right';
}) {
  const theme = useTheme<Theme>();
  const [hovered, setHovered] = useState(false);
  const triggerRef = useRef<View>(null);
  const [pos, setPos] = useState<{ top: number; left?: number; right?: number } | null>(null);
  const visible = hovered || forceOpen;
  const isSuccess = variant === 'success';

  const measure = React.useCallback(() => {
    const el = triggerRef.current as any;
    if (!el) return;
    if (typeof el.getBoundingClientRect === 'function') {
      const rect = el.getBoundingClientRect();
      const ww = window.innerWidth;
      setPos({ top: rect.bottom + 6, ...(align === 'left' ? { left: rect.left } : { right: ww - rect.right }) });
    } else {
      el.measureInWindow((x: number, y: number, w: number, h: number) => {
        const ww = typeof window !== 'undefined' ? window.innerWidth : 1200;
        setPos({ top: y + h + 6, ...(align === 'left' ? { left: x } : { right: ww - (x + w) }) });
      });
    }
  }, [align]);

  React.useEffect(() => { if (forceOpen) measure(); }, [forceOpen, measure]);

  const tooltipBox = (
    <Box
      style={{
        backgroundColor: isSuccess ? theme.colors.white : theme.colors.grey06,
        borderRadius: 4,
        paddingHorizontal: isSuccess ? 12 : 8,
        paddingVertical: isSuccess ? 8 : 4,
        ...(isSuccess ? { borderWidth: 1, borderColor: theme.colors.border } : {}),
        ...Platform.select({ web: { whiteSpace: 'nowrap', ...(isSuccess ? { boxShadow: '0px 5px 25px 0px rgba(0,0,0,0.05)' } : {}) } as any }),
      }}
    >
      {isSuccess ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CheckCircle size={16} color={theme.colors.secondaryGreen} />
          <Text numberOfLines={1} style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: '400', whiteSpace: 'nowrap' as any }}>{label}</Text>
        </View>
      ) : (
        <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '500' }}>{label}</Text>
      )}
    </Box>
  );

  return (
    <>
      <View
        ref={triggerRef}
        {...Platform.select({ web: { onMouseEnter: () => { setHovered(true); measure(); }, onMouseLeave: () => setHovered(false) } as any })}
      >
        {children}
      </View>
      {visible && pos && (Platform.OS === 'web' ? ReactDOM.createPortal(
        <View style={{ position: 'fixed' as any, top: pos.top, ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }), zIndex: 999999, pointerEvents: 'none' }}>
          {tooltipBox}
        </View>,
        document.body
      ) : null)}
    </>
  );
}

// ── Priority badge ─────────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const theme = useTheme<Theme>();
  const config = {
    high:   { color: theme.colors.alertRed,       Icon: ChevronsUp },
    medium: { color: '#f59e0b',                   Icon: Equal },
    low:    { color: theme.colors.blue,           Icon: ChevronsDown },
  }[priority] ?? { color: theme.colors.grey04, Icon: Equal };
  return (
    <Box width={36} height={36} borderRadius="full" alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border }}>
      <config.Icon size={16} color={config.color} />
    </Box>
  );
}

// ── Date badge ────────────────────────────────────────────────────────────────
function DateBadge({ date }: { date: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
      <Calendar size={14} color={theme.colors.grey06} />
      <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>{date}</Text>
    </Box>
  );
}

// ── Assignee badge ────────────────────────────────────────────────────────────
function AssigneeBadge() {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
      <UserPlus size={14} color={theme.colors.grey06} />
      <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>Assignee</Text>
    </Box>
  );
}

// ── Initial avatars ───────────────────────────────────────────────────────────
function InitialAvatars({ indices, extra }: { indices: number[]; extra?: number }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" style={{ minWidth: 108 }}>
      {indices.map((idx, i) => {
        const person = PEOPLE[idx % PEOPLE.length];
        return (
          <Box
            key={i}
            borderRadius="full"
            style={{ marginLeft: i > 0 ? -8 : 0, zIndex: indices.length - i, borderWidth: 1.5, borderColor: theme.colors.background }}
          >
            <Avatar size="sm" type="text" initials={person.initials} color={person.color} />
          </Box>
        );
      })}
      {extra && extra > 0 && (
        <Box width={32} height={32} borderRadius="full" backgroundColor="grey03" alignItems="center" justifyContent="center" style={{ marginLeft: -8, zIndex: 0, borderWidth: 1.5, borderColor: theme.colors.background }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.grey06 }}>+{extra}</Text>
        </Box>
      )}
    </Box>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onComplete, completed = false }: { task: Task; onComplete?: () => void; completed?: boolean }) {
  const theme = useTheme<Theme>();
  const [isChecked, setIsChecked] = useState(completed);
  const [checkHovered, setCheckHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const projConfig = PROJECT_CONFIG[task.project] ?? { Icon: Building2, color: theme.colors.grey04 };

  const handlePress = () => {
    if (completed || isChecked) return;
    setIsChecked(true);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -6, duration: 280, useNativeDriver: true }),
    ]).start(() => { onComplete?.(); });
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Box
        flexDirection="row"
        alignItems="center"
        borderTopWidth={1}
        borderColor="border"
        style={{ minHeight: 52, paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
      >
        {/* Checkbox */}
        <Pressable
          onPress={handlePress}
          {...(Platform.OS === 'web' && !completed ? {
            onMouseEnter: () => setCheckHovered(true),
            onMouseLeave: () => setCheckHovered(false),
          } : {})}
          style={{
            width: 20, height: 20, borderRadius: 10,
            borderWidth: 1.5,
            borderColor: isChecked ? theme.colors.secondaryGreen : theme.colors.grey04,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: isChecked ? theme.colors.secondaryGreen : checkHovered ? theme.colors.grey03 : 'transparent',
            flexShrink: 0,
            ...Platform.select({ web: { cursor: completed ? 'default' : 'pointer' } as any }),
          }}
        >
          {(isChecked || checkHovered) && (
            <Check size={11} color={isChecked ? '#fff' : theme.colors.grey05} />
          )}
        </Pressable>

        {/* Name + project */}
        <Box flex={1} style={{ gap: 4, minWidth: 0 }}>
          <Text
            variant="webSecondaryBody"
            numberOfLines={1}
            style={{ color: theme.colors.foreground, ...(completed ? { textDecorationLine: 'line-through', opacity: 0.5 } : {}) }}
          >
            {task.name}
          </Text>
          <Box flexDirection="row" alignItems="center" gap="4">
            <projConfig.Icon size={11} color={projConfig.color} />
            <Text variant="webMetadataSecondary" style={{ color: theme.colors.grey05 }} numberOfLines={1}>{task.project}</Text>
            {task.items && (
              <Box flexDirection="row" alignItems="center" gap="4">
                <ListChecks size={10} color={theme.colors.grey06} />
                <Text variant="webMetadataSecondary" style={{ color: theme.colors.textSecondary, textDecorationLine: 'underline' }}>{task.items} items</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Priority */}
        <PriorityBadge priority={task.priority} />

        {/* Date */}
        <DateBadge date={task.date} />

        {/* Assignees */}
        {task.assigneeLabel ? (
          <AssigneeBadge />
        ) : (
          <InitialAvatars indices={task.people} extra={task.extra} />
        )}

        {/* Link with tooltip */}
        <Tooltip label={copied ? 'Link copied!' : 'Copy link'} variant={copied ? 'success' : 'default'} forceOpen={copied} align="right">
          <Pressable
            onPress={handleCopyLink}
            style={({ hovered, pressed }: any) => ({
              width: 28, height: 28, borderRadius: 6,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
              cursor: 'pointer' as any,
            })}
          >
            <Link size={16} color={theme.colors.grey06} />
          </Pressable>
        </Tooltip>
      </Box>
    </Animated.View>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({
  label, count, color, bgColor, expanded, onToggle, children,
}: {
  label: string; count?: number; color?: string; bgColor?: string;
  expanded: boolean; onToggle: () => void; children?: React.ReactNode;
}) {
  const theme = useTheme<Theme>();
  const labelColor = color ?? theme.colors.foreground;
  const badgeBg = bgColor ?? theme.colors.grey02;
  const badgeText = color ?? theme.colors.grey05;

  return (
    <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, overflow: 'hidden' as any }}>
      <Pressable onPress={onToggle}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
          <Box flexDirection="row" alignItems="center" gap="8">
            <Text style={{ fontSize: 14, fontWeight: '600', color: labelColor }}>{label}</Text>
            {count !== undefined && (
              <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: badgeBg }}>
                <Text style={{ fontSize: 11, color: badgeText, fontWeight: '500' }}>{count}</Text>
              </Box>
            )}
          </Box>
          {expanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
        </Box>
      </Pressable>
      {expanded && children}
    </Box>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggleCollapsed }: { collapsed: boolean; onToggleCollapsed: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="grey01" borderRightWidth={1} borderColor="border" style={{ width: collapsed ? 72 : 256, height: '100%' as any, paddingHorizontal: 16, paddingVertical: 24, gap: 30, flexShrink: 0 }}>
      {collapsed ? (
        <Box alignItems="center" gap="8">
          <Image source={require('@/assets/images/tt-favicon.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}><ChevronsRight size={20} color={theme.colors.grey04} /></Pressable>
        </Box>
      ) : (
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Image source={require('@/assets/images/tasktag-logo.png')} style={{ width: 96, height: 24 }} resizeMode="contain" />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}><ChevronsLeft size={24} color={theme.colors.grey04} /></Pressable>
        </Box>
      )}
      <Box flex={1} style={{ paddingTop: 16 }}>
        <Box flex={1} justifyContent="space-between">
          <Box gap="8">
            {NAV_ITEMS.map(({ key, label, Icon, active }) =>
              collapsed ? (
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
            )}
          </Box>
          <Box gap="8">
            {!collapsed && (
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
            {collapsed ? (
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
            {collapsed ? (
              <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                </Box>
              </Box>
            ) : (
              <Box flexDirection="row" alignItems="center" gap="8" style={{ height: 54, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 15 }}>
                <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                </Box>
                <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>My Profile</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Chat Panel ────────────────────────────────────────────────────────────────
function ChatPanel() {
  const theme = useTheme<Theme>();
  return (
    <Box flex={1} backgroundColor="background" borderLeftWidth={1} borderColor="border" style={{ height: '100%' as any, maxWidth: 550, position: 'relative' as any }}>
      <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="background" style={{ height: 74, paddingHorizontal: 24, paddingVertical: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>Chat</Text>
        <Box flexDirection="row" alignItems="center">
          <Pressable style={{ padding: 4 }}><Search size={24} color={theme.colors.textSecondary} /></Pressable>
          <Pressable style={{ padding: 4 }}><MoreVertical size={24} color={theme.colors.textSecondary} /></Pressable>
          <Pressable style={{ padding: 4 }}><ChevronsRight size={24} color={theme.colors.textSecondary} /></Pressable>
        </Box>
      </Box>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 16 }}>
          <Box width={48} height={48} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelOrange" style={{ flexShrink: 0 } as any}>
            <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 22 }}>TH</Text>
          </Box>
          <Box flex={1} style={{ minWidth: 0, gap: 4 }}>
            <Text variant="webSecondaryBody" color="foreground">Tasktag Helpdesk</Text>
            <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.</Text>
          </Box>
          <Text variant="webMetadataPrimary" color="grey04">Monday</Text>
        </Box>
      </ScrollView>
      <Pressable style={{ position: 'absolute' as any, bottom: 16, right: 16, backgroundColor: theme.colors.foreground, borderRadius: 156, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, gap: 8 }}>
        <MessageSquarePlus size={24} color={theme.colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>New Message</Text>
      </Pressable>
    </Box>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MyTask() {
  const theme = useTheme<Theme>();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(INITIAL_CURRENT_TASKS);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(INITIAL_COMPLETED_TASKS);
  const [currentExpanded, setCurrentExpanded] = useState(true);
  const [overdueExpanded, setOverdueExpanded] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);

  const handleTaskComplete = (taskId: number) => {
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
      setCurrentTasks(prev => prev.filter(t => t.id !== taskId));
      setCompletedTasks(prev => [task, ...prev]);
    }
  };

  return (
    <Box flex={1} flexDirection="row" backgroundColor="background" style={{ height: '100vh' as any }}>
      <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(v => !v)} />

      {/* Main content */}
      <Box flex={1} style={{ height: '100%' as any, overflow: 'hidden' as any }}>
        {/* Top bar */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="border" style={{ height: 64, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.foreground }}>My Tasks</Text>
          <Box flexDirection="row" alignItems="center" gap="8">
            <Pressable style={{ padding: 6 }}>
              <Search size={20} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={({ hovered, pressed }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 6,
              backgroundColor: hovered ? theme.colors.grey05 : pressed ? theme.colors.grey06 : theme.colors.black,
              borderRadius: 40, paddingHorizontal: 16, paddingVertical: 8,
              cursor: 'pointer' as any,
            })}>
              <Plus size={15} color="#fff" />
              <Text variant="labelMedium" style={{ color: '#fff' }}>New Task</Text>
            </Pressable>
          </Box>
        </Box>

        {/* Filter bar */}
        <Box flexDirection="row" alignItems="center" gap="4" borderBottomWidth={1} borderColor="border" style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
          <Pressable style={({ hovered, pressed }: any) => ({
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
            backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
            cursor: 'pointer' as any,
          })}>
            <ListFilter size={15} color={theme.colors.black} />
            <Text variant="webBody" color="black">Filter</Text>
          </Pressable>
          <Pressable style={({ hovered, pressed }: any) => ({
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
            backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
            cursor: 'pointer' as any,
          })}>
            <ArrowDownUp size={15} color={theme.colors.black} />
            <Text variant="webBody" color="black">Sort</Text>
          </Pressable>
          <Pressable style={({ hovered, pressed }: any) => ({
            flexDirection: 'row', alignItems: 'center', gap: 8,
            paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
            backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
            cursor: 'pointer' as any,
          })}>
            <Calendar size={15} color={theme.colors.black} />
            <Text variant="webBody" color="black">Add to calendar</Text>
          </Pressable>
        </Box>

        {/* Task sections */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>

          {/* Current */}
          <SectionCard
            label="Current" count={currentTasks.length}
            expanded={currentExpanded} onToggle={() => setCurrentExpanded(v => !v)}
          >
            {currentTasks.map((task) => (
              <TaskRow key={task.id} task={task} onComplete={() => handleTaskComplete(task.id)} />
            ))}
            <Box borderTopWidth={1} borderColor="border" style={{ paddingHorizontal: 52, paddingVertical: 18 }}>
              <TextInput
                placeholder="Enter task name..."
                placeholderTextColor={theme.colors.grey05}
                style={{ fontSize: 14, color: theme.colors.foreground, outlineStyle: 'none' } as any}
              />
            </Box>
          </SectionCard>

          {/* Overdue */}
          <SectionCard
            label="Overdue" count={OVERDUE_TASKS.length}
            expanded={overdueExpanded} onToggle={() => setOverdueExpanded(v => !v)}
          >
            {OVERDUE_TASKS.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </SectionCard>

          {/* Completed */}
          <SectionCard
            label="Completed" count={completedTasks.length}
            expanded={completedExpanded} onToggle={() => setCompletedExpanded(v => !v)}
          >
            {completedTasks.map((task) => (
              <TaskRow key={task.id} task={task} completed />
            ))}
          </SectionCard>

        </ScrollView>
      </Box>

      <ChatPanel />
    </Box>
  );
}
