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
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  FileText,
  GripVertical,
  Heart,
  HelpCircle,
  ListFilter,
  Hash,
  ImageIcon,
  Link,
  Mail,
  MapPin,
  MoreVertical,
  Plus,
  Save,
  Search,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import ReactDOM from 'react-dom';
import { TextInput as DSTextInput } from '@/components/TextInput';
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
  onInviteSentToastDismiss?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ProjectDetail({
  onBack,
  projectName = 'LA Avenue 34 G',
  teamName = 'Personal Projects',
  location = 'Houston, Texas',
  description = 'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  showOnboardingTooltip: showOnboardingTooltipProp = false,
  onInviteSentToastDismiss,
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
  const [templatePanelIsAdd, setTemplatePanelIsAdd] = useState(false);
  const [showConvertToTasksTooltip, setShowConvertToTasksTooltip] = useState(false);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showConvertConfirmModal, setShowConvertConfirmModal] = useState(false);
  const [showConvertToast, setShowConvertToast] = useState(false);
  const [convertSelectedIds, setConvertSelectedIds] = useState<Set<string>>(new Set());
  const [hoveredConvertItemId, setHoveredConvertItemId] = useState<string | null>(null);
  const [showInviteNudge, setShowInviteNudge] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteModalMode, setInviteModalMode] = useState<'member' | 'assignee'>('member');

  // Delete confirmation
  const [deleteModal, setDeleteModal] = useState<{
    section: TaskSectionType;
    taskId: string;
    taskName: string;
  } | null>(null);

  // Copy link
  const [linkCopied, setLinkCopied] = useState(false);
  const [showLinkCopiedToast, setShowLinkCopiedToast] = useState(false);
  const [showInviteSentToast, setShowInviteSentToast] = useState(false);

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

  const cancelAddChecklist = () => {
    setIsAddingItem(false);
    setNewItemText('');
  };

  const toggleConvertItem = (id: string) => {
    setConvertSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleConvertConfirm = () => {
    if (convertSelectedIds.size === 0) return;
    setShowConvertModal(false);
    setTimeout(() => setShowConvertConfirmModal(true), 200);
  };

  const handleConvert = () => {
    setConvertSelectedIds(new Set());
    setShowConvertConfirmModal(false);
    setShowConvertToTasksTooltip(false);
    setShowConvertToast(true);
  };

  const displayChecklist = showCompleted
    ? checklistItems
    : checklistItems.filter(item => !item.checked);

  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'above' | 'below'>('below');
  const draggingIdRef = useRef<string | null>(null);
  const dragOverIdRef = useRef<string | null>(null);
  const dragOverPositionRef = useRef<'above' | 'below'>('below');

  const handleReorder = (fromId: string, toId: string, position: 'above' | 'below' = 'below') => {
    if (fromId === toId) return;
    setChecklistItems(prev => {
      const arr = [...prev];
      const fromIdx = arr.findIndex(i => i.id === fromId);
      const toIdx = arr.findIndex(i => i.id === toId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = arr.splice(fromIdx, 1);
      const newToIdx = arr.findIndex(i => i.id === toId);
      const insertAt = position === 'above' ? newToIdx : newToIdx + 1;
      arr.splice(insertAt, 0, moved);
      return arr;
    });
  };

  const handleChecklistDragStart = (id: string) => {
    draggingIdRef.current = id;
    dragOverIdRef.current = null;
    dragOverPositionRef.current = 'below';
    setDraggingId(id);
    setDragOverId(null);
    setDragOverPosition('below');
  };

  const handleChecklistDragOver = (id: string, position: 'above' | 'below') => {
    dragOverIdRef.current = id;
    dragOverPositionRef.current = position;
    setDragOverId(id);
    setDragOverPosition(position);
  };

  const clearChecklistDrag = () => {
    draggingIdRef.current = null;
    dragOverIdRef.current = null;
    dragOverPositionRef.current = 'below';
    setDraggingId(null);
    setDragOverId(null);
    setDragOverPosition('below');
  };

  const commitChecklistDrag = (droppedId?: string, targetId?: string, position?: 'above' | 'below') => {
    const fromId = droppedId ?? draggingIdRef.current;
    const toId = targetId ?? dragOverIdRef.current;
    const dropPosition = position ?? dragOverPositionRef.current;
    if (fromId && toId) handleReorder(fromId, toId, dropPosition);
    clearChecklistDrag();
  };



  // ── Copy link ──────────────────────────────────────────────────────────────

  const handleCopyLink = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
    setLinkCopied(true);
    setShowLinkCopiedToast(false);
    setTimeout(() => setShowLinkCopiedToast(true), 0);
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
              onOpenAssigneeModal={() => {
                setInviteModalMode('assignee');
                setShowInviteModal(true);
              }}
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
            <Box style={{ flex: 1, minHeight: 0 }}>
              {/* Fixed action bar */}
              <Box
                backgroundColor="white"
                style={{
                  flexShrink: 0,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
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
                    hoverBackgroundColor={theme.colors.grey02}
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
                      hoverBackgroundColor={theme.colors.grey02}
                      onPress={() => { setConvertSelectedIds(new Set()); setShowConvertToTasksTooltip(false); setShowConvertModal(true); }}
                    >
                      <Text style={{ fontSize: 13, color: theme.colors.textPrimary }}>Convert to Tasks</Text>
                    </Button>
                  </TooltipOnboarding>
                </Box>
                <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
                  <Text style={{ fontSize: 14, color: theme.colors.textPrimary, letterSpacing: 0.28 }}>
                    Show completed items
                  </Text>
                  <SimpleToggle value={showCompleted} onChange={setShowCompleted} />
                </Box>
              </Box>


              {/* Scrollable checklist */}
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
                {displayChecklist.map(item => (
                  <ChecklistItemRow
                    key={item.id}
                    item={item}
                    isEditing={editingItemId === item.id}
                    isDragging={draggingId === item.id}
                    isDragOver={dragOverId === item.id}
                    onToggle={() => handleToggleChecklist(item.id)}
                    onDelete={() => handleDeleteChecklist(item.id)}
                    onEdit={() => setEditingItemId(item.id)}
                    onUpdate={text => handleUpdateChecklist(item.id, text)}
                    onCancelEdit={() => setEditingItemId(null)}
                    onDragStart={() => handleChecklistDragStart(item.id)}
                    dragOverPosition={dragOverPosition}
                    onDragOver={position => handleChecklistDragOver(item.id, position)}
                    onDrop={(position, droppedId) => {
                      commitChecklistDrag(droppedId, item.id, position);
                    }}
                    onDragEnd={() => {
                      commitChecklistDrag();
                    }}
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
                    <Box flexDirection="row" alignItems="center" style={{ gap: 8, marginBottom: 6 }}>
                      {/* Input with inline char count */}
                      <Box
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: theme.colors.textPrimary,
                          borderRadius: 4,
                          minHeight: 40,
                        }}
                      >
                        <TextInput
                          value={newItemText}
                          onChangeText={setNewItemText}
                          autoFocus
                          multiline
                          maxLength={255}
                          onKeyPress={(event: any) => {
                            const key = event?.nativeEvent?.key;
                            const isShiftPressed = event?.nativeEvent?.shiftKey || event?.shiftKey;
                            if (key === 'Enter' && !isShiftPressed) {
                              event?.preventDefault?.();
                              handleAddChecklist();
                            }
                          }}
                          onSubmitEditing={handleAddChecklist}
                          onBlur={cancelAddChecklist}
                          style={{
                            flex: 1,
                            fontSize: 14,
                            color: theme.colors.textPrimary,
                            fontFamily: 'Inter_400Regular',
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            outline: 'none',
                          } as any}
                        />
                        <Text style={{ fontSize: 13, color: theme.colors.grey04, paddingRight: 10, flexShrink: 0 }}>
                          {255 - newItemText.length}
                        </Text>
                      </Box>

                      {/* X button outside input */}
                      <Pressable
                        onPress={cancelAddChecklist}
                        style={{ padding: 4 }}
                      >
                        <X size={22} color={theme.colors.textPrimary} />
                      </Pressable>
                    </Box>

                    <Text style={{ fontSize: 12, color: theme.colors.grey04 }}>
                      Press Shift + Enter for new line
                    </Text>
                  </Box>
                )}

                {/* Add buttons – directly below last item, scrolls with content */}
                {!isAddingItem && (
                  <Box
                    style={{
                      flexDirection: 'row',
                      gap: 8,
                      paddingVertical: 16,
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
                      style={{ flex: 1, backgroundColor: theme.colors.grey02, borderWidth: 0, justifyContent: 'flex-start' }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>Add item</Text>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onPress={() => { setTemplatePanelIsAdd(true); setShowTemplatePanel(true); }}
                      leftIcon={
                        <Box style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontSize: 20, color: theme.colors.secondaryGreen, lineHeight: 20 }}>+</Text>
                        </Box>
                      }
                      style={{ flex: 1, backgroundColor: theme.colors.grey02, borderWidth: 0, justifyContent: 'flex-start' }}
                    >
                      <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen }}>Add item from template</Text>
                    </Button>
                  </Box>
                )}
              </ScrollView>

              {/* Invite nudge */}
              {showInviteNudge && (
                <Box
                  style={{
                    flexShrink: 0,
                    marginHorizontal: 24,
                    marginBottom: 24,
                    borderRadius: 8,
                    backgroundColor: '#0F172A',
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 16,
                    gap: 16,
                  }}
                >
                  {/* Icon circle */}
                  <Box
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: 'rgba(52,211,153,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <UserPlus size={24} color={theme.colors.secondaryGreen} strokeWidth={1.8} />
                  </Box>

                  {/* Text */}
                  <Box style={{ flex: 1 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: 'white', lineHeight: 28, marginBottom: 4 }}>
                      Got crew for this job
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: '400', color: theme.colors.grey04, lineHeight: 22 }}>
                      These tasks need someone — invite your team to assign the work
                    </Text>
                  </Box>

                  {/* Invite button */}
                  <Button
                    variant="fill"
                    size="lg"
                    style={{ backgroundColor: theme.colors.secondaryGreen, borderWidth: 0, flexShrink: 0, minWidth: 160 }}
                    hoverBackgroundColor="#16a34a"
                    onPress={() => {
                      setInviteModalMode('member');
                      setShowInviteModal(true);
                      setShowInviteNudge(false);
                    }}
                  >
                    Invite
                  </Button>
                </Box>
              )}
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
          ctaLabel={templatePanelIsAdd ? 'Add item' : undefined}
          onClose={() => { setShowTemplatePanel(false); setTemplatePanelIsAdd(false); }}
          onCreateChecklist={(items: string[]) => {
            const newItems = items.map((text: string, i: number) => ({ id: `tpl-${Date.now()}-${i}`, text, checked: false }));
            if (templatePanelIsAdd) {
              setChecklistItems(prev => [...prev, ...newItems]);
            } else {
              setChecklistItems(newItems);
              setTimeout(() => setShowConvertToTasksTooltip(true), 400);
            }
            setShowTemplatePanel(false);
            setTemplatePanelIsAdd(false);
          }}
        />
      )}

      {/* ── Convert to Tasks — select items modal ── */}
      {showConvertModal && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setShowConvertModal(false)}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onPress={() => setShowConvertModal(false)}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <Box
                backgroundColor="white"
                style={{
                  borderRadius: 16,
                  paddingTop: 24,
                  paddingBottom: 24,
                  paddingHorizontal: 24,
                  width: 480,
                  ...Platform.select({
                    web: { boxShadow: '0px 8px 32px rgba(0,0,0,0.18)' } as any,
                    default: { elevation: 16 },
                  }),
                }}
              >
                {/* Header */}
                <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.textPrimary }}>
                    Select Checklist
                  </Text>
                  <Pressable onPress={() => setShowConvertModal(false)} style={{ padding: 4 }}>
                    <X size={24} color={theme.colors.textPrimary} />
                  </Pressable>
                </Box>

                {/* Item list */}
                <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
                  {checklistItems.map((item, idx) => {
                    const checked = convertSelectedIds.has(item.id);
                    return (
                      <Box key={item.id}>
                        <Pressable
                          onPress={() => toggleConvertItem(item.id)}
                          onHoverIn={() => setHoveredConvertItemId(item.id)}
                          onHoverOut={() => setHoveredConvertItemId(null)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 12,
                            paddingVertical: 14,
                            paddingHorizontal: 8,
                            backgroundColor: hoveredConvertItemId === item.id ? theme.colors.grey02 : 'transparent',
                          }}
                        >
                          <Box
                            style={{
                              width: 22,
                              height: 22,
                              borderRadius: 4,
                              borderWidth: checked ? 0 : 1.5,
                              borderColor: theme.colors.grey03,
                              backgroundColor: checked ? theme.colors.secondaryGreen : 'white',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {checked && <Check size={13} color="white" strokeWidth={2.5} />}
                            {!checked && hoveredConvertItemId === item.id && <Check size={13} color={theme.colors.grey05} strokeWidth={2.5} />}
                          </Box>
                          <Text numberOfLines={2} style={{ flex: 1, fontSize: 15, color: theme.colors.textPrimary, lineHeight: 22 }}>
                            {item.text}
                          </Text>
                        </Pressable>
                        {idx < checklistItems.length - 1 && (
                          <Box style={{ height: 1, backgroundColor: theme.colors.grey03 }} />
                        )}
                      </Box>
                    );
                  })}
                </ScrollView>

                {/* Footer */}
                <Box flexDirection="row" justifyContent="flex-end" style={{ marginTop: 20 }}>
                  <Pressable
                    onPress={handleConvertConfirm}
                    style={({ hovered }: any) => ({
                      height: 44,
                      paddingHorizontal: 24,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: convertSelectedIds.size > 0
                        ? hovered ? '#333' : 'black'
                        : theme.colors.grey02,
                    })}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: convertSelectedIds.size > 0 ? 'white' : theme.colors.grey04 }}>
                      Confirm
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* ── Convert to Tasks — confirmation modal ── */}
      {showConvertConfirmModal && (
        <Modal transparent animationType="fade" visible onRequestClose={() => setShowConvertConfirmModal(false)}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}
            onPress={() => setShowConvertConfirmModal(false)}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <Box
                backgroundColor="white"
                style={{
                  borderRadius: 16,
                  padding: 24,
                  width: 480,
                  ...Platform.select({
                    web: { boxShadow: '0px 8px 32px rgba(0,0,0,0.18)' } as any,
                    default: { elevation: 16 },
                  }),
                }}
              >
                {/* Header */}
                <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ marginBottom: 16 }}>
                  <Text style={{ fontSize: 20, fontWeight: '600', color: theme.colors.textPrimary }}>
                    Ready to convert?
                  </Text>
                  <Pressable onPress={() => setShowConvertConfirmModal(false)} style={{ padding: 4 }}>
                    <X size={24} color={theme.colors.textPrimary} />
                  </Pressable>
                </Box>

                {/* Body */}
                <Text style={{ fontSize: 14, color: theme.colors.textPrimary, lineHeight: 22, marginBottom: 24 }}>
                  These items will be saved as tasks instead of staying in your checklist.
                </Text>

                {/* Footer */}
                <Box flexDirection="row" justifyContent="flex-end">
                  <Pressable
                    onPress={handleConvert}
                    style={({ hovered }: any) => ({
                      height: 44,
                      paddingHorizontal: 24,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: hovered ? '#334155' : '#1E293B',
                    })}
                  >
                    <Text style={{ fontSize: 14, fontWeight: '600', color: 'white' }}>
                      Convert
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {/* ── Convert to task toast ── */}
      {showConvertToast && (
        <Toast
          visible={showConvertToast}
          title="Converted to task"
          variant="title-arrow"
          type="success"
          onDismiss={() => { setShowConvertToast(false); setShowInviteNudge(true); }}
        />
      )}

      {/* ── Invite modal ── */}
      {showLinkCopiedToast && (
        <Toast
          visible={showLinkCopiedToast}
          title="Link copied"
          caption="Paste it to any messaging app to invite your team."
          variant="title-caption"
          type="success"
          onDismiss={() => setShowLinkCopiedToast(false)}
        />
      )}

      {showInviteSentToast && (
        <Toast
          visible={showInviteSentToast}
          title="Invite sent"
          caption="Once they join, you can assign them tasks directly."
          variant="title-caption"
          type="success"
          onDismiss={() => {
            setShowInviteSentToast(false);
            onInviteSentToastDismiss?.();
          }}
        />
      )}

      {showInviteModal && (
        <InviteModal
          mode={inviteModalMode}
          onClose={() => setShowInviteModal(false)}
          onSendInvite={() => {
            setShowInviteModal(false);
            setShowInviteSentToast(false);
            setTimeout(() => setShowInviteSentToast(true), 0);
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
  isDragging,
  isDragOver,
  dragOverPosition,
  onToggle,
  onDelete,
  onEdit,
  onUpdate,
  onCancelEdit,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: {
  item: ChecklistItemData;
  isEditing: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  dragOverPosition: 'above' | 'below';
  onToggle: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onUpdate: (text: string) => void;
  onCancelEdit: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOver: (position: 'above' | 'below') => void;
  onDrop: (position: 'above' | 'below', droppedId?: string) => void;
}) {
  const theme = useTheme<Theme>();
  const [editText, setEditText] = useState(item.text);
  const cancelledRef = React.useRef(false);
  const dragStartedRef = React.useRef(false);

  const getDropPosition = (e: any): 'above' | 'below' => {
    const target = e.currentTarget;
    if (!target || typeof target.getBoundingClientRect !== 'function') return 'below';
    const rect = target.getBoundingClientRect();
    const clientY = e.clientY ?? e.nativeEvent?.clientY ?? rect.top + rect.height;
    return clientY < rect.top + rect.height / 2 ? 'above' : 'below';
  };

  const getDataTransfer = (e: any) => e.dataTransfer ?? e.nativeEvent?.dataTransfer;

  useEffect(() => {
    if (isEditing) { setEditText(item.text); cancelledRef.current = false; }
  }, [isEditing]);

  const handleBlurSave = () => {
    if (cancelledRef.current) return;
    if (editText.trim()) onUpdate(editText.trim());
    else onCancelEdit();
  };

  const handleCancel = () => {
    cancelledRef.current = true;
    onCancelEdit();
  };

  const webDragProps = Platform.OS === 'web' && !isEditing ? {
    draggable: true,
    onDragStart: (e: any) => {
      const dataTransfer = getDataTransfer(e);
      if (dataTransfer) {
        dataTransfer.effectAllowed = 'move';
        dataTransfer.setData('text/plain', item.id);
        dataTransfer.setData('Text', item.id);
      }
      dragStartedRef.current = true;
      onDragStart();
    },
    onDragEnd: () => onDragEnd(),
    onDragEnter: (e: any) => {
      e.preventDefault();
      onDragOver(getDropPosition(e));
    },
    onDragOver: (e: any) => {
      e.preventDefault();
      const dataTransfer = getDataTransfer(e);
      if (dataTransfer) dataTransfer.dropEffect = 'move';
      onDragOver(getDropPosition(e));
    },
    onDrop: (e: any) => {
      e.preventDefault();
      const dataTransfer = getDataTransfer(e);
      const droppedId = dataTransfer?.getData('text/plain') || dataTransfer?.getData('Text') || undefined;
      onDrop(getDropPosition(e), droppedId);
    },
  } as any : {};

  return (
    <Pressable
      {...webDragProps}
      onPress={!isEditing ? () => {
        if (!dragStartedRef.current) onEdit();
        dragStartedRef.current = false;
      } : undefined}
      style={({ hovered }: any) => ({
        backgroundColor: hovered && !isEditing ? theme.colors.grey02 : 'white',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: isEditing ? 'flex-start' : 'center',
        gap: 10,
        opacity: isDragging ? 0.4 : 1,
        position: 'relative',
        ...Platform.select({
          web: isDragging ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' } as any : {},
        }),
      })}
    >
      {({ hovered }: any) => (
        <>
          {isDragOver && !isDragging && (
            <View
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: -1,
                right: -1,
                [dragOverPosition === 'above' ? 'top' : 'bottom']: -5,
                height: 2,
                backgroundColor: theme.colors.secondaryGreen,
                borderRadius: 999,
                zIndex: 2,
              }}
            />
          )}
          {/* Drag handle – space always reserved, icon only on hover */}
          {!isEditing && (
            <Box
              style={{
                width: 10,
                flexShrink: 0,
                alignItems: 'center',
                justifyContent: 'center',
                ...Platform.select({ web: hovered ? { cursor: 'grab' } as any : {} }),
              }}
            >
              {hovered && <GripVertical size={13} color={theme.colors.grey04} strokeWidth={2} />}
            </Box>
          )}

          {/* Checkbox – shows faint check on row hover */}
          {!isEditing && (
            <Pressable
              onPress={onToggle}
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: item.checked ? theme.colors.secondaryGreen : (hovered ? theme.colors.grey04 : theme.colors.grey04),
                backgroundColor: item.checked ? theme.colors.secondaryGreen : 'white',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.checked && <Check size={12} color="white" strokeWidth={2.5} />}
              {!item.checked && hovered && (
                <Check size={12} color={theme.colors.grey05} strokeWidth={2.5} />
              )}
            </Pressable>
          )}

          {/* Text or edit input */}
          {isEditing ? (
            <Box flex={1}>
              <Box
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: theme.colors.textPrimary,
                  borderRadius: 4,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  gap: 8,
                }}
              >
                <TextInput
                  value={editText}
                  onChangeText={setEditText}
                  autoFocus
                  multiline
                  maxLength={255}
                  onBlur={handleBlurSave}
                  style={{
                    flex: 1,
                    fontSize: 14,
                    color: theme.colors.textPrimary,
                    fontFamily: 'Inter_400Regular',
                    outline: 'none',
                    minHeight: 20,
                  } as any}
                />
                <Text style={{ fontSize: 12, color: theme.colors.grey04, flexShrink: 0 }}>
                  {255 - editText.length}
                </Text>
              </Box>
              <Text style={{ fontSize: 12, color: theme.colors.grey04, marginTop: 4 }}>
                Press Shift + Enter for new line
              </Text>
            </Box>
          ) : (
            <Text
              style={{
                flex: 1,
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
          )}

          {/* X – cancel in edit mode, delete otherwise */}
          <Pressable
            pointerEvents={hovered || isEditing ? 'auto' : 'none'}
            onPress={isEditing ? handleCancel : onDelete}
            hitSlop={8}
            style={({ hovered: xHovered }: any) => ({
              width: 28,
              height: 28,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: xHovered ? theme.colors.grey02 : 'transparent',
              flexShrink: 0,
              marginTop: isEditing ? 2 : 0,
              opacity: hovered || isEditing ? 1 : 0,
            })}
          >
            <X size={16} color={theme.colors.grey05} />
          </Pressable>
        </>
      )}
    </Pressable>
  );
}

