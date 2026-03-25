import React, { useState } from 'react';
import { Platform } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';
import { Tooltip } from '@/components/Tooltip';
import { Check, Clock, MapPin } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/constants/theme';

// Simulated invite data from token
const INVITE = {
  inviterName: 'James Hammer',
  projectName: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  role: 'editor',
  members: [
    { initials: 'LS', color: '#2e7d7d', name: 'Laura Smith' },
    { initials: 'RK', color: '#5d4037', name: 'Ryan Kim' },
    { initials: 'SS', color: '#e65100', name: 'Sara Singh' },
    { initials: 'MJ', color: '#37474f', name: 'Mike Johnson' },
    { initials: 'AS', color: '#6a1b9a', name: 'Amy Scott' },
  ],
  extraMemberNames: ['Tom Lee', 'Nina Patel', 'Carlos Reyes', 'Fiona Webb', 'James Osei'],
  extraMembers: 5,
};

const ROLE_PERMISSIONS: [string, string][] = [
  ['View and manage tasks', 'Collaborate with team'],
  ['Upload files & media', 'Track project progress'],
];

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const shadowStyle = Platform.select({
    web: { boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any,
    ios: { shadowColor: theme.colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
    android: { elevation: 1 },
  });

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="grey02" padding="lg">
      <Box
        backgroundColor="card"
        width="100%"
        maxWidth={460}
        borderRadius="xl"
        padding="24"
        style={shadowStyle}
      >
        {/* Header */}
        <Text variant="webMetadataPrimary" color="mutedForeground" textAlign="center" marginBottom="20">
          {"You've been invited to this project by "}
          <Text variant="webMetadataPrimary" fontWeight="700" color="foreground">{INVITE.inviterName}</Text>
        </Text>

        {/* Project card */}
        <Box
          backgroundColor="lightMint"
          borderRadius="xl"
          position="relative"
          zIndex="10"
          padding="md"
          marginBottom="20"
        >
          <Text variant="webLabelEmphasized" marginBottom="4">{INVITE.projectName}</Text>
          <Box flexDirection="row" alignItems="center" gap="4" marginBottom="md">
            <MapPin size={14} color={theme.colors.textSecondary} />
            <Text variant="webSecondaryBody" color="mutedForeground">
              {INVITE.address}
            </Text>
          </Box>

          {/* Project Members label */}
          <Text variant="labelMedium" color="mutedForeground" marginBottom="sm">
            Project Members
          </Text>

          {/* Avatar stack */}
          <Box flexDirection="row" alignItems="center">
            {INVITE.members.map((member, index) => (
              <Box
                key={index}
                position="relative"
                zIndex={hoveredIndex === index ? "50" : "10"}
                style={{ marginLeft: index === 0 ? 0 : -8 }}
                {...(Platform.OS === 'web' ? { onMouseEnter: () => setHoveredIndex(index), onMouseLeave: () => setHoveredIndex(null) } as any : {})}
              >
                <Tooltip
                  content={member.name}
                  variant="bottom-center"
                  size="sm"
                  tooltipStyle="default"
                >
                  <Box
                    width={34}
                    height={34}
                    borderRadius="full"
                    backgroundColor="transparent"
                    alignItems="center"
                    justifyContent="center"
                    borderWidth={2}
                    borderColor="lightMint"
                    style={{ backgroundColor: member.color }}
                  >
                    <Text variant="webMetadataSecondary" fontWeight="700" color="white">
                      {member.initials}
                    </Text>
                  </Box>
                </Tooltip>
              </Box>
            ))}

            {/* +N badge */}
            <Box
              position="relative"
              zIndex={hoveredIndex === INVITE.members.length ? "50" : "10"}
              style={{ marginLeft: -8 }}
              {...(Platform.OS === 'web' ? { onMouseEnter: () => setHoveredIndex(INVITE.members.length), onMouseLeave: () => setHoveredIndex(null) } as any : {})}
            >
              <Tooltip
                content={INVITE.extraMemberNames.join('\n')}
                variant="bottom-center"
                size="sm"
                tooltipStyle="default"
              >
                <Box
                  width={34}
                  height={34}
                  borderRadius="full"
                  backgroundColor="white"
                  alignItems="center"
                  justifyContent="center"
                  borderWidth={2}
                  borderColor="lightMint"
                >
                  <Text variant="webMetadataSecondary" fontWeight="600" color="primary">
                    +{INVITE.extraMembers}
                  </Text>
                </Box>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Role permissions */}
        <Box marginBottom="lg" backgroundColor="grey02" padding="md" borderRadius="xl">
          <Text variant="labelMedium" marginBottom="sm">
            {`As an ${INVITE.role}, you'll be able to:`}
          </Text>
          {ROLE_PERMISSIONS.map(([left, right], rowIndex) => (
            <Box key={rowIndex} flexDirection="row" marginBottom="8">
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
          onPress={() => router.push('/prototype/join-project-tt-user/project-dashboard')}
        >
          Accept & Join
        </Button>

        {/* Expiry notice */}
        <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4" marginTop="12">
          <Clock size={13} color={theme.colors.grey05} />
          <Text variant="caption" color="mutedForeground">Invitations expire after 7 days</Text>
        </Box>

      </Box>
    </Box>
  );
}
