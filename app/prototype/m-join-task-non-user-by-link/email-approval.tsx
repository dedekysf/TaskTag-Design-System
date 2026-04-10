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
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 12 }}
      showsVerticalScrollIndicator={false}
    >
      <Box width="100%" maxWidth={480}>

        {/* Logo */}
        <Box marginBottom="lg" marginTop="lg" alignItems="center">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120 }}
            resizeMode="contain"
          />
        </Box>

        {/* Main Card */}
        <Box
          backgroundColor="card"
          borderRadius="xl"
          padding="16"
          paddingTop="24"
          marginBottom="lg"
        >

          {/* Welcome Header */}
          <Box marginBottom="24" alignItems="center">
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: TTTheme.colors.lightMint, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Check size={40} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
            </View>
            <Text style={{ fontSize: 11, fontWeight: '700', color: TTTheme.colors.secondaryGreen, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Request Approved
            </Text>
            <Text variant="h2" style={{ marginBottom: 2, textAlign: 'center' }}>
              You're in, Oscar.
            </Text>
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, textAlign: 'center' }}>
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
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 12 }}>
              <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: TTTheme.colors.foreground }}>As a member</Text>
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
          <Box paddingTop="0">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/m-join-task-non-user-by-link/task-overview-app')}
            >
              <Text variant="webButton" color="white">View Task</Text>
            </Button>
          </Box>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginBottom="lg" marginTop="lg">
          <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
            Download The App
          </Text>
          <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, textAlign: 'center' }}>
            Get the most of Tasktag by installing our new mobile app.
          </Text>
          <Box flexDirection="row" gap="24" justifyContent="center">
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/app-store.svg')}
                style={{ width: 120, height: 40 }}
                contentFit="contain"
              />
            </Pressable>
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
              <ExpoImage
                source={require('@/assets/images/play-store.svg')}
                style={{ width: 135, height: 40 }}
                contentFit="contain"
              />
            </Pressable>
          </Box>
        </Box>

        {/* Footer */}
        <Box alignItems="center" gap="24" paddingBottom="xl">
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            Have questions? Contact our support team
          </Text>
          <Box flexDirection="row" alignItems="center" gap="sm">
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
            <View style={{ width: 1, height: 12, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
            <View style={{ width: 1, height: 12, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webMetadataPrimary" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
          </Box>
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            © 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>

      </Box>
    </ScrollView>
  );
}
