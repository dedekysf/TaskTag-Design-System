import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../../_shared/mobile/MockKeyboard';
import { OnboardingTooltip, useTooltipAnim } from '../../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, TextInput, View } from 'react-native';
import {
  Camera,
  Check,
  ChevronLeft,
  ClipboardList,
  Hash,
  Image as ImageIcon,
  MapPin,
  Mic,
  Plus,
  Search,
  Send,
  User,
  X,
} from 'lucide-react-native';
import { MemberEventCard } from './MemberEventCard';

// Phase progression: coach → picker → compose → success → nudge → nudgeTyping → nudgeSent
type Phase = 'coach' | 'picker' | 'compose' | 'success' | 'carlosReply' | 'nudge' | 'nudgeTyping' | 'nudgeSent';

type TaggableTask = {
  id: string;
  title: string;
  meta: string;
};

interface Case8ScreenProps {
  onComplete?: () => void;
}

// TODO(BE): GET /api/nudge-templates/:nudgeId/message - replace with API-driven text.
const NUDGE_PHOTO_MESSAGE = "Can you send a site photo? It'll be saved to the job automatically.";

// TODO(BE): GET /api/chats/:chatId - replace this static context.
const CHAT_CONTEXT = {
  projectName: 'Bathroom Reno',
  memberName: 'Carlos Smith',
  memberInitials: 'CS',
  currentUserName: 'You',
  currentUserInitials: 'MJ',
  memberJoinedAt: '10:32 AM',
  sentAt: '10:34 AM',
  responseAt: '10:35 AM',
};

// TODO(BE): GET /api/projects/:projectId/tasks?taggable=true - replace suggestions.
const TAGGABLE_TASKS: TaggableTask[] = [
  { id: 'task_fix_tiles', title: 'Fix bathroom tiles', meta: 'Unassigned' },
  { id: 'task_order_grout', title: 'Order grout and sealant', meta: 'Due Friday' },
  { id: 'task_upload_photos', title: 'Upload before photos', meta: 'Needs update' },
];

function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View
        style={{
          width: 134,
          height: 5,
          borderRadius: 5,
          backgroundColor: light ? 'rgba(255,255,255,0.5)' : TTTheme.colors.textPrimary,
        }}
      />
    </View>
  );
}

function ChatHeader() {
  return (
    <View
      style={{
        height: 51,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: TTTheme.colors.border,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={TTTheme.colors.textPrimary} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 } as any}>
          {/* TODO(BE): chat.member.avatar / chat.member.initials */}
          <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color="#6C3CE1" />
          <View style={{ gap: 1 } as any}>
            {/* TODO(BE): chat.member.name */}
            <Text variant="mobileLabelEmphasized" color="foreground">{CHAT_CONTEXT.memberName}</Text>
            <Text variant="mobileMetadataPrimary" color="grey04">tap here to chat info</Text>
          </View>
        </View>
      </View>
      <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Search size={24} color={TTTheme.colors.textPrimary} />
      </View>
    </View>
  );
}

function DateSeparator({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
      <Text variant="mobileMetadataPrimary" color="grey04" style={{ marginHorizontal: 12 }}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
    </View>
  );
}

function TagChip({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: 'task' | 'member';
  onPress?: () => void;
}) {
  const Icon = icon === 'task' ? ClipboardList : User;

  const chip = (
    <View
      style={{
        minHeight: 24,
        borderRadius: 100,
        backgroundColor: TTTheme.colors.lightMint,
        paddingHorizontal: 8,
        paddingVertical: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      } as any}
    >
      <Icon size={14} color={TTTheme.colors.secondaryGreen} />
      <Text variant="mobileMetadataPrimary" color="secondaryGreen">{label}</Text>
    </View>
  );

  if (onPress) return <Pressable onPress={onPress}>{chip}</Pressable>;
  return chip;
}

function TagDivider() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 14 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
      <View style={{ marginHorizontal: 8 }}>
        <TagChip label="Tagged task" icon="task" />
      </View>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
    </View>
  );
}

