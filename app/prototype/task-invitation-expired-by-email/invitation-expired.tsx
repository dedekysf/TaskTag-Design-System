import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { Clock, Hammer, User, Users } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, View } from 'react-native';
import { Button } from '@/components/Button';
import JoinTasktagSignup from './join-tasktag-signup';

const TASK_DATA = {
  title: 'Deep clean the kitchen appliances',
  project: 'LA Avenue 37 D',
  assigner: 'James Hammer',
  date: 'Dec 15 - Dec 20',
  description: 'Please verify the exact location where the electrical meter rack should be installed. Check the site plans and confirm with the electrical contractor before proceeding.',
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
                You can still request to join this task.
              </Text>
            </Box>
          </Box>

          {/* Task Card */}
          <Box
            backgroundColor="card"
            borderRadius="16"
            padding="md"
            marginBottom="lg"
            gap="lg"
            borderWidth={1}
            borderColor="border"
            style={{ width: '100%' as any }}
          >
            {/* Top Info Group (Grey background) */}
            <Box backgroundColor="grey02" borderRadius="md" padding="md" gap="sm">
              {/* Title */}
              <Text variant="webHeading22" color="foreground">
                {TASK_DATA.title}
              </Text>

              {/* Project & Assigner Row */}
              <Box flexDirection="row" alignItems="center" gap="md">
                <Box flexDirection="row" alignItems="center" gap="sm">
                  <Hammer size={20} color={theme.colors.secondaryGreen} strokeWidth={2} />
                  <Text variant="webLabelSmall" color="textSecondary">{TASK_DATA.project}</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="sm">
                  <Box width={20} height={20} borderRadius="full" backgroundColor="darkGreen" alignItems="center" justifyContent="center">
                    <User size={14} color="white" />
                  </Box>
                  <Text variant="webLabelSmall" color="textSecondary">{TASK_DATA.assigner}</Text>
                </Box>
              </Box>
            </Box>

            {/* Priority & Date Row (pills) */}
            <Box flexDirection="row" alignItems="center" gap="sm">
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card"
                paddingHorizontal="md"
                height={32}
                borderRadius="full"
                gap="xs"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="webSecondaryBody" color="alertRed">High Priority</Text>
              </Box>
              <Box
                flexDirection="row" alignItems="center"
                backgroundColor="card"
                paddingHorizontal="md"
                height={32}
                borderRadius="full"
                gap="xs"
                borderWidth={1}
                borderColor="border"
              >
                <Text variant="webSecondaryBody" color="textSecondary">Due: {TASK_DATA.date}</Text>
              </Box>
            </Box>

            {/* Description */}
            <Box gap="xs">
              <Text variant="webEmphasizedBody" color="foreground">Description</Text>
              <Text variant="webSecondaryBody" color="textSecondary" style={{ lineHeight: 20 } as any}>
                {TASK_DATA.description}
              </Text>
            </Box>

            {/* Assigned To */}
            <Box gap="xs">
              <Text variant="webEmphasizedBody" color="foreground">Assigned To</Text>
              <Box flexDirection="row" alignItems="center" gap="sm">
                <Text variant="webSecondaryBody" color="textSecondary">3 people working on this task</Text>
              </Box>
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
                router.push('/prototype/task-invitation-expired-by-email/task-panel-request-to-join' as any);
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
