import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ChatsScreen } from '../_shared/mobile/ChatsScreen';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, Pressable, View } from 'react-native';
import { Activity, ArrowLeft, Folder, Hash, MessageSquare, MoreVertical, Plus, Search, Send, X } from 'lucide-react-native';


// ── Shared sub-components ────────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
      <View style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 5 }} />
    </View>
  );
}

function BottomNav() {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 16, paddingTop: 4, gap: 24 } as any}>
        <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
          <MessageSquare size={24} color={TTTheme.colors.secondaryGreen} />
          <Text variant="mobileLabelSmall" color="secondaryGreen">Chats</Text>
        </View>
        <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
          <Folder size={24} color={TTTheme.colors.textPrimary} />
          <Text variant="mobileLabelSmall" color="foreground">Projects</Text>
        </View>
        <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
          <Hash size={24} color={TTTheme.colors.textPrimary} />
          <Text variant="mobileLabelSmall" color="foreground">My Tasks</Text>
        </View>
        <View style={{ width: 72, height: 60, alignItems: 'center', justifyContent: 'center', gap: 4 } as any}>
          <Activity size={24} color={TTTheme.colors.textPrimary} />
          <Text variant="mobileLabelSmall" color="foreground">Activity</Text>
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}


// ── Chat thread building blocks ──────────────────────────────────────────────

function ChatSecondaryHeader() {
  return (
    <View style={{ height: 51, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
      <View style={{ padding: 8 }}>
        <ArrowLeft size={24} color={TTTheme.colors.textPrimary} />
      </View>
      {/* TODO(BE): chat.project.icon */}
      <Avatar size="sm" type="text" initials="BR" color="pastelOrange" />
      <View style={{ flex: 1, marginLeft: 10 }}>
        {/* TODO(BE): chat.name + chat.memberCount */}
        <Text variant="mobileLabelSmall" color="foreground">Bathroom Reno</Text>
        <Text variant="mobileMetadataPrimary" color="grey05">3 members</Text>
      </View>
      <View style={{ padding: 8 }}>
        <MoreVertical size={20} color={TTTheme.colors.textPrimary} />
      </View>
    </View>
  );
}

function DateDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginVertical: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
      <View style={{ paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, backgroundColor: TTTheme.colors.grey01, marginHorizontal: 8 }}>
        <Text variant="mobileMetadataPrimary" color="grey05">Today</Text>
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
    </View>
  );
}

