import { Box, Text } from '@/components/primitives';
import { router } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

const INVITE_URL =
  'https://app.tasktag.com/invited-user?invitation_token=cee138b6-5bac-4ac4-9087-a4d08edee277&type=task&id=40078';

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
        <Pressable onPress={() => router.push('/prototype/m-join-task-non-user-by-link/join-tasktag')}>
          <Text variant="webMetadataPrimary" color="primary" style={{ textDecorationLine: 'underline', marginBottom: 16 }}>
            {INVITE_URL}
          </Text>
        </Pressable>


      </Box>
    </Box>
  );
}
