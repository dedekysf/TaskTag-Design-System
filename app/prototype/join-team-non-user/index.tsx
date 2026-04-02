import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { Check, Clock } from 'lucide-react-native';
import React from 'react';
import { Image, Linking, Pressable, ScrollView, View } from 'react-native';

const TEAM = {
  name: 'Painting Team',
};

const PERMISSIONS: string[] = [
  'Manage project and tasks',
  'Invite and remove members',
  'Manage roles & permissions',
  'Configure team settings',
];

export default function JoinTeamNonUser() {
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

          {/* Greeting */}
          <Box marginBottom="16">
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8 }}>
              Hi Oscar 👋,
            </Text>
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary }}>
              <Text variant="webLargeLabel" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>James Hammer</Text>
              {" invited you to join a team"}
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
                style={{ width: 120, height: 72 }}
                contentFit="contain"
              />
            </Box>
            <Text variant="h1" color="textPrimary" style={{ flex: 1 }}>
              {TEAM.name}
            </Text>
          </Box>

          {/* Permissions Box */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" marginBottom="24">
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, marginBottom: 12 }}>
              <Text variant="webBody" style={{ fontWeight: '600', color: TTTheme.colors.secondaryGreen }}>As an admin</Text>
              {", you'll be able to:"}
            </Text>
            {PERMISSIONS.map((perm, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" style={{ marginBottom: i < PERMISSIONS.length - 1 ? 12 : 0 }}>
                <Check size={16} color={TTTheme.colors.secondaryGreen} strokeWidth={2.5} />
                <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary }}>{perm}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box marginBottom="12">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/join-team-non-user/join-tasktag-signup' as any)}
            >
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#fff' }}>Accept & Join Team</Text>
            </Button>
          </Box>

          {/* Expiry */}
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Clock size={14} color={TTTheme.colors.grey05} />
            <Text variant="webBody" style={{ color: TTTheme.colors.grey05 }}>Expires in 7 days</Text>
          </Box>

        </Box>

        {/* Contact */}
        <Box alignItems="center" marginBottom="xl">
          <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, textAlign: 'center', marginBottom: 4, lineHeight: 22 }}>
            Have questions about this invite?
          </Text>
          <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, textAlign: 'center', lineHeight: 22 }}>
            {"Contact James Hammer at "}
            <Text
              variant="webBody"
              style={{ color: TTTheme.colors.blue, textDecorationLine: 'underline', lineHeight: 22 }}
              onPress={() => Linking.openURL('mailto:jammeshammer@gmail.com')}
            >
              jammeshammer@gmail.com
            </Text>
          </Text>
        </Box>

        {/* Divider */}
        <View style={{ height: 1, backgroundColor: TTTheme.colors.grey03, marginBottom: 32 }} />

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
