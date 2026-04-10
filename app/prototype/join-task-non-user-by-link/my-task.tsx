import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Box, Text } from '@/components/primitives';
import { TextInput as DSTextInput } from '@/components/TextInput';
import { Tooltip as DSTooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  AlertTriangle,
  ArrowDownUp,
  Building2,
  Calendar,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronRight,
  Equal,
  Eye,
  EyeOff,
  FileText,
  FileImage,
  Folder,
  HardHat,
  Hash,
  HelpCircle,
  Image as ImageIcon,
  Images,
  Link,
  ListChecks,
  ListFilter,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Search,
  Upload,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, TextInput as RNTextInput, View } from 'react-native';
import ReactDOM from 'react-dom';

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: true },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

// ── Project config (icon + color per project) ─────────────────────────────────
const PROJECT_CONFIG: Record<string, { Icon: any; color: string }> = {
  'Electrical Board Service':   { Icon: Zap,       color: '#ff4444' },
  '11 N Raintree Hollow Court': { Icon: Building2, color: '#1572a1' },
  'LA Avenue 37 D':             { Icon: Building2, color: '#1572a1' },
  'LA Avenue 34 G':             { Icon: Zap,       color: '#ff4444' },
};

// ── People (initial avatars) ──────────────────────────────────────────────────
const PEOPLE = [
  { initials: 'JL', color: '#a85796' },
  { initials: 'AS', color: '#e6b566' },
  { initials: 'OH', color: '#cc7351' },
];

// ── Task type ─────────────────────────────────────────────────────────────────
type Task = {
  id: number;
  name: string;
  project: string;
  items: number | null;
  priority: string;
  date: string;
  people: number[];
  extra?: number;
  assigneeLabel: string | null;
};

// ── Task data ─────────────────────────────────────────────────────────────────
const INITIAL_CURRENT_TASKS: Task[] = [
  { id: 1, name: 'Ensure all components within the electric...', project: 'Electrical Board Service', items: null, priority: 'high', date: 'Oct 18', people: [], assigneeLabel: 'Assignee' },
  { id: 2, name: 'Fix the sink', project: '11 N Raintree Hollow Court', items: 3, priority: 'high', date: 'Oct 18', people: [0], assigneeLabel: null },
  { id: 3, name: 'Install new door locks', project: '11 N Raintree Hollow Court', items: 5, priority: 'low', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
  { id: 4, name: 'Paint the living room', project: 'LA Avenue 37 D', items: 5, priority: 'medium', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
  { id: 5, name: 'Repair the leaky roof', project: 'LA Avenue 34 G', items: 4, priority: 'high', date: 'Oct 18', people: [0, 1], assigneeLabel: null },
  { id: 6, name: 'Replace light bulbs', project: 'LA Avenue 34 G', items: 3, priority: 'high', date: 'Oct 18', people: [0, 1, 2], extra: 2, assigneeLabel: null },
  { id: 7, name: 'Service the air conditioner', project: 'LA Avenue 34 G', items: null, priority: 'high', date: 'Oct 18', people: [0, 1], assigneeLabel: null },
  { id: 8, name: 'Unclog the bathroom drain', project: '11 N Raintree Hollow Court', items: 3, priority: 'medium', date: 'Oct 18', people: [0, 1, 2], assigneeLabel: null },
];

const OVERDUE_TASKS: Task[] = [
  { id: 101, name: 'Check electrical panel connections', project: 'Electrical Board Service', items: 2, priority: 'high', date: 'Oct 10', people: [0, 1], assigneeLabel: null },
  { id: 102, name: 'Patch ceiling damage', project: '11 N Raintree Hollow Court', items: 3, priority: 'medium', date: 'Oct 12', people: [0], assigneeLabel: null },
  { id: 103, name: 'Replace broken window seal', project: 'LA Avenue 37 D', items: null, priority: 'low', date: 'Oct 14', people: [0, 1, 2], assigneeLabel: null },
];

const INITIAL_COMPLETED_TASKS: Task[] = [
  { id: 201, name: 'Update door hinges', project: 'LA Avenue 34 G', items: null, priority: 'low', date: 'Oct 5', people: [0], assigneeLabel: null },
  { id: 202, name: 'Clean gutters', project: '11 N Raintree Hollow Court', items: 2, priority: 'medium', date: 'Oct 8', people: [0, 1], assigneeLabel: null },
];

// ── Signup invite data ────────────────────────────────────────────────────────
const INVITE = {
  inviterName: 'James Hammer',
  taskName: 'Install Sink and Faucet in Kitchen',
  projectName: 'Raintree Hollow Court Renovation',
  role: 'Assignee',
  email: 'newuser@example.com',
};
const REGISTERED_EMAILS: string[] = [];

// ── Local CopyLink Tooltip (matches team-detail style) ────────────────────────
function CopyLinkTooltip({
  label,
  children,
  variant = 'default',
  forceOpen = false,
  align = 'right',
}: {
  label: string;
  children: React.ReactNode;
  variant?: 'default' | 'success';
  forceOpen?: boolean;
  align?: 'left' | 'right';
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
          <Text numberOfLines={1} style={{ color: theme.colors.textSecondary, fontSize: 14, fontWeight: '400', whiteSpace: 'nowrap' as any }}>{label}</Text>
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
      {visible && pos && (Platform.OS === 'web' ? ReactDOM.createPortal(
        <View style={{ position: 'fixed' as any, top: pos.top, ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }), zIndex: 999999, pointerEvents: 'none' }}>
          {tooltipBox}
        </View>,
        document.body
      ) : null)}
    </>
  );
}

