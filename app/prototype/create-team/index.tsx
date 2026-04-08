import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { AppSidebar, AppChatPanel, useAppSidebar } from './_shared-layout';
import { Button } from '@/components/Button';
import { TextInput as DSTextInput } from '@/components/TextInput';
import {
  Activity,
  AlertTriangle,
  Building2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  Hash,
  HelpCircle,
  Info,
  Link,
  LogOut,
  Mail,
  MapPin,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';

const NAV_ITEMS = [
  { key: 'projects', label: 'Projects', Icon: Folder, active: false },
  { key: 'tasks', label: 'My Tasks', Icon: Hash, active: false },
  { key: 'activity', label: 'Global Activity', Icon: Activity, active: false },
  { key: 'contacts', label: 'Contacts', Icon: Users, active: false },
];

const TEAMS_DATA = [
  {
    id: 'personal',
    name: 'Personal Projects',
    iconType: 'building' as const,
    myRole: 'Owner (Personal Project)',
    members: 1,
    plan: { label: 'Basic Plan', type: 'basic' as const },
    showUpgrade: false,
  },
];

// ── Invite Modal data & helpers (duplicated from team-detail) ──

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

function InviteHighlightText({ text, query, baseStyle }: { text: string; query: string; baseStyle: any }) {
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
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: avatar.color, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.35 }}>{avatar.initials}</Text>
    </View>
  );
}

