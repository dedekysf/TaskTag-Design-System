import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { ProjectDetailScreen } from '../_shared/mobile/ProjectDetailScreen';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import { SuccessModal } from '../_shared/mobile/SuccessModal';
import { TaskListScreen } from '../_shared/mobile/TaskListScreen';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, TextInput, View } from 'react-native';
import { ArrowUp, ChevronDown, HardHat } from 'lucide-react-native';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'project' | 'taskForm' | 'success' | 'projectClean' | 'taskFormAgain';

// ── Task creation bottom sheet ────────────────────────────────────────────────

function TaskCreationSheet({
  taskName,
  description,
  nameRef,
  descRef,
  onNameFocus,
  onNameChange,
  onDescFocus,
  onDescChange,
  onPhysicalKeyPress,
  onSubmit,
}: {
  taskName: string;
  description: string;
  nameRef: React.RefObject<any>;
  descRef: React.RefObject<any>;
  onNameFocus: () => void;
  onNameChange: (text: string) => void;
  onDescFocus: () => void;
  onDescChange: (text: string) => void;
  onPhysicalKeyPress: (key: string) => void;
  onSubmit: () => void;
}) {
  const submitActive = taskName.length > 0;

  return (
    <View style={{ position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41 } as any}>
      <Box backgroundColor="white" style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 } as any}>
        {/* Drag handle */}
        <Box alignItems="center" style={{ paddingTop: 16, paddingBottom: 8 } as any}>
          <View style={{ width: 56, height: 4, backgroundColor: TTTheme.colors.grey04, borderRadius: 2.5 }} />
        </Box>

        {/* Inputs */}
        <Box paddingHorizontal="16" style={{ paddingBottom: 8, gap: 12 } as any}>
          {/* Task name */}
          <Box flexDirection="row" alignItems="center" style={{ gap: 4 } as any}>
            <Box flex={1}>
              <TextInput
                ref={nameRef}
                value={taskName}
                onChangeText={onNameChange}
                onFocus={onNameFocus}
                onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
                placeholder="Enter task name..."
                placeholderTextColor={TTTheme.colors.grey05}
                style={{ fontSize: 16, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none' } as any}
              />
            </Box>
            {/* TODO(BE): validate task name ≤ 100 chars */}
            <Text color="grey05" style={{ fontSize: 8, width: 35, letterSpacing: 0.16 }}>Required</Text>
          </Box>

          {/* Description */}
          <TextInput
            ref={descRef}
            value={description}
            onChangeText={onDescChange}
            onFocus={onDescFocus}
            onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
            placeholder="Add description..."
            placeholderTextColor={TTTheme.colors.grey05}
            multiline
            style={{ fontSize: 14, color: TTTheme.colors.foreground, letterSpacing: 0.28, padding: 0, outlineStyle: 'none' } as any}
          />
        </Box>

        {/* Divider */}
        <Box backgroundColor="border" style={{ height: 1 } as any} />

        {/* Footer: project tag + submit */}
        <Box flexDirection="row" alignItems="center" paddingHorizontal="16" style={{ paddingVertical: 12, gap: 8 } as any}>
          <Box flex={1} flexDirection="row" alignItems="center" style={{ gap: 8 } as any}>
            {/* TODO(BE): GET /api/projects/:id — project.color + project.name */}
            <View style={{ width: 24, height: 24, backgroundColor: '#7B61FF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
              <HardHat size={14} color="#fff" />
            </View>
            <Text variant="mobileLabelSmall" color="foreground">1520 Oliver Street</Text>
            <ChevronDown size={16} color={TTTheme.colors.textPrimary} />
          </Box>

          {/* Submit */}
          <Pressable onPress={submitActive ? onSubmit : undefined}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: submitActive ? TTTheme.colors.secondaryGreen : TTTheme.colors.grey05, alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={20} color="#fff" strokeWidth={2.5} />
            </View>
          </Pressable>
        </Box>
      </Box>
    </View>
  );
}

// ── Phase 1: Project Detail with "Create Task" spotlight + tooltip ─────────────

function ProjectPhase({ onCreateTask }: { onCreateTask: () => void }) {
  const tooltipAnim  = useTooltipAnim(200);
  const containerRef = useRef<any>(null);
  const taskCardRef  = useRef<any>(null);

  // Spotlight rect — defaults match approximate layout while measurement is pending
  const [spot, setSpot] = useState({ x: 16, y: 588, width: 343, height: 62 });

  useEffect(() => {
    // Defer until after the first layout pass
    const t = setTimeout(() => {
      taskCardRef.current?.measure((
        _fx: number, _fy: number,
        width: number, height: number,
        pageX: number, pageY: number,
      ) => {
        containerRef.current?.measure((
          _cfx: number, _cfy: number,
          _cw: number, _ch: number,
          cpageX: number, cpageY: number,
        ) => {
          // Coordinates relative to the container so position:absolute lines up correctly
          setSpot({ x: pageX - cpageX, y: pageY - cpageY, width, height });
        });
      });
    }, 80);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View ref={containerRef} style={{ flex: 1, backgroundColor: 'transparent' }}>
      <StatusBarRow />
      <ProjectDetailScreen taskCardRef={taskCardRef} />

      {/* Spotlight: box-shadow darkens everything except the Tasks card area.
          Size and position are measured dynamically from the rendered Tasks card. */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          left: spot.x, top: spot.y,
          width: spot.width, height: spot.height,
          borderRadius: 8,
          zIndex: 50,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.45)',
        } as any}
      />

      {/* Step 1/4 tooltip — arrow tip sits exactly at the top edge of the Tasks card.
          arrowInset: card padding(15) + icon(32) + gap(9) + half of "Tasks" text(~22) = 78px
          top: spot.y minus estimated card height(138) minus arrow extension(12) = spot.y - 150 */}
      <OnboardingTooltip
        title="Create Task"
        description="Break your project into small steps — tap here to create one."
        step="Step 1/4"
        ctaText="Create a task"
        onCtaPress={onCreateTask}
        style={{ top: spot.y - 158, left: spot.x, zIndex: 60 }}
        arrowEdge="bottom" arrowSide="left" arrowInset={48}
        anim={tooltipAnim}
      />

      {/* Tap target covering the full tooltip area */}
      <Pressable
        onPress={onCreateTask}
        style={{ position: 'absolute', top: spot.y - 158, left: spot.x, width: 312, height: 154, zIndex: 70 } as any}
      />

      {/* Home bar */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
        <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: '#000' }} />
      </View>
    </View>
  );
}

