import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Box, Text } from '@/components/primitives';
import { Button } from '@/components/Button';
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

const ROLE_PERMISSIONS: string[] = [
  'View and manage tasks',
  'Collaborate with team',
  'Upload files & media',
  'Track project progress',
];

export default function JoinTasktag() {
  const theme = useTheme<Theme>();
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const toggleTooltip = (index: number) => {
    setActiveTooltip(prev => prev === index ? null : index);
  };

  return (
    <Box flex={1} justifyContent="center" backgroundColor="background" paddingHorizontal="16">
      {activeTooltip !== null && (
        <Pressable
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 20 }}
          onPress={() => setActiveTooltip(null)}
        />
      )}
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
          zIndex="30"
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
          <Box flexDirection="row" alignItems="center" style={{ zIndex: 30 }}>
            {INVITE.members.map((member, index) => (
              <View
                key={index}
                style={{ position: 'relative', zIndex: activeTooltip === index ? 50 : 10, marginLeft: index === 0 ? 0 : -8 }}
              >
                <Pressable onPress={() => toggleTooltip(index)}>
                  <Box
                    width={34}
                    height={34}
                    borderRadius="full"
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
                </Pressable>
                {activeTooltip === index && (
                  <View style={{ position: 'absolute', top: 42, left: '50%' as any, transform: [{ translateX: '-50%' as any }], backgroundColor: theme.colors.black, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, zIndex: 999 }} pointerEvents="none">
                    <Text style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular', whiteSpace: 'nowrap' as any }}>{member.name}</Text>
                  </View>
                )}
              </View>
            ))}

            {/* +N badge */}
            <View style={{ position: 'relative', zIndex: activeTooltip === INVITE.members.length ? 50 : 10, marginLeft: -8 }}>
              <Pressable onPress={() => toggleTooltip(INVITE.members.length)}>
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
              </Pressable>
              {activeTooltip === INVITE.members.length && (
                <View style={{ position: 'absolute', top: 42, left: '50%' as any, transform: [{ translateX: '-50%' as any }], backgroundColor: theme.colors.black, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 10, zIndex: 999, width: 'max-content' as any } as any} pointerEvents="none">
                  {INVITE.extraMemberNames.map((name, i) => (
                    <Text key={i} style={{ color: theme.colors.white, fontSize: 12, fontFamily: 'Inter_400Regular', whiteSpace: 'nowrap' as any }}>{name}</Text>
                  ))}
                </View>
              )}
            </View>
          </Box>
        </Box>

        {/* Role permissions */}
        <Box marginBottom="lg" backgroundColor="grey02" padding="md" borderRadius="xl">
          <Text variant="labelMedium" marginBottom="sm">
            {`As an ${INVITE.role}, you'll be able to:`}
          </Text>
          {ROLE_PERMISSIONS.map((item, index) => (
            <Box key={index} flexDirection="row" alignItems="center" gap="8" marginBottom="8">
              <Check size={14} color={theme.colors.primary} strokeWidth={2.5} />
              <Text variant="webMetadataPrimary" color="mutedForeground">{item}</Text>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Button
          variant="fill"
          color="primary"
          size="lg"
          style={{ width: '100%' }}
          onPress={() => router.push('/prototype/m-join-project-tt-user/project-overview')}
        >
          Accept & Join
        </Button>

        {/* Expiry notice */}
        <Box flexDirection="row" alignItems="center" justifyContent="center" gap="4" marginTop="12">
          <Clock size={13} color={theme.colors.grey05} />
          <Text variant="caption" color="mutedForeground">Invitations expire after 7 days</Text>
        </Box>

    </Box>
  );
}
