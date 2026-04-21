import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { Clock, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { Button } from '@/components/Button';
import JoinTasktagSignup from './join-tasktag-signup';

const PROJECT_DATA = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  team: 'Painting Team',
  inviter: 'James Hammer',
  memberCount: 12,
  description: 'Residential renovation project covering kitchen, living room, and exterior painting. Coordinating with multiple contractors across three floors.',
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
          <Pressable onPress={() => setShowSignupModal(true)}>
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
                You can still request to join this project.
              </Text>
            </Box>
          </Box>

          {/* Project Card */}
          <Box
            backgroundColor="card"
            borderRadius="16"
            padding="md"
            marginBottom="lg"
            gap="md"
            borderWidth={1}
            borderColor="border"
            style={{ width: '100%' as any }}
          >
            {/* Top Info Group (Grey background) */}
            <Box backgroundColor="grey02" borderRadius="xl" padding="md" borderWidth={1} borderColor="grey03">
              <Text variant="webHeading22" color="foreground" marginBottom="xs">
                {PROJECT_DATA.name}
              </Text>
              <Box flexDirection="row" alignItems="center" gap="4" marginBottom="md">
                <MapPin size={14} color={theme.colors.grey06} />
                <Text variant="webMetadataPrimary" style={{ color: theme.colors.grey06, fontSize: 14 }}>
                  {PROJECT_DATA.address}
                </Text>
              </Box>
              <Text variant="webBody" style={{ color: theme.colors.textSecondary }}>
                {"You'll join as a "}
                <Text variant="webBody" style={{ fontWeight: '600', color: theme.colors.textSecondary }}>Member</Text>
                {` with ${PROJECT_DATA.memberCount} other people.`}
              </Text>
            </Box>


            {/* Description */}
            <Box gap="xs">
              <Text variant="webEmphasizedBody" color="foreground">Description</Text>
              <Text variant="webSecondaryBody" color="textSecondary" style={{ lineHeight: 20 } as any}>
                {PROJECT_DATA.description}
              </Text>
            </Box>
          </Box>

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
            Admin will receive your request after sign up
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
                router.push('/prototype/project-invitation-expired-by-email/project-panel-request-to-join' as any);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