// ── Invite Modal ──────────────────────────────────────────────────────────────

const INVITE_TEAL = '#1a6b6b';
const INVITE_ILLUSTRATION = require('@/assets/images/il_invite.png');

type InviteeContact = {
  id: string;
  name: string;
  email: string;
  avatar: { type: 'photo'; src: any } | { type: 'initials'; initials: string; color: string } | { type: 'email' };
};
type InviteModalMode = 'member' | 'assignee';
type InviteRole = 'Admin' | 'Editor' | 'Viewer' | 'Assignee';
type InviteeEntry = InviteeContact & { role: InviteRole };
type InviteRoleOption = { label: InviteRole; description: string };
type InviteGroup = {
  id: string; name: string; memberCount: number;
  members: { id: string; name: string; email: string; initials: string }[];
};

const PROJECT_INVITE_ROLES: InviteRoleOption[] = [
  { label: 'Admin', description: 'Can manage project settings, roles, permissions, and invite new people.' },
  { label: 'Editor', description: 'Can edit project tasks, files, and collaborate with the team.' },
  { label: 'Viewer', description: 'Can view project activity and tasks without making changes.' },
];

const ASSIGNEE_INVITE_ROLES: InviteRoleOption[] = [
  { label: 'Assignee', description: 'Can work on this task and update task progress.' },
  { label: 'Viewer', description: 'Can view this task without being responsible for the work.' },
];