function MemberJoinedCard({
  task,
  onOpenPicker,
}: {
  task?: TaggableTask;
  onOpenPicker?: () => void;
}) {
  if (!task) {
    return (
      <MemberEventCard
        variant="memberJoined"
        memberName={CHAT_CONTEXT.memberName}
        projectName={CHAT_CONTEXT.projectName}
        primaryLabel="Tag a task"
        onPrimaryPress={onOpenPicker}
      />
    );
  }

  return (
    <MemberEventCard
      variant="taskAssigned"
      memberName={CHAT_CONTEXT.memberName}
      taskName={task.title}
      secondaryLabel="Tag another"
      onSecondaryPress={onOpenPicker}
    />
  );
}

function MemberJoinedMessage({
  task,
  onOpenPicker,
}: {
  task?: TaggableTask;
  onOpenPicker?: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): current user avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.currentUserInitials} color="darkMagenta" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">Maria Jose</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.memberJoinedAt}</Text>
        </View>
        <MemberJoinedCard task={task} onOpenPicker={onOpenPicker} />
      </View>
    </View>
  );
}

function MyTaggedMessage({
  task,
  text,
  showSuccess,
  onChipPress,
}: {
  task: TaggableTask;
  text: string;
  showSuccess: boolean;
  onChipPress?: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): current user avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.currentUserInitials} color="darkMagenta" />
      <View style={{ flex: 1, gap: 8 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelEmphasized" style={{ color: TTTheme.colors.darkMagenta }}>
            {CHAT_CONTEXT.currentUserName}
          </Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.sentAt}</Text>
          <Check size={12} color={TTTheme.colors.grey05} />
        </View>

        {/* TODO(BE): message.text */}
        <Text variant="mobileBody" color="textSecondary">
          {text || 'Can you check this after lunch?'}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 } as any}>
          {/* TODO(BE): message.tags */}
          <TagChip label={`# ${task.title}`} icon="task" onPress={onChipPress} />
          <TagChip label={`@ ${CHAT_CONTEXT.memberName}`} icon="member" onPress={onChipPress} />
        </View>

        {showSuccess && (
          <Text variant="mobileLabelSmall" color="foreground">
            First tag complete! {'\u{1F389}'}
          </Text>
        )}
      </View>
    </View>
  );
}

function CarlosResponse() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): message.sender.avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color="#6C3CE1" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.memberName}</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.responseAt}</Text>
        </View>
        {/* TODO(BE): message.text */}
        <Text variant="mobileBody" color="textSecondary">Sounds good, I will take a look after lunch.</Text>
      </View>
    </View>
  );
}

// ── "Get a site photo" nudge card (appears after first tag + Carlos responds) ──
function NudgeCard({ onSend }: { onSend: () => void }) {
  return (
    <View style={{ backgroundColor: TTTheme.colors.textPrimary, borderRadius: 12, padding: 14, marginHorizontal: 16, marginTop: 10 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 } as any}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Camera size={18} color="#fff" />
        </View>
        <Text variant="mobileLabelEmphasized" style={{ color: '#fff' }}>Get a site photo</Text>
      </View>
      {/* TODO(BE): nudge.description - replace with API-driven copy */}
      <Text variant="mobileSecondaryBody" style={{ color: 'rgba(255,255,255,0.72)', marginBottom: 14 }}>
        Ask your crew to send one — it'll be saved to this job automatically
      </Text>
      <Button variant="fill" color="secondary" size="sm" onPress={onSend} style={{ alignSelf: 'stretch' }}>
        Send
      </Button>
    </View>
  );
}

// ── Photo request message shown after user sends the nudge ──
function NudgeSentMessage() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): current user avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.currentUserInitials} color="darkMagenta" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelEmphasized" style={{ color: TTTheme.colors.darkMagenta }}>
            {CHAT_CONTEXT.currentUserName}
          </Text>
          <Text variant="mobileMetadataPrimary" color="grey05">12:50 PM</Text>
          <Check size={12} color={TTTheme.colors.grey05} />
        </View>
        {/* TODO(BE): message.text — driven by nudge template */}
        <Text variant="mobileBody" color="textSecondary">{NUDGE_PHOTO_MESSAGE}</Text>
      </View>
    </View>
  );
}

