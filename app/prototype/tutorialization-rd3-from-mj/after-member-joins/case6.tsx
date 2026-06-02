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
import { MemberEventCard } from './MemberEventCard';

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
        {/* TODO(BE): event.type — 'memberJoined' | 'taskAssigned' */}
        <MemberEventCard
          variant={taskAssigned ? 'taskAssigned' : 'memberJoined'}
          memberName="Carlos Smith"
          projectName="1520 Oliver Street"
          taskName="Fix kitchen sink"
        />
      </View>
    </View>
  );
}

/** Outgoing message row from the current user (Maria Jose → "You") */
function MyMessage({ text, showCelebration = true }: { text: string; showCelebration?: boolean }) {
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
        {showCelebration && (
          <Text variant="mobileLabelSmall" color="foreground">First message sent! 🎉</Text>
        )}
      </View>
    </View>
  );
}

function GetSitePhotoNudge({ anim, onSend }: { anim: Animated.Value; onSend: () => void }) {
  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  return (
    <Animated.View style={{ opacity: anim, transform: [{ translateY }] } as any}>
      <View style={{ backgroundColor: '#000', borderRadius: 12, padding: 14, marginHorizontal: 16, marginBottom: 12, gap: 12 } as any}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 } as any}>
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.secondaryGreen, alignItems: 'center', justifyContent: 'center' }}>
            {/* TODO(BE): nudge.iconType */}
            <Camera size={18} color="#fff" />
          </View>
          <Text variant="mobileLabelEmphasized" style={{ color: '#fff' }}>Get a site photo</Text>
        </View>
        {/* TODO(BE): nudge.description */}
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

/** Full-featured input bar — normal layout flow, sits naturally above keyboard */
function ChatInputFull({
  value,
  inputRef,
  onChangeText,
  onFocus,
  onPhysicalKeyPress,
  onSend,
  nudgeAnim,
  onHashNudgePress,
  showHomeIndicator = false,
}: {
  value: string;
  inputRef: React.RefObject<any>;
  onChangeText: (text: string) => void;
  onFocus: () => void;
  onPhysicalKeyPress: (key: string) => void;
  onSend: () => void;
  nudgeAnim?: Animated.Value;
  onHashNudgePress?: () => void;
  showHomeIndicator?: boolean;
}) {
  const sendActive = value.length > 0;

  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 } as any}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 } as any}>
          <View style={{ width: 40, height: 40, backgroundColor: TTTheme.colors.grey02, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Plus size={20} color={TTTheme.colors.textPrimary} />
          </View>
          {/* "#" button — interactive + animated when nudge active */}
          <Pressable onPress={onHashNudgePress} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' } as any}>
            <Animated.View style={{ position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: TTTheme.colors.secondaryGreen, opacity: nudgeAnim ?? 0, transform: [{ scale: nudgeAnim ? nudgeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) : 1 }] } as any} />
            <Animated.View style={{ position: 'absolute', opacity: nudgeAnim ?? 0 } as any}>
              <Hash size={20} color="#fff" />
            </Animated.View>
            <Animated.View style={{ opacity: nudgeAnim ? nudgeAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) : 1 } as any}>
              <Hash size={20} color={TTTheme.colors.textPrimary} />
            </Animated.View>
          </Pressable>
          {[Camera, ImageIcon, MapPin, Mic].map((Icon, i) => (
            <View key={i} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={20} color={TTTheme.colors.textPrimary} />
            </View>
          ))}
        </View>
        <Pressable onPress={sendActive ? onSend : undefined}>
          <View style={{ width: 40, height: 40, backgroundColor: sendActive ? '#000' : TTTheme.colors.grey05, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
      {showHomeIndicator && (
        <View style={{ height: 28, alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 9 }}>
          <View style={{ width: 134, height: 5, backgroundColor: TTTheme.colors.textPrimary, borderRadius: 5 }} />
        </View>
      )}
    </View>
  );
}

