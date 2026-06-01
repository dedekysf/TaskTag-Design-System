import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../_shared/mobile/MockKeyboard';
import { OnboardingTooltip, useTooltipAnim } from '../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, TextInput, View } from 'react-native';
import {
  Camera,
  Check,
  ChevronLeft,
  Hash,
  Home,
  Image as ImageIcon,
  MapPin,
  Mic,
  Plus,
  Search,
  Send,
} from 'lucide-react-native';

// Phase progression: coach → picker → compose → success → done
type Phase = 'coach' | 'picker' | 'compose' | 'success' | 'done';

// TODO(BE): GET /api/chats/:chatId/context
const CHAT_CONTEXT = {
  projectName: '1520 Oliver Street',
  projectInitials: 'OS',
  memberName: 'Carlos Smith',
  memberInitials: 'CS',
  taskName: 'Fix kitchen sink',
  currentUserInitials: 'MJ',
  assignedAt: '12:25 PM',
  sentAt: '12:38 PM',
  replyAt: '12:47 PM',
};

// TODO(BE): GET /api/projects/:projectId/tasks?limit=8&sort=recent
const PICKER_TASKS = [
  { id: 'fix_sink', title: 'Fix kitchen sink',            assigneeInitials: 'CS', assigneeColor: '#E9A86D' },
  { id: 'due_date', title: 'Set a Due Date',              assigneeInitials: 'MK', assigneeColor: '#EC4899' },
  { id: 'all_done', title: 'Mark All the Tasks as Done',  assigneeInitials: 'AL', assigneeColor: '#14B8A6' },
  { id: 'archive',  title: 'Archive the Projects',        assigneeInitials: '—',  assigneeColor: '#94A3B8' },
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: '#000' }} />
    </View>
  );
}

function ChatHeader() {
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
          {/* TODO(BE): chat.contact.avatar + name */}
          <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color="#18A87D" />
          <View style={{ gap: 1 } as any}>
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

/** Project pill — light mint background with home icon */
function ProjectTagChip({ label }: { label: string }) {
  return (
    <View style={{
      minHeight: 24, borderRadius: 100,
      backgroundColor: TTTheme.colors.lightMint,
      paddingHorizontal: 8, paddingVertical: 3,
      flexDirection: 'row', alignItems: 'center', gap: 6,
    } as any}>
      <Home size={12} color={TTTheme.colors.secondaryGreen} />
      <Text variant="mobileMetadataPrimary" color="secondaryGreen">{label}</Text>
    </View>
  );
}

/** Task pill — solid green with # */
function TaskTagChip({ label }: { label: string }) {
  return (
    <View style={{
      minHeight: 24, borderRadius: 100,
      backgroundColor: TTTheme.colors.secondaryGreen,
      paddingHorizontal: 8, paddingVertical: 3,
      flexDirection: 'row', alignItems: 'center', gap: 4,
    } as any}>
      <Hash size={11} color="#fff" />
      <Text variant="mobileMetadataPrimary" style={{ color: '#fff' }}>{label}</Text>
    </View>
  );
}

// ── Message components ────────────────────────────────────────────────────────

/**
 * System card: task-assigned event — badge + description + CTAs.
 * "Assign more" button doubles as the entry point for the tagging flow.
 */
function TaskAssignedCard({ onTagPress }: { onTagPress: () => void }) {
  return (
    <View style={{ backgroundColor: TTTheme.colors.grey01, borderRadius: 12, padding: 12 }}>
      <View style={{ backgroundColor: TTTheme.colors.lightMint, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: '600', color: TTTheme.colors.secondaryGreen, letterSpacing: 0.5 }}>
          TASK ASSIGNED
        </Text>
      </View>
      {/* TODO(BE): event.member.name, event.task.name */}
      <Text variant="mobileLabelSmall" color="foreground" style={{ marginBottom: 2 }}>
        {CHAT_CONTEXT.memberName} has been assigned a task
      </Text>
      <Text variant="mobileSecondaryBody" color="grey05" style={{ marginBottom: 10 }}>
        {CHAT_CONTEXT.memberName} is now working on{' '}
        <Text variant="mobileSecondaryBody" color="secondaryGreen" style={{ fontWeight: '600' }}>
          {CHAT_CONTEXT.taskName}
        </Text>
      </Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {/* TODO(BE): navigate to /tasks/:id */}
        <Pressable style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1.5, borderColor: TTTheme.colors.border, borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
          <Text variant="mobileLabelSmall" color="foreground">View task</Text>
        </Pressable>
        {/* TODO(BE): open assignment flow */}
        <Pressable onPress={onTagPress} style={{ flex: 1, backgroundColor: TTTheme.colors.textPrimary, borderRadius: 8, paddingVertical: 8, alignItems: 'center' }}>
          <Text variant="mobileLabelSmall" style={{ color: '#fff' }}>Assign more</Text>
        </Pressable>
      </View>
    </View>
  );
}

function TaskAssignedMessage({ onTagPress }: { onTagPress: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): event.triggeredBy.avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color="#18A87D" />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.memberName}</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.assignedAt}</Text>
        </View>
        <TaskAssignedCard onTagPress={onTagPress} />
      </View>
    </View>
  );
}

