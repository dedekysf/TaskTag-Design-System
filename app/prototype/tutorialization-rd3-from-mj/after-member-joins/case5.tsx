import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { ChatsScreen } from '../../_shared/mobile/ChatsScreen';
import { OnboardingTooltip, useTooltipAnim } from '../../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, View } from 'react-native';
import { Activity, Check, ChevronLeft, Folder, HardHat, Hash, MessageSquare, Mic, Plus, Search, Smile, X } from 'lucide-react-native';
import { MemberEventCard } from './MemberEventCard';


// ── Shared sub-components ────────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9, backgroundColor: '#fff' }}>
      <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.grey06, borderRadius: 5 }} />
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

function ChatDMHeader() {
  return (
    <View style={{
      height: 51, backgroundColor: '#fff',
      borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border,
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      paddingLeft: 8, paddingRight: 16,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={TTTheme.colors.textPrimary} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
          {/* TODO(BE): chat.contact.avatar + initials */}
          <Avatar size="sm" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
          <View style={{ gap: 1 } as any}>
            {/* TODO(BE): chat.contact.name */}
            <Text variant="mobileLabelEmphasized" color="foreground">Carlos Smith</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">tap here to chat info</Text>
          </View>
        </View>
      </View>
      <Search size={24} color={TTTheme.colors.textPrimary} />
    </View>
  );
}

function DateDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginVertical: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
      {/* TODO(BE): message.createdAt formatted as day + date */}
      <Text variant="mobileMetadataPrimary" color="grey05" style={{ marginHorizontal: 12 }}>Friday, May 22</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
    </View>
  );
}

function ChatMessage({ onAssignTask, taskAssigned }: { onAssignTask?: () => void; taskAssigned?: boolean }) {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
      {/* TODO(BE): event.member.avatar + initials */}
      <Avatar size="sm" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
          {/* TODO(BE): event.member.name + event.createdAt */}
          <Text variant="mobileLabelEmphasized" color="foreground">Carlos Smith</Text>
          <Text variant="mobileMetadataSecondary" color="grey05">12:25 PM</Text>
        </View>
        {/* TODO(BE): event.type — 'memberJoined' | 'taskAssigned' */}
        <MemberEventCard
          variant={taskAssigned ? 'taskAssigned' : 'memberJoined'}
          memberName="Carlos Smith"
          projectName="1520 Oliver Street"
          taskName="Fix bathroom tiles"
          onPrimaryPress={onAssignTask}
        />
      </View>
    </View>
  );
}

function TextInputBar() {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 6 }}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Type message here...</Text>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Smile size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Mic size={20} color={TTTheme.colors.textPrimary} />
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}

// Reused across Screens 2–6: status bar + secondary header + message pushed to bottom + text input
function ChatThreadLayout({ onAssignTask, taskAssigned }: { onAssignTask?: () => void; taskAssigned?: boolean }) {
  return (
    <>
      <StatusBarRow />
      <ChatDMHeader />
      <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 8 }}>
        <DateDivider />
        <ChatMessage onAssignTask={onAssignTask} taskAssigned={taskAssigned} />
      </View>
      <TextInputBar />
    </>
  );
}


// ── Screen 1: Chat Home ──────────────────────────────────────────────────────

