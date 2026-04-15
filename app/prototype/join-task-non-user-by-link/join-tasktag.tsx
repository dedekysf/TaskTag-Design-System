import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Calendar, ChevronsUp, Hammer, User, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView } from 'react-native';
import JoinTasktagSignup from './join-tasktag-signup';

const TASK_DATA = {
  title: 'Install Sink and Faucet in Kitchen',
  project: 'Raintree Hollow Court Renovation',
  assigner: 'Paul Anderson',
  date: 'Dec 15 - Dec 20',
  description: 'Complete the installation of the kitchen sink and faucet, ensuring all plumbing connections are secure, leak-free, and fully functional as part of the Raintree renovation.',
};

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box flex={1} backgroundColor="grey02">

      {/* ── Header (dari join-team-non-user-by-link) ── */}
      <Box backgroundColor="background" borderBottomWidth={1} borderColor="border">
        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          paddingHorizontal="md"
          paddingVertical="12"
          style={{ maxWidth: 640, width: '100%', alignSelf: 'center' } as any}
        >
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ width: 100, height: 30 }}
            resizeMode="contain"
          />
          <Pressable onPress={() => setShowSignupModal(true)}>
            <Text variant="webSecondaryBody" color="secondaryGreen" style={{ fontWeight: '600' } as any}>
              Sign Up
            </Text>
          </Pressable>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 32 }}
      >
        <Box style={{ width: '100%', maxWidth: 640 } as any}>

          {/* Heading */}
          <Text variant="webHeading32" color="foreground" marginBottom="md" style={{ textAlign: 'center' } as any}>
            You're invited to join a task
          </Text>

          {/* Task Card */}
          <Box
            backgroundColor="card"
            borderRadius="16"
            padding="md"
            marginBottom="lg"
            gap="lg"
            borderWidth={1}
            borderColor="border"
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
                <ChevronsUp size={14} color={theme.colors.alertRed} />
                <Text variant="webSecondaryBody" color="alertRed">High</Text>
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
                <Calendar size={14} color={theme.colors.textSecondary} strokeWidth={1.5} />
                <Text variant="webSecondaryBody" color="textSecondary">{TASK_DATA.date}</Text>
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
                <Users size={16} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary">3 person working on this task</Text>
              </Box>
            </Box>
          </Box>

          {/* Request to Join Button */}
          <Button
            size="xl"
            color="primary"
            style={{ width: '100%', marginBottom: 8 } as any}
            onPress={() => setShowSignupModal(true)}
          >
            Request to Join
          </Button>

          <Text
            variant="webSecondaryBody"
            color="textSecondary"
            marginBottom="20"
            style={{ textAlign: 'center' } as any}
          >
            Admin will receive your request after sign up
          </Text>

          {/* Already on TaskTag */}
          <Box flexDirection="row" justifyContent="center" gap="xs" marginTop="lg">
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable onPress={() => router.push('/prototype/join-task-non-user-by-link/my-task')}>
              <Text variant="webSecondaryBody" color="secondaryGreen" style={{ fontWeight: '600' } as any}>Log in</Text>
            </Pressable>
          </Box>

        </Box>
      </ScrollView>

      {/* ── Signup Modal ── */}
      <Modal
        visible={showSignupModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignupModal(false)}
      >
        <Box flex={1} justifyContent="center" alignItems="center" style={{ backgroundColor: 'rgba(0,0,0,0.75)' } as any}>
          <Pressable
            onPress={() => setShowSignupModal(false)}
            style={{ position: 'absolute' as any, top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <Box style={{ width: '100%', maxWidth: 640, maxHeight: '99%', borderRadius: 16, overflow: 'hidden' } as any}>
            <JoinTasktagSignup
              onClose={() => setShowSignupModal(false)}
              onSuccess={() => {
                setShowSignupModal(false);
                router.push('/prototype/join-task-non-user-by-link/task-panel-request-to-join');
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