const INVITE_CONTACTS: InviteeContact[] = [
  { id: 'chelsea-smith', name: 'Chelsea Smith', email: 'chelseasmith@gmail.com', avatar: { type: 'photo', src: require('@/assets/images/sample-three.jpg') } },
  { id: 'chelsea-janson', name: 'Chelsea Janson', email: 'chelseajason@gmail.com', avatar: { type: 'initials', initials: 'CJ', color: INVITE_TEAL } },
];
const INVITE_GROUPS: InviteGroup[] = [
  {
    id: 'chelsea-group', name: 'Chelsea Group', memberCount: 4,
    members: [
      { id: 'lj', name: 'Logan Jack', email: 'loganjack@gmail.com', initials: 'LJ' },
      { id: 'mg', name: 'Mason Gabriel', email: 'masongabriel@gmail.com', initials: 'MG' },
      { id: 'cg', name: 'Caleb Gabriel', email: 'calebgabriel@gmail.com', initials: 'CG' },
      { id: 'rp', name: 'Rachel Park', email: 'rachelpark@gmail.com', initials: 'RP' },
    ],
  },
];

function InviteTooltip({
  label, children, variant = 'default', forceOpen = false, align = 'right',
}: {
  label: string; children: React.ReactNode; variant?: 'default' | 'success'; forceOpen?: boolean; align?: 'left' | 'right';
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
          <Text numberOfLines={1} style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: '400' }}>{label}</Text>
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
      {visible && pos && Platform.OS === 'web' && ReactDOM.createPortal(
        <View style={{ position: 'fixed' as any, top: pos.top, ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }), zIndex: 999999, pointerEvents: 'none' as any }}>
          {tooltipBox}
        </View>,
        document.body
      )}
    </>
  );
}

