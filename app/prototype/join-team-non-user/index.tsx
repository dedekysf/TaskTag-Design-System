import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Tooltip } from '@/components/Tooltip';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Check, Clock } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image as RNImage, Platform, Pressable, ScrollView } from 'react-native';

const TEAM = {
  name: 'Houston Construction Team',
  category: 'General Construction Services',
  members: [
    { type: 'initials' as const, initials: 'LS', color: '#2e7d7d', name: 'Laura Smith' },
    { type: 'photo'    as const, src: require('@/assets/images/sample-two.jpg'), name: 'Rachel Monroe' },
    { type: 'initials' as const, initials: 'SS', color: '#e65100', name: 'Sara Singh' },
    { type: 'photo'    as const, src: require('@/assets/images/sample-four.jpg'), name: 'Amy Lee' },
    { type: 'initials' as const, initials: 'AS', color: '#6a1b9a', name: 'Amy Scott' },
  ],
  extraMemberNames: ['Tom Lee', 'Nina Patel', 'Carlos Reyes', 'Fiona Webb', 'James Osei'],
  extraMembers: 5,
};

const PERMISSIONS: [string, string][] = [
  ['View and manage tasks', 'Collaborate with team'],
  ['Upload files & media', 'Track team progress'],
];

export default function JoinTeamNonUser() {
  const theme = useTheme<Theme>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.grey02 }}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
    >
      <Box width="100%" maxWidth={480}>

        {/* Logo */}
        <Box marginBottom="lg" alignItems="center">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120 }}
            contentFit="contain"
          />
        </Box>

        {/* Card */}
        <Box backgroundColor="card" borderRadius="xl" padding="24" marginBottom="lg">

          {/* Header */}
          <Text variant="webMetadataPrimary" color="mutedForeground" textAlign="center" marginBottom="20">
            {"You've been invited to this team by "}
            <Text variant="webMetadataPrimary" fontWeight="700" color="foreground">James Hammer</Text>
          </Text>

          {/* Team card */}
          <Box backgroundColor="lightMint" borderRadius="xl" padding="md" marginBottom="20">
            <Text variant="webLabelEmphasized" marginBottom="4">{TEAM.name}</Text>
            <Text variant="webSecondaryBody" color="mutedForeground" marginBottom="md">{TEAM.category}</Text>

            <Text variant="labelMedium" color="mutedForeground" marginBottom="sm">Team Members</Text>

            {/* Avatar stack */}
            <Box flexDirection="row" alignItems="center">
              {TEAM.members.map((member, index) => (
                <Box
                  key={index}
                  position="relative"
                  zIndex={hoveredIndex === index ? "50" : "10"}
                  style={{ marginLeft: index === 0 ? 0 : -8 }}
                  {...(Platform.OS === 'web' ? { onMouseEnter: () => setHoveredIndex(index), onMouseLeave: () => setHoveredIndex(null) } as any : {})}
                >
                  <Tooltip content={member.name} variant="bottom-center" size="sm" tooltipStyle="default">
                    {member.type === 'photo' ? (
                      <RNImage
                        source={member.src}
                        style={{ width: 34, height: 34, borderRadius: 17, borderWidth: 2, borderColor: theme.colors.lightMint }}
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
                  </Tooltip>
                </Box>
              ))}

              {/* +N badge */}
              <Box
                position="relative"
                zIndex={hoveredIndex === TEAM.members.length ? "50" : "10"}
                style={{ marginLeft: -8 }}
                {...(Platform.OS === 'web' ? { onMouseEnter: () => setHoveredIndex(TEAM.members.length), onMouseLeave: () => setHoveredIndex(null) } as any : {})}
              >
                <Tooltip content={TEAM.extraMemberNames.join('\n')} variant="bottom-center" size="sm" tooltipStyle="default">
                  <Box
                    width={34} height={34} borderRadius="full" backgroundColor="white"
                    alignItems="center" justifyContent="center"
                    borderWidth={2} borderColor="lightMint"
                  >
                    <Text variant="webMetadataSecondary" fontWeight="600" color="primary">+{TEAM.extraMembers}</Text>
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Permissions */}
          <Box marginBottom="lg" backgroundColor="grey02" padding="md" borderRadius="xl">
            <Text variant="labelMedium" marginBottom="sm">{"As a member, you'll be able to:"}</Text>
            {PERMISSIONS.map(([left, right], i) => (
              <Box key={i} flexDirection="row" marginBottom="8">
                <Box flex={1} flexDirection="row" alignItems="center" gap="8">
                  <Check size={14} color={theme.colors.primary} strokeWidth={2.5} />
                  <Text variant="webMetadataPrimary" color="mutedForeground">{left}</Text>
                </Box>
                <Box flex={1} flexDirection="row" alignItems="center" gap="8">
                  <Check size={14} color={theme.colors.primary} strokeWidth={2.5} />
                  <Text variant="webMetadataPrimary" color="mutedForeground">{right}</Text>
                </Box>
              </Box>
            ))}
          </Box>

          {/* CTA */}
          <Button
            variant="fill"
            color="primary"
            size="lg"
            style={{ width: '100%' }}
            onPress={() => router.push('/prototype/join-team-non-user/join-tasktag' as any)}
          >
            Accept & Join Team
          </Button>

          {/* Expiry */}
          <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4" marginTop="12">
            <Clock size={13} color={theme.colors.grey05} />
            <Text variant="caption" color="mutedForeground">Invitations expire after 7 days</Text>
          </Box>

        </Box>

        {/* Download section */}
        <Box>
          <Text variant="h3" marginBottom="sm">Download the app</Text>
          <Text variant="webSecondaryBody" color="mutedForeground" marginBottom="md">
            Get the most of Tasktag by installing our new mobile app.
          </Text>
        </Box>

        <Box flexDirection="row" gap="12" marginBottom="xl">
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Image
              source={require('@/assets/images/app-store.svg')}
              style={{ width: 140, height: 44 }}
              contentFit="contain"
            />
          </Pressable>
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Image
              source={require('@/assets/images/play-store.svg')}
              style={{ width: 148, height: 44 }}
              contentFit="contain"
            />
          </Pressable>
        </Box>

        <Text variant="caption">© 2026 Tasktag, Houston, Texas VIC 3000</Text>

      </Box>
    </ScrollView>
  );
}
