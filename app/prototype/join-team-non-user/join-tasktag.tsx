import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Folder,
  Hash,
  HelpCircle,
  Image as ImageIcon,
  Link,
  ListFilter,
  MessageSquare,
  Plus,
  Search,
  User,
  UserPlus,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView } from 'react-native';
import JoinTasktagSignup from './join-tasktag-signup';


const PROJECT = {
  name: 'Houston Construction Team',
  address: '11 N Raintree Hollow Court',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  memberCount: 7,
};

const TABS = [
  { key: 'tasks', label: 'Tasks', Icon: Hash },
  { key: 'checklist', label: 'Checklist', Icon: FileText },
  { key: 'files', label: 'Files & Media', Icon: ImageIcon },
  { key: 'activity', label: 'Activity Log', Icon: Activity },
  { key: 'members', label: 'Members', Icon: Users, badge: PROJECT.memberCount },
];

function SkillsTooltip({ skills }: { skills: string[] }) {
  const theme = useTheme<Theme>();
  const [visible, setVisible] = React.useState(false);
  const overflow = skills.length - 2;
  return (
    <Pressable
      onPress={() => setVisible(v => !v)}
      onHoverIn={() => setVisible(true)}
      onHoverOut={() => setVisible(false)}
      style={{ position: 'relative', zIndex: 9999, overflow: 'visible' } as any}
    >
      <Text variant="webBody" color="textSecondary">
        +{overflow} more
      </Text>
      {visible && (
        <Box
          style={{
            position: 'absolute',
            top: 28,
            left: 0,
            backgroundColor: theme.colors.black,
            borderRadius: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            zIndex: 9999,
            elevation: 9999,
            minWidth: 140,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
          } as any}
        >
          {skills.map((s, i) => (
            <Text key={i} variant="webBody" style={{ color: theme.colors.white, lineHeight: 22 }}>{s}</Text>
          ))}
        </Box>
      )}
    </Pressable>
  );
}

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [activeTab, setActiveTab] = useState('tasks');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box
      flex={1}
      flexDirection="row"
      backgroundColor="background"
      style={{ height: '100%' as any, position: 'relative' as any }}
    >
      {/* ── Sidebar ── */}
      <Box
        backgroundColor="grey01"
        borderRightWidth={1}
        borderColor="border"
        style={{
          width: sidebarCollapsed ? 72 : 256,
          maxWidth: 256,
          height: '100%' as any,
          paddingHorizontal: 16,
          paddingVertical: 24,
          gap: 30,
        }}
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
              {/* Projects — real */}
              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.lightMint, alignSelf: 'center' }}>
                  <Folder size={22} color={theme.colors.secondaryGreen} />
                </Box>
              ) : (
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15, backgroundColor: theme.colors.lightMint }}>
                  <Folder size={24} color={theme.colors.secondaryGreen} />
                  <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>Projects</Text>
                </Box>
              )}

              {/* Placeholder wireframes */}
              {sidebarCollapsed ? (
                <Box gap="8">
                  {[Hash, Activity, Users].map((Icon, i) => (
                    <Box key={i} alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                      <Icon size={22} color={theme.colors.grey03} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box gap="8">
                  {[
                    { Icon: Hash, w: 120 },
                    { Icon: Activity, w: 100 },
                    { Icon: Users, w: 140 },
                  ].map(({ Icon, w }, i) => (
                    <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon size={24} color={theme.colors.grey03} />
                      <Box style={{ width: w, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box gap="8">
              <Box height={1} backgroundColor="border" />
              {/* Bottom placeholder wireframes */}
              {sidebarCollapsed ? (
                <Box gap="8">
                  {[HelpCircle, User].map((Icon, i) => (
                    <Box key={i} alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                      <Icon size={22} color={theme.colors.grey03} />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box gap="8">
                  {[
                    { Icon: HelpCircle, w: 80 },
                    { Icon: User, w: 100 },
                  ].map(({ Icon, w }, i) => (
                    <Box key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                      <Icon size={24} color={theme.colors.grey03} />
                      <Box style={{ width: w, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} backgroundColor="background" style={{ height: '100%' as any }}>

        {/* ── Header bar ── */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="md"
          paddingVertical="12"
          borderBottomWidth={1}
          borderColor="border"
          backgroundColor="card"
          height={74}
        >
          {/* Left: title + address */}
          <Box flex={1} flexShrink={1}>
            <Box flexDirection="row" alignItems="center" gap="8" marginBottom="4">
              <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1 }}>
                {PROJECT.name}
              </Text>
            </Box>
            <Text variant="webMetadataPrimary" color="textSecondary">
              {PROJECT.address}
            </Text>
          </Box>

          {/* Right: search + New Task (filled, disabled, pill) */}
          <Box flexDirection="row" alignItems="center" gap="16">
            <Pressable hitSlop={8}>
              <Search size={20} color={theme.colors.grey04} />
            </Pressable>
            <Button
              variant="fill"
              color="secondary"
              size="sm"
              disabled
              style={{ borderRadius: 40, minWidth: 122 }}
            >
              <Box flexDirection="row" alignItems="center" gap="8">
                <Plus size={16} color={theme.colors.grey05} />
                <Text variant="labelMedium" color="grey05">New Task</Text>
              </Box>
            </Button>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* ── Description card ── */}
          <Box padding="md">
            <Box
              backgroundColor="grey01"
              borderRadius="8"
              padding="md"
              gap="8"
            >
              <Text variant="webLabelEmphasized" color="foreground">Description</Text>
              <Text variant="webMetadataPrimary" color="textSecondary" style={{ lineHeight: 18 }}>
                {PROJECT.description}
              </Text>
            </Box>
          </Box>

          {/* ── Tabs bar ── */}
          <Box
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderColor="border"
            height={56}
            paddingHorizontal="md"
          >
            {/* Tabs list */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ flexShrink: 1 }}
              contentContainerStyle={{ alignItems: 'stretch' }}
            >
              {TABS.map(({ key, label, Icon, badge }) => {
                const isActive = activeTab === key;
                return (
                  <Pressable
                    key={key}
                    onPress={() => setActiveTab(key)}
                    style={{ height: '100%' }}
                  >
                    <Box
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="flex-end"
                      height={56}
                      minWidth={96}
                      style={{ paddingTop: 8, marginBottom: -1 }}
                    >
                      <Box flexDirection="row" alignItems="center" gap="8" height={32} justifyContent="center" paddingHorizontal="8">
                        <Icon size={16} color={isActive ? theme.colors.secondaryGreen : theme.colors.grey04} style={{ transition: 'color 0.2s ease' } as any} />
                        <Text
                          variant="labelMedium"
                          color={isActive ? 'secondaryGreen' : 'grey04'}
                          style={{ transition: 'color 0.2s ease' } as any}
                        >
                          {label}
                        </Text>
                        {badge !== undefined && (
                          <Box
                            backgroundColor={isActive ? 'black' : 'grey04'}
                            borderRadius="full"
                            width={20}
                            height={20}
                            alignItems="center"
                            justifyContent="center"
                            style={{ transition: 'background-color 0.2s ease' } as any}
                          >
                            <Text variant="caption" color="white" style={{ fontSize: 10 }}>{badge}</Text>
                          </Box>
                        )}
                      </Box>
                      {/* Active underline */}
                      <Box
                        height={2}
                        width="100%"
                        backgroundColor={isActive ? 'secondaryGreen' : 'transparent'}
                        style={{ marginTop: 'auto', transition: 'background-color 0.2s ease' } as any}
                      />
                    </Box>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Right actions */}
            <Box flexDirection="row" alignItems="center" gap="md" style={{ paddingLeft: 16 }}>
              <Pressable hitSlop={8}>
                <Link size={20} color={theme.colors.grey04} />
              </Pressable>
              {/* Invite — outline, disabled, pill */}
              <Button
                variant="outline"
                color="secondary"
                size="sm"
                disabled
                style={{ borderRadius: 40, minWidth: 122 }}
              >
                <Box flexDirection="row" alignItems="center" gap="8">
                  <UserPlus size={16} color={theme.colors.grey05} />
                  <Text variant="labelMedium" color="grey05">Invite</Text>
                </Box>
              </Button>
            </Box>
          </Box>

          {/* ── Tab Content ── */}
          {activeTab === 'members' ? (
            <Box flex={1} style={{ position: 'relative', minHeight: 520 }}>
                  <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 10,
                    backdropFilter: 'blur(2px)',
                    backgroundColor: 'rgba(247, 248, 250, 0.5)',
                  } as any}
                >
                  <Box flex={1} justifyContent="center" alignItems="center">
                    <Box alignItems="center" style={{ gap: 16 }}>
                      <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
                      <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                        {"You've been invited to this team by "}
                        <Text variant="webHeading22" fontWeight="700">James Hammer</Text>
                      </Text>
                    </Box>
                    <Button
                      variant="fill"
                      size="lg"
                      style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.foreground, marginTop: 16 }}
                      onPress={() => setShowSignupModal(true)}
                    >
                      <Text color="white" variant="labelMedium">Join This Team</Text>
                    </Button>
                </Box>
              </Box>

              {/* ── Toolbar: Filter + Start a Chat (both disabled) ── */}
              <Box
                flexDirection="row"
                alignItems="center"
                gap="16"
                paddingHorizontal="md"
                paddingVertical="12"
                borderBottomWidth={1}
                borderColor="border"
              >
                <Button variant="ghost" size="sm" disabled style={{ opacity: 0.55, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <ListFilter size={15} color={theme.colors.textSecondary} />
                  <Text variant="webBody" color="textSecondary">Filter</Text>
                </Button>
                <Button variant="ghost" size="sm" disabled style={{ opacity: 0.55, flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MessageSquare size={15} color={theme.colors.textSecondary} />
                  <Text variant="webBody" color="textSecondary">Start a Chat</Text>
                </Button>
              </Box>

              {/* ── Members Table ── */}
              <Box>

                {/* Table column headers: Name, Skills, Role only */}
                <Box
                  flexDirection="row"
                  alignItems="center"
                  paddingHorizontal="md"
                  paddingVertical="12"
                  borderBottomWidth={1}
                  borderColor="border"
                  backgroundColor="grey01"
                >
                  <Text variant="webBody" color="textSecondary" style={{ flex: 3 }}>Name</Text>
                  <Text variant="webBody" color="textSecondary" style={{ flex: 3 }}>Skills</Text>
                  <Text variant="webBody" color="textSecondary" style={{ flex: 2 }}>Role</Text>
                </Box>

                {/* Member rows (7 active) */}
                {[
                  { name: 'James Hammer', skills: [], role: 'Owner', avatarColor: theme.colors.secondaryGreen, avatarBg: theme.colors.lightMint },
                  { name: 'John Doe', skills: ['Carpenter'], role: 'Editor', avatarColor: theme.colors.purple, avatarBg: theme.colors.lightLavenderBlue },
                  { name: 'Jane Smith', skills: [], role: 'Editor', avatarColor: theme.colors.orange, avatarBg: theme.colors.lightPeach },
                  { name: 'Chelsea Smith', skills: ['Carpenter', 'Electrician', 'Plumber', 'Welder'], role: 'Viewer', avatarColor: theme.colors.pastelBlue, avatarBg: theme.colors.lightSky },
                  { name: 'Logan Jack', skills: [], role: 'Viewer', avatarColor: theme.colors.pastelPurple, avatarBg: theme.colors.lightPurple },
                  { name: 'Oscar Edison', skills: [], role: 'Editor', avatarColor: theme.colors.pastelOrange, avatarBg: theme.colors.lightPeach },
                  { name: 'Abby Monroe', skills: ['Painter', 'Plumber', 'Welder', 'HVAC', 'Roofer'], role: 'Editor', avatarColor: theme.colors.pastelMagenta, avatarBg: theme.colors.lightLavender },
                ].map((member, idx, arr) => (
                  <Box
                    key={member.name}
                    flexDirection="row"
                    alignItems="center"
                    paddingHorizontal="md"
                    style={{ paddingVertical: 14 }}
                    borderBottomWidth={idx === arr.length - 1 ? 0 : 1}
                    borderColor="border"
                  >
                    {/* Name + avatar */}
                    <Box style={{ flex: 3 }} flexDirection="row" alignItems="center" gap="12">
                      <Box
                        width={32}
                        height={32}
                        borderRadius="full"
                        alignItems="center"
                        justifyContent="center"
                        style={{ backgroundColor: member.avatarBg }}
                      >
                        <Text style={{ fontWeight: '700', color: member.avatarColor, fontSize: 11 }}>
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </Text>
                      </Box>
                      <Text variant="webBody" color="textSecondary">{member.name}</Text>
                    </Box>

                    {/* Skills */}
                    <Box style={{ flex: 3 }}>
                      {member.skills.length === 0 ? (
                        <Text variant="webBody" color="textSecondary">-</Text>
                      ) : member.skills.length <= 2 ? (
                        <Text variant="webBody" color="textSecondary">{member.skills.join(', ')}</Text>
                      ) : (
                        <Box flexDirection="row" alignItems="center" gap="4" style={{ position: 'relative' }}>
                          <Text variant="webBody" color="textSecondary">
                            {member.skills.slice(0, 2).join(', ')}
                          </Text>
                          <SkillsTooltip skills={member.skills} />
                        </Box>
                      )}
                    </Box>

                    {/* Role */}
                    <Box style={{ flex: 2 }}>
                      <Text variant="webBody" color="textSecondary">{member.role}</Text>
                    </Box>
                  </Box>
                ))}
              </Box>
              </Box>
            ) : (
            /* ── Default Tab Content (Empty State) ── */
            <Box
              flex={1}
              alignItems="center"
              justifyContent="center"
              minHeight={520}
              style={{
                backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #F7F8FA)',
              } as any}
            >
              <Box alignItems="center" style={{ gap: 16 }}>
                <UserPlus size={40} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text variant="webHeading22" color="foreground" textAlign="center" style={{ fontWeight: '400' }}>
                  {"You've been invited to this team by "}
                  <Text variant="webHeading22" fontWeight="700">James Hammer</Text>
                </Text>
              </Box>
              <Button
                variant="fill"
                size="lg"
                style={{ borderRadius: 40, minWidth: 220, backgroundColor: theme.colors.foreground, marginTop: 16 }}
                onPress={() => setShowSignupModal(true)}
              >
                <Text color="white" variant="labelMedium">Join This Team</Text>
              </Button>
            </Box>
          )}
        </ScrollView>
      </Box>

      {/* ── Chat Panel ── */}
      <Box
        backgroundColor="card"
        borderLeftWidth={1}
        borderColor="border"
        style={{ width: 550, maxWidth: 550, height: '100%' as any, position: 'relative' as any }}
      >
        {/* Header */}
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ height: 74, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text variant="webHeading22" color="foreground" style={{ fontWeight: '600' }}>Chat</Text>
        </Box>

        {/* Chat list */}
        <Box style={{ paddingHorizontal: 6 }}>
          <Box
            flexDirection="row"
            alignItems="flex-start"
            style={{ paddingHorizontal: 16, paddingVertical: 10, gap: 16 }}
          >
            {/* Avatar */}
            <Box
              width={48}
              height={48}
              borderRadius="full"
              alignItems="center"
              justifyContent="center"
              style={{ backgroundColor: theme.colors.orange, flexShrink: 0 }}
            >
              <User size={24} color={theme.colors.white} />
            </Box>

            {/* Name + message */}
            <Box flex={1} flexDirection="row" alignItems="center" alignSelf="stretch" style={{ minWidth: 0 }}>
              <Box flex={1} style={{ gap: 8 }}>
                <Box style={{ width: 120, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                <Box style={{ width: '85%', height: 12, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
              </Box>
            </Box>

            {/* Timestamp column — stretches full height, centers content */}
            <Box
              flexDirection="column"
              alignSelf="stretch"
              justifyContent="center"
              alignItems="flex-end"
              style={{ gap: 8, flexShrink: 0 }}
            >
              <Box width={16} height={16} />
              <Box style={{ width: 40, height: 10, borderRadius: 4, backgroundColor: theme.colors.grey03 }} />
            </Box>
          </Box>
        </Box>

      </Box>

      {/* ── Signup Modal Overlay ── */}
      <Modal
        visible={showSignupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignupModal(false)}
      >
        <Box style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
          {/* Backdrop tap to close */}
          <Pressable
            onPress={() => setShowSignupModal(false)}
            style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }}
          />
          {/* Signup content constrained */}
          <Box style={{ width: '100%', maxWidth: 640, maxHeight: '99%', borderRadius: 16, overflow: 'hidden' as any }}>
            <JoinTasktagSignup
              onClose={() => setShowSignupModal(false)}
              onSuccess={() => {
                setShowSignupModal(false);
                router.push('/prototype/join-team-non-user/project-dashboard' as any);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
