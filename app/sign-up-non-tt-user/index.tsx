import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';
import { Theme } from '@/constants/theme';
import { useTheme } from '@shopify/restyle';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function SignUpNonTTUser() {
  const theme = useTheme<Theme>();

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="background" padding="lg">
      <Box style={{ width: '100%', maxWidth: 480 }}>

        {/* Logo */}
        <Box marginBottom="lg">
          <Image
            source={require('@/assets/images/ttlogo.png')}
            style={{ height: 36, width: 120, alignSelf: 'flex-start' }}
            contentFit="contain"
          />
        </Box>

        {/* Invitation text */}
        <Text variant="body" marginBottom="sm">
          <Text variant="body" style={{ fontWeight: '700' }}>James Hammer</Text>
          {' invited you to join the '}
          <Text variant="body" style={{ fontWeight: '700' }}>'Raintree Hollow Court Renovation'</Text>
          {' project on '}
          <Text variant="body" color="primary" style={{ fontWeight: '700' }}>TaskTag</Text>
        </Text>

        {/* Join Button */}
        <Button
          variant="fill"
          color="primary"
          size="lg"
          style={{ alignSelf: 'flex-start', marginBottom: theme.spacing.lg }}
          onPress={() => router.push('/sign-up-non-tt-user/join-tasktag')}
        >
          Join Tasktag
        </Button>

        {/* Thanks */}
        <Text variant="body">Thanks,</Text>
        <Text variant="body" marginBottom="xl">TaskTag Team</Text>

        {/* Divider */}
        <Box style={{ height: 1 }} backgroundColor="border" marginBottom="lg" />

        {/* Download section */}
        <Text variant="h3" marginBottom="sm">Download the app</Text>
        <Text variant="webSecondaryBody" color="mutedForeground" marginBottom="md">
          Get the most of Tasktag by installing our new mobile app.
        </Text>

        {/* App store badges */}
        <Box flexDirection="row" style={{ gap: theme.spacing['12'] }} marginBottom="xl">
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Image
              source={require('@/assets/images/app_store.svg')}
              style={{ width: 140, height: 44 }}
              contentFit="contain"
            />
          </Pressable>
          <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}>
            <Image
              source={require('@/assets/images/playstore.svg')}
              style={{ width: 148, height: 44 }}
              contentFit="contain"
            />
          </Pressable>
        </Box>

        {/* Footer */}
        <Text variant="caption">© 2026 Tasktag, Houston, Texas VIC 3000</Text>

      </Box>
    </Box>
  );
}
