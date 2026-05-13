import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { ProjectTaskSection } from '@/components/ProjectTaskSection';
import { TooltipOnboarding } from '@/components/TooltipOnboarding';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
  Building,
  CalendarDays,
  ChevronLeft,
  FileText,
  ListFilter,
  Hash,
  ImageIcon,
  Link,
  MapPin,
  MoreVertical,
  Plus,
  Save,
  Search,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, ScrollView, TextInput } from 'react-native';
import { Task, TaskAssignee, TaskPriority, TaskSectionType } from './ProjectTaskItem';
import { Toast } from './Toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const MOCK_ASSIGNEES: TaskAssignee[] = [
  { name: 'Alex Johnson', initials: 'AJ', color: '#18A87D' },
  { name: 'Sam Wilson', initials: 'SW', color: '#4488FF' },
  { name: 'Jordan Lee', initials: 'JL', color: '#FF4444' },
  { name: 'Maria Chen', initials: 'MC', color: '#8844FF' },
];

const TASK_NAMES = [
  'Electrical board assessment',
  'Safety inspection and certification',
  'Install new circuit breakers',
  'Rewire main power distribution',
  'Replace outdated outlets',
  'Ground fault testing',
  'Install surge protection system',
  'Update electrical panel labels',
  'Compliance documentation review',
  'Final safety walkthrough',
];

function generateTasks(count: number, section: TaskSectionType): Task[] {
  return Array.from({ length: count }, (_, i) => {
    const priority: TaskPriority = (['high', 'medium', 'low'] as TaskPriority[])[i % 3];
    const assigneePattern = i % 5;
    const assignees =
      assigneePattern === 0
        ? []
        : assigneePattern === 1
        ? [MOCK_ASSIGNEES[0]]
        : assigneePattern === 2
        ? [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1]]
        : assigneePattern === 3
        ? [MOCK_ASSIGNEES[0], MOCK_ASSIGNEES[1], MOCK_ASSIGNEES[2]]
        : MOCK_ASSIGNEES;

    let dueDate: Date | null = null;
    if (section === 'overdue') {
      dueDate = new Date(2024, 11, 20 + (i % 5));
    } else if (i % 3 !== 1) {
      const month = 2025 + Math.floor(i / 10);
      dueDate = new Date(month, i % 12, (i % 28) + 1);
    }

    const checklistCount = i % 4 === 0 ? 3 : i % 4 === 1 ? undefined : i % 4 === 2 ? 2 : undefined;
    const checklistTotal = checklistCount !== undefined ? checklistCount + 2 : undefined;

    return {
      id: `${section}-${i}-${Date.now()}`,
      name: TASK_NAMES[i % TASK_NAMES.length],
      priority,
      dueDate,
      assignees,
      checklistCount,
      checklistTotal,
      completed: section === 'completed',
    };
  });
}