// ── Priority badge ─────────────────────────────────────────────────────────────
function PriorityBadge({ priority }: { priority: string }) {
  const theme = useTheme<Theme>();
  const config = {
    high:   { color: theme.colors.alertRed,       Icon: ChevronsUp },
    medium: { color: '#f59e0b',                   Icon: Equal },
    low:    { color: theme.colors.blue,           Icon: ChevronsDown },
  }[priority] ?? { color: theme.colors.grey04, Icon: Equal };
  return (
    <Box width={36} height={36} borderRadius="full" alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border }}>
      <config.Icon size={16} color={config.color} />
    </Box>
  );
}

// ── Date badge ────────────────────────────────────────────────────────────────
function DateBadge({ date }: { date: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
      <Calendar size={14} color={theme.colors.grey06} />
      <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>{date}</Text>
    </Box>
  );
}

// ── Assignee badge ────────────────────────────────────────────────────────────
function AssigneeBadge() {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
      <UserPlus size={14} color={theme.colors.grey06} />
      <Text variant="webMetadataPrimary" style={{ color: theme.colors.textSecondary }}>Assignee</Text>
    </Box>
  );
}

// ── Initial avatars ───────────────────────────────────────────────────────────
function InitialAvatars({ indices, extra }: { indices: number[]; extra?: number }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" style={{ minWidth: 108 }}>
      {indices.map((idx, i) => {
        const person = PEOPLE[idx % PEOPLE.length];
        return (
          <Box
            key={i}
            borderRadius="full"
            style={{ marginLeft: i > 0 ? -8 : 0, zIndex: indices.length - i, borderWidth: 1.5, borderColor: theme.colors.background }}
          >
            <Avatar size="sm" type="text" initials={person.initials} color={person.color} />
          </Box>
        );
      })}
      {extra && extra > 0 && (
        <Box width={32} height={32} borderRadius="full" backgroundColor="grey03" alignItems="center" justifyContent="center" style={{ marginLeft: -8, zIndex: 0, borderWidth: 1.5, borderColor: theme.colors.background }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.grey06 }}>+{extra}</Text>
        </Box>
      )}
    </Box>
  );
}

// ── Task Row ──────────────────────────────────────────────────────────────────
function TaskRow({ task, onComplete, completed = false }: { task: Task; onComplete?: () => void; completed?: boolean }) {
  const theme = useTheme<Theme>();
  const [isChecked, setIsChecked] = useState(completed);
  const [checkHovered, setCheckHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const projConfig = PROJECT_CONFIG[task.project] ?? { Icon: Building2, color: theme.colors.grey04 };

  const handlePress = () => {
    if (completed || isChecked) return;
    setIsChecked(true);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -6, duration: 280, useNativeDriver: true }),
    ]).start(() => { onComplete?.(); });
  };

  const handleCopyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Box
        flexDirection="row"
        alignItems="center"
        borderTopWidth={1}
        borderColor="border"
        style={{ minHeight: 52, paddingHorizontal: 16, paddingVertical: 8, gap: 16 }}
      >
        {/* Checkbox */}
        <Pressable
          onPress={handlePress}
          {...(Platform.OS === 'web' && !completed ? {
            onMouseEnter: () => setCheckHovered(true),
            onMouseLeave: () => setCheckHovered(false),
          } : {})}
          style={{
            width: 20, height: 20, borderRadius: 10,
            borderWidth: 1.5,
            borderColor: isChecked ? theme.colors.secondaryGreen : theme.colors.grey04,
            alignItems: 'center', justifyContent: 'center',
            backgroundColor: isChecked ? theme.colors.secondaryGreen : checkHovered ? theme.colors.grey03 : 'transparent',
            flexShrink: 0,
            ...Platform.select({ web: { cursor: completed ? 'default' : 'pointer' } as any }),
          }}
        >
          {(isChecked || checkHovered) && (
            <Check size={11} color={isChecked ? '#fff' : theme.colors.grey05} />
          )}
        </Pressable>

        {/* Name + project */}
        <Box flex={1} style={{ gap: 4, minWidth: 0 }}>
          <Text
            variant="webSecondaryBody"
            numberOfLines={1}
            style={{ color: theme.colors.foreground, ...(completed ? { textDecorationLine: 'line-through', opacity: 0.5 } : {}) }}
          >
            {task.name}
          </Text>
          <Box flexDirection="row" alignItems="center" gap="4">
            <projConfig.Icon size={11} color={projConfig.color} />
            <Text variant="webMetadataSecondary" style={{ color: theme.colors.grey05 }} numberOfLines={1}>{task.project}</Text>
            {task.items && (
              <Box flexDirection="row" alignItems="center" gap="4">
                <ListChecks size={10} color={theme.colors.grey06} />
                <Text variant="webMetadataSecondary" style={{ color: theme.colors.textSecondary, textDecorationLine: 'underline' }}>{task.items} items</Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* Priority */}
        <PriorityBadge priority={task.priority} />

        {/* Date */}
        <DateBadge date={task.date} />

        {/* Assignees */}
        {task.assigneeLabel ? (
          <AssigneeBadge />
        ) : (
          <InitialAvatars indices={task.people} extra={task.extra} />
        )}

        {/* Link with tooltip */}
        <CopyLinkTooltip label={copied ? 'Link copied!' : 'Copy link'} variant={copied ? 'success' : 'default'} forceOpen={copied} align="right">
          <Pressable
            onPress={handleCopyLink}
            style={({ hovered, pressed }: any) => ({
              width: 32, height: 32, borderRadius: 6,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
              cursor: 'pointer' as any,
            })}
          >
            <Link size={16} color={theme.colors.grey06} />
          </Pressable>
        </CopyLinkTooltip>
      </Box>
    </Animated.View>
  );
}

