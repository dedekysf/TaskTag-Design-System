import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { Box, Text } from './primitives';
import { Button } from './Button';
import {
  ChevronLeft, MoreVertical, Search, Plus, Building, MapPin, Hash, FileText,
  Image as ImageIcon, Activity, Users, Filter, ArrowDownUp, CalendarDays,
  ChevronUp, ChevronDown, Calendar, UserPlus, Equal
} from 'lucide-react-native';

export interface ProjectDetailProps {
  onBack?: () => void;
  projectName?: string;
  teamName?: string;
  location?: string;
  description?: string;
}

export function ProjectDetail({
  onBack,
  projectName = 'LA Avenue 34 G',
  teamName = 'Personal Projects',
  location = 'Houston, Texas',
  description = 'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
}: ProjectDetailProps) {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('Tasks');

  const tabs = [
    { id: 'Tasks', icon: Hash },
    { id: 'Checklist', icon: FileText },
    { id: 'Files & Media', icon: ImageIcon },
    { id: 'Activity Log', icon: Activity },
    { id: 'Members', icon: Users, count: 1 },
  ];

  return (
    <Box flex={1} backgroundColor="background" style={{ height: '100%' }}>
      {/* Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="24"
        paddingVertical="16"
        borderBottomWidth={1}
        borderColor="border"
        backgroundColor="white"
      >
        <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
          <Pressable onPress={onBack} style={{ padding: 4 }}>
            <ChevronLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
          
          <Box>
            <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
              <Text variant="h2" style={{ color: theme.colors.black }}>
                {projectName}
              </Text>
              <Pressable style={{ padding: 4 }}>
                <MoreVertical size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </Box>
            <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
              <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
                <Building size={12} color={theme.colors.grey05} />
                <Text style={{ fontSize: 10, color: theme.colors.grey05 }}>{teamName}</Text>
              </Box>
              <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
                <MapPin size={12} color={theme.colors.grey05} />
                <Text style={{ fontSize: 10, color: theme.colors.grey05, fontWeight: '500' }}>{location}</Text>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box flexDirection="row" alignItems="center" style={{ gap: 12 }}>
          <Pressable style={{ padding: 8 }}>
            <Search size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Button variant="fill" size="md" leftIcon={<Plus size={16} color="white" />} style={{ borderRadius: 40, height: 40 }}>
            New Task
          </Button>
        </Box>
      </Box>

      <ScrollView style={{ flex: 1 }}>
        <Box padding="24">
          {/* Description */}
          <Box backgroundColor="grey01" padding="16" borderRadius="8" style={{ gap: 8, marginBottom: 24 }}>
            <Text variant="labelMedium" style={{ fontSize: 16 }}>Description</Text>
            <Text variant="body" style={{ color: theme.colors.textSecondary, fontSize: 12, lineHeight: 16 }}>
              {description}
            </Text>
          </Box>

          {/* Tabs */}
          <Box flexDirection="row" alignItems="center" borderBottomWidth={1} borderColor="border" style={{ marginBottom: 16, gap: 16 }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 12,
                    borderBottomWidth: 2,
                    borderColor: isActive ? theme.colors.secondaryGreen : 'transparent',
                    gap: 8,
                  }}
                >
                  <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                  <Text style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, fontWeight: '500', fontSize: 14 }}>
                    {tab.id}
                  </Text>
                  {tab.count !== undefined && (
                    <Box backgroundColor="black" borderRadius="full" style={{ paddingHorizontal: 2, paddingVertical: 1, minWidth: 20, alignItems: 'center' }}>
                      <Text style={{ color: 'white', fontSize: 12 }}>{tab.count}</Text>
                    </Box>
                  )}
                </Pressable>
              );
            })}
            
            <Box flex={1} />
            
            <Pressable style={{ padding: 8 }}>
              <Button variant="outline" size="sm" style={{ borderRadius: 40, height: 36, borderColor: 'black' }} leftIcon={<UserPlus size={16} color="black" />}>
                <Text style={{ color: 'black', fontWeight: '500' }}>Invite</Text>
              </Button>
            </Pressable>
          </Box>

          {/* Tab Content */}
          {activeTab === 'Tasks' && <TasksContent />}
        </Box>
      </ScrollView>
    </Box>
  );
}

// ── Tasks Content ─────────────────────────────────────────────────────────────