// ── Phase: Project detail without spotlight (after "Back to Project") ────────

function ProjectCleanPhase() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBarRow />
      <ProjectDetailScreen />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
        <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: '#000' }} />
      </View>
    </View>
  );
}

// ── Phase 2: Task form (sheet + keyboard + optional tooltips) ─────────────────

function TaskFormPhase({ onComplete, showTooltips = true }: { onComplete: () => void; showTooltips?: boolean }) {
  const [taskName, setTaskName]       = useState('');
  const [description, setDescription] = useState('');
  const [pressedKey, setPressedKey]   = useState<string | null>(null);

  const nameRef        = useRef<any>(null);
  const descRef        = useRef<any>(null);
  const activeFieldRef = useRef<'name' | 'desc'>('name');
  // Refs mirror state to avoid stale closures in the key handler
  const taskNameRef    = useRef('');
  const descriptionRef = useRef('');

  const nameTooltipOpacity = useRef(new Animated.Value(0)).current;
  const descTooltipOpacity = useRef(new Animated.Value(0)).current;
  const sheetAnim          = useRef(new Animated.Value(0)).current;
  const nameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const descTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keyTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [320, 0] });

  // Tooltip positions — arrow tip is 4px above each input field.
  // Sheet at bottom:291; name row ≈ 418px from screen bottom; desc row ≈ 384px from screen bottom.
  const TOOLTIP_NAME_BOTTOM = 455; // 418 + 4 gap + ~33 (arrow tip extension)
  const TOOLTIP_DESC_BOTTOM = 421; // 384 + 4 gap + ~33

  useEffect(() => {
    sheetAnim.setValue(0);
    nameTooltipOpacity.setValue(0);
    descTooltipOpacity.setValue(0);
    // Sheet slides up
    Animated.timing(sheetAnim, {
      toValue: 1, duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // Name tooltip appears 250ms after sheet starts sliding
    Animated.timing(nameTooltipOpacity, { toValue: 1, duration: 350, delay: 250, useNativeDriver: true }).start();
    const t = setTimeout(() => nameRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fadeIn = (anim: Animated.Value) => {
    anim.stopAnimation();
    Animated.timing(anim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
  };

  const startFadeOut = (anim: Animated.Value) => setTimeout(() => {
    Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }).start();
  }, 400);

  const flashKey = (keyId: string) => {
    if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
    setPressedKey(keyId);
    keyTimerRef.current = setTimeout(() => setPressedKey(null), 150);
  };

  const handleNameFocus = () => {
    activeFieldRef.current = 'name';
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    fadeIn(nameTooltipOpacity);
    descTooltipOpacity.stopAnimation();
    Animated.timing(descTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  const handleNameChange = (text: string) => {
    taskNameRef.current = text;
    setTaskName(text);
    if (nameTimerRef.current) clearTimeout(nameTimerRef.current);
    if (text.length > 0) {
      nameTimerRef.current = startFadeOut(nameTooltipOpacity);
    } else {
      fadeIn(nameTooltipOpacity);
    }
  };

  const handleDescFocus = () => {
    activeFieldRef.current = 'desc';
    if (descTimerRef.current) clearTimeout(descTimerRef.current);
    fadeIn(descTooltipOpacity);
    nameTooltipOpacity.stopAnimation();
    Animated.timing(nameTooltipOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
  };

  const handleDescChange = (text: string) => {
    descriptionRef.current = text;
    setDescription(text);
    if (descTimerRef.current) clearTimeout(descTimerRef.current);
    if (text.length > 0) {
      descTimerRef.current = startFadeOut(descTooltipOpacity);
    } else {
      fadeIn(descTooltipOpacity);
    }
  };

  const handlePhysicalKeyPress = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) flashKey(key.toUpperCase());
    else if (key === ' ')         flashKey('SPACE');
    else if (key === 'Backspace') flashKey('BACKSPACE');
  };

  const handleKeyTap = (keyId: string) => {
    flashKey(keyId);
    const field   = activeFieldRef.current;
    const current = field === 'name' ? taskNameRef.current : descriptionRef.current;
    const setter  = field === 'name' ? handleNameChange : handleDescChange;
    const refocus = () => setTimeout(() => {
      if (field === 'name') nameRef.current?.focus();
      else descRef.current?.focus();
    }, 0);

    if (keyId === 'BACKSPACE') { setter(current.slice(0, -1)); refocus(); }
    else if (keyId === 'SPACE') { setter(current + ' '); refocus(); }
    else if (keyId === 'DONE') { /* dismiss — no action needed in prototype */ }
    else if (keyId === '123')  { /* no-op */ }
    else if (/^[A-Z]$/.test(keyId)) { setter(current + keyId.toLowerCase()); refocus(); }
  };

  return (
    <Box flex={1}>
      {/* Background: task list (empty — no task yet) */}
      <TaskListScreen />

      {/* Dark overlay */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 } as any} />

      {/* Sheet + keyboard — slide in together */}
      <Animated.View style={{ transform: [{ translateY: sheetTranslateY }], zIndex: 41 } as any}>
        <TaskCreationSheet
          taskName={taskName}
          description={description}
          nameRef={nameRef}
          descRef={descRef}
          onNameFocus={handleNameFocus}
          onNameChange={handleNameChange}
          onDescFocus={handleDescFocus}
          onDescChange={handleDescChange}
          onPhysicalKeyPress={handlePhysicalKeyPress}
          onSubmit={onComplete}
        />
        <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
      </Animated.View>

      {showTooltips && (
        <>
          {/* Step 2/4 — Name your Task */}
          <OnboardingTooltip
            title="Name your Task"
            description="e.g. Fix kitchen sink, Install new pipes"
            step="Step 2/4"
            style={{ bottom: TOOLTIP_NAME_BOTTOM, left: 31, zIndex: 43 }}
            arrowEdge="bottom" arrowSide="left" arrowInset={20}
            anim={nameTooltipOpacity}
          />

          {/* Step 3/4 — Add a description */}
          <OnboardingTooltip
            title="Add a description"
            description="Tell the crew what this task is about."
            step="Step 3/4"
            style={{ bottom: TOOLTIP_DESC_BOTTOM, left: 31, zIndex: 43 }}
            arrowEdge="bottom" arrowSide="left" arrowInset={20}
            anim={descTooltipOpacity}
          />
        </>
      )}
    </Box>
  );
}

// ── Main Case4Screen ──────────────────────────────────────────────────────────

export function Case4Screen({ onComplete, startPhase }: { onComplete?: () => void; startPhase?: Phase } = {}) {
  const [phase, setPhase] = useState<Phase>(startPhase ?? 'project');

  return (
    <Box flex={1}>
      {phase === 'project' && (
        <ProjectPhase onCreateTask={() => setPhase('taskForm')} />
      )}

      {phase === 'taskForm' && (
        <TaskFormPhase onComplete={() => setPhase('success')} />
      )}

      {/* Success — task created */}
      {phase === 'success' && (
        <Box flex={1}>
          {/* Background: task list now showing the created task */}
          <TaskListScreen taskCreated />

          {/* Step 4/4 — Task Created! */}
          <SuccessModal
            title="Task Created!"
            description={"You've successfully created your first task!"}
            primaryLabel="Create another Task"
            onPrimary={() => setPhase('taskFormAgain')}
            secondaryLabel="Back to Project"
            onSecondary={() => setPhase('projectClean')}
          />
        </Box>
      )}

      {/* Back to Project — project detail without spotlight or tooltip */}
      {phase === 'projectClean' && <ProjectCleanPhase />}

      {/* Create another Task — task form on task list, no tooltips */}
      {phase === 'taskFormAgain' && (
        <TaskFormPhase
          onComplete={() => setPhase('success')}
          showTooltips={false}
        />
      )}
    </Box>
  );
}
