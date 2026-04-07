import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { Clock, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { Button } from '@/components/Button';
import JoinTasktagSignup from './join-tasktag-signup';

const TEAM = {
  name: 'Painting Team',
  description: '3 members on this team.',
};

export default function InvitationExpired() {
  const theme = useTheme<Theme>();
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box flex={1} backgroundColor="grey02">

      {/* Navbar */}
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
          <Pressable>
            <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>Sign Up</Text>
          </Pressable>
        </Box>
      </Box>

      {/* Main Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 20 }}
      >
        <View style={{ width: '100%', maxWidth: 640 }}>

          {/* Expired Header */}
          <Box alignItems="center" style={{ marginBottom: 16, gap: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: theme.colors.lightPink, alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={48} color={theme.colors.alertRed} strokeWidth={2} />
            </View>
            <Box alignItems="center" style={{ gap: 8 }}>
              <Text variant="h1" color="foreground" style={{ textAlign: 'center', fontSize: 32 }}>
                Invitation has expired
              </Text>
              <Text variant="mobileBody" color="textSecondary" style={{ textAlign: 'center', fontSize: 18 }}>
                You can still request to join this team.
              </Text>
            </Box>
          </Box>

          {/* Team Card */}
          <View style={{ backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 24, paddingVertical: 24, marginBottom: 24, alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)' }}>
            <Image
              source={require('@/assets/images/sosa-logo.svg')}
              style={{ width: 160, height: 80, borderRadius: 8 }}
              resizeMode="contain"
            />
            <Box alignItems="center" style={{ gap: 8 }}>
              <Text variant="h1" color="foreground" style={{ textAlign: 'center', fontSize: 32 }}>{TEAM.name}</Text>
              <Box flexDirection="row" alignItems="center" style={{ gap: 6 }}>
                <Users size={14} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary">{TEAM.description}</Text>
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
            <Pressable>
              <Text variant="webSecondaryBody" style={{ color: theme.colors.secondaryGreen, fontWeight: '600' }}>Log in</Text>
            </Pressable>
          </Box>

        </View>
      </ScrollView>
      {/* Signup Modal */}
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
                router.push('/prototype/team-invitation-expired-by-email/team-dashboard' as any);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
