import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { CalendarDays, Check, Copy, FileText, MoreHorizontal, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable } from 'react-native';

// ── Shared Types ──────────────────────────────────────────────────────────────

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskSectionType = 'current' | 'overdue' | 'completed';

export interface TaskAssignee {
  name: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  priority: TaskPriority;
  dueDate: Date | null;
  assignees: TaskAssignee[];
  checklistCount?: number;
  checklistTotal?: number;
  completed: boolean;
  originalSection?: TaskSectionType;
}

// ── Constants ─────────────────────────────────────────────────────────────────

export const PRIORITY_COLOR: Record<TaskPriority, string> = {
  high: '#FF4444',
  medium: '#F59E0B',
  low: '#94A3B8',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDueDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
}

export function isDueDateOverdue(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d < today;
}

// ── Props ──────────────────────────────────────────────────────────────────────

export interface ProjectTaskItemProps {
  task: Task;
  sectionType: TaskSectionType;
  onComplete: () => void;
  onUncomplete?: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectTaskItem({
  task,
  sectionType,
  onComplete,
  onUncomplete,
  onDelete,
  onDuplicate,
}: ProjectTaskItemProps) {
  const theme = useTheme<Theme>();
  const [menuOpen, setMenuOpen] = useState(false);

  const overdue = task.dueDate && isDueDateOverdue(task.dueDate) && !task.completed;
  const MAX_VISIBLE = 3;
  const visibleAssignees = task.assignees.slice(0, MAX_VISIBLE);
  const overflowCount = task.assignees.length - MAX_VISIBLE;

  const handleToggleComplete = () => {
    if (task.completed) {
      onUncomplete?.();
    } else {
      onComplete();
    }
    setMenuOpen(false);
  };

  return (
    <Pressable
      onPress={() => { if (menuOpen) setMenuOpen(false); }}
      style={({ hovered }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        gap: 10,
        backgroundColor: menuOpen ? theme.colors.grey01 : hovered ? theme.colors.grey01 : 'white',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      })}
    >
      {/* Complete toggle */}
      <Pressable
        onPress={handleToggleComplete}
        hitSlop={8}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: task.completed ? theme.colors.secondaryGreen : theme.colors.grey04,
          backgroundColor: task.completed ? theme.colors.secondaryGreen : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {task.completed && <Check size={11} color="white" strokeWidth={2.5} />}
      </Pressable>

      {/* Priority dot */}
      <Box
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: PRIORITY_COLOR[task.priority],
          flexShrink: 0,
        }}
      />

      {/* Task name */}
      <Text
        numberOfLines={1}
        style={{
          flex: 1,
          fontSize: 14,
          color: task.completed ? theme.colors.grey04 : theme.colors.textPrimary,
          fontFamily: 'Inter_400Regular',
          textDecorationLine: task.completed ? 'line-through' : 'none',
          lineHeight: 20,
        }}
      >
        {task.name}
      </Text>

      {/* Right indicators */}
      <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
        {/* Checklist count badge */}
        {task.checklistCount !== undefined && (
          <Box
            flexDirection="row"
            alignItems="center"
            style={{
              gap: 3,
              backgroundColor: theme.colors.grey02,
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <FileText size={11} color={theme.colors.grey05} />
            <Text style={{ fontSize: 11, color: theme.colors.grey05, lineHeight: 16 }}>
              {task.checklistCount}/{task.checklistTotal ?? task.checklistCount}
            </Text>
          </Box>
        )}

        {/* Due date chip */}
        {task.dueDate && (
          <Box
            flexDirection="row"
            alignItems="center"
            style={{
              gap: 3,
              backgroundColor: overdue ? '#FFF0F0' : theme.colors.grey02,
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <CalendarDays size={11} color={overdue ? theme.colors.alertRed : theme.colors.grey05} />
            <Text style={{ fontSize: 11, color: overdue ? theme.colors.alertRed : theme.colors.grey05, lineHeight: 16 }}>
              {formatDueDate(task.dueDate)}
            </Text>
          </Box>
        )}

        {/* Assignee avatars — stacked, max 3 */}
        {visibleAssignees.length > 0 && (
          <Box flexDirection="row" alignItems="center">
            {visibleAssignees.map((a, i) => (
              <Box key={i} style={{ marginLeft: i > 0 ? -6 : 0, zIndex: MAX_VISIBLE - i }}>
                <Avatar size="xs" type="text" initials={a.initials} color={a.color} />
              </Box>
            ))}
            {overflowCount > 0 && (
              <Box
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: theme.colors.grey03,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: -6,
                  borderWidth: 1.5,
                  borderColor: 'white',
                }}
              >
                <Text style={{ fontSize: 9, color: theme.colors.grey05, fontWeight: '600' }}>
                  +{overflowCount}
                </Text>
              </Box>
            )}
          </Box>
        )}

        {/* Context menu */}
        <Box style={{ position: 'relative' }}>
          <Pressable
            onPress={() => setMenuOpen(!menuOpen)}
            hitSlop={8}
            style={({ hovered }: any) => ({
              width: 28,
              height: 28,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: menuOpen || hovered ? theme.colors.grey02 : 'transparent',
            })}
          >
            <MoreHorizontal size={16} color={theme.colors.grey05} />
          </Pressable>

          {menuOpen && (
            <>
              {/* Backdrop to close menu */}
              <Pressable
                onPress={() => setMenuOpen(false)}
                style={{
                  position: Platform.OS === 'web' ? 'fixed' as any : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 9998,
                }}
              />
              <Box
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 32,
                  zIndex: 9999,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  width: 180,
                  overflow: 'hidden',
                  ...Platform.select({
                    web: { boxShadow: '0px 4px 16px rgba(0,0,0,0.12)' } as any,
                    default: {
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.12,
                      shadowRadius: 8,
                      elevation: 8,
                    },
                  }),
                }}
              >
                <MenuAction
                  label={task.completed ? 'Mark as Current' : 'Mark as Complete'}
                  icon={Check}
                  onPress={handleToggleComplete}
                />
                <MenuAction
                  label="Duplicate"
                  icon={Copy}
                  onPress={() => { onDuplicate(); setMenuOpen(false); }}
                />
                <Box style={{ height: 1, backgroundColor: theme.colors.border }} />
                <MenuAction
                  label="Delete"
                  icon={Trash2}
                  onPress={() => { onDelete(); setMenuOpen(false); }}
                  danger
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Pressable>
  );
}

// ── Menu Action ───────────────────────────────────────────────────────────────

function MenuAction({
  label,
  icon: Icon,
  onPress,
  danger = false,
}: {
  label: string;
  icon: any;
  onPress: () => void;
  danger?: boolean;
}) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={onPress}
      style={({ hovered }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingHorizontal: 14,
        paddingVertical: 11,
        backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
      })}
    >
      <Icon size={15} color={danger ? theme.colors.alertRed : theme.colors.textPrimary} />
      <Text
        style={{
          fontSize: 13,
          color: danger ? theme.colors.alertRed : theme.colors.textPrimary,
          fontFamily: 'Inter_400Regular',
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}
