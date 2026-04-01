import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { theme as TTTheme } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { router } from 'expo-router';
import { Check, Clock, Hammer, MapPin } from 'lucide-react-native';
import React from 'react';
import { Image as RNImage, Platform, Pressable, ScrollView } from 'react-native';

const TEAM = {
  name: 'Scott 1',
  address: '11 N Raintree Hollow Court',
  members: [
    { type: 'initials' as const, initials: 'LS', color: '#2e7d7d' },
    { type: 'photo'    as const, src: require('@/assets/images/sample-two.jpg') },
    { type: 'initials' as const, initials: 'SS', color: '#e65100' },
    { type: 'photo'    as const, src: require('@/assets/images/sample-four.jpg') },
    { type: 'initials' as const, initials: 'AS', color: '#6a1b9a' },
  ],
  extraMembers: 5,
};

const PERMISSIONS: string[] = [
  'View and manage tasks',
  'Collaborate with team',
  'Upload files & media',
  'Track team progress',
];

export default function MJoinTeamNonUser() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}
    >
      <Box width="100%" maxWidth={480}>

        {/* Logo */}
        <Box marginBottom="lg" marginTop="xl" alignItems="center">
          <RNImage
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120 }}
            resizeMode="contain"
          />
        </Box>

        {/* Card */}
        <Box
          backgroundColor="card"
          borderRadius="xl"
          padding="16"
          marginBottom="sm"
          style={{
            ...Platform.select({
              web: { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' } as any,
              default: { elevation: 4 }
            })
          }}
        >

          {/* Header */}
          <Box marginBottom="20" marginTop="12">
            <Text variant="webLabelSmall" color="mutedForeground" textAlign="center">
              <Text variant="webLabelSmall" fontWeight="700" color="foreground">James Hammer</Text>
              {" invited you to join this team"}
            </Text>
          </Box>

          {/* Team card */}
          <Box backgroundColor="lightMint" borderRadius="lg" padding="md" marginBottom="8">
            <Box
              width={40}
              height={40}
              borderRadius="8"
              alignItems="center"
              justifyContent="center"
              style={{ backgroundColor: TTTheme.colors.purple, marginBottom: 8 }}
            >
              <Hammer size={20} color="#fff" strokeWidth={1.5} />
            </Box>
            <Text variant="webLabelEmphasized" marginBottom="4">{TEAM.name}</Text>
            <Box flexDirection="row" alignItems="center" gap="4" marginBottom="md">
              <MapPin size={14} color={TTTheme.colors.mutedForeground} />
              <Text variant="webSecondaryBody" color="mutedForeground">{TEAM.address}</Text>
            </Box>

            <Text variant="labelMedium" color="mutedForeground" marginBottom="sm">Team Members</Text>

            {/* Avatar stack */}
            <Box flexDirection="row" alignItems="center">
              {TEAM.members.map((member, index) => (
                <Box
                  key={index}
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                >
                  {member.type === 'photo' ? (
                    <RNImage
                      source={member.src}
                      style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: TTTheme.colors.lightMint }}
                    />
                  ) : (
                    <Box
                      width={34} height={34} borderRadius="full"
                      alignItems="center" justifyContent="center"
                      borderWidth={2} borderColor="lightMint"
                      style={{ backgroundColor: member.color }}
                    >
                      <Text variant="webMetadataSecondary" fontWeight="700" color="white">{member.initials}</Text>
                    </Box>
                  )}
                </Box>
              ))}

              {/* +N badge */}
              <Box style={{ marginLeft: -8 }}>
                <Box
                  width={34} height={34} borderRadius="full" backgroundColor="white"
                  alignItems="center" justifyContent="center"
                  borderWidth={2} borderColor="lightMint"
                >
                  <Text variant="webMetadataSecondary" fontWeight="600" color="textSecondary">+{TEAM.extraMembers}</Text>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Permissions */}
          <Box marginBottom="16" backgroundColor="grey02" padding="md" borderRadius="lg">
            <Text variant="labelMedium" marginBottom="8">{"As a member, you'll be able to:"}</Text>
            {PERMISSIONS.map((text, i) => (
              <Box key={i} flexDirection="row" alignItems="center" gap="8" marginBottom="8">
                <Check size={14} color={TTTheme.colors.primary} strokeWidth={2.5} />
                <Text variant="webMetadataPrimary" color="mutedForeground">{text}</Text>
              </Box>
            ))}
          </Box>

          {/* CTA */}
          <Button
            variant="fill"
            color="primary"
            size="xl"
            style={{ width: '100%' }}
            onPress={() => router.push('/prototype/m-join-team-non-user/join-tasktag-signup' as any)}
          >
            Accept & Join Team
          </Button>

          {/* Expiry */}
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4" marginTop="12">
            <Clock size={13} color={TTTheme.colors.grey05} />
            <Text variant="caption" color="mutedForeground">Invitations expire after 7 days</Text>
          </Box>

        </Box>

        {/* Download section */}
        <Box alignItems="center" marginTop="sm">
          <Text variant="h3" marginBottom="sm">Download the app</Text>
          <Text variant="webMetadataPrimary" color="mutedForeground" marginBottom="md" textAlign="center">
            Get the most of Tasktag by installing{'\n'}our new mobile app.
          </Text>
        </Box>

        <Box flexDirection="row" justifyContent="center" gap="12" marginBottom="xl">
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

        <Text variant="caption" textAlign="center" color="mutedForeground">© 2026 Tasktag, Houston, Texas VIC 3000</Text>

      </Box>
    </ScrollView>
  );
}
