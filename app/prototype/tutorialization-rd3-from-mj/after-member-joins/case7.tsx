import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../../_shared/mobile/MockKeyboard';
import { OnboardingTooltip, useTooltipAnim } from '../../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, ScrollView, TextInput, View } from 'react-native';
import {
  Camera,
  Check,
  ChevronLeft,
  Folder,
  HardHat,
  Hash,
  Home,
  Image as ImageIcon,
  MapPin,
  Mic,
  Plus,
  Search,
  Send,
  X,
} from 'lucide-react-native';
import { MemberEventCard } from './MemberEventCard';

// Phase progression: coach → (2s auto nudge) → picker → compose → success → done
type Phase = 'coach' | 'picker' | 'compose' | 'success' | 'done' | 'nudgeCompose' | 'nudgeSent';

const NUDGE_MESSAGE = "Can you send a site photo? It'll be saved to the job automatically.";
const NUDGE_COMPOSER_HEIGHT = 100;

// TODO(BE): GET /api/chats/:chatId/context
const CHAT_CONTEXT = {
  projectName: '1520 Oliver Street',
  projectInitials: 'OS',
  memberName: 'Carlos Smith',
  memberInitials: 'CS',
  taskName: 'Fix kitchen sink',
  currentUserInitials: 'MJ',
  assignedAt: '12:25 PM',
  sentAt: '12:26 PM',
  replyAt: '12:27 PM',
  nudgeSentAt: '12:50 PM',
};

// TODO(BE): GET /api/projects?context=chat — projects + tasks the user can tag
const PICKER_PROJECTS = [
  {
    id: 'oliver',
    name: '1520 Oliver Street',
    bgColor: '#7B61FF',
    iconType: 'hardhut' as const,
    tasks: [
      { id: 'fix_sink', title: 'Fix kitchen sink', showCS: true },
    ],
  },
  {
    id: 'welcome',
    name: 'Welcome to Tasktag! 🎉',
    bgColor: '#138eff',
    iconType: 'home' as const,
    tasks: [
      { id: 'create_task', title: 'Create Your First Task',    showCS: false },
      { id: 'invite',      title: 'Invite Contacts',           showCS: false },
      { id: 'due_date',    title: 'Set a Due Date',            showCS: false },
      { id: 'all_done',    title: 'Mark All the Tasks as Done', showCS: false },
      { id: 'archive',     title: 'Archive the Projects',      showCS: false },
    ],
  },
];

// ── Small helpers ─────────────────────────────────────────────────────────────

function HomeIndicator() {
  return (
    <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
      <View style={{ width: 134, height: 5, borderRadius: 5, backgroundColor: TTTheme.colors.textPrimary }} />
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
          <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color={TTTheme.colors.darkGreen} />
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

/** Project pill — solid green, folder icon, white text */
function ProjectTagChip({ label }: { label: string }) {
  return (
    <View style={{
      borderRadius: 4,
      backgroundColor: TTTheme.colors.secondaryGreen,
      paddingHorizontal: 10, paddingVertical: 5,
      flexDirection: 'row', alignItems: 'center', gap: 4,
      flex: 1,
    } as any}>
      <Folder size={14} color="#fff" style={{ flexShrink: 0 } as any} />
      <Text variant="mobileLabelSmall" style={{ color: '#fff', flex: 1 }} numberOfLines={1}>{label}</Text>
    </View>
  );
}

/** Task pill — black, # prefix, optional × remove button */
function TaskTagChip({ label, onRemove }: { label: string; onRemove?: () => void }) {
  return (
    <View style={{
      borderRadius: 4,
      backgroundColor: '#000',
      paddingHorizontal: 10, paddingVertical: 5,
      flexDirection: 'row', alignItems: 'center', gap: 4,
      flex: 1,
    } as any}>
      <Hash size={14} color="#fff" style={{ flexShrink: 0 } as any} />
      <Text variant="mobileLabelSmall" style={{ color: '#fff', flex: 1 }} numberOfLines={1}>{label}</Text>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8} style={{ flexShrink: 0 } as any}>
          <X size={14} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

// ── Message components ────────────────────────────────────────────────────────

function TaskAssignedMessage({ onTagPress }: { onTagPress: () => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): event.triggeredBy.avatar */}
      <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color={TTTheme.colors.darkGreen} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6, marginBottom: 6 } as any}>
          <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.memberName}</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.assignedAt}</Text>
        </View>
        {/* TODO(BE): event.type — always 'taskAssigned' here */}
        <MemberEventCard
          variant="taskAssigned"
          memberName={CHAT_CONTEXT.memberName}
          taskName={CHAT_CONTEXT.taskName}
          onSecondaryPress={onTagPress}
        />
      </View>
    </View>
  );
}