// TODO(BE): event.memberJoined — system card rendered as special message type in chat thread
function MemberJoinedCard({ onAssignTask, taskAssigned }: { onAssignTask?: () => void; taskAssigned?: boolean }) {
  return (
    <View style={{ backgroundColor: TTTheme.colors.grey01, borderRadius: 12, padding: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        {/* TODO(BE): event.member.avatar + event.member.initials */}
        <Avatar size="sm" type="text" initials="CS" color="#6C3CE1" />
        <View style={{ flex: 1 }}>
          {/* TODO(BE): event.member.name + event.project.name */}
          <Text variant="mobileLabelSmall" color="foreground">Carlos Smith joined</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">Bathroom Reno project</Text>
        </View>
      </View>

      {taskAssigned ? (
        <View style={{ backgroundColor: '#fff', borderRadius: 8, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* TODO(BE): assignment.task.name + assignment.assignee.name */}
          <Checkbox variant="rectangular" checked disabled />
          <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>Fix bathroom tiles · Carlos</Text>
        </View>
      ) : (
        <View style={{ backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text variant="mobileSecondaryBody" color="grey04">No task assigned yet</Text>
          <Button variant="fill" color="primary" size="sm" onPress={onAssignTask}>
            Assign a task
          </Button>
        </View>
      )}
    </View>
  );
}

function ChatMessage({ onAssignTask, taskAssigned }: { onAssignTask?: () => void; taskAssigned?: boolean }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      {/* TODO(BE): message.sender.avatar */}
      <Avatar size="sm" type="photo" src={require('@/assets/images/mj.png')} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          {/* TODO(BE): message.sender.name + message.createdAt */}
          <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">10:32 AM</Text>
        </View>
        <MemberJoinedCard onAssignTask={onAssignTask} taskAssigned={taskAssigned} />
      </View>
    </View>
  );
}

function TextInputBar() {
  return (
    <View style={{ borderTopWidth: 1, borderTopColor: TTTheme.colors.border, paddingHorizontal: 12, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff' }}>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: TTTheme.colors.grey01, alignItems: 'center', justifyContent: 'center' }}>
        <Plus size={18} color={TTTheme.colors.grey04} />
      </View>
      <View style={{ flex: 1, backgroundColor: TTTheme.colors.grey01, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 }}>
        <Text variant="mobileBody" color="grey04">Type a message...</Text>
      </View>
      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: TTTheme.colors.grey01, alignItems: 'center', justifyContent: 'center' }}>
        <Send size={18} color={TTTheme.colors.grey04} />
      </View>
    </View>
  );
}

// Reused across Screens 2–6: status bar + secondary header + message pushed to bottom + text input
function ChatThreadLayout({ onAssignTask, taskAssigned }: { onAssignTask?: () => void; taskAssigned?: boolean }) {
  return (
    <>
      <StatusBarRow />
      <ChatSecondaryHeader />
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        <DateDivider />
        <ChatMessage onAssignTask={onAssignTask} taskAssigned={taskAssigned} />
      </View>
      <TextInputBar />
    </>
  );
}


// ── Screen 1: Chat Home + sliding "Carlos joined" notification ───────────────

function Screen1({ onTapNotification }: { onTapNotification: () => void }) {
  const alertAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(alertAnim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }, 800);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const alertTranslateY = alertAnim.interpolate({ inputRange: [0, 1], outputRange: [120, 0] });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <ChatsScreen />
      <BottomNav />

      {/* TODO(BE): notifications.memberJoined — real-time push via WebSocket */}
      <Animated.View
        style={{
          position: 'absolute', bottom: 105, left: 16, right: 16,
          opacity: alertAnim,
          transform: [{ translateY: alertTranslateY }],
          zIndex: 50,
        } as any}
      >
        <Pressable onPress={onTapNotification}>
          <View style={{
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: TTTheme.colors.border,
            ...Platform.select({
              web: { boxShadow: '0px 8px 24px rgba(0,0,0,0.12)' } as any,
              default: { elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
            }),
          } as any}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              {/* Notification icon — not a person avatar, so kept as custom rounded square */}
              <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={16} color="#fff" />
              </View>
              {/* TODO(BE): notification.title */}
              <Text variant="mobileLabelSmall" color="foreground" style={{ flex: 1 }}>New Member</Text>
              <X size={16} color={TTTheme.colors.grey04} />
            </View>
            {/* TODO(BE): notification.body — event.member.name + event.project.name */}
            <Text variant="mobileSecondaryBody" color="grey05" style={{ marginLeft: 42 }}>
              Carlos Smith just joined Bathroom Reno project
            </Text>
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}


// ── Screen 2: Chat thread — auto-advances after 2 seconds ────────────────────

function Screen2({ onAutoAdvance }: { onAutoAdvance: () => void }) {
  useEffect(() => {
    const t = setTimeout(onAutoAdvance, 2000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout />
    </View>
  );
}


// ── Screen 3: Chat thread + "Put someone on it" tooltip ──────────────────────

function Screen3({ onTapTooltip }: { onTapTooltip: () => void }) {
  const tooltipAnim = useTooltipAnim();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout onAssignTask={onTapTooltip} />

      {/* Tooltip floats above the "Assign a task" button; arrow points down */}
      <OnboardingTooltip
        title="Put someone on it"
        description="Tap the assign button to assign tasks to your project members."
        style={{ bottom: 105, left: 46, zIndex: 61 }}
        arrowEdge="bottom"
        arrowSide="left"
        arrowInset={60}
        anim={tooltipAnim}
      />

      {/* Tap target covers the tooltip */}
      <Pressable
        onPress={onTapTooltip}
        style={{ position: 'absolute', bottom: 105, left: 46, width: 313, height: 91, zIndex: 70 } as any}
      />
    </View>
  );
}


// ── Task picker bottom sheet — used by Screens 4 (select task) and 5 (confirm) ──

function TaskPickerSheet({
  taskSelected,
  onSelectTask,
  onConfirm,
}: {
  taskSelected: boolean;
  onSelectTask: () => void;
  onConfirm: () => void;
}) {
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const tooltipAnim = useTooltipAnim(400);

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });

  return (
    <>
      {/* Dark overlay */}
      <Animated.View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any}
      />

      {/* Bottom sheet */}
      <Animated.View
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20, borderTopRightRadius: 20,
          paddingBottom: 32,
          zIndex: 51,
          transform: [{ translateY: sheetTranslateY }],
        } as any}
      >
        {/* Pull handle */}
        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
          <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey03, borderRadius: 2 }} />
        </View>

        {!taskSelected ? (
          // ── Before task is selected: search + suggested task list ──────────
          <>
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: TTTheme.colors.grey01, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 } as any}>
                <Search size={16} color={TTTheme.colors.grey04} />
                <Text variant="mobileBody" color="grey04">Search tasks...</Text>
              </View>
              <Text variant="mobileLabelSmall" color="foreground">Cancel</Text>
            </View>

            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
              <Text variant="mobileMetadataSecondary" color="grey04" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Suggested</Text>
            </View>

            {/* TODO(BE): GET /api/tasks/suggested?context=memberJoined&memberId= — unassigned project tasks */}
            {/* Project group header */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar size="sm" type="text" initials="B" color="pastelOrange" />
              <Text variant="mobileLabelSmall" color="foreground">Bathroom Reno</Text>
            </View>

            {/* Task row — tap to select */}
            <Pressable
              onPress={onSelectTask}
              style={{ paddingHorizontal: 16, paddingLeft: 58, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: TTTheme.colors.border }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Checkbox variant="rectangular" checked={false} />
                {/* TODO(BE): task.name */}
                <Text variant="mobileLabelSmall" color="foreground">Fix bathroom tiles</Text>
              </View>
              {/* Unassigned avatar placeholder */}
              <Avatar size="xs" type="text" initials="" color="grey02" />
            </Pressable>
          </>
        ) : (
          // ── After task is selected: Carlos auto-selected as assignee ───────
          <>
            {/* Selected task header */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Checkbox variant="rectangular" checked disabled />
                {/* TODO(BE): selectedTask.name */}
                <Text variant="mobileLabelSmall" color="foreground">Fix bathroom tiles</Text>
              </View>
              <Text variant="mobileLabelSmall" color="foreground">Done</Text>
            </View>

            {/* Assignee section — Carlos is pre-selected because he just joined */}
            <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 } as any}>
              <Text variant="mobileLabelSmall" color="foreground">Assignee (1)</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <View style={{ alignItems: 'center', gap: 4 } as any}>
                  <View>
                    {/* TODO(BE): assignee.avatar + assignee.initials */}
                    <Avatar size="lg" type="text" initials="CS" color="#6C3CE1" />
                    <View style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' }}>
                      <X size={10} color={TTTheme.colors.textPrimary} />
                    </View>
                  </View>
                  <Text variant="mobileMetadataPrimary" color="grey05">Carlos</Text>
                </View>
              </View>
            </View>

            {/* Other project members */}
            <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
              <Text variant="mobileLabelSmall" color="foreground">Project Members (2)</Text>
              <Text variant="mobileSecondaryBody" color="grey05" style={{ marginTop: 4 }}>Select to add as assignee</Text>
            </View>

            {/* TODO(BE): GET /api/projects/:id/members — project member list */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar size="md" type="text" initials="AB" color="#F97316" />
              <View style={{ flex: 1 }}>
                <Text variant="mobileLabelSmall" color="foreground">Abby Brown</Text>
                <Text variant="mobileMetadataPrimary" color="grey05">Editor</Text>
              </View>
              <Checkbox variant="circular" checked={false} />
            </View>

            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {/* TODO(BE): member.avatar */}
              <Avatar size="md" type="photo" src={require('@/assets/images/mj.png')} />
              <View style={{ flex: 1 }}>
                <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
                <Text variant="mobileMetadataPrimary" color="grey05">Owner</Text>
              </View>
              <Checkbox variant="circular" checked={false} />
            </View>

            {/* Confirm button */}
            <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
              <Button variant="fill" color="primary" size="lg" onPress={onConfirm}>
                Confirm
              </Button>
            </View>
          </>
        )}
      </Animated.View>

      {/* Tooltip "Tasks start with #" — points up at the task list, visible before task is selected */}
      {!taskSelected && (
        <OnboardingTooltip
          title="Tasks start with #"
          description="Tap a task to select and assign it to this crew member."
          style={{ left: 20, top: 296, zIndex: 62 }}
          arrowEdge="top"
          arrowSide="left"
          arrowInset={20}
          anim={tooltipAnim}
        />
      )}
    </>
  );
}