// ── Section card ──────────────────────────────────────────────────────────────
function SectionCard({
  label, count, color, bgColor, expanded, onToggle, children,
}: {
  label: string; count?: number; color?: string; bgColor?: string;
  expanded: boolean; onToggle: () => void; children?: React.ReactNode;
}) {
  const theme = useTheme<Theme>();
  const labelColor = color ?? theme.colors.foreground;
  const badgeBg = bgColor ?? theme.colors.grey02;
  const badgeText = color ?? theme.colors.grey05;

  return (
    <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, overflow: 'hidden' as any }}>
      <Pressable onPress={onToggle}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
          <Box flexDirection="row" alignItems="center" gap="8">
            <Text style={{ fontSize: 14, fontWeight: '600', color: labelColor }}>{label}</Text>
            {count !== undefined && (
              <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: badgeBg }}>
                <Text style={{ fontSize: 11, color: badgeText, fontWeight: '500' }}>{count}</Text>
              </Box>
            )}
          </Box>
          {expanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
        </Box>
      </Pressable>
      {expanded && children}
    </Box>
  );
}

// ── Signup Modal (duplicated from join-task-non-user/join-tasktag-signup) ─────
function JoinTasktagSignup({ onClose, onSuccess }: { onClose?: () => void; onSuccess?: () => void }) {
  const theme = useTheme<Theme>();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const passwordRef = useRef<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasTouchedPassword, setHasTouchedPassword] = useState(false);
  const [hasTypedPassword, setHasTypedPassword] = useState(false);
  const [isGoogleHovered, setIsGoogleHovered] = useState(false);
  const [isAppleHovered, setIsAppleHovered] = useState(false);

  useEffect(() => {
    if (password.length > 0) {
      setHasTypedPassword(true);
      if (passwordError === 'Password is required.') setPasswordError('');
    } else if (hasTypedPassword && password === '') {
      setPasswordError('Password is required.');
    }
  }, [password, hasTypedPassword, passwordError]);

  const validLength = password.length >= 8;
  const validNumber = /\d/.test(password);
  const validUppercase = /[A-Z]/.test(password);
  const validSpecial = /[!@#$%^&*]/.test(password);

  const emailError = REGISTERED_EMAILS.includes(INVITE.email)
    ? 'This email is already registered. Please log in instead.'
    : '';

  const isFormValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    password.trim() !== '' &&
    validLength && validNumber && validUppercase && validSpecial &&
    !emailError;

  const handleSubmit = () => {
    let valid = true;
    if (!firstName.trim()) { setFirstNameError('First name is required.'); valid = false; } else { setFirstNameError(''); }
    if (!lastName.trim()) { setLastNameError('Last name is required.'); valid = false; } else { setLastNameError(''); }
    if (!password) { setPasswordError('Password is required.'); valid = false; }
    else if (password.length < 8 || !/\d/.test(password) || !/[A-Z]/.test(password) || !/[!@#$%^&*]/.test(password)) { setPasswordError('Invalid password'); valid = false; }
    else { setPasswordError(''); }
    if (!valid || emailError) return;
    onSuccess?.();
  };

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  });

  const cardContent = (
    <>
      <Text variant="h2" textAlign="center" marginBottom="4">Create an account</Text>
      <Box flexDirection="row" justifyContent="center" flexWrap="wrap" marginBottom="16">
        <Text variant="webMetadataPrimary" color="mutedForeground">{"You're assigned a task by "}</Text>
        <Text variant="webMetadataPrimary" color="foreground" fontWeight="700">{INVITE.inviterName}</Text>
      </Box>

      {/* Context banner */}
      <Box backgroundColor="lightMint" alignItems="flex-start" padding="md" borderRadius="xl" marginBottom="lg" width="100%" position="relative" zIndex="10">
        <Text variant="webLabelEmphasized" style={{ marginBottom: 4 }}>{INVITE.taskName}</Text>
        <Box flexDirection="row" alignItems="center" gap="4" marginBottom="16">
          <Text variant="webSecondaryBody" color="mutedForeground">{INVITE.projectName}</Text>
        </Box>
        <Box flexDirection="row" alignItems="center" gap="4">
          <Text variant="webSecondaryBody" color="mutedForeground">Your Role : </Text>
          <DSTooltip
            variant="bottom-left"
            content={
              <View style={{ gap: 4 }}>
                {['View and manage tasks', 'Collaborate with team', 'Upload files & media', 'Track task progress'].map((item, i) => (
                  <Text key={i} style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular' }}>{'• '}{item}</Text>
                ))}
              </View>
            }
          >
            <Box borderBottomWidth={1} borderColor="foreground" style={{ borderStyle: 'dotted' }}>
              <Text variant="webSecondaryBody" color="foreground" fontWeight="700">Assignee</Text>
            </Box>
          </DSTooltip>
        </Box>
      </Box>

      {/* Social sign-in */}
      <Box marginBottom="lg" alignItems="center">
        <Box flexDirection="row" gap="md" width="100%" marginBottom="20">
          <Pressable
            onHoverIn={() => setIsGoogleHovered(true)}
            onHoverOut={() => setIsGoogleHovered(false)}
            style={({ pressed }) => [{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              height: 52, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
              backgroundColor: isGoogleHovered ? theme.colors.grey01 : theme.colors.card,
              gap: 12, opacity: pressed ? 0.8 : 1,
            } as any, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
          >
            <Image source={require('@/assets/images/google-logo.svg')} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
            <Text variant="labelMedium" color="foreground">Google</Text>
          </Pressable>
          <Pressable
            onHoverIn={() => setIsAppleHovered(true)}
            onHoverOut={() => setIsAppleHovered(false)}
            style={({ pressed }) => [{
              flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
              height: 52, borderRadius: 8, borderWidth: 1, borderColor: theme.colors.border,
              backgroundColor: isAppleHovered ? theme.colors.grey01 : theme.colors.card,
              gap: 12, opacity: pressed ? 0.8 : 1,
            } as any, Platform.OS === 'web' && { cursor: 'pointer' } as any]}
          >
            <Image source={require('@/assets/images/apple-logo.svg')} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
            <Text variant="labelMedium" color="foreground">Apple</Text>
          </Pressable>
        </Box>
        <Box flexDirection="row" alignItems="center" width="100%" gap="12">
          <Box flex={1} height={1} backgroundColor="border" />
          <Text variant="webMetadataPrimary" color="mutedForeground">or continue with email</Text>
          <Box flex={1} height={1} backgroundColor="border" />
        </Box>
      </Box>

      <Box marginBottom="md">
        <Box marginBottom="24">
          <DSTextInput label="Email" value={INVITE.email} disabled showClearButton={false} errorMessage={emailError} />
          <Text variant="webMetadataSecondary" color="mutedForeground" style={{ marginTop: -8 }}>
            A verification email will be sent to you to verify your address.
          </Text>
        </Box>
        <Box flexDirection="row" gap="md" marginBottom="12">
          <Box flex={1}>
            <DSTextInput label="First Name" placeholder="e.g. John" value={firstName} onChangeText={setFirstName} errorMessage={firstNameError} />
          </Box>
          <Box flex={1}>
            <DSTextInput label="Last Name" placeholder="e.g. Doe" value={lastName} onChangeText={setLastName} errorMessage={lastNameError} />
          </Box>
        </Box>
        <Box width="100%">
          <Text variant="labelMedium" marginBottom="sm" color={passwordError ? 'alertRed' : 'textPrimary'}>Password</Text>
          <Box
            flexDirection="row" alignItems="center"
            borderWidth={1} borderColor={passwordError ? 'alertRed' : isPasswordFocused ? 'black' : 'border'}
            borderRadius="8" backgroundColor="inputBackground"
            minHeight={theme.componentSizes.md} paddingHorizontal="12" paddingVertical="8"
          >
            <RNTextInput
              ref={passwordRef}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.grey04}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => { setIsPasswordFocused(true); setHasTouchedPassword(true); }}
              onBlur={() => setIsPasswordFocused(false)}
              style={{ flex: 1, fontSize: 16, color: theme.colors.foreground, fontFamily: 'Inter_400Regular', ...Platform.select({ web: { outline: 'none' } as any }) }}
            />
            <Pressable onPress={() => { setShowPassword(v => !v); setTimeout(() => passwordRef.current?.focus(), 10); }} style={{ padding: theme.spacing['4'], marginLeft: theme.spacing['8'] }}>
              {showPassword ? <Eye size={18} color={theme.colors.grey05} /> : <EyeOff size={18} color={theme.colors.grey05} />}
            </Pressable>
          </Box>
          {passwordError ? (
            <Box flexDirection="row" alignItems="center" gap="4" marginTop="4">
              <AlertTriangle size={14} color={theme.colors.alertRed} />
              <Text variant="caption" color="alertRed">{passwordError}</Text>
            </Box>
          ) : null}
          {(isPasswordFocused || hasTouchedPassword) && (
            <Box gap="4" marginTop="12">
              <Text variant="webMetadataPrimary" color="textSecondary">Your password must contain:</Text>
              {[
                { label: 'At least 8 characters', valid: validLength },
                { label: 'At least 1 number (0-9)', valid: validNumber },
                { label: 'At least 1 uppercase letter (A-Z)', valid: validUppercase },
                { label: 'At least 1 special character (e.g. !@#$%^&*)', valid: validSpecial },
              ].map((rule, idx) => (
                <Box key={idx} flexDirection="row" alignItems="center" gap="4">
                  {rule.valid ? <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={3} /> : <Text variant="webMetadataPrimary" color="textSecondary">{'•'}</Text>}
                  <Text variant="webMetadataPrimary" color={rule.valid ? 'secondaryGreen' : 'textSecondary'}>{rule.label}</Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      <Box marginBottom="16">
        <Text variant="webMetadataSecondary" style={{ lineHeight: 16 }}>
          {'By signing up, I agree to the TaskTag '}
          <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Terms and Conditions</Text>
          {' and '}
          <Text variant="webMetadataSecondary" color="primary" fontWeight="500">Privacy Policy</Text>
          {'.'}
        </Text>
      </Box>

      <Button
        variant="fill" color="primary" size="lg"
        style={{ width: '100%', backgroundColor: isFormValid ? theme.colors.foreground : theme.colors.grey03 }}
        onPress={handleSubmit} disabled={!isFormValid}
      >
        Join This Task
      </Button>

      <Box marginTop="16" alignItems="center">
        <Text variant="webMetadataPrimary" color="textSecondary">
          Already have an account?{' '}
          <Text variant="webMetadataPrimary" color="secondaryGreen" fontWeight="600" style={{ cursor: 'pointer' } as any}>Log in</Text>
        </Text>
      </Box>
    </>
  );

  return (
    <Box style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.lg }}>
      <Box
        backgroundColor="card" width="100%" maxWidth={600} borderRadius="16"
        style={[shadowStyle, { flex: 1, maxHeight: '100%', overflow: 'hidden' as any, position: 'relative' as any }]}
      >
        <Pressable onPress={onClose} style={{ position: 'absolute' as any, top: 16, right: 16, zIndex: 10, cursor: 'pointer' } as any}>
          <X size={20} color={theme.colors.grey06} />
        </Pressable>
        <ScrollView contentContainerStyle={{ padding: 24 }}>
          {cardContent}
        </ScrollView>
      </Box>
    </Box>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggleCollapsed }: { collapsed: boolean; onToggleCollapsed: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Box backgroundColor="grey01" borderRightWidth={1} borderColor="border" style={{ width: collapsed ? 72 : 256, height: '100%' as any, paddingHorizontal: 16, paddingVertical: 24, gap: 30, flexShrink: 0 }}>
      {collapsed ? (
        <Box alignItems="center" gap="8">
          <Image source={require('@/assets/images/tt-favicon.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}><ChevronsRight size={20} color={theme.colors.grey04} /></Pressable>
        </Box>
      ) : (
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Image source={require('@/assets/images/tasktag-logo.png')} style={{ width: 96, height: 24 }} resizeMode="contain" />
          <Pressable onPress={onToggleCollapsed} hitSlop={8}><ChevronsLeft size={24} color={theme.colors.grey04} /></Pressable>
        </Box>
      )}
      <Box flex={1} style={{ paddingTop: 16 }}>
        <Box flex={1} justifyContent="space-between">
          <Box gap="8">
            {NAV_ITEMS.map(({ key, label, Icon, active }) =>
              collapsed ? (
                <Box key={key} alignItems="center" justifyContent="center" style={{ height: 54 }}>
                  <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: active ? theme.colors.lightMint : theme.colors.card }}>
                    <Icon size={22} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                  </Box>
                </Box>
              ) : (
                <Box key={key} flexDirection="row" alignItems="center" gap="16" style={{ height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15, backgroundColor: active ? theme.colors.lightMint : 'transparent' }}>
                  <Icon size={24} color={active ? theme.colors.secondaryGreen : theme.colors.textSecondary} />
                  <Text variant="labelMedium" style={{ color: active ? theme.colors.secondaryGreen : theme.colors.textSecondary }}>{label}</Text>
                </Box>
              )
            )}
          </Box>
          <Box gap="8">
            {!collapsed && (
              <Box style={{ paddingBottom: 40 }}>
                <Box backgroundColor="card" style={{ borderRadius: 8, padding: 16, overflow: 'hidden' as any, position: 'relative' as any }}>
                  <Box style={{ position: 'absolute' as any, width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(0,217,165,0.25)', top: -36, left: -36, ...Platform.select({ web: { filter: 'blur(18px)' } as any }) }} />
                  <Box style={{ position: 'absolute' as any, width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(0,217,165,0.2)', bottom: -60, right: -30, ...Platform.select({ web: { filter: 'blur(22px)' } as any }) }} />
                  <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.textSecondary, lineHeight: 24, marginBottom: 16 }}>Find All Product Guides Here</Text>
                  <Box flexDirection="row" alignItems="center" gap="4">
                    <Text style={{ fontSize: 16, fontWeight: '500', color: theme.colors.secondaryGreen, lineHeight: 24 }}>Explore</Text>
                    <ChevronRight size={18} color={theme.colors.secondaryGreen} />
                  </Box>
                </Box>
              </Box>
            )}
            <Box height={1} backgroundColor="border" />
            {collapsed ? (
              <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.card }}>
                  <HelpCircle size={22} color={theme.colors.textSecondary} />
                </Box>
              </Box>
            ) : (
              <Box flexDirection="row" alignItems="center" gap="16" style={{ height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                <HelpCircle size={24} color={theme.colors.textSecondary} />
                <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>Help</Text>
              </Box>
            )}
            {collapsed ? (
              <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                </Box>
              </Box>
            ) : (
              <Box flexDirection="row" alignItems="center" gap="8" style={{ height: 54, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 15 }}>
                <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                  <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                </Box>
                <Text variant="labelMedium" style={{ color: theme.colors.textSecondary }}>My Profile</Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ── Task Detail Panel ─────────────────────────────────────────────────────────
type ChecklistItem = { id: number; label: string; checked: boolean };

function TaskDetailPanel({ onJoin }: { onJoin: () => void }) {
  const theme = useTheme<Theme>();
  const [checklistExpanded, setChecklistExpanded] = useState(true);
  const [filesExpanded, setFilesExpanded] = useState(false);
  const [assigneeExpanded, setAssigneeExpanded] = useState(false);
  const [activityExpanded, setActivityExpanded] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 1, label: 'Remove old sink and faucet', checked: false },
  ]);

  const toggleCheck = (id: number) => {
    setChecklistItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const visibleItems = showCompleted ? checklistItems : checklistItems.filter(i => !i.checked);

  return (
    <Box
      backgroundColor="card"
      borderLeftWidth={1}
      borderColor="border"
      style={{ position: 'absolute' as any, top: 0, bottom: 0, right: 550, width: 580, zIndex: 30, overflow: 'hidden' as any }}
    >
      {/* ── Fixed Top Section ── */}
      <Box>
        {/* Header */}
        <Box
          flexDirection="row" alignItems="center" justifyContent="space-between"
          style={{ paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: theme.colors.border }}
        >
          <Box flexDirection="row" alignItems="center" gap="4" flex={1} flexShrink={1} style={{ minWidth: 0 }}>
            <Pressable style={{ padding: 4 }}>
              <Box flexDirection="row" alignItems="center" gap="4">
                <HardHat size={14} color={theme.colors.purple} />
                <Text
                  numberOfLines={1}
                  style={{ color: theme.colors.textSecondary, textDecorationLine: 'underline', flexShrink: 1, fontSize: 12, fontWeight: '500', fontFamily: 'Inter_500Medium' }}
                >
                  {'Raintree Hollow Court Renovation'.length > 20 ? 'Raintree Hollow Court Renovation'.substring(0, 20) + '...' : 'Raintree Hollow Court Renovation'}
                </Text>
              </Box>
            </Pressable>
          </Box>
          <Box flexDirection="row" alignItems="center" gap="4">
            <Pressable style={({ hovered }: any) => ({ padding: 6, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
              <Link size={16} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={({ hovered }: any) => ({ padding: 6, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
              <MoreVertical size={16} color={theme.colors.textSecondary} />
            </Pressable>
            <Pressable style={({ hovered }: any) => ({ padding: 6, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
              <X size={16} color={theme.colors.textSecondary} />
            </Pressable>
          </Box>
        </Box>

        {/* Task name */}
        <Box style={{ paddingHorizontal: 24, paddingTop: 16 }}>
          <Box style={{ paddingVertical: 4 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.textSecondary, lineHeight: 24, fontFamily: 'Inter_500Medium' }}>
              Install Sink and Faucet in Kitchen
            </Text>
          </Box>
        </Box>

        {/* Action row */}
        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24, gap: 8, flexWrap: 'wrap' as any }}>
          {/* Mark Complete */}
          <Pressable
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 6,
              borderWidth: 1, borderColor: theme.colors.secondaryGreen,
              borderRadius: 40, paddingHorizontal: 12,
              height: 32, justifyContent: 'center',
              backgroundColor: pressed ? '#e6f7f2' : hovered ? theme.colors.lightMint : 'transparent',
              ...Platform.select({ web: { cursor: 'pointer' } as any }),
            })}
          >
            <Check size={12} color={theme.colors.secondaryGreen} strokeWidth={2.5} />
            <Text style={{ fontSize: 12, fontWeight: '500', color: theme.colors.secondaryGreen, fontFamily: 'Inter_500Medium' }}>
              Mark Complete
            </Text>
          </Pressable>

          {/* Priority icon-only pill */}
          <Pressable
            style={({ pressed, hovered }: any) => ({
              paddingHorizontal: 8,
              height: 32, borderRadius: 40,
              borderWidth: 1, borderColor: theme.colors.border,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: pressed ? theme.colors.grey02 : hovered ? theme.colors.grey01 : 'transparent',
              ...Platform.select({ web: { cursor: 'pointer' } as any }),
            })}
          >
            <ChevronsUp size={14} color={theme.colors.orange} />
          </Pressable>

          {/* Date pill */}
          <Pressable
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 6,
              borderWidth: 1, borderColor: theme.colors.border,
              borderRadius: 40, paddingHorizontal: 12,
              height: 32, justifyContent: 'center',
              backgroundColor: pressed ? theme.colors.grey02 : hovered ? theme.colors.grey01 : 'transparent',
              ...Platform.select({ web: { cursor: 'pointer' } as any }),
            })}
          >
            <Calendar size={12} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: '400', color: theme.colors.textSecondary, fontFamily: 'Inter_400Regular' }}>
              Oct 15 - 18
            </Text>
          </Pressable>

          {/* Assignee pill */}
          <Pressable
            style={({ pressed, hovered }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 6,
              borderWidth: 1, borderColor: theme.colors.border,
              borderRadius: 40, paddingHorizontal: 12,
              height: 32, justifyContent: 'center',
              backgroundColor: pressed ? theme.colors.grey02 : hovered ? theme.colors.grey01 : 'transparent',
              ...Platform.select({ web: { cursor: 'pointer' } as any }),
            })}
          >
            <UserPlus size={12} color={theme.colors.textSecondary} />
            <Text style={{ fontSize: 12, fontWeight: '400', color: theme.colors.textSecondary, fontFamily: 'Inter_400Regular' }}>
              Assignee
            </Text>
          </Pressable>
        </Box>

        {/* Description section (Fixed) */}
        <Box style={{ paddingHorizontal: 24, paddingBottom: 24 }}>
          <Box style={{ backgroundColor: theme.colors.grey02, borderRadius: 8, overflow: 'hidden' as any }}>
            <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingHorizontal: 16, paddingTop: 16 }}>
              <Box flexDirection="row" alignItems="center" gap="8">
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, fontFamily: 'Inter_600SemiBold' }}>Description</Text>
              </Box>
            </Box>
            <Box style={{ paddingLeft: 16, paddingRight: 16, paddingBottom: 16, paddingTop: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: '400', color: theme.colors.textSecondary, lineHeight: 16, fontFamily: 'Inter_400Regular' }}>
                Complete the installation of the kitchen sink and faucet, ensuring all plumbing connections are secure, leak-free, and fully functional as part of the Raintree renovation.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Scrollable Bottom Section ── */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Box style={{ paddingHorizontal: 24, paddingVertical: 0, gap: 24 }}>

          {/* Checklist section */}
          <Box style={{ overflow: 'hidden' as any }}>
            {/* Checklist header */}
            <Pressable
              onPress={() => setChecklistExpanded(v => !v)}
              style={({ hovered }: any) => ({ borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : 'transparent' })}
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 52, paddingLeft: 16, paddingRight: 16 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Box width={24} height={24} alignItems="center" justifyContent="center">
                    <FileText size={20} color={theme.colors.textSecondary} />
                  </Box>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, fontFamily: 'Inter_600SemiBold' }}>Checklist</Text>
                </Box>
                {checklistExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
              </Box>
            </Pressable>

            {checklistExpanded && (
              <Box style={{ paddingHorizontal: 16 }}>
                {/* Show completed items toggle */}
                <Box flexDirection="row" alignItems="center" justifyContent="flex-end" style={{ paddingVertical: 8, gap: 10 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.textSecondary, fontFamily: 'Inter_500Medium' }}>
                    Show completed items
                  </Text>
                  <Pressable onPress={() => setShowCompleted(!showCompleted)}>
                    <Box
                      width={32}
                      height={18}
                      borderRadius="full"
                      style={{ backgroundColor: showCompleted ? theme.colors.secondaryGreen : '#B7B7B7', position: 'relative' as any, justifyContent: 'center' }}
                    >
                      <Box
                        width={14}
                        height={14}
                        borderRadius="full"
                        backgroundColor="white"
                        style={{
                          position: 'absolute' as any,
                          left: showCompleted ? 16 : 2,
                        }}
                      />
                    </Box>
                  </Pressable>
                </Box>

                {/* Checklist items */}
                <Box style={{ gap: 12, marginTop: 8 }}>
                  {visibleItems.map(item => (
                    <Pressable
                      key={item.id}
                      onPress={() => toggleCheck(item.id)}
                      style={({ hovered }: any) => ({
                        flexDirection: "row", alignItems: "center",
                        borderWidth: 1, borderColor: theme.colors.border,
                        borderRadius: 8, paddingLeft: 15, paddingRight: 16,
                        height: 56, justifyContent: 'center',
                        backgroundColor: hovered ? theme.colors.grey01 : theme.colors.white,
                        ...Platform.select({ web: { cursor: 'pointer' } as any }),
                      })}
                    >
                      <Box flexDirection="row" alignItems="center" gap="8" style={{ flex: 1 }}>
                        <Checkbox
                          variant="rectangular"
                          checked={item.checked}
                          onChange={() => toggleCheck(item.id)}
                        />
                        <Text style={{
                          flex: 1, fontSize: 14, fontWeight: '400',
                          color: item.checked ? theme.colors.grey04 : theme.colors.foreground,
                          textDecorationLine: item.checked ? 'line-through' : 'none',
                          fontFamily: 'Inter_400Regular',
                        }}>
                          {item.label}
                        </Text>
                      </Box>
                    </Pressable>
                  ))}

                  {/* Add item button */}
                  <Pressable
                    style={({ pressed, hovered }: any) => ({
                      height: 56, flexDirection: 'row', alignItems: 'center', gap: 8,
                      backgroundColor: pressed ? theme.colors.grey03 : hovered ? theme.colors.grey03 : theme.colors.grey02,
                      borderRadius: 8, paddingLeft: 16, paddingRight: 16,
                      opacity: 1,
                      ...Platform.select({ web: { cursor: 'pointer' } as any }),
                    })}
                  >
                    <Box width={24} height={24} alignItems="center" justifyContent="center">
                      <Plus size={16} color={theme.colors.secondaryGreen} strokeWidth={2} />
                    </Box>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.secondaryGreen, fontFamily: 'Inter_500Medium' }}>
                      Add item
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            )}
          </Box>

          {/* Files & Media section */}
          <Box style={{ overflow: 'hidden' as any }}>
            <Pressable
              onPress={() => setFilesExpanded(v => !v)}
              style={({ hovered }: any) => ({ borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : 'transparent' })}
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 52, paddingLeft: 16, paddingRight: 16 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Box width={24} height={24} alignItems="center" justifyContent="center">
                    <FileImage size={20} color={theme.colors.textSecondary} />
                  </Box>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, fontFamily: 'Inter_600SemiBold' }}>Files & Media</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="12">
                  <ImageIcon size={20} color={theme.colors.textSecondary} />
                  {filesExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
                </Box>
              </Box>
            </Pressable>
          </Box>

          {/* Assignee section */}
          <Box style={{ overflow: 'hidden' as any }}>
            <Pressable
              onPress={() => setAssigneeExpanded(v => !v)}
              style={({ hovered }: any) => ({ borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : 'transparent' })}
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 52, paddingLeft: 16, paddingRight: 16 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Box width={24} height={24} alignItems="center" justifyContent="center">
                    <Users size={20} color={theme.colors.textSecondary} />
                  </Box>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, fontFamily: 'Inter_600SemiBold' }}>Assignee</Text>
                </Box>
                {assigneeExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
              </Box>
            </Pressable>
          </Box>

          {/* Activity section */}
          <Box style={{ overflow: 'hidden' as any }}>
            <Pressable
              onPress={() => setActivityExpanded(v => !v)}
              style={({ hovered }: any) => ({ borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : 'transparent' })}
            >
              <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 52, paddingLeft: 16, paddingRight: 16 }}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Box width={24} height={24} alignItems="center" justifyContent="center">
                    <Activity size={20} color={theme.colors.textSecondary} />
                  </Box>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.colors.textSecondary, fontFamily: 'Inter_600SemiBold' }}>Activity</Text>
                </Box>
                {activityExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
              </Box>
            </Pressable>
          </Box>

        </Box>
      </ScrollView>
    </Box>
  );
}