function OutgoingMessage({ text, showTags = false, showCelebration = false }: { text: string; showTags?: boolean; showCelebration?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      {/* TODO(BE): currentUser.avatar */}
      <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0 }} resizeMode="cover" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelEmphasized" style={{ color: TTTheme.colors.darkMagenta }}>You</Text>
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
        {showCelebration && (
          <Text variant="mobileLabelSmall" color="foreground">First tag complete! 🎉</Text>
        )}
      </View>
    </View>
  );
}

function CarlosReply({ anim }: { anim: Animated.Value }) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] } as any}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
        {/* TODO(BE): message.sender.avatar */}
        <Avatar size="sm" type="text" initials={CHAT_CONTEXT.memberInitials} color={TTTheme.colors.darkGreen} />
        <View style={{ flex: 1, gap: 6 } as any}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
            <Text variant="mobileLabelSmall" color="foreground">{CHAT_CONTEXT.memberName}</Text>
            <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.replyAt}</Text>
          </View>
          {/* TODO(BE): message.text */}
          <Text variant="mobileBody" color="textSecondary">{'Hi! Thank you\nI will do it.'}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

function NudgeCard({ onSend, anim }: { onSend: () => void; anim: Animated.Value }) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] } as any}>
      <View style={{ backgroundColor: '#000', borderRadius: 12, padding: 14, marginHorizontal: 16, marginTop: 10, gap: 12 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={18} color="#fff" />
          </View>
          <Text variant="mobileLabelEmphasized" style={{ color: '#fff' }}>Get a site photo</Text>
        </View>
        <Text variant="mobileSecondaryBody" style={{ color: '#fff' }}>
          Ask your crew to send one — it'll be saved to this job automatically
        </Text>
        <Pressable onPress={onSend} style={{ backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8, paddingVertical: 10, alignItems: 'center' }}>
          <Text variant="mobileLabelSmall" style={{ color: '#fff' }}>Send</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function NudgeSentMessage() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 8 } as any}>
      <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0 }} resizeMode="cover" />
      <View style={{ flex: 1, gap: 6 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 } as any}>
          <Text variant="mobileLabelEmphasized" style={{ color: TTTheme.colors.darkMagenta }}>You</Text>
          <Text variant="mobileMetadataPrimary" color="grey05">{CHAT_CONTEXT.nudgeSentAt}</Text>
          <Check size={12} color={TTTheme.colors.grey05} />
        </View>
        <Text variant="mobileBody" color="textSecondary">{NUDGE_MESSAGE}</Text>
      </View>
    </View>
  );
}

function NudgeComposerPanel({ onSend }: { onSend: () => void }) {
  return (
    <View style={{
      position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41,
      backgroundColor: '#fff',
      borderTopWidth: 1, borderTopColor: TTTheme.colors.border,
      borderTopLeftRadius: 16, borderTopRightRadius: 16,
    } as any}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0 }}>
        <Text variant="mobileBody" color="textSecondary" style={{ minHeight: 34 }}>{NUDGE_MESSAGE}</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
          <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color={TTTheme.colors.textPrimary} />
          </View>
          {[Hash, Camera, ImageIcon, MapPin, Mic].map((Icon, i) => (
            <View key={i} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={TTTheme.colors.textPrimary} />
            </View>
          ))}
        </View>
        <Pressable onPress={onSend}>
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// ── Input bars ────────────────────────────────────────────────────────────────

/** Inactive input bar — no # button, used before nudge and in success/done */
function MinimalInputBar() {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 6 } as any}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Type message here...</Text>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} color={TTTheme.colors.grey04} />
        </View>
      </View>
      <HomeIndicator />
    </View>
  );
}