function Screen1({ onTapNotification }: { onTapNotification: () => void }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBarRow />
      <ChatsScreen showCarlosNotification onCarlosPress={onTapNotification} />
      <BottomNav />
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
  const tooltipAnim = useTooltipAnim(0);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <ChatThreadLayout onAssignTask={onTapTooltip} />

      {/* Tooltip: right edge aligned with MemberJoinedCard right (339px); arrow centered on button.
          frame-inner=355, card-right=355-16=339, tooltip-left=339-312=27
          button-center=(72+327)/2=200, arrowInset=200-27-12=161
          arrow geometric tip extension ≈17px (half-diagonal of 24×24 rotated 45°)
          TextInputBar paddingBottom=16 (+8 from 8) + chat gap=16 → button-top≈155, gap 8 → tip=163, bottom=163+17=180 */}
      <OnboardingTooltip
        title="Put someone on it"
        description="Tap the assign button to assign tasks to your project members."
        style={{ bottom: 180, right: 16, zIndex: 61 }}
        arrowEdge="bottom"
        arrowSide="left"
        arrowInset={155}
        anim={tooltipAnim}
      />

      {/* Tap target covers full tooltip card + arrow */}
      <Pressable
        onPress={onTapTooltip}
        style={{ position: 'absolute', bottom: 168, right: 16, width: 312, height: 150, zIndex: 70 } as any}
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

      {/* Bottom sheet — leaves status bar (44px) visible when task not yet selected */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 44,
          bottom: 0, left: 0, right: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingBottom: 0,
          flex: 1,
          zIndex: 51,
          transform: [{ translateY: sheetTranslateY }],
        } as any}
      >
        {/* Pull handle */}
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ width: 56, height: 4, backgroundColor: TTTheme.colors.grey04, borderRadius: 2.5 }} />
        </View>

        {!taskSelected ? (
          // ── Before task is selected: full-screen task search ──────────────
          <>
            {/* Search bar — unfocused state */}
            <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8, backgroundColor: TTTheme.colors.grey01 } as any}>
                <Search size={18} color={TTTheme.colors.grey05} />
                {/* TODO(BE): search.projectContext — current project name as filter */}
                <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>1520 Oliver Street</Text>
                <X size={16} color={TTTheme.colors.grey04} />
              </View>
              <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>Cancel</Text>
            </View>

            {/* Section header */}
            <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
              <Text variant="mobileSecondaryBody" color="grey05">All Projects & Tasks</Text>
            </View>

            {/* TODO(BE): GET /api/tasks?projectId=&context=memberJoined — tasks within the project */}
            {/* Project row — icon matches case4 TaskCreationSheet footer */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              {/* TODO(BE): project.color + project.icon */}
              <View style={{ width: 32, height: 32, backgroundColor: '#7B61FF', borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                <HardHat size={18} color="#fff" />
              </View>
              {/* TODO(BE): project.name */}
              <Text variant="mobileLabelEmphasized" color="foreground">1520 Oliver Street</Text>
            </View>

            {/* Task row — # left-aligned with project icon at paddingLeft: 16 */}
            <Pressable
              onPress={onSelectTask}
              style={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
                {/* wrapper transparan supaya sejajar dengan project icon di atasnya */}
                <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                  <Hash size={18} color={TTTheme.colors.secondaryGreen} />
                </View>
                {/* TODO(BE): task.name */}
                <Text variant="mobileLabelSmall" color="foreground">Fix kitchen sink</Text>
              </View>
              {/* TODO(BE): task.assignees[0] — currently assigned member */}
              <Avatar size="xs" type="photo" src={require('@/assets/images/mj.png')} />
            </Pressable>

            {/* New Task FAB — same position & style as "New Update" in ProjectDetailScreen */}
            <View style={{ position: 'absolute', bottom: 40, right: 17 } as any}>
              <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 }}>
                <Plus size={22} color="#fff" />
                <Text variant="mobileBody" color="white">New Task</Text>
              </View>
            </View>

            {/* Home bar */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 } as any}>
              <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.grey06, borderRadius: 5 }} />
            </View>
          </>
        ) : (
          // ── After task is selected: member picker to confirm assignee ───────
          <View style={{ flex: 1 }}>
            {/* Scrollable content */}
            <View style={{ flex: 1 }}>
              {/* Search bar */}
              <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8, backgroundColor: TTTheme.colors.grey01 } as any}>
                  <Search size={18} color={TTTheme.colors.grey05} />
                  <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Search</Text>
                </View>
                <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>Cancel</Text>
              </View>

              {/* Selected Member section */}
              <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 } as any}>
                  <Text variant="mobileLabelEmphasized" color="foreground">Selected Member</Text>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                    <Text variant="mobileMetadataSecondary" color="grey05">1</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ alignItems: 'center', gap: 4 } as any}>
                    <Avatar size="lg" type="photo" src={require('@/assets/images/mj.png')} />
                    <Text variant="mobileMetadataPrimary" color="grey05">Maria Jose</Text>
                  </View>
                  <View style={{ alignItems: 'center', gap: 4 } as any}>
                    <View>
                      <Avatar size="lg" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
                      <View style={{ position: 'absolute', top: -2, right: -2, width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey03, alignItems: 'center', justifyContent: 'center' }}>
                        <X size={10} color={TTTheme.colors.textPrimary} />
                      </View>
                    </View>
                    <Text variant="mobileMetadataPrimary" color="grey05">Carlos S...</Text>
                  </View>
                </View>
              </View>

              {/* Chat Members section */}
              <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 } as any}>
                  <Text variant="mobileLabelEmphasized" color="foreground">Chat Members</Text>
                  <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                    <Text variant="mobileMetadataSecondary" color="grey05">2</Text>
                  </View>
                </View>
                <Text variant="mobileSecondaryBody" color="grey05">Choose the member first</Text>
              </View>

              {/* TODO(BE): GET /api/chats/:id/members — chat member list */}
              {/* Maria Jose row — checked disabled: grey05 bg, white icon */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar size="md" type="photo" src={require('@/assets/images/mj.png')} />
                <View style={{ flex: 1, gap: 2 } as any}>
                  <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
                  <Text variant="mobileMetadataPrimary" color="grey05">mariajose@gmail.com</Text>
                </View>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: TTTheme.colors.grey05, alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={16} color="#fff" strokeWidth={3} />
                </View>
              </View>

              {/* Carlos Smith row — pre-selected */}
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Avatar size="md" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
                <View style={{ flex: 1, gap: 2 } as any}>
                  <Text variant="mobileLabelSmall" color="foreground">Carlos Smith</Text>
                  <Text variant="mobileMetadataPrimary" color="grey05">Carlossmith@gmail.com</Text>
                </View>
                <Checkbox variant="circular" checked />
              </View>
            </View>

            {/* Confirm button — fixed at bottom */}
            <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}>
              <Button variant="fill" color="secondary" size="lg" onPress={onConfirm}>
                Confirm
              </Button>
            </View>
          </View>
        )}
      </Animated.View>

      {/* Tooltip: arrow tip 2px below "Fix kitchen sink" text, arrow center under "Fix" */}
      {!taskSelected && (
        <OnboardingTooltip
          title="Tasks start with #"
          description="Tap a task to assign it to your crew"
          style={{ left: 20, top: 280, zIndex: 62 }}
          arrowEdge="top"
          arrowSide="left"
          arrowInset={35}
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