function OutgoingMessage({ text, showTags = false }: { text: string; showTags?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): currentUser.avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.currentUserInitials} color="darkMagenta" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: TTTheme.colors.darkMagenta }}>You</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.sentAt}</Text>
          <Check size={12} color={TTTheme.colors.grey05} />
        </View>
        {/* TODO(BE): message.text */}
        <Text variant="mobileBody" color="textSecondary">{text}</Text>
        {showTags && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 } as any}>
            {/* TODO(BE): message.tags — project + task objects */}
            <ProjectTagChip label={CHAT_CONTEXT.projectName} />
            <TaskTagChip label={CHAT_CONTEXT.taskName} />
          </View>
        )}
      </View>
    </View>
  );
}

function CarlosReply() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): message.sender.avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color="#18A87D" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.memberName}</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.replyAt}</Text>
        </View>
        {/* TODO(BE): message.text */}
        <Text variant="mobileBody" color="textSecondary"># Hi Thank you{'\n'}I will do it.</Text>
      </View>
    </View>
  );
}

// ── Input bars ────────────────────────────────────────────────────────────────

function MinimalInputBar({ onHashPress }: { onHashPress: () => void }) {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 8 } as any}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Pressable onPress={onHashPress} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' } as any}>
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

// ── Task picker bottom sheet ──────────────────────────────────────────────────

