import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const TEAM = {
  name: 'Painting Team',
};

const PERMISSIONS = [
  'Manage project and tasks',
  'Invite and remove members',
  'Manage roles & permissions',
  'Configure team settings',
];

const STEPS = [
  'Set up your profile',
  'Check your team details',
  'Say hello to your teammates!',
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
          marginBottom="lg"
        >

          {/* Welcome Header */}
          <Box marginBottom="16">
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8 }}>
              Welcome to the Team, Oscar! 🎉
            </Text>
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary }}>
              {"Added by "}
              <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>James Hammer</Text>
              {" (Team Owner)"}
            </Text>
          </Box>

          {/* Team Identity */}
          <Box flexDirection="row" alignItems="center" gap="16" marginBottom="16">
            <Box
              borderRadius="8"
              style={{ backgroundColor: TTTheme.colors.white }}
            >
              <ExpoImage
                source={require('@/assets/images/sosa-logo.svg')}
                style={{ width: 100, height: 60 }}
                contentFit="contain"
              />
            </Box>
            <Text variant="h1" color="textPrimary" style={{ flex: 1 }}>
              {TEAM.name}
            </Text>
          </Box>

          {/* Permissions Box */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" marginBottom="24">
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 12 }}>
              <Text variant="webSecondaryBody" style={{ fontWeight: '600', color: TTTheme.colors.secondaryGreen }}>As an admin</Text>
              {", you'll be able to:"}
            </Text>
            {PERMISSIONS.map((perm, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < PERMISSIONS.length - 1 ? 12 : 0 }}>
                <Check size={16} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary }}>{perm}</Text>
              </Box>
            ))}
          </Box>

          {/* Get Started Steps */}
          <Box paddingHorizontal="sm" marginBottom="24">
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, fontWeight: '600' }}>
              🚀 Get started in 3 easy steps:
            </Text>
            {STEPS.map((step, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: TTTheme.colors.grey06, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, lineHeight: 16, textAlign: 'center' }}>{i + 1}</Text>
                </View>
                <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary }}>{step}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box paddingTop="12">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/m-join-team-non-user-by-link/team-overview-app')}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>View Your Team</Text>
            </Button>
          </Box>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginBottom="lg">
          <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8, textAlign: 'center' }}>
            Download The App
          </Text>
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, textAlign: 'center' }}>
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
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
            <View style={{ width: 1, height: 16, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
            <View style={{ width: 1, height: 16, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
          </Box>
          <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            © 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>

      </Box>
    </ScrollView>
  );
}
