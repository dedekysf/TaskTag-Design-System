import { Avatar } from '@/components/Avatar';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { MockKeyboard } from '../../_shared/mobile/MockKeyboard';
import { OnboardingTooltip } from '../../_shared/mobile/OnboardingTooltip';
import { StatusBarRow } from '../../_shared/mobile/StatusBarRow';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, TextInput, View } from 'react-native';
import {
  Camera,
  Check,
  ChevronLeft,
  FileText,
  Hash,
  Image as ImageIcon,
  MapPin,
  Mic,
  Plus,
  Search,
  Send,
  Smile,
} from 'lucide-react-native';

// ── Types ─────────────────────────────────────────────────────────────────────

type Phase = 'empty' | 'typing' | 'sent' | 'nudge';

// ── Sub-components ────────────────────────────────────────────────────────────

/** Chat room header: ← [CS] Carlos Smith · Search */
function ChatHeader() {
  return (
    <View style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, height: 51, borderBottomWidth: 1, borderBottomColor: TTTheme.colors.border }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={TTTheme.colors.textPrimary} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {/* TODO(BE): GET /api/contacts/:id — initials + color */}
          <Avatar size="sm" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
          <View style={{ gap: 1 } as any}>
            <Text variant="mobileLabelEmphasized" color="foreground">Carlos Smith</Text>
            <Text variant="mobileMetadataSecondary" color="grey04">tap here to chat info</Text>
          </View>
        </View>
      </View>
      <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
        <Search size={24} color={TTTheme.colors.textPrimary} />
      </View>
    </View>
  );
}

/** Horizontal date separator */
function DateSeparator({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
      <Text variant="mobileMetadataPrimary" style={{ color: TTTheme.colors.grey04, marginHorizontal: 12 }}>
        {label}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: TTTheme.colors.border }} />
    </View>
  );
}

/**
 * System card: member joined notification + task assignment info.
 * Badge text switches from "MEMBER JOINED" → "TASK ASSIGNED" after message sent.
 */
