import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ArrowDownUp,
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
  Edit,
  Equal,
  FileText,
  Folder,
  Hash,
  HelpCircle,
  Link,
  ListFilter,
  LogOut,
  MessageSquare,
  MessageSquarePlus,
  MoreVertical,
  Plus,
  Repeat,
  Search,
  SortDesc,
  Star,
  Trash2,
  User,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, View } from 'react-native';

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
  { name: 'James Smith', skills: ['Lead Painter'], email: 'jamessmith@gmail.com', phone: '232-946-1254', role: 'Owner', avatar: { type: 'initials', initials: 'LS', color: 'pastelMagenta' } },
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
  { emailOrName: 'john.doe@gmail.com', invitedBy: 'Melissa Monroe', dateSent: 'Nov 1, 2025', expirationDate: 'Nov 7, 2025', role: 'Admin', status: 'pending' },
  { emailOrName: 'roberto@gmail.com', invitedBy: 'Abby Smith', dateSent: 'Nov 2, 2025', expirationDate: 'Nov 3, 2025', role: 'Member', status: 'near-expiry' },
  { emailOrName: 'sarah.k@gmail.com', invitedBy: 'James Smith', dateSent: 'Oct 20, 2025', expirationDate: 'Oct 27, 2025', role: 'Member', status: 'expired' },
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
  const visible = hovered || forceOpen;

  const isSuccess = variant === 'success';

  return (
    <View
      style={{ position: 'relative' as any, zIndex: visible ? 99999 : 1 }}
      {...Platform.select({
        web: {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        } as any,
      })}
    >
      {children}
      {visible && (
        <Box
          style={{
            position: 'absolute' as any,
            top: '100%',
            ...(align === 'left' ? { left: 0 } : { right: 0 }),
            marginTop: 6,
            backgroundColor: isSuccess ? theme.colors.white : theme.colors.grey06,
            borderRadius: 4,
            paddingHorizontal: isSuccess ? 12 : 8,
            paddingVertical: isSuccess ? 8 : 4,
            zIndex: 999999,
            ...(isSuccess ? { borderWidth: 1, borderColor: theme.colors.border } : {}),
            ...Platform.select({
              web: {
                pointerEvents: 'none',
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
            <Text numberOfLines={1} style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '500' }}>
              {label}
            </Text>
          )}
        </Box>
      )}
    </View>
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

export default function TeamDetail() {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('members');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeExpanded, setActiveExpanded] = useState(true);
  const [pendingExpanded, setPendingExpanded] = useState(true);

  // Dropdown portal state
  const [openRoleDropdown, setOpenRoleDropdown] = useState<string | null>(null);
  const [openTeamMenu, setOpenTeamMenu] = useState(false);
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
              { key: 'details', label: 'Details', Icon: CreditCard, count: undefined as number | undefined },
              { key: 'members', label: 'Members', Icon: Users, count: TEAM_MEMBERS.length as number | undefined },
              { key: 'invoice', label: 'Invoice', Icon: FileText, count: 1 as number | undefined },
            ].map(({ key, label, Icon, count }) => {
              const isActive = activeTab === key;
              return (
                <Pressable key={key} onPress={() => setActiveTab(key)} style={{ height: 56, width: 124 }}>
                  <Box flexDirection="column" alignItems="center" justifyContent="flex-end" height={56} style={{ paddingTop: 8, marginBottom: -1 }}>
                    <Box flexDirection="row" alignItems="center" style={{ height: 32, paddingHorizontal: 8, gap: 8 }} justifyContent="center">
                      <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary} style={{ transition: 'color 0.2s ease' } as any} />
                      <Text variant="labelMedium" style={{ color: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'color 0.2s ease' as any } as any}>{label}</Text>
                      {count !== undefined && (
                        <Box width={20} height={20} borderRadius="full" alignItems="center" justifyContent="center" style={{ backgroundColor: isActive ? theme.colors.secondaryGreen : theme.colors.textSecondary, transition: 'background-color 0.2s ease' } as any}>
                          <Text variant="webMetadataSecondary" color="white">{count}</Text>
                        </Box>
                      )}
                    </Box>
                    <Box style={{ height: 2, width: '100%', backgroundColor: isActive ? theme.colors.secondaryGreen : 'transparent', marginTop: 'auto', transition: 'background-color 0.2s ease' as any } as any} />
                  </Box>
                </Pressable>
              );
            })}
          </Box>
          <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
            <CopyLinkButton />
            <Pressable
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
          <Box flexDirection="row" alignItems="center" gap="8" paddingHorizontal="md" backgroundColor="card" style={{ paddingTop: 16, paddingBottom: 16 }}>
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
              <ListFilter size={15} color={theme.colors.black} />
              <Text variant="webBody" color="black">Filter</Text>
            </Pressable>
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

          <Box style={{ paddingTop: 0, paddingHorizontal: 16, paddingBottom: 16 }}>

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
                          <HoverIconButton icon={Trash2} size={16} color={theme.colors.grey06} tooltip="Delete Member" />
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
                          />
                          <HoverIconButton icon={Trash2} size={16} color={theme.colors.grey06} tooltip="Remove Invitation" />
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
            </Box>
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
              <Text variant="webMetadataPrimary" color="grey04" numberOfLines={1}>{"You've been added to Painting Team"}</Text>
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

    </Box>
  );
}