// ── Input bar with pre-filled nudge text (phase: nudgeTyping) ──
function NudgeInputBar({ onSend }: { onSend: () => void }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 291,
        left: 0,
        right: 0,
        zIndex: 41,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: TTTheme.colors.border,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
      } as any}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 8, gap: 6 } as any}>
        {[Plus, Hash, Camera, ImageIcon, MapPin, Mic].map((Icon, i) => (
          <View key={i} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={19} color={TTTheme.colors.textPrimary} />
          </View>
        ))}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10, gap: 8 } as any}>
        {/* TODO(BE): message.text — pre-filled from nudge template */}
        <Text variant="mobileBody" color="textSecondary" style={{ flex: 1 }}>
          {NUDGE_PHOTO_MESSAGE}
        </Text>
        <Pressable onPress={onSend}>
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={18} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

function ChatThread({
  phase,
  task,
  messageText,
  onOpenPicker,
  onNudgeSend,
  onChipPress,
}: {
  phase: Phase;
  task?: TaggableTask;
  messageText: string;
  onOpenPicker: () => void;
  onNudgeSend: () => void;
  onChipPress?: () => void;
}) {
  const showTaggedMessage = phase === 'success' || phase === 'carlosReply' || phase === 'nudge' || phase === 'nudgeTyping' || phase === 'nudgeSent';
  const showCarlosResponse = phase === 'carlosReply' || phase === 'nudge' || phase === 'nudgeTyping' || phase === 'nudgeSent';
  const CHAT_INPUT_GAP = 8;
  const KEYBOARD_HEIGHT = 291;
  const COMPOSER_PANEL_HEIGHT = 128;
  const NUDGE_INPUT_BAR_HEIGHT = 102;
  const paddingBottom = phase === 'compose'
    ? KEYBOARD_HEIGHT + COMPOSER_PANEL_HEIGHT + CHAT_INPUT_GAP
    : phase === 'nudgeTyping'
      ? KEYBOARD_HEIGHT + NUDGE_INPUT_BAR_HEIGHT + CHAT_INPUT_GAP
      : CHAT_INPUT_GAP;

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom }}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
    >
      <DateSeparator label="Today" />
      {(showTaggedMessage || phase === 'compose') && <TagDivider />}
      <MemberJoinedMessage task={showTaggedMessage ? task : undefined} onOpenPicker={onOpenPicker} />
      {showTaggedMessage && task && (
        <MyTaggedMessage task={task} text={messageText} showSuccess={phase === 'success'} onChipPress={onChipPress} />
      )}
      {showCarlosResponse && <CarlosResponse />}
      {phase === 'nudge' && <NudgeCard onSend={onNudgeSend} />}
      {phase === 'nudgeSent' && <NudgeSentMessage />}
    </ScrollView>
  );
}

function MinimalInputBar({ onOpenPicker }: { onOpenPicker: () => void }) {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 6 } as any}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Pressable onPress={onOpenPicker} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' } as any}>
          <Hash size={20} color={TTTheme.colors.textPrimary} />
        </Pressable>
        <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Type message here...</Text>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} color={TTTheme.colors.grey04} />
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}

function TaskPickerSheet({
  onSelectTask,
  onCancel,
}: {
  onSelectTask: (task: TaggableTask) => void;
  onCancel: () => void;
}) {
  const sheetAnim = useRef(new Animated.Value(0)).current;
  const tooltipAnim = useTooltipAnim(400);
  const translateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [420, 0] });

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any} />

      <Animated.View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: 32,
          zIndex: 51,
          transform: [{ translateY }],
        } as any}
      >
        <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 }} />

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 } as any}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: TTTheme.colors.grey01, borderRadius: 12, paddingHorizontal: 12, height: 40 } as any}>
            <Search size={16} color={TTTheme.colors.grey04} />
            <Text variant="mobileBody" color="grey04">Search tasks...</Text>
          </View>
          <Pressable onPress={onCancel}>
            <Text variant="mobileLabelSmall" color="foreground">Cancel</Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
          <Text variant="mobileMetadataSecondary" color="grey04" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Suggested
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
          {/* TODO(BE): project.avatar / project.name */}
          <Avatar size="sm" type="text" initials="B" color="pastelOrange" />
          <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.projectName}</Text>
        </View>

        {TAGGABLE_TASKS.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onSelectTask(task)}
            style={{ paddingLeft: 58, paddingRight: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: TTTheme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}
          >
            <Checkbox variant="rectangular" checked={false} disabled />
            <View style={{ flex: 1 }}>
              {/* TODO(BE): task.name / task.status */}
              <Text variant="mobileLabelSmall" color="foreground">{task.title}</Text>
              <Text variant="mobileMetadataPrimary" color="grey05">{task.meta}</Text>
            </View>
            <Avatar size="xs" type="text" initials={CHAT_CONTEXT.memberInitials} color="#6C3CE1" />
          </Pressable>
        ))}
      </Animated.View>

      <OnboardingTooltip
        title="Tasks start with #"
        description="Tap a task to select and attach it to this chat."
        step="Step 2/4"
        style={{ left: 20, top: 296, zIndex: 62 }}
        arrowEdge="top"
        arrowSide="left"
        arrowInset={20}
        anim={tooltipAnim}
      />
    </>
  );
}