function MemberJoinedCard({ taskAssigned = false }: { taskAssigned?: boolean }) {
  return (
    <View style={{ borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, padding: 12, gap: 12, backgroundColor: '#fff' } as any}>
      {/* Badge — TODO(BE): driven by event.type */}
      <View style={{ backgroundColor: TTTheme.colors.lightMint, borderRadius: 100, paddingHorizontal: 8, paddingVertical: 4, alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 10, fontWeight: '500', color: TTTheme.colors.textSecondary }}>
          {taskAssigned ? 'TASK ASSIGNED' : 'MEMBER JOINED'}
        </Text>
      </View>
      {/* Description */}
      <View style={{ gap: 4 } as any}>
        {/* TODO(BE): event.member.displayName */}
        <Text variant="mobileLabelSmall" color="foreground">Carlos Smith has been assigned a task</Text>
        <Text variant="mobileMetadataPrimary" color="grey05">
          {'Carlos is now working on '}
          {/* TODO(BE): event.task.name — fontWeight '600' hardcoded: DS has no bold 12px variant */}
          <Text style={{ fontSize: 12, fontWeight: '600', color: taskAssigned ? TTTheme.colors.secondaryGreen : TTTheme.colors.textSecondary }}>
            Fix kitchen sink
          </Text>
        </Text>
      </View>
      {/* CTAs */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {/* TODO(BE): navigate to /tasks/:id */}
        <Pressable style={{ flex: 1, backgroundColor: TTTheme.colors.textPrimary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}>
          <Text variant="mobileLabelSmall" style={{ color: '#fff' }}>
            View task
          </Text>
        </Pressable>
        {/* TODO(BE): open task assignment flow */}
        <Pressable style={{ flex: 1, borderWidth: 1.5, borderColor: TTTheme.colors.textPrimary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignItems: 'center' }}>
          <Text variant="mobileLabelSmall" color="foreground">Assign more</Text>
        </Pressable>
      </View>
    </View>
  );
}

/** Incoming message row from Carlos (CS initials, darkGreen avatar) */
function CarlosMessage({ taskAssigned }: { taskAssigned: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16 }}>
      {/* TODO(BE): event.member.avatar + initials */}
      <Avatar size="sm" type="text" initials="CS" color={TTTheme.colors.darkGreen} />
      <View style={{ flex: 1, gap: 8 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text variant="mobileLabelEmphasized" color="foreground">Carlos Smith</Text>
          <Text variant="mobileMetadataSecondary" color="grey05">12:25 PM</Text>
        </View>
        <MemberJoinedCard taskAssigned={taskAssigned} />
      </View>
    </View>
  );
}

/** Outgoing message row from the current user (Maria Jose → "You") */
function MyMessage({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16 }}>
      {/* TODO(BE): current user avatar */}
      <Image source={require('@/assets/images/mj.png')} style={{ width: 32, height: 32, borderRadius: 16, flexShrink: 0 }} resizeMode="cover" />
      <View style={{ flex: 1, gap: 8 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text variant="mobileLabelEmphasized" style={{ color: TTTheme.colors.darkMagenta }}>You</Text>
          <Text variant="mobileMetadataSecondary" color="grey05">12:26 PM</Text>
          <Check size={12} color={TTTheme.colors.textSecondary} />
        </View>
        <Text variant="mobileBody" color="textSecondary">{text}</Text>
        {/* First-message celebration label */}
        <Text variant="mobileLabelSmall" color="foreground">First message sent! 🎉</Text>
      </View>
    </View>
  );
}

/**
 * Task nudge card — appears 1.5s after message sent.
 * Shows the assigned task as a chat attachment, nudging the owner to check.
 */
function TaskNudgeCard() {
  return (
    <View style={{ marginHorizontal: 16 }}>
      {/* TODO(BE): GET /api/tasks/:id — render attached task card */}
      <View style={{ borderWidth: 1, borderColor: TTTheme.colors.border, borderRadius: 8, padding: 12, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 32, height: 32, backgroundColor: TTTheme.colors.textPrimary, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }}>
          <FileText size={16} color="#fff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="mobileLabelSmall" color="foreground">Fix kitchen sink</Text>
          <Text variant="mobileMetadataPrimary" color="grey04">Assigned · Carlos Smith</Text>
        </View>
      </View>
    </View>
  );
}

/** Full-featured input bar — sits above keyboard (position absolute, bottom: 291) */
function ChatInputFull({
  value,
  inputRef,
  onChangeText,
  onFocus,
  onPhysicalKeyPress,
  onSend,
}: {
  value: string;
  inputRef: React.RefObject<any>;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onPhysicalKeyPress: (key: string) => void;
  onSend: () => void;
}) {
  const sendActive = value.length > 0;

  return (
    <View style={{ position: 'absolute', bottom: 291, left: 0, right: 0, zIndex: 41, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 } as any}>
      {/* Message text */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 0 }}>
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onKeyPress={({ nativeEvent: { key } }) => onPhysicalKeyPress(key)}
          placeholder="Type message here..."
          placeholderTextColor={TTTheme.colors.grey05}
          style={{ fontSize: 16, color: TTTheme.colors.foreground, padding: 0, outlineStyle: 'none', minHeight: 28 } as any}
          multiline
        />
      </View>
      {/* Icons row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 }}>
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
          <View style={{ width: 40, height: 40, backgroundColor: sendActive ? TTTheme.colors.secondaryGreen : TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color={sendActive ? '#fff' : TTTheme.colors.grey04} />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

/** Minimal input bar — used when keyboard is dismissed */
function ChatInputMinimal() {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 8 }}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Type message here...</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Smile size={20} color={TTTheme.colors.textPrimary} />
          </View>
          <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Mic size={20} color={TTTheme.colors.textPrimary} />
          </View>
        </View>
      </View>
      <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
        <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.textPrimary, borderRadius: 5 }} />
      </View>
    </View>
  );
}

// ── Main Case6Screen ──────────────────────────────────────────────────────────

