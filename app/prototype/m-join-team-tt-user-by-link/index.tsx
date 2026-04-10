import { Box, Text } from '@/components/primitives';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const INVITE_URL =
  'https://app.tasktag.com/my-account/subscriptionPlanDetail/2cae243f-5f17-48ef-bc20-c53a6ede11bf/TeamDetails';

export default function InviteLinkEntry() {
  return (
    <Box flex={1} justifyContent="center" alignItems="center" backgroundColor="grey02" padding="lg">
      <Box
        backgroundColor="card"
        borderRadius="xl"
        paddingHorizontal="16"
        paddingVertical="24"
        width="100%"
        style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0px 1px 3px 0px' } as any}
      >
        <Text variant="webLabelEmphasized" color="foreground" marginBottom="12">
          Please click this link
        </Text>
        <Pressable onPress={() => router.push('/prototype/m-join-team-tt-user-by-link/request-to-join')}>
          <Text variant="webMetadataPrimary" color="primary" style={{ textDecorationLine: 'underline', marginBottom: 16 }}>
            {INVITE_URL}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
}