function TasksContent() {
  const theme = useTheme<Theme>();

  return (
    <Box>
      {/* Toolbar */}
      <Box flexDirection="row" alignItems="center" style={{ gap: 16, marginBottom: 24 }}>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Filter size={16} color={theme.colors.textPrimary} />
          <Text style={{ fontWeight: '500', fontSize: 14 }}>Filter</Text>
        </Pressable>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <ArrowDownUp size={16} color={theme.colors.textPrimary} />
          <Text style={{ fontWeight: '500', fontSize: 14 }}>Sort</Text>
        </Pressable>
        <Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <CalendarDays size={16} color={theme.colors.textPrimary} />
          <Text style={{ fontWeight: '500', fontSize: 14 }}>Add to calendar</Text>
        </Pressable>
      </Box>

      {/* Task Sections */}
      <TaskSection title="Current" defaultExpanded={true} showInlineCreate={true} />
      <TaskSection title="Overdue" defaultExpanded={false} />
      <TaskSection title="Completed" defaultExpanded={false} />
    </Box>
  );
}

// ── Task Section ──────────────────────────────────────────────────────────────

function TaskSection({ title, defaultExpanded, showInlineCreate = false }: { title: string, defaultExpanded: boolean, showInlineCreate?: boolean }) {
  const theme = useTheme<Theme>();
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <Box
      borderWidth={1}
      borderColor="border"
      borderRadius="8"
      marginBottom="4"
      overflow="hidden"
    >
      {/* Header */}
      <Pressable
        onPress={() => setExpanded(!expanded)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 16,
          backgroundColor: 'white',
        }}
      >
        <Text variant="labelMedium" style={{ fontSize: 16 }}>{title}</Text>
        {expanded ? <ChevronUp size={20} color={theme.colors.textSecondary} /> : <ChevronDown size={20} color={theme.colors.textSecondary} />}
      </Pressable>

      {/* Content */}
      {expanded && (
        <Box backgroundColor="white" padding="16" style={{ borderTopWidth: 1, borderColor: theme.colors.border }}>
          <Box alignItems="center" paddingVertical="24">
            <Text style={{ fontSize: 14, color: theme.colors.textPrimary }}>No {title.toLowerCase()} tasks</Text>
            <Text style={{ fontSize: 12, color: theme.colors.grey04 }}>Add a task to see it here</Text>
          </Box>
          
          {showInlineCreate && <InlineTaskCreate />}
        </Box>
      )}
    </Box>
  );
}

// ── Inline Task Create ────────────────────────────────────────────────────────

function InlineTaskCreate() {
  const theme = useTheme<Theme>();
  const [isFocused, setIsFocused] = useState(false);
  const [taskName, setTaskName] = useState('');

  const isActive = isFocused || taskName.length > 0;

  return (
    <Box
      flexDirection="row"
      alignItems="center"
      backgroundColor={isActive ? "white" : "grey01"}
      paddingHorizontal="16"
      paddingVertical="8"
      borderRadius="8"
      minHeight={56}
      style={{
        borderWidth: isActive ? 1 : 0,
        borderColor: isActive ? theme.colors.border : 'transparent',
        ...Platform.select({
          web: isActive ? { boxShadow: '0 2px 8px rgba(0,0,0,0.05)' } as any : {},
          default: isActive ? { elevation: 2 } : {},
        })
      }}
    >
      <Box flex={1}>
        <TextInput
          placeholder="Enter your task name"
          placeholderTextColor={theme.colors.grey04}
          value={taskName}
          onChangeText={setTaskName}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            fontSize: 14,
            color: theme.colors.textPrimary,
            fontFamily: 'Inter_400Regular',
            paddingVertical: 8,
            outline: 'none',
          } as any}
        />
        {isActive && (
          <Text style={{ fontSize: 10, color: theme.colors.grey04, marginTop: -4 }}>
            Press Shift + Enter for new line
          </Text>
        )}
      </Box>

      {isActive && (
        <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
          <Pressable style={{ paddingHorizontal: 8, paddingVertical: 6, borderRadius: 40, borderWidth: 1, borderColor: '#FFE4B5', backgroundColor: '#FFFDF5' }}>
            <Equal size={14} color="#F59E0B" />
          </Pressable>
          <Button variant="outline" size="sm" style={{ height: 32, borderRadius: 40 }} leftIcon={<Calendar size={14} color={theme.colors.textSecondary} />}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Due Date</Text>
          </Button>
          <Button variant="outline" size="sm" style={{ height: 32, borderRadius: 40 }} leftIcon={<UserPlus size={14} color={theme.colors.textSecondary} />}>
            <Text style={{ fontSize: 12, color: theme.colors.textSecondary }}>Assignee</Text>
          </Button>
          <Button variant="fill" size="sm" style={{ height: 32, borderRadius: 40, backgroundColor: theme.colors.secondaryGreen, borderWidth: 0 }}>
            <Text style={{ fontSize: 12, color: 'white', fontWeight: '500' }}>Create Task</Text>
          </Button>
        </Box>
      )}
    </Box>
  );
}