function HighlightText({ text, query, baseStyle }: { text: string; query: string; baseStyle: any }) {
  if (!query) return <Text style={baseStyle}>{text}</Text>;
  const lower = text.toLowerCase();
  const lowerQ = query.toLowerCase();
  const idx = lower.indexOf(lowerQ);
  if (idx === -1) return <Text style={baseStyle}>{text}</Text>;
  return (
    <Text style={baseStyle}>
      {text.slice(0, idx)}
      <Text style={[baseStyle, { backgroundColor: '#FFF176' }]}>{text.slice(idx, idx + query.length)}</Text>
      {text.slice(idx + query.length)}
    </Text>
  );
}

function InviteAvatar({ avatar, size = 40 }: { avatar: InviteeContact['avatar']; size?: number }) {
  const theme = useTheme<Theme>();
  if (avatar.type === 'photo') {
    return <Image source={avatar.src} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  if (avatar.type === 'email') {
    return (
      <Box width={size} height={size} borderRadius="full" backgroundColor="grey02" alignItems="center" justifyContent="center">
        <Mail size={Math.round(size * 0.45)} color={theme.colors.grey05} />
      </Box>
    );
  }
  return (
    <Box width={size} height={size} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: avatar.color }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.35 }}>{avatar.initials}</Text>
    </Box>
  );
}

