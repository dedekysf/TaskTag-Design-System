import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Tooltip } from '@/components/Tooltip';
import { theme as TTTheme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { router } from 'expo-router';
import { Check, CircleCheckBig, MapPin, UserCheck } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, Platform, Image as RNImage } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

const TEAM = {
  name: 'Raintree Hollow Court Renovation',
  address: '11 N Raintree Hollow Court',
  members: [
    { type: 'initials' as const, initials: 'LS', color: '#2e7d7d', name: 'Laura Smith' },
    { type: 'initials' as const, initials: 'SS', color: '#e65100', name: 'Sara Singh' },
    { type: 'initials' as const, initials: 'AS', color: '#6a1b9a', name: 'Amy Scott' },
  ],
};

const PERMISSIONS: string[] = [
  'View and manage tasks',
  'Collaborate with team',
  'Upload files & media',
  'Track team progress',
];

export default function EmailApprovalMockup() {
  const theme = useTheme<any>();

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: TTTheme.colors.grey02 }} 
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 12 }}
    >
      <Box width="100%" maxWidth={480}>
        
        {/* Logo */}
        <Box marginBottom="lg" alignItems="center">
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
          style={{
            ...Platform.select({
              web: { boxShadow: '0 4px 20px rgba(0,0,0,0.05)' } as any,
              default: { elevation: 4 }
            })
          }}
        >

          {/* Header Message (Styled like reference index) */}
          <Box marginBottom="20" marginTop="12">
            <Text variant="webBody" color="mutedForeground" textAlign="center">
              <Text variant="webBody" fontWeight="700" color="mutedForeground">Linda Smith</Text>
              {" has been added to this project"}
            </Text>
          </Box>

          {/* Green Box: Team/Project card */}
          <Box backgroundColor="lightMint" borderRadius="lg" padding="md" marginBottom="8">
            <Text variant="webLabelEmphasized" marginBottom="4">{TEAM.name}</Text>
            <Box flexDirection="row" alignItems="center" gap="4">
              <MapPin size={14} color={TTTheme.colors.mutedForeground} />
              <Text variant="webSecondaryBody" color="mutedForeground">{TEAM.address}</Text>
            </Box>
          </Box>

          {/* Grey Box: Permissions Checklist */}
          <Box marginBottom="16" backgroundColor="grey02" padding="md" borderRadius="lg">
            <Text variant="labelMedium" marginBottom="sm">{"As a member, you'll be able to:"}</Text>
            {[
              ['View and manage tasks', 'Collaborate with team'],
              ['Upload files & media', 'Track team progress'],
            ].map(([left, right], i) => (
              <Box key={i} flexDirection="row" marginBottom="8">
                <Box flex={1} flexDirection="row" alignItems="center" gap="8">
                  <Check size={14} color={TTTheme.colors.primary} strokeWidth={2.5} />
                  <Text variant="webMetadataPrimary" color="mutedForeground">{left}</Text>
                </Box>
                <Box flex={1} flexDirection="row" alignItems="center" gap="8">
                  <Check size={14} color={TTTheme.colors.primary} strokeWidth={2.5} />
                  <Text variant="webMetadataPrimary" color="mutedForeground">{right}</Text>
                </Box>
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Button
            variant="fill"
            color="primary"
            size="xl"
            style={{ width: '100%' }}
            onPress={() => router.push('/prototype/join-project-non-user/project-dashboard')}
          >
            View Project
          </Button>

        </Box>

        {/* Download Section */}
        <Box alignItems="center" marginTop="md">
          <Text variant="h3" marginBottom="sm">Download the app</Text>
          <Text variant="webMetadataPrimary" color="mutedForeground" marginBottom="md" textAlign="center">
            Get the most of Tasktag by installing our new mobile app.
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