// ── Screen 4: Chat + task picker sheet (task not yet selected) ───────────────

function Screen4({ onSelectTask }: { onSelectTask: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout />
      <TaskPickerSheet taskSelected={false} onSelectTask={onSelectTask} onConfirm={() => {}} />
    </View>
  );
}


// ── Screen 5: Task picker sheet — Carlos auto-selected as assignee ────────────

function Screen5({ onConfirm }: { onConfirm: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout />
      <TaskPickerSheet taskSelected onSelectTask={() => {}} onConfirm={onConfirm} />
    </View>
  );
}


// ── Screen 6: Chat thread — task assigned to Carlos ──────────────────────────

function Screen6() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout taskAssigned />
    </View>
  );
}


// ── Main Case5Screen ─────────────────────────────────────────────────────────

export function Case5Screen({ onComplete }: { onComplete?: () => void } = {}) {
  const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  useEffect(() => {
    if (screen !== 6 || !onComplete) return;

    const t = setTimeout(onComplete, 1200);
    return () => clearTimeout(t);
  }, [onComplete, screen]);

  return (
    <Box flex={1} backgroundColor="white">
      {screen === 1 && <Screen1 onTapNotification={() => setScreen(2)} />}
      {screen === 2 && <Screen2 onAutoAdvance={() => setScreen(3)} />}
      {screen === 3 && <Screen3 onTapTooltip={() => setScreen(4)} />}
      {screen === 4 && <Screen4 onSelectTask={() => setScreen(5)} />}
      {screen === 5 && <Screen5 onConfirm={() => setScreen(6)} />}
      {screen === 6 && <Screen6 />}
    </Box>
  );
}
