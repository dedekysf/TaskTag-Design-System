import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { router } from 'expo-router';
import { Check, HardHat } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const TASK = {
  name: 'Install Sink and Faucet in Kitchen',
  projectName: 'Raintree Hollow Court Renovation',
};

const PERMISSIONS: string[] = [
  'View and manage tasks',
  'Collaborate with team',
  'Upload files & media',
  'Track team progress',
];

export default function EmailApprovalMockup() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 40, paddingTop: 48, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={560}>

        {/* Logo */}
        <Box marginBottom="xl" alignItems="center">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 40, width: 134 }}
            resizeMode="contain"
          />
        </Box>

        {/* Main Card */}
        <Box
          backgroundColor="card"
          borderRadius="xl"
          padding="24"
          paddingTop="32"
          marginBottom="xl"
        >

          {/* Welcome Header */}
          <Box marginBottom="24" alignItems="center">
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: TTTheme.colors.lightMint, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Check size={40} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: TTTheme.colors.secondaryGreen, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Request Approved
            </Text>
            <Text variant="mobileHeading28" style={{ marginBottom: 2, textAlign: 'center' }}>
              You're in, Oscar.
            </Text>
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, textAlign: 'center' }}>
              Your task request has been approved.
            </Text>
          </Box>

          {/* Permissions Box */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" marginBottom="24">
            {/* Task Identity */}
            <Box marginBottom="16">
              <Text variant="webLabelEmphasized" color="textPrimary" style={{ marginBottom: 4 }}>
                {TASK.name}
              </Text>
              <Box flexDirection="row" alignItems="center" gap="4">
                <HardHat size={13} color={TTTheme.colors.grey05} />
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05 }}>{TASK.projectName}</Text>
              </Box>
            </Box>
            <Box height={1} backgroundColor="border" marginBottom="16" />
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 12 }}>
              <Text variant="webBody" style={{ fontWeight: '600', color: TTTheme.colors.foreground }}>As a member</Text>
              {", you'll be able to:"}
            </Text>
            {PERMISSIONS.map((perm, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < PERMISSIONS.length - 1 ? 12 : 0 }}>
                <Check size={16} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary }}>{perm}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box>
            <Button
              variant="fill"
              size="xl"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/join-task-non-user-by-link/project-dashboard')}
            >
              <Text variant="webButton" color="white">View Task</Text>
            </Button>
          </Box>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginBottom="xl" marginTop="xl">
          <Text variant="h2" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
            Download The App
          </Text>
          <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 20, textAlign: 'center' }}>
            Get the most of Tasktag by installing our new mobile app.
          </Text>
          <Box flexDirection="row" gap="24" justifyContent="center">
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/app-store.svg')}
                style={{ width: 140, height: 44 }}
                contentFit="contain"
              />
            </Pressable>
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/play-store.svg')}
                style={{ width: 148, height: 44 }}
                contentFit="contain"
              />
            </Pressable>
          </Box>
        </Box>

        {/* Footer */}
        <Box alignItems="center" gap="24" paddingBottom="xl">
          <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            Have questions? Contact our support team
          </Text>
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
            <View style={{ width: 1, height: 12, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
            <View style={{ width: 1, height: 12, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
          </Box>
          <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            © 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>

      </Box>
    </ScrollView>
  );
}
