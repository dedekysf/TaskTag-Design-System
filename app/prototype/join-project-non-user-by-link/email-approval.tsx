import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { router } from 'expo-router';
import { Check, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const PROJECT = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
};

const PERMISSIONS: string[] = [
  'View and manage tasks',
  'Collaborate with team',
  'Upload files & media',
  'Track team progress',
];

const STEPS = [
  'Check your project details',
  'Check the task list',
  'Say hello to your teammates!',
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
          marginBottom="xl"
        >

          {/* Welcome Header */}
          <Box marginBottom="24">
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8 }}>
              Welcome to the Project, Oscar! 🎉
            </Text>
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary }}>
              {"Added by "}
              <Text variant="webLargeLabel" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>James Hammer</Text>
              {" (Project Admin)"}
            </Text>
          </Box>

          {/* Project Identity */}
          <Box marginBottom="24">
            <Text variant="webLabelEmphasized" color="textPrimary" style={{ marginBottom: 4 }}>
              {PROJECT.name}
            </Text>
            <Box flexDirection="row" alignItems="center" gap="4">
              <MapPin size={13} color={TTTheme.colors.grey05} />
              <Text variant="webBody" style={{ color: TTTheme.colors.grey05 }}>{PROJECT.address}</Text>
            </Box>
          </Box>

          {/* Permissions Box */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" marginBottom="24">
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 12 }}>
              <Text variant="webBody" style={{ fontWeight: '600', color: TTTheme.colors.secondaryGreen }}>As a member</Text>
              {", you'll be able to:"}
            </Text>
            {PERMISSIONS.map((perm, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < PERMISSIONS.length - 1 ? 12 : 0 }}>
                <Check size={16} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
                <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary }}>{perm}</Text>
              </Box>
            ))}
          </Box>

          {/* Get Started Steps */}
          <Box paddingHorizontal="sm" marginBottom="24">
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 16, fontWeight: '600' }}>
              🚀 Get started in 3 easy steps:
            </Text>
            {STEPS.map((step, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < STEPS.length - 1 ? 16 : 0 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: TTTheme.colors.grey06, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 16, lineHeight: 18, textAlign: 'center' }}>{i + 1}</Text>
                </View>
                <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary }}>{step}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box paddingTop="12">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/join-project-non-user/project-dashboard')}
            >
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>View Project</Text>
            </Button>
          </Box>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginBottom="xl">
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
            <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Terms & conditions</Text>
            <View style={{ width: 1, height: 16, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Privacy policy</Text>
            <View style={{ width: 1, height: 16, backgroundColor: TTTheme.colors.grey03 }} />
            <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textDecorationLine: 'underline' }}>Contact us</Text>
          </Box>
          <Text variant="webBody" style={{ color: TTTheme.colors.grey05, textAlign: 'center' }}>
            © 2026 Tasktag, Houston, Texas 77001
          </Text>
        </Box>

      </Box>
    </ScrollView>
  );
}