// ── Chat Panel ────────────────────────────────────────────────────────────────
function ChatPanel() {
  const theme = useTheme<Theme>();

  return (
    <Box
      flex={1}
      backgroundColor="background"
      borderLeftWidth={1}
      borderColor="border"
      style={{ height: '100%' as any, maxWidth: 550, position: 'relative' as any }}
    >
      {/* Chat Header */}
      <Box
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="background"
        style={{ height: 74, paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>
          Chat
        </Text>
        <Box flexDirection="row" alignItems="center">
          <Pressable style={({ hovered }: any) => ({ padding: 4, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
            <Search size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={({ hovered }: any) => ({ padding: 4, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
            <MoreVertical size={24} color={theme.colors.textSecondary} />
          </Pressable>
          <Pressable style={({ hovered }: any) => ({ padding: 4, borderRadius: 4, backgroundColor: hovered ? theme.colors.grey02 : 'transparent' })}>
            <ChevronsRight size={24} color={theme.colors.textSecondary} />
          </Pressable>
        </Box>
      </Box>

      {/* Chat List */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <Box
          flexDirection="row"
          alignItems="center"
          style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 16 }}
        >
          <Box
            width={48}
            height={48}
            borderRadius="full"
            alignItems="center"
            justifyContent="center"
            backgroundColor="pastelOrange"
            style={{ flexShrink: 0 } as any}
          >
            <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 22 }}>TH</Text>
          </Box>
          <Box flex={1} style={{ minWidth: 0, gap: 4 }}>
            <Text variant="webSecondaryBody" color="foreground">
              Tasktag Helpdesk
            </Text>
            <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>
              Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might
              have.
            </Text>
          </Box>
          <Text variant="webMetadataPrimary" color="grey04">
            Yesterday
          </Text>
        </Box>
      </ScrollView>

      {/* New Message FAB */}
      <Pressable
        style={{
          position: 'absolute' as any,
          bottom: 16,
          right: 16,
          backgroundColor: theme.colors.foreground,
          borderRadius: 156,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 12,
          gap: 8,
        }}
      >
        <MessageSquarePlus size={24} color={theme.colors.white} />
        <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>New Message</Text>
      </Pressable>
    </Box>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function MyTask() {
  const theme = useTheme<Theme>();
  const [collapsed, setCollapsed] = useState(false);
  const [currentTasks, setCurrentTasks] = useState<Task[]>(INITIAL_CURRENT_TASKS);
  const [completedTasks, setCompletedTasks] = useState<Task[]>(INITIAL_COMPLETED_TASKS);
  const [currentExpanded, setCurrentExpanded] = useState(true);
  const [overdueExpanded, setOverdueExpanded] = useState(false);
  const [completedExpanded, setCompletedExpanded] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleTaskComplete = (taskId: number) => {
    const task = currentTasks.find(t => t.id === taskId);
    if (task) {
      setCurrentTasks(prev => prev.filter(t => t.id !== taskId));
      setCompletedTasks(prev => [task, ...prev]);
    }
  };

  return (
    <Box flex={1} flexDirection="row" backgroundColor="background" style={{ height: '100vh' as any, position: 'relative' as any }}>

      {/* ── Left area: Sidebar + Main Content ── */}
      <Box flex={1} flexDirection="row" style={{ position: 'relative' as any, height: '100%' as any }}>
        <Sidebar collapsed={collapsed} onToggleCollapsed={() => setCollapsed(v => !v)} />

        {/* Main content */}
        <Box flex={1} style={{ height: '100%' as any, overflow: 'hidden' as any }}>
          {/* Top bar */}
          <Box flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="border" style={{ height: 64, paddingHorizontal: 24 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: theme.colors.foreground }}>My Tasks</Text>
            <Box flexDirection="row" alignItems="center" gap="8">
              <Pressable style={{ padding: 6 }}>
                <Search size={20} color={theme.colors.textSecondary} />
              </Pressable>
              <Pressable style={({ hovered, pressed }: any) => ({
                flexDirection: 'row', alignItems: 'center', gap: 6,
                backgroundColor: hovered ? theme.colors.grey05 : pressed ? theme.colors.grey06 : theme.colors.black,
                borderRadius: 40, paddingHorizontal: 16, paddingVertical: 8,
                cursor: 'pointer' as any,
              })}>
                <Plus size={15} color="#fff" />
                <Text variant="labelMedium" style={{ color: '#fff' }}>New Task</Text>
              </Pressable>
            </Box>
          </Box>

          {/* Filter bar */}
          <Box flexDirection="row" alignItems="center" gap="4" borderBottomWidth={1} borderColor="border" style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Pressable style={({ hovered, pressed }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
              backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
              cursor: 'pointer' as any,
            })}>
              <ListFilter size={15} color={theme.colors.black} />
              <Text variant="webBody" color="black">Filter</Text>
            </Pressable>
            <Pressable style={({ hovered, pressed }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
              backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
              cursor: 'pointer' as any,
            })}>
              <ArrowDownUp size={15} color={theme.colors.black} />
              <Text variant="webBody" color="black">Sort</Text>
            </Pressable>
            <Pressable style={({ hovered, pressed }: any) => ({
              flexDirection: 'row', alignItems: 'center', gap: 8,
              paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8,
              backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
              cursor: 'pointer' as any,
            })}>
              <Calendar size={15} color={theme.colors.black} />
              <Text variant="webBody" color="black">Add to calendar</Text>
            </Pressable>
          </Box>

          {/* Task sections */}
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
            <SectionCard label="Current" count={currentTasks.length} expanded={currentExpanded} onToggle={() => setCurrentExpanded(v => !v)}>
              {currentTasks.map((task) => (
                <TaskRow key={task.id} task={task} onComplete={() => handleTaskComplete(task.id)} />
              ))}
              <Box borderTopWidth={1} borderColor="border" style={{ paddingHorizontal: 52, paddingVertical: 18 }}>
                <TextInput
                  placeholder="Enter task name..."
                  placeholderTextColor={theme.colors.grey05}
                  style={{ fontSize: 14, color: theme.colors.foreground, outlineStyle: 'none' } as any}
                />
              </Box>
            </SectionCard>

            <SectionCard label="Overdue" count={OVERDUE_TASKS.length} expanded={overdueExpanded} onToggle={() => setOverdueExpanded(v => !v)}>
              {OVERDUE_TASKS.map((task) => (
                <TaskRow key={task.id} task={task} />
              ))}
            </SectionCard>

            <SectionCard label="Completed" count={completedTasks.length} expanded={completedExpanded} onToggle={() => setCompletedExpanded(v => !v)}>
              {completedTasks.map((task) => (
                <TaskRow key={task.id} task={task} completed />
              ))}
            </SectionCard>
          </ScrollView>
        </Box>
      </Box>

      {/* ── Overlay: darkens sidebar + main, behind task detail panel ── */}
      <Box
        style={{
          position: 'absolute' as any, top: 0, left: 0, right: 550, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          zIndex: 20,
        }}
        pointerEvents="none"
      />

      {/* ── Task Detail Panel ── */}
      <TaskDetailPanel onJoin={() => setShowSignupModal(true)} />

      {/* ── Chat Panel ── */}
      <ChatPanel />

      {/* ── Signup Modal ── */}
      <Modal visible={showSignupModal} transparent animationType="fade" onRequestClose={() => setShowSignupModal(false)}>
        <Box style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable onPress={() => setShowSignupModal(false)} style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }} />
          <Box style={{ width: '100%', maxWidth: 640, maxHeight: '99%', borderRadius: 16, overflow: 'hidden' as any }}>
            <JoinTasktagSignup
              onClose={() => setShowSignupModal(false)}
              onSuccess={() => setShowSignupModal(false)}
            />
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
