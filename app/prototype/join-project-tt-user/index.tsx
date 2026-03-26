import { Button } from '@/components/Button';
import { Box, Text } from '@/components/primitives';

import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

export default function SignUpNonTTUser() {

  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="background" padding="lg">
      <Box width="100%" maxWidth={480}>

        {/* Logo */}
        <Box marginBottom="lg">
          <Image
            source={require('@/assets/images/tasktag-logo.png')}
            style={{ height: 36, width: 120, alignSelf: 'flex-start' }}
            contentFit="contain"
          />
        </Box>

        {/* Invitation text */}
        <Box marginBottom="sm">
          <Text variant="body">
            {'James Hammer invited you to join\nthe '}
            <Text variant="body" fontWeight="700">'Raintree Hollow Court Renovation'</Text>
            {' project on TaskTag'}
          </Text>
        </Box>

        {/* Join Button */}
        <Box marginBottom="lg">
          <Button
            variant="fill"
            color="primary"
            size="lg"
            style={{ alignSelf: 'flex-start' }}
            onPress={() => router.push('/prototype/join-project-tt-user/join-tasktag')}
          >
            Accept & Join Project
          </Button>
        </Box>

        {/* Thanks */}
        <Box>
          <Text variant="body">Thanks,</Text>
          <Text variant="body" marginBottom="xl">TaskTag Team</Text>
        </Box>

        {/* Divider */}
        <Box height={1} backgroundColor="border" marginBottom="lg" />

        {/* Download section */}
        <Box>
          <Text variant="h3" marginBottom="sm">Download the app</Text>
          <Text variant="webSecondaryBody" color="mutedForeground" marginBottom="md">
            Get the most of Tasktag by installing our new mobile app.
          </Text>
        </Box>

        {/* App store badges */}
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

        {/* Footer */}
        <Text variant="caption">© 2026 Tasktag, Houston, Texas VIC 3000</Text>

      </Box>
    </Box>
  );
}