/** Active input bar — # plain (tappable), no animation, used when nudge fires */
function CoachInputBar({ onHashPress }: { onHashPress: () => void }) {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0 }}>
        <Text variant="mobileBody" color="grey05" style={{ minHeight: 28 }}>Type message here...</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
          <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color={TTTheme.colors.textPrimary} />
          </View>
          <Pressable onPress={onHashPress} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' } as any}>
            <Hash size={20} color={TTTheme.colors.textPrimary} />
          </Pressable>
          {[Camera, ImageIcon, MapPin, Mic].map((Icon, i) => (
            <View key={i} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={TTTheme.colors.textPrimary} />
            </View>
          ))}
        </View>
        <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey05, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Send size={20} color="#fff" />
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
  const translateY  = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [500, 0] });

  useEffect(() => {
    Animated.timing(sheetAnim, {
      toValue: 1, duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Dim overlay */}
      <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, opacity: sheetAnim } as any} />

      {/* Sheet — leaves status bar (44px) visible, same as case5 */}
      <Animated.View style={{
        position: 'absolute', top: 44, bottom: 0, left: 0, right: 0,
        backgroundColor: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        zIndex: 51,
        transform: [{ translateY }],
      } as any}>
        {/* Pull handle */}
        <View style={{ alignItems: 'center', paddingTop: 16, paddingBottom: 8 }}>
          <View style={{ width: 56, height: 4, backgroundColor: TTTheme.colors.grey04, borderRadius: 2.5 }} />
        </View>

        {/* Search row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 } as any}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, gap: 8, backgroundColor: TTTheme.colors.grey01 } as any}>
            <Search size={18} color={TTTheme.colors.grey05} />
            <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Search</Text>
          </View>
          <Pressable onPress={onCancel}>
            <Text variant="mobileLabelSmall" style={{ color: TTTheme.colors.secondaryGreen }}>Cancel</Text>
          </Pressable>
        </View>

        {/* Section label */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 }}>
          <Text variant="mobileSecondaryBody" color="grey05">All Projects & Tasks</Text>
        </View>

        {/* Projects + tasks */}
        {PICKER_PROJECTS.map((project) => (
          <View key={project.id}>
            {/* TODO(BE): project.icon + project.name */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
              <View style={{ width: 32, height: 32, backgroundColor: project.bgColor, borderRadius: 4, alignItems: 'center', justifyContent: 'center' }}>
                {project.iconType === 'hardhut' ? <HardHat size={18} color="#fff" /> : <Home size={18} color="#fff" />}
              </View>
              <Text variant="mobileLabelEmphasized" color="foreground">{project.name}</Text>
            </View>
            {project.tasks.map((task) => (
              <Pressable
                key={task.id}
                onPress={() => onSelectTask(task.title)}
                style={{ paddingLeft: 16, paddingRight: 16, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } as any}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
                  <View style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
                    <Hash size={18} color={TTTheme.colors.secondaryGreen} />
                  </View>
                  {/* TODO(BE): task.name */}
                  <Text variant="mobileLabelSmall" color="foreground">{task.title}</Text>
                </View>
                {/* TODO(BE): task.assignees */}
                <View style={{ flexDirection: 'row', alignItems: 'center' } as any}>
                  {task.showCS && (
                    <Avatar size="xs" type="text" initials="C" color={TTTheme.colors.darkGreen} />
                  )}
                  <Image
                    source={require('@/assets/images/mj.png')}
                    style={{ width: 24, height: 24, borderRadius: 12, marginLeft: task.showCS ? -8 : 0, borderWidth: task.showCS ? 1.5 : 0, borderColor: '#fff' } as any}
                    resizeMode="cover"
                  />
                </View>
              </Pressable>
            ))}
          </View>
        ))}

        {/* New Task FAB */}
        <View style={{ position: 'absolute', bottom: 40, right: 17 } as any}>
          <View style={{ backgroundColor: '#000', borderRadius: 100, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 16, paddingVertical: 14, gap: 8 }}>
            <Plus size={22} color="#fff" />
            <Text variant="mobileBody" style={{ color: '#fff' }}>New Task</Text>
          </View>
        </View>

        {/* Home bar */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 } as any}>
          <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.grey06, borderRadius: 5 }} />
        </View>
      </Animated.View>

      {/* Tooltip 2: "Project vs Task" — no CTA, tapping Fix kitchen sink proceeds */}
      <OnboardingTooltip
        title="Project vs Task"
        description="Projects are shown in Bold Text, while Tasks use the '#' icon."
        step="Step 2/3"
        style={{ left: 28, top: 280, zIndex: 62 }}
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
  onRemoveTask,
}: {
  taskTitle: string;
  messageText: string;
  inputRef: React.RefObject<any>;
  onChangeText: (text: string) => void;
  onPhysicalKeyPress: (key: string) => void;
  onSend: () => void;
  onRemoveTask?: () => void;
}) {
  const sendActive = messageText.trim().length > 0;

  return (
    <View style={{
      position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41,
      backgroundColor: '#fff',
      borderTopWidth: 1, borderTopColor: TTTheme.colors.border,
      borderTopLeftRadius: 16, borderTopRightRadius: 16,
    } as any}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0 }}>
        {/* Tag pills — project + task, bordered wrapper */}
        <View style={{ borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, padding: 4, marginBottom: 6 } as any}>
          <View style={{ flexDirection: 'row', gap: 6 } as any}>
            {/* TODO(BE): selectedTags — project + task objects from picker */}
            <ProjectTagChip label={CHAT_CONTEXT.projectName} />
            <TaskTagChip label={taskTitle} onRemove={onRemoveTask} />
          </View>
        </View>

        <TextInput
          ref={inputRef}
          value={messageText}
          onChangeText={onChangeText}
          onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
          placeholder="Type message here..."
          placeholderTextColor={TTTheme.colors.grey05}
          multiline
          autoComplete="new-password"
          autoCorrect={false}
          style={{ fontSize: 16, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none', minHeight: 34 } as any}
        />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
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
          <View style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: sendActive ? '#000' : TTTheme.colors.grey05, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

// ── Main Case7Screen ──────────────────────────────────────────────────────────

export function Case7Screen({
  onComplete,
  startPhase = 'coach',
  firstMessageText,
}: {
  onComplete?: () => void;
  startPhase?: Phase;
  firstMessageText?: string;
} = {}) {
  const [phase, setPhase]               = useState<Phase>(startPhase);
  const [selectedTask, setSelectedTask] = useState(PICKER_PROJECTS[0].tasks[0].title);
  const [messageText, setMessageText]   = useState('');
  const [pressedKey, setPressedKey]     = useState<string | null>(null);

  const inputRef           = useRef<any>(null);
  const messageTextRef     = useRef('');
  const keyTimerRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [showNudge, setShowNudge]           = useState(startPhase === 'coach');
  const [showCelebration, setShowCelebration] = useState(false);
  const [composeKey, setComposeKey] = useState(0);
  const coachTooltipAnim   = useRef(new Animated.Value(startPhase === 'coach' ? 1 : 0)).current;
  const composeTooltipAnim = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const carlosReplyAnim    = useRef(new Animated.Value(0)).current;
  const nudgeCardAnim      = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      if (keyTimerRef.current)        clearTimeout(keyTimerRef.current);
      if (successTimerRef.current)    clearTimeout(successTimerRef.current);
      if (celebrationTimerRef.current) clearTimeout(celebrationTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'coach') {
      setShowNudge(false);
      coachTooltipAnim.setValue(0);
      return;
    }
    setShowNudge(true);
    Animated.timing(coachTooltipAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'compose') return;

    composeTooltipAnim.setValue(0);
    Animated.timing(composeTooltipAnim, { toValue: 1, duration: 350, delay: 250, useNativeDriver: true }).start();

    // Explicitly reset so browser autocomplete can't override the empty value
    setMessageText('');
    messageTextRef.current = '';

    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== 'done') return;
    carlosReplyAnim.setValue(0);
    nudgeCardAnim.setValue(0);
    Animated.timing(carlosReplyAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    Animated.timing(nudgeCardAnim, { toValue: 1, duration: 350, delay: 800, useNativeDriver: true }).start();
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const openPicker   = () => setPhase('picker');
  const closePicker  = () => setPhase('coach');

  const handleSelectTask = (taskTitle: string) => {
    setSelectedTask(taskTitle);
    setMessageText('');
    messageTextRef.current = '';
    setComposeKey(k => k + 1);
    setPhase('compose');
  };

  const handleChangeText = (text: string) => {
    const wasEmpty = !messageTextRef.current.trim();
    messageTextRef.current = text;
    setMessageText(text);
    if (wasEmpty && text.trim()) {
      Animated.timing(composeTooltipAnim, { toValue: 0, duration: 2000, delay: 400, useNativeDriver: true }).start();
    }
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
    setShowCelebration(false);
    // After 2s: show "First tag complete! 🎉"
    celebrationTimerRef.current = setTimeout(() => {
      setShowCelebration(true);
      // After 2.2s more: done phase (Carlos reply + NudgeCard)
      successTimerRef.current = setTimeout(() => {
        setShowCelebration(false);
        setPhase('done');
      }, 2200);
    }, 2000);
  };

  const handleNudgeSend = () => {
    setPhase('nudgeSent');
  };


  const firstMessage = firstMessageText?.trim() ?? '';
  const showFirstMessage   = firstMessage.length > 0;
  const showTaggedMessage  = phase === 'success' || phase === 'done' || phase === 'nudgeCompose' || phase === 'nudgeSent';
  const KEYBOARD_HEIGHT = 291;
  const COMPOSER_PANEL_HEIGHT = 141; // paddingTop(8) + border-wrapper(36) + gap(6) + input(34) + actionBar(57)
  const messagePaddingBottom = phase === 'compose'
    ? KEYBOARD_HEIGHT + COMPOSER_PANEL_HEIGHT  // OutgoingMessage.paddingBottom(8) + composer.paddingTop(8) = 16px visual gap
    : phase === 'nudgeCompose'
      ? KEYBOARD_HEIGHT + NUDGE_COMPOSER_HEIGHT
      : 8;

  return (
    <Box flex={1} backgroundColor="white">
      <StatusBarRow />
      <ChatHeader />

      {/* ── Message area ── */}
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end', paddingBottom: messagePaddingBottom }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <DateSeparator label="Friday, May 22" />
        <TaskAssignedMessage onTagPress={openPicker} />
        {showFirstMessage && (
          <OutgoingMessage text={firstMessage} />
        )}
        {showTaggedMessage && (
          <OutgoingMessage
            text="This is a task that I have assigned to you"
            showTags
            showCelebration={showCelebration}
          />
        )}
        {(phase === 'done' || phase === 'nudgeCompose' || phase === 'nudgeSent') && <CarlosReply anim={carlosReplyAnim} />}
        {phase === 'done' && <NudgeCard onSend={() => setPhase('nudgeCompose')} anim={nudgeCardAnim} />}
        {phase === 'nudgeSent' && <NudgeSentMessage />}
      </ScrollView>

      {/* ── Input bar (coach phase) ── */}
      {phase === 'coach' && !showNudge && <MinimalInputBar />}
      {phase === 'coach' && showNudge && <CoachInputBar onHashPress={openPicker} />}

      {/* ── Input bar (success / done / nudgeSent phases) ── */}
      {(phase === 'success' || phase === 'done' || phase === 'nudgeSent') && <MinimalInputBar />}

      {/* ── Coach tooltip "Tag It" — Step 1/3 ── */}
      {phase === 'coach' && showNudge && (
        <OnboardingTooltip
          title="Tag It"
          description={`Tag a job or task to link any message so nothing gets lost.`}
          step="Step 1/3"
          ctaText="Try it!"
          onCtaPress={openPicker}
          style={{ bottom: 96, left: 28, zIndex: 43 }}
          arrowEdge="bottom"
          arrowSide="left"
          arrowInset={44}
          anim={coachTooltipAnim}
        />
      )}

      {/* ── Task picker (picker phase) ── */}
      {phase === 'picker' && (
        <TaskPickerSheet onSelectTask={handleSelectTask} onCancel={closePicker} />
      )}

      {/* ── Compose panel + keyboard + tooltip 3 (compose phase) ── */}
      {phase === 'compose' && (
        <>
          <ComposerPanel
            key={composeKey}
            taskTitle={selectedTask}
            messageText={messageText}
            inputRef={inputRef}
            onChangeText={handleChangeText}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSend={handleSend}
            onRemoveTask={openPicker}
          />
          <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
          <OnboardingTooltip
            title="Smart Tags"
            description="Now! You've linked this message to a project and task. Send it and it'll stay connected — no more hunting through chats."
            step="Step 3/3"
            style={{ bottom: KEYBOARD_HEIGHT + COMPOSER_PANEL_HEIGHT + 32, left: 31, zIndex: 43 }}
            arrowEdge="bottom"
            arrowSide="left"
            arrowInset={24}
            anim={composeTooltipAnim}
          />
        </>
      )}


      {/* ── Nudge compose panel + keyboard (nudgeCompose phase) ── */}
      {phase === 'nudgeCompose' && (
        <>
          <NudgeComposerPanel onSend={handleNudgeSend} />
          <MockKeyboard pressedKey={null} onKeyTap={() => {}} />
        </>
      )}

    </Box>
  );
}
