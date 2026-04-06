import { router } from 'expo-router';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Link2, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, View } from 'react-native';
import JoinTasktagSignup from './join-tasktag-signup';

const TEAM = {
  name: 'Painting Team',
  tagline: 'Residential & commercial painting services across the metro area.',
  description: '3 members are already on this team.',
  sharedBy: 'Kang Shen',
  memberCount: 12,
};

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box flex={1} backgroundColor="grey02">

      {/* ── Header ── */}
      <Box
        backgroundColor="background"
        borderBottomWidth={1}
        borderColor="border"
        style={{ width: '100%' as any }}
      >
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          style={{ maxWidth: 1280, width: '100%', alignSelf: 'center', paddingHorizontal: 20, paddingVertical: 12 } as any}
        >
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => router.push('/prototype/join-team-non-user-by-link/team-dashboard')}>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>
              Sign Up
            </Text>
          </Pressable>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 }}>
        <Box
          style={{
            maxWidth: 1280,
            width: '100%',
            gap: 20,
          } as any}
        >
          {/* ── Badge: Shared team link — prominent ── */}
          <Box
            flexDirection="row"
            alignItems="center"
            style={{
              alignSelf: 'flex-start',
              backgroundColor: theme.colors.lightMint,
              borderRadius: 20,
              paddingHorizontal: 14,
              paddingVertical: 7,
              gap: 6,
            }}
          >
            <Link2 size={14} color={theme.colors.textSecondary} strokeWidth={2} />
            <Text variant="webLabelSmall" color="foreground">
              Shared team link
            </Text>
          </Box>

          {/* ── Heading ── */}
          <Text variant="h1" color="foreground" style={{ fontSize: 28 }}>
            You're invited to join
          </Text>

          {/* ── White card ── */}
          <Box
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              borderWidth: 1,
              borderColor: 'rgba(0,0,0,0.06)',
              paddingHorizontal: 24,
              paddingVertical: 24,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 24,
            }}
          >
            {/* Col 1: Logo */}
            <Image
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: 160, height: 64, flexShrink: 0 }}
              resizeMode="contain"
            />

            {/* Col 2: Team name + tagline + members */}
            <Box flex={1} style={{ gap: 2 }}>
              <Text variant="h1" color="foreground" style={{ fontSize: 24 }}>
                {TEAM.name}
              </Text>
              <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
                <Users size={14} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary">{TEAM.description}</Text>
              </Box>
            </Box>

            {/* Divider */}
            <Box style={{ width: 1, alignSelf: 'stretch', backgroundColor: theme.colors.border }} />

            {/* Col 3: CTA */}
            <Box style={{ gap: 8, flexShrink: 0, width: 260 } as any}>
              <Pressable
                style={{ backgroundColor: theme.colors.secondaryGreen, borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setShowSignupModal(true)}
              >
                <Text variant="webLabelEmphasized" color="white">Request to Join</Text>
              </Pressable>
              <Text variant="webMetadataPrimary" color="textSecondary" style={{ textAlign: 'center' }}>
                A team admin will review your request.
              </Text>
            </Box>
          </Box>

          {/* ── Footer ── */}
          <Box flexDirection="row" justifyContent="center" style={{ gap: 4, paddingTop: 12 }}>
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable onPress={() => router.push('/prototype/join-team-non-user-by-link/team-dashboard')}>
              <Text variant="webSecondaryBody" style={{ color: theme.colors.secondaryGreen, fontWeight: '600' }}>
                Log in
              </Text>
            </Pressable>
          </Box>
        </Box>
      </View>

      {/* ── Signup Modal Overlay ── */}
      <Modal
        visible={showSignupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignupModal(false)}
      >
        <Box style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center' }}>
          <Pressable
            onPress={() => setShowSignupModal(false)}
            style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }}
          />
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
