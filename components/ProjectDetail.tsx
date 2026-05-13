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
  Check,
  ChevronDown,
  ChevronLeft,
  FileText,
  Heart,
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
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Modal, Platform, Pressable, ScrollView, TextInput } from 'react-native';
import { Task, TaskPriority, TaskSectionType } from './ProjectTaskItem';
import { Toast } from './Toast';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChecklistItemData {
  id: string;
  text: string;
  checked: boolean;
}

const INITIAL_CHECKLIST: ChecklistItemData[] = [];

// ── Props ─────────────────────────────────────────────────────────────────────

export interface ProjectDetailProps {
  onBack?: () => void;
  projectName?: string;
  teamName?: string;
  location?: string;
  description?: string;
  showOnboardingTooltip?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectDetail({
  onBack,
  projectName = 'LA Avenue 34 G',
  teamName = 'Personal Projects',
  location = 'Houston, Texas',
  description = 'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  showOnboardingTooltip: showOnboardingTooltipProp = false,
}: ProjectDetailProps) {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('tasks');
  const tabFadeAnim = useRef(new Animated.Value(1)).current;

  const switchTab = (tabId: string, onComplete?: () => void) => {
    Animated.timing(tabFadeAnim, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      setActiveTab(tabId);
      Animated.timing(tabFadeAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(() => onComplete?.());
    });
  };

  // Task state
  const [currentTasks, setCurrentTasks] = useState<Task[]>([]);
  const [overdueTasks, setOverdueTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);

  // Section expand state
  const [expandedSection, setExpandedSection] = useState<TaskSectionType | null>('current');

  // Onboarding state
  const [showOnboardingTooltip, setShowOnboardingTooltip] = useState(false);

  useEffect(() => {
    if (showOnboardingTooltipProp) setShowOnboardingTooltip(true);
  }, [showOnboardingTooltipProp]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showChecklistTooltip, setShowChecklistTooltip] = useState(false);
  const [showChecklistActionTooltip, setShowChecklistActionTooltip] = useState(false);
  const [showTemplatePanel, setShowTemplatePanel] = useState(false);
  const [showConvertToTasksTooltip, setShowConvertToTasksTooltip] = useState(false);

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

  const confirmDelete = () => {
    if (!deleteModal) return;
    const { section, taskId } = deleteModal;
    if (section === 'current') setCurrentTasks(prev => prev.filter(t => t.id !== taskId));
    else if (section === 'overdue') setOverdueTasks(prev => prev.filter(t => t.id !== taskId));
    else setCompletedTasks(prev => prev.filter(t => t.id !== taskId));
    setDeleteModal(null);
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
    <Box flex={1} backgroundColor="white" style={{ height: '100%' as any, position: 'relative' as any }}>

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
                  onPress={() => switchTab(tab.id)}
                  style={({ hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingBottom: 10,
                    paddingHorizontal: 16,
                    marginRight: 0,
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
                    onCtaPress={() => {
                      setShowChecklistTooltip(false);
                      switchTab('checklist', () => setShowChecklistActionTooltip(true));
                    }}
                    open={showChecklistTooltip}
                    forceShow={showChecklistTooltip}
                    arrowAtTriggerCenter
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

      {/* ── Tab content (animated) ── */}
      <Animated.View style={{ flex: 1, opacity: tabFadeAnim, minHeight: 0 }}>

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
            />
            <ProjectTaskSection
              title="Overdue"
              sectionType="overdue"
              tasks={overdueTasks}
              isExpanded={expandedSection === 'overdue'}
              onToggle={() => toggleSection('overdue')}
              onCompleteTask={id => handleCompleteTask('overdue', id)}
            />
            <ProjectTaskSection
              title="Completed"
              sectionType="completed"
              tasks={completedTasks}
              isExpanded={expandedSection === 'completed'}
              onToggle={() => toggleSection('completed')}
              onUncompleteTask={handleUncompleteTask}
            />
          </ScrollView>
        </>
      )}

      {/* ── Checklist Tab ── */}
      {activeTab === 'checklist' && (
        <>
          {checklistItems.length === 0 && !isAddingItem && !newItemText ? (
            // ── Empty state ──────────────────────────────────────────────────
            <>
              {/* Top action bar */}
              <Box
                style={{
                  flexShrink: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  gap: 8,
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<Plus size={15} color={theme.colors.textPrimary} />}
                  onPress={() => { setIsAddingItem(true); setShowChecklistActionTooltip(false); }}
                  hoverBackgroundColor={theme.colors.grey02}
                  style={{ height: 36, borderRadius: 8 }}
                >
                  <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Start from Scratch</Text>
                </Button>
                <TooltipOnboarding
                  variant="bottom-right"
                  tooltipStyle="success"
                  title="Start with a ready-made list"
                  description="Pick a template that matches your job type — the items are done for you."
                  step="Step 2/3"
                  open={showChecklistActionTooltip}
                  forceShow={showChecklistActionTooltip}
                  arrowAtTriggerCenter
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    leftIcon={<FileText size={15} color={theme.colors.textPrimary} />}
                    hoverBackgroundColor={theme.colors.grey02}
                    style={{ height: 36, borderRadius: 8 }}
                    onPress={() => {
                      setShowChecklistActionTooltip(false);
                      setShowTemplatePanel(true);
                    }}
                  >
                    <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Use Template</Text>
                  </Button>
                </TooltipOnboarding>
              </Box>

              {/* Centered empty illustration */}
              <Box flex={1} alignItems="center" justifyContent="center" style={{ gap: 20, paddingHorizontal: 32, paddingBottom: 40 }}>
                <Image
                  source={require('../assets/images/checklist_empty.png')}
                  style={{ width: 180, height: 180 }}
                  resizeMode="contain"
                />
                <Box alignItems="center" style={{ gap: 8 }}>
                  <Text style={{ fontSize: 22, fontWeight: '700', color: theme.colors.textPrimary, textAlign: 'center', lineHeight: 30 }}>
                    Create a Project Checklist
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.colors.grey04, textAlign: 'center', lineHeight: 20, maxWidth: 360 }}>
                    Plan and track work across the whole project. Start with a template or build your own.
                  </Text>
                </Box>
              </Box>
            </>
          ) : (
            // ── Populated state ───────────────────────────────────────────────
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
                  <TooltipOnboarding
                    variant="bottom-left"
                    tooltipStyle="success"
                    title="Turn Checklist Items into Tasks"
                    description="Choose which items need to become actionable tasks."
                    step="Step 3/3"
                    open={showConvertToTasksTooltip}
                    forceShow={showConvertToTasksTooltip}
                    arrowAtTriggerCenter
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Hash size={15} color={theme.colors.textPrimary} />}
                      style={{ height: 36, borderRadius: 8 }}
                    >
                      <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Convert to Tasks</Text>
                    </Button>
                  </TooltipOnboarding>
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

      </Animated.View>

      {/* ── First task success toast ── */}
      {showSuccessToast && (
        <Toast
          visible={showSuccessToast}
          title="First task on the board"
          caption="LA Avenue 34 G is taking shape"
          variant="title-caption"
          type="success"
          onDismiss={() => {
            setShowSuccessToast(false);
            setShowChecklistTooltip(true);
          }}
        />
      )}

      {/* ── Checklist template panel ── */}
      {showTemplatePanel && (
        <ChecklistTemplatePanel
          onClose={() => setShowTemplatePanel(false)}
          onCreateChecklist={(items: string[]) => {
            setChecklistItems(items.map((text: string, i: number) => ({ id: `tpl-${Date.now()}-${i}`, text, checked: false })));
            setShowTemplatePanel(false);
            setTimeout(() => setShowConvertToTasksTooltip(true), 400);
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
          backgroundColor: item.checked ? theme.colors.secondaryGreen : 'white',
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

// ── Checklist Template Panel ──────────────────────────────────────────────────

interface TemplateEntry {
  id: string;
  name: string;
  items: string[];
}

const CHECKLIST_TEMPLATES: TemplateEntry[] = [
  {
    id: 'pre-construction',
    name: 'Pre-Construction Checklist',
    items: [
      'Client contract signed and uploaded',
      'Permits submitted and tracked',
      'Policy confirmed for General Contractor and Subcontractors',
      'Ensure all circuits are labeled clearly and precisely',
      'Insurance approval achieved for GC and Subs',
    ],
  },
  {
    id: 'foundation',
    name: 'Foundation Checklist',
    items: [
      'Site survey and soil testing completed',
      'Foundation design approved by engineer',
      'Excavation complete and inspected',
      'Concrete pour scheduled and approved',
    ],
  },
  {
    id: 'pre-construction-2',
    name: 'Pre-Construction Checklist',
    items: [
      'Project scope finalized',
      'Budget approved by client',
      'Subcontractors confirmed and briefed',
    ],
  },
  {
    id: 'rough-in',
    name: 'Rough-In Checklist (MEP)',
    items: [
      'Mechanical rough-in complete',
      'Electrical rough-in complete',
      'Plumbing rough-in complete',
      'Inspection passed for all MEP trades',
    ],
  },
  {
    id: 'site-prep',
    name: 'Site Preparation Checklist',
    items: [
      'Site cleared and graded',
      'Temporary power and water set up',
      'Safety fencing installed',
      'Material delivery area designated',
    ],
  },
];

function ChecklistTemplatePanel({
  onClose,
  onCreateChecklist,
}: {
  onClose: () => void;
  onCreateChecklist: (items: string[]) => void;
}) {
  const theme = useTheme<Theme>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const slideAnim = useRef(new Animated.Value(580)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 260,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 580,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const toggleTemplate = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = CHECKLIST_TEMPLATES.filter(t => selectedIds.has(t.id))
    .reduce((acc, t) => acc + t.items.length, 0);

  const handleCreate = () => {
    const items = CHECKLIST_TEMPLATES.filter(t => selectedIds.has(t.id))
      .flatMap(t => t.items);
    onCreateChecklist(items);
  };

  return (
    <>
      {/* Overlay */}
      <Pressable
        onPress={handleClose}
        style={{
          ...Platform.select({
            web: { position: 'fixed' } as any,
            default: { position: 'absolute' },
          }),
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          zIndex: 40,
        }}
      />

      {/* Panel */}
      <Animated.View
        style={{
          position: 'absolute' as any,
          top: 0,
          right: 0,
          bottom: 0,
          width: 580,
          backgroundColor: 'white',
          zIndex: 50,
          transform: [{ translateX: slideAnim }],
          ...Platform.select({
            web: { boxShadow: '-10px 0px 40px rgba(0,0,0,0.08)' } as any,
            default: {
              shadowColor: '#000',
              shadowOffset: { width: -5, height: 0 },
              shadowOpacity: 0.1,
              shadowRadius: 20,
              elevation: 10,
            },
          }),
        }}
      >
        <Box flex={1}>
          {/* Header */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            style={{ paddingHorizontal: 24, paddingTop: 21, paddingBottom: 12 }}
          >
            <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.textPrimary, lineHeight: 32 }}>
              Checklist Template
            </Text>
            <Pressable onPress={handleClose} style={{ padding: 4 }}>
              <X size={24} color={theme.colors.textPrimary} />
            </Pressable>
          </Box>

          {/* Template list */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}>
            {CHECKLIST_TEMPLATES.map(template => {
              const selected = selectedIds.has(template.id);
              return (
                <Box
                  key={template.id}
                  style={{
                    marginHorizontal: 16,
                    marginVertical: 6,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    ...Platform.select({
                      web: { boxShadow: '0px 4px 6px -2px rgba(0,0,0,0.10)' } as any,
                      default: {
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.08,
                        shadowRadius: 3,
                        elevation: 2,
                      },
                    }),
                  }}
                >
                  <Pressable
                    style={({ hovered }: any) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      gap: 12,
                      borderRadius: 10,
                      backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                    })}
                  >
                    {/* Heart icon */}
                    <Heart size={24} color={theme.colors.grey04} strokeWidth={1.5} />

                    {/* Name */}
                    <Text
                      style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}
                      numberOfLines={1}
                    >
                      {template.name}
                    </Text>

                    {/* "All" radio toggle */}
                    <Pressable
                      onPress={() => toggleTemplate(template.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingLeft: 4,
                        paddingRight: 8,
                        paddingTop: 2,
                        paddingBottom: 2,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: theme.colors.grey03,
                        backgroundColor: theme.colors.grey02,
                      }}
                    >
                      <Box
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 9,
                          borderWidth: selected ? 0 : 1.5,
                          borderColor: theme.colors.grey04,
                          backgroundColor: selected ? theme.colors.secondaryGreen : 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {selected && <Check size={11} color="white" strokeWidth={2.5} />}
                      </Box>
                      <Text style={{ fontSize: 13, color: theme.colors.textPrimary, fontWeight: '500' }}>
                        All
                      </Text>
                    </Pressable>

                    {/* Chevron */}
                    <ChevronDown size={24} color={theme.colors.grey04} />
                  </Pressable>
                </Box>
              );
            })}
          </ScrollView>

          {/* Footer */}
          <Box
            style={{
              flexShrink: 0,
              paddingHorizontal: 16,
              paddingVertical: 16,
            }}
          >
            <Pressable
              onPress={totalItems > 0 ? handleCreate : undefined}
              style={({ hovered }: any) => ({
                height: 44,
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: totalItems > 0
                  ? hovered ? '#333' : 'black'
                  : theme.colors.grey02,
              })}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: totalItems > 0 ? 'white' : theme.colors.grey04 }}>
                {totalItems > 0 ? `Create Checklist (${totalItems})` : 'Create Checklist'}
              </Text>
            </Pressable>
          </Box>
        </Box>
      </Animated.View>
    </>
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
