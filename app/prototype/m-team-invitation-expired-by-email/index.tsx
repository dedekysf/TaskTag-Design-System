import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Clock } from 'lucide-react-native';
import { Image, Pressable, ScrollView, View } from 'react-native';

const TEAM = {
  name: 'Painting Team',
};

export default function MJoinTeamNonUser() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, alignItems: 'center', padding: 12, paddingTop: 32 }}
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
          paddingBottom="24"
          marginBottom="lg"
        >

          {/* Greeting */}
          <Box marginBottom="24">
            <Text variant="h2" style={{ color: TTTheme.colors.textSecondary, marginBottom: 8 }}>
              Hi Oscar 👋,
            </Text>
            <Text variant="webLargeLabel" style={{ color: TTTheme.colors.textSecondary }}>
              <Text variant="webLargeLabel" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>James Hammer</Text>
              {" invited you to join a team on Tasktag"}
            </Text>
          </Box>

          {/* Team Identity */}
          <Box backgroundColor="grey02" borderRadius="xl" padding="md" paddingVertical="24" style={{ marginBottom: 24, borderWidth: 1, borderColor: TTTheme.colors.grey03 }} alignItems="center">
              <ExpoImage
                source={require('@/assets/images/sosa-logo.svg')}
                style={{ width: 120, height: 48, maxWidth: 120, marginBottom: 8 }}
                contentFit="contain"
              />
            <Text variant="h2" color="textPrimary" style={{ marginBottom: 4, textAlign: 'center' }}>
              {TEAM.name}
            </Text>
            <Text variant="webBody" style={{ color: TTTheme.colors.textSecondary, textAlign: 'center' }}>
              {"You'll join as an "}
              <Text variant="webBody" style={{ fontWeight: '600', color: TTTheme.colors.textSecondary }}>Admin</Text>
              {" with\n3 other members."}
            </Text>
          </Box>

          {/* CTA Button */}
          <Box marginBottom="8">
            <Button
              variant="fill"
              size="lg"
              style={{ width: '100%', backgroundColor: TTTheme.colors.secondaryGreen, borderRadius: 8 }}
              onPress={() => router.push('/prototype/m-team-invitation-expired-by-email/invitation-expired' as any)}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: '#fff' }}>Accept & Join Team</Text>
            </Button>
          </Box>

          {/* Expiry */}
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4">
            <Clock size={14} color={TTTheme.colors.foreground} />
            <Text variant="webSecondaryBody" style={{ color: TTTheme.colors.foreground }}>This invite expires in 7 days</Text>
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