function InviteRoleDropdown({ onSelect, onClose }: { onSelect: (role: string) => void; onClose: () => void }) {
  const theme = useTheme<Theme>();
  const roles = [
    { label: 'Admin', description: 'Can access team projects, create new ones, manage roles & permission and invite new people.' },
    { label: 'Member', description: 'Can access team projects and invite new people.' },
  ];
  return (
    <View style={{ backgroundColor: theme.colors.white, borderRadius: 12, paddingVertical: 8, borderWidth: 1, borderColor: theme.colors.grey03, overflow: 'hidden', ...Platform.select({ web: { width: 360, boxShadow: '0px 4px 24px rgba(0,0,0,0.14)' } as any }) }}>
      {roles.map((role, i) => (
        <Pressable
          key={role.label}
          onPress={() => { onSelect(role.label); onClose(); }}
          style={({ pressed, hovered }: any) => ({ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < roles.length - 1 ? 1 : 0, borderBottomColor: theme.colors.grey03, backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: theme.colors.foreground, marginBottom: 4 }}>{role.label}</Text>
          <Text style={{ fontSize: 13, color: theme.colors.grey05, lineHeight: 18 }}>{role.description}</Text>
        </Pressable>
      ))}
    </View>
  );
}

function InviteCopyLinkButton() {
  const theme = useTheme<Theme>();
  const [copied, setCopied] = useState(false);
  return (
    <Pressable
      onPress={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      style={({ hovered, pressed }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
    >
      <Link size={14} color={theme.colors.blue} />
      <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.blue }}>{copied ? 'Copied!' : 'Copy Link'}</Text>
    </Pressable>
  );
}

function InviteModal({ onClose }: { onClose: () => void }) {
  const theme = useTheme<Theme>();
  const [inputValue, setInputValue] = useState('');
  const [invitees, setInvitees] = useState<InviteeEntry[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [openInviteeRole, setOpenInviteeRole] = useState<string | null>(null);
  const [inviteeRolePos, setInviteeRolePos] = useState<{ top: number; right: number } | null>(null);
  const inviteeRoleRefs = useRef<{ [id: string]: View | null }>({});
  const inputContainerRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const query = inputValue.trim();
  const showDropdown = query.length > 0;

  const filteredContacts = INVITE_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase())
  );
  const filteredGroups = INVITE_GROUPS.filter(g => g.name.toLowerCase().includes(query.toLowerCase()));

  const addInvitee = (contact: InviteeContact) => {
    if (!invitees.find(i => i.id === contact.id)) setInvitees(prev => [...prev, { ...contact, role: 'Member' }]);
    setInputValue('');
  };
  const removeInvitee = (id: string) => setInvitees(prev => prev.filter(i => i.id !== id));

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

  const measureInputPosition = useCallback(() => {
    if (inputContainerRef.current) {
      (inputContainerRef.current as any).measureInWindow((x: number, y: number, w: number, h: number) => {
        if (w > 0) setDropdownPos({ top: y + h - 14, left: x, width: w });
      });
    }
  }, []);

  useEffect(() => {
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
          onPress={() => addInvitee({ id: `email-${query}`, name: `${query.toLowerCase()}@gmail.com`, email: `${query.toLowerCase()}@gmail.com`, avatar: { type: 'initials', initials: query.slice(0, 2).toUpperCase(), color: 'grey03' } })}
          style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
        >
          <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={18} color={theme.colors.grey05} />
          </View>
          <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>Invite: {query.toLowerCase()}@gmail.com</Text>
        </Pressable>
        {filteredContacts.map((contact) => (
          <View key={contact.id}>
            <View style={{ height: 1, backgroundColor: theme.colors.border }} />
            <Pressable
              onPress={() => addInvitee(contact)}
              style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
            >
              <InviteAvatar avatar={contact.avatar} size={40} />
              <View style={{ gap: 0 }}>
                <InviteHighlightText text={contact.name} query={query} baseStyle={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }} />
                <InviteHighlightText text={contact.email} query={query} baseStyle={{ fontSize: 13, color: theme.colors.grey05 }} />
              </View>
            </Pressable>
          </View>
        ))}
        {filteredGroups.map((group) => {
          const isExpanded = expandedGroups.has(group.id);
          return (
            <View key={group.id}>
              <View style={{ height: 1, backgroundColor: theme.colors.border }} />
              <Pressable
                onPress={() => toggleGroup(group.id)}
                style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.grey02, alignItems: 'center', justifyContent: 'center' }}>
                  {isExpanded ? <ChevronUp size={18} color={theme.colors.grey05} /> : <ChevronDown size={18} color={theme.colors.grey05} />}
                </View>
                <View style={{ gap: 0 }}>
                  <InviteHighlightText text={group.name} query={query} baseStyle={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }} />
                  <Text style={{ fontSize: 13, color: theme.colors.grey04 }}>{group.memberCount} members</Text>
                </View>
              </Pressable>
              {isExpanded && group.members.map((member) => (
                <View key={member.id}>
                  <View style={{ height: 1, backgroundColor: theme.colors.border }} />
                  <Pressable
                    onPress={() => addInvitee({ id: member.id, name: member.name, email: member.email, avatar: { type: 'initials', initials: member.initials, color: 'darkGreen' } })}
                    style={({ hovered }: any) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: 68, paddingRight: 16, paddingVertical: 12, backgroundColor: hovered ? theme.colors.grey01 : 'transparent', cursor: 'pointer' as any })}
                  >
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: INVITE_TEAL, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{member.initials}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{member.name}</Text>
                      <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{member.email}</Text>
                    </View>
                  </Pressable>
                </View>
              ))}
            </View>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingVertical: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.foreground, lineHeight: 24 }}>Invite or Add Member</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <InviteCopyLinkButton />
              <Pressable
                onPress={onClose}
                style={({ hovered, pressed }: any) => ({ width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent', cursor: 'pointer' as any })}
              >
                <X size={18} color={theme.colors.grey06} />
              </Pressable>
            </View>
          </View>

          {/* Body */}
          <View style={{ paddingHorizontal: 24, paddingBottom: 8 }}>
            <View ref={inputContainerRef}>
              <DSTextInput
                value={inputValue}
                onChangeText={(v) => { setInputValue(v); if (v.trim()) setTimeout(measureInputPosition, 0); }}
                placeholder="Add members by email, name or group"
              />
            </View>

            <View>
              {invitees.length > 0 ? (
                <View>
                  {invitees.map((invitee, i) => (
                    <View key={invitee.id}>
                      {i > 0 && <View style={{ height: 1, backgroundColor: theme.colors.border }} />}
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 }}>
                        <InviteAvatar avatar={invitee.avatar} size={44} />
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: '600', color: theme.colors.foreground }}>{invitee.name}</Text>
                          <Text style={{ fontSize: 13, color: theme.colors.grey05 }}>{invitee.email}</Text>
                        </View>
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
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', gap: 0, paddingVertical: 8 }}>
                  <Image source={{ uri: INVITE_ILLUSTRATION }} style={{ width: 86, height: 86 }} resizeMode="contain" />
                  <Text style={{ fontSize: 14, fontWeight: '400', color: theme.colors.foreground, lineHeight: 16, textAlign: 'center' }}>Bring your team on board</Text>
                  <Text style={{ marginTop: 10, fontSize: 12, color: theme.colors.grey05, lineHeight: 16, textAlign: 'center', letterSpacing: 0.24 }}>
                    Invite teammates or contact groups to start working together seamlessly.
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Footer */}
          <View style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16, gap: 10 }}>
            <View style={{ borderTopWidth: invitees.length > 0 ? 1 : 0, borderColor: theme.colors.border, paddingTop: invitees.length > 0 ? 16 : 0 }}>
              <Button disabled={invitees.length === 0} color="secondary" size="xl" onPress={() => router.push({ pathname: '/prototype/create-team/team-detail', params: { newMembers: JSON.stringify(invitees) } })} style={{ width: '100%' as any }}>
                Send Invite
              </Button>
            </View>
            <Button variant="ghost" color="secondary" size="lg" onPress={() => router.push('/prototype/create-team/team-detail')} style={{ width: '100%' as any }}>
              Skip Now
            </Button>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
              <HelpCircle size={14} color={theme.colors.grey05} />
              <Text style={{ fontSize: 12, color: theme.colors.grey05, letterSpacing: 0.24 }}>Invitations expire after 7 days</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>

      {/* Dropdown portal */}
      {showDropdown && dropdownPos && (
        <>
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

      {/* Role dropdown portal */}
      {openInviteeRole !== null && inviteeRolePos !== null && (
        <>
          <Pressable
            onPress={() => { setOpenInviteeRole(null); setInviteeRolePos(null); }}
            style={Platform.select({
              web: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10003 } as any,
              default: { position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0, zIndex: 10003 },
            })}
          />
          <View
            style={Platform.select({
              web: { position: 'fixed', top: inviteeRolePos.top, right: inviteeRolePos.right, zIndex: 10004 } as any,
              default: { position: 'absolute' as any, top: inviteeRolePos.top, right: inviteeRolePos.right, zIndex: 10004 },
            })}
          >
            <InviteRoleDropdown
              onSelect={(role) => setInvitees(prev => prev.map(i => i.id === openInviteeRole ? { ...i, role: role as 'Member' | 'Admin' } : i))}
              onClose={() => { setOpenInviteeRole(null); setInviteeRolePos(null); }}
            />
          </View>
        </>
      )}
    </>
  );
}

