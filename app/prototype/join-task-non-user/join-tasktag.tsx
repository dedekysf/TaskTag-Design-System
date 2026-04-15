import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import React, { useState } from 'react';
import { HardHat, User, Users } from 'lucide-react-native';
import { Image, Modal, Pressable, ScrollView } from 'react-native';
import JoinTasktagSignup from './join-tasktag-signup';

const TASK_DATA = {
  title: 'Install Sink and Faucet in Kitchen',
  project: 'Raintree Hollow Court Renovation',
  assigner: 'James Hammer',
  date: 'Dec 15 - Dec 20',
  description: 'Please verify the exact location where the electrical meter rack should be installed. Check the site plans and confirm with the electrical contractor before proceeding.',
};

export default function JoinTasktag() {
  const theme = useTheme<TTTheme>();
  const [showSignupModal, setShowSignupModal] = useState(false);

  return (
    <Box flex={1} backgroundColor="grey02">

      {/* ── Header (Full Width) ── */}
      <Box 
        backgroundColor="background"
        borderBottomWidth={1}
        borderColor="border"
        width="100%"
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
          <Box flexDirection="row" alignItems="center" gap="md">
            <Pressable onPress={() => setShowSignupModal(true)}>
              <Text variant="webSecondaryBody" style={{ fontSize: 14, color: theme.colors.secondaryGreen, fontWeight: '600' }}>
                Sign Up
              </Text>
            </Pressable>
          </Box>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 32, paddingHorizontal: 16 }}
      >
        <Box width="100%" maxWidth={640}>
          {/* Heading */}
          <Box style={{ marginBottom: 16 }}>
            <Text variant="webHeading32" color="foreground" textAlign="center">
              You&apos;ve been assigned a task
            </Text>
            <Text variant="webLargeLabel" color="textSecondary" textAlign="center" style={{ marginTop: 4 }}>
              by James Hammer
            </Text>
          </Box>

          {/* Task Card */}
          <Box backgroundColor="card" style={{ borderRadius: 16, marginBottom: 24, width: '100%' }} padding="md" gap="lg" borderWidth={1} borderColor="border">
            {/* Top Info Group (Grey background) */}
            <Box backgroundColor="grey02" borderRadius="md" padding="md" gap="sm">
              {/* Title */}
              <Text variant="webHeading22" color="foreground">
                {TASK_DATA.title}
              </Text>

              {/* Project & Assigner Row */}
              <Box flexDirection="row" alignItems="center" gap="md">
                <Box flexDirection="row" alignItems="center" gap="sm">
                  <HardHat size={18} color={theme.colors.secondaryGreen} strokeWidth={2} />
                  <Text variant="webLabelSmall" color="textSecondary">{TASK_DATA.project}</Text>
                </Box>
                <Box flexDirection="row" alignItems="center" gap="sm">
                  <Box width={18} height={18} borderRadius="full" backgroundColor="darkGreen" alignItems="center" justifyContent="center">
                    <User size={12} color="white" />
                  </Box>
                  <Text variant="webLabelSmall" color="textSecondary">{TASK_DATA.assigner}</Text>
                </Box>
              </Box>
            </Box>

            {/* Priority & Date Row */}
            <Box flexDirection="row" alignItems="center" gap="sm" marginBottom="xs">
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
                <Text variant="webSecondaryBody" color="alertRed">
                  High Priority
                </Text>
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
                <Text variant="webSecondaryBody" color="textSecondary">
                  Due: {TASK_DATA.date}
                </Text>
              </Box>
            </Box>

            {/* Description */}
            <Box gap="xs">
              <Text variant="webEmphasizedBody" color="foreground">Description</Text>
              <Text variant="webSecondaryBody" color="textSecondary" style={{ lineHeight: 20 }}>
                {TASK_DATA.description}
              </Text>
            </Box>

            {/* Assigned To */}
            <Box gap="xs">
              <Text variant="webEmphasizedBody" color="foreground">Assigned To</Text>
              <Box flexDirection="row" alignItems="center" gap="sm">
                <Users size={18} color={theme.colors.textSecondary} strokeWidth={2} />
                <Text variant="webSecondaryBody" color="textSecondary">3 people working on this task</Text>
              </Box>
            </Box>
          </Box>

          {/* CTA Button */}
          <Box marginBottom="8" width="100%">
            <Button
              variant="fill"
              size="xl"
              style={{ width: '100%', backgroundColor: theme.colors.secondaryGreen, borderRadius: 12 }}
              onPress={() => setShowSignupModal(true)}
            >
              <Text style={{ fontSize: 18, fontWeight: '400', color: 'white', textAlign: 'center' }}>Join This Task</Text>
            </Button>
          </Box>

          {/* Already on TaskTag */}
          <Box flexDirection="row" justifyContent="center" gap="xs" marginTop="lg">
            <Text variant="webSecondaryBody" color="textSecondary">Already on TaskTag?</Text>
            <Pressable onPress={() => { /* Redirect or modal logic */ }}>
              <Text variant="webSecondaryBody" color="secondaryGreen" style={{ fontWeight: '600' }}>Log in</Text>
            </Pressable>
          </Box>
        </Box>
      </ScrollView>

      {/* ── Signup Modal Overlay ── */}
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
                // Handle success navigation if needed
              }}
            />
          </Box>
        </Box>
      </Modal>

    </Box>
  );
}
