import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Calendar, Check, ChevronsDown, ChevronsUp, Link, ListChecks, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Pressable } from 'react-native';

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
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectTaskItem({
  task,
  sectionType,
  onComplete,
  onUncomplete,
}: ProjectTaskItemProps) {
  const theme = useTheme<Theme>();

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
  };

  return (
    <Pressable
      style={({ hovered }: any) => ({
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        gap: 16,
        backgroundColor: hovered ? theme.colors.grey01 : 'white',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      })}
    >
      {/* Left: Checkbox + Task Info */}
      <Box flexDirection="row" alignItems="center" style={{ flex: 1, gap: 16, minWidth: 0 }}>
        {/* Checkbox */}
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

        {/* Task Info column */}
        <Box style={{ flex: 1, gap: 4, minWidth: 0 }}>
          {/* Title */}
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              color: task.completed ? theme.colors.grey04 : theme.colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              textDecorationLine: task.completed ? 'line-through' : 'none',
              lineHeight: 20,
            }}
          >
            {task.name}
          </Text>

          {/* Checklist badge below title */}
          {task.checklistCount !== undefined && (
            <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <ListChecks size={12} color={theme.colors.grey05} strokeWidth={2} />
              <Text style={{ fontSize: 10, color: theme.colors.grey05, fontFamily: 'Inter_400Regular' }}>
                {task.checklistCount} items
              </Text>
            </Box>
          )}
        </Box>
      </Box>

      {/* Right: Priority + Due Date + Assignee + Menu */}
      <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
        {/* Priority button — circular outline */}
        <Box
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.grey03,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            flexShrink: 0,
          }}
        >
          {task.priority === 'high' && (
            <ChevronsUp size={16} color={PRIORITY_COLOR.high} strokeWidth={2} />
          )}
          {task.priority === 'medium' && (
            <Box style={{ flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Box style={{ width: 12, height: 2, backgroundColor: PRIORITY_COLOR.medium, borderRadius: 1 }} />
              <Box style={{ width: 12, height: 2, backgroundColor: PRIORITY_COLOR.medium, borderRadius: 1 }} />
            </Box>
          )}
          {task.priority === 'low' && (
            <ChevronsDown size={16} color={PRIORITY_COLOR.low} strokeWidth={2} />
          )}
        </Box>

        {/* Due date — pill outline, always visible */}
        <Box
          flexDirection="row"
          alignItems="center"
          style={{
            height: 32,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: overdue ? theme.colors.alertRed : theme.colors.grey03,
            paddingHorizontal: 12,
            gap: 4,
            backgroundColor: overdue ? '#FFF0F0' : 'white',
            flexShrink: 0,
          }}
        >
          <Calendar size={12} color={overdue ? theme.colors.alertRed : theme.colors.grey05} strokeWidth={2} />
          <Text style={{ fontSize: 12, color: overdue ? theme.colors.alertRed : theme.colors.textPrimary, fontFamily: 'Inter_400Regular' }}>
            {task.dueDate ? formatDueDate(task.dueDate) : 'Due Date'}
          </Text>
        </Box>

        {/* Assignee — stacked avatars or pill button */}
        {visibleAssignees.length > 0 ? (
          <Box flexDirection="row" alignItems="center" style={{ flexShrink: 0 }}>
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
        ) : (
          <Box
            flexDirection="row"
            alignItems="center"
            style={{
              height: 32,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.grey03,
              paddingHorizontal: 12,
              gap: 4,
              backgroundColor: 'white',
              flexShrink: 0,
            }}
          >
            <UserPlus size={12} color={theme.colors.grey05} strokeWidth={2} />
            <Text style={{ fontSize: 12, color: theme.colors.textPrimary, fontFamily: 'Inter_400Regular' }}>
              Assignee
            </Text>
          </Box>
        )}

        {/* Copy link */}
        <Pressable
          hitSlop={8}
          style={({ hovered }: any) => ({
            width: 28,
            height: 28,
            borderRadius: 6,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
          })}
        >
          <Link size={16} color={theme.colors.grey05} />
        </Pressable>

      </Box>
    </Pressable>
  );
}
