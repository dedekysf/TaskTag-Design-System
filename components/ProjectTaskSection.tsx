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
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          borderBottomLeftRadius: isExpanded ? 0 : 8,
          borderBottomRightRadius: isExpanded ? 0 : 8,
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
        <Box>
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
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipOpacity = useRef(new Animated.Value(1)).current;
  const fadeStarted = useRef(false);
  const inputRef = useRef<any>(null);

  const isActive = isFocused || taskName.length > 0;

  // When prop becomes true: show tooltip + focus input
  useEffect(() => {
    if (showOnboardingTooltip && !showTooltip) {
      setShowTooltip(true);
      tooltipOpacity.setValue(1);
      fadeStarted.current = false;
      setTimeout(() => inputRef.current?.focus(), 50);
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
      animatedOpacity={tooltipOpacity}
      offset={8}
      style={{ alignSelf: 'stretch' }}
    >
      <Box
        flexDirection="row"
        alignItems="center"
        backgroundColor="white"
        paddingHorizontal="16"
        style={{
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          ...Platform.select({
            web: isActive ? { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } as any : {},
          }),
        }}
      >
        <Box flex={1}>
          <TextInput
            ref={inputRef}
            placeholder="Enter task name..."
            placeholderTextColor={theme.colors.grey04}
            value={taskName}
            onChangeText={setTaskName}
            onFocus={() => setIsFocused(true)}
            onBlur={() => { if (!taskName) setIsFocused(false); }}
            onSubmitEditing={handleCreate}
            style={{
              fontSize: 14,
              color: theme.colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              paddingVertical: 0,
              outline: 'none',
            } as any}
          />
          {isActive && (
            <Text style={{ fontSize: 10, color: theme.colors.grey04, marginTop: 2 }}>
              Press Shift + Enter for new line
            </Text>
          )}
        </Box>

        {taskName.length > 0 && (
          <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
            {/* Priority picker */}
            <Pressable
              onPress={cyclePriority}
              style={({ hovered }: any) => ({
                width: 32,
                height: 32,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 16,
                borderWidth: 1,
                borderColor: theme.colors.grey03,
                backgroundColor: hovered ? theme.colors.grey03 : 'white',
              })}
            >
              <PriorityIcon size={14} color={PRIORITY_COLOR[priority]} />
            </Pressable>

            {/* Due date */}
            <Button
              variant="outline"
              size="sm"
              style={{ height: 32, borderRadius: 40, borderColor: theme.colors.grey03 }}
              hoverBackgroundColor={theme.colors.grey03}
              leftIcon={<Calendar size={14} color="black" />}
            >
              <Text style={{ fontSize: 12, color: 'black' }}>Due Date</Text>
            </Button>

            {/* Assignee */}
            <Button
              variant="outline"
              size="sm"
              style={{ height: 32, borderRadius: 40, borderColor: theme.colors.grey03 }}
              hoverBackgroundColor={theme.colors.grey03}
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
                backgroundColor: theme.colors.secondaryGreen,
                borderWidth: 0,
              }}
            >
              <Text style={{ fontSize: 12, color: 'white', fontWeight: '500' }}>
                Create Task
              </Text>
            </Button>
          </Box>
        )}
      </Box>
    </TooltipOnboarding>
  );
}
