import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { TextInput as DSTextInput } from '@/components/TextInput';
import { Box, Text } from '@/components/primitives';
import { UpgradeModal } from '@/components/UpgradeModal';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
  Check,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronUp,
  CreditCard,
  Database,
  Edit,
  Equal,
  FileText,
  Folder,
  Hash,
  HelpCircle,
  House,
  Link,
  ListFilter,
  LogOut,
  Mail,
  MessageSquare,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Repeat,
  Search,
  SortDesc,
  Star,
  Trash2,
  X,
  User,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Animated, Image, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import ReactDOM from 'react-dom';

const AVATAR_PHOTOS = [
  { src: require('@/assets/images/sample-three.jpg'), name: 'James Log...' },
  { src: require('@/assets/images/sample-two.jpg'), name: 'User 2' },
  { src: require('@/assets/images/sample-four.jpg'), name: 'User 3' },
];

const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: false },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

const TEAM_MEMBERS: {
  name: string;
  skills: string[];
  email: string;
  phone: string;
  role: string;
  avatar: { type: 'initials'; initials: string; color: string };
}[] = [
  { name: 'Linda Smith', skills: ['Lead Painter'], email: 'lindasmith@gmail.com', phone: '232-946-1254', role: 'Owner', avatar: { type: 'initials', initials: 'LS', color: 'pastelMagenta' } },
  { name: 'Abby Smith', skills: ['Painting'], email: 'abbysmith@gmail.com', phone: '230-124-9988', role: 'Admin', avatar: { type: 'initials', initials: 'AS', color: 'pastelYellow' } },
  { name: 'Oscar H.', skills: ['Primer'], email: 'oscaar@email.com', phone: '242-159-8803', role: 'Admin', avatar: { type: 'initials', initials: 'OH', color: 'pastelOrange' } },
  { name: 'Savannah Nguyen', skills: ['Finishing'], email: 'savannahnguyen@gmail.com', phone: '222-548-5896', role: 'Member', avatar: { type: 'initials', initials: 'SN', color: 'pastelBlue' } },
];

const PENDING_INVITES: {
  emailOrName: string;
  invitedBy: string;
  dateSent: string;
  expirationDate: string;
  role: string;
  status: 'pending' | 'expired' | 'near-expiry';
}[] = [
  { emailOrName: 'john.doe@gmail.com', invitedBy: 'Linda Smith', dateSent: 'Nov 1, 2025', expirationDate: 'Nov 7, 2025', role: 'Admin', status: 'pending' },
  { emailOrName: 'roberto@gmail.com', invitedBy: 'Abby Smith', dateSent: 'Nov 2, 2025', expirationDate: 'Nov 3, 2025', role: 'Member', status: 'near-expiry' },
  { emailOrName: 'sarah.k@gmail.com', invitedBy: 'Oscar H.', dateSent: 'Oct 20, 2025', expirationDate: 'Oct 27, 2025', role: 'Member', status: 'expired' },
];

const INVOICE_DATA = [
  { date: 'March 15, 2025', desc: 'Team plan · 4 members', amount: '$768.00', status: 'Paid' },
];

// ── Tooltip ──
function Tooltip({
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
    // React Native Web: ref.current IS the DOM node — use getBoundingClientRect
    if (typeof el.getBoundingClientRect === 'function') {
      const rect = el.getBoundingClientRect();
      const ww = window.innerWidth;
      setPos({
        top: rect.bottom + 6,
        ...(align === 'left' ? { left: rect.left } : { right: ww - rect.right }),
      });
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
        ...Platform.select({
          web: {
            whiteSpace: 'nowrap',
            ...(isSuccess ? { boxShadow: '0px 5px 25px 0px rgba(0, 0, 0, 0.05)' } : {}),
          } as any,
        }),
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
        {...Platform.select({
          web: {
            onMouseEnter: () => { setHovered(true); measure(); },
            onMouseLeave: () => setHovered(false),
          } as any,
        })}
      >
        {children}
      </View>
      {visible && pos && (Platform.OS === 'web' ? ReactDOM.createPortal(
        <View
          style={{
            position: 'fixed' as any,
            top: pos.top,
            ...(pos.left !== undefined ? { left: pos.left } : { right: pos.right }),
            zIndex: 999999,
            pointerEvents: 'none',
          }}
        >
          {tooltipBox}
        </View>,
        document.body
      ) : null)}
    </>
  );
}

function CopyLinkButton() {
  const theme = useTheme<Theme>();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <Tooltip
      label={copied ? "Link copied!" : "Copy link to invite"}
      variant={copied ? "success" : "default"}
      forceOpen={copied}
    >
      <Pressable
        hitSlop={8}
        onPress={handleCopy}
        style={({ pressed, hovered }: any) => ({
          width: 32,
          height: 32,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 6,
          backgroundColor: hovered
            ? theme.colors.grey02
            : pressed
            ? theme.colors.grey03
            : 'transparent',
          cursor: 'pointer' as any,
        })}
      >
        <Link size={20} color={theme.colors.textSecondary} />
      </Pressable>
    </Tooltip>
  );
}

// ── Reusable hover icon button ──
function HoverIconButton({ icon: IconComp, size = 16, color, tooltip, onPress }: {
  icon: React.ComponentType<any>;
  size?: number;
  color: string;
  tooltip?: string;
  onPress?: () => void;
}) {
  const theme = useTheme<Theme>();
  const btn = (
    <Pressable
      hitSlop={8}
      onPress={onPress}
      style={({ pressed, hovered }: any) => ({
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        backgroundColor: hovered
          ? theme.colors.grey02
          : pressed
          ? theme.colors.grey03
          : 'transparent',
        cursor: 'pointer' as any,
      })}
    >
      <IconComp size={size} color={color} />
    </Pressable>
  );
  if (tooltip) {
    return <Tooltip label={tooltip}>{btn}</Tooltip>;
  }
  return btn;
}

function MiniAvatar({ colorIndex, size = 30 }: { colorIndex: number; size?: number }) {
  const theme = useTheme<Theme>();
  const p = AVATAR_PHOTOS[colorIndex % AVATAR_PHOTOS.length];
  return (
    <Image
      source={p.src}
      style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 2, borderColor: theme.colors.white }}
    />
  );
}

function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const theme = useTheme<Theme>();
  const config = {
    high: { color: theme.colors.orange, Icon: ChevronsUp },
    medium: { color: '#f59e0b', Icon: Equal },
    low: { color: theme.colors.secondaryGreen, Icon: ChevronsDown },
  }[priority];
  return (
    <Box width={36} height={36} borderRadius="full" alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border }}>
      <config.Icon size={15} color={config.color} />
    </Box>
  );
}

function DateBadge({ date }: { date: string }) {
  const theme = useTheme<Theme>();
  return (
    <Box flexDirection="row" alignItems="center" style={{ gap: 6, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 40, paddingHorizontal: 14, paddingVertical: 8, minWidth: 108 }}>
      <Calendar size={13} color={theme.colors.grey04} />
      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{date}</Text>
    </Box>
  );
}

