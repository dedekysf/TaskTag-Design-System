import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { useTheme } from '@shopify/restyle';
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Equal,
  UserPlus,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, TextInput } from 'react-native';
import {
  PRIORITY_COLOR,
  ProjectTaskItem,
  Task,
  TaskPriority,
  TaskSectionType,
} from './ProjectTaskItem';

// ── Props ──────────────────────────────────────────────────────────────────────

export interface ProjectTaskSectionProps {
  title: string;
  sectionType: TaskSectionType;
  tasks: Task[];
  isExpanded: boolean;
  onToggle: () => void;
  showInlineCreate?: boolean;
  showOnboardingTooltip?: boolean;
  onCreateTask?: (name: string, priority: TaskPriority, dueDate: Date | null) => void;
  onCompleteTask?: (taskId: string) => void;
  onUncompleteTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onDuplicateTask?: (taskId: string) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectTaskSection({
  title,
  sectionType,
  tasks,
  isExpanded,
  onToggle,
  showInlineCreate = false,
  showOnboardingTooltip = false,
  onCreateTask,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
  onDuplicateTask,
}: ProjectTaskSectionProps) {
  const theme = useTheme<Theme>();

  return (
    <Box
      backgroundColor="white"
      borderRadius="8"
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'visible',
      }}
    >
      {/* Section header */}
      <Pressable
        onPress={onToggle}
        style={({ hovered }: any) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: hovered ? theme.colors.grey01 : 'white',
          borderRadius: isExpanded ? 0 : 8,
        })}
      >
        <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary, lineHeight: 21 }}>
            {title}
          </Text>
          {tasks.length > 0 && (
            <Box
              style={{
                backgroundColor: sectionType === 'overdue' ? 'transparent' : theme.colors.grey02,
                borderWidth: sectionType === 'overdue' ? 1 : 0,
                borderColor: sectionType === 'overdue' ? 'black' : 'transparent',
                borderRadius: 20,
                paddingHorizontal: 7,
                paddingVertical: 1,
                minWidth: 22,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: sectionType === 'overdue' ? theme.colors.textSecondary : theme.colors.grey05,
                  lineHeight: 18,
                }}
              >
                {tasks.length}
              </Text>
            </Box>
          )}
        </Box>
        {isExpanded
          ? <ChevronUp size={20} color={theme.colors.grey05} />
          : <ChevronDown size={20} color={theme.colors.grey05} />
        }
      </Pressable>

      {/* Section body */}
      {isExpanded && (
        <Box style={{ borderTopWidth: 1, borderTopColor: theme.colors.border }}>
          {/* Empty state */}
          {tasks.length === 0 && (
            <Box alignItems="center" paddingVertical="24" style={{ gap: 4 }}>
              <Text style={{ fontSize: 14, color: theme.colors.textPrimary }}>
                No {title.toLowerCase()} tasks
              </Text>
              <Text style={{ fontSize: 12, color: theme.colors.grey04 }}>
                Add a task to see it here
              </Text>
            </Box>
          )}

          {/* Task rows */}
          {tasks.map((task) => (
            <ProjectTaskItem
              key={task.id}
              task={task}
              sectionType={sectionType}
              onComplete={() => onCompleteTask?.(task.id)}
              onUncomplete={() => onUncompleteTask?.(task.id)}
              onDelete={() => onDeleteTask?.(task.id)}
              onDuplicate={() => onDuplicateTask?.(task.id)}
            />
          ))}

          {/* Inline task create (Current section only) */}
          {showInlineCreate && (
            <InlineTaskCreate
              onCreateTask={onCreateTask}
              showOnboardingTooltip={showOnboardingTooltip}
            />
          )}
        </Box>
      )}
    </Box>
  );
}

// ── Inline Task Create ────────────────────────────────────────────────────────

const PRIORITY_CYCLE: TaskPriority[] = ['medium', 'high', 'low'];

