import { Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { StatusBarRow } from './StatusBarRow';
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  MoreVertical,
  Plus,
  Search,
} from 'lucide-react-native';
import React from 'react';
import { Pressable, View } from 'react-native';

export interface TaskListScreenProps {
  /** Show the created "Fix kitchen sink" task row (Screen 8 background) */
  taskCreated?: boolean;
  /** Callback for the "New Task" FAB — used as tap target in Screen 1 spotlight */
  onNewTask?: () => void;
}

export function TaskListScreen({ taskCreated = false, onNewTask }: TaskListScreenProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* ── Header ── */}
      <View style={{ backgroundColor: '#fff' }}>
        {/* Status bar — shared component, all icons from lucide */}
        <StatusBarRow />

        {/* Project name row — acts as the back navigation */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, height: 43 }}>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={24} color={TTTheme.colors.textPrimary} />
          </View>
          {/* TODO(BE): GET /api/projects/:id — project.name */}
          <Text variant="mobileSecondaryBody" color="foreground" style={{ flex: 1 }}>
            1520 Oliver Street
          </Text>
        </View>

        {/* Search + filter row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}>
          <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 8 } as any}>
            <Search size={20} color={TTTheme.colors.grey04} />
            <Text variant="mobileSecondaryBody" color="grey04">Search</Text>
          </View>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <MoreVertical size={20} color={TTTheme.colors.textPrimary} />
          </View>
        </View>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: TTTheme.colors.border }} />
      </View>

      {/* ── Task list ── */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>

        {/* Current section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 4 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            {/* TODO(BE): GET /api/projects/:id/tasks?status=current — count */}
            <Text variant="mobileLabelEmphasized" color="grey06">Current</Text>
            {taskCreated && (
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 0.7, borderColor: TTTheme.colors.border, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 10, fontWeight: '500', color: TTTheme.colors.grey06 }}>1</Text>
              </View>
            )}
          </View>
          <ChevronUp size={20} color={TTTheme.colors.textPrimary} />
        </View>

        {taskCreated ? (
          /* Task row: "Fix kitchen sink" */
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 16, gap: 12, backgroundColor: '#fff' }}>
            {/* Checkbox (unchecked) */}
            <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: TTTheme.colors.grey04 }} />
            {/* Task content */}
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
              <Text variant="mobileSecondaryBody" color="foreground" style={{ flex: 1 }} numberOfLines={1}>
                {/* TODO(BE): task.name */}
                Fix kitchen sink
              </Text>
              {/* Due Date badge */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 40, paddingHorizontal: 8, paddingVertical: 6 }}>
                <Calendar size={12} color={TTTheme.colors.grey06} />
                <Text style={{ fontSize: 10, fontWeight: '500', color: TTTheme.colors.grey06 }}>Due Date</Text>
              </View>
            </View>
          </View>
        ) : (
          /* Empty state */
          <View style={{ alignItems: 'center', paddingVertical: 16, gap: 4 }}>
            {/* TODO(BE): hidden when tasks exist */}
            <Text variant="mobileSecondaryBody" color="foreground">No current tasks</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">Add a task to see it here</Text>
          </View>
        )}

        {/* Completed section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}>
          <Text variant="mobileLabelEmphasized" color="grey06" style={{ flex: 1 }}>Completed</Text>
          <ChevronDown size={20} color={TTTheme.colors.textPrimary} />
        </View>
      </View>

      {/* ── "New Task" FAB ── */}
      <Pressable
        onPress={onNewTask}
        style={{ position: 'absolute', right: 16, bottom: 40 } as any}
      >
        <View style={{ backgroundColor: '#000', borderRadius: 156, flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8 }}>
          <Plus size={24} color="#fff" />
          {/* TODO(BE): action — POST /api/projects/:id/tasks */}
          <Text variant="button" style={{ color: '#fff' }}>New Task</Text>
        </View>
      </Pressable>

      {/* Home indicator */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
      </View>
    </View>
  );
}