function TaskPickerSheet({
  onSelectTask,
  onCancel,
}: {
  onSelectTask: (taskTitle: string) => void;
  onCancel: () => void;
}) {
  const sheetAnim   = useRef(new Animated.Value(0)).current;
  const tooltipAnim = useTooltipAnim(400);
  const translateY  = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [420, 0] });

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1, duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Dim overlay */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any} />

      {/* Sheet */}
      <Animated.View style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        paddingBottom: 32, zIndex: 51,
        transform: [{ translateY }],
      } as any}>
        {/* Drag handle */}
        <View style={{ width: 40, height: 4, backgroundColor: TTTheme.colors.grey03, borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 }} />

        {/* Search row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 } as any}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: TTTheme.colors.grey01, borderRadius: 12, paddingHorizontal: 12, height: 40 } as any}>
            <Search size={16} color={TTTheme.colors.grey04} />
            <Text variant="mobileBody" color="grey04">Search</Text>
          </View>
          <Pressable onPress={onCancel}>
            <Text variant="mobileLabelSmall" color="foreground">Cancel</Text>
          </Pressable>
        </View>

        {/* Section label */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
          <Text variant="mobileMetadataSecondary" color="grey04" style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            All Projects &amp; Tasks
          </Text>
        </View>

        {/* Project row (bold) */}
        {/* TODO(BE): project.name / project.avatar */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
          <Avatar size="sm" type="text" initials={CHAT_CONTEXT.projectInitials} color="pastelOrange" />
          <Text variant="mobileLabelSmall" color="foreground" style={{ fontWeight: '700', flex: 1 }}>
            {CHAT_CONTEXT.projectName}
          </Text>
        </View>

        {/* Task rows */}
        {PICKER_TASKS.map((task) => (
          <Pressable
            key={task.id}
            onPress={() => onSelectTask(task.title)}
            style={{ paddingLeft: 58, paddingRight: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: TTTheme.colors.border, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}
          >
            <Hash size={14} color={TTTheme.colors.secondaryGreen} />
            <View style={{ flex: 1 }}>
              {/* TODO(BE): task.name */}
              <Text variant="mobileLabelSmall" color="foreground">{task.title}</Text>
            </View>
            {/* TODO(BE): task.assignee.avatar */}
            <Avatar size="xs" type="text" initials={task.assigneeInitials} color={task.assigneeColor} />
          </Pressable>
        ))}
      </Animated.View>

      {/* Tooltip 2: "Project vs Task" — explains bold = project, # = task */}
      <OnboardingTooltip
        title="Project vs Task"
        description="Projects are shown in Bold Text, while Tasks use the '#' icon."
        step="Step 2/3"
        ctaText="Got it"
        onCtaPress={() => onSelectTask(PICKER_TASKS[0].title)}
        style={{ left: 20, top: 350, zIndex: 62 }}
        arrowEdge="top"
        arrowSide="left"
        arrowInset={20}
        anim={tooltipAnim}
      />
    </>
  );
}

// ── Compose panel (shown after task selected) ─────────────────────────────────

function ComposerPanel({
  taskTitle,
  messageText,
  inputRef,
  onChangeText,
  onPhysicalKeyPress,
  onSend,
}: {
  taskTitle: string;
  messageText: string;
  inputRef: React.RefObject<any>;
  onChangeText: (text: string) => void;
  onPhysicalKeyPress: (key: string) => void;
  onSend: () => void;
}) {
  const sendActive = messageText.trim().length > 0;

  return (
    <View style={{
      position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41,
      backgroundColor: '#fff',
      borderTopWidth: 1, borderTopColor: TTTheme.colors.border,
      borderTopLeftRadius: 16, borderTopRightRadius: 16,
    } as any}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        {/* Tag pills — project + task */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 } as any}>
          {/* TODO(BE): selectedTags — project + task objects from picker */}
          <ProjectTagChip label={CHAT_CONTEXT.projectName} />
          <TaskTagChip label={taskTitle} />
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

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color={TTTheme.colors.textPrimary} />
          </View>
          {[Hash, Camera, ImageIcon, MapPin, Mic].map((Icon, i) => (
            <View key={i} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={TTTheme.colors.textPrimary} />
            </View>
          ))}
        </View>
        <Pressable onPress={sendActive ? onSend : undefined}>
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: sendActive ? TTTheme.colors.secondaryGreen : TTTheme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color={sendActive ? '#fff' : TTTheme.colors.grey04} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// ── Main Case7Screen ──────────────────────────────────────────────────────────

export function Case7Screen({ onComplete }: { onComplete?: () => void } = {}) {
  const [phase, setPhase]               = useState<Phase>('coach');
  const [selectedTask, setSelectedTask] = useState(PICKER_TASKS[0].title);
  const [messageText, setMessageText]   = useState('');
  const [pressedKey, setPressedKey]     = useState<string | null>(null);

  const inputRef        = useRef<any>(null);
  const messageTextRef  = useRef('');
  const keyTimerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const coachTooltipAnim   = useTooltipAnim(250);
  const composeTooltipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (keyTimerRef.current)    clearTimeout(keyTimerRef.current);
      if (successTimerRef.current) clearTimeout(successTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'compose') return;

    composeTooltipAnim.setValue(0);
    Animated.timing(composeTooltipAnim, { toValue: 1, duration: 350, delay: 250, useNativeDriver: true }).start();

    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const openPicker   = () => setPhase('picker');
  const closePicker  = () => setPhase('coach');

  const handleSelectTask = (taskTitle: string) => {
    setSelectedTask(taskTitle);
    setMessageText('');
    messageTextRef.current = '';
    setPhase('compose');
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
    else if (key === ' ')         flashKey('SPACE');
    else if (key === 'Backspace') flashKey('BACKSPACE');
  };

  const handleKeyTap = (keyId: string) => {
    flashKey(keyId);
    const current = messageTextRef.current;
    const refocus  = () => setTimeout(() => inputRef.current?.focus(), 0);

    if (keyId === 'BACKSPACE')       { handleChangeText(current.slice(0, -1)); refocus(); }
    else if (keyId === 'SPACE')      { handleChangeText(`${current} `); refocus(); }
    else if (keyId === 'DONE')       { handleSend(); }
    else if (/^[A-Z]$/.test(keyId)) { handleChangeText(current + keyId.toLowerCase()); refocus(); }
  };

  // TODO(BE): POST /api/chats/:chatId/messages — include text + selectedTag ids
  const handleSend = () => {
    if (!messageTextRef.current.trim()) return;
    setPhase('success');
    // Carlos replies after a short delay
    successTimerRef.current = setTimeout(() => setPhase('done'), 2200);
  };

  // Tooltip 3 "Send" CTA — uses default text if input is empty so tutorial always progresses
  const handleTooltipSend = () => {
    if (!messageTextRef.current.trim()) {
      messageTextRef.current = 'This is a task that I have assigned to you';
      setMessageText(messageTextRef.current);
    }
    handleSend();
  };

  const showMinimalInput = phase === 'coach' || phase === 'success' || phase === 'done';
  const showMessages     = phase === 'success' || phase === 'done';

  return (
    <Box flex={1} backgroundColor="white">
      <StatusBarRow />
      <ChatHeader />

      {/* ── Message area ── */}
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'flex-end', paddingBottom: phase === 'compose' ? 168 : 0 }}>
        <DateSeparator label="Friday, May 22" />
        <TaskAssignedMessage onTagPress={openPicker} />
        {showMessages && (
          <>
            <OutgoingMessage text="Hi Carlos! Welcome to the project, I have assigned one task." />
            <OutgoingMessage
              text="This is a task that I have assigned to you"
              showTags
            />
          </>
        )}
        {phase === 'done' && <CarlosReply />}
      </View>

      {/* ── Input bar (coach / success / done phases) ── */}
      {showMinimalInput && <MinimalInputBar onHashPress={openPicker} />}

      {/* ── Task picker (picker phase) ── */}
      {phase === 'picker' && (
        <TaskPickerSheet onSelectTask={handleSelectTask} onCancel={closePicker} />
      )}

      {/* ── Compose panel + keyboard + tooltip 3 (compose phase) ── */}
      {phase === 'compose' && (
        <>
          <ComposerPanel
            taskTitle={selectedTask}
            messageText={messageText}
            inputRef={inputRef}
            onChangeText={handleChangeText}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSend={handleSend}
          />
          <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
          <OnboardingTooltip
            title="Smart Tags"
            description="Now! You've linked this message to a project and task. Send it and it'll stay connected — no more hunting through chats."
            step="Step 3/3"
            ctaText="Send"
            onCtaPress={handleTooltipSend}
            style={{ top: 179, left: 31, zIndex: 43 }}
            arrowEdge="bottom"
            arrowSide="left"
            arrowInset={8}
            anim={composeTooltipAnim}
          />
        </>
      )}

      {/* ── Tooltip 1: "Tag It" (coach phase) ── */}
      {phase === 'coach' && (
        <OnboardingTooltip
          title="Tag It"
          description="Tag a job or task to link any message so nothing gets lost."
          step="Step 1/3"
          ctaText="Try it!"
          onCtaPress={openPicker}
          style={{ top: 572, left: 31, zIndex: 62 }}
          arrowEdge="bottom"
          arrowSide="left"
          arrowInset={8}
          anim={coachTooltipAnim}
        />
      )}

      {/* ── Complete button (done phase) ── */}
      {phase === 'done' && (
        <Pressable
          onPress={onComplete}
          style={{ position: 'absolute', bottom: 88, left: 16, right: 16, zIndex: 50 } as any}
        >
          <View style={{ backgroundColor: '#000', borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text variant="mobileLabelSmall" style={{ color: '#fff' }}>Next</Text>
          </View>
        </Pressable>
      )}
    </Box>
  );
}