/** Minimal input bar — used when keyboard is dismissed */
function ChatInputMinimal() {
  return (
    <View style={{ backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: TTTheme.colors.border, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, gap: 6 }}>
        <View style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} color={TTTheme.colors.textPrimary} />
        </View>
        <Text variant="mobileBody" color="grey05" style={{ flex: 1 }}>Type message here...</Text>
        <View style={{ flexDirection: 'row', gap: 6 } as any}>
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

export function Case6Screen({ onComplete }: { onComplete?: (sentMessage: string) => void } = {}) {
  const [phase, setPhase]         = useState<Phase>('empty');
  const [messageText, setMessageText] = useState('');
  const [sentMessage, setSentMessage] = useState('');
  const [pressedKey, setPressedKey]   = useState<string | null>(null);
  const [nudgeVisible, setNudgeVisible] = useState(false);

  const inputRef       = useRef<any>(null);
  const messageTextRef = useRef('');
  const keyTimerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sheet slides up on mount
  const sheetAnim     = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = sheetAnim.interpolate({ inputRange: [0, 1], outputRange: [300, 0] });

  // Nudge card + "#" highlight fade in when nudge phase starts
  const nudgeAnim = useRef(new Animated.Value(0)).current;

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
      setNudgeVisible(false);
      const t = setTimeout(() => setPhase('nudge'), 2000);
      return () => clearTimeout(t);
    }
    if (phase === 'nudge') {
      nudgeAnim.setValue(0);
      setNudgeVisible(false);
      const t = setTimeout(() => {
        setNudgeVisible(true);
        Animated.timing(nudgeAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
        inputRef.current?.blur();
      }, 150);
      return () => clearTimeout(t);
    } else {
      setNudgeVisible(false);
      nudgeAnim.setValue(0);
    }
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFocus = () => {};

  const handleChangeText = (text: string) => {
    messageTextRef.current = text;
    setMessageText(text);
    if (phase === 'empty') {
      setPhase('typing');
      Animated.timing(tooltipAnim, { toValue: 0, duration: 2000, delay: 400, useNativeDriver: true }).start();
    }
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
    if (phase !== 'empty' && phase !== 'typing') return;

    const nextSentMessage = messageTextRef.current.trim();
    if (!nextSentMessage) return;

    setSentMessage(nextSentMessage);
    setMessageText('');
    messageTextRef.current = '';
    setPhase('sent');
  };

  const handleHashNudgePress = () => {
    if (!sentMessage) return;
    onComplete?.(sentMessage);
  };

  const showKeyboard = phase === 'empty' || phase === 'typing';
  const showMessages = phase === 'sent' || phase === 'nudge';

  return (
    <Box flex={1} backgroundColor="white">

      {/* ── Status bar + chat header ── */}
      <View style={{ zIndex: 10, backgroundColor: '#fff' } as any}>
        <StatusBarRow />
        <ChatHeader />
      </View>

      {/* ── Message area — flex:1 shrinks/grows naturally as input below changes size ── */}
      <Box flex={1} style={{ paddingTop: 16, paddingBottom: 8, gap: 16, justifyContent: 'flex-end' } as any}>
        <DateSeparator label="Friday, May 22" />
        <CarlosMessage taskAssigned />
        {showMessages && (
          <MyMessage
            text={sentMessage}
            showCelebration={phase === 'sent'}
          />
        )}
        {nudgeVisible && <GetSitePhotoNudge anim={nudgeAnim} onSend={() => onComplete?.(sentMessage)} />}
      </Box>

      {/* ── Tooltip "Start a Conversation" — absolute overlay, sits just above chat input ── */}
      {showKeyboard && (
        <OnboardingTooltip
          title="Start a Conversation"
          description="You can add files, media, and tasks anytime from here."
          style={{ bottom: 417, left: 31, zIndex: 43 }}
          arrowEdge="bottom" arrowSide="left" arrowInset={24}
          anim={tooltipAnim}
        />
      )}

      {/* ── Input area — normal flow, message area above shrinks/grows to fit ── */}
      {phase === 'sent' || phase === 'nudge' ? (
        <ChatInputMinimal />
      ) : (
        <Animated.View style={{ transform: [{ translateY: sheetTranslateY }] } as any}>
          <ChatInputFull
            value={messageText}
            inputRef={inputRef}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onPhysicalKeyPress={handlePhysicalKeyPress}
            onSend={handleSend}
          />
          {/* height:291 placeholder keeps MockKeyboard in normal flow;
              MockKeyboard itself is position:absolute so it renders inside this box */}
          <View style={{ height: 291 }}>
            <MockKeyboard pressedKey={pressedKey} onKeyTap={handleKeyTap} />
          </View>
        </Animated.View>
      )}

    </Box>
  );
}