export function Case6Screen({ onComplete }: { onComplete?: () => void } = {}) {
  const [phase, setPhase]         = useState<Phase>('empty');
  const [messageText, setMessageText] = useState('');
  const [pressedKey, setPressedKey]   = useState<string | null>(null);

  const inputRef       = useRef<any>(null);
  const messageTextRef = useRef('');
  const keyTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sheet slides up on mount
  const sheetAnim     = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

  // Tooltip fades in after sheet settles, fades out when typing starts
  const tooltipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Input + keyboard slide up
    sheetAnim.setValue(0);
    Animated.timing(sheetAnim, {
      toValue: 1, duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(() => {
      // Tooltip fades in 250ms after sheet settles
      Animated.timing(tooltipAnim, { toValue: 1, duration: 350, delay: 250, useNativeDriver: true }).start();
    });
    const t = setTimeout(() => inputRef.current?.focus(), 400);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase === 'sent') {
      const t = setTimeout(() => setPhase('nudge'), 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const handleFocus = () => {};

  const handleChangeText = (text: string) => {
    messageTextRef.current = text;
    setMessageText(text);
    if (phase === 'empty') setPhase('typing');
  };

  const handlePhysicalKeyPress = (key: string) => {
    if (/^[a-zA-Z]$/.test(key)) flashKey(key.toUpperCase());
    else if (key === ' ')         flashKey('SPACE');
    else if (key === 'Backspace') flashKey('BACKSPACE');
  };

  const flashKey = (keyId: string) => {
    if (keyTimerRef.current) clearTimeout(keyTimerRef.current);
    setPressedKey(keyId);
    keyTimerRef.current = setTimeout(() => setPressedKey(null), 150);
  };

  const handleKeyTap = (keyId: string) => {
    flashKey(keyId);
    const current = messageTextRef.current;
    const refocus = () => setTimeout(() => inputRef.current?.focus(), 0);

    if (keyId === 'BACKSPACE') { handleChangeText(current.slice(0, -1)); refocus(); }
    else if (keyId === 'SPACE') { handleChangeText(current + ' '); refocus(); }
    else if (keyId === 'DONE')  { handleSend(); }
    else if (/^[A-Z]$/.test(keyId)) { handleChangeText(current + keyId.toLowerCase()); refocus(); }
  };

  const handleSend = () => {
    if (phase === 'empty' || phase === 'typing') setPhase('sent');
  };

  const showKeyboard = phase === 'empty' || phase === 'typing';
  const showMessages = phase === 'sent' || phase === 'nudge';

  return (
    <Box flex={1} backgroundColor="white">

      {/* ── Status bar ── */}
      <StatusBarRow />

      {/* ── Chat header ── */}
      <ChatHeader />

      {/* ── Message area ── */}
      <Box flex={1} style={{ paddingVertical: 16, gap: 16 } as any}>
        <DateSeparator label="Friday, May 22" />
        <CarlosMessage taskAssigned={showMessages} />
        {showMessages && (
          <MyMessage
            text={messageTextRef.current || 'Hi Carlos! Welcome to the project,\nI have assigned one task.'}
          />
        )}
        {phase === 'nudge' && <TaskNudgeCard />}
      </Box>

      {/* ── Input area ── */}
      {showMessages ? (
        <ChatInputMinimal />
      ) : (
        <Animated.View style={{ transform: [{ translateY: sheetTranslateY }], zIndex: 41 } as any}>
          <ChatInputFull
            value={messageText}
            inputRef={inputRef}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSend={handleSend}
          />
          <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
        </Animated.View>
      )}

      {/* ── Tooltip "Start a Conversation" ── */}
      {showKeyboard && (
        <OnboardingTooltip
          title="Start a Conversation"
          description="You can add files, media, and tasks anytime from here."
          style={{ bottom: 408, left: 31, zIndex: 43 }}
          arrowEdge="bottom" arrowSide="left" arrowInset={8}
          anim={tooltipAnim}
        />
      )}

      {/* ── Complete button (nudge phase) ── */}
      {phase === 'nudge' && (
        <Pressable
          onPress={onComplete}
          style={{ position: 'absolute', bottom: 88, left: 16, right: 16, zIndex: 50 } as any}
        >
          <View style={{ backgroundColor: TTTheme.colors.textPrimary, borderRadius: 8, paddingVertical: 14, alignItems: 'center' }}>
            <Text variant="mobileLabelSmall" style={{ color: '#fff' }}>Complete Onboarding</Text>
          </View>
        </Pressable>
      )}

    </Box>
  );
}