// ── Role dropdown content (rendered as a portal at root level) ──
function RoleDropdownContent({
  onSelect,
  onClose,
}: {
  onSelect: (role: string) => void;
  onClose: () => void;
}) {
  const theme = useTheme<Theme>();
  const roles = [
    { label: 'Admin', description: 'Can access team projects, create new ones, manage roles & permission and invite new people.' },
    { label: 'Member', description: 'Can access team projects and invite new people.' },
  ];
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
        ...Platform.select({
          web: { width: 'max-content', boxShadow: '0px 4px 24px rgba(0,0,0,0.14)' } as any,
        }),
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
            backgroundColor: hovered
              ? theme.colors.grey01
              : pressed
              ? theme.colors.grey02
              : 'transparent',
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

const INVITE_ILLUSTRATION = 'https://www.figma.com/api/mcp/asset/59a5ad2a-7699-411a-8562-8146a757cf6c';
const INVITE_TEAL = '#1a6b6b';

type InviteeContact = {
  id: string;
  name: string;
  email: string;
  avatar: { type: 'photo'; src: any } | { type: 'initials'; initials: string; color: string };
};
type InviteeEntry = InviteeContact & { role: 'Member' | 'Admin' };
type InviteGroup = {
  id: string; name: string; memberCount: number;
  members: { id: string; name: string; email: string; initials: string }[];
};

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

function HighlightText({ text, query, baseStyle, boldBase = false }: { text: string; query: string; baseStyle: any; boldBase?: boolean }) {
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
  if (avatar.type === 'photo') {
    return <Image source={avatar.src} style={{ width: size, height: size, borderRadius: size / 2 }} />;
  }
  return (
    <Box width={size} height={size} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: avatar.color }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.35 }}>{avatar.initials}</Text>
    </Box>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const theme = useTheme<Theme>();
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [invitees, setInvitees] = useState<InviteeEntry[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

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
      setInvitees(prev => [...prev, { ...contact, role: 'Member' }]);
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

  const handleCopyLink = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

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
      backgroundColor: theme.colors.white, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, overflow: 'hidden', maxHeight: 320,
      shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 24, elevation: 8,
    }}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
      <Pressable
        onPress={() => {
          const emailContact: InviteeContact = {
            id: `email-${query}`,
            name: `${query.toLowerCase()}@gmail.com`,
            email: `${query.toLowerCase()}@gmail.com`,
            avatar: { type: 'initials', initials: query.slice(0, 2).toUpperCase(), color: theme.colors.grey03 },
          };
          addInvitee(emailContact);
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

  return (
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
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.foreground, lineHeight: 24 }}>Invite or Add Member</Text>
            <Box flexDirection="row" alignItems="center" gap="8">
              <View style={{ position: 'relative' as any, zIndex: 10002 }}>
                <Tooltip label={copied ? 'Link copied!' : 'Copy link to invite'} variant={copied ? 'success' : 'default'} forceOpen={copied}>
                  <Pressable
                    onPress={handleCopyLink}
                    style={({ hovered, pressed }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
                  >
                    <Link size={14} color={theme.colors.blue} />
                    <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.blue }}>Copy Link</Text>
                  </Pressable>
                </Tooltip>
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
                value={inputValue}
                onChangeText={(v) => { setInputValue(v); if (v.trim()) setTimeout(measureInputPosition, 0); }}
                placeholder="Add members by email, name or group"
              />
            </View>

            {/* Invitees list OR empty state — always visible, dropdown floats above */}
            <Box>
              {invitees.length > 0 ? (
                <Box>
                  {invitees.map((invitee, i) => (
                    <Box key={invitee.id}>
                      {i > 0 && <Box style={{ height: 1, backgroundColor: theme.colors.border }} />}
                      <Box flexDirection="row" alignItems="center" gap="12" style={{ paddingVertical: 12 }}>
                        <InviteAvatar avatar={invitee.avatar} size={44} />
                        <Box flex={1} style={{ gap: 0 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{invitee.name}</Text>
                          <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{invitee.email}</Text>
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
                <Box alignItems="center" justifyContent="center" style={{ gap: 0, paddingVertical: 8 }}>
                  <Image source={{ uri: INVITE_ILLUSTRATION }} style={{ width: 86, height: 86 }} resizeMode="contain" />
                  <Text style={{ fontSize: 14, fontWeight: '400', color: theme.colors.foreground, lineHeight: 16, textAlign: 'center' }}>
                    Bring your team on board
                  </Text>
                  <Text style={{ marginTop: 10, fontSize: 12, color: theme.colors.grey05, lineHeight: 16, textAlign: 'center', letterSpacing: 0.24 }}>
                    Invite teammates or contact groups to start working together seamlessly.
                  </Text>
                </Box>
              )}
            </Box>
          </Box>

          {/* Footer */}
          <Box style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 10 }}>
            <Box style={{ borderTopWidth: invitees.length > 0 ? 1 : 0, borderColor: theme.colors.border, paddingTop: invitees.length > 0 ? 16 : 0 }}>
              <Button disabled={invitees.length === 0} color="secondary" size="xl" style={{ width: '100%' as any }}>
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

      {/* Dropdown portal — di luar modal card, position fixed agar visible saat scroll */}
      {showDropdown && dropdownPos && (
        <>
          {/* click-away untuk tutup dropdown */}
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

      {/* Role dropdown portal for selected invitees */}
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
            <RoleDropdownContent
              onSelect={(role) => {
                setInvitees(prev => prev.map(i => i.id === openInviteeRole ? { ...i, role: role as 'Member' | 'Admin' } : i));
              }}
              onClose={() => { setOpenInviteeRole(null); setInviteeRolePos(null); }}
            />
          </Box>
        </>
      )}
    </>
  );
}

function ResendToast({ onDone }: { onDone: () => void }) {
  const theme = useTheme<Theme>();
  const progress = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start(() => onDone());
  }, []);

  return (
    <View
      style={Platform.select({
        web: { position: 'fixed', bottom: 28, left: 0, right: 0, alignItems: 'center', zIndex: 99999 } as any,
        default: { position: 'absolute' as any, bottom: 28, left: 0, right: 0, alignItems: 'center', zIndex: 99999 },
      })}
    >
      <View style={{ backgroundColor: theme.colors.foreground, borderRadius: 12, overflow: 'hidden' as any, minWidth: 240 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14 }}>
          <Check size={18} color={theme.colors.white} />
          <Text style={{ fontSize: 15, fontWeight: '600', color: theme.colors.white }}>Invitation resent</Text>
        </View>
        <Animated.View
          style={{
            height: 3,
            backgroundColor: theme.colors.secondaryGreen,
            width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
          }}
        />
      </View>
    </View>
  );
}