function InviteRoleDropdown({
  roles,
  onSelect,
  onClose,
}: {
  roles: InviteRoleOption[];
  onSelect: (role: InviteRole) => void;
  onClose: () => void;
}) {
  const theme = useTheme<Theme>();
  return (
    <Box
      style={{
        backgroundColor: theme.colors.white,
        borderRadius: 12,
        alignSelf: 'flex-start',
        maxWidth: 360,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: theme.colors.grey03,
        overflow: 'hidden' as any,
        ...Platform.select({ web: { width: 'max-content', boxShadow: '0px 4px 24px rgba(0,0,0,0.14)' } as any }),
      }}
    >
      {roles.map((role, i) => (
        <Pressable
          key={role.label}
          onPress={() => { onSelect(role.label); onClose(); }}
          style={({ pressed, hovered }: any) => ({
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderBottomWidth: i < roles.length - 1 ? 1 : 0,
            borderBottomColor: theme.colors.grey03,
            backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent',
            cursor: 'pointer' as any,
          })}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground, marginBottom: 4 }}>{role.label}</Text>
          <Text style={{ fontSize: 13, color: theme.colors.grey05, lineHeight: 18 }}>{role.description}</Text>
        </Pressable>
      ))}
    </Box>
  );
}

function InviteModal({
  mode = 'member',
  onClose,
  onSendInvite,
}: {
  mode?: InviteModalMode;
  onClose: () => void;
  onSendInvite: () => void;
}) {
  const theme = useTheme<Theme>();
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [showLinkCopiedToast, setShowLinkCopiedToast] = useState(false);
  const [invitees, setInvitees] = useState<InviteeEntry[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const isAssigneeMode = mode === 'assignee';
  const roleOptions = isAssigneeMode ? ASSIGNEE_INVITE_ROLES : PROJECT_INVITE_ROLES;
  const defaultRole: InviteRole = isAssigneeMode ? 'Assignee' : 'Editor';
  const title = isAssigneeMode ? 'Invite or Add Assignee' : 'Invite or Add Member';
  const inputPlaceholder = isAssigneeMode ? 'Add assignees by email, name or group' : 'Add members by email, name or group';
  const emptyTitle = isAssigneeMode ? 'Assign teammates to this task' : 'Bring your team on board';
  const emptyDescription = isAssigneeMode
    ? 'Add existing assignees or invite new ones to collaborate on this task.'
    : 'Invite teammates or contact groups to start working together seamlessly.';

  const query = inputValue.trim();
  const showDropdown = query.length > 0;

  const filteredContacts = INVITE_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredGroups = INVITE_GROUPS.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  const addInvitee = (contact: InviteeContact) => {
    if (!invitees.find(i => i.id === contact.id)) {
      setInvitees(prev => [...prev, { ...contact, role: defaultRole }]);
    }
    setInputValue('');
  };

  const removeInvitee = (id: string) => setInvitees(prev => prev.filter(i => i.id !== id));

  const [openInviteeRole, setOpenInviteeRole] = useState<string | null>(null);
  const [inviteeRolePos, setInviteeRolePos] = useState<{ top: number; right: number } | null>(null);
  const inviteeRoleRefs = useRef<{ [id: string]: View | null }>({});

  const handleOpenInviteeRole = (id: string) => {
    const ref = inviteeRoleRefs.current[id];
    if (openInviteeRole === id) { setOpenInviteeRole(null); setInviteeRolePos(null); return; }
    if (ref) {
      (ref as any).measureInWindow((x: number, y: number, w: number, h: number) => {
        const ww = typeof window !== 'undefined' ? window.innerWidth : 1200;
        setInviteeRolePos({ top: y + h + 4, right: ww - (x + w) });
        setOpenInviteeRole(id);
      });
    }
  };

  const toggleGroup = (id: string) =>
    setExpandedGroups(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });

  const handleCopyLink = () => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
    }
    setCopied(true);
    setShowLinkCopiedToast(false);
    setTimeout(() => setShowLinkCopiedToast(true), 0);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputContainerRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const measureInputPosition = React.useCallback(() => {
    if (inputContainerRef.current) {
      (inputContainerRef.current as any).measureInWindow((x: number, y: number, w: number, h: number) => {
        if (w > 0) setDropdownPos({ top: y + h - 14, left: x, width: w });
      });
    }
  }, []);
  React.useEffect(() => {
    if (showDropdown) setTimeout(measureInputPosition, 0);
    else setDropdownPos(null);
  }, [showDropdown, measureInputPosition]);

  const dropdownItems = (
    <View style={{
      backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, overflow: 'hidden',
      shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8,
    }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
        <Pressable
          onPress={() => {
            addInvitee({
              id: `email-${query}`,
              name: `${query.toLowerCase()}@gmail.com`,
              email: `${query.toLowerCase()}@gmail.com`,
              avatar: { type: 'email' },
            });
          }}
          style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
        >
          <Box width={40} height={40} borderRadius="full" backgroundColor="grey02" alignItems="center" justifyContent="center">
            <Mail size={18} color={theme.colors.grey05} />
          </Box>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
            Invite: {query.toLowerCase()}@gmail.com
          </Text>
        </Pressable>
        {filteredContacts.map((contact) => (
          <Box key={contact.id}>
            <Box style={{ height: 1, backgroundColor: theme.colors.border }} />
            <Pressable
              onPress={() => addInvitee(contact)}
              style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
            >
              <InviteAvatar avatar={contact.avatar} size={40} />
              <Box style={{ gap: 0 }}>
                <HighlightText text={contact.name} query={query} baseStyle={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }} />
                <HighlightText text={contact.email} query={query} baseStyle={{ fontSize: 13, color: theme.colors.grey05 }} />
              </Box>
            </Pressable>
          </Box>
        ))}
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          return (
            <Box key={group.id}>
              <Box style={{ height: 1, backgroundColor: theme.colors.border }} />
              <Pressable
                onPress={() => toggleGroup(group.id)}
                style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
              >
                <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.grey02 }}>
                  {isExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
                </Box>
                <Box style={{ gap: 0 }}>
                  <HighlightText text={group.name} query={query} baseStyle={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }} />
                  <Text style={{ fontSize: 13, color: theme.colors.grey04 }}>{group.memberCount} members</Text>
                </Box>
              </Pressable>
              {isExpanded && group.members.map((member) => (
                <Box key={member.id}>
                  <Box style={{ height: 1, backgroundColor: theme.colors.border }} />
                  <Pressable
                    onPress={() => addInvitee({ id: member.id, name: member.name, email: member.email, avatar: { type: 'initials', initials: member.initials, color: INVITE_TEAL } })}
                    style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 68, paddingRight: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
                  >
                    <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: INVITE_TEAL }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{member.initials}</Text>
                    </Box>
                    <Box style={{ gap: 0 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{member.name}</Text>
                      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{member.email}</Text>
                    </Box>
                  </Pressable>
                </Box>
              ))}
            </Box>
          );
        })}
      </ScrollView>
    </View>
  );

  const content = (
    <>
      <Pressable
        onPress={onClose}
        style={Platform.select({
          web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' } as any,
          default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
        })}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{ backgroundColor: theme.colors.white, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, width: 800, maxWidth: '95%' as any }}
        >
          {/* Header */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 24, paddingVertical: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.foreground, lineHeight: 24 }}>{title}</Text>
            <Box flexDirection="row" alignItems="center" gap="8">
              <View style={{ position: 'relative' as any, zIndex: 10002 }}>
                <InviteTooltip label={copied ? 'Link copied!' : 'Copy link to invite'} variant={copied ? 'success' : 'default'} forceOpen={copied}>
                  <Pressable
                    onPress={handleCopyLink}
                    style={({ hovered, pressed }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
                  >
                    <Link size={14} color={theme.colors.blue} />
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.blue }}>Copy Link</Text>
                  </Pressable>
                </InviteTooltip>
              </View>
              <Pressable
                onPress={onClose}
                style={({ hovered, pressed }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
              >
                <X size={18} color={theme.colors.grey06} />
              </Pressable>
            </Box>
          </Box>

          {/* Body */}
          <Box style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
            <View ref={inputContainerRef}>
              <DSTextInput
                size="lg"
                value={inputValue}
                onChangeText={(v) => { setInputValue(v); if (v.trim()) setTimeout(measureInputPosition, 0); }}
                placeholder={inputPlaceholder}
              />
            </View>
            <Box>
              {invitees.length > 0 ? (
                <Box style={{ paddingTop: 16 }}>
                  {invitees.map((invitee, i) => (
                    <Box key={invitee.id}>
                      {i > 0 && <Box style={{ height: 1, backgroundColor: theme.colors.border }} />}
                      <Box flexDirection="row" alignItems="center" gap="12" style={{ paddingVertical: 12 }}>
                        <InviteAvatar avatar={invitee.avatar} size={44} />
                        <Box flex={1} style={{ gap: 0 }}>
                          {invitee.avatar.type === 'email' ? (
                            <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{invitee.email}</Text>
                          ) : (
                            <>
                              <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{invitee.name}</Text>
                              <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{invitee.email}</Text>
                            </>
                          )}
                        </Box>
                        <Pressable
                          ref={(r) => { inviteeRoleRefs.current[invitee.id] = r; }}
                          onPress={() => handleOpenInviteeRole(invitee.id)}
                          style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
                        >
                          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.foreground }}>{invitee.role}</Text>
                          <ChevronDown size={16} color={theme.colors.foreground} />
                        </Pressable>
                        <Pressable
                          onPress={() => removeInvitee(invitee.id)}
                          style={({ hovered }: any) => ({ padding: 6, borderRadius: 6, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
                        >
                          <Trash2 size={18} color={theme.colors.grey06} />
                        </Pressable>
                      </Box>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box alignItems="center" justifyContent="center" style={{ gap: 0, paddingTop: 16, paddingBottom: 8 }}>
                  <Image source={INVITE_ILLUSTRATION} style={{ width: 86, height: 86 }} resizeMode="contain" />
                  <Text style={{ fontSize: 14, fontWeight: '400', color: theme.colors.foreground, lineHeight: 16, textAlign: 'center' }}>
                    {emptyTitle}
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 12, color: theme.colors.grey05, lineHeight: 16, textAlign: 'center', letterSpacing: 0.24 }}>
                    {emptyDescription}
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 10 }}>
            <Box style={{ paddingTop: invitees.length > 0 ? 16 : 0 }}>
              <Button
                disabled={invitees.length === 0}
                color="secondary"
                size="xl"
                onPress={() => {
                  if (invitees.length === 0) return;
                  onSendInvite();
                }}
                style={{ width: '100%' as any }}
              >
                Send Invite
              </Button>
            </Box>
            <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
              <HelpCircle size={14} color={theme.colors.grey05} />
              <Text style={{ fontSize: 12, color: theme.colors.grey05, letterSpacing: 0.24 }}>Invitations expire after 7 days</Text>
            </Box>
          </Box>
        </Pressable>
      </Pressable>

      {showLinkCopiedToast && (
        <Toast
          visible={showLinkCopiedToast}
          title="Link copied"
          caption="Paste it to any messaging app to invite your team."
          variant="title-caption"
          type="success"
          style={{ zIndex: 10005 }}
          onDismiss={() => setShowLinkCopiedToast(false)}
        />
      )}

      {showDropdown && dropdownPos && (
        <>
          <Pressable
            onPress={() => setInputValue('')}
            style={Platform.select({
              web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10001 } as any,
              default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10001 },
            })}
          />
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={Platform.select({
              web: { position: 'fixed', top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 10002 } as any,
              default: { position: 'absolute' as any, top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width, zIndex: 10002 },
            })}
          >
            {dropdownItems}
          </Pressable>
        </>
      )}

      {openInviteeRole !== null && inviteeRolePos !== null && (
        <>
          <Pressable
            onPress={() => { setOpenInviteeRole(null); setInviteeRolePos(null); }}
            style={Platform.select({
              web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10003 } as any,
              default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10003 },
            })}
          />
          <Box
            style={Platform.select({
              web: { position: 'fixed', top: inviteeRolePos.top, right: inviteeRolePos.right, zIndex: 10004 } as any,
              default: { position: 'absolute' as any, top: inviteeRolePos.top, right: inviteeRolePos.right, zIndex: 10004 },
            })}
          >
            <InviteRoleDropdown
              roles={roleOptions}
              onSelect={(role) => {
                setInvitees(prev => prev.map(i => i.id === openInviteeRole ? { ...i, role } : i));
              }}
              onClose={() => { setOpenInviteeRole(null); setInviteeRolePos(null); }}
            />
          </Box>
        </>
      )}
    </>
  );

  return Platform.OS === 'web'
    ? ReactDOM.createPortal(content, document.body)
    : content;
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
  ctaLabel,
}: {
  onClose: () => void;
  onCreateChecklist: (items: string[]) => void;
  ctaLabel?: string;
}) {
  const theme = useTheme<Theme>();
  // Map from template id to Set of selected item indices
  const [selectedItems, setSelectedItems] = useState<Map<string, Set<number>>>(new Map());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
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

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllItems = (template: TemplateEntry) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      const currentSet = next.get(template.id) ?? new Set<number>();
      if (currentSet.size === template.items.length) {
        next.delete(template.id);
      } else {
        next.set(template.id, new Set(template.items.map((_, i) => i)));
      }
      return next;
    });
  };

  const toggleItem = (templateId: string, itemIndex: number) => {
    setSelectedItems(prev => {
      const next = new Map(prev);
      const currentSet = new Set(next.get(templateId) ?? []);
      if (currentSet.has(itemIndex)) {
        currentSet.delete(itemIndex);
      } else {
        currentSet.add(itemIndex);
      }
      if (currentSet.size === 0) {
        next.delete(templateId);
      } else {
        next.set(templateId, currentSet);
      }
      return next;
    });
  };

  const totalItems = Array.from(selectedItems.values()).reduce((acc, set) => acc + set.size, 0);

  const handleCreate = () => {
    const items: string[] = [];
    for (const template of CHECKLIST_TEMPLATES) {
      const selected = selectedItems.get(template.id);
      if (selected) {
        for (const idx of Array.from(selected).sort((a, b) => a - b)) {
          items.push(template.items[idx]);
        }
      }
    }
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
              const selectedSet = selectedItems.get(template.id) ?? new Set<number>();
              const selectedCount = selectedSet.size;
              const totalCount = template.items.length;
              const isExpanded = expandedIds.has(template.id);
              const allSelected = selectedCount === totalCount;
              const hasSelection = selectedCount > 0;

              return (
                <Box
                  key={template.id}
                  style={{
                    marginHorizontal: 16,
                    marginVertical: 6,
                    borderRadius: 10,
                    backgroundColor: 'white',
                    overflow: 'hidden',
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
                  {/* Header row — split into tappable expand area + badge + chevron */}
                  <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
                    <Pressable
                      onPress={() => toggleExpanded(template.id)}
                      style={({ hovered }: any) => ({
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                        backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                        marginHorizontal: -16,
                        paddingHorizontal: 16,
                        marginVertical: -14,
                        paddingVertical: 14,
                      })}
                    >
                      <Heart size={24} color={theme.colors.grey04} strokeWidth={1.5} />
                      <Text
                        style={{ flex: 1, fontSize: 14, fontWeight: '600', color: theme.colors.textPrimary }}
                        numberOfLines={1}
                      >
                        {template.name}
                      </Text>
                    </Pressable>

                    {/* Badge pill: toggle all items */}
                    <Pressable
                      onPress={() => toggleAllItems(template)}
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
                          borderWidth: hasSelection ? 0 : 1.5,
                          borderColor: theme.colors.grey04,
                          backgroundColor: hasSelection ? theme.colors.secondaryGreen : 'white',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {hasSelection && <Check size={11} color="white" strokeWidth={2.5} />}
                      </Box>
                      <Text style={{ fontSize: 13, color: theme.colors.textPrimary, fontWeight: '500' }}>
                        {hasSelection && !allSelected ? String(selectedCount) : 'All'}
                      </Text>
                    </Pressable>

                    {/* Chevron */}
                    <Pressable onPress={() => toggleExpanded(template.id)}>
                      <Box style={{ transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }}>
                        <ChevronDown size={24} color={theme.colors.grey04} />
                      </Box>
                    </Pressable>
                  </Box>

                  {/* Expanded item list */}
                  {isExpanded && (
                    <Box style={{ marginHorizontal: 16, marginBottom: 14 }}>
                      <Box style={{ backgroundColor: theme.colors.grey01, borderRadius: 8, overflow: 'hidden' }}>
                        <Text style={{
                          fontSize: 13,
                          fontWeight: '600',
                          color: theme.colors.textPrimary,
                          paddingHorizontal: 12,
                          paddingTop: 12,
                          paddingBottom: 8,
                        }}>
                          {template.name}
                        </Text>
                        <Box style={{ height: 1, backgroundColor: theme.colors.grey03 }} />
                        {template.items.map((item, idx) => {
                          const checked = selectedSet.has(idx);
                          return (
                            <Pressable
                              key={idx}
                              onPress={() => toggleItem(template.id, idx)}
                            >
                              {({ hovered }: any) => (
                                <Box
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 12,
                                    paddingHorizontal: 12,
                                    paddingVertical: 10,
                                    backgroundColor: hovered ? theme.colors.grey02 : 'transparent',
                                  }}
                                >
                                  <Box
                                    style={{
                                      width: 22,
                                      height: 22,
                                      borderRadius: 4,
                                      borderWidth: checked ? 0 : 1.5,
                                      borderColor: theme.colors.grey04,
                                      backgroundColor: checked ? theme.colors.secondaryGreen : 'white',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    {checked && <Check size={13} color="white" strokeWidth={2.5} />}
                                    {!checked && hovered && <Check size={13} color={theme.colors.grey05} strokeWidth={2.5} />}
                                  </Box>
                                  <Text style={{ flex: 1, fontSize: 14, color: theme.colors.textPrimary }}>
                                    {item}
                                  </Text>
                                </Box>
                              )}
                            </Pressable>
                          );
                        })}
                      </Box>
                    </Box>
                  )}
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
                {totalItems > 0 ? `${ctaLabel ?? 'Create Checklist'} (${totalItems})` : (ctaLabel ?? 'Create Checklist')}
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