function InlineTaskCreate({
  onCreateTask,
  showOnboardingTooltip = false,
}: {
  onCreateTask?: (name: string, priority: TaskPriority, dueDate: Date | null) => void;
  showOnboardingTooltip?: boolean;
}) {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [showTooltip, setShowTooltip] = useState(showOnboardingTooltip);
  const tooltipOpacity = useRef(new Animated.Value(1)).current;
  const fadeStarted = useRef(false);

  const isActive = isFocused || taskName.length > 0;

  // Sync showOnboardingTooltip prop → local state (when parent resets)
  useEffect(() => {
    if (showOnboardingTooltip && !showTooltip) {
      setShowTooltip(true);
      tooltipOpacity.setValue(1);
      fadeStarted.current = false;
    }
  }, [showOnboardingTooltip]);

  // Fade tooltip immediately over 4s when typing (only once)
  useEffect(() => {
    if (taskName.length > 0 && showTooltip && !fadeStarted.current) {
      fadeStarted.current = true;
      Animated.timing(tooltipOpacity, {
        toValue: 0,
        duration: 3000, // fade out over 3 seconds
        useNativeDriver: true,
      }).start(() => setShowTooltip(false));
    }
  }, [taskName.length, showTooltip, tooltipOpacity]);

  const cyclePriority = () => {
    const idx = PRIORITY_CYCLE.indexOf(priority);
    setPriority(PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]);
  };

  const handleCreate = () => {
    if (!taskName.trim()) return;
    onCreateTask?.(taskName.trim(), priority, null);
    setTaskName('');
    setPriority('medium');
    setIsFocused(false);
  };

  const PriorityIcon = priority === 'high' ? ArrowUp : priority === 'low' ? ArrowDown : Equal;

  return (
    <TooltipOnboarding
      variant="bottom-left"
      tooltipStyle="success"
      title="Add a task"
      description="Name your task — it'll be added to this job straight away"
      open={showTooltip}
      forceShow={showTooltip}
      fullWidth
      animatedOpacity={tooltipOpacity}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor={isActive ? 'white' : 'grey01'}
        paddingHorizontal="16"
        paddingVertical="8"
        style={{
          minHeight: 52,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          ...Platform.select({
            web: isActive ? { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as any : {},
          }),
        }}
      >
        <Box flex={1}>
          <TextInput
            placeholder=""
            placeholderTextColor={theme.colors.grey04}
            value={taskName}
            onChangeText={setTaskName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { if (!taskName) setIsFocused(false); }}
            autoFocus={showOnboardingTooltip}
            onSubmitEditing={handleCreate}
            style={{
              fontSize: 14,
              color: theme.colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              paddingVertical: 6,
              outline: 'none',
            } as any}
          />
          {(isActive || showTooltip) && (
            <Text style={{ fontSize: 10, color: theme.colors.grey04, marginTop: 2 }}>
              Press Shift + Enter for new line
            </Text>
          )}
        </Box>

        {isActive && (
          <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
            {/* Priority picker */}
            <Pressable
              onPress={cyclePriority}
              style={{
                paddingHorizontal: 8,
                paddingVertical: 6,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: PRIORITY_COLOR[priority] + '40',
                backgroundColor: PRIORITY_COLOR[priority] + '18',
              }}
            >
              <PriorityIcon size={14} color={PRIORITY_COLOR[priority]} />
            </Pressable>

            {/* Due date */}
            <Button
              variant="outline"
              size="sm"
              style={{ height: 32, borderRadius: 40, borderColor: 'black' }}
              leftIcon={<Calendar size={14} color="black" />}
            >
              <Text style={{ fontSize: 12, color: 'black' }}>Due Date</Text>
            </Button>

            {/* Assignee */}
            <Button
              variant="outline"
              size="sm"
              style={{ height: 32, borderRadius: 40, borderColor: 'black' }}
              leftIcon={<UserPlus size={14} color="black" />}
            >
              <Text style={{ fontSize: 12, color: 'black' }}>Assignee</Text>
            </Button>

            {/* Create button */}
            <Button
              variant="fill"
              size="sm"
              onPress={handleCreate}
              style={{
                height: 32,
                borderRadius: 40,
                backgroundColor: taskName.trim()
                  ? theme.colors.secondaryGreen
                  : theme.colors.grey03,
                borderWidth: 0,
              }}
            >
              <Text style={{ fontSize: 12, color: taskName.trim() ? 'white' : theme.colors.grey05, fontWeight: '500' }}>
                Create Task
              </Text>
            </Button>
          </Box>
        )}
      </Box>
    </TooltipOnboarding>
  );
}