function CancelInviteModal({ emailOrName, onClose }: { emailOrName: string; onClose: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={onClose}
      style={Platform.select({
        web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' } as any,
        default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
      })}
    >
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={{ backgroundColor: theme.colors.white, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, width: 480, maxWidth: '90%' as any, padding: 24, gap: 16 }}
      >
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.foreground }}>Cancel Invite</Text>
          <Pressable
            onPress={onClose}
            style={({ hovered, pressed }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
          >
            <X size={18} color={theme.colors.grey06} />
          </Pressable>
        </Box>
        <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 22 }}>
          This will cancel the pending invitation for <Text style={{ fontWeight: '600' }}>{emailOrName}</Text>.
        </Text>
        <Box flexDirection="row" justifyContent="flex-end">
          <Button color="secondary" size="md" onPress={onClose}>Cancel Invite</Button>
        </Box>
      </Pressable>
    </Pressable>
  );
}

function RemoveMemberModal({ memberName, onClose }: { memberName: string; onClose: () => void }) {
  const theme = useTheme<Theme>();
  return (
    <Pressable
      onPress={onClose}
      style={Platform.select({
        web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' } as any,
        default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
      })}
    >
      <Pressable
        onPress={(e) => e.stopPropagation()}
        style={{ backgroundColor: theme.colors.white, borderRadius: 16, borderWidth: 1, borderColor: theme.colors.border, width: 480, maxWidth: '90%' as any, padding: 24, gap: 16 }}
      >
        {/* Header */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between">
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.colors.foreground }}>Remove Member</Text>
          <Pressable
            onPress={onClose}
            style={({ hovered, pressed }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
          >
            <X size={18} color={theme.colors.grey06} />
          </Pressable>
        </Box>

        {/* Body */}
        <Text style={{ fontSize: 14, color: theme.colors.foreground, lineHeight: 22 }}>
          <Text style={{ fontWeight: '700' }}>{memberName}</Text>
          <Text> will no longer have access to the project.</Text>
        </Text>

        {/* Footer */}
        <Box flexDirection="row" justifyContent="flex-end">
          <Button color="secondary" size="md" onPress={onClose}>Remove</Button>
        </Box>
      </Pressable>
    </Pressable>
  );
}

export default function TeamDetail() {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [pendingExpanded, setPendingExpanded] = useState(true);
  const [invoiceExpanded, setInvoiceExpanded] = useState(true);

  // Invite modal
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Upgrade modal
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Remove member confirmation
  const [removingMember, setRemovingMember] = useState<string | null>(null);

  // Cancel invite confirmation
  const [cancelingInvite, setCancelingInvite] = useState<string | null>(null);

  // Resend toast
  const [showResendToast, setShowResendToast] = useState(false);

  // Dropdown portal state
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openTeamMenu, setOpenTeamMenu] = useState(false);
  const [openFilterDropdown, setOpenFilterDropdown] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [dropdownPos, setDropdownPos] = useState<{ x: number; y: number; width: number; height: number; showAbove: boolean; windowWidth: number } | null>(null);
  // Estimated max dropdown height for 2 role options
  const DROPDOWN_HEIGHT = 210;

  // Mutable roles
  const [memberRoles, setMemberRoles] = useState<string[]>(TEAM_MEMBERS.map(m => m.role));
  const [pendingRoles, setPendingRoles] = useState<string[]>(PENDING_INVITES.map(p => p.role));

  // Refs for measuring role trigger positions
  const memberRoleRefs = useRef<(View | null)[]>([]);
  const pendingRoleRefs = useRef<(View | null)[]>([]);

  const closeDropdown = () => {
    setOpenRoleDropdown(null);
    setDropdownPos(null);
  };

  const handleOpenDropdown = (key: string, ref: View | null) => {
    if (openRoleDropdown === key) {
      closeDropdown();
      return;
    }
    if (ref) {
      (ref as any).measureInWindow((x: number, y: number, w: number, h: number) => {
        const windowHeight =
          typeof window !== 'undefined' ? window.innerHeight : 800;
        const windowWidth =
          typeof window !== 'undefined' ? window.innerWidth : 1200;
        const spaceBelow = windowHeight - (y + h);
        const showAbove = spaceBelow < DROPDOWN_HEIGHT + 8;
        setDropdownPos({ x, y, width: w, height: h, showAbove, windowWidth });
        setOpenRoleDropdown(key);
      });
    }
  };

  // Compute portal dropdown position (right-aligned to trigger)
  const dropdownRight = dropdownPos
    ? dropdownPos.windowWidth - (dropdownPos.x + dropdownPos.width)
    : 0;
  const dropdownTop = dropdownPos
    ? dropdownPos.showAbove
      ? dropdownPos.y - DROPDOWN_HEIGHT - 4
      : dropdownPos.y + dropdownPos.height + 4
    : 0;

  // Determine current role from open key
  const handleDropdownSelect = (role: string) => {
    if (!openRoleDropdown) return;
    const [group, idxStr] = openRoleDropdown.split('-');
    const idx = parseInt(idxStr, 10);
    if (group === 'active') {
      const updated = [...memberRoles];
      updated[idx] = role;
      setMemberRoles(updated);
    } else {
      const updated = [...pendingRoles];
      updated[idx] = role;
      setPendingRoles(updated);
    }
    closeDropdown();
  };

  return (
    <Box flex={1} flexDirection="row" backgroundColor="background" style={{ height: '100%' as any, position: 'relative' as any }}>

      {/* ── Sidebar ── */}
      <Box
        backgroundColor="grey01"
        borderRightWidth={1}
        borderColor="border"
        style={{ width: sidebarCollapsed ? 72 : 256, maxWidth: 256, height: '100%' as any, paddingHorizontal: 16, paddingVertical: 24, gap: 30 }}
      >
        {sidebarCollapsed ? (
          <Box alignItems="center" gap="8">
            <Image source={require('@/assets/images/tt-favicon.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
            <Pressable onPress={() => setSidebarCollapsed(false)} hitSlop={8}>
              <ChevronsRight size={20} color={theme.colors.grey04} />
            </Pressable>
          </Box>
        ) : (
          <Box flexDirection="row" alignItems="center" justifyContent="space-between">
            <Image source={require('@/assets/images/tasktag-logo.png')} style={{ width: 96, height: 24 }} resizeMode="contain" />
            <Pressable onPress={() => setSidebarCollapsed(true)} hitSlop={8}>
              <ChevronsLeft size={24} color={theme.colors.grey04} />
            </Pressable>
          </Box>
        )}

        <Box flex={1} style={{ paddingTop: 16 }}>
          <Box flex={1} justifyContent="space-between">
            <Box gap="8">
              {NAV_ITEMS.map(({ key, label, Icon, active }) => (
                sidebarCollapsed ? (
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
              ))}
            </Box>

            <Box gap="8">
              {!sidebarCollapsed && (
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
              {sidebarCollapsed ? (
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
              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ height: 54 }}>
                  <Box width={44} height={44} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                    <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                  </Box>
                </Box>
              ) : (
                <Box flexDirection="row" alignItems="center" gap="8" style={{ height: 54, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 15, backgroundColor: theme.colors.lightMint }}>
                  <Box width={40} height={40} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                    <Text variant="labelMedium" style={{ color: '#FFFFFF', fontWeight: '700' }}>LS</Text>
                  </Box>
                  <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>My Account</Text>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any }}>

        {/* Header */}
        <Box paddingHorizontal="md" backgroundColor="card" borderBottomWidth={1} borderColor="border" style={{ paddingTop: 16, paddingBottom: 12, zIndex: 20 }}>
          <Box flexDirection="row" alignItems="flex-start" justifyContent="space-between">
            <Box flexDirection="row" alignItems="flex-start" gap="8" flex={1} flexShrink={1}>
              <Pressable
                hitSlop={8}
                style={({ pressed, hovered }: any) => ({
                  width: 32,
                  height: 32,
                  marginTop: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                  cursor: 'pointer' as any,
                })}
              >
                <ChevronLeft size={20} color={theme.colors.grey04} />
              </Pressable>
              <Box flex={1} flexShrink={1}>
                <Box flexDirection="row" alignItems="center" gap="8">
                  <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1, fontWeight: '700' }}>Painting Team</Text>
                  <Box style={{ position: 'relative' as any, zIndex: 100 }}>
                    <Pressable
                      hitSlop={8}
                      onPress={() => setOpenTeamMenu(prev => !prev)}
                      style={({ pressed, hovered }: any) => ({
                        width: 32,
                        height: 32,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 6,
                        backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                        cursor: 'pointer' as any,
                      })}
                    >
                      <MoreVertical size={20} color={theme.colors.black} />
                    </Pressable>

                    {openTeamMenu && (
                      <>
                        <Pressable
                          onPress={() => setOpenTeamMenu(false)}
                          style={Platform.select({
                            web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9990 } as any,
                            default: { position: 'absolute', top: -1000, left: -1000, right: -1000, bottom: -1000, zIndex: 9990 } as any,
                          })}
                        />
                        <Box
                          style={{
                            position: 'absolute' as any,
                            top: '100%',
                            left: 0,
                            marginTop: 8,
                            backgroundColor: theme.colors.white,
                            borderRadius: 12,
                            width: 220,
                            paddingVertical: 8,
                            borderWidth: 1,
                            borderColor: theme.colors.grey03,
                            zIndex: 9999,
                            ...Platform.select({
                              web: { boxShadow: '0px 4px 24px rgba(0,0,0,0.14)' } as any,
                            }),
                          }}
                        >
                          {[
                            { label: 'Edit', icon: Edit, color: theme.colors.black },
                            { label: 'Cancel', icon: XCircle, color: theme.colors.alertRed },
                            { label: 'Edit Team Info', icon: Edit, color: theme.colors.black },
                            { label: 'Set as Primary', icon: Star, color: theme.colors.black },
                            { label: 'Leave', icon: LogOut, color: theme.colors.alertRed },
                          ].map((item, i) => (
                            <Pressable
                              key={i}
                              onPress={() => setOpenTeamMenu(false)}
                              style={({ pressed, hovered }: any) => ({
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                                cursor: 'pointer' as any,
                              })}
                            >
                              <item.icon size={18} color={item.color as any} />
                              <Text variant="webSecondaryBody" style={{ color: item.color, fontWeight: '500' }}>{item.label}</Text>
                            </Pressable>
                          ))}
                        </Box>
                      </>
                    )}
                  </Box>
                </Box>
                <Text style={{ fontSize: 11, color: theme.colors.textSecondary, marginTop: 2 }}>11 N Raintree Hollow Court</Text>
              </Box>
            </Box>
            <Box flexDirection="row" alignItems="center" gap="12">
              <Pressable
                hitSlop={8}
                style={({ pressed, hovered }: any) => ({
                  width: 32,
                  height: 32,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 6,
                  backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                  cursor: 'pointer' as any,
                })}
              >
                <Search size={20} color={theme.colors.textSecondary} />
              </Pressable>
              <Pressable
                style={({ pressed, hovered }: any) => ({
                  width: 110,
                  height: 36,
                  borderRadius: 40,
                  backgroundColor: hovered ? theme.colors.grey05 : pressed ? theme.colors.grey06 : theme.colors.black,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  cursor: 'pointer' as any,
                })}
              >
                <Plus size={15} color={theme.colors.white} />
                <Text variant="labelMedium" style={{ color: theme.colors.white }}>New Task</Text>
              </Pressable>
            </Box>
          </Box>
        </Box>

        {/* Tabs */}
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderColor="border" backgroundColor="card" style={{ height: 56, zIndex: 10 }} paddingHorizontal="md">
          <Box flexDirection="row" alignItems="stretch">
            {[
              { key: 'overview', label: 'Overview', Icon: House },
              { key: 'members', label: 'Members', Icon: Users, count: TEAM_MEMBERS.length },
              { key: 'invoice', label: 'Invoice', Icon: FileText, showDot: true },
            ].map(({ key, label, Icon, count, showDot }: any) => {
              const isActive = activeTab === key;
              return (
                <Pressable key={key} onPress={() => setActiveTab(key)} style={{ height: 56, width: 124 }}>
                  {({ hovered }: any) => {
                    const iconColor = isActive || hovered ? theme.colors.secondaryGreen : theme.colors.textSecondary;
                    const textColor = isActive || hovered ? theme.colors.secondaryGreen : theme.colors.textSecondary;
                    const bgColor = isActive || hovered ? theme.colors.secondaryGreen : theme.colors.textSecondary;
                    return (
                      <Box flexDirection="column" alignItems="center" justifyContent="center" height={56} style={{ position: 'relative' as any }}>
                        <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 8, gap: 8 }} justifyContent="center">
                          <Icon size={16} color={iconColor} style={{ transition: 'color 0.2s ease' } as any} />
                          <Text variant="labelMedium" style={{ color: textColor, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                          {count !== undefined && (
                            <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: bgColor, transition: 'background-color 0.2s ease' } as any}>
                              <Text variant="webMetadataSecondary" color="white">{count}</Text>
                            </Box>
                          )}
                          {showDot && (
                            <Box width={8} height={8} borderRadius="full" backgroundColor="alertRed" />
                          )}
                        </Box>
                        <Box style={{ position: 'absolute' as any, bottom: -1, left: 0, right: 0, height: 2, backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', transition: 'background-color 0.2s ease' as any } as any} />
                      </Box>
                    );
                  }}
                </Pressable>
              );
            })}
          </Box>
          <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
            <CopyLinkButton />
            <Pressable
              onPress={() => setShowInviteModal(true)}
              style={({ pressed, hovered }: any) => ({
                width: 110,
                height: 36,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: theme.colors.border,
                backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
                cursor: 'pointer' as any,
              })}
            >
              <UserPlus size={16} color={theme.colors.textSecondary} />
              <Text variant="labelMedium" color="textSecondary">Invite</Text>
            </Pressable>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Filter bar */}
          {activeTab === 'members' && (
            <Box flexDirection="row" alignItems="center" gap="8" paddingHorizontal="md" backgroundColor="card" style={{ paddingTop: 16, paddingBottom: 16, zIndex: 1000, elevation: 1000 }}>
              <Box style={{ position: 'relative', zIndex: 100 }}>
                <Pressable
                  onPress={() => setOpenFilterDropdown(prev => !prev)}
                  style={({ pressed, hovered }: any) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 8,
                    backgroundColor: hovered || openFilterDropdown ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                    cursor: 'pointer' as any,
                  })}
                >
                  <ListFilter size={15} color={theme.colors.black} />
                  <Text variant="webBody" color="black">Filter</Text>
                </Pressable>

                {openFilterDropdown && (
                  <>
                    <Pressable
                      onPress={() => setOpenFilterDropdown(false)}
                      style={Platform.select({
                        web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9990 } as any,
                        default: { position: 'absolute', top: -1000, left: -1000, right: -1000, bottom: -1000, zIndex: 9990 } as any,
                      })}
                    />
                    <Box
                      style={{
                        position: 'absolute' as any,
                        top: '100%',
                        left: 0,
                        marginTop: 8,
                        width: 240,
                        backgroundColor: theme.colors.white,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: theme.colors.border,
                        zIndex: 9999,
                        ...(Platform.select({ web: { boxShadow: '0px 4px 12px rgba(0,0,0,0.1)' } }) as any)
                      }}
                    >
                      <Box style={{ padding: 12, paddingBottom: 0, borderBottomWidth: 1, borderColor: theme.colors.border }}>
                        <DSTextInput 
                          placeholder="Search members..." 
                          icon={Search} 
                          size="sm" 
                          showClearButton={false} 
                          value={filterQuery}
                          onChangeText={setFilterQuery}
                        />
                      </Box>

                      <Box style={{ paddingVertical: 8 }}>
                        {['Admin', 'Member'].map((role) => (
                          <Pressable 
                            key={role} 
                            onPress={() => setFilterRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role])}
                            style={({ hovered }: any) => ({ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
                          >
                            <View pointerEvents="none">
                              <Checkbox variant="circular" checked={filterRoles.includes(role)} label={role} />
                            </View>
                          </Pressable>
                        ))}
                      </Box>

                      <Box height={1} backgroundColor="border" />

                      <Box padding="sm">
                        <Button 
                          variant="ghost" 
                          color="secondary" 
                          size="sm" 
                          style={{ width: '100%' }} 
                          disabled={filterQuery.length === 0 && filterRoles.length === 0}
                          onPress={() => { setFilterQuery(''); setFilterRoles([]); }}
                        >
                          Clear All
                        </Button>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
              <Pressable
                style={({ pressed, hovered }: any) => ({
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                  cursor: 'pointer' as any,
                })}
              >
                <MessageSquare size={15} color={theme.colors.black} />
                <Text variant="webBody" color="black">Start Chat</Text>
              </Pressable>
            </Box>
          )}

          <Box style={{ paddingTop: 0, paddingHorizontal: 16, paddingBottom: 16 }}>

            {activeTab === 'members' && (
              <>
                {/* ── Active Table ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, zIndex: 2 }}>

                  {/* Active header */}
                  <Pressable onPress={() => setActiveExpanded(prev => !prev)}>
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 64, paddingHorizontal: 16 }}>
                      <Box flexDirection="row" alignItems="center" gap="8">
                        <Text variant="webLabelEmphasized" color="foreground">Active</Text>
                        <Box width={20} height={20} alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10 }}>
                          <Text style={{ fontSize: 11, color: theme.colors.grey05, fontWeight: '500' }}>{TEAM_MEMBERS.length}</Text>
                        </Box>
                      </Box>
                      {activeExpanded
                        ? <ChevronUp size={20} color={theme.colors.grey06} />
                        : <ChevronDown size={20} color={theme.colors.grey06} />
                      }
                    </Box>
                  </Pressable>

                  {activeExpanded && (
                    <Box>
                      {/* Header row */}
                      <Box flexDirection="row" backgroundColor="grey01">
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Box flexDirection="row" alignItems="center" gap="4">
                            <Text variant="webMetadataPrimary" color="grey05">Name</Text>
                            <ArrowDownUp size={12} color={theme.colors.grey05} />
                          </Box>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Skills</Text>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Email</Text>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }} alignItems="flex-end">
                          <Text variant="webMetadataPrimary" color="grey05">Phone</Text>
                        </Box>
                        <Box style={{ width: 120, paddingLeft: 22, paddingRight: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Role</Text>
                        </Box>
                        {/* Action: single merged 128px header */}
                        <Box style={{ width: 128, paddingHorizontal: 8, paddingVertical: 10 }} alignItems="center">
                          <Text variant="webMetadataPrimary" color="grey05">Action</Text>
                        </Box>
                      </Box>

                      {/* Data rows */}
                      {TEAM_MEMBERS.map((member, index) => {
                        const activeRole = memberRoles[index] || member.role;
                        const roleGroup = ['Owner', 'Admin'].includes(activeRole) ? 'Admin' : 'Member';
                        if (filterQuery && !member.name.toLowerCase().includes(filterQuery.toLowerCase()) && !member.email.toLowerCase().includes(filterQuery.toLowerCase())) return null;
                        if (filterRoles.length > 0 && !filterRoles.includes(roleGroup)) return null;

                        const dropdownKey = `active-${index}`;
                        return (
                          <Box key={index} flexDirection="row" alignItems="center" borderTopWidth={1} borderColor="border" style={{ height: 48, zIndex: 1000 - index }}>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              <Box flexDirection="row" alignItems="center" gap="8">
                                <Box width={32} height={32} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor={member.avatar.color as any}>
                                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFFFFF' }}>{member.avatar.initials}</Text>
                                </Box>
                                <Text variant="webSecondaryBody" color="foreground" numberOfLines={1} style={{ flex: 1 }}>{member.name}</Text>
                              </Box>
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              {member.skills.length > 0 ? (
                                <Box flexDirection="row" alignItems="center" gap="4">
                                  {member.skills.slice(0, 2).map((skill, i) => (
                                    <Box key={i} style={{ backgroundColor: theme.colors.grey02, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 2 }}>
                                      <Text variant="labelMedium" color="foreground">{skill}</Text>
                                    </Box>
                                  ))}
                                </Box>
                              ) : null}
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              <Text variant="webSecondaryBody" color="foreground" numberOfLines={1}>{member.email}</Text>
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }} alignItems="flex-end">
                              <Text variant="webSecondaryBody" color="foreground">{member.phone}</Text>
                            </Box>

                            {/* Role cell — Owner: label only; others: dropdown trigger */}
                            <Box style={{ width: 120, paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                              {memberRoles[index] === 'Owner' ? (
                                <Text variant="labelMedium" color="foreground" style={{ paddingHorizontal: 6 }}>{memberRoles[index]}</Text>
                              ) : (
                                <View ref={(r) => { memberRoleRefs.current[index] = r; }}>
                                  <Pressable
                                    onPress={() => handleOpenDropdown(dropdownKey, memberRoleRefs.current[index])}
                                    style={({ pressed, hovered }: any) => ({
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: 4,
                                      paddingHorizontal: 6,
                                      paddingVertical: 4,
                                      borderRadius: 6,
                                      backgroundColor: hovered
                                        ? theme.colors.grey02
                                        : pressed
                                        ? theme.colors.grey03
                                        : 'transparent',
                                      cursor: 'pointer' as any,
                                    })}
                                  >
                                    <Text variant="labelMedium" color="foreground">{memberRoles[index]}</Text>
                                    <ChevronDown size={14} color={theme.colors.grey06} />
                                  </Pressable>
                                </View>
                              )}
                            </Box>

                            {/* Action column — 128px merged */}
                            <Box style={{ width: 128, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              <HoverIconButton icon={MessageSquare} size={16} color={theme.colors.grey06} tooltip="Send Message" />
                              {member.role !== 'Owner' && (
                                <HoverIconButton icon={Trash2} size={16} color={theme.colors.grey06} tooltip="Delete Member" onPress={() => setRemovingMember(member.name)} />
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>

                {/* ── Pending Table ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, marginTop: 16, zIndex: 1 }}>

                  {/* Pending header */}
                  <Pressable onPress={() => setPendingExpanded(prev => !prev)}>
                    <Box flexDirection="row" alignItems="center" justifyContent="space-between" style={{ height: 64, paddingHorizontal: 16 }}>
                      <Box flexDirection="row" alignItems="center" gap="8">
                        <Text variant="webLabelEmphasized" color="foreground">Pending</Text>
                        <Box width={20} height={20} alignItems="center" justifyContent="center" style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 10 }}>
                          <Text style={{ fontSize: 11, color: theme.colors.grey05, fontWeight: '500' }}>{PENDING_INVITES.length}</Text>
                        </Box>
                      </Box>
                      {pendingExpanded
                        ? <ChevronUp size={20} color={theme.colors.grey06} />
                        : <ChevronDown size={20} color={theme.colors.grey06} />
                      }
                    </Box>
                  </Pressable>

                  {pendingExpanded && (
                    <Box>
                      {/* Header row */}
                      <Box flexDirection="row" backgroundColor="grey01">
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Email or Name</Text>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Invited By</Text>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Box flexDirection="row" alignItems="center" gap="4">
                            <Text variant="webMetadataPrimary" color="grey05">Date Sent</Text>
                            <ArrowDownUp size={12} color={theme.colors.grey05} />
                          </Box>
                        </Box>
                        <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Expiration Date</Text>
                        </Box>
                        <Box style={{ width: 120, paddingLeft: 22, paddingRight: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">Role</Text>
                        </Box>
                        {/* Action: single merged 128px header */}
                        <Box style={{ width: 128, paddingHorizontal: 8, paddingVertical: 10 }} alignItems="center">
                          <Text variant="webMetadataPrimary" color="grey05">Action</Text>
                        </Box>
                      </Box>

                      {/* Data rows */}
                      {PENDING_INVITES.map((invite, index) => {
                        const roleGroup = ['Owner', 'Admin'].includes(invite.role) ? 'Admin' : 'Member';
                        if (filterQuery && !invite.emailOrName.toLowerCase().includes(filterQuery.toLowerCase())) return null;
                        if (filterRoles.length > 0 && !filterRoles.includes(roleGroup)) return null;

                        const isNearExpiry = invite.status === 'near-expiry';
                        const isExpired = invite.status === 'expired';

                        return (
                          <Box key={index} flexDirection="row" alignItems="center" borderTopWidth={1} borderColor="border" style={{ height: 48, zIndex: 1000 - index, backgroundColor: 'transparent' }}>
                            {/* Email / Name with avatar placeholder */}
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              <Box flexDirection="row" alignItems="center" gap="8">
                                <Box width={32} height={32} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: theme.colors.grey02 }}>
                                  <User size={16} color={theme.colors.grey05} />
                                </Box>
                                <Text variant="webSecondaryBody" color="foreground" numberOfLines={1}>{invite.emailOrName}</Text>
                              </Box>
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              <Text variant="webSecondaryBody" color="foreground" numberOfLines={1}>{invite.invitedBy}</Text>
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              <Text variant="webSecondaryBody" color="foreground">{invite.dateSent}</Text>
                            </Box>
                            <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                              {isExpired ? (
                                <Tooltip label="Invitation Expired" align="left">
                                  <Box style={{ backgroundColor: theme.colors.lightPink, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' }}>
                                    <Text style={{ color: theme.colors.alertRed, fontSize: 11, fontWeight: '600' }}>{invite.expirationDate}</Text>
                                  </Box>
                                </Tooltip>
                              ) : isNearExpiry ? (
                                <Tooltip label="Expiring in 24-48h" align="left">
                                  <Box style={{ backgroundColor: '#FFF5E5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start' }}>
                                    <Text style={{ color: '#d97706', fontSize: 11, fontWeight: '600' }}>{invite.expirationDate}</Text>
                                  </Box>
                                </Tooltip>
                              ) : (
                                <Text variant="webSecondaryBody" color="foreground">{invite.expirationDate}</Text>
                              )}
                            </Box>

                            {/* Role cell */}
                            <Box style={{ width: 120, paddingHorizontal: 16, paddingVertical: 8, justifyContent: 'center', alignItems: 'flex-start' }}>
                              <Text variant="labelMedium" color="foreground" style={{ paddingHorizontal: 6 }}>{invite.role}</Text>
                            </Box>

                            {/* Action column — 128px merged */}
                            <Box style={{ width: 128, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                              <HoverIconButton 
                                icon={Repeat} 
                                size={16} 
                                color={theme.colors.grey06} 
                                tooltip="Resend Invitation"
                                onPress={() => setShowResendToast(true)}
                              />
                              <HoverIconButton icon={Trash2} size={16} color={theme.colors.grey06} tooltip="Remove Invitation" onPress={() => setCancelingInvite(invite.emailOrName)} />
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </>
            )}

            {activeTab === 'overview' && (
              <Box flexDirection="row" gap="16" alignItems="flex-start" style={{ paddingTop: 16 }}>

                {/* ── Left Column ── */}
                <Box flex={2} gap="16">

                  {/* Card 1: TEAM INFO */}
                  <Box backgroundColor="card" borderWidth={1} borderColor="border" borderRadius="8" padding="24" gap="24">
                    <Text variant="webBody" color="foreground">Team Info</Text>

                    <Box gap="16">
                      <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal="8">
                        <Text variant="webBody" color="foreground">Owner</Text>
                        <Text variant="webLabelEmphasized" color="foreground">Linda Smith</Text>
                      </Box>
                      <Box height={1} backgroundColor="border" />

                      <Box flexDirection="row" justifyContent="space-between" alignItems="center" paddingHorizontal="8">
                        <Text variant="webBody" color="foreground">My role</Text>
                        <Box backgroundColor="grey02" style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 }}>
                          <Text variant="labelMedium" color="textSecondary">Owner</Text>
                        </Box>
                      </Box>
                      <Box height={1} backgroundColor="border" />

                      <Box gap="12" paddingHorizontal="8">
                        <Text variant="webMetadataPrimary" color="grey05" style={{ textTransform: 'uppercase' }}>Skills</Text>
                        <Box flexDirection="row" flexWrap="wrap" gap="8">
                          {['Construction', 'Electrical', 'Plumbing', 'HVAC', 'Carpentry'].map(spec => (
                            <Box key={spec} backgroundColor="grey02" style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 }}>
                              <Text variant="labelMedium" color="foreground">{spec}</Text>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Card 2: ACTIVITY */}
                  <Box backgroundColor="card" borderWidth={1} borderColor="border" borderRadius="8" padding="24" gap="24">
                    <Text variant="webBody" color="foreground">Activity · This Month</Text>

                    <Box flexDirection="row">
                      {/* Active projects */}
                      <Box flex={1} alignItems="center" gap="8" borderRightWidth={1} borderColor="border">
                        <Text variant="webBody" style={{ fontSize: 24, fontWeight: '700' }} color="grey04">2</Text>
                        <Text variant="webMetadataPrimary" color="grey05">Active projects</Text>
                      </Box>

                      {/* Active tasks */}
                      <Box flex={1} alignItems="center" gap="8" borderRightWidth={1} borderColor="border">
                        <Text variant="webBody" style={{ fontSize: 24, fontWeight: '700' }} color="grey04">10</Text>
                        <Text variant="webMetadataPrimary" color="grey05">Active tasks</Text>
                      </Box>

                      {/* Completed */}
                      <Box flex={1} alignItems="center" gap="8" borderRightWidth={1} borderColor="border">
                        <Text variant="webBody" style={{ fontSize: 24, fontWeight: '700' }} color="grey04">8</Text>
                        <Text variant="webMetadataPrimary" color="grey05">Completed</Text>
                      </Box>

                      {/* Overdue */}
                      <Box flex={1} alignItems="center" gap="8">
                        <Text variant="webBody" style={{ fontSize: 24, fontWeight: '700' }} color="grey04">2</Text>
                        <Text variant="webMetadataPrimary" color="grey05">Overdue</Text>
                      </Box>
                    </Box>

                  </Box>

                </Box>

                {/* ── Right Column ── */}
                <Box flex={1.2} backgroundColor="card" borderWidth={1} borderColor="border" borderRadius="8" padding="24" gap="24">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    <Text variant="webBody" color="foreground">Subscription</Text>
                  </Box>

                  <Box backgroundColor="lightCream" padding="16" borderRadius="8" gap="4">
                    <Text variant="webBody" color="foreground">Team plan ended on <Text variant="webLabelEmphasized" color="foreground">March 17, 2026</Text></Text>
                    <Text variant="webMetadataPrimary" color="foreground">Team features are currently suspended</Text>
                  </Box>

                  <Box gap="16">
                    <Text variant="webMetadataPrimary" color="textSecondary" style={{ textTransform: 'uppercase' }}>What you'll get back</Text>
                    <Box gap="12">
                      {[
                        'Unlimited projects',
                        '2TB of shared team storage',
                        'Create multiple tasks',
                        'Global activity log',
                        'Team roles & permissions',
                        'Access to all project templates'
                      ].map((item, i) => (
                        <Box key={i} flexDirection="row" alignItems="center" gap="12">
                          <Check size={16} color={theme.colors.secondaryGreen} />
                          <Text variant="webBody" color="foreground">{item}</Text>
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Box gap="12">
                    <Button variant="primary" onPress={() => setShowUpgradeModal(true)} style={{ height: 48, backgroundColor: theme.colors.black, borderRadius: 8, justifyContent: 'center' }}>
                      <Text variant="labelMedium" style={{ color: '#fff', fontSize: 16 }}>Renew Plan</Text>
                    </Button>
                    <Text variant="webMetadataPrimary" color="grey05" style={{ textAlign: 'center' }}>Restore full access immediately after payment</Text>
                  </Box>

                </Box>
              </Box>
            )}

            {activeTab === 'invoice' && (
              <Box gap="16" style={{ paddingTop: 16 }}>

                {/* ── Plan Header Card ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="alertRed" borderRadius="8" padding="24">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center">
                    {/* Left */}
                    <Box gap="8">
                      <Box flexDirection="row" alignItems="center" gap="8">
                        <Text variant="mobileHeading28" color="alertRed">Team plan</Text>
                      </Box>
                      <Text variant="webBody" color="textSecondary">Team plan ended March 17, 2026 · Team features suspended</Text>
                    </Box>

                  </Box>
                </Box>

                {/* ── What You'll Get Back ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="border" borderRadius="8" padding="24" gap="20">
                  <Text variant="webLabelEmphasized" color="textSecondary">What you'll get back</Text>
                  <Box flexDirection="row" gap="0">
                    {/* Left column */}
                    <Box flex={1} gap="20" borderRightWidth={1} borderColor="border" paddingRight="24">
                      {[
                        { Icon: Folder, title: 'Unlimited projects', desc: 'No cap on how many projects your team runs' },
                        { Icon: Hash, title: 'Multiple tasks', desc: 'Create and assign as many tasks as needed' },
                        { Icon: Users, title: 'Roles & permissions', desc: 'Owner, Admin, and Member access controls' },
                      ].map(({ Icon, title, desc }) => (
                        <Box key={title} flexDirection="row" alignItems="center" gap="12">
                          <Box width={32} height={32} borderRadius="4" backgroundColor="grey02" alignItems="center" justifyContent="center">
                            <Icon size={16} color={theme.colors.grey06} />
                          </Box>
                          <Box style={{ gap: 2 }}>
                            <Text variant="webBody" color="foreground">{title}</Text>
                            <Text variant="webMetadataPrimary" color="textSecondary">{desc}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    {/* Right column */}
                    <Box flex={1} gap="20" paddingLeft="24">
                      {[
                        { Icon: Database, title: '2TB of shared storage', desc: 'Plenty of space for files and assets' },
                        { Icon: Activity, title: 'Global activity log', desc: 'Full history of everything the team does' },
                        { Icon: FileText, title: 'All project templates', desc: 'Start faster with ready-made structures' },
                      ].map(({ Icon, title, desc }) => (
                        <Box key={title} flexDirection="row" alignItems="center" gap="12">
                          <Box width={32} height={32} borderRadius="4" backgroundColor="grey02" alignItems="center" justifyContent="center">
                            <Icon size={16} color={theme.colors.grey06} />
                          </Box>
                          <Box style={{ gap: 2 }}>
                            <Text variant="webBody" color="foreground">{title}</Text>
                            <Text variant="webMetadataPrimary" color="textSecondary">{desc}</Text>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>

                {/* ── Renew CTA Card ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="border" borderRadius="8" padding="24" flexDirection="row" justifyContent="space-between" alignItems="center">
                  <Box gap="4">
                    <Text variant="webLabelEmphasized" color="alertRed">Renew to restore full access</Text>
                    <Text variant="webMetadataPrimary" color="textSecondary">Your team gets full access back the moment payment is confirmed</Text>
                  </Box>
                  <Button variant="fill" color="secondary" size="lg" style={{ paddingHorizontal: 24, backgroundColor: theme.colors.black }}>
                    Renew Plan
                  </Button>
                </Box>

                {/* ── Invoices Table Card ── */}
                <Box backgroundColor="card" borderWidth={1} borderColor="border" style={{ borderRadius: 8, zIndex: 1, overflow: 'hidden' }}>
                    <Box>
                      {/* Table header row */}
                      <Box flexDirection="row" backgroundColor="grey01">
                        <Box style={{ flex: 1.5, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Box flexDirection="row" alignItems="center" gap="4">
                             <Text variant="webMetadataPrimary" color="grey05">DATE</Text>
                             <ArrowDownUp size={12} color={theme.colors.grey05} />
                          </Box>
                        </Box>
                        <Box style={{ flex: 3.5, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">DESCRIPTION</Text>
                        </Box>
                        <Box style={{ flex: 1.5, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">AMOUNT</Text>
                        </Box>
                        <Box style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 10 }}>
                          <Text variant="webMetadataPrimary" color="grey05">STATUS</Text>
                        </Box>
                      </Box>

                      {/* Data rows */}
                      {INVOICE_DATA.map((inv, idx) => (
                        <Box key={idx} flexDirection="row" borderTopWidth={1} borderColor="border" paddingVertical="12" alignItems="center">
                          <Box flex={1.5} paddingHorizontal={16}><Text variant="webSecondaryBody" color="foreground">{inv.date}</Text></Box>
                          <Box flex={3.5} paddingHorizontal={16}><Text variant="webSecondaryBody" color="foreground">{inv.desc}</Text></Box>
                          <Box flex={1.5} paddingHorizontal={16}><Text variant="webSecondaryBody" color="foreground">{inv.amount}</Text></Box>
                          <Box flex={1} paddingHorizontal={16}>
                            <Box backgroundColor="lightMint" style={{ alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 }}>
                              <Text style={{ fontSize: 11, fontWeight: '600', color: theme.colors.secondaryGreen }}>{inv.status}</Text>
                            </Box>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                </Box>

              </Box>
            )}
          </Box>
        </ScrollView>
      </Box>

      {/* ── Chat List Panel ── */}
      <Box flex={1} backgroundColor="background" borderLeftWidth={1} borderColor="border" style={{ height: '100%' as any, maxWidth: 550, position: 'relative' as any }}>
        <Box flexDirection="row" alignItems="center" justifyContent="space-between" backgroundColor="background" style={{ height: 74, paddingHorizontal: 24, paddingVertical: 12 }}>
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>Chat</Text>
          <Box flexDirection="row" alignItems="center">
            <Pressable style={{ padding: 4 }}><Search size={24} color={theme.colors.textSecondary} /></Pressable>
            <Pressable style={{ padding: 4 }}><MoreVertical size={24} color={theme.colors.textSecondary} /></Pressable>
            <Pressable style={{ padding: 4 }}><ChevronsRight size={24} color={theme.colors.textSecondary} /></Pressable>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 16 }}>
            <Box width={48} height={48} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelOrange" style={{ flexShrink: 0 } as any}>
              <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 22 }}>OH</Text>
            </Box>
            <Box flex={1} style={{ minWidth: 0, gap: 4 }}>
              <Text variant="webSecondaryBody" color="foreground">Oscar H.</Text>
              <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>{"Added to Painting Team"}</Text>
            </Box>
            <Text variant="webMetadataPrimary" color="grey04">Today</Text>
          </Box>

          <Box flexDirection="row" alignItems="center" style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10, gap: 16 }}>
            <Box width={48} height={48} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelOrange" style={{ flexShrink: 0 } as any}>
              <Text style={{ fontWeight: '600', color: '#FFFFFF', fontSize: 22 }}>TH</Text>
            </Box>
            <Box flex={1} style={{ minWidth: 0, gap: 4 }}>
              <Text variant="webSecondaryBody" color="foreground">Tasktag Helpdesk</Text>
              <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>
                Hi there! Welcome to TaskTag! We're here to assist you with any questions or support requests you might have.
              </Text>
            </Box>
            <Text variant="webMetadataPrimary" color="grey04">Yesterday</Text>
          </Box>
        </ScrollView>

        <Pressable style={{ position: 'absolute' as any, bottom: 16, right: 16, backgroundColor: theme.colors.foreground, borderRadius: 156, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 12, gap: 8 }}>
          <MessageSquarePlus size={24} color={theme.colors.white} />
          <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white }}>New Message</Text>
        </Pressable>
      </Box>

      {/* ── Role Dropdown Portal ── */}
      {openRoleDropdown !== null && dropdownPos !== null && (
        <>
          {/* Click-away overlay */}
          <Pressable
            onPress={closeDropdown}
            style={Platform.select({
              web: {
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9990,
              } as any,
              default: {
                position: 'absolute' as any,
                top: 0, left: 0, right: 0, bottom: 0,
                zIndex: 9990,
              },
            })}
          />
          {/* Dropdown positioned under the trigger */}
          <Box
            style={Platform.select({
              web: {
                position: 'fixed',
                top: dropdownTop,
                right: dropdownRight,
                zIndex: 9999,
              } as any,
              default: {
                position: 'absolute' as any,
                top: dropdownTop,
                right: dropdownRight,
                zIndex: 9999,
              },
            })}
          >
            <RoleDropdownContent
              onSelect={handleDropdownSelect}
              onClose={closeDropdown}
            />
          </Box>
        </>
      )}

      {/* ── Invite Modal ── */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}

      {/* ── Remove Member Confirmation ── */}
      {removingMember && <RemoveMemberModal memberName={removingMember} onClose={() => setRemovingMember(null)} />}

      {/* ── Cancel Invite Confirmation ── */}
      {cancelingInvite && <CancelInviteModal emailOrName={cancelingInvite} onClose={() => setCancelingInvite(null)} />}

      {/* ── Resend Toast ── */}
      {showResendToast && <ResendToast onDone={() => setShowResendToast(false)} />}

      {/* ── Upgrade Modal ── */}
      <UpgradeModal visible={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} teamName="Painting Team" />

    </Box>
  );
}