const INITIAL_CHECKLIST: ChecklistItemData[] = [
  { id: '1', text: 'Client contract signed and uploaded', checked: true },
  { id: '2', text: 'Permits submitted and tracked', checked: true },
  { id: '3', text: 'Policy confirmed for General Contractor and Subcontractors', checked: true },
  { id: '4', text: 'Coverage checked (General Contractor + Subs)', checked: true },
  { id: '5', text: 'Insurance status validated (GC alongside Subs)', checked: false },
  { id: '6', text: 'Coverage confirmed for General Contractor and Subcontractors', checked: false },
  { id: '7', text: 'Insurance cleared (GC and Subs included)', checked: false },
  { id: '8', text: 'Verification complete for Insurance (General Contractor + Subs)', checked: false },
];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ProjectDetailProps {
  onBack?: () => void;
  projectName?: string;
  teamName?: string;
  location?: string;
  description?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectDetail({
  onBack,
  projectName = 'LA Avenue 34 G',
  teamName = 'Personal Projects',
  location = 'Houston, Texas',
  description = 'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
}: ProjectDetailProps) {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('tasks');

  // Task state
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>(generateTasks(5, 'overdue'));
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  // Section expand state
  const [expandedSection, setExpandedSection] = useState<TaskSectionType | null>('current');

  // Onboarding state
  const [showOnboardingTooltip, setShowOnboardingTooltip] = useState(true);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showChecklistTooltip, setShowChecklistTooltip] = useState(false);

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<{
    section: TaskSectionType;
    taskId: string;
    taskName: string;
  } | null>(null);

  // Copy link
  const [linkCopied, setLinkCopied] = useState(false);

  // Checklist state
  const [checklistItems, setChecklistItems] = useState<ChecklistItemData[]>(INITIAL_CHECKLIST);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  const tabs = [
    { id: 'tasks', label: 'Tasks', icon: Hash },
    { id: 'checklist', label: 'Checklist', icon: FileText },
    { id: 'files', label: 'Files & Media', icon: ImageIcon },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'members', label: 'Members', icon: Users, count: 1 },
  ];

  // ── Task handlers ──────────────────────────────────────────────────────────

  const handleCreateTask = (name: string, priority: TaskPriority, dueDate: Date | null) => {
    const isFirst = currentTasks.length === 0;
    const newTask: Task = {
      id: `current-${Date.now()}`,
      name,
      priority,
      dueDate,
      assignees: [],
      completed: false,
    };
    setCurrentTasks(prev => [newTask, ...prev]);
    setShowOnboardingTooltip(false);
    if (isFirst) setShowSuccessToast(true);
  };

  const handleCompleteTask = (section: TaskSectionType, taskId: string) => {
    const getSet = (s: TaskSectionType) =>
      s === 'current' ? currentTasks : s === 'overdue' ? overdueTasks : completedTasks;
    const setFn = (s: TaskSectionType) =>
      s === 'current' ? setCurrentTasks : s === 'overdue' ? setOverdueTasks : setCompletedTasks;

    const task = getSet(section).find(t => t.id === taskId);
    if (!task) return;
    setFn(section)(prev => prev.filter(t => t.id !== taskId));
    setCompletedTasks(prev => [{ ...task, completed: true, originalSection: section }, ...prev]);
  };

  const handleUncompleteTask = (taskId: string) => {
    const task = completedTasks.find(t => t.id === taskId);
    if (!task) return;
    setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
    const target = task.originalSection === 'overdue' ? setOverdueTasks : setCurrentTasks;
    target(prev => [{ ...task, completed: false, originalSection: undefined }, ...prev]);
  };

  const handleDeleteTask = (section: TaskSectionType, taskId: string) => {
    const tasks =
      section === 'current' ? currentTasks : section === 'overdue' ? overdueTasks : completedTasks;
    const task = tasks.find(t => t.id === taskId);
    if (task) setDeleteModal({ section, taskId, taskName: task.name });
  };

  const confirmDelete = () => {
    if (!deleteModal) return;
    const { section, taskId } = deleteModal;
    if (section === 'current') setCurrentTasks(prev => prev.filter(t => t.id !== taskId));
    else if (section === 'overdue') setOverdueTasks(prev => prev.filter(t => t.id !== taskId));
    else setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
    setDeleteModal(null);
  };

  const handleDuplicateTask = (section: TaskSectionType, taskId: string) => {
    const tasks =
      section === 'current' ? currentTasks : section === 'overdue' ? overdueTasks : completedTasks;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const copy = { ...task, id: `${section}-dup-${Date.now()}` };
    if (section === 'current') setCurrentTasks(prev => [copy, ...prev]);
    else if (section === 'overdue') setOverdueTasks(prev => [copy, ...prev]);
    else setCompletedTasks(prev => [copy, ...prev]);
  };

  const toggleSection = (section: TaskSectionType) => {
    setExpandedSection(prev => (prev === section ? null : section));
  };

  // ── Checklist handlers ─────────────────────────────────────────────────────

  const handleToggleChecklist = (id: string) => {
    setChecklistItems(prev =>
      prev.map(item => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const handleDeleteChecklist = (id: string) => {
    setChecklistItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddChecklist = () => {
    if (!newItemText.trim()) return;
    setChecklistItems(prev => [
      ...prev,
      { id: Date.now().toString(), text: newItemText.trim(), checked: false },
    ]);
    setNewItemText('');
    setIsAddingItem(false);
  };

  const handleUpdateChecklist = (id: string, text: string) => {
    setChecklistItems(prev => prev.map(item => (item.id === id ? { ...item, text } : item)));
    setEditingItemId(null);
  };

  const displayChecklist = showCompleted
    ? checklistItems
    : checklistItems.filter(item => !item.checked);

  const checkedCount = checklistItems.filter(i => i.checked).length;

  // ── Copy link ──────────────────────────────────────────────────────────────

  const handleCopyLink = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Box flex={1} backgroundColor="white" style={{ height: '100%' as any, overflow: 'hidden' as any }}>

      {/* ── Fixed Header ── */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, flexShrink: 0 }}
        backgroundColor="white"
      >
        {/* Left: back + title + subtitle */}
        <Box flexDirection="column">
          <Box flexDirection="row" alignItems="center" style={{ gap: 8, height: 32 }}>
            <Pressable onPress={onBack} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={16} color={theme.colors.grey05} />
            </Pressable>
            <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.textPrimary, lineHeight: 32 }}>
              {projectName}
            </Text>
            <Pressable style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
              <MoreVertical size={24} color={theme.colors.textPrimary} />
            </Pressable>
          </Box>
          <Box flexDirection="row" alignItems="center" style={{ gap: 8, paddingLeft: 40, opacity: 0.8 }}>
            <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <Building size={12} color={theme.colors.secondaryGreen} />
              <Text style={{ fontSize: 10, color: theme.colors.textPrimary, letterSpacing: 0.2 }}>
                {teamName}
              </Text>
            </Box>
            <Box flexDirection="row" alignItems="center" style={{ gap: 4 }}>
              <MapPin size={12} color={theme.colors.textPrimary} />
              <Text style={{ fontSize: 10, fontWeight: '500', color: theme.colors.textPrimary, letterSpacing: 0.2 }}>
                {location}
              </Text>
            </Box>
          </Box>
        </Box>

        {/* Right: Search + New Task */}
        <Box flexDirection="row" alignItems="center" style={{ gap: 16 }}>
          <Pressable style={{ width: 32, height: 32, justifyContent: 'center', alignItems: 'center' }}>
            <Search size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Button
            variant="fill"
            size="sm"
            leftIcon={<Plus size={16} color="white" />}
            style={{ backgroundColor: 'black', borderRadius: 40, width: 120, height: 32, minHeight: 0 }}
          >
            <Text style={{ fontSize: 14, fontWeight: '500', color: 'white' }}>New Task</Text>
          </Button>
        </Box>
      </Box>

      {/* ── Fixed Description ── */}
      <Box style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, flexShrink: 0 }}>
        <Box
          backgroundColor="grey01"
          borderRadius="8"
          style={{ padding: 16 }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textPrimary, lineHeight: 21, marginBottom: 8 }}>
            Description
          </Text>
          <Text style={{ fontSize: 12, color: theme.colors.textPrimary, lineHeight: 16, letterSpacing: 0.24 }}>
            {description}
          </Text>
        </Box>
      </Box>

      {/* ── Fixed Tab Bar ── */}
      <Box
        style={{
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
          flexShrink: 0,
        }}
        backgroundColor="white"
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingTop: 8 }}>
          {/* Tabs */}
          <Box flexDirection="row" alignItems="center">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              const isChecklist = tab.id === 'checklist';

              const tabContent = (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  style={({ hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 10,
                    paddingHorizontal: 4,
                    marginRight: 16,
                    borderBottomWidth: 2,
                    borderBottomColor: isActive || hovered ? theme.colors.secondaryGreen : 'transparent',
                    gap: 6,
                  })}
                >
                  {({ hovered }: any) => {
                    const isHoveredOrActive = isActive || hovered;
                    return (
                      <>
                        <Icon size={16} color={isHoveredOrActive ? theme.colors.secondaryGreen : theme.colors.grey06} />
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '500',
                            color: isHoveredOrActive ? theme.colors.secondaryGreen : theme.colors.grey06,
                          }}
                        >
                          {tab.label}
                        </Text>
                        {tab.count !== undefined && (
                          <Box
                            style={{
                              backgroundColor: theme.colors.grey06,
                              borderRadius: 10,
                              width: 20,
                              height: 20,
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                          >
                            <Text style={{ fontSize: 11, fontWeight: '600', color: 'white', lineHeight: 15 }}>
                              {tab.count}
                            </Text>
                          </Box>
                        )}
                      </>
                    )
                  }}
                </Pressable>
              );

              if (isChecklist) {
                return (
                  <TooltipOnboarding
                    key={tab.id}
                    variant="bottom-left"
                    tooltipStyle="success"
                    title="Scope the full job"
                    description="Got a full job scope? Add everything at once in the Checklist tab — then turn each item into a task with one tap."
                    step="Step 1/3"
                    ctaText="Show me"
                    open={showChecklistTooltip}
                    forceShow={showChecklistTooltip}
                  >
                    {tabContent}
                  </TooltipOnboarding>
                );
              }
              return tabContent;
            })}
          </Box>

          {/* Right: Copy Link + Invite */}
          <Box flexDirection="row" alignItems="center" style={{ gap: 8, marginTop: -16 }}>
            <TooltipOnboarding
              variant="bottom-right"
              tooltipStyle={linkCopied ? 'success' : 'default'}
              content={linkCopied ? 'Link Copied!' : 'Copy link to invite'}
              open={linkCopied}
              forceShow={linkCopied}
            >
              <Pressable
                onPress={handleCopyLink}
                style={({ hovered }: any) => ({
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                })}
              >
                <Link size={24} color={theme.colors.textPrimary} />
              </Pressable>
            </TooltipOnboarding>

            <Button
              variant="outline"
              color="secondary"
              size="sm"
              style={{ borderRadius: 40, width: 120, height: 32, minHeight: 0, borderColor: 'black' }}
              leftIcon={<UserPlus size={16} color="black" />}
            >
              <Text style={{ fontSize: 13, fontWeight: '500', color: 'black' }}>Invite</Text>
            </Button>
          </Box>
        </Box>
      </Box>

      {/* ── Tasks Tab ── */}
      {activeTab === 'tasks' && (
        <>
          {/* Fixed filter toolbar */}
          <Box
            backgroundColor="white"
            style={{ flexShrink: 0, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}
          >
            <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 8, gap: 4 }}>
              <Pressable
                style={({ hovered }: any) => ({
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                <ListFilter size={16} color={theme.colors.textPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textPrimary }}>Filter</Text>
              </Pressable>

              <Pressable
                style={({ hovered }: any) => ({
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                <ArrowDownUp size={16} color={theme.colors.textPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textPrimary }}>Sort</Text>
              </Pressable>

              <Pressable
                style={({ hovered }: any) => ({
                  height: 40,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 12,
                  borderRadius: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                })}
              >
                <CalendarDays size={16} color={theme.colors.textPrimary} />
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textPrimary }}>Add to calendar</Text>
              </Pressable>
            </Box>
          </Box>

          {/* Scrollable task sections */}
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 16, gap: 12 }}
          >
            <ProjectTaskSection
              title="Current"
              sectionType="current"
              tasks={currentTasks}
              isExpanded={expandedSection === 'current'}
              onToggle={() => toggleSection('current')}
              showInlineCreate
              showOnboardingTooltip={showOnboardingTooltip && currentTasks.length === 0}
              onCreateTask={handleCreateTask}
              onCompleteTask={id => handleCompleteTask('current', id)}
              onDeleteTask={id => handleDeleteTask('current', id)}
              onDuplicateTask={id => handleDuplicateTask('current', id)}
            />
            <ProjectTaskSection
              title="Overdue"
              sectionType="overdue"
              tasks={overdueTasks}
              isExpanded={expandedSection === 'overdue'}
              onToggle={() => toggleSection('overdue')}
              onCompleteTask={id => handleCompleteTask('overdue', id)}
              onDeleteTask={id => handleDeleteTask('overdue', id)}
              onDuplicateTask={id => handleDuplicateTask('overdue', id)}
            />
            <ProjectTaskSection
              title="Completed"
              sectionType="completed"
              tasks={completedTasks}
              isExpanded={expandedSection === 'completed'}
              onToggle={() => toggleSection('completed')}
              onUncompleteTask={handleUncompleteTask}
              onDeleteTask={id => handleDeleteTask('completed', id)}
              onDuplicateTask={id => handleDuplicateTask('completed', id)}
            />
          </ScrollView>
        </>
      )}

      {/* ── Checklist Tab ── */}
      {activeTab === 'checklist' && (
        <>
          {/* Fixed action bar */}
          <Box
            backgroundColor="white"
            style={{
              flexShrink: 0,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Save size={15} color={theme.colors.textPrimary} />}
                style={{ height: 36, borderRadius: 8 }}
              >
                <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Save as Template</Text>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<Hash size={15} color={theme.colors.textPrimary} />}
                style={{ height: 36, borderRadius: 8 }}
              >
                <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Convert to Tasks</Text>
              </Button>
            </Box>
            <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
              <Text style={{ fontSize: 14, color: theme.colors.textPrimary, letterSpacing: 0.28 }}>
                Show completed
              </Text>
              <SimpleToggle value={showCompleted} onChange={setShowCompleted} />
            </Box>
          </Box>

          {/* Progress summary */}
          <Box
            style={{
              flexShrink: 0,
              paddingHorizontal: 16,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Box
              style={{
                flex: 1,
                height: 6,
                borderRadius: 10,
                backgroundColor: theme.colors.grey02,
                overflow: 'hidden',
              }}
            >
              <Box
                style={{
                  height: '100%',
                  width: `${checklistItems.length ? (checkedCount / checklistItems.length) * 100 : 0}%` as any,
                  backgroundColor: theme.colors.secondaryGreen,
                  borderRadius: 10,
                }}
              />
            </Box>
            <Text style={{ fontSize: 12, color: theme.colors.grey05, minWidth: 40 }}>
              {checkedCount}/{checklistItems.length}
            </Text>
          </Box>

          {/* Scrollable checklist */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
            {displayChecklist.map(item => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                isEditing={editingItemId === item.id}
                onToggle={() => handleToggleChecklist(item.id)}
                onDelete={() => handleDeleteChecklist(item.id)}
                onEdit={() => setEditingItemId(item.id)}
                onUpdate={text => handleUpdateChecklist(item.id, text)}
                onCancelEdit={() => setEditingItemId(null)}
              />
            ))}

            {/* Inline add form */}
            {isAddingItem && (
              <Box
                backgroundColor="white"
                style={{
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: 10,
                  padding: 16,
                }}
              >
                <Pressable
                  onPress={() => { setIsAddingItem(false); setNewItemText(''); }}
                  style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
                >
                  <X size={22} color={theme.colors.textPrimary} />
                </Pressable>
                <TextInput
                  value={newItemText}
                  onChangeText={setNewItemText}
                  placeholder="Item name"
                  autoFocus
                  multiline
                  maxLength={255}
                  onSubmitEditing={handleAddChecklist}
                  style={{
                    fontSize: 14,
                    color: theme.colors.textPrimary,
                    fontFamily: 'Inter_400Regular',
                    borderWidth: 1,
                    borderColor: theme.colors.textPrimary,
                    borderRadius: 4,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    outline: 'none',
                    minHeight: 40,
                  } as any}
                />
                <Text style={{ fontSize: 12, color: theme.colors.grey04, marginTop: 6 }}>
                  Press Enter to save · {255 - newItemText.length} chars left
                </Text>
              </Box>
            )}
          </ScrollView>

          {/* Sticky add buttons at bottom */}
          {!isAddingItem && (
            <Box
              backgroundColor="white"
              style={{
                flexShrink: 0,
                paddingHorizontal: 16,
                paddingVertical: 12,
                flexDirection: 'row',
                gap: 8,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                ...Platform.select({
                  web: { boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' } as any,
                }),
              }}
            >
              <Button
                variant="ghost"
                size="lg"
                onPress={() => setIsAddingItem(true)}
                leftIcon={
                  <Box style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: theme.colors.secondaryGreen, lineHeight: 20 }}>+</Text>
                  </Box>
                }
                style={{ flex: 1, backgroundColor: theme.colors.grey01, borderWidth: 0, justifyContent: 'flex-start' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>Add item</Text>
              </Button>
              <Button
                variant="ghost"
                size="lg"
                leftIcon={
                  <Box style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 20, color: theme.colors.secondaryGreen, lineHeight: 20 }}>+</Text>
                  </Box>
                }
                style={{ flex: 1, backgroundColor: theme.colors.grey01, borderWidth: 0, justifyContent: 'flex-start' }}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>Add from template</Text>
              </Button>
            </Box>
          )}
        </>
      )}

      {/* ── Placeholder tabs ── */}
      {(activeTab === 'files' || activeTab === 'activity' || activeTab === 'members') && (
        <Box flex={1} alignItems="center" justifyContent="center">
          <Text style={{ fontSize: 14, color: theme.colors.grey04 }}>
            {tabs.find(t => t.id === activeTab)?.label} — coming soon
          </Text>
        </Box>
      )}

      {/* ── First task success toast ── */}
      {showSuccessToast && (
        <Toast
          visible={showSuccessToast}
          title="Task created!"
          caption="Tap the circle to mark it complete when done."
          variant="title-caption"
          type="success"
          onDismiss={() => {
            setShowSuccessToast(false);
            setShowChecklistTooltip(true);
          }}
        />
      )}

      {/* ── Delete confirmation modal ── */}
      {deleteModal && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setDeleteModal(null)}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
            onPress={() => setDeleteModal(null)}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <Box
                backgroundColor="white"
                style={{
                  borderRadius: 16,
                  padding: 24,
                  width: 360,
                  ...Platform.select({
                    web: { boxShadow: '0px 8px 32px rgba(0,0,0,0.18)' } as any,
                    default: { elevation: 16 },
                  }),
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 12 }}>
                  Delete Task
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.textPrimary, lineHeight: 20, marginBottom: 8 }}>
                  Deleting this task will remove it permanently for all assignees.
                </Text>
                <Text
                  numberOfLines={2}
                  style={{ fontSize: 14, fontWeight: '500', color: theme.colors.grey05, marginBottom: 20 }}
                >
                  "{deleteModal.taskName}"
                </Text>
                <Text style={{ fontSize: 14, color: theme.colors.textPrimary, marginBottom: 24 }}>
                  Still want to delete it?
                </Text>
                <Box flexDirection="row" style={{ gap: 12 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    style={{ flex: 1, height: 44 }}
                    onPress={() => setDeleteModal(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="fill"
                    size="lg"
                    style={{ flex: 1, height: 44, backgroundColor: theme.colors.alertRed, borderWidth: 0 }}
                    onPress={confirmDelete}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </Box>
  );
}

// ── Checklist Item Row ────────────────────────────────────────────────────────

function ChecklistItemRow({
  item,
  isEditing,
  onToggle,
  onDelete,
  onEdit,
  onUpdate,
  onCancelEdit,
}: {
  item: ChecklistItemData;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdate: (text: string) => void;
  onCancelEdit: () => void;
}) {
  const theme = useTheme<Theme>();
  const [editText, setEditText] = useState(item.text);

  useEffect(() => {
    if (isEditing) setEditText(item.text);
  }, [isEditing]);

  return (
    <Box
      backgroundColor="white"
      style={{
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: isEditing ? 'flex-start' : 'center',
        gap: 12,
      }}
    >
      {/* Checkbox */}
      <Pressable
        onPress={onToggle}
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1.5,
          borderColor: item.checked ? theme.colors.secondaryGreen : theme.colors.grey04,
          backgroundColor: item.checked ? theme.colors.secondaryGreen : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: isEditing ? 2 : 0,
        }}
      >
        {item.checked && (
          <Box style={{ width: 10, height: 10, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 10, fontWeight: '700', lineHeight: 12 }}>✓</Text>
          </Box>
        )}
      </Pressable>

      {/* Text or edit input */}
      {isEditing ? (
        <Box flex={1}>
          <TextInput
            value={editText}
            onChangeText={setEditText}
            autoFocus
            multiline
            maxLength={255}
            style={{
              fontSize: 14,
              color: theme.colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              borderWidth: 1,
              borderColor: theme.colors.textPrimary,
              borderRadius: 4,
              paddingHorizontal: 10,
              paddingVertical: 6,
              outline: 'none',
            } as any}
          />
          <Box flexDirection="row" style={{ gap: 8, marginTop: 8 }}>
            <Button
              variant="fill"
              size="sm"
              style={{ height: 32, backgroundColor: theme.colors.secondaryGreen, borderWidth: 0 }}
              onPress={() => onUpdate(editText)}
            >
              <Text style={{ fontSize: 12, color: 'white' }}>Save</Text>
            </Button>
            <Button variant="outline" size="sm" style={{ height: 32 }} onPress={onCancelEdit}>
              <Text style={{ fontSize: 12 }}>Cancel</Text>
            </Button>
          </Box>
        </Box>
      ) : (
        <Pressable style={{ flex: 1 }} onPress={onEdit}>
          <Text
            style={{
              fontSize: 14,
              color: item.checked ? theme.colors.grey04 : theme.colors.textPrimary,
              fontFamily: 'Inter_400Regular',
              lineHeight: 20,
              textDecorationLine: item.checked ? 'line-through' : 'none',
              letterSpacing: 0.28,
            }}
          >
            {item.text}
          </Text>
        </Pressable>
      )}

      {/* Delete */}
      {!isEditing && (
        <Pressable
          onPress={onDelete}
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
          <X size={16} color={theme.colors.grey05} />
        </Pressable>
      )}
    </Box>
  );
}

// ── Simple Toggle ─────────────────────────────────────────────────────────────

function SimpleToggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={() => onChange(!value)}
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? theme.colors.secondaryGreen : theme.colors.grey03,
        justifyContent: 'center',
        paddingHorizontal: 3,
      }}
    >
      <Box
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          backgroundColor: 'white',
          alignSelf: value ? 'flex-end' : 'flex-start',
          ...Platform.select({
            web: { boxShadow: '0 1px 4px rgba(0,0,0,0.2)' } as any,
            default: { elevation: 2 },
          }),
        }}
      />
    </Pressable>
  );
}
