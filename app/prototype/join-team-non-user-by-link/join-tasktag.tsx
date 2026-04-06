import { router } from 'expo-router';
import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import {
  Activity,
  ChevronsLeft,
  ChevronsRight,
  Folder,
  Hash,
  HelpCircle,
  Share,
  User,
  Users,
} from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import JoinTasktagSignup from './join-tasktag-signup';


const PROJECT = {
  name: 'Scott 1',
  address: '11 N Raintree Hollow Court',
  description:
    'This project focuses on conducting a comprehensive assessment and improvement of the electrical board to ensure long-term safety, system reliability, and compliance with current standards.',
  memberCount: 7,
};

const TEAM = {
  name: 'Painting Team',
  id: '6771',
};

const STATS = [
  { value: '12', label: 'Total Projects' },
  { value: '60', label: 'Total Tasks' },
];

const COMPLETION = { done: 48, total: 60 };

const MEMBERS = [
  { initials: 'OH', name: 'Oscar H.',   email: 'oscaar@email.com',   role: 'Admin',  color: '#18a87d', isInvited: true },
  { initials: 'JR', name: 'Jamie R.',  email: 'jamie.r@email.com',  role: 'Owner',  color: '#e65100' },
  { initials: 'AL', name: 'Alex L.',   email: 'alex.l@email.com',   role: 'Member', color: '#388e3c' },
  { initials: 'MK', name: 'Morgan K.', email: 'morgan.k@email.com', role: 'Member', color: '#7b1fa2' },
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
      <Text variant="webLabelEmphasized" color="textSecondary">
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const progress = COMPLETION.done / COMPLETION.total;

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
          {/* Left: logo + title + team id */}
          <Box flexDirection="row" alignItems="center" gap="12" flex={1} flexShrink={1}>
            <ExpoImage
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: 96, height: 48 }}
              contentFit="contain"
            />
            <Box flexShrink={1}>
              <Text variant="webHeading22" numberOfLines={1} style={{ flexShrink: 1 }}>
                {TEAM.name}
              </Text>
              <Text variant="webMetadataPrimary" color="textSecondary">
                Team ID · {TEAM.id}
              </Text>
            </Box>
          </Box>
        </Box>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
          {/* ── Content ── */}
          <Box flex={1} style={{ position: 'relative' as any }}>

            <Box padding="md" gap="lg">

              {/* Stats + Task Completion — 3 columns */}
              <Box flexDirection="row" gap="12">

                <Box
                  flex={1} backgroundColor="lightMint"
                  borderRadius="xl" padding="md"
                  flexDirection="row" alignItems="center" justifyContent="space-between"
                >
                  <Text variant="webLabelEmphasized" color="textSecondary">Total Projects</Text>
                  <Text variant="h1" color="textPrimary">12</Text>
                </Box>

                <Box
                  flex={1} backgroundColor="lightSky"
                  borderRadius="xl" padding="md"
                  flexDirection="row" alignItems="center" justifyContent="space-between"
                >
                  <Text variant="webLabelEmphasized" color="textSecondary">Total Tasks</Text>
                  <Text variant="h1" color="textPrimary">60</Text>
                </Box>

                <Box flex={1} backgroundColor="grey02" borderRadius="xl" padding="md" justifyContent="center">
                  <Box flexDirection="row" justifyContent="space-between" alignItems="center" marginBottom="8">
                    <Text variant="webBody" color="textPrimary">Task completion</Text>
                    <Text variant="webMetadataPrimary">
                      <Text color="secondaryGreen" fontWeight="600">{COMPLETION.done}</Text>
                      <Text color="grey05"> / {COMPLETION.total}</Text>
                    </Text>
                  </Box>
                  <Box height={6} backgroundColor="grey03" borderRadius="4">
                    <Box
                      height={6} backgroundColor="secondaryGreen" borderRadius="4"
                      style={{ width: `${progress * 100}%` as any }}
                    />
                  </Box>
                </Box>

              </Box>

              {/* Members Section */}
              <Box>
                <Box flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: 12 }}>
                  <Text variant="webLabelSmall" color="textSecondary" style={{ letterSpacing: 0.8, textTransform: 'uppercase' }}>Members</Text>
                  <Box width={20} height={20} borderRadius="full" backgroundColor="black" alignItems="center" justifyContent="center">
                    <Text variant="webLabelSmall" color="white">{MEMBERS.length}</Text>
                  </Box>
                </Box>
                <Box backgroundColor="card" style={{ overflow: 'hidden' }}>
                  {/* Table Header */}
                  <Box
                    flexDirection="row" alignItems="center"
                    paddingHorizontal="md" paddingVertical="12"
                    backgroundColor="grey02"
                  >
                    <Box flex={1}>
                      <Text variant="webLabelEmphasized" color="textSecondary">Name</Text>
                    </Box>
                    <Box flex={1}>
                      <Text variant="webLabelEmphasized" color="textSecondary">Email</Text>
                    </Box>
                    <Box flex={1}>
                      <Text variant="webLabelEmphasized" color="textSecondary">Role</Text>
                    </Box>
                  </Box>
                  <Box height={1} backgroundColor="border" />
                  {/* Table Rows */}
                  {MEMBERS.map((member, i) => (
                    <Box key={i}>
                      <Box
                        flexDirection="row" alignItems="center"
                        paddingHorizontal="md" paddingVertical="12"
                      >
                        <Box flex={1} flexDirection="row" alignItems="center" gap="12">
                          <Box
                            width={36} height={36} borderRadius="full"
                            alignItems="center" justifyContent="center"
                            style={{ backgroundColor: member.color }}
                          >
                            <Text variant="webLabelSmall" color="white">{member.initials}</Text>
                          </Box>
                          <Text variant="webSecondaryBody" color="textSecondary">{member.name}</Text>
                        </Box>
                        <Box flex={1}>
                          <Text variant="webSecondaryBody" color="textSecondary">{member.email}</Text>
                        </Box>
                        <Box flex={1}>
                          <Text variant="webSecondaryBody" color="textSecondary">
                            {member.role}
                          </Text>
                        </Box>
                      </Box>
                      {i < MEMBERS.length - 1 && (
                        <Box height={1} backgroundColor="border" />
                      )}
                    </Box>
                  ))}
                </Box>
              </Box>

            </Box>

            {/* Fixed Bottom Banner */}
            <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#000000', borderRadius: 12, paddingHorizontal: 20, paddingVertical: 16, zIndex: 10, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              {/* Icon */}
              <Box
                width={44} height={44} borderRadius="full"
                alignItems="center" justifyContent="center"
                style={{ backgroundColor: 'rgba(0,217,165,0.15)', flexShrink: 0 }}
              >
                <Share size={22} color="#00D9A5" strokeWidth={1.5} />
              </Box>
              {/* Title + Desc */}
              <Box flex={1}>
                <Text variant="webLabelEmphasized" color="white">Someone shared this team with you</Text>
                <Text variant="webSecondaryBody" style={{ color: '#E0E0E0', marginTop: 2, lineHeight: 18 }}>
                  The team owner is waiting for your request. Join in to collaborate on projects.
                </Text>
              </Box>
              {/* Button */}
              <Button
                variant="fill"
                size="md"
                style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 8, flexShrink: 0 }}
                onPress={() => setShowSignupModal(true)}
              >
                <Text variant="webLabelEmphasized" color="white">Request to Join</Text>
              </Button>
            </View>

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
