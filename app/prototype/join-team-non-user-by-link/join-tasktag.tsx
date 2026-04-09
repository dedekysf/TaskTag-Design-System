import { router } from 'expo-router';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { Button } from '@/components/Button';
import JoinTasktagSignup from './join-tasktag-signup';

const TEAM = {
  name: 'Painting Team',
  description: '3 members on this team.',
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
          style={{ maxWidth: 640, width: '100%', alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 12 } as any}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <View style={{ width: '100%', maxWidth: 640 }}>

          {/* Heading */}
          <Text variant="h1" color="foreground" style={{ marginBottom: 8, fontSize: 32, textAlign: 'center' }}>
            You're invited to join
          </Text>

          {/* Team Card */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 44, marginBottom: 24, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
            <Image
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: 160, height: 80, borderRadius: 8 }}
              resizeMode="contain"
            />
            <Box alignItems="center" style={{ gap: 8 }}>
              <Text variant="h1" color="foreground" style={{ textAlign: 'center', fontSize: 32 }}>{TEAM.name}</Text>
              <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
                <Users size={18} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary" style={{ fontSize: 18 }}>{TEAM.description}</Text>
              </Box>
            </Box>
          </View>

          {/* Request to Join Button */}
          <Button
            size="xl"
            color="primary"
            style={{ width: '100%', marginBottom: 8 }}
            onPress={() => setShowSignupModal(true)}
          >
            Request to Join
          </Button>

          <Text variant="webSecondaryBody" color="textSecondary" style={{ textAlign: 'center', marginBottom: 20 }}>
            A Team admin will receive your request after sign up.
          </Text>

          {/* Already on TaskTag */}
          <Box flexDirection="row" justifyContent="center" style={{ gap: 4, marginTop: 24 }}>
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable onPress={() => router.push('/prototype/join-team-non-user-by-link/team-dashboard')}>
              <Text variant="webSecondaryBody" style={{ color: theme.colors.secondaryGreen, fontWeight: '600' }}>Log in</Text>
            </Pressable>
          </Box>


        </View>
      </ScrollView>

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