function ComposerPanel({
  task,
  messageText,
  inputRef,
  onChangeText,
  onPhysicalKeyPress,
  onSend,
}: {
  task: TaggableTask;
  messageText: string;
  inputRef: React.RefObject<any>;
  onChangeText: (text: string) => void;
  onPhysicalKeyPress: (key: string) => void;
  onSend: () => void;
}) {
  const sendActive = messageText.trim().length > 0;

  return (
    <View style={{ position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 } as any}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 6 } as any}>
          <TagChip label={`# ${task.title}`} icon="task" />
          <TagChip label={`@ ${CHAT_CONTEXT.memberName}`} icon="member" />
        </View>

        <TextInput
          ref={inputRef}
          value={messageText}
          onChangeText={onChangeText}
          onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
          placeholder="Type message here..."
          placeholderTextColor={TTTheme.colors.grey05}
          multiline
          style={{ fontSize: 16, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none', minHeight: 34 } as any}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
          <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color={TTTheme.colors.textPrimary} />
          </View>
          {[Hash, Camera, ImageIcon, MapPin, Mic].map((Icon, index) => (
            <View key={index} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={TTTheme.colors.textPrimary} />
            </View>
          ))}
        </View>

        <Pressable onPress={sendActive ? onSend : undefined}>
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: sendActive ? '#000' : TTTheme.colors.grey05, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export function Case8Screen({ onComplete }: Case8ScreenProps = {}) {
  const [phase, setPhase] = useState<Phase>('coach');
  const [selectedTask, setSelectedTask] = useState<TaggableTask | null>(null);
  const [messageText, setMessageText] = useState('');
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const inputRef = useRef<any>(null);
  const messageTextRef = useRef('');
  const keyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composeTooltipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeSentTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const composeTooltipAnim = useRef(new Animated.Value(0)).current;
  const chipTooltipAnim    = useRef(new Animated.Value(0)).current;
  const [showChipTooltip, setShowChipTooltip] = useState(false);

  const taskForThread = selectedTask ?? TAGGABLE_TASKS[0];

  useEffect(() => {
    return () => {
      if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
      if (composeTooltipTimerRef.current) clearTimeout(composeTooltipTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
      if (nudgeSentTimerRef.current) clearTimeout(nudgeSentTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'compose') return;

    composeTooltipAnim.setValue(0);
    Animated.timing(composeTooltipAnim, {
      toValue: 1,
      duration: 350,
      delay: 250,
      useNativeDriver: true,
    }).start();

    const focusTimer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(focusTimer);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const coachTooltipAnim = useTooltipAnim(250);

  const openPicker = () => {
    setPhase('picker');
  };

  const closePicker = () => {
    setPhase('coach');
  };

  const handleSelectTask = (task: TaggableTask) => {
    setSelectedTask(task);
    setPhase('compose');
    setMessageText('');
    messageTextRef.current = '';
  };

  const handleChangeText = (text: string) => {
    messageTextRef.current = text;
    setMessageText(text);
  };

  const flashKey = (keyId: string) => {
    if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
    setPressedKey(keyId);
    keyTimerRef.current = setTimeout(() => setPressedKey(null), 150);
  };

  const handlePhysicalKeyPress = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) flashKey(key.toUpperCase());
    else if (key === ' ') flashKey('SPACE');
    else if (key === 'Backspace') flashKey('BACKSPACE');
  };

  const handleKeyTap = (keyId: string) => {
    flashKey(keyId);
    const current = messageTextRef.current;
    const refocus = () => setTimeout(() => inputRef.current?.focus(), 0);

    if (keyId === 'BACKSPACE') {
      handleChangeText(current.slice(0, -1));
      refocus();
    } else if (keyId === 'SPACE') {
      handleChangeText(`${current} `);
      refocus();
    } else if (keyId === 'DONE') {
      handleSend();
    } else if (/^[A-Z]$/.test(keyId)) {
      handleChangeText(current + keyId.toLowerCase());
      refocus();
    }
  };

  // TODO(BE): POST /api/chats/:chatId/messages - include text and selected tag ids.
  const handleSend = () => {
    if (!messageTextRef.current.trim() || !selectedTask) return;

    if (composeTooltipTimerRef.current) clearTimeout(composeTooltipTimerRef.current);
    setShowComposeTooltip(false);
    setPhase('success');

    // Carlos replies after 2.5s, then nudge card appears 1s later
    successTimerRef.current = setTimeout(() => {
      setPhase('carlosReply');
      successTimerRef.current = setTimeout(() => {
        setPhase('nudge');
      }, 1000);
    }, 2500);
  };

  // User taps "Send" on NudgeCard → keyboard + pre-filled text appear
  const handleNudgeSend = () => {
    setPhase('nudgeTyping');
  };

  // TODO(BE): POST /api/chats/:chatId/messages - nudge-prefilled photo request message.
  const handleNudgeMessageSend = () => {
    setPhase('nudgeSent');
  };

  const handleChipPress = () => {
    setShowChipTooltip(true);
    Animated.timing(chipTooltipAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  };

  const handleGotIt = () => {
    onComplete?.();
  };

  const showMinimalInput = phase === 'coach' || phase === 'success' || phase === 'carlosReply' || phase === 'nudge' || phase === 'nudgeSent';

  return (
    <Box flex={1} backgroundColor="white">
      <StatusBarRow />
      <ChatHeader />

      <ChatThread
        phase={phase}
        task={taskForThread}
        messageText={messageTextRef.current || messageText}
        onOpenPicker={openPicker}
        onNudgeSend={handleNudgeSend}
        onChipPress={phase === 'nudgeSent' && !showChipTooltip ? handleChipPress : undefined}
      />

      {showMinimalInput && <MinimalInputBar onOpenPicker={openPicker} />}

      {/* "Everything's connected" tooltip — appears when user taps a tag chip on nudgeSent screen */}
      {phase === 'nudgeSent' && showChipTooltip && (
        <OnboardingTooltip
          title="Everything's connected"
          description="Tapping a chip takes you straight to the project — every task, message and photo tagged to it is there waiting."
          style={{ bottom: 280, left: 16, zIndex: 62 }}
          arrowEdge="bottom"
          arrowSide="left"
          arrowInset={24}
          anim={chipTooltipAnim}
        />
      )}

      {phase === 'coach' && (
        <OnboardingTooltip
          title="Tag the right task"
          description="Tap # to attach the task this message is about."
          step="Step 1/4"
          ctaText="Choose task"
          onCtaPress={openPicker}
          style={{ bottom: 105, left: 46, zIndex: 62 }}
          arrowEdge="bottom"
          arrowSide="left"
          arrowInset={40}
          anim={coachTooltipAnim}
        />
      )}

      {phase === 'picker' && (
        <TaskPickerSheet onSelectTask={handleSelectTask} onCancel={closePicker} />
      )}

      {selectedTask && phase === 'compose' && (
        <>
          <ComposerPanel
            task={selectedTask}
            messageText={messageText}
            inputRef={inputRef}
            onChangeText={handleChangeText}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSend={handleSend}
          />
          <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
          <OnboardingTooltip
            title="Add context"
            description="Type your message after the tag. The task stays attached when you send."
            step="Step 3/4"
            style={{ bottom: 448, left: 31, zIndex: 43 }}
            arrowEdge="bottom"
            arrowSide="left"
            arrowInset={8}
            anim={composeTooltipAnim}
          />
        </>
      )}

      {phase === 'nudgeTyping' && (
        <>
          <NudgeInputBar onSend={handleNudgeMessageSend} />
          <MockKeyboard pressedKey={null} onKeyTap={() => {}} />
        </>
      )}
    </Box>
  );
}
