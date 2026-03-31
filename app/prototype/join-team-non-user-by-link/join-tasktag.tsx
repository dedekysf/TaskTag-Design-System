import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  CreditCard,
  File,
  Folder,
  Hash,
  HelpCircle,
  Link,
  Plus,
  Search,
  Share,
  User,
  UserPlus,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView } from 'react-native';
import JoinTasktagSignup from './join-tasktag-signup';


const PROJECT = {
  name: 'Scott 1',
  address: '11 N Raintree Hollow Court',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  memberCount: 7,
};

const TABS = [
  { key: 'details', label: 'Details', Icon: CreditCard },
  { key: 'members', label: 'Members', Icon: Users },
  { key: 'invoice', label: 'Invoice', Icon: File },
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
      style={{ position: 'relative', zIndex: 10000 } as any}
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
            zIndex: 10000,
            elevation: 10000,
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
  const [activeTab, setActiveTab] = useState('details');
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
              {/* Projects — wireframe (icon visible) */}
              {sidebarCollapsed ? (
                <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                  <Folder size={22} color={theme.colors.grey03} />
                </Box>
              ) : (
                <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                  <Folder size={24} color={theme.colors.grey03} />
                  <Box style={{ width: 64, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
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
                    { Icon: Hash, w: 64 },
                    { Icon: Activity, w: 112 },
                    { Icon: Users, w: 64 },
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
              {/* HelpCircle — wireframe, User (My Account) — active */}
              {sidebarCollapsed ? (
                <Box gap="8">
                  <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, alignSelf: 'center' }}>
                    <HelpCircle size={22} color={theme.colors.grey03} />
                  </Box>
                  <Box alignItems="center" justifyContent="center" style={{ width: 44, height: 44, borderRadius: 10, backgroundColor: theme.colors.lightMint, alignSelf: 'center' }}>
                    <Box alignItems="center" justifyContent="center" style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.grey03 }}>
                      <User size={16} color={theme.colors.grey05} />
                    </Box>
                  </Box>
                </Box>
              ) : (
                <Box gap="8">
                  <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15 }}>
                    <HelpCircle size={24} color={theme.colors.grey03} />
                    <Box style={{ width: 80, height: 14, borderRadius: 6, backgroundColor: theme.colors.grey03 }} />
                  </Box>
                  <Box style={{ flexDirection: 'row', alignItems: 'center', gap: 16, height: 54, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 15, backgroundColor: theme.colors.lightMint }}>
                    <Box alignItems="center" justifyContent="center" style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.grey03 }}>
                      <User size={16} color={theme.colors.grey05} />
                    </Box>
                    <Text variant="labelMedium" style={{ color: theme.colors.secondaryGreen }}>My Account</Text>
                  </Box>
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
          {/* Left: back + title + address */}
          <Box flexDirection="row" alignItems="center" gap="12" flex={1} flexShrink={1}>
            <Pressable hitSlop={8}>
              <ChevronLeft size={22} color={theme.colors.foreground} />
            </Pressable>
            <Box flexShrink={1}>
              <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1 }}>
                {PROJECT.name}
              </Text>
              <Text variant="webMetadataPrimary" color="textSecondary">
                {PROJECT.address}
              </Text>
            </Box>
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
              {TABS.map(({ key, label, Icon }) => {
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

          {/* ── Tab Content — empty state for all tabs ── */}
          <Box
            flex={1}
            alignItems="center"
            justifyContent="center"
            minHeight={520}
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

            {/* Timestamp column */}
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
                router.push('/prototype/join-team-non-user-by-link/team-dashboard');
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