export default function TeamList() {
  const theme = useTheme<Theme>();
  const sidebar = useAppSidebar();
  const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
  const [teamsTab, setTeamsTab] = useState<'teams' | 'subscriptions'>('teams');
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamName, setTeamName] = useState('Painting Team');
  const [teamLocation, setTeamLocation] = useState('Texas, USA');
  const [skills, setSkills] = useState([
    'Booths--Spray Painting',
    'Lead Paint Testing, Removal & Abatement',
    'Paint & Varnish Mfrs. & Distributors',
    'Painting Contractors',
  ]);

  return (
    <Box
      flex={1}
      flexDirection="row"
      backgroundColor="background"
      style={{ height: '100%' as any, position: 'relative' as any }}
    >

      {/* ── Sidebar ── */}
      <AppSidebar {...sidebar} />

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any }}>

        {/* Header */}
        <Box
          backgroundColor="card"
          borderBottomWidth={1}
          borderColor="border"
          style={{ height: 74, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 }}
        >
          <Text style={{ fontSize: 22, fontWeight: '600', color: theme.colors.foreground, lineHeight: 32 }}>My Account</Text>
          <Box flexDirection="row" alignItems="center" gap="12">
            <Pressable
              style={({ pressed, hovered }: any) => ({
                width: 32, height: 32, borderRadius: 6,
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: hovered ? theme.colors.grey02 : pressed ? theme.colors.grey03 : 'transparent',
                cursor: 'pointer' as any,
              })}
            >
              <Search size={20} color={theme.colors.textSecondary} />
            </Pressable>
            <Button
              variant="fill"
              size="sm"
              style={{ backgroundColor: theme.colors.black, borderRadius: 40 } as any}
            >
              <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                <Plus size={15} color={theme.colors.white} />
                <Text variant="labelMedium" style={{ color: theme.colors.white }}>New Task</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

          {/* Profile Tabs bar */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderColor="border"
            backgroundColor="card"
            style={{ height: 56, paddingLeft: 16, paddingRight: 16 }}
          >
            {/* Left: tabs */}
            <Box flexDirection="row" alignItems="stretch">
              {([
                { key: 'profile', label: 'My Profile', Icon: User },
                { key: 'settings', label: 'Settings', Icon: Settings },
              ] as const).map(({ key, label, Icon }) => {
                const isActive = activeTab === key;
                return (
                  <Pressable key={key} onPress={() => setActiveTab(key)} style={{ height: 56, width: 124 }}>
                    <Box flexDirection="column" alignItems="center" justifyContent="center" height={56} style={{ marginBottom: -1 }}>
                      <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ flex: 1, paddingHorizontal: 8, gap: 8 }}>
                        <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary} style={{ transition: 'color 0.2s ease' } as any} />
                        <Text variant="labelMedium" style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                      </Box>
                      <Box style={{ height: 2, width: '100%', backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', transition: 'background-color 0.2s ease' as any } as any} />
                    </Box>
                  </Pressable>
                );
              })}
            </Box>
            {/* Right: Log out — vertically centered in 56px bar */}
            <Pressable
              style={({ hovered }: any) => ({
                flexDirection: 'row', alignItems: 'center', gap: 6,
                paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
                backgroundColor: hovered ? theme.colors.grey01 : 'transparent',
                cursor: 'pointer' as any,
              })}
            >
              <LogOut size={14} color={theme.colors.alertRed} />
              <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.alertRed }}>Log out</Text>
            </Pressable>
          </Box>

          <Box style={{ padding: 16, gap: 24 }}>

            {/* ── Profile Card ── */}
            <Box style={{ borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, padding: 24, gap: 24, maxWidth: 560 }}>
              {/* User row */}
              <Box flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box flexDirection="row" alignItems="center" style={{ gap: 10 }}>
                  <Box width={48} height={48} borderRadius="full" alignItems="center" justifyContent="center" backgroundColor="pastelMagenta">
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFFFFF' }}>LS</Text>
                  </Box>
                  <Text style={{ fontSize: 18, fontWeight: '500', color: theme.colors.foreground }}>Linda Smith</Text>
                </Box>
                <Pressable
                  style={({ pressed, hovered }: any) => ({
                    width: 32, height: 32, borderRadius: 8,
                    alignItems: 'center', justifyContent: 'center',
                    backgroundColor: hovered ? theme.colors.grey01 : pressed ? theme.colors.grey02 : 'transparent',
                    cursor: 'pointer' as any,
                  })}
                >
                  <MoreVertical size={20} color={theme.colors.textSecondary} />
                </Pressable>
              </Box>

              {/* Info rows */}
              <Box>
                {[
                  { label: 'Location', value: 'Houston, TX' },
                  { label: 'Phone Number', value: '232-946-1254' },
                  { label: 'Email', value: 'lindasmith@tasktag.com' },
                ].map(({ label, value }) => (
                  <Box key={label} flexDirection="row" alignItems="center" justifyContent="space-between" style={{ paddingVertical: 8 }}>
                    <Text variant="webLabelEmphasized" color="foreground">{label}</Text>
                    <Text variant="webBody" color="textSecondary">{value}</Text>
                  </Box>
                ))}
                {/* Skills */}
                <Box style={{ paddingVertical: 8, gap: 8 }}>
                  <Text variant="webLabelEmphasized" color="foreground">Skills</Text>
                  <Box flexDirection="row" flexWrap="wrap" style={{ gap: 8 } as any}>
                    {['Carpenter', 'Electrician', 'Manager'].map(skill => (
                      <Box key={skill} style={{ backgroundColor: theme.colors.grey01, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 4 }}>
                        <Text variant="webLabelSmall" color="foreground">{skill}</Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* ── Teams Section ── */}
            <Box>
              {/* Teams tabs + Create button */}
              <Box
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                borderBottomWidth={1}
                borderColor="border"
                style={{ height: 56, paddingLeft: 16, paddingRight: 8 }}
              >
                <Box flexDirection="row" alignItems="stretch">
                  {([
                    { key: 'teams', label: 'Teams' },
                    { key: 'subscriptions', label: 'Subscriptions' },
                  ] as const).map(({ key, label }) => {
                    const isActive = teamsTab === key;
                    return (
                      <Pressable key={key} onPress={() => setTeamsTab(key)} style={{ height: 56, width: 140 }}>
                        <Box flexDirection="column" alignItems="center" justifyContent="center" height={56} style={{ marginBottom: -1 }}>
                          <Box flexDirection="row" alignItems="center" justifyContent="center" style={{ flex: 1, paddingHorizontal: 8 }}>
                            <Text variant="labelMedium" style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                          </Box>
                          <Box style={{ height: 2, width: '100%', backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', transition: 'background-color 0.2s ease' as any } as any} />
                        </Box>
                      </Pressable>
                    );
                  })}
                </Box>
                <Button
                  variant="fill"
                  size="sm"
                  onPress={() => setShowCreateTeamModal(true)}
                  style={{ backgroundColor: theme.colors.black, borderRadius: 40 } as any}
                >
                  <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                    <Plus size={15} color={theme.colors.white} />
                    <Text variant="labelMedium" style={{ color: theme.colors.white }}>Create Team</Text>
                  </Box>
                </Button>
              </Box>

              {/* Table — only bottom border on rows, no outer border */}
              <Box style={{ marginTop: 16 }}>
                {/* Column headers */}
                <Box flexDirection="row" backgroundColor="grey01">
                  <Box style={{ flex: 3, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text variant="webMetadataPrimary" color="grey05">Team Name</Text>
                  </Box>
                  <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text variant="webMetadataPrimary" color="grey05">My Role</Text>
                  </Box>
                  <Box style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text variant="webMetadataPrimary" color="grey05">Members</Text>
                  </Box>
                  <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 10 }}>
                    <Text variant="webMetadataPrimary" color="grey05">Plan</Text>
                  </Box>
                  <Box style={{ width: 80, paddingHorizontal: 8, paddingVertical: 10 }} />
                </Box>

                {/* Data rows */}
                {TEAMS_DATA.map((team) => (
                  <Box key={team.id} flexDirection="row" alignItems="center" borderBottomWidth={1} borderColor="border" style={{ height: 48 }}>

                    {/* Team Name */}
                    <Box style={{ flex: 3, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Box flexDirection="row" alignItems="center" gap="8">
                        <Box style={{ width: 32, height: 32, borderRadius: 4, backgroundColor: theme.colors.lightMint, alignItems: 'center', justifyContent: 'center' }}>
                          <Building2 size={16} color={theme.colors.secondaryGreen} />
                        </Box>
                        <Text variant="webSecondaryBody" color="foreground" numberOfLines={1} style={{ flex: 1 }}>{team.name}</Text>
                      </Box>
                    </Box>

                    {/* My Role */}
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Text variant="webSecondaryBody" color="foreground">{team.myRole}</Text>
                    </Box>

                    {/* Members */}
                    <Box style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Text variant="webSecondaryBody" color="foreground">{team.members}</Text>
                    </Box>

                    {/* Plan */}
                    <Box style={{ flex: 2, paddingHorizontal: 16, paddingVertical: 8 }}>
                      <Box style={{ backgroundColor: theme.colors.lightMint, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 12, color: theme.colors.secondaryGreen }}>{team.plan.label}</Text>
                      </Box>
                    </Box>

                    {/* Action */}
                    <Box style={{ width: 80 }} />
                  </Box>
                ))}
              </Box>
            </Box>

          </Box>
        </ScrollView>
      </Box>

      {/* ── Chat Panel ── */}
      <AppChatPanel />

      {/* ── Invite or Add Member Modal ── */}
      {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} />}

      {/* ── Create Team Modal ── */}
      {showCreateTeamModal && (
        <Pressable
          onPress={() => setShowCreateTeamModal(false)}
          style={{
            position: 'fixed' as any,
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: theme.colors.white,
              borderRadius: 16,
              width: 504,
              ...Platform.select({ web: { boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' } as any }),
            }}
          >
            {/* Fix section — header + content */}
            <Box style={{ gap: 24, paddingBottom: 8 }}>

              {/* Modal Heading */}
              <Box flexDirection="row" alignItems="center" justifyContent="space-between"
                style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#0A1629', lineHeight: 24 }}>Team Setup</Text>
                <Pressable
                  onPress={() => setShowCreateTeamModal(false)}
                  hitSlop={8}
                  style={({ hovered }: any) => ({
                    width: 20, height: 20,
                    alignItems: 'center', justifyContent: 'center',
                    opacity: hovered ? 0.6 : 1,
                    cursor: 'pointer' as any,
                  })}
                >
                  <X size={18} color={theme.colors.foreground} />
                </Pressable>
              </Box>

              {/* l-team */}
              <Box alignItems="center" style={{ gap: 16, paddingHorizontal: 16 }}>

                {/* Logo */}
                <Box alignItems="center" style={{ gap: 8 }}>
                  <Box style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: '#18a87d', alignItems: 'center', justifyContent: 'center' }}>
                    <Building2 size={24} color={theme.colors.white} />
                  </Box>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#18a87d', lineHeight: 16 }}>Add Logo</Text>
                </Box>

                {/* Name field */}
                <Box style={{ width: '100%' as any }}>
                  <DSTextInput
                    label="Name"
                    required
                    value={teamName}
                    onChangeText={setTeamName}
                  />
                </Box>

                {/* Location field */}
                <Box style={{ width: '100%' as any }}>
                  <DSTextInput
                    label="Location"
                    value={teamLocation}
                    onChangeText={setTeamLocation}
                    placeholder="Search by a city or zip"
                    icon={MapPin}
                  />
                </Box>

                {/* Skills */}
                <Box style={{ width: '100%' as any, gap: 8 }}>
                  <Box flexDirection="row" alignItems="center" style={{ gap: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#0A1629', lineHeight: 16 }}>Skills</Text>
                    <Info size={16} color={theme.colors.foreground} />
                  </Box>
                  {/* Skills tags row — "+ Add Skills" pill + tags inline */}
                  <Box flexDirection="row" flexWrap="wrap" style={{ gap: 8 } as any}>
                    <Pressable
                      style={({ hovered }: any) => ({
                        flexDirection: 'row', alignItems: 'center', gap: 4,
                        backgroundColor: hovered ? theme.colors.grey06 : theme.colors.black,
                        borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6,
                        cursor: 'pointer' as any,
                      })}
                    >
                      <Plus size={12} color={theme.colors.white} />
                      <Text style={{ fontSize: 13, fontWeight: '500', color: theme.colors.white }}>Add Skills</Text>
                    </Pressable>
                    {skills.map((skill) => (
                      <Box
                        key={skill}
                        flexDirection="row"
                        alignItems="center"
                        style={{ backgroundColor: theme.colors.grey02, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, gap: 6 }}
                      >
                        <Text style={{ fontSize: 13, color: theme.colors.foreground }}>{skill}</Text>
                        <Pressable
                          onPress={() => setSkills(prev => prev.filter(s => s !== skill))}
                          hitSlop={6}
                          style={{ cursor: 'pointer' as any }}
                        >
                          <X size={12} color="#828282" />
                        </Pressable>
                      </Box>
                    ))}
                  </Box>
                </Box>

              </Box>
            </Box>

            {/* l-actions */}
            <Box flexDirection="row" alignItems="center" justifyContent="flex-end"
              style={{ padding: 16, gap: 8 }}>
              <Pressable
                onPress={() => setShowCreateTeamModal(false)}
                style={({ hovered }: any) => ({
                  height: 48, borderRadius: 8, paddingHorizontal: 16,
                  alignItems: 'center', justifyContent: 'center',
                  borderWidth: 1, borderColor: theme.colors.black,
                  backgroundColor: hovered ? theme.colors.grey01 : theme.colors.white,
                  cursor: 'pointer' as any,
                })}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.black, lineHeight: 16 }}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => { setShowCreateTeamModal(false); setShowInviteModal(true); }}
                style={({ hovered }: any) => ({
                  height: 48, width: 107, borderRadius: 8, paddingHorizontal: 16,
                  alignItems: 'center', justifyContent: 'center',
                  backgroundColor: hovered ? '#1a1a1a' : theme.colors.black,
                  cursor: 'pointer' as any,
                })}
              >
                <Text style={{ fontSize: 14, fontWeight: '500', color: theme.colors.white, lineHeight: 16 }}>Next</Text>
              </Pressable>
            </Box>
          </Pressable>
        </Pressable>
      )}

    </Box>
  );
}
